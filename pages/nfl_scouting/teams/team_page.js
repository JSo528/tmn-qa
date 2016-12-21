'use strict';

// Load Base Page
var BasePage = require('../../../pages/base/base_page.js')

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;
var Key = require('selenium-webdriver').Key;

/****************************************************************************
** Locators
*****************************************************************************/


/****************************************************************************
** Constructor
*****************************************************************************/
function TeamPage(driver) {
  BasePage.call(this, driver)
};

TeamPage.prototype = Object.create(BasePage.prototype);
TeamPage.prototype.constructor = TeamPage;

/****************************************************************************
** Functions
*****************************************************************************/
// sorting/filtering
TeamPage.prototype.clickTableHeader = function(col) {
  var locator = By.xpath(`.//div[@class='roster']/.//table/thead/tr/th[${col}]`);
  return this.click(locator);
};

TeamPage.prototype.clickSortIcon = function(col) {
  var locator = By.xpath(`.//div[@class='roster']/.//table/thead/tr/th[${col}]/i[contains(@class, 'material-icons')]`);
  return this.click(locator);
};

TeamPage.prototype.clickRemoveSortIcon = function(col) {
  var locator = By.xpath(`.//div[@class='roster']/.//table/thead/tr/th[${col}]/i[contains(@class, '-cancel')]`);
  return this.click(locator);
};

TeamPage.prototype.toggleDropdownFilter = function(filterName, optionName, selected) {
  var locator = By.xpath(`.//div[@class='filter'][div[contains(text(),'${filterName}')]]`);
  this.click(locator);
  var optionLocator = By.xpath(`.//div[@class='filter'][div[contains(text(),'${filterName}')]]/.//li[text()='${optionName}']`)
  return this.click(optionLocator);
};

TeamPage.prototype.toggleCheckboxFilter = function(filterName) {
  var locator = By.xpath(`.//div[@class='filter'][div[contains(text(),'${filterName}')]]`);
};

// table stats
TeamPage.prototype.getTableStat = function(row, col) {
  var d = Promise.defer();
  var thiz = this;
  var inputLocator = By.xpath(`.//div[@class='roster']/.//table/tbody[@inject='rows']/tr[${row}]/td[${col}]/div/input`);
  var locator = By.xpath(`.//div[@class='roster']/.//table/tbody[@inject='rows']/tr[${row}]/td[${col}]/div/*[self::div or self::a or self::input]`);
  
  this.driver.wait(Until.elementLocated(inputLocator),100).then(function() {
    d.fulfill(thiz.driver.findElement(inputLocator).getAttribute('value'));
  }, function(err) {
    d.fulfill(thiz.getText(locator));
  });

  return d.promise;
};

TeamPage.prototype.clickTableStat = function(row, col) {
  var locator = By.xpath(`.//div[@class='roster']/.//table/tbody[@inject='rows']/tr[${row}]/td[${col}]/div/*[self::div or self::a or self::input]`);
  return this.click(locator);
};

TeamPage.prototype.updateTableStat = function(row, col, value) {
  var locator = By.xpath(`.//div[@class='roster']/.//table/tbody[@inject='rows']/tr[${row}]/td[${col}]/div/input`);
  this.click(locator);
  this.clear(locator);
  this.sendKeys(locator, value);
  return this.sendKeys(locator, Key.ENTER);
};

TeamPage.prototype.updateTableStatDropdown = function(row, col, value) {
  var locator = By.xpath(`.//div[@class='roster']/.//table/tbody[@inject='rows']/tr[${row}]/td[${col}]/div`);
  this.click(locator);
  var optionLocator = By.xpath(`.//div[@class='roster']/.//table/tbody[@inject='rows']/tr[${row}]/td[${col}]/.//li[text()='${value}']`)
  return this.click(optionLocator);
};

TeamPage.prototype.getTableCheckboxStat = function(row, col) {
  var locator = By.xpath(`.//div[@class='roster']/.//table/tbody[@inject='rows']/tr[${row}]/td[${col}]/div`);
  return this.getText(locator);
};

TeamPage.prototype.clickTableCheckboxStat = function(row, col) {
  var locator = By.xpath(`.//div[@class='roster']/.//table/tbody[@inject='rows']/tr[${row}]/td[${col}]/div`);
  return this.click(locator);
};

TeamPage.prototype.getTableStats = function(col) {
  var d = Promise.defer();
  var thiz = this;
  var inputLocator = By.xpath(`.//div[@class='roster']/.//table/tbody[@inject='rows']/tr/td[${col}]/div/input`);
  var locator = By.xpath(`.//div[@class='roster']/.//table/tbody[@inject='rows']/tr/td[${col}]/div/*[self::div or self::a or self::input]`);
  
  this.driver.wait(Until.elementLocated(inputLocator),100).then(function() {
    d.fulfill(thiz.getInputValueArray(inputLocator));
  }, function(err) {
    d.fulfill(thiz.getTextArray(locator));
  })

  return d.promise;
};

TeamPage.prototype.getTableCheckboxStats = function(col) {
  var locator = By.xpath(`.//div[@class='roster']/.//table/tbody[@inject='rows']/tr/td[${col}]/div`);
  return this.getTextArray(locator);
};


module.exports = TeamPage;