'use strict';

// Load Base Page
var BasePage = require('../../../pages/base/base_page.js');

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;
var Key = require('selenium-webdriver').Key;

/****************************************************************************
** Locators
*****************************************************************************/
var DROPDOWN_INPUT = By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input");
var SEASON_DROPDOWN = By.id('s2id_league');
var DATA_TABLE = By.id('tableContainer');

function LeaguePage(driver) {
  BasePage.call(this, driver);
};

LeaguePage.prototype = Object.create(BasePage.prototype);
LeaguePage.prototype.constructor = LeaguePage;

/****************************************************************************
** Functions
*****************************************************************************/
LeaguePage.prototype.changeSeason = function(report) {
  this.changeDropdown(SEASON_DROPDOWN, DROPDOWN_INPUT, report);
  return this.waitForEnabled(SEASON_DROPDOWN, 30000);
};

LeaguePage.prototype.isTableDisplayed = function() {
  return this.isDisplayed(DATA_TABLE, 100);
};

LeaguePage.prototype.waitForTableToLoad = function() {
  this.waitUntilStaleness(DATA_TABLE, 1000);
  return this.waitForEnabled(DATA_TABLE, 10000);
};

LeaguePage.prototype.clickTableHeaderFor = function(colName, num) {
  num = num || 1;
  var locator = By.xpath(`.//div[@id='tableContainer']/table/thead/tr/th[text()="${colName}"][${num}]`);
  return this.click(locator);
};

LeaguePage.prototype.getTableStatsFor = function(colName) {
  var locator = By.xpath(`.//div[@id='tableContainer']/table/tbody/tr[@data-tmn-row-type='row']/td[count(//div[@id='tableContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getTextArray(locator);
};

LeaguePage.prototype.getTableStatFor = function(rowNum, colName) {
  var locator = By.xpath(`.//div[@id='tableContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[count(//div[@id='tableContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getText(locator);
};

LeaguePage.prototype.getSeasonsArray = function() {
  var locator = By.css("ul > li > div");
  return this.getTextArray(locator);
};
module.exports = LeaguePage;