'use strict';

// Load Base Page
var BasePage = require('./base_page.js')

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Promise = require('selenium-webdriver').promise;

function Browser(driver) {
  BasePage.call(this, driver);

  this.tabHandles = [];
};

Browser.prototype = Object.create(BasePage.prototype);
Browser.prototype.constructor = Browser;

/*  This function should only be ran from a staging test.
 *  Should be same to assume that the 1st tab will always be the staging tab and the 2nd tab will be the production tab.
 *  Function adds a hyperlink to page that opens up new url in new tab. Selenium doesn't have a prebuilt open tab method.
 */
Browser.prototype.openNewTab = function(url) {
  var d = Promise.defer();
  var thiz = this;
  var script = `var a = document.createElement('a');
    a.href = '${url}';
    a.target = '_blank';
    a.id = "newLink";
    document.body.appendChild(a);
    a.click();
    a.remove();`

  this.driver.executeScript(script).then(function() {
    thiz.setTabHandles().then(function() {
      d.fulfill(true);
    })
  })
  return d.promise;
};

Browser.prototype.setTabHandles = function() {
  var d = Promise.defer();
  var thiz = this;
  this.driver.getAllWindowHandles().then(function(handles) {
    thiz.tabHandles = handles;
    d.fulfill(thiz.tabHandles);
  })
  return d.promise;
};

/* @params
 *  tab <Number> : numbered tab starting at 0
 */
Browser.prototype.switchToTab = function(tab) {
  return this.driver.switchTo().window(this.tabHandles[tab]);  
};

Browser.prototype.getFullContent = function(locator) {
  locator = locator || By.id("content");

  return this.getText(locator, 30000)
};

/* @params
 *  locator <Locator> : locator that houses the text we want to get
 *  lastLocator <Locator> : locator that finishes loading last. Function waits until
 *    this finishes loading before getting text
 */
Browser.prototype.getFullContentForEachTab = function(locator, lastLocator) {
  var d = Promise.defer();
  if(this.tabHandles.length == 2) {
    if(lastLocator) { this.waitForEnabled(lastLocator, 30000); }
    var contentData = [];
    this.switchToTab(0);
    this.getFullContent(locator).then(function(content) {
      contentData.push(content);
    });
    this.switchToTab(1);
    this.getFullContent(locator).then(function(content) {
      contentData.push(content);
      d.fulfill(contentData);
    });  
  } else {
    d.fulfill(null);
  }
  return d.promise;
};

/* @params
 *  command <function> : function gets run in each of the tabs
 */
Browser.prototype.executeForEachTab = function(command) {
  var d = Promise.defer();
  var thiz = this;
  
  this.switchToTab(0).then(function() {
    command();
  }).then(function() {
    thiz.switchToTab(1)  
  }).then(function() {
    command()  
  }).then(function() {
    d.fulfill();
  })
    
  return d.promise;
}

module.exports = Browser;