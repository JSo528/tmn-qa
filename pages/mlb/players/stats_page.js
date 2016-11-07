'use strict';

// Load Base Page
var BasePage = require('../../../pages/base/base_page.js');

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;
var Key = require('selenium-webdriver').Key;

// Locators
var GROUP_BY_SELECT = By.id("s2id_pageControlBaseballPlayersGroupBy");
var STATS_VIEW_SELECT = By.id("s2id_pageControlBaseballStatsViewPlayers");
var QUALIFY_BY_SELECT = By.id("s2id_pageControlBaseballQualifyByBatting");
var QUALIFY_BY_STAT_SELECT = By.id("s2id_pageControlBaseballQualifyByBattingStats");
var QUALIFY_BY_INPUT = By.id("pageControlBaseballQualifyByBattingInput");
var QUALIFY_BY_SUBMIT = By.css(".pc-qualify-by > button");

var DROPDOWN_INPUT = By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input");

var BATTING_REPORT_SELECT = By.id("s2id_reportNavBaseballPlayersStatBatting");
var PITCHING_REPORT_SELECT = By.id("s2id_reportNavBaseballPlayersStatPitching");
var CATCHING_REPORT_SELECT = By.id("s2id_reportNavBaseballPlayersStatCatching");
var STATCAST_FIELDING_REPORT_SELECT = By.id("s2id_reportNavBaseballPlayersStatStatcast");

function StatsPage(driver) {
  BasePage.call(this, driver);
};

StatsPage.prototype = Object.create(BasePage.prototype);
StatsPage.prototype.constructor = StatsPage;


StatsPage.prototype.getBatterTableStat = function(playerNum, col) {
  // First 4 rows are for the headers
  var row = 4 + playerNum;
  var locator = By.xpath(`.//div[@id='tableBaseballPlayersStatsBattingContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator, 30000);
};

StatsPage.prototype.getPitcherTableStat = function(playerNum, col) {
  // First 4 rows are for the headers
  var row = 4 + playerNum;
  var locator = By.xpath(`.//div[@id='tableBaseballPlayersStatsPitchingContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator, 30000);
};

StatsPage.prototype.getCatcherTableStat = function(playerNum, col) {
  // First 4 rows are for the headers
  var row = 4 + playerNum;
  var locator = By.xpath(`.//div[@id='tableBaseballPlayersStatsCatchingContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator, 30000);
};

StatsPage.prototype.getStatcastTableStat = function(playerNum, col) {
  // First 4 rows are for the headers
  var row = 4 + playerNum;
  var locator = By.xpath(`.//div[@id='tableBaseballPlayersStatsStatcastContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator, 30000);
};

StatsPage.prototype.getPlayerTableBgColor = function(playerNum, col) {
  // First 4 rows are for the headers
  var row = 4 + playerNum;
  var locator = By.xpath(`.//div[@id='tableBaseballPlayersStatsBattingContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getCssValue(locator, "background-color");
};

StatsPage.prototype.getPlayerTableHeader = function(col) {
  var locator = By.xpath(`.//div[@id='tableBaseballPlayersStatsBattingContainer']/table/thead/tr/th[${col}]`);
  return this.getText(locator, 30000);
};

StatsPage.prototype.getIsoTableStat = function(playerNum, col) {
  // First 4 rows are for the headers
  var row = 4 + playerNum;
  var locator = By.xpath(`.//div[@id='tableBaseballPlayersStatsBattingISOContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator, 30000);
};

StatsPage.prototype.clickBatterTableColumnHeader = function(col) {
  var locator = By.xpath(`.//div[@id='tableBaseballPlayersStatsBattingContainer']/table/thead/tr/th[${col}]`);
  return this.click(locator); 
};

StatsPage.prototype.clickPitcherTableColumnHeader = function(col) {
  var locator = By.xpath(`.//div[@id='tableBaseballPlayersStatsPitchingContainer']/table/thead/tr/th[${col}]`);
  return this.click(locator); 
};


StatsPage.prototype.clickPlayerTablePin = function(playerNum) {
  var row = 4 + playerNum;
  var locator = By.xpath(`.//div[@id='tableBaseballPlayersStatsBattingContainer']/table/tbody/tr[${row}]/td/span[@class='table-pin fa fa-lg fa-thumb-tack']`);
  return this.click(locator);
};

StatsPage.prototype.changeQualifyBy = function(filter, stat, input) {
  if (filter == "Custom") {
    this.changeDropdown(QUALIFY_BY_SELECT, DROPDOWN_INPUT, filter);
    this.changeDropdown(QUALIFY_BY_STAT_SELECT, DROPDOWN_INPUT, stat);
    this.sendKeys(QUALIFY_BY_INPUT, input);
    return this.click(QUALIFY_BY_SUBMIT);
  } else {
    return this.changeDropdown(QUALIFY_BY_SELECT, DROPDOWN_INPUT, filter);  
  }
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