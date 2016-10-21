var fs = require('fs');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var constants = require('../../lib/constants.js');
var webdriver = require('selenium-webdriver');
var jsonfile = require('jsonfile');
var Promise = require('selenium-webdriver').promise;
var TestRun = require('../../models/test_run.js');
var mongoose = require('mongoose'); 
var opts = { server: { socketOptions: { keepAlive: 1 } } }; 

test.describe('Test File', function() {
  this.timeout(constants.timeOuts.mocha);  
  this.retries(4);

  test.before(function() {
    var d = Promise.defer();
    mongoose.connect("mongodb://jason:trumedia@ds061506.mlab.com:61506/qa_development", opts); 
    TestRun.findById("5806dcf90a2512565e8f9dfe", function(err, testRunObject) {
      testRun = testRunObject;
      url = "https://dodgers-staging.trumedianetworks.com:" + testRun.portNumber
      console.log("*** 1 ***")
      d.fulfill(true)
    });
    driver = new webdriver.Builder().withCapabilities({'browserName': 'chrome'}).build();
    return d.promise;
  });

  test.describe('#Login Page', function() {
    test.before(function() {
      var LoginPage = require('../../pages/login_page.js');
      loginPage = new LoginPage(driver);
    });

    test.it('starts at login page', function() {
      loginPage.visit(url);
      
      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /auth\/loginPage/, 'Correct URL');
      });
    });

    test.it('able to login', function() {
      loginPage.login(constants.testUser.email, constants.testUser.password);
      driver.getCurrentUrl().then(function(url) {
        assert.notMatch(url, /auth\/loginPage/, 'Correct URL');
      });
    });
  });


  test.after(function() {
    driver.quit();
    TestRun.update({ _id: testRun.id }, 
      {  
        finishedAt: new Date().getTime(),
        status: "finished"
      }).exec();
  });   
})