var express = require('express');
var app = express();
var fs = require('fs');
var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var constants = require('../lib/constants.js');
var Promise = require('selenium-webdriver').promise;
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var TestRun = require('../models/test_run.js');
var dbConnect = require('../models/db_connect.js');
var Browser = require('../pages/base/browser.js');

function importTest(path) {
  test.describe('', function() {
    require(path);
  });
};  

// TODO - instead of calling updateRun twice, figure out how to catch errors here
function writeScreenshot(callback) {
  var screenshotPath = 'public/data/'+testRun.id+'/';
  var fileName = new Date().getTime() + '.png';
  var locator = By.id('main');
  console.log("** ws 1 **")
  driver.wait(Until.elementLocated(locator), 5000).then(function() {
    console.log("** ws 2 **")
    var element = driver.findElement(locator);
  
    driver.manage().window().maximize().then(function() {
      console.log("** window maximize success")
    }, function(err) {
      console.log("** window maximize error: " + err)
    })
    element.getSize().then(function(size) {
      console.log("** ws 3 **")
      var height;
      if (size.height > 3000) {
        height = 3000;
      } else {
        height = size.height
      }

      driver.manage().window().setSize(1920, height).then(function() {
        console.log("** setSize success")
      }, function(err) {
        console.log("** setSize error: "+err)
      })
      console.log("** ws 3b **")
    })

    driver.takeScreenshot().then(function(data) {
      console.log("** ws 4a **")
      fs.writeFileSync(screenshotPath + fileName, data, 'base64');
      console.log("** ws 4b **")
      driver.getCurrentUrl().then(function(currentUrl) {
        console.log("** ws 4c **")
        callback({
          url: currentUrl,
          name: fileName
        })
      })
    }, function(err) {
      console.log("** ws 4aa **")
      console.log(err)
    })
  }, function(err) {
    console.log("** ws 5 **")
    console.log(err)
    driver.takeScreenshot().then(function(data) {
      fs.writeFileSync(screenshotPath + fileName, data, 'base64');
      driver.getCurrentUrl().then(function(currentUrl) {
        callback({
          url: currentUrl,
          name: fileName
        })
      })
    }, function(err) {
      console.log("** ws 4ab **")
      console.log(err)
    })
  })
}

// TODO - figure out a better way to update the imgFiles on the testRun object
function updateTestRun(imgFiles) {
  // better way to refresh an object?
  TestRun.findById(testRun.id, function(err, newObj) {
    testRun = newObj;
    var i = testRun.errorObjects.length;
    testRun.errorObjects[i-1].imgFiles = imgFiles
    testRun.update({errorObjects: testRun.errorObjects}).exec()
  })
}

exports.generateTests = function(title, testFiles, startUrl) {
  test.describe(title, function() {
    var passedCount = 0;
    var failedCount = 0;

    this.timeout(constants.timeOuts.mocha);  
    this.retries(0);

    test.before(function() {
      dbConnect.connect(app.get('env'));
      TestRun.findById(process.env.TEST_RUN_ID, function(err, testRunObject) {
        testRun = testRunObject;
      });

      driver = new webdriver.Builder().withCapabilities({'browserName': 'chrome'}).build();
      browser = new Browser(driver);
      url = startUrl;
    });

    test.after(function() {
      console.log("** AFTER ALL **")
      var d = Promise.defer();
      driver.quit().then(function() {
        console.log("** driver quit")        
      }, function(err) {
        console.log("** driver quit error")        
        console.log(err)
      }).then(function() {
        console.log("** after then")        
        TestRun.findById(process.env.TEST_RUN_ID, function(err, testRunObject) {
          testRun = testRunObject;
          if (testRun.endedAt == undefined && testRun.status == "ongoing") {
            testRun.update({endedAt: new Date().getTime(), status: "error"}).exec(function() {
              d.fulfill(true);
            });
          } else {
            d.fulfill(true);  
          }
        });
      })
      
      return d.promise;
    });   

    test.afterEach(function() {
      var t = this.currentTest;

      if (t.state == 'failed') {
        failedCount += 1;
        var imgFiles = []

        // This needs to run before in case theres an error in writeScreenshot
        // Can't seem to catch certain webdriver errors
        console.log("** update obj **")
        var updateObj = {
          failedCount: failedCount,
          $push: {
            errorObjects: {
              title: t.title,
              fullTitle: t.parent.fullTitle(),
              errorType: t.err.name,
              errorMessage: t.err.message,
              expectedValue: t.err.expected,
              actualValue: t.err.actual,
              stack: t.err.stack,
              imgFiles: imgFiles
            }
          }
        };
        testRun.update(updateObj).exec()

        // if (t.err.name == 'WebDriverError' && t.err.message.includes('chrome not reachable')) {
        
        if (browser.tabHandles.length == 2) {
          browser.executeForEachTab(function() {
            writeScreenshot(function(fileObject) {
              imgFiles.push(fileObject);  
            }); 
          }).then(function() {
            updateTestRun(imgFiles);
          })
        } else {
          writeScreenshot(function(fileObject) {
            imgFiles.push(fileObject);
            updateTestRun(imgFiles);
          }); 
        }
      } else if (t.state == 'passed'){
        passedCount += 1;
        testRun.update({passedCount: passedCount}).exec();
      }

      if (process.memoryUsage().rss > 300000000) {
        console.log("** pre gc - " + process.memoryUsage().rss)
        if (global.gc) {
          global.gc()  
          console.log("** post gc - " + process.memoryUsage().rss)
        } else {
          console.log('Garbage collection unavailable. Pass -gc when running mocha to enable forced garbage collection');
        }   
      }
    });

    testFiles.forEach(function(file) {
      importTest(file);
    });

    // HACK - I needed a way to tell if mocha finished all tests or if the test suite ended prematurely
    // since this is the last test
    test.describe('Last Test', function() {
      test.it('update testRun object', function() {
        testRun.update({endedAt: new Date().getTime(), status: "finished"}).exec()
      })  
    })
  });
};