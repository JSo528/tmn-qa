'use strict';

// Load Base Page
var BasePage = require('../../pages/base/base_page.js')

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;

/****************************************************************************
** Locators
*****************************************************************************/
var YEAR_SELECT = By.id('s2id_pageControlBaseballYear');
var SEASON_LEVEL_SELECT = By.id('s2id_pageControlBaseballSeasonLevelSingle');
var DROPDOWN_INPUT = By.xpath(".//div[@id='select2-drop']/div/input");
var TABLES = By.css('table');

/****************************************************************************
** Constructor
*****************************************************************************/
function StandingsPage(driver) {
  BasePage.call(this, driver)
};

StandingsPage.prototype = Object.create(BasePage.prototype);
StandingsPage.prototype.constructor = StandingsPage;

/****************************************************************************
** Functions
*****************************************************************************/
StandingsPage.prototype.changeYear = function(year) {
  return this.changeDropdown(YEAR_SELECT, DROPDOWN_INPUT, year);
};

StandingsPage.prototype.changeSeasonLevel = function(seasonLevel) {
  return this.changeDropdown(SEASON_LEVEL_SELECT, DROPDOWN_INPUT, seasonLevel);
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