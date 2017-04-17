'use strict';

// Load Base Page
var BasePage = require('../../../pages/base/base_page.js');

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;
var Key = require('selenium-webdriver').Key;

// Mixins
var _ = require('underscore');
var videoPlaylist = require('../mixins/videoPlaylist.js');
var chartColumns = require('../../mixins/chartColumns.js');
var occurrencesAndStreaks = require('../mixins/occurrencesAndStreaks.js');
var scatterPlot = require('../../mixins/scatterPlot.js');

/****************************************************************************
** Locators
*****************************************************************************/
// shared
var REPORT_SELECT = By.id("s2id_reportNavFootballPlayersSubCommon");
var DROPDOWN_INPUT = By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input");
var STATS_TABLE = By.xpath(".//div[@id='tableFootballPlayersStatsContainer']/table");

// Stats
var GROUP_BY_SELECT = By.id("s2id_pageControlFootballPlayerGroupBy");
var STATS_VIEW_SELECT = By.id("s2id_pageControlFootballStatsViewPlayers");
var QUALIFY_BY_SELECT = By.id("s2id_pageControlFootballQualifyBy");
var STATS_EXPORT_LINK = By.id("tableFootballPlayersStatsTableExport");

function PlayersPage(driver, section) {
  BasePage.call(this, driver);
};

PlayersPage.prototype = Object.create(BasePage.prototype);
PlayersPage.prototype.constructor = PlayersPage;

// Mixins
_.extend(PlayersPage.prototype, videoPlaylist);
_.extend(PlayersPage.prototype, chartColumns);
_.extend(PlayersPage.prototype, occurrencesAndStreaks);
_.extend(PlayersPage.prototype, scatterPlot);

PlayersPage.prototype.BY_POSSESSION_ID = 'tableFootballPlayerPlayByPlayModalContainer';
PlayersPage.prototype.DEFAULT_CHART_COLUMNS_DATA_TABLE_ID = 'tableFootballPlayersStatsContainer';
PlayersPage.prototype.DEFAULT_CHART_COLUMNS_ISO_TABLE_ID = 'tableFootballPlayersStatsISOContainer';

/****************************************************************************
** Shared
*****************************************************************************/
PlayersPage.prototype.goToSection = function(section) {
  var locator = By.xpath(`.//div[@class='navbar-header']/ul/li/a[text()='${section}']`);
  return this.click(locator);
};

PlayersPage.prototype.changeReport = function(report) {
  this.changeDropdown(REPORT_SELECT, DROPDOWN_INPUT, report);
  return this.waitForEnabled(REPORT_SELECT, 30000);
};

PlayersPage.prototype.waitForTableToLoad = function() {
  this.waitUntilStaleness(STATS_TABLE, 10000);
  return this.waitForEnabled(STATS_TABLE, 10000);
};

/****************************************************************************
** Stats
*****************************************************************************/
PlayersPage.prototype.changeGroupBy = function(filter) {
  return this.changeDropdown(GROUP_BY_SELECT, DROPDOWN_INPUT, filter);
};

PlayersPage.prototype.changeStatsView = function(filter) {
  return this.changeDropdown(STATS_VIEW_SELECT, DROPDOWN_INPUT, filter);
};

PlayersPage.prototype.getStatsTableStats = function(colNum) {
  var locator = By.xpath(`.//div[@id='tableFootballPlayersStatsContainer']/table/tbody/tr[@data-tmn-row-type='row']/td[${colNum}]`);
  return this.getTextArray(locator);
};

PlayersPage.prototype.clickStatsTableHeader = function(colNum) {
  var locator = By.xpath(`.//div[@id='tableFootballPlayersStatsContainer']/table/thead/tr/th[${colNum}]`);
  return this.click(locator);
};

PlayersPage.prototype.getStatsTableStat = function(rowNum, colNum) {
  var locator = By.xpath(`.//div[@id='tableFootballPlayersStatsContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[${colNum}]`);
  return this.getText(locator);
};

PlayersPage.prototype.getStatsTableHeader = function(colNum) {
  var locator = By.xpath(`.//div[@id='tableFootballPlayersStatsContainer']/table/thead/tr/th[${colNum}]`);
  return this.getText(locator);
};

PlayersPage.prototype.clickStatsTableStat = function(rowNum, colNum) {
  var locator = By.xpath(`.//div[@id='tableFootballPlayersStatsContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[${colNum}]/span`);
  return this.click(locator);
};

PlayersPage.prototype.getStatsTableBgColor = function(rowNum, colNum) {
  var locator = By.xpath(`.//div[@id='tableFootballPlayersStatsContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[${colNum}]`);
  return this.getCssValue(locator, "background-color");
};

PlayersPage.prototype.clickStatsExportLink = function() {
  this.click(STATS_EXPORT_LINK);
  return this.driver.sleep(5000);
};

PlayersPage.prototype.readAndDeleteExportCSV = function() {
  return this.readAndDeleteCSV('../Downloads/export.csv');
};

PlayersPage.prototype.clickStatsTableHeaderFor = function(colName) {
  var locator = By.xpath(`.//div[@id='tableFootballPlayersStatsContainer']/table/thead/tr/th[text()="${colName}"]`);
  return this.click(locator);
};

PlayersPage.prototype.getStatsTableStatsFor = function(colName) {
  var locator = By.xpath(`.//div[@id='tableFootballPlayersStatsContainer']/table/tbody/tr[@data-tmn-row-type='row']/td[count(//div[@id='tableFootballPlayersStatsContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getTextArray(locator);
};

PlayersPage.prototype.getStatsTableStatFor = function(rowNum, colName) {
  var locator = By.xpath(`.//div[@id='tableFootballPlayersStatsContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[count(//div[@id='tableFootballPlayersStatsContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getText(locator);
};

/****************************************************************************
** Occurrences & Streaks
*****************************************************************************/
PlayersPage.prototype.getStreaksTableHeader = function(col) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamsStreaksContainer']/table/thead/tr/th[${col}]`);
  return this.getText(locator);
};

PlayersPage.prototype.getStreaksTableStat = function(row, col) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamsStreaksContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator);
};

/****************************************************************************
** Scatterplot
*****************************************************************************/
PlayersPage.prototype.getScatterPlotTableHeader = function(col) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamsScatterContainer']/table/thead/tr/th[${col}]`);
  return this.getText(locator);
};

PlayersPage.prototype.getScatterPlotTableStat = function(row, col) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamsScatterContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator);
};


module.exports = PlayersPage;