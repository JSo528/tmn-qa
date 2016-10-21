var express = require('express');
var app = express();
var fs = require('fs');
var test = require('selenium-webdriver/testing');
var constants = require('../lib/constants.js');
var webdriver = require('selenium-webdriver');
var Promise = require('selenium-webdriver').promise;
var TestRun = require('../models/test_run.js');

exports.importTest = function(name, path) {
  test.describe(name, function() {
    require(path);
  });
};

exports.importTestSetup = function(thiz, startUrl) {
  var passedCount = 0;
  var failedCount = 0;
  thiz.timeout(constants.timeOuts.mocha);  
  thiz.retries(4);

  test.before(function() {
    var dbConnect = require('../models/db_connect.js');
    dbConnect.connect(app.get('env'));
    TestRun.findById(process.env.TEST_RUN_ID, function(err, testRunObject) {
      console.log("** 1 **");
      testRun = testRunObject;
    });
    driver = new webdriver.Builder().withCapabilities({'browserName': 'chrome'}).build();
  });

  test.after(function() {
    driver.quit();
    testRun.update({endedAt: new Date().getTime(), status: "finished"}).exec();
  });   

  test.afterEach(function() {
    var t = this.currentTest;
    if (t.state == 'failed') {
      driver.takeScreenshot().then(function (data) { 
        var fileName = writeScreenshot(data); 
        failedCount += 1;

        var updateObj = {
          failedCount: failedCount,
          $push: {
            errorObjects: {
              title: t.title,
              fullTitle: t.parent.fullTitle(),
              errorType: t.err.name,
              errorMessage: t.err.message,
              stack: t.err.stack,
              imgFile: fileName
            }
          }
        };
        testRun.update(updateObj).exec();
      });
    } else if (t.state == 'passed'){
      passedCount += 1;
      testRun.update({passedCount: passedCount}).exec();
    }
  });

  function writeScreenshot(data) {
    // TODO - figure out how to do a full page screenshot
    driver.manage().window().maximize();

    var screenshotPath = 'public/data/'+testRun.id+'/';
    var fileName = new Date().getTime() + '.png';

    fs.writeFileSync(screenshotPath + fileName, data, 'base64');

    return fileName;
  }
};