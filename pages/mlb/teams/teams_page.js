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

var DROPDOWN_INPUT = By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input");

// Stats
var TEAM_NAME = By.css('h1.name');
var TEAM_TABLE = By.xpath(".//div[@id='tableBaseballTeamsStatsContainer']/table");

// ISO Mode
var ISO_BTN_ON = By.id('isoOnBtn');
var ISO_BTN_OFF = By.id('isoOffBtn');
var ISO_TEAM_SEARCH_INPUT = By.css('.table-isolation-controls input.tt-input');

// Histogram & ScatterChart
var CHART_COLUMNS_BTN = By.id('tableActive');
var HISTOGRAM_LINK = By.xpath(".//div[@class='chart-popover']/div[@class='chart'][1]/a");
var SCATTER_CHART_LINK = By.xpath(".//div[@class='chart-popover']/div[@class='chart'][2]/a");
var MODAL = By.xpath(".//div[@class='modal modal-chart in']/div/div[@class='modal-content']");
var MODAL_CLOSE_BTN = By.xpath(".//div[@class='modal modal-chart in']/div/div/div/button[@class='close']");
var TOOLTIP = By.css('.d3-tip.e');

// Group By
var GROUP_BY_SELECT = By.id("s2id_pageControlBaseballGroupBy");

// Stats View
var STATS_VIEW_SELECT = By.id("s2id_pageControlBaseballStatsViewTeams");
var CLEAR_PINS_BTN = By.css('button.table-clear-pinned');

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

// ISO Mode
TeamsPage.prototype.clickIsoBtn = function(onOrOff) {
  var locator = (onOrOff == "on") ? ISO_BTN_ON : ISO_BTN_OFF
  return this.click(locator);
};

TeamsPage.prototype.getIsoTableStat = function(teamNum, col) {
  // First 4 rows are for the headers
  var row = 4 + teamNum;
  var locator = By.xpath(`.//div[@id='tableBaseballTeamsStatsISOContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator);
};

TeamsPage.prototype.addTeamToIsoTable = function(teamName, selectionNum) {
  var selectionNum = selectionNum || 1;
  return this.selectFromSearch(ISO_TEAM_SEARCH_INPUT, teamName, selectionNum);
};

TeamsPage.prototype.getPinnedTotalTableStat = function(col) {
  var locator = By.xpath(`.//div[@id='tableBaseballTeamsStatsContainer']/table/tbody/tr[3]/td[${col}]`);
  return this.getText(locator);
};

// Pinning
TeamsPage.prototype.clickTeamTablePin = function(teamNum) {
  var row = 4 + teamNum;
  var locator = By.xpath(`.//div[@id='tableBaseballTeamsStatsContainer']/table/tbody/tr[${row}]/td/span[@class='table-pin fa fa-lg fa-thumb-tack']`);
  return this.click(locator);
};

TeamsPage.prototype.clearTeamTablePin = function() {
  return this.click(CLEAR_PINS_BTN);
};


// Chart/Edit Columns
TeamsPage.prototype.clickChartColumnsBtn = function() {
  // clicking button doesnt do anything if the team table isnt' visible
  this.driver.wait(Until.elementLocated(TEAM_TABLE));
  return this.click(CHART_COLUMNS_BTN);
};

TeamsPage.prototype.openHistogram = function(colNum) {
  this.clickTeamTableColumnHeader(colNum);
  return this.click(HISTOGRAM_LINK);
}

// @params selectionOne, selectionTwo -> column number of what you want as the x-axis & y-axis for the scatter chart
TeamsPage.prototype.openScatterChart = function(selectionOne, selectionTwo) {
  this.clickTeamTableColumnHeader(selectionOne);
  this.click(SCATTER_CHART_LINK);
  this.clickTeamTableColumnHeader(selectionTwo);
  return this.click(SCATTER_CHART_LINK);
};

TeamsPage.prototype.isModalDisplayed = function() {
  // timeout should be short bc the helper method will try to find the element for the duration of the timeout period
  return this.isDisplayed(MODAL, 2000);
};

TeamsPage.prototype.closeModal = function() {
  return this.click(MODAL_CLOSE_BTN);
};

TeamsPage.prototype.hoverOverHistogramStack = function(stackNum) {
  var locator = By.css(`.modal-dialog g.stack:nth-of-type(${stackNum})`);
  var thiz = this;

  this.driver.findElement(locator).then(function(elem) {
    thiz.driver.actions().mouseMove(elem).perform();
    thiz.driver.sleep(5000);
  });
};

TeamsPage.prototype.getTooltipText = function() {
  return this.getText(TOOLTIP);
};

// Pinned teams are represented by circles
TeamsPage.prototype.getHistogramCircleCount = function() {
  var d = Promise.defer();
  this.driver.findElements(By.css('.modal-dialog .focus-group circle')).then(function(circles) {
    d.fulfill(circles.length);
  });

  return d.promise;
};

TeamsPage.prototype.getHistogramBarCount = function() {
  var d = Promise.defer();
  this.driver.findElements(By.css('.modal-dialog g.stack rect')).then(function(rectangles) {
    d.fulfill(rectangles.length);
  });

  return d.promise;
};

TeamsPage.prototype.toggleHistogramDisplayPinsAsBars = function() {
  var locator = By.css('.modal-dialog .modal-footer input[name="histogramFocusDisplay"')
  return this.click(locator)
};

TeamsPage.prototype.changeHistogramBinCount = function(selection) {
  this.click(By.id('histogramBinCount'));
  var optionLocator = By.xpath(`.//select[@id='histogramBinCount']/option[text()="${selection}"]`);
  return this.click(optionLocator);
  // return this.waitUntilStaleness(LOADING_CONTAINER);
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