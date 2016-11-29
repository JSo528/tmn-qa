'use strict';

// Load Base Page
var BasePage = require('../../../pages/base/base_page.js');

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;

// Locators
// ISO Mode
var ISO_BTN_ON = By.id('isoOnBtn');
var ISO_BTN_OFF = By.id('isoOffBtn');
var ISO_TEAM_SEARCH_INPUT = By.css('.table-isolation-controls input.tt-input');

var CHART_COLUMNS_BTN = By.id('tableActive');
var HISTOGRAM_LINK = By.xpath(".//div[@class='chart-popover']/div[@class='chart'][1]/a");
var SCATTER_CHART_LINK = By.xpath(".//div[@class='chart-popover']/div[@class='chart'][2]/a");
var MODAL = By.xpath(".//div[@class='modal modal-chart in']/div/div[@class='modal-content']");
var MODAL_CLOSE_BTN = By.xpath(".//div[@class='modal modal-chart in']/div/div/div/button[@class='close']");
var TEAM_TABLE = By.xpath(".//div[@id='tableBaseballTeamsStatsContainer']/table");
var GROUP_BY_SELECT = By.id("s2id_pageControlBaseballGroupBy");
var STATS_VIEW_SELECT = By.id("s2id_pageControlBaseballStatsViewTeams");
var DROPDOWN_INPUT = By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input");
var CLEAR_PINS_BTN = By.css('button.table-clear-pinned');
var BATTING_REPORT_SELECT = By.id("s2id_reportNavBaseballTeamsStatBatting");
var PITCHING_REPORT_SELECT = By.id("s2id_reportNavBaseballTeamsStatPitching");
var CATCHING_REPORT_SELECT = By.id("s2id_reportNavBaseballTeamsStatTeamcatching");
var STATCAST_FIELDING_REPORT_SELECT = By.id("s2id_reportNavBaseballTeamsStatStatcast");

var TOOLTIP = By.css('.d3-tip.e');

function StatsPage(driver) {
  BasePage.call(this, driver);
};

StatsPage.prototype = Object.create(BasePage.prototype);
StatsPage.prototype.constructor = StatsPage;


StatsPage.prototype.getTeamTableStat = function(teamNum, col) {
  // First 4 rows are for the headers
  var row = 4 + teamNum;
  var locator = By.xpath(`.//div[@id='tableBaseballTeamsStatsContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator, 30000);
};

StatsPage.prototype.getTeamTableBgColor = function(teamNum, col) {
  // First 4 rows are for the headers
  var row = 4 + teamNum;
  var locator = By.xpath(`.//div[@id='tableBaseballTeamsStatsContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getCssValue(locator, "background-color");
};

StatsPage.prototype.getTeamTableHeader = function(col) {
  var locator = By.xpath(`.//div[@id='tableBaseballTeamsStatsContainer']/table/thead/tr/th[${col}]`);
  return this.getText(locator, 30000);
};

StatsPage.prototype.clickTeamTableColumnHeader = function(col) {
  var locator = By.xpath(`.//div[@id='tableBaseballTeamsStatsContainer']/table/thead/tr/th[${col}]`);
  this.waitForEnabled(locator);
  return this.click(locator); 
};

StatsPage.prototype.clickTeamTableCell = function(teamNum, col) {
  // First 4 rows are for the headers
  var row = 4 + teamNum;
  var locator = By.xpath(`.//div[@id='tableBaseballTeamsStatsContainer']/table/tbody/tr[${row}]/td[${col}]/a`);
  return this.click(locator); 
};

// ISO Mode
StatsPage.prototype.clickIsoBtn = function(onOrOff) {
  var locator = (onOrOff == "on") ? ISO_BTN_ON : ISO_BTN_OFF
  return this.click(locator);
};

StatsPage.prototype.getIsoTableStat = function(teamNum, col) {
  // First 4 rows are for the headers
  var row = 4 + teamNum;
  var locator = By.xpath(`.//div[@id='tableBaseballTeamsStatsISOContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator);
};

StatsPage.prototype.addTeamToIsoTable = function(teamName, selectionNum) {
  var selectionNum = selectionNum || 1;
  return this.selectFromSearch(ISO_TEAM_SEARCH_INPUT, teamName, selectionNum);
};

StatsPage.prototype.getPinnedTotalTableStat = function(col) {
  var locator = By.xpath(`.//div[@id='tableBaseballTeamsStatsContainer']/table/tbody/tr[3]/td[${col}]`);
  return this.getText(locator);
};

// Pinning
StatsPage.prototype.clickTeamTablePin = function(teamNum) {
  var row = 4 + teamNum;
  var locator = By.xpath(`.//div[@id='tableBaseballTeamsStatsContainer']/table/tbody/tr[${row}]/td/span[@class='table-pin fa fa-lg fa-thumb-tack']`);
  return this.click(locator);
};

StatsPage.prototype.clearTeamTablePin = function() {
  return this.click(CLEAR_PINS_BTN);
};


// Chart/Edit Columns
StatsPage.prototype.clickChartColumnsBtn = function() {
  // clicking button doesnt do anything if the team table isnt' visible
  this.driver.wait(Until.elementLocated(TEAM_TABLE));
  return this.click(CHART_COLUMNS_BTN);
};

StatsPage.prototype.openHistogram = function(colNum) {
  this.clickTeamTableColumnHeader(colNum);
  return this.click(HISTOGRAM_LINK);
}

// @params selectionOne, selectionTwo -> column number of what you want as the x-axis & y-axis for the scatter chart
StatsPage.prototype.openScatterChart = function(selectionOne, selectionTwo) {
  this.clickTeamTableColumnHeader(selectionOne);
  this.click(SCATTER_CHART_LINK);
  this.clickTeamTableColumnHeader(selectionTwo);
  return this.click(SCATTER_CHART_LINK);
};

StatsPage.prototype.isModalDisplayed = function() {
  // timeout should be short bc the helper method will try to find the element for the duration of the timeout period
  return this.isDisplayed(MODAL, 2000);
};

StatsPage.prototype.closeModal = function() {
  return this.click(MODAL_CLOSE_BTN);
};

StatsPage.prototype.hoverOverHistogramStack = function(stackNum) {
  var locator = By.css(`.modal-dialog g.stack:nth-of-type(${stackNum})`);
  var thiz = this;

  this.driver.findElement(locator).then(function(elem) {
    thiz.driver.actions().mouseMove(elem).perform();
    thiz.driver.sleep(5000);
  });
};

StatsPage.prototype.getTooltipText = function() {
  return this.getText(TOOLTIP);
};

// Pinned teams are represented by circles
StatsPage.prototype.getHistogramCircleCount = function() {
  var d = Promise.defer();
  this.driver.findElements(By.css('.modal-dialog .focus-group circle')).then(function(circles) {
    d.fulfill(circles.length);
  });

  return d.promise;
};

StatsPage.prototype.getHistogramBarCount = function() {
  var d = Promise.defer();
  this.driver.findElements(By.css('.modal-dialog g.stack rect')).then(function(rectangles) {
    d.fulfill(rectangles.length);
  });

  return d.promise;
};

StatsPage.prototype.toggleHistogramDisplayPinsAsBars = function() {
  var locator = By.css('.modal-dialog .modal-footer input[name="histogramFocusDisplay"')
  return this.click(locator)
};

StatsPage.prototype.changeHistogramBinCount = function(selection) {
  this.click(By.id('histogramBinCount'));
  var optionLocator = By.xpath(`.//select[@id='histogramBinCount']/option[text()="${selection}"]`);
  return this.click(optionLocator);
  // return this.waitUntilStaleness(LOADING_CONTAINER);
};

StatsPage.prototype.changeGroupBy = function(filter) {
  return this.changeDropdown(GROUP_BY_SELECT, DROPDOWN_INPUT, filter);
};

StatsPage.prototype.changeStatsView = function(filter) {
  return this.changeDropdown(STATS_VIEW_SELECT, DROPDOWN_INPUT, filter);
};

// Reports
StatsPage.prototype.changeBattingReport = function(filter) {
  return this.changeDropdown(BATTING_REPORT_SELECT, DROPDOWN_INPUT, filter);
};

StatsPage.prototype.changePitchingReport = function(filter) {
  return this.changeDropdown(PITCHING_REPORT_SELECT, DROPDOWN_INPUT, filter);
};

StatsPage.prototype.changeCatchingReport = function(filter) {
  return this.changeDropdown(CATCHING_REPORT_SELECT, DROPDOWN_INPUT, filter);
};

StatsPage.prototype.changeStatcastFieldingReport = function(filter) {
  return this.changeDropdown(STATCAST_FIELDING_REPORT_SELECT, DROPDOWN_INPUT, filter);
};

module.exports = StatsPage;