'use strict';

// Load Base Page
var BasePage = require('../../../pages/base/base_page.js');

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;
var Key = require('selenium-webdriver').Key;

// Locators
var REPORT_TITLE = By.css('h2.report-title');

var TABLE_ID = {
  'playersCustomBatting': 'tableBaseballPlayersRockiesBattingContainer',
  'playersCustomPitching': 'tableBaseballPlayersRockiesPitchingContainer',
  'playersRockWAR': 'tableBaseballPlayersRockiesLeagueRockWARContainer',
  'playerCustomBatting': 'tableBaseballRockiesPlayerBatterContainer',
  'playerCustomPitching': 'tableBaseballRockiesPlayerPitcherContainer',
  'teamCustomBatting': 'tableBaseballRockiesTeamBatterContainer',
  'teamCustomPitching': 'tableBaseballRockiesTeamPitcherContainer',
  'teamRockWAR': 'tableBaseballPlayersRockiesTeamRockWARContainer'
};

var TABLE_ROW_OFFSET = {
  'playersCustomBatting': 1,
  'playersCustomPitching': 1,
};

var PLAYER_CARD_TABLE_OFFSET = {
  'playerBattingCard': 1,
  'playerPitchingCard': 3,
};

var STATS_VIEW_SELECT = By.id('s2id_pageControlBaseballRockiesStatsViewPlayers');
var DROPDOWN_INPUT = By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input");

// RockWAR
var ROCK_WAR_QUALIFY_BY_SELECT = By.id("s2id_pageControlBaseballQualifyByRockWar");

var TPA_YEAR_SELECT = By.id('s2id_pageControlStatYear');

function Rockies(driver, currentPage) {
  BasePage.call(this, driver);
  this.currentPage = currentPage;
}

Rockies.prototype = Object.create(BasePage.prototype);
Rockies.prototype.constructor = Rockies;

Rockies.prototype.goToSubSection = function(subSection) {
  this.subSection = subSection;
  var locator = By.xpath(`.//nav[contains(@class, 'report-nav')]/.//a[text()='${subSection}']`);
  return this.click(locator);
};

Rockies.prototype.getReportTitle = function() {
  return this.getText(REPORT_TITLE);
};

Rockies.prototype.getTableHeader = function(col) {
  var locator = By.xpath(`.//div[@id='${TABLE_ID[this.currentPage]}']/table/thead/tr[1]/th[${col}]`);
  return this.getText(locator);  
};

Rockies.prototype.getTableStat = function(playerNum, col) {
  var rowOffset = TABLE_ROW_OFFSET[this.currentPage] || 0;
  var row = playerNum + rowOffset;

  var locator = By.xpath(`.//div[@id='${TABLE_ID[this.currentPage]}']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator, 60000); 
};

Rockies.prototype.changeStatsView = function(filter) {
  return this.changeDropdown(STATS_VIEW_SELECT, DROPDOWN_INPUT, filter);
};

// Players - RockWAR
Rockies.prototype.changeRockWARQualifyBy = function(filter) {
  return this.changeDropdown(ROCK_WAR_QUALIFY_BY_SELECT, DROPDOWN_INPUT, filter);
};

// Player - Player Cards
Rockies.prototype.getPlayerCardTableHeader = function(table, col) {
  var divNum = table + PLAYER_CARD_TABLE_OFFSET[this.currentPage];
  var locator = By.xpath(`.//div[${divNum}]/table[contains(@class,'cardtable')]/tbody/tr[1]/th[${col}]`);
  return this.getText(locator);
};

Rockies.prototype.getPlayerCardTableStat = function(table, year, col) {
  var divNum = table + PLAYER_CARD_TABLE_OFFSET[this.currentPage];
  var locator = By.xpath(`.//div[${divNum}]/table[contains(@class,'cardtable')]/tbody/tr[td[text()='${year}']]/td[${col}]`);
  return this.getText(locator);
};

Rockies.prototype.getPlayerCardTableStatColor = function(table, year, col) {
  var divNum = table + PLAYER_CARD_TABLE_OFFSET[this.currentPage];
  var locator = By.xpath(`.//div[${divNum}]/table[contains(@class,'cardtable')]/tbody/tr[td[text()='${year}']]/td[${col}]`);
  return this.getCssValue(locator, 'background-color');
};

// Team - TPA +/-
Rockies.prototype.changeTPADropdown = function(year) {
  return this.changeDropdown(TPA_YEAR_SELECT, DROPDOWN_INPUT, year);
};

Rockies.prototype.getTPATableStat = function(table, row, col) {
  var locator = By.xpath(`.//table[${table}]/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator); 
};

module.exports = Rockies;