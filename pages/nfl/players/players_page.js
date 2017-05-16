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
var SECTION_NAMES = {
  'stats': 'Stats',
  'occurrencesAndStreaks': 'Occurrences & Streaks',
  'scatterPlot': 'Scatter Plot',
};

// shared
var REPORT_SELECT = By.id("s2id_reportNavFootballPlayersSubCommon");
var DROPDOWN_INPUT = By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input");

var STATS_TABLE = {
  'stats': By.xpath(".//div[@id='tableFootballPlayersStatsContainer']/table"),
  'occurrencesAndStreaks': By.xpath(".//div[@id='tableFootballPlayersStreaksContainer']/table"),
  'scatterPlot': By.xpath(".//div[@id='tableFootballPlayersScatterContainer']/table"),
};

// Stats
var GROUP_BY_SELECT = By.id("s2id_pageControlFootballPlayerGroupBy");
var STATS_VIEW_SELECT = By.id("s2id_pageControlFootballStatsViewPlayers");
var QUALIFY_BY_SELECT = By.id("s2id_pageControlFootballQualifyBy");
var STATS_EXPORT_LINK = By.id("tableFootballPlayersStatsTableExport");

function PlayersPage(driver) {
  BasePage.call(this, driver);
  this.section = 'stats';
};

PlayersPage.prototype = Object.create(BasePage.prototype);
PlayersPage.prototype.constructor = PlayersPage;

// Mixins
_.extend(PlayersPage.prototype, videoPlaylist);
_.extend(PlayersPage.prototype, chartColumns);
_.extend(PlayersPage.prototype, occurrencesAndStreaks);
_.extend(PlayersPage.prototype, scatterPlot);

PlayersPage.prototype.DEFAULT_BY_POSSESSION_ID = 'tableFootballPlayerPlayByPlayModalContainer';
PlayersPage.prototype.DEFAULT_CHART_COLUMNS_DATA_TABLE_ID = 'tableFootballPlayersStatsContainer';
PlayersPage.prototype.DEFAULT_CHART_COLUMNS_ISO_TABLE_ID = 'tableFootballPlayersStatsISOContainer';
PlayersPage.prototype.X_STAT_SELECT = By.id('s2id_pageControlFootballScatterXStatTypeZebra');
PlayersPage.prototype.Y_STAT_SELECT = By.id('s2id_pageControlFootballScatterYStatTypeZebra');
PlayersPage.prototype.DEFAULT_CONSTRAINT_STAT_SELECT = By.id('s2id_pageControlFootballStrkConstraintStatPlayerZebra');
PlayersPage.prototype.DEFAULT_STREAK_GROUPING_SELECT = By.id('s2id_pageControlFootballStrkGroupingPlayer');

/****************************************************************************
** Shared
*****************************************************************************/
PlayersPage.prototype.goToSection = function(section) {
  this.section = section;
  var locator = By.xpath(`.//div[@class='navbar-header']/ul/li/a[text()='${SECTION_NAMES[section]}']`);
  return this.click(locator);
};

PlayersPage.prototype.changeReport = function(report) {
  this.changeDropdown(REPORT_SELECT, DROPDOWN_INPUT, report);
  return this.waitForEnabled(REPORT_SELECT, 30000);
};

PlayersPage.prototype.waitForTableToLoad = function() {
  this.waitUntilStaleness(STATS_TABLE[this.section], 10000);
  return this.waitForEnabled(STATS_TABLE[this.section], 10000);
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
  var locator = By.xpath(`.//div[@id='tableFootballPlayersStatsContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[${colNum}]/*[self::span or self::a]`);
  return this.click(locator);
};

PlayersPage.prototype.getStatsTableBgColor = function(rowNum, colNum) {
  var locator = By.xpath(`.//div[@id='tableFootballPlayersStatsContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[${colNum}]`);
  return this.getCssValue(locator, "background-color");
};

PlayersPage.prototype.clickStatsExportLink = function() {
  this.click(STATS_EXPORT_LINK);
  return this.driver.sleep(1000);
};

PlayersPage.prototype.clickStatsExportAllLink = function() {
  var locator = By.id("<%=name%>TableExportAll");
  this.click(locator);
  return this.driver.sleep(1000);
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
  var locator = By.xpath(`.//div[@id='tableFootballPlayersStreaksContainer']/table/thead/tr/th[${col}]`);
  return this.getText(locator);
};

PlayersPage.prototype.getStreaksTableStat = function(row, col) {
  var locator = By.xpath(`.//div[@id='tableFootballPlayersStreaksContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator);
};

PlayersPage.prototype.clickStreaksExportLink = function() {
  var locator = By.id("tableFootballPlayersStreaksTableExport");
  this.click(locator);
  return this.driver.sleep(3000);
};

/****************************************************************************
** Scatterplot
*****************************************************************************/
PlayersPage.prototype.getScatterPlotTableHeader = function(col) {
  var locator = By.xpath(`.//div[@id='tableFootballPlayersScatterContainer']/table/thead/tr/th[${col}]`);
  return this.getText(locator);
};

PlayersPage.prototype.getScatterPlotTableStat = function(row, col) {
  var locator = By.xpath(`.//div[@id='tableFootballPlayersScatterContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator);
};

PlayersPage.prototype.clickScatterPlotExportLink = function() {
  var locator = By.id("tableFootballPlayersScatterTableExport");
  this.click(locator);
  return this.driver.sleep(1000);
};


module.exports = PlayersPage;