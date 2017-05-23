var app = require('express')();
var fs = require('fs');
var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var constants = require('../lib/constants.js');
var Promise = require('selenium-webdriver').promise;
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var TestRun = require('../models/test_run.js');
var TestRunQueue = require('../models/test_run_queue.js');
var dbConnect = require('../models/db_connect.js');
var Browser = require('../pages/base/browser.js');
var request = require('request');
var scripts = require('../lib/scripts.js')
var fileTimestamps = {}

dbConnect.connect(app.get('env'));

function importTest(path) {
  var timeStart;
  test.describe('', function() {
    test.before(function() {
      timeStart = Date.now();
    });

    require(path);

    test.after(function() {
      var minElapsed = (Date.now() - timeStart) / (1000 * 60);
      fileTimestamps[path] = minElapsed
    });
  });
};  

// TODO - instead of calling updateRun twice, figure out how to catch errors here
function writeScreenshot() {
  var d = Promise.defer();
  var screenshotPath = 'public/data/'+process.env.TEST_RUN_ID+'/';
  var fileName = testRunQueue.queue + "_"+ new Date().getTime() + '.png';
  var locator = scripts.metadata[process.env.TEST_NUMBER].screenshotLocator;
  var maxWidth = constants.screenSize.maxWidth;
  var maxHeight = constants.screenSize.maxHeight;
  var height, element;

  driver.wait(Until.elementLocated(locator), 5000).then(function() {
    // set size of window
    element = driver.findElement(locator);
    driver.manage().window().setSize(maxWidth, maxHeight);
    return element.getSize().then(function(size) {
      height = size.height + 100;
      return element.getLocation();
    }).then(function(location) {
      height += location.y;
      height = (height > maxHeight) ? maxHeight : height;
      driver.manage().window().setSize(maxWidth, height);
      return driver.takeScreenshot();
    });
  }, function() {
    driver.manage().window().setSize(maxWidth, maxHeight);
    return driver.takeScreenshot();
  }).then(function(data) {
    fs.writeFileSync(screenshotPath + fileName, data, 'base64');
    return driver.getCurrentUrl();
  }).then(function(currentUrl) {
    d.fulfill({
      url: currentUrl,
      name: fileName
    })
  })

  return d.promise;
}

function insertImgFiles(imgFiles) {
  TestRunQueue.findById(testRunQueue.id).exec()
    .then(function(doc) {
      testRunQueue = doc;
      var i = testRunQueue.errorObjects.length;
      testRunQueue.errorObjects[i-1].imgFiles = imgFiles;
      testRunQueue.update({errorObjects: testRunQueue.errorObjects}).exec();
    })
}

function runGarbageCollection() {
  if (process.memoryUsage().rss > 500000000) {
    console.log("** pre gc - " + process.memoryUsage().rss)
    if (global.gc) {
      global.gc()  
      console.log("** post gc - " + process.memoryUsage().rss)
    } else {
      console.log('Garbage collection unavailable. Pass -gc when running mocha to enable forced garbage collection');
    }   
  }
}

function generateTests() {
  test.describe(process.env.TITLE, function() {
    var passedCount = 0;
    var failedCount = 0;
    var maxWidth = constants.screenSize.maxWidth;
    var maxHeight = constants.screenSize.maxHeight;

    this.timeout(constants.timeOuts.mocha);  
    this.retries(0);    

    test.before(function() {
      var d = Promise.defer();
      TestRunQueue.findById(process.env.TEST_RUN_QUEUE_ID).exec()
        .then(function(doc) {
          testRunQueue = doc;
          driver = new webdriver.Builder().withCapabilities({'browserName': 'chrome'}).build();
          driver.manage().window().setSize(maxWidth, maxHeight);
          browser = new Browser(driver);
          url = process.env.START_URL;

          d.fulfill(true)
        })

      return d.promise;
    })

    var requiredFiles = scripts.metadata[process.env.TEST_NUMBER].requiredFiles;
    if (requiredFiles) {
      requiredFiles.forEach(function(file) {
        importTest(file);
      });      
    }

    process.env.FILES.split(",").forEach(function(file) {
      importTest(file);
    });

    // HACK - I needed a way to tell if mocha finished all tests or if the test suite ended prematurely
    // since this is the last test
    test.describe('Last Test', function() {
      test.it('update testRunQueue object', function() {
        var d = Promise.defer();
        // this accounts for the times when we kill a test
        TestRunQueue.findById(process.env.TEST_RUN_QUEUE_ID).then(function(doc) {
          if (doc.endedAt == undefined && doc.status == "ongoing") {
            doc.update({endedAt: new Date().getTime(), status: "finished"}).then(function() {
              d.fulfill(true);
            });
          } else {
            d.fulfill(true);
          }
        });

        return d.promise;
      });  
    });

    test.after(function() {
      var d = Promise.defer();

      console.log("*********************************************")
      console.log("********** ### FILE TIMESTAMPS ### **********")
      for (var path in fileTimestamps) {
        console.log("** " + path + " - " + Math.round(fileTimestamps[path] * 10) / 10);
      }
      console.log("*********************************************")
      
      driver.quit().then(function() {        
        return TestRunQueue.findById(process.env.TEST_RUN_QUEUE_ID).exec();
      }).then(function(doc) {
        if (doc.endedAt == undefined && doc.status == "ongoing") {
          doc.update({endedAt: new Date().getTime(), status: "error"}).then(function() {
            d.fulfill(true);
          });
        } else {
          d.fulfill(true);  
        }
      })
      
      return d.promise;
    });  

    test.afterEach(function() {
      this.timeout(120000)
      runGarbageCollection();

      var maxChars = constants.errorObjects.maxChars;
      var t = this.currentTest;

      if (t.state == 'failed') {
        failedCount += 1;
        var imgFiles = []

        var expectedValue = t.err.expected;
        var actualValue = t.err.actual;
        var errorMessage = t.err.message;
        var stack = t.err.stack;

        if (String(expectedValue).length > maxChars) {
          expectedValue = String(expectedValue).substr(0,maxChars) + ' ...'
        } 

        if (String(actualValue).length > maxChars) {
          actualValue = String(actualValue).substr(0,maxChars) + ' ...'
        }

        if (errorMessage.length > maxChars) {
          errorMessage = errorMessage.substr(0,maxChars) + ' ...'
        }

        if (t.err.stack.length > maxChars) {
          stack = t.err.stack.substr(0,maxChars) + ' ...'
        }

        // This needs to run before in case theres an error in writeScreenshot
        // Can't seem to catch certain webdriver errors
        testRunQueue.update({
          failedCount: failedCount,
          $push: {
            errorObjects: {
              title: t.title,
              fullTitle: t.parent.fullTitle(),
              errorType: t.err.name,
              errorMessage: errorMessage,
              expectedValue: expectedValue,
              actualValue: actualValue,
              stack: stack,
              imgFiles: imgFiles
            }
          }
        }).exec();

        console.log("errName:" + t.err.name);
        console.log("errMessage:" + t.err.message);
        if (t.err.name == 'WebDriverError' && t.err.message.includes('chrome not reachable')) {
          console.log("** CHROME NOT REACHABLE **")
          driver.quit()
          driver = new webdriver.Builder().withCapabilities({'browserName': 'chrome'}).build();
          browser = new Browser(driver);
        }
        
        if (browser.tabHandles.length == 2) {
          browser.executeForEachTab(function() {
            writeScreenshot().then(function(fileObject) {
              imgFiles.push(fileObject);  
            }); 
          }).then(function() {
            insertImgFiles(imgFiles);
          })
        } else {
          writeScreenshot().then(function(fileObject) {
            imgFiles.push(fileObject);  
            insertImgFiles(imgFiles);
          }); 
        }
      } else if (t.state == 'passed'){
        passedCount += 1;
        testRunQueue.update({passedCount: passedCount}).exec();
      }
    });
  })
}

generateTests();