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
var STATS_TABLE = By.xpath(".//div[@id='tableFootballConfStatsContainer']/table");
var REPORT_SELECT = By.id("s2id_reportNavFootballTeamsSubCommon");
var GROUP_BY_SELECT = By.id("s2id_pageControlFootballGroupByConfNFL");
var STATS_VIEW_SELECT = By.id("s2id_pageControlFootballStatsViewConf");
var DROPDOWN_INPUT = By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input");

function GroupsPage(driver, section) {
  BasePage.call(this, driver);
};

GroupsPage.prototype = Object.create(BasePage.prototype);
GroupsPage.prototype.constructor = GroupsPage;

/****************************************************************************
** Controls
*****************************************************************************/
GroupsPage.prototype.waitForTableToLoad = function() {
  this.waitUntilStaleness(STATS_TABLE, 10000);
  return this.waitForEnabled(STATS_TABLE, 10000);
};

GroupsPage.prototype.changeGroupBy = function(filter) {
  return this.changeDropdown(GROUP_BY_SELECT, DROPDOWN_INPUT, filter);
};

GroupsPage.prototype.changeStatsView = function(filter) {
  return this.changeDropdown(STATS_VIEW_SELECT, DROPDOWN_INPUT, filter);
};

GroupsPage.prototype.changeReport = function(report) {
  this.changeDropdown(REPORT_SELECT, DROPDOWN_INPUT, report);
  return this.waitForEnabled(REPORT_SELECT, 30000);
};

/****************************************************************************
** Stats
*****************************************************************************/
GroupsPage.prototype.getTableStats = function(colNum) {
  var locator = By.xpath(`.//div[@id='tableFootballConfStatsContainer']/table/tbody/tr[@data-tmn-row-type='row']/td[${colNum}]`);
  return this.getTextArray(locator); 
};

GroupsPage.prototype.getTableStat = function(rowNum, colNum) {
  var locator = By.xpath(`.//div[@id='tableFootballConfStatsContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[${colNum}]`);
  return this.getText(locator); 
};

GroupsPage.prototype.clickTableColumnHeader = function(colNum) {
  var locator = By.xpath(`.//div[@id='tableFootballConfStatsContainer']/table/thead/tr/th[${colNum}]`);
  return this.click(locator); 
};

GroupsPage.prototype.clickTableHeaderFor = function(colName) {
  var locator = By.xpath(`.//div[@id='tableFootballConfStatsContainer']/table/thead/tr/th[text()="${colName}"]`);
  return this.click(locator);
};

GroupsPage.prototype.getTableStatsFor = function(colName) {
  var locator = By.xpath(`.//div[@id='tableFootballConfStatsContainer']/table/tbody/tr[@data-tmn-row-type='row']/td[count(//div[@id='tableFootballConfStatsContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getTextArray(locator);
};

GroupsPage.prototype.getTableStatFor = function(rowNum, colName) {
  var locator = By.xpath(`.//div[@id='tableFootballConfStatsContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[count(//div[@id='tableFootballConfStatsContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getText(locator);
};

GroupsPage.prototype.getTableHeader = function(colNum) {
  var locator = By.xpath(`.//div[@id='tableFootballConfStatsContainer']/table/thead/tr/th[${colNum}]`);
  return this.getText(locator);
};

module.exports = GroupsPage;