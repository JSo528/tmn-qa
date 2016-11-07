'use strict';

// Load Base Page
var BasePage = require('../../../pages/base/base_page.js');

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;

// Locators
var X_STAT_SELECT = By.id('s2id_pageControlBaseballScatterXStatType');
var Y_STAT_SELECT = By.id('s2id_pageControlBaseballScatterYStatType');
var GLOBAL_FILTER_SELECT = By.id('s2id_addFilter');
var X_AXIS_FILTER_SELECT = By.xpath(".//div[@id='xAxisFilters']/div/div/div/div/div/div[@id='s2id_addFilter']");
var Y_AXIS_FILTER_SELECT = By.xpath(".//div[@id='yAxisFilters']/div/div/div/div/div/div[@id='s2id_addFilter']");

var INPUT = By.xpath(".//div[@id='select2-drop']/div/input");

var GLOBAL_FILTER_UPDATE_BTN = By.xpath(".//div[@id='filterSet']/div/div/div/button[contains(@class,'update')]");
var X_AXIS_FILTER_UPDATE_BTN = By.xpath(".//div[@id='xAxisFilters']/div/div/div/button[contains(@class,'update')]");
var Y_AXIS_FILTER_UPDATE_BTN = By.xpath(".//div[@id='yAxisFilters']/div/div/div/button[contains(@class,'update')]");

var X_AXIS_FILTER_EXPANDER_BTN = By.xpath(".//div[@id='xAxisFilters']/div/div/div/a/i[contains(@class,'filter-set-expand')]");
var Y_AXIS_FILTER_EXPANDER_BTN = By.xpath(".//div[@id='yAxisFilters']/div/div/div/a/i[contains(@class,'filter-set-expand')]");

var SCATTER_PLOT_LOGO_ICON = By.css('svg.svgchart > g.root > g.data > g > image');

function ScatterPlotPage(driver) {
  BasePage.call(this, driver);
};

ScatterPlotPage.prototype = Object.create(BasePage.prototype);
ScatterPlotPage.prototype.constructor = ScatterPlotPage;

ScatterPlotPage.prototype.changeXStat = function(xStat) {
  return this.changeDropdown(X_STAT_SELECT, INPUT, xStat);
};

ScatterPlotPage.prototype.changeYStat = function(yStat) {
  return this.changeDropdown(Y_STAT_SELECT, INPUT, yStat);
};

ScatterPlotPage.prototype.addGlobalFilter = function(filter) {
  return this.changeDropdown(GLOBAL_FILTER_SELECT, INPUT, filter);
};

ScatterPlotPage.prototype.addXFilter = function(filter) {
  return this.changeDropdown(X_AXIS_FILTER_SELECT, INPUT, filter);
};

ScatterPlotPage.prototype.addYFilter = function(filter) {
  return this.changeDropdown(Y_AXIS_FILTER_SELECT, INPUT, filter);
};

ScatterPlotPage.prototype.removeGlobalFilter = function(filterNum) {
  var locator = By.xpath(`.//div[@id='filterSet']/div/div/div/div[${filterNum}]/div/span[contains(@class,'closer')]`);
  return this.removeFilter(locator, GLOBAL_FILTER_UPDATE_BTN);
};

ScatterPlotPage.prototype.removeXFilter = function(filterNum) {
  var locator = By.xpath(`.//div[@id='xAxisFilters']/div/div/div/div[${filterNum}]/div/span[contains(@class,'closer')]`);
  return this.removeFilter(locator, X_AXIS_FILTER_UPDATE_BTN);
};

ScatterPlotPage.prototype.removeYFilter = function(filterNum) {
  var locator = By.xpath(`.//div[@id='yAxisFilters']/div/div/div/div[${filterNum}]/div/span[contains(@class,'closer')]`);
  return this.removeFilter(locator, Y_AXIS_FILTER_UPDATE_BTN);
};

ScatterPlotPage.prototype.getTableHeader = function(col) {
  var locator = By.xpath(`.//div[@id='tableBaseballTeamsScatterContainer']/table/thead/tr/th[${col}]`);
  return this.getText(locator);
};

ScatterPlotPage.prototype.getTableStat = function(row, col) {
  var locator = By.xpath(`.//div[@id='tableBaseballTeamsScatterContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator);
};

ScatterPlotPage.prototype.openXAxisFilterContainer = function() {
  this.click(X_AXIS_FILTER_EXPANDER_BTN);
};

ScatterPlotPage.prototype.openYAxisFilterContainer = function() {
  this.click(Y_AXIS_FILTER_EXPANDER_BTN);
};

ScatterPlotPage.prototype.getPlotLogoIconCount = function() {
  return this.getElementCount(SCATTER_PLOT_LOGO_ICON);
};

module.exports = ScatterPlotPage;