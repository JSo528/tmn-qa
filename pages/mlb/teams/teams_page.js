'use strict';

// Load Base Page
var BasePage = require('../../../pages/base/base_page.js');

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;

// Mixins
var _ = require('underscore');
var videoPlaylist = require('../mixins/videoPlaylist.js');
var occurrencesAndStreaks = require('../mixins/occurrencesAndStreaks.js');
var scatterPlot = require('../mixins/scatterPlot.js');
var chartColumns = require('../mixins/chartColumns.js');

/****************************************************************************
** Locators
*****************************************************************************/
var REPORT_SELECT = {
  'batting': By.id('s2id_reportNavBaseballTeamsStatBatting'),
  'pitching': By.id('s2id_reportNavBaseballTeamsStatPitching'),
  'catching': By.id('s2id_reportNavBaseballTeamsStatTeamcatching'),
  'statcastFielding': By.id('s2id_reportNavBaseballTeamsStatStatcast')
};

var SECTION_TITLE = {
  'batting': 'Batting',
  'pitching': 'Pitching',
  'catching': 'Catching',
  'statcastFielding': 'Statcast Fielding'
};

var SUB_SECTION_TITLE = {
  'stats': 'Stats',
  'occurrencesAndStreaks': 'Occurrences & Streaks',
  'scatterPlot': 'Scatter Plot'
};

var GROUP_BY_SELECT = By.id("s2id_pageControlBaseballGroupBy");
var STATS_VIEW_SELECT = By.id("s2id_pageControlBaseballStatsViewTeams");
var DROPDOWN_INPUT = By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input");

// Stats
var TEAM_NAME = By.css('h1.name');
var TEAM_TABLE = By.xpath(".//div[@id='tableBaseballTeamsStatsContainer']/table");

// Data Comparison
var STATS_TABLE = By.xpath(".//div[@id='tableBaseballTeamsStatsContainer']/table");
var STREAKS_TABLE = By.xpath(".//div[2]/div/div/div/div/table");

/****************************************************************************
** Constructor
*****************************************************************************/
function TeamsPage(driver, section, subSection) {
  BasePage.call(this, driver);
  this.section = section || 'batting';
  this.subSection = subSection || 'stats';
};

TeamsPage.prototype = Object.create(BasePage.prototype);
TeamsPage.prototype.constructor = TeamsPage;

// Mixins
_.extend(TeamsPage.prototype, occurrencesAndStreaks);
_.extend(TeamsPage.prototype, scatterPlot);
_.extend(TeamsPage.prototype, videoPlaylist);
_.extend(TeamsPage.prototype, chartColumns);

TeamsPage.prototype.DEFAULT_CHART_COLUMNS_DATA_TABLE_ID = 'tableBaseballTeamsStatsContainer';
TeamsPage.prototype.DEFAULT_CHART_COLUMNS_ISO_TABLE_ID = 'tableBaseballTeamsStatsISOContainer';
/****************************************************************************
** Controls
*****************************************************************************/
TeamsPage.prototype.goToSection = function(section) {
  this.section = section;
  var sectionLink = By.xpath(`.//nav[contains(@class, 'navbar-blue')]/.//li/a[text()='${SECTION_TITLE[section]}']`);
  this.click(sectionLink);
  return this.waitForEnabled(REPORT_SELECT[this.section], 30000);
};

TeamsPage.prototype.goToSubSection = function(subSection) {
  this.subSection = subSection
  var locator = By.xpath(`.//nav[contains(@class, 'report-nav')]/.//a[text()='${SUB_SECTION_TITLE[subSection]}']`);
  return this.click(locator);
};

TeamsPage.prototype.changeReport = function(report) {
  this.changeDropdown(REPORT_SELECT[this.section], DROPDOWN_INPUT, report);
  return this.waitForEnabled(REPORT_SELECT[this.section], 30000);
};

/****************************************************************************
** Stats
*****************************************************************************/
TeamsPage.prototype.getTeamTableStat = function(teamNum, col) {
  // First 4 rows are for the headers
  var row = 4 + teamNum;
  var locator = By.xpath(`.//div[@id='tableBaseballTeamsStatsContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator, 30000);
};

TeamsPage.prototype.getTeamTableBgColor = function(teamNum, col) {
  // First 4 rows are for the headers
  var row = 4 + teamNum;
  var locator = By.xpath(`.//div[@id='tableBaseballTeamsStatsContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getCssValue(locator, "background-color");
};

TeamsPage.prototype.getTeamTableHeader = function(col) {
  var locator = By.xpath(`.//div[@id='tableBaseballTeamsStatsContainer']/table/thead/tr/th[${col}]`);
  return this.getText(locator, 30000);
};

TeamsPage.prototype.clickTeamTableColumnHeader = function(col) {
  var locator = By.xpath(`.//div[@id='tableBaseballTeamsStatsContainer']/table/thead/tr/th[${col}]`);
  this.waitForEnabled(locator);
  return this.click(locator); 
};

TeamsPage.prototype.clickTeamTableCell = function(teamNum, col) {
  // First 4 rows are for the headers
  var row = 4 + teamNum;
  var locator = By.xpath(`.//div[@id='tableBaseballTeamsStatsContainer']/table/tbody/tr[${row}]/td[${col}]/a`);
  return this.click(locator); 
};

TeamsPage.prototype.clickTeamTableStat = function(teamNum, col) {
  // First 4 rows are for the headers
  var row = 4 + teamNum;
  var locator = By.xpath(`.//div[@id='tableBaseballTeamsStatsContainer']/table/tbody/tr[${row}]/td[${col}]/span`);
  return this.click(locator); 
};

TeamsPage.prototype.changeGroupBy = function(filter) {
  return this.changeDropdown(GROUP_BY_SELECT, DROPDOWN_INPUT, filter);
};

TeamsPage.prototype.changeStatsView = function(filter) {
  return this.changeDropdown(STATS_VIEW_SELECT, DROPDOWN_INPUT, filter);
};

/****************************************************************************
** Occurrences & Streaks
*****************************************************************************/
TeamsPage.prototype.getStreaksTableHeader = function(col) {
  var locator = By.xpath(`.//div[@id='tableBaseballTeamsStreaksContainer']/table/thead/tr/th[${col}]`);
  return this.getText(locator);
};

TeamsPage.prototype.getStreaksTableStat = function(row, col) {
  var locator = By.xpath(`.//div[@id='tableBaseballTeamsStreaksContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator);
};

/****************************************************************************
** Scatterplot
*****************************************************************************/
TeamsPage.prototype.getScatterPlotTableHeader = function(col) {
  var locator = By.xpath(`.//div[@id='tableBaseballTeamsScatterContainer']/table/thead/tr/th[${col}]`);
  return this.getText(locator);
};

TeamsPage.prototype.getScatterPlotTableStat = function(row, col) {
  var locator = By.xpath(`.//div[@id='tableBaseballTeamsScatterContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator);
};

/****************************************************************************
** Data Comparison
*****************************************************************************/
TeamsPage.prototype.statsTable = STATS_TABLE;
TeamsPage.prototype.streaksTable = STREAKS_TABLE;

module.exports = TeamsPage;