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

function TablePage(driver) {
  BasePage.call(this, driver);
};

TablePage.prototype = Object.create(BasePage.prototype);
TablePage.prototype.constructor = TablePage;

/****************************************************************************
** Functions
*****************************************************************************/
TablePage.prototype.changeSeason = function(report) {
  this.changeDropdown(SEASON_DROPDOWN, DROPDOWN_INPUT, report);
  return this.waitForEnabled(SEASON_DROPDOWN, 20000);
};

TablePage.prototype.isTableDisplayed = function() {
  return this.isDisplayed(DATA_TABLE, 100);
};

TablePage.prototype.waitForTableToLoad = function() {
  this.waitUntilStaleness(DATA_TABLE, 1000);
  return this.waitForEnabled(DATA_TABLE, 10000);
};

TablePage.prototype.getLeagueTitle = function() {
  var locator = By.xpath(".//div[@id='tableSection']/div/div/h2");
  return this.getText(locator, 100);
};

TablePage.prototype.clickTableHeaderFor = function(colName, num) {
  num = num || 1;
  var locator = By.xpath(`.//div[@id='tableContainer']/table/thead/tr/th[text()="${colName}"][${num}]`);
  return this.click(locator);
};

TablePage.prototype.getTableStatsFor = function(colName, num) {
  num = num || 1;
  var locator = By.xpath(`.//div[@id='tableContainer']/table/tbody/tr[@data-tmn-row-i]/td[count(//div[@id='tableContainer']/table/thead/tr/th[text()="${colName}"][${num}]/preceding-sibling::th)+1]`);
  return this.getTextArray(locator);
};

TablePage.prototype.getTableStatFor = function(rowNum, colName, num) {
  num = num || 1;
  var locator = By.xpath(`.//div[@id='tableContainer']/table/tbody/tr[@data-tmn-row-i][${rowNum}]/td[count(//div[@id='tableContainer']/table/thead/tr/th[text()="${colName}"][${num}]/preceding-sibling::th)+1]`);
  return this.getText(locator);
};

TablePage.prototype.clickTableStatFor = function(rowNum, colName, num) {
  num = num || 1;
  var locator = By.xpath(`.//div[@id='tableContainer']/table/tbody/tr[@data-tmn-row-i][${rowNum}]/td[count(//div[@id='tableContainer']/table/thead/tr/th[text()="${colName}"][${num}]/preceding-sibling::th)+1]/a`);
  return this.click(locator);
};

module.exports = TablePage;