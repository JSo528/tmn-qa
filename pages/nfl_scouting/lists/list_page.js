'use strict';

// Load Base Page
var BasePage = require('../../../pages/base/base_page.js')

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;

/****************************************************************************
** Locators
*****************************************************************************/
var BODY_CONTENT = By.css('.tag-profile table');
var TABLE_TITLE = By.xpath(".//div[@class='tag-profile']/.//div[contains(@class, '-header')]/div");

/****************************************************************************
** Constructor
*****************************************************************************/
function ListPage(driver) {
  BasePage.call(this, driver)
};

ListPage.prototype = Object.create(BasePage.prototype);
ListPage.prototype.constructor = ListPage;

/****************************************************************************
** Functions
*****************************************************************************/
ListPage.prototype.waitForPageToLoad = function() {
  return this.waitForEnabled(BODY_CONTENT);
};

ListPage.prototype.getTableTitle = function() {
  return this.getText(TABLE_TITLE);
};

ListPage.prototype.clickTableHeader = function(col) {
  var locator = By.xpath(`.//div[@class='tag-profile']/.//table/thead/tr/th[${col}]`);
  return this.click(locator);
};

ListPage.prototype.clickSortIcon = function(col) {
  var locator = By.xpath(`.//div[@class='tag-profile']/.//table/thead/tr/th[${col}]/i[contains(@class, 'material-icons')][1]`);
  return this.click(locator);
};

ListPage.prototype.clickRemoveSortIcon = function(col) {
  var locator = By.xpath(`.//div[@class='tag-profile']/.//table/thead/tr/th[${col}]/i[contains(@class, '-cancel')]`);
  return this.click(locator);
};

ListPage.prototype.playerExistsInTable = function(firstName, lastName) {
  var locator = By.xpath(`.//div[@class='tag-profile']/.//table/tbody[@inject='rows']/tr[td[3]/div/a[text()='${firstName}']][td[4]/div/a[text()='${lastName}']]`);
  return this.isDisplayed(locator, 100)
};

ListPage.prototype.getTableStats = function(col) {
  var d = Promise.defer();
  var thiz = this;
  var inputLocator = By.xpath(`.//div[@class='tag-profile']/.//table/tbody[@inject='rows']/tr/td[${col}]/div/input`);
  var locator = By.xpath(`.//div[@class='tag-profile']/.//table/tbody[@inject='rows']/tr/td[${col}]/div/*[self::div or self::a or self::input]`);
  
  this.driver.wait(Until.elementLocated(inputLocator),100).then(function() {
    d.fulfill(thiz.getInputValueArray(inputLocator));
  }, function(err) {
    d.fulfill(thiz.getTextArray(locator));
  })

  return d.promise;
};

module.exports = ListPage;