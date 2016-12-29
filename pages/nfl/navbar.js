'use strict';

// Load Base Page
var BasePage = require('../base/base_page.js')

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;

// Locators
var STANDINGS_LINK = By.xpath(".//header[@class='navbar-tmn']/.//a[text()='Standings']");
var TEAMS_LINK = By.xpath(".//header[@class='navbar-tmn']/.//a[text()='Teams']");
var PLAYERS_LINK = By.xpath(".//header[@class='navbar-tmn']/.//a[text()='Players']");
var SCORES_LINK = By.xpath(".//header[@class='navbar-tmn']/.//a[text()='Scores']");
var GROUPS_LINK = By.xpath(".//header[@class='navbar-tmn']/.//a[text()='Groups']");
var PERFORMANCE_LINK = By.xpath(".//header[@class='navbar-tmn']/.//a[text()='Performance']");

var BASEBALL_LINK = By.xpath(".//header[@class='navbar-tmn']/.//a[text()='MLB']");
var SOCCER_LINK = By.xpath(".//header[@class='navbar-tmn']/.//a[text()='SOCCER']");

var TEAMS_LAST_LOCATOR = By.id("s2id_reportNavFootballTeamsSubCommon");
var PLAYERS_LAST_LOCATOR = By.id("s2id_reportNavFootballPlayersSubCommon");
var SCORES_LAST_LOCATOR = By.id("s2id_pageControlFootballYear");

var SEARCH_INPUT = By.css('.navbar-tmn #search-bar input');

function Navbar(driver) {
  BasePage.call(this, driver);
};

Navbar.prototype = Object.create(BasePage.prototype);
Navbar.prototype.constructor = Navbar;

Navbar.prototype.goToStandingsPage = function() {
  return this.click(STANDINGS_LINK);
};

Navbar.prototype.goToScoresPage = function() {
  return this.click(SCORES_LINK);
};

Navbar.prototype.goToTeamsPage = function() {
  this.click(TEAMS_LINK);
  return this.waitForEnabled(TEAMS_LAST_LOCATOR, 30000);
};

Navbar.prototype.goToPlayersPage = function() {
  this.click(PLAYERS_LINK);
  return this.waitForEnabled(PLAYERS_LAST_LOCATOR, 30000);
};

Navbar.prototype.goToGroupsPage = function() {
  return this.click(GROUPS_LINK);
};

Navbar.prototype.goToPerformancePage = function() {
  this.click(PERFORMANCE_LINK);
  return this.waitForEnabled(UMPIRES_LAST_LOCATOR, 30000);
};

Navbar.prototype.goToMLBPage = function() {
  return this.click(BASEBALL_LINK);
};

Navbar.prototype.goToSoccerPage = function() {
  return this.click(SOCCER_LINK);
};

Navbar.prototype.search = function(searchTerm, selectionNum) {
  return this.selectFromSearch(SEARCH_INPUT, searchTerm, selectionNum);
};

module.exports = Navbar;