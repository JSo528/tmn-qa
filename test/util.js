var express = require('express');
var app = express();
var fs = require('fs');
var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var constants = require('../lib/constants.js');
var Promise = require('selenium-webdriver').promise;
var By = require('selenium-webdriver').By;
var TestRun = require('../models/test_run.js');
var dbConnect = require('../models/db_connect.js');
var Browser = require('../pages/base/browser.js');

function importTest(path) {
  test.describe('', function() {
    require(path);
  });
};  

function writeScreenshot(callback) {
  var screenshotPath = 'public/data/'+testRun.id+'/';
  var fileName = new Date().getTime() + '.png';
  var locator = By.id('main');
  var element = driver.findElement(locator);

  driver.manage().window().maximize();
    
  element.getSize().then(function(size) {
    driver.manage().window().setSize(size.width, size.height)
  })
  
  driver.takeScreenshot().then(function(data) {
    fs.writeFileSync(screenshotPath + fileName, data, 'base64');
    driver.getCurrentUrl().then(function(url) {
      callback({
        url: url,
        name: fileName
      })
    })
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
      d = Promise.defer();
      testRun.update({endedAt: new Date().getTime(), status: "finished"}).exec(function() {
        d.fulfill(true);
      });
      driver.quit();
      return d.promise;
    });   

    test.afterEach(function() {
      var t = this.currentTest;

      // Object.keys(t.ctx).forEach(function(key,index) {
      //   console.log(key)
      // });

      // console.log(Object.getOwnPropertyNames(t.parent))

      // console.log("*****")
      // console.log(t)
      // console.log("*****")


      if (t.state == 'failed') {
        failedCount += 1;
        var imgFiles = []

        function updateTestRun() {
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
          testRun.update(updateObj).exec();
        }

        if (browser.tabHandles.length == 2) {
          browser.executeForEachTab(function() {
            writeScreenshot(function(fileObject) {
              imgFiles.push(fileObject);  
            }); 
          }).then(function() {
            updateTestRun();
          })
        } else {
          writeScreenshot(function(fileObject) {
            imgFiles.push(fileObject);
            updateTestRun();
          }); 
        }
      } else if (t.state == 'passed'){
        passedCount += 1;
        testRun.update({passedCount: passedCount}).exec();
      }
    });

    testFiles.forEach(function(file) {
      importTest(file);
    });
  });
};
