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


function MlbNavbar(driver) {
  BasePage.call(this, driver);
};

MlbNavbar.prototype = Object.create(BasePage.prototype);
MlbNavbar.prototype.constructor = MlbNavbar;

MlbNavbar.prototype.goToStandingsPage = function() {
  return this.click(STANDINGS_LINK);
};

MlbNavbar.prototype.goToScoresPage = function() {
  return this.click(SCORES_LINK);
};

MlbNavbar.prototype.goToTeamsPage = function() {
  return this.click(TEAMS_LINK);
};

MlbNavbar.prototype.goToPlayersPage = function() {
  return this.click(PLAYERS_LINK);
};

MlbNavbar.prototype.goToUmpiresPage = function() {
  return this.click(UMPIRES_LINK);
};

MlbNavbar.prototype.goToGroupsPage = function() {
  return this.click(GROUPS_LINK);
};

module.exports = MlbNavbar;