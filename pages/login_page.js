'use strict';

// Load Base Page
var BasePage = require('../pages/base/base_page.js')

// Webdriver helpers
var Promise = require('selenium-webdriver').promise;
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;

// Locators
var EMAIL_INPUT = By.id('username');
var PASSWORD_INPUT = By.id('password');
var LOGIN_BUTTON = By.id('login');
var BODY_TAG = By.tagName('body');


/**
 * Constructor for the Login Page
 * Hooks up the Webdriver holder in the base page allowing to call this.driver in page objects
 * @param webdriver
 * @constructor
 */
function LoginPage(driver) {
  BasePage.call(this, driver);
};

// sets the prototype for LoginPage & sets the constructor method
LoginPage.prototype = Object.create(BasePage.prototype);
LoginPage.prototype.constructor = LoginPage;


/**
 * Login function for all sites
 * need to check that the login button is enabled before inputting fields otherwise the page will occassionaly hang
 * @param {String, String}
 * @returns {Promise}
 */
LoginPage.prototype.login = function(email, password) {
  var defer = Promise.defer();
  var thiz = this;

  this.sendKeys(EMAIL_INPUT, email, 30000)
  this.sendKeys(PASSWORD_INPUT, password, 30000)
  this.click(LOGIN_BUTTON)
    
  this.driver.wait(Until.stalenessOf(this.driver.findElement(BODY_TAG)), 30000).then(function() {
    console.log('Login submitted');
    return defer.fulfill(true);
  }, function(){
    // essentially a retry on the login
    // this method occasionally tries to enter text too early which the login page doesn't accept
    console.log('Login failed to submit');
    thiz.sendKeys(EMAIL_INPUT, email);
    thiz.sendKeys(PASSWORD_INPUT, password);
    thiz.click(LOGIN_BUTTON);
    return thiz.driver.wait(Until.stalenessOf(thiz.driver.findElement(BODY_TAG)), 10000);
  })
  return defer.promise;
};

module.exports = LoginPage;