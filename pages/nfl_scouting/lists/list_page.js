'use strict';

// Load Base Page
var BasePage = require('../../../pages/base/base_page.js')

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;

// Mixins
var _ = require('underscore');
var inputs = require('../mixins/inputs.js');

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

// Mixins
_.extend(ListPage.prototype, inputs);

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

/****************************************************************************
** Table Stats
*****************************************************************************/
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

ListPage.prototype.getTableStat = function(row, col) {
  var d = Promise.defer();
  var thiz = this;
  var inputLocator = By.xpath(`.//div[@class='tag-profile']/.//table/tbody[@inject='rows']/tr[${row}]/td[${col}]/div/input`);
  var locator = By.xpath(`.//div[@class='tag-profile']/.//table/tbody[@inject='rows']/tr[${row}]/td[${col}]/div/*[self::div or self::a or self::input]`);
  
  this.driver.wait(Until.elementLocated(inputLocator),100).then(function() {
    d.fulfill(thiz.driver.findElement(inputLocator).getAttribute('value'));
  }, function(err) {
    d.fulfill(thiz.getText(locator));
  });

  return d.promise;
};

ListPage.prototype.changeTableStatInput = function(row, col, value) {
  var locator = By.xpath(`.//div[@class='tag-profile']/.//table/tbody[@inject='rows']/tr[${row}]/td[${col}]/div/input`);
  return this.changeInput(locator, value)
};

ListPage.prototype.changeTableStatDropdown = function(row, col, value) {
  var locator = By.xpath(`.//div[@class='tag-profile']/.//table/tbody[@inject='rows']/tr[${row}]/td[${col}]/div`);
  var optionLocator = By.xpath(`.//div[@class='tag-profile']/.//table/tbody[@inject='rows']/tr[${row}]/td[${col}]/.//li[text()='${value}']`)
  return this.changeDropdown(locator, optionLocator);
};

ListPage.prototype.getTableStatCheckbox = function(row, col) {
  var locator = By.xpath(`.//div[@class='tag-profile']/.//table/tbody[@inject='rows']/tr[${row}]/td[${col}]/div`);
  return this.getCheckbox(locator);
};

ListPage.prototype.changeTableStatCheckbox = function(row, col, selected) {
  var locator = By.xpath(`.//div[@class='tag-profile']/.//table/tbody[@inject='rows']/tr[${row}]/td[${col}]/div`);
  return this.changeCheckbox(locator, selected);
};

ListPage.prototype.changeTableStatYear = function(row, col, year) {
  var locator = By.xpath(`.//div[@class='tag-profile']/.//table/tbody[@inject='rows']/tr[${row}]/td[${col}]/div`);
  return this.changeDatePicker(locator, year);
};

/****************************************************************************
** Aggregate Helpers
*****************************************************************************/
ListPage.prototype.getTableStatField = function(type, row, col) {
  switch (type) {
    case 'input':
    case 'dropdown':
    case 'date':
      return this.getTableStat(row, col);
    case 'checkbox':
      return this.getTableStatCheckbox(row, col);
  }
};

ListPage.prototype.changeTableStatField = function(type, row, col, value) {
  switch (type) {
    case 'input':
      return this.changeTableStatInput(row, col, value);
    case 'dropdown':
      return this.changeTableStatDropdown(row, col, value);
    case 'checkbox':
      return this.changeTableStatCheckbox(row, col, value);
    case 'date':
      return this.changeTableStatYear(row, col, value);
  }
};

module.exports = ListPage;