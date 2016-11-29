'use strict';

// Load Base Page
var BasePage = require('../../pages/base/base_page.js')

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;

// TODO - make sure doing enums correctly
var DIVISION_IDS = {
  AL_EAST : 'tableBaseballStandingsAL EastContainer',
  PCL_AS: 'tableBaseballStandingsPCL \(AS\)Container'
}

// Locators
var NAVBAR = By.className('navbar-tmn');
var YEAR_SELECT = By.id('s2id_pageControlBaseballYear');
var YEAR_INPUT = By.id('s2id_autogen1_search');
var SEASON_LEVEL_SELECT = By.id('s2id_pageControlBaseballSeasonLevelSingle');
var SEASON_LEVEL_INPUT = By.id('s2id_autogen2_search');
var TABLES = By.css('table');

function StandingsPage(driver) {
  BasePage.call(this, driver)
};

StandingsPage.prototype = Object.create(BasePage.prototype);
StandingsPage.prototype.constructor = StandingsPage;

// Methods

// Don't need 4th param because it generates a full page reload
StandingsPage.prototype.changeYear = function(year) {
  return this.changeDropdown(YEAR_SELECT, YEAR_INPUT, year);
};

StandingsPage.prototype.changeSeasonLevel = function(seasonLevel) {
  return this.changeDropdown(SEASON_LEVEL_SELECT, SEASON_LEVEL_INPUT, seasonLevel);
};

StandingsPage.prototype.getTableStat = function(tableRow, tableCol, teamRank, statCol) {
  var tableRow = 1 + tableRow;
  var teamRow = 1 + teamRank; 

  var locator = By.xpath(`.//div[${tableRow}]/div[${tableCol}]/div/div/div/table/tbody/tr[${teamRow}]/td[${statCol}]`);
  return this.getText(locator);
};

StandingsPage.prototype.getSeasonLevel = function() {
  return this.getText(SEASON_LEVEL_SELECT);
};

StandingsPage.prototype.goToTeamPage = function(tableRow, tableCol, teamRank) {
  var tableRow = 1 + tableRow;
  var teamRow = 1 + teamRank;
  
  var locator = By.xpath(`.//div[${tableRow}]/div[${tableCol}]/div/div/div/table/tbody/tr[${teamRow}]/td[1]/a`);
  return this.click(locator);
};

// Last Locator gets passed into functions to notify that the page isn't ready until this locator is enabled
StandingsPage.prototype.comparisonLocator = TABLES;
StandingsPage.prototype.lastLocator = SEASON_LEVEL_SELECT;

module.exports = StandingsPage;