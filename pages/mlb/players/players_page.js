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
  'batting': By.id('s2id_reportNavBaseballPlayersStatBatting'),
  'pitching': By.id('s2id_reportNavBaseballPlayersStatPitching'),
  'catching': By.id('s2id_reportNavBaseballPlayersStatCatching'),
  'statcastFielding': By.id('s2id_reportNavBaseballPlayersStatStatcast')
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

var DROPDOWN_INPUT = By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input");

// Stats
var STATS_TABLE_ID = {
  'batting': 'tableBaseballPlayersStatsBattingContainer',
  'pitching': 'tableBaseballPlayersStatsPitchingContainer',
  'catching': 'tableBaseballPlayersStatsCatchingContainer',
  'statcastFielding': 'tableBaseballPlayersStatsStatcastContainer'
};

var GROUP_BY_SELECT = By.id("s2id_pageControlBaseballPlayersGroupBy");
var STATS_VIEW_SELECT = By.id("s2id_pageControlBaseballStatsViewPlayers");
var QUALIFY_BY_SELECT = By.id("s2id_pageControlBaseballQualifyByBatting");
var QUALIFY_BY_STAT_SELECT = By.id("s2id_pageControlBaseballQualifyByBattingStats");
var QUALIFY_BY_INPUT = By.id("pageControlBaseballQualifyByBattingInput");
var QUALIFY_BY_SUBMIT = By.css(".pc-qualify-by > button");

// Occurences & Streaks
var CONSTRAINT_STAT_SELECT = By.id('s2id_pageControlBaseballStrkConstraintStatPlayer');
var STREAK_GROUPING_SELECT = By.id('s2id_pageControlBaseballStrkGroupingPlayer');


/****************************************************************************
** Constructor
*****************************************************************************/
function PlayersPage(driver, section, subSection) {
  BasePage.call(this, driver);
  this.section = section || 'batting';
  this.subSection = subSection || 'stats';
}

PlayersPage.prototype = Object.create(BasePage.prototype);
PlayersPage.prototype.constructor = PlayersPage;

// Mixins
_.extend(PlayersPage.prototype, videoPlaylist);
_.extend(PlayersPage.prototype, occurrencesAndStreaks);
_.extend(PlayersPage.prototype, scatterPlot);
_.extend(PlayersPage.prototype, chartColumns);

PlayersPage.prototype.DEFAULT_CHART_COLUMNS_DATA_TABLE_ID = STATS_TABLE_ID;
PlayersPage.prototype.DEFAULT_CHART_COLUMNS_ISO_TABLE_ID = {
  'batting': 'tableBaseballPlayersStatsBattingISOContainer',
  'pitching': 'tableBaseballPlayersStatsPitchingISOContainer',
  'catching': 'tableBaseballPlayersStatsCatchingISOContainer',
  'statcastFielding': 'tableBaseballPlayersStatsStatcastISOContainer'
}

/****************************************************************************
** Controls
*****************************************************************************/
PlayersPage.prototype.goToSection = function(section) {
  this.section = section;
  var sectionLink = By.xpath(`.//nav[contains(@class, 'navbar-blue')]/.//li/a[text()='${SECTION_TITLE[section]}']`);
  this.click(sectionLink);
  return this.waitForEnabled(REPORT_SELECT[this.section], 30000);
};

PlayersPage.prototype.goToSubSection = function(subSection) {
  this.subSection = subSection;
  var locator = By.xpath(`.//nav[contains(@class, 'report-nav')]/.//a[text()='${SUB_SECTION_TITLE[subSection]}']`);
  return this.click(locator);
};

PlayersPage.prototype.changeReport = function(report) {
  return this.changeDropdown(REPORT_SELECT[this.section], DROPDOWN_INPUT, report);
};

PlayersPage.prototype.waitForTableToLoad = function() {
  var locator = By.id(STATS_TABLE_ID[this.section]);
  this.waitUntilStaleness(locator, 10000);
  return this.waitForEnabled(locator, 10000);
};

/****************************************************************************
** Stats
*****************************************************************************/
PlayersPage.prototype.goToPlayerPage = function(playerNum) {
  // First 4 rows are for the headers
  var row = 4 + playerNum;
  var locator = By.xpath(`.//div[@id='${STATS_TABLE_ID[this.section]}']/table/tbody/tr[${row}]/td[3]/a`);
  return this.click(locator);
};

PlayersPage.prototype.clickTableStat = function(playerNum, col) {
  // First 4 rows are for the headers
  var row = 4 + playerNum;
  var locator = By.xpath(`.//div[@id='${STATS_TABLE_ID[this.section]}']/table/tbody/tr[${row}]/td[${col}]/span`);
  return this.click(locator);
};

PlayersPage.prototype.getTableStat = function(playerNum, col) {
  // First 4 rows are for the headers
  var row = 4 + playerNum;
  var locator = By.xpath(`.//div[@id='${STATS_TABLE_ID[this.section]}']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator, 30000);
};

PlayersPage.prototype.getPlayerTableBgColor = function(playerNum, col) {
  // First 4 rows are for the headers
  var row = 4 + playerNum;
  var locator = By.xpath(`.//div[@id='${STATS_TABLE_ID[this.section]}']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getCssValue(locator, "background-color");
};

PlayersPage.prototype.getPlayerTableHeader = function(col) {
  var locator = By.xpath(`.//div[@id='${STATS_TABLE_ID[this.section]}']/table/thead/tr/th[${col}]`);
  return this.getText(locator, 30000);
};

PlayersPage.prototype.clickTableColumnHeader = function(col) {
  var locator = By.xpath(`.//div[@id='${STATS_TABLE_ID[this.section]}']/table/thead/tr/th[${col}]`);
  return this.click(locator); 
};

PlayersPage.prototype.getTableStatsForCol = function(col) {
  var locator = By.xpath(`.//div[@id='${STATS_TABLE_ID[this.section]}']/table/tbody/tr[@data-tmn-row-type="row"]/td[${col}]`);
  return this.getTextArray(locator);
};

PlayersPage.prototype.changeQualifyBy = function(filter, stat, input) {
  if (filter == "Custom") {
    this.changeDropdown(QUALIFY_BY_SELECT, DROPDOWN_INPUT, filter);
    this.changeDropdown(QUALIFY_BY_STAT_SELECT, DROPDOWN_INPUT, stat);
    this.sendKeys(QUALIFY_BY_INPUT, input);
    return this.click(QUALIFY_BY_SUBMIT);
  } else {
    return this.changeDropdown(QUALIFY_BY_SELECT, DROPDOWN_INPUT, filter);  
  }
};

PlayersPage.prototype.changeGroupBy = function(groupBy) {
  return this.changeDropdown(GROUP_BY_SELECT, DROPDOWN_INPUT, groupBy);
};

PlayersPage.prototype.changeStatsView = function(statsView) {
  return this.changeDropdown(STATS_VIEW_SELECT, DROPDOWN_INPUT, statsView);
};

/****************************************************************************
** Occurrences & Streaks
*****************************************************************************/
PlayersPage.prototype.constraintStatSelect = function() {
  return CONSTRAINT_STAT_SELECT;
};

PlayersPage.prototype.streakGroupingSelect = function() {
  return STREAK_GROUPING_SELECT;
};

PlayersPage.prototype.getStreaksTableHeader = function(col) {
  var locator = By.xpath(`.//div[@id='tableBaseballPlayersStreaksContainer']/table/thead/tr/th[${col}]`);
  return this.getText(locator);
};

PlayersPage.prototype.getStreaksTableStat = function(row, col) {
  var locator = By.xpath(`.//div[@id='tableBaseballPlayersStreaksContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator, 30000);
};

/****************************************************************************
** Scatterplot
*****************************************************************************/
PlayersPage.prototype.getScatterPlotTableHeader = function(col) {
  var locator = By.xpath(`.//div[@id='tableBaseballPlayersScatterContainer']/table/thead/tr/th[${col}]`);
  return this.getText(locator);
};

PlayersPage.prototype.getScatterPlotTableStat = function(row, col) {
  var locator = By.xpath(`.//div[@id='tableBaseballPlayersScatterContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator);
};

/****************************************************************************
** Data Comparison
*****************************************************************************/
PlayersPage.prototype.statsTable = STATS_TABLE_ID[this.section];

module.exports = PlayersPage;
