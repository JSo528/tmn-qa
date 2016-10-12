'use strict';

// Load Base Page
var BasePage = require('../../../pages/base/base_page.js');

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;

// Locators
var ISO_BTN_ON = By.id('isoOnBtn');
var ISO_BTN_OFF = By.id('isoOffBtn');
var CHART_COLUMNS_BTN = By.id('tableActive');
var HISTOGRAM_LINK = By.xpath(".//div[@class='chart-popover']/div[@class='chart'][1]/a");
var SCATTER_CHART_LINK = By.xpath(".//div[@class='chart-popover']/div[@class='chart'][2]/a");
var MODAL = By.xpath(".//div[@class='modal modal-chart in']/div/div[@class='modal-content']");
var MODAL_CLOSE_BTN = By.xpath(".//div[@class='modal modal-chart in']/div/div/div/button[@class='close']");
var TEAM_TABLE = By.xpath(".//div[@id='tableBaseballTeamsStatsContainer']/table");
var GROUP_BY_SELECT = By.id("s2id_pageControlBaseballGroupBy");
var STATS_VIEW_SELECT = By.id("s2id_pageControlBaseballStatsViewTeams");
var FILTER_SELECT = By.id('s2id_addFilter');
var DROPDOWN_INPUT = By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input");
var UPDATE_BUTTON = By.className('update');  
var LOADING_CONTAINER = By.id('loadingContainer');

var BATTING_REPORT_SELECT = By.id("s2id_reportNavBaseballTeamsStatBatting");
var PITCHING_REPORT_SELECT = By.id("s2id_reportNavBaseballTeamsStatPitching");
var CATCHING_REPORT_SELECT = By.id("s2id_reportNavBaseballTeamsStatTeamcatching");
var STATCAST_FIELDING_REPORT_SELECT = By.id("s2id_reportNavBaseballTeamsStatStatcast");

function StatsPage(driver) {
  BasePage.call(this, driver);
};

StatsPage.prototype = Object.create(BasePage.prototype);
StatsPage.prototype.constructor = StatsPage;


StatsPage.prototype.getTeamTableStat = function(teamNum, col) {
  // First 4 rows are for the headers
  var row = 4 + teamNum;
  var locator = By.xpath(`.//div[@id='tableBaseballTeamsStatsContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator, 20000);
};

StatsPage.prototype.getTeamTableBgColor = function(teamNum, col) {
  // First 4 rows are for the headers
  var row = 4 + teamNum;
  var locator = By.xpath(`.//div[@id='tableBaseballTeamsStatsContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getCssValue(locator, "background-color");
};

StatsPage.prototype.getTeamTableHeader = function(col) {
  var locator = By.xpath(`.//div[@id='tableBaseballTeamsStatsContainer']/table/thead/tr/th[${col}]`);
  return this.getText(locator);
};

StatsPage.prototype.getIsoTableStat = function(teamNum, col) {
  // First 4 rows are for the headers
  var row = 4 + teamNum;
  var locator = By.xpath(`.//div[@id='tableBaseballTeamsStatsISOContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator);
};

StatsPage.prototype.clickTeamTableColumnHeader = function(col) {
  var locator = By.xpath(`.//div[@id='tableBaseballTeamsStatsContainer']/table/thead/tr/th[${col}]`);
  return this.click(locator); 
};


StatsPage.prototype.clickTeamTablePin = function(teamNum) {
  var row = 4 + teamNum;
  var locator = By.xpath(`.//div[@id='tableBaseballTeamsStatsContainer']/table/tbody/tr[${row}]/td/span[@class='table-pin fa fa-lg fa-thumb-tack']`);
  return this.click(locator);
};

StatsPage.prototype.clickIsoBtn = function(onOrOff) {
  var locator = (onOrOff == "on") ? ISO_BTN_ON : ISO_BTN_OFF
  return this.click(locator);
};

StatsPage.prototype.clickChartColumnsBtn = function() {
  // clicking button doesnt do anything if the team table isnt' visible
  this.driver.wait(Until.elementLocated(TEAM_TABLE));
  return this.click(CHART_COLUMNS_BTN);
};

StatsPage.prototype.clickHistogramLink = function() {
  return this.click(HISTOGRAM_LINK);
};

StatsPage.prototype.clickScatterChartLink = function() {
  return this.click(SCATTER_CHART_LINK); 
};

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

StatsPage.prototype.changeGroupBy = function(filter) {
  return this.changeDropdown(GROUP_BY_SELECT, DROPDOWN_INPUT, filter);
};

StatsPage.prototype.changeStatsView = function(filter) {
  return this.changeDropdown(STATS_VIEW_SELECT, DROPDOWN_INPUT, filter);
};

// Filters
StatsPage.prototype.addDropdownFilter = function(filter) {
  return this.changeDropdown(FILTER_SELECT, DROPDOWN_INPUT, filter);
};

StatsPage.prototype.toggleSidebarFilter = function(filterName, selection) {
  var locator = By.xpath(`.//div[@id='common']/div/div/div[@class='row'][div[@class='col-md-4 filter-modal-entry-label']/h5[contains(text()[1], '${filterName}')]]/div[@class='col-md-8']/div/div/label[${selection}]`)
  return this.clickAndWait(locator, LOADING_CONTAINER);
};

StatsPage.prototype.closeDropdownFilter = function(filterNum) {
  var locator = By.xpath(`.//div[@class='col-md-8 activated']/div[${filterNum}]/div[@class='filter-header text-left']/span[@class='closer fa fa-2x fa-times-circle pull-right']`);
  return this.removeFilter(locator, UPDATE_BUTTON);
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