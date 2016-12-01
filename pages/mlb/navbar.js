'use strict';

// Load Base Page
var BasePage = require('../base/base_page.js')

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;

// Locators
var STANDINGS_LINK = By.xpath(".//header/div[1]/div[contains(@class, 'navbar-item-fancy-pants')][1]/a");
var SCORES_LINK = By.xpath(".//header/div[1]/div[contains(@class, 'navbar-item-fancy-pants')][2]/a");
var TEAMS_LINK = By.xpath(".//header/div[1]/div[contains(@class, 'navbar-item-fancy-pants')][3]/a");
var PLAYERS_LINK = By.xpath(".//header/div[1]/div[contains(@class, 'navbar-item-fancy-pants')][4]/a");
var UMPIRES_LINK = By.xpath(".//header/div[1]/div[contains(@class, 'navbar-item-fancy-pants')][5]/a");
var GROUPS_LINK = By.xpath(".//header/div[1]/div[contains(@class, 'navbar-item-fancy-pants')][6]/a");

var SCORES_LAST_LOCATOR = By.xpath(".//div[contains(@class, 'pika-single')]");
var TEAMS_LAST_LOCATOR = By.id("s2id_reportNavBaseballTeamsStatBatting");
var PLAYERS_LAST_LOCATOR = By.id("s2id_reportNavBaseballPlayersStatBatting");
var UMPIRES_LAST_LOCATOR = By.id("s2id_reportNavBaseballUmpiresStatUmpires");

var SEARCH_INPUT = By.css('.navbar-tmn #search-bar input');
var LOCK_FILTERS_INPUT = By.css('.navbar-tmn .persist-search-state input');

function MlbNavbar(driver) {
  BasePage.call(this, driver);
};

MlbNavbar.prototype = Object.create(BasePage.prototype);
MlbNavbar.prototype.constructor = MlbNavbar;

MlbNavbar.prototype.goToStandingsPage = function() {
  return this.click(STANDINGS_LINK);
};

MlbNavbar.prototype.goToScoresPage = function() {
  this.click(SCORES_LINK);
  return this.driver.wait(Until.elementLocated(SCORES_LAST_LOCATOR));
};

MlbNavbar.prototype.goToTeamsPage = function() {
  this.click(TEAMS_LINK);
  return this.waitForEnabled(TEAMS_LAST_LOCATOR, 30000);
};

MlbNavbar.prototype.goToPlayersPage = function() {
  this.click(PLAYERS_LINK);
  return this.waitForEnabled(PLAYERS_LAST_LOCATOR, 30000);
};

MlbNavbar.prototype.goToUmpiresPage = function() {
  this.click(UMPIRES_LINK);
  return this.waitForEnabled(UMPIRES_LAST_LOCATOR, 30000);
};

MlbNavbar.prototype.goToGroupsPage = function() {
  return this.click(GROUPS_LINK);
};

MlbNavbar.prototype.goToGroupsPage = function() {
  return this.click(GROUPS_LINK);
};

MlbNavbar.prototype.search = function(searchTerm, selectionNum) {
  return this.selectFromSearch(SEARCH_INPUT, searchTerm, selectionNum);
};

MlbNavbar.prototype.toggleLockFiltersCheckbox = function(check) {
  return this.toggleCheckbox(LOCK_FILTERS_INPUT, check);
};

module.exports = MlbNavbar;