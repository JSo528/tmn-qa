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
var chartColumns = require('../mixins/chartColumns.js');
var scatterPlot = require('../../mixins/scatterPlot.js');
var customReport = require('../mixins/customReport.js');
var playByPlay = require('../mixins/playByPlay.js');
/****************************************************************************
** Locators
*****************************************************************************/
var SECTION_NAMES = {
  'summary': 'Summary',
  'possessions': 'Possessions',
  'passes': 'Passes',
  'creativity': 'Creativity',
  'shots': 'Shots',
  'defence': 'Defence',
  'setPieces': 'Set Pieces',
  'goalkeeper': 'Goalkeeper',
  'discipline': 'Discipline'
};

var GROUP_BY_SELECT = By.id("s2id_pageControlSoccerGroupByPlayers");
var STATS_VIEW_SELECT = By.id("s2id_pageControlSoccerStatsViewPlayer");
var DROPDOWN_INPUT = By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input");
var DATA_TABLE = By.css('tmn-table#results-table > table:nth-of-type(1)');

function PlayersPage(driver) {
  BasePage.call(this, driver);
  this.section = 'summary'
};

PlayersPage.prototype = Object.create(BasePage.prototype);
PlayersPage.prototype.constructor = PlayersPage;

// Mixins
_.extend(PlayersPage.prototype, chartColumns);
_.extend(PlayersPage.prototype, scatterPlot);
_.extend(PlayersPage.prototype, customReport);
_.extend(PlayersPage.prototype, playByPlay);

/****************************************************************************
** Shared
*****************************************************************************/
PlayersPage.prototype.changeGroupBy = function(filter) {
  return this.changeDropdown(GROUP_BY_SELECT, DROPDOWN_INPUT, filter);
};

PlayersPage.prototype.changeStatsView = function(filter) {
  return this.changeDropdown(STATS_VIEW_SELECT, DROPDOWN_INPUT, filter);
};

PlayersPage.prototype.waitForTableToLoad = function() {
  this.waitUntilStaleness(DATA_TABLE, 1000);
  return this.waitForEnabled(DATA_TABLE, 10000);
};

PlayersPage.prototype.goToSection = function(section) {
  this.section = section;
  var locator = By.xpath(`.//div[@class='navbar-header']/ul/li/a[text()='${SECTION_NAMES[section]}']`);
  return this.click(locator);
};

/****************************************************************************
** Summary
*****************************************************************************/

PlayersPage.prototype.clickTableHeaderFor = function(colName) {
  var locator = By.xpath(`.//tmn-table[@id='results-table']/table[1]/thead/tr/th[@data-col-key="${colName}"]`);
  return this.click(locator);
};

PlayersPage.prototype.getTableStatsFor = function(colName) {
  var locator = By.xpath(`.//tmn-table[@id='results-table']/table[1]/tbody/tr[not(@is='tmn-table-tr-section')]/td[count(//tmn-table[@id='results-table']/table[1]/thead/tr/th[@data-col-key="${colName}"]/preceding-sibling::th)+1]`);
  return this.getTextArray(locator);
};

PlayersPage.prototype.getTableStatFor = function(rowNum, colName) {
  var locator = By.xpath(`.//tmn-table[@id='results-table']/table[1]/tbody/tr[not(@is='tmn-table-tr-section')][${rowNum}]/td[count(//tmn-table[@id='results-table']/table[1]/thead/tr/th[@data-col-key="${colName}"]/preceding-sibling::th)+1]`);
  return this.getText(locator);
};

PlayersPage.prototype.clickTableStatFor = function(rowNum, colName) {
  var locator = By.xpath(`.//tmn-table[@id='results-table']/table[1]/tbody/tr[not(@is='tmn-table-tr-section')][${rowNum}]/td[count(//tmn-table[@id='results-table']/table[1]/thead/tr/th[@data-col-key="${colName}"]/preceding-sibling::th)+1]/div/span`);
  return this.click(locator);
};

PlayersPage.prototype.getTableStatBgColor = function(rowNum, colName) {
  var locator = By.xpath(`.//tmn-table[@id='results-table']/table[1]/tbody/tr[not(@is='tmn-table-tr-section')]/td[count(//tmn-table[@id='results-table']/table[1]/thead/tr/th[@data-col-key="${colName}"]/preceding-sibling::th)+1]`);
  return this.getCssValue(locator, 'background-color');
};

module.exports = PlayersPage;