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
  return this.getElementCount(LISTS_ROWS);
};

ListsPage.prototype.getTableStat = function(row, col) {
  var locator = By.xpath(`.//div[@class='tags']/.//table/tbody[@inject='rows']/tr[${row}]/td[${col}]`);
  return this.getText(locator);
};

ListsPage.prototype.clickTableRow = function(row) {
  var locator = By.xpath(`.//div[@class='tags']/.//table/tbody[@inject='rows']/tr[${row}]/td[1]`);
  return this.click(locator);
};


module.exports = ListsPage;