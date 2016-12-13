'use strict';

// Load Base Page
var BasePage = require('../base/base_page.js')

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;

/****************************************************************************
** Locators
*****************************************************************************/
var SCOUT_LINK = By.xpath(".//header/nav/.//li/a[text()='Scout']");
var TEAMS_LINK = By.xpath(".//header/nav/.//li/a[text()='Teams']");
var LISTS_LINK = By.xpath(".//header/nav/.//li/a[text()='Lists']");
// var DRAFT_LINK = 
// var STANDINGS_LINK = By.xpath(".//header[@class='navbar-tmn']/.//a[text()='Standings']");
// var TEAMS_LINK = By.xpath(".//header[@class='navbar-tmn']/.//a[text()='Teams']");
// var PLAYERS_LINK = By.xpath(".//header[@class='navbar-tmn']/.//a[text()='Players']");
// var SCORES_LINK = By.xpath(".//header[@class='navbar-tmn']/.//a[text()='Scores']");
// var GROUPS_LINK = By.xpath(".//header[@class='navbar-tmn']/.//a[text()='Groups']");
// var PERFORMANCE_LINK = By.xpath(".//header[@class='navbar-tmn']/.//a[text()='Performance']");

var SCOUT_TABLE = By.xpath(".//div[@class='reports']/.//table");
var TEAMS_TABLE = By.xpath(".//div[@class='teams']/.//table");
var LISTS_TABLE = By.xpath(".//div[@class='tags']/.//table");
// var TEAMS_LAST_LOCATOR = By.id("s2id_reportNavFootballTeamsSubCommon");
// var PLAYERS_LAST_LOCATOR = By.id("s2id_reportNavFootballPlayersSubCommon");
// var SCORES_LAST_LOCATOR = By.id("s2id_pageControlFootballYear");

// var SEARCH_INPUT = By.css('.navbar-tmn #search-bar input');

/****************************************************************************
** Constructor
*****************************************************************************/
function Navbar(driver) {
  BasePage.call(this, driver);
};

Navbar.prototype = Object.create(BasePage.prototype);
Navbar.prototype.constructor = Navbar;

/****************************************************************************
** Functions
*****************************************************************************/
Navbar.prototype.goToScoutPage = function() {
  this.click(SCOUT_LINK);
  return this.waitUntilStaleness(SCOUT_TABLE, 10000);
};

Navbar.prototype.goToTeamsPage = function() {
  this.click(TEAMS_LINK);
  return this.waitUntilStaleness(TEAMS_TABLE, 10000);
};

Navbar.prototype.goToListsPage = function() {
  this.click(LISTS_LINK);
  return this.waitUntilStaleness(LISTS_TABLE, 10000);
};

Navbar.prototype.goToDraftPage = function() {
  this.click(LISTS_LINK);
  return this.waitUntilStaleness(LISTS_TABLE, 10000);
};

module.exports = Navbar;