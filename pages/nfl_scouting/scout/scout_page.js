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
var SCOUTING_REPORTS_ROWS = By.xpath(".//div[@class='reports']/.//table/tbody[@inject='rows']/tr");

/****************************************************************************
** Constructor
*****************************************************************************/
function ScoutPage(driver) {
  BasePage.call(this, driver)
};

ScoutPage.prototype = Object.create(BasePage.prototype);
ScoutPage.prototype.constructor = ScoutPage;

/****************************************************************************
** Functions
*****************************************************************************/
ScoutPage.prototype.getVisibleReportsCount = function() {
  return this.getElementCount(SCOUTING_REPORTS_ROWS);
};

ScoutPage.prototype.getTableStat = function(row, col) {
  var d = Promise.defer();
  var thiz = this;
  var inputLocator = By.xpath(`.//div[@class='reports']/.//table/tbody[@inject='rows']/tr[${row}]/td[${col}]/div/input`);
  var locator = By.xpath(`.//div[@class='reports']/.//table/tbody[@inject='rows']/tr[${row}]/td[${col}]/div/*[self::div or self::a or self::input]`);
  
  this.driver.wait(Until.elementLocated(inputLocator),100).then(function() {
    d.fulfill(thiz.driver.findElement(inputLocator).getAttribute('value'));
  }, function(err) {
    d.fulfill(thiz.getText(locator));
  });

  return d.promise;
};

ScoutPage.prototype.getTableStatsForCol = function(col) {
  var d = Promise.defer();
  var thiz = this;
  var inputLocator = By.xpath(`.//div[@class='reports']/.//table/tbody[@inject='rows']/tr/td[${col}]/div/input`);
  var locator = By.xpath(`.//div[@class='reports']/.//table/tbody[@inject='rows']/tr/td[${col}]/div/*[self::div or self::a or self::input]`);
  
  this.driver.wait(Until.elementLocated(inputLocator),100).then(function() {
    d.fulfill(thiz.getInputValueArray(inputLocator));
  }, function(err) {
    d.fulfill(thiz.getTextArray(locator));
  })

  return d.promise;
};

ScoutPage.prototype.clickTableHeader = function(col) {
  var locator = By.xpath(`.//div[@class='reports']/.//table/thead/tr/th[${col}]`);
  return this.click(locator);
};

ScoutPage.prototype.clickSortIcon = function(col) {
  var locator = By.xpath(`.//div[@class='reports']/.//table/thead/tr/th[${col}]/i[contains(@class, 'material-icons')]`);
  return this.click(locator);
};

ScoutPage.prototype.clickRemoveSortIcon = function(col) {
  var locator = By.xpath(`.//div[@class='reports']/.//table/thead/tr/th[${col}]/i[contains(@class, '-cancel')]`);
  return this.click(locator);
};

ScoutPage.prototype.toggleDropdownFilter = function(filterName, optionName, selected) {
  var locator = By.xpath(`.//div[@class='filter'][div[contains(text(),'${filterName}')]]`);
  this.click(locator);
  var optionLocator = By.xpath(`.//div[@class='filter'][div[contains(text(),'${filterName}')]]/.//li[text()='${optionName}']`)
  return this.click(optionLocator);
};

ScoutPage.prototype.clickTableStat = function(row, col) {
  var locator = By.xpath(`.//div[@class='reports']/.//table/tbody[@inject='rows']/tr[${row}]/td[${col}]/div/a`);
  return this.click(locator);
};

ScoutPage.prototype.clickTableRow = function(row) {
  var locator = By.xpath(`.//div[@class='reports']/.//table/tbody[@inject='rows']/tr[${row}]/td[2]`);
  return this.click(locator);
};

module.exports = ScoutPage;