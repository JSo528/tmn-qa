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
var LISTS_TABLE = By.css('.tags table');
var LISTS_ROWS = By.xpath(".//div[@class='tags']/.//table/tbody[@inject='rows']/tr");

/****************************************************************************
** Constructor
*****************************************************************************/
function ListsPage(driver) {
  BasePage.call(this, driver)
};

ListsPage.prototype = Object.create(BasePage.prototype);
ListsPage.prototype.constructor = ListsPage;

/****************************************************************************
** Functions
*****************************************************************************/
ListsPage.prototype.getVisibleListsCount = function() {
  this.waitUntilStaleness(LISTS_TABLE, 5000);
  return this.getElementCount(LISTS_ROWS);
};

ListsPage.prototype.getTableStat = function(row, col) {
  var locator = By.xpath(`.//div[@class='tags']/.//table/tbody[@inject='rows']/tr[${row}]/td[${col}]`);
  return this.getText(locator);
};

ListsPage.prototype.getTableStatsForCol = function(col) {
  var locator = By.xpath(`.//div[@class='tags']/.//table/tbody[@inject='rows']/tr/td[${col}]`);
  return this.getTextArray(locator);
};

ListsPage.prototype.clickTableHeader = function(col) {
  var locator = By.xpath(`.//div[@class='tags']/.//table/thead/tr/th[${col}]`);
  this.click(locator);
  return this.waitUntilStaleness(LISTS_TABLE, 5000);
};

ListsPage.prototype.clickSortIcon = function(col) {
  var locator = By.xpath(`.//div[@class='tags']/.//table/thead/tr/th[${col}]/i[contains(@class, 'material-icons')]`);
  this.click(locator);
  return this.waitUntilStaleness(LISTS_TABLE, 5000);
};

ListsPage.prototype.clickTableRow = function(row) {
  var locator = By.xpath(`.//div[@class='tags']/.//table/tbody[@inject='rows']/tr[${row}]/td[1]`);
  return this.click(locator);
};

ListsPage.prototype.clickTableRowWithListName = function(listName) {
  var locator = By.xpath(`.//div[@class='tags']/.//table/tbody[@inject='rows']/tr[td/div[text()=' ${listName}']]`);
  return this.click(locator);
};


module.exports = ListsPage;