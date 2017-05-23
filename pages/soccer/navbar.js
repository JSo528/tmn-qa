'use strict';

// Load Base Page
var BasePage = require('../base/base_page.js')

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;

// Locators
var TABLES_LINK = By.xpath(".//header[@class='navbar-tmn']/.//a[text()='Tables']");
var TEAMS_LINK = By.xpath(".//header[@class='navbar-tmn']/.//a[text()='Teams']");
var PLAYERS_LINK = By.xpath(".//header[@class='navbar-tmn']/.//a[text()='Players']");
var MATCHES_LINK = By.xpath(".//header[@class='navbar-tmn']/.//a[text()='Matches']");

var TABLES_LAST_LOCATOR = By.id("s2id_league");
var TEAMS_LAST_LOCATOR = By.css('tmn-table#results-table > table:nth-of-type(1)');
var PLAYERS_LAST_LOCATOR = By.css('tmn-table#results-table > table:nth-of-type(1)');
var MATCHES_LAST_LOCATOR = By.id("s2id_league");


var SEARCH_INPUT = By.css('.navbar-tmn #search-bar input');

function Navbar(driver) {
  BasePage.call(this, driver);
};

Navbar.prototype = Object.create(BasePage.prototype);
Navbar.prototype.constructor = Navbar;

Navbar.prototype.goToTablesPage = function() {
  this.click(TABLES_LINK);
  return this.waitForEnabled(TABLES_LAST_LOCATOR, 30000);
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

Navbar.prototype.search = function(searchTerm, selectionNum) {
  return this.selectFromSearch(SEARCH_INPUT, searchTerm, selectionNum);
};

module.exports = Navbar;