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
var REPORT_SELECT = By.id("s2id_reportNavFootballTeamsSubCommon");
var DROPDOWN_INPUT = By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input");
var STATS_TABLE = By.xpath(".//div[@id='tableFootballTeamsStatsContainer']/table");

// Stats
var GROUP_BY_SELECT = By.id("s2id_pageControlFootballGroupBy");
var STATS_VIEW_SELECT = By.id("s2id_pageControlFootballStatsViewTeams");
var STATS_EXPORT_LINK = By.id("tableFootballTeamsStatsTableExport");

// Comp
var COMP_SEARCH_ID = {
  1: 'compSearch1',
  2: 'compSearch2',
  3: 'compSearch3'
};

var COMP_CONTAINER_ID = {
  1: 'tableFootballTeamsComp1Container',
  2: 'tableFootballTeamsComp2Container',
  3: 'tableFootballTeamsComp3Container'
};

var COMP_SELECT = By.id("s2id_pageControlFootballTeamsCompsType");

function TeamsPage(driver, section) {
  BasePage.call(this, driver);
};

TeamsPage.prototype = Object.create(BasePage.prototype);
TeamsPage.prototype.constructor = TeamsPage;

// Mixins
_.extend(TeamsPage.prototype, videoPlaylist);
_.extend(TeamsPage.prototype, chartColumns);
_.extend(TeamsPage.prototype, occurrencesAndStreaks);
_.extend(TeamsPage.prototype, scatterPlot);


TeamsPage.prototype.DEFAULT_BY_POSSESSION_ID = 'tableFootballTeamPlayByPlayModalContainer';
TeamsPage.prototype.DEFAULT_FLAT_VIEW_ID = 'tableFootballTeamPlayByPlayModalTableContainer';                                      
TeamsPage.prototype.DEFAULT_CHART_COLUMNS_DATA_TABLE_ID = 'tableFootballTeamsStatsContainer';
TeamsPage.prototype.DEFAULT_CHART_COLUMNS_ISO_TABLE_ID = 'tableFootballTeamsStatsISOContainer';
TeamsPage.prototype.X_STAT_SELECT = By.id('s2id_pageControlFootballScatterXStatTypeZebra');
TeamsPage.prototype.Y_STAT_SELECT = By.id('s2id_pageControlFootballScatterYStatTypeZebra');

/****************************************************************************
** Shared
*****************************************************************************/
TeamsPage.prototype.goToSection = function(section) {
  var locator = By.xpath(`.//div[@class='navbar-header']/ul/li/a[text()='${section}']`);
  return this.click(locator);
};

TeamsPage.prototype.changeReport = function(report) {
  this.changeDropdown(REPORT_SELECT, DROPDOWN_INPUT, report);
  return this.waitForEnabled(REPORT_SELECT, 30000);
};

TeamsPage.prototype.waitForTableToLoad = function() {
  this.waitUntilStaleness(STATS_TABLE, 10000);
  return this.waitForEnabled(STATS_TABLE, 10000);
};

/****************************************************************************
** Stats
*****************************************************************************/
TeamsPage.prototype.changeGroupBy = function(filter) {
  return this.changeDropdown(GROUP_BY_SELECT, DROPDOWN_INPUT, filter);
};

TeamsPage.prototype.changeStatsView = function(filter) {
  return this.changeDropdown(STATS_VIEW_SELECT, DROPDOWN_INPUT, filter);
};

TeamsPage.prototype.getStatsTableStats = function(colNum) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamsStatsContainer']/table/tbody/tr[@data-tmn-row-type='row']/td[${colNum}]`);
  return this.getTextArray(locator);
};

TeamsPage.prototype.clickStatsTableHeader = function(colNum) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamsStatsContainer']/table/thead/tr/th[${colNum}]`);
  return this.click(locator);
};

TeamsPage.prototype.getStatsTableStat = function(rowNum, colNum) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamsStatsContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[${colNum}]`);
  return this.getText(locator);
};

TeamsPage.prototype.getStatsTableHeader = function(colNum) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamsStatsContainer']/table/thead/tr/th[${colNum}]`);
  return this.getText(locator);
};

TeamsPage.prototype.clickStatsTableStat = function(rowNum, colNum) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamsStatsContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[${colNum}]/*[self::span or self::a]`);
  return this.click(locator);
};

TeamsPage.prototype.getStatsTableBgColor = function(rowNum, colNum) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamsStatsContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[${colNum}]`);
  return this.getCssValue(locator, "background-color");
};

TeamsPage.prototype.getStatsTableBgColorFor = function(rowNum, colName) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamsStatsContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[count(//div[@id='tableFootballTeamsStatsContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getCssValue(locator, "background-color");
};

TeamsPage.prototype.clickStatsExportLink = function() {
  this.click(STATS_EXPORT_LINK);
  return this.driver.sleep(5000);
};

TeamsPage.prototype.readAndDeleteExportCSV = function() {
  return this.readAndDeleteCSV('../Downloads/export.csv');
};

TeamsPage.prototype.clickStatsTableHeaderFor = function(colName) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamsStatsContainer']/table/thead/tr/th[text()="${colName}"]`);
  return this.click(locator);
};

TeamsPage.prototype.getStatsTableStatsFor = function(colName) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamsStatsContainer']/table/tbody/tr[@data-tmn-row-type='row']/td[count(//div[@id='tableFootballTeamsStatsContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getTextArray(locator);
};

TeamsPage.prototype.getStatsTableStatFor = function(rowNum, colName) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamsStatsContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[count(//div[@id='tableFootballTeamsStatsContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getText(locator);
};

/****************************************************************************
** Comps
*****************************************************************************/
TeamsPage.prototype.changeCompType = function(type) {
  return this.changeDropdown(COMP_SELECT, DROPDOWN_INPUT, type);
};

TeamsPage.prototype.selectForCompSearch = function(compNum, name) {
  var locator = By.css(`#${COMP_SEARCH_ID[compNum]} input`);
  var updateLocator = By.id(COMP_CONTAINER_ID[compNum]);
  return this.selectFromSearch(locator, name, 1, updateLocator)
};

TeamsPage.prototype.getCompTableStat = function(compNum, rowNum, colNum) {
  var locator = By.xpath(`.//div[@id='${COMP_CONTAINER_ID[compNum]}']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[${colNum}]`);
  return this.getText(locator, 10000);
};

/****************************************************************************
** Occurrences & Streaks
*****************************************************************************/
TeamsPage.prototype.getStreaksTableHeader = function(col) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamsStreaksContainer']/table/thead/tr/th[${col}]`);
  return this.getText(locator);
};

TeamsPage.prototype.getStreaksTableStat = function(row, col) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamsStreaksContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator);
};

/****************************************************************************
** Play By Play
*****************************************************************************/
TeamsPage.prototype.getPlayByPlayTableStat = function(colNum) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamsPlayByPlayTotalsContainer']/table/tbody/tr/td[${colNum}]`);
  return this.getText(locator);
};

TeamsPage.prototype.getPlayByPlayFlatViewTableStat = function(rowNum, colNum) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamsPlayByPlayTableContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[${colNum}]`);
  return this.getText(locator);
};

TeamsPage.prototype.clickPlayByPlayFlatViewPlayVideoIcon = function(playNum) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamsPlayByPlayTableContainer']/table/tbody/tr[@data-tmn-row-type='row'][${playNum}]/td/tmn-video-icon`);
  return this.click(locator);
};

/****************************************************************************
** Scatterplot
*****************************************************************************/
TeamsPage.prototype.getScatterPlotTableHeader = function(col) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamsScatterContainer']/table/thead/tr/th[${col}]`);
  return this.getText(locator);
};

TeamsPage.prototype.getScatterPlotTableStat = function(row, col) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamsScatterContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator);
};


module.exports = TeamsPage;