'use strict';

var Promise = require('selenium-webdriver').promise;
var Until = require('selenium-webdriver').until;
var Key = require('selenium-webdriver').Key;

var WAIT_TIME_PRESENT = 10000;
var WAIT_TIME_BEFORE_RETRY = 500;

// Internal debug
var debug = false;

/**
 * Base constructor for a pageobject
 * Takes in a WebDriver object
 * Sets the Webdriver holder in the base page surfacing this to child page objects
 * @param webdriver
 * @constructor
 */
function BasePage(webdriver) {
  this.driver = webdriver;
};

/**
 * Opens the specified url
 * @param url
 * @returns BasePage
 */
BasePage.prototype.visit = function(url) {
    this.driver.get(url);
    return this;
};


/**
 * Our own implementation of waitFor methods
 * General guidelines:
 * - Use explicit wait instead of built-in implicit waits to allow better debugging and development
 * - Always poll for Element stability first before getting the state of the elements (enabled / visible)
 * - Always allow exception propagation to the test runner, try your best to avoid running into the below
 *      mocha Error: the error {} was thrown, throw an Error :)
 *
 */

/**
 * Waits for the element + check if the element is displayed and takes an override timeout in ms
 *  - Waits until the element is located in the DOM, fail if not found
 *  - Waits for the element to become visible, fail if not visible
 * Returns promise of isDisplayed() which can be resolved to a boolean value
 * @param locator
 * @param timeout
 * @returns Promise
 */
BasePage.prototype.waitForDisplayed = function(locator, timeout) {
    timeout = timeout || WAIT_TIME_PRESENT;
    var defer = Promise.defer();
    var driver = this.driver;
    // Explicitly wait for the element to be located
    driver.wait(Until.elementLocated(locator),timeout).then(function () {
        if (debug){console.log('waitForDisplayed::Element is located : ' + locator);}
        // Get the element and explicitly wait for the element to be visible
        var element = driver.findElement(locator);
        driver.wait(Until.elementIsVisible(element),timeout).then(function() {
            if (debug){console.log('waitForEnabled::Element is visible ' + locator);}
            // After it is enabled check if it is really displayed
            return driver.findElement(locator).isDisplayed();
        }, function (err) /* error call back*/ {

            /**
             * Retry block : If element stale then retry else throw error
             */
            if (err.name === 'StaleElementReferenceError') {
                if (debug){console.log('waitForDisplayed::Element not visible with error : ' + err.name + ' retrying...');}
                driver.sleep(WAIT_TIME_BEFORE_RETRY);
                element = driver.findElement(locator);
                driver.wait(Until.elementIsVisible(element),timeout).then(function() {
                    if (debug){console.log('waitForEnabled::Element is visible after retry ' + locator);}
                    // After it is enabled check if it is really displayed
                    return driver.findElement(locator).isDisplayed();
                }, function (err) /* error call back*/ {
                    console.log('waitForDisplayed::Element is still not visible after retry, error : ' + err);
                    defer.reject(err + ' : ' + locator)
                }).then(function(displayed){
                    if (debug){console.log('waitForDisplayed::Element : ' + locator + ' .isDisplayed() : '+ displayed);}
                    defer.fulfill(displayed);
                });
            }
            else {
                console.log('waitForDisplayed::Element is not visible, error : ' + err);
                defer.reject(err + ' : ' + locator)
            }

        }).then(function(displayed){
            if (debug){console.log('waitForDisplayed::Element : ' + locator + ' .isDisplayed() : '+ displayed);}
            defer.fulfill(displayed);
        });
        // Can do it this way too but we are opting for for verboseness in the framework, hence the above
        //.then(defer.fulfill);
    }, function (err) /* error call back*/ {
        console.log('waitForDisplayed::Element was not found, error : ' + err);
        defer.reject(err + ' : ' + locator)
    });
    return defer.promise;
};

/**
 * Safe displayed status getter for element present status to check for negative states
 * @param locator
 * @param timeout
 * @returns Promise
 */
BasePage.prototype.isDisplayed = function(locator, timeout) {
    timeout = timeout || WAIT_TIME_PRESENT;
    var defer = Promise.defer();
    var driver = this.driver;
    // Explicitly wait for the element to be located first
    driver.wait(Until.elementLocated(locator),timeout).then(function() {
        if (debug){console.log('Element is located : ' + locator);}
        // If its located check of if it is visible
        var element = driver.findElement(locator);
        driver.wait(Until.elementIsVisible(element),timeout).then(function() {
            // If it is visible then check if it is displayed
            driver.findElement(locator).isDisplayed().then(function (isDisplayed) {
                if (debug) {console.log('Element is displayed : ' + isDisplayed + locator);}
                defer.fulfill(isDisplayed);
            }, function (err) /* error call back*/ {
                if (debug) {console.log('Element is NOT displayed : ' + locator);}
                defer.fulfill(false);
            });
        }, function (err) /* error call back*/ {
            console.log('Element is not visible, error : ' + err);
            defer.fulfill(false);
        });
    }, function (err) /* error call back*/ {
        console.log('Element is not located, error : ' + err);
        defer.fulfill(false);
    });
    return defer.promise;
};
BasePage.prototype.waitForEnabled = function(locator, timeout) {
    timeout = timeout || WAIT_TIME_PRESENT;
    var defer = Promise.defer();
    var driver = this.driver;
    driver.sleep(300); // Special case for enabled, wait a bit for stability
    // Explicitly wait for the element to be located
    driver.wait(Until.elementLocated(locator),timeout).then(function () {
        if (debug){console.log('waitForEnabled::Element is located : ' + locator);}
        // Get the element and explicitly wait for the element to be visible
        var element = driver.findElement(locator);
        driver.wait(Until.elementIsVisible(element),timeout).then(function() {
            if (debug){console.log('waitForEnabled::Element is visible : ' + locator);}
            // Get the element again and explicitly wait for it to be enabled
            element = driver.findElement(locator);
            driver.wait(Until.elementIsEnabled(element),timeout).then(function() {
                if (debug){console.log('waitForEnabled::Element is enabled ' + locator);}
                // After it is enabled check if it is really enabled
                return driver.findElement(locator).isEnabled();
            }, function (err) /* error call back*/ {
                console.log('waitForEnabled::Element is not enabled, error : ' + err);
                defer.reject(err + ' : ' + locator);
            }).then(function(enabled){
                if (debug){console.log('waitForEnabled::Element : ' + locator + ' isEnabled() : '+ enabled);}
                defer.fulfill(enabled);
            });
        },function (err) /* error call back*/ {

            /**
             * Retry block for elementIsVisible : If element stale then retry else throw error
             * TODO - turn this into a recursive retry or refactor out once we need to retry more than once
             */
            if (err.name === 'StaleElementReferenceError') {
                if (debug){console.log('waitForEnabled::Stale element on wait elementIsVisible retrying...');}
                driver.sleep(WAIT_TIME_BEFORE_RETRY);
                element = driver.findElement(locator);
                driver.wait(Until.elementIsVisible(element),timeout).then(function() {
                    if (debug){console.log('waitForEnabled::Element is visible after retry : ' + locator);}
                    // Get the element again and explicitly wait for it to be enabled
                    element = driver.findElement(locator);
                    driver.wait(Until.elementIsEnabled(element),timeout).then(function() {
                        if (debug){console.log('waitForEnabled::Element is enabled ' + locator);}
                        // After it is enabled check if it is really enabled
                        return driver.findElement(locator).isEnabled();
                    }, function (err) /* error call back*/ {
                        /**
                         * Retry block for elementIsEnabled : If element stale then retry else throw error
                         */

                        if (err.name === 'StaleElementReferenceError') {
                            if (debug){console.log('waitForEnabled::Stale element on wait elementIsEnabled retrying...');}
                            driver.sleep(WAIT_TIME_BEFORE_RETRY);
                            element = driver.findElement(locator);
                            driver.wait(Until.elementIsEnabled(element),timeout).then(function() {
                                if (debug){console.log('waitForEnabled::Element is enabled after retry ' + locator);}
                                // After it is enabled check if it is really enabled
                                return driver.findElement(locator).isEnabled();
                            }).then(function(enabled){
                                if (debug){console.log('waitForEnabled::Element : ' + locator + ' isEnabled() : '+ enabled);}
                                defer.fulfill(enabled);
                            });
                        } else {
                            console.log('waitForEnabled::Element is not enabled, error : ' + err);
                            defer.reject(err + ' : ' + locator);
                        }

                    }).then(function(enabled){
                        if (debug){console.log('waitForEnabled::Element : ' + locator + ' isEnabled() : '+ enabled);}
                        defer.fulfill(enabled);
                    });
                },function (err) /* error call back*/ {
                    console.log('waitForEnabled::Element is still not visible after retry, error : ' + err);
                    defer.reject(err + ' : ' + locator);
                });
            } else {
                console.log('waitForEnabled::Element is not visible, error : ' + err);
                defer.reject(err + ' : ' + locator);
            }

        });
    }, function (err) /* error call back*/ {
        console.log('waitForEnabled::Element was not found, error : ' + err);
        defer.reject(err + ' : ' + locator);
    });
    return defer.promise;
};



/**
 * Combines waiting for the element to be enabled and clicking the element
 * @returns Promise
 */
BasePage.prototype.click = function(locator, timeout) {
  this.waitForEnabled(locator, timeout);
  return this.driver.findElement(locator).click();
};

BasePage.prototype.clickAndWait = function(locator, loadingLocator, timeout) {
  this.waitForEnabled(locator, timeout);
  this.driver.findElement(locator).click();
  var loadingElement = this.driver.findElement(loadingLocator);
  return this.driver.wait(Until.stalenessOf(loadingElement), 20000)  
};

BasePage.prototype.clear = function(locator, timeout) {
  this.waitForEnabled(locator, timeout);
  return this.driver.findElement(locator).clear();
};

/**
 * Combines waiting for the element to be enabled and inputting values into an input
 * @returns Promise
 */
BasePage.prototype.sendKeys = function(locator, keys, timeout) {
  this.waitForEnabled(locator, timeout);
  return this.driver.findElement(locator).sendKeys(keys);
};

BasePage.prototype.changeDropdown = function(selectLocator, inputLocator, value) {
  this.click(selectLocator, 30000);
  this.sendKeys(inputLocator, value, 30000);
  var inputElement = this.driver.findElement(inputLocator);
  return inputElement.sendKeys(Key.ENTER);
};

BasePage.prototype.removeFilter = function(locator, updateButtonLocator) {
  this.click(locator);
  return this.click(updateButtonLocator);
};

BasePage.prototype.getText = function(locator, timeout) {
  var d = Promise.defer();
  this.waitForEnabled(locator, timeout);
  this.driver.findElement(locator).getText().then(function(text) {
    d.fulfill(text);
  })
  return d.promise;
};

BasePage.prototype.getCssValue = function(locator, cssValue) {
  var d = Promise.defer();
  this.waitForEnabled(locator);
  this.driver.findElement(locator).getCssValue(cssValue).then(function(value) {
    d.fulfill(value);
  })
  return d.promise;
};

BasePage.prototype.getAttribute = function(locator, attribute) {
  var d = Promise.defer();
  this.waitForEnabled(locator);
  this.driver.findElement(locator).getAttribute(attribute).then(function(value) {
    d.fulfill(value);
  })
  return d.promise;
};

module.exports = BasePage;