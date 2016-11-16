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
var REPORT_SELECT = {
  'batting': By.id('s2id_reportNavBaseballPlayersStatBatting'),
  'pitching': By.id('s2id_reportNavBaseballPlayersStatPitching'),
  'catching': By.id('s2id_reportNavBaseballPlayersStatCatching'),
  'statcastFielding': By.id('s2id_reportNavBaseballPlayersStatStatcast')
}

var TABLE_ID = {
  'batting': 'tableBaseballPlayersStatsBattingContainer',
  'pitching': 'tableBaseballPlayersStatsPitchingContainer',
  'catching': 'tableBaseballPlayersStatsCatchingContainer',
  'statcastFielding': 'tableBaseballPlayersStatsStatcastContainer'
}

function StatsPage(driver, section) {
  BasePage.call(this, driver);
  this.section = section;
};

StatsPage.prototype = Object.create(BasePage.prototype);
StatsPage.prototype.constructor = StatsPage;

StatsPage.prototype.clickTableStat = function(playerNum, col) {
  // First 4 rows are for the headers
  var row = 4 + playerNum;
  var locator = By.xpath(`.//div[@id='${TABLE_ID[this.section]}']/table/tbody/tr[${row}]/td[${col}]`);
  return this.click(locator);
}

StatsPage.prototype.getTableStat = function(playerNum, col) {
  // First 4 rows are for the headers
  var row = 4 + playerNum;
  var locator = By.xpath(`.//div[@id='${TABLE_ID[this.section]}']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator, 30000);
}

StatsPage.prototype.getPlayerTableBgColor = function(playerNum, col) {
  // First 4 rows are for the headers
  var row = 4 + playerNum;
  var locator = By.xpath(`.//div[@id='${TABLE_ID[this.section]}']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getCssValue(locator, "background-color");
};

StatsPage.prototype.getPlayerTableHeader = function(col) {
  var locator = By.xpath(`.//div[@id='${TABLE_ID[this.section]}']/table/thead/tr/th[${col}]`);
  return this.getText(locator, 30000);
};

StatsPage.prototype.getIsoTableStat = function(playerNum, col) {
  // First 4 rows are for the headers
  var row = 4 + playerNum;
  var locator = By.xpath(`.//div[@id='tableBaseballPlayersStatsBattingISOContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator, 30000);
};

StatsPage.prototype.clickTableColumnHeader = function(col) {
  var locator = By.xpath(`.//div[@id='${TABLE_ID[this.section]}']/table/thead/tr/th[${col}]`);
  return this.click(locator); 
};

StatsPage.prototype.clickPlayerTablePin = function(playerNum) {
  var row = 4 + playerNum;
  var locator = By.xpath(`.//div[@id='${TABLE_ID[this.section]}']/table/tbody/tr[${row}]/td/span[@class='table-pin fa fa-lg fa-thumb-tack']`);
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

StatsPage.prototype.changeGroupBy = function(groupBy) {
  return this.changeDropdown(GROUP_BY_SELECT, DROPDOWN_INPUT, groupBy);
};

StatsPage.prototype.changeStatsView = function(statsView) {
  return this.changeDropdown(STATS_VIEW_SELECT, DROPDOWN_INPUT, statsView);
};

// Reports
StatsPage.prototype.changeReport = function(report) {
  return this.changeDropdown(REPORT_SELECT[this.section], DROPDOWN_INPUT, report);
};

module.exports = StatsPage;