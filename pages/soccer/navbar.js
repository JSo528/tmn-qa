'use strict';

// Load Base Page
var BasePage = require('../base/base_page.js')

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;

// Locators
var LEAGUES_LINK = By.xpath(".//header[@class='navbar-tmn']/.//a[text()='League Tables']");
var TEAMS_LINK = By.xpath(".//header[@class='navbar-tmn']/.//a[text()='Team Sortables']");
var PLAYERS_LINK = By.xpath(".//header[@class='navbar-tmn']/.//a[text()='Player Sortables']");
var MATCHES_LINK = By.xpath(".//header[@class='navbar-tmn']/.//a[text()='Match Results']");

var BASEBALL_LINK = By.xpath(".//header[@class='navbar-tmn']/.//a[text()='MLB']");
var NFL_LINK = By.xpath(".//header[@class='navbar-tmn']/.//a[text()='NFL']");
var NCAA_FOOTBALL_LINK = By.xpath(".//header[@class='navbar-tmn']/.//a[text()='NCAA Football']");

var LEAGUES_LAST_LOCATOR = By.id("s2id_league");
var TEAMS_LAST_LOCATOR = By.css("tableSoccerTeamsStatsContainer > table");
var PLAYERS_LAST_LOCATOR = By.css("tableSoccerPlayersStatsContainer > table");
var MATCHES_LAST_LOCATOR = By.id("s2id_league");


var SEARCH_INPUT = By.css('.navbar-tmn #search-bar input');

function Navbar(driver) {
  BasePage.call(this, driver);
};

Navbar.prototype = Object.create(BasePage.prototype);
Navbar.prototype.constructor = Navbar;

Navbar.prototype.goToLeaguesPage = function() {
  this.click(LEAGUES_LINK);
  return this.waitForEnabled(LEAGUES_LAST_LOCATOR, 30000);
};

Navbar.prototype.goToMatchesPage = function() {
  return this.click(MATCHES_LINK);
  return this.waitForEnabled(MATCHES_LAST_LOCATOR, 30000);
};

Navbar.prototype.goToTeamsPage = function() {
  this.click(TEAMS_LINK);
  return this.waitForEnabled(TEAMS_LAST_LOCATOR, 30000);
};

Navbar.prototype.goToPlayersPage = function() {
  this.click(PLAYERS_LINK);
  return this.waitForEnabled(PLAYERS_LAST_LOCATOR, 30000);
};

Navbar.prototype.goToMLBPage = function() {
  return this.click(BASEBALL_LINK);
};

Navbar.prototype.goToNflPage = function() {
  return this.click(NFL_LINK);
};

Navbar.prototype.goToNcaaFootballPage = function() {
  return this.click(NCAA_FOOTBALL_LINK);
};

Navbar.prototype.search = function(searchTerm, selectionNum) {
  return this.selectFromSearch(SEARCH_INPUT, searchTerm, selectionNum);
};

module.exports = Navbar;