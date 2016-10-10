'use strict';

// Load Base Page
var BasePage = require('../../pages/base/base_page.js');

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
var GROUP_BY_INPUT = By.id("s2id_autogen1_search");
var STATS_VIEW_SELECT = By.id("s2id_pageControlBaseballStatsViewTeams");
var STATS_VIEW_INPUT = By.id("s2id_autogen2_search");
var REPORT_SELECT = By.id("s2id_reportNavBaseballTeamsStatBatting");
var REPORT_INPUT = By.id("s2id_autogen60_search");  
var FILTER_SELECT = By.id('s2id_addFilter');
var FILTER_INPUT = By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input");
var UPDATE_BUTTON = By.className('update');  
var LOADING_CONTAINER = By.id('loadingContainer');

function MlbTeamsPage(driver) {
  BasePage.call(this, driver);
};

MlbTeamsPage.prototype = Object.create(BasePage.prototype);
MlbTeamsPage.prototype.constructor = MlbTeamsPage;

MlbTeamsPage.prototype.getTeamTableStat = function(teamNum, col) {
  // First 4 rows are for the headers
  var row = 4 + teamNum;
  var locator = By.xpath(`.//div[@id='tableBaseballTeamsStatsContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator, 20000);
};

MlbTeamsPage.prototype.getTeamTableBgColor = function(teamNum, col) {
  // First 4 rows are for the headers
  var row = 4 + teamNum;
  var locator = By.xpath(`.//div[@id='tableBaseballTeamsStatsContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getCssValue(locator, "background-color");
};

MlbTeamsPage.prototype.getTeamTableHeader = function(col) {
  var locator = By.xpath(`.//div[@id='tableBaseballTeamsStatsContainer']/table/thead/tr/th[${col}]`);
  return this.getText(locator);
};

MlbTeamsPage.prototype.getIsoTableStat = function(teamNum, col) {
  // First 4 rows are for the headers
  var row = 4 + teamNum;
  var locator = By.xpath(`.//div[@id='tableBaseballTeamsStatsISOContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator);
};

MlbTeamsPage.prototype.clickTeamTableColumnHeader = function(col) {
  var locator = By.xpath(`.//div[@id='tableBaseballTeamsStatsContainer']/table/thead/tr/th[${col}]`);
  return this.click(locator); 
};


MlbTeamsPage.prototype.clickTeamTablePin = function(teamNum) {
  var row = 4 + teamNum;
  var locator = By.xpath(`.//div[@id='tableBaseballTeamsStatsContainer']/table/tbody/tr[${row}]/td/span[@class='table-pin fa fa-lg fa-thumb-tack']`);
  return this.click(locator);
};

MlbTeamsPage.prototype.clickIsoBtn = function(onOrOff) {
  var locator = (onOrOff == "on") ? ISO_BTN_ON : ISO_BTN_OFF
  return this.click(locator);
};

MlbTeamsPage.prototype.clickChartColumnsBtn = function() {
  // clicking button doesnt do anything if the team table isnt' visible
  this.driver.wait(Until.elementLocated(TEAM_TABLE));
  return this.click(CHART_COLUMNS_BTN);
};

MlbTeamsPage.prototype.clickHistogramLink = function() {
  return this.click(HISTOGRAM_LINK);
};

MlbTeamsPage.prototype.clickScatterChartLink = function() {
  return this.click(SCATTER_CHART_LINK); 
};

// @params selectionOne, selectionTwo -> column number of what you want as the x-axis & y-axis for the scatter chart
MlbTeamsPage.prototype.openScatterChart = function(selectionOne, selectionTwo) {
  this.clickTeamTableColumnHeader(selectionOne);
  this.click(SCATTER_CHART_LINK);
  this.clickTeamTableColumnHeader(selectionTwo);
  return this.click(SCATTER_CHART_LINK);
};

MlbTeamsPage.prototype.isModalDisplayed = function() {
  // timeout should be short bc the helper method will try to find the element for the duration of the timeout period
  return this.isDisplayed(MODAL, 2000);
};

MlbTeamsPage.prototype.closeModal = function() {
  return this.click(MODAL_CLOSE_BTN);
};

MlbTeamsPage.prototype.changeGroupBy = function(filter) {
  return this.changeDropdown(GROUP_BY_SELECT, GROUP_BY_INPUT, filter);
};

MlbTeamsPage.prototype.changeStatsView = function(filter) {
  return this.changeDropdown(STATS_VIEW_SELECT, STATS_VIEW_INPUT, filter);
};

MlbTeamsPage.prototype.changeReport = function(filter) {
  return this.changeDropdown(REPORT_SELECT, REPORT_INPUT, filter);
};

// Filters
MlbTeamsPage.prototype.addDropdownFilter = function(filter) {
  return this.changeDropdown(FILTER_SELECT, FILTER_INPUT, filter);
};

MlbTeamsPage.prototype.toggleSidebarFilter = function(filterName, selection) {
  var locator = By.xpath(`.//div[@id='common']/div/div/div[@class='row'][div[@class='col-md-4 filter-modal-entry-label']/h5[contains(text()[1], '${filterName}')]]/div[@class='col-md-8']/div/div/label[${selection}]`)
  return this.clickAndWait(locator, LOADING_CONTAINER);
};

MlbTeamsPage.prototype.closeDropdownFilter = function(filterNum) {
  var locator = By.xpath(`.//div[@class='col-md-8 activated']/div[${filterNum}]/div[@class='filter-header text-left']/span[@class='closer fa fa-2x fa-times-circle pull-right']`);
  return this.removeFilter(locator, UPDATE_BUTTON);
};

module.exports = MlbTeamsPage;