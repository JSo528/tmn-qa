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
var TEAMS_TABLE = By.css('.teams table');
var TEAMS_COUNT = By.xpath(".//div[@class='teams']/.//table/tbody[@inject='rows']/tr");

/****************************************************************************
** Constructor
*****************************************************************************/
function TeamsPage(driver) {
  BasePage.call(this, driver)
};

TeamsPage.prototype = Object.create(BasePage.prototype);
TeamsPage.prototype.constructor = TeamsPage;

/****************************************************************************
** Functions
*****************************************************************************/
TeamsPage.prototype.clickTableHeader = function(col) {
  var locator = By.xpath(`.//div[@class='teams']/.//table/thead/tr/th[${col}]`);
  return this.click(locator);
};

TeamsPage.prototype.getVisibleTeamsCount = function() {
  return this.getElementCount(TEAMS_COUNT);
};

TeamsPage.prototype.getTableStat = function(row, col) {
  var locator = By.xpath(`.//div[@class='teams']/.//table/tbody[@inject='rows']/tr[${row}]/td[${col}]`);
  return this.getText(locator);
};

TeamsPage.prototype.clickTableRow = function(row) {
  var locator = By.xpath(`.//div[@class='teams']/.//table/tbody[@inject='rows']/tr[${row}]/td[1]`);
  return this.click(locator);
};

TeamsPage.prototype.clickSortIcon = function(col) {
  var locator = By.xpath(`.//div[@class='teams']/.//table/thead/tr/th[${col}]/i[contains(@class, 'material-icons')]`);
  return this.click(locator);
};

TeamsPage.prototype.clickRemoveSortIcon = function(col) {
  var locator = By.xpath(`.//div[@class='teams']/.//table/thead/tr/th[${col}]/i[contains(@class, '-cancel')]`);
  return this.click(locator);
};

module.exports = TeamsPage;