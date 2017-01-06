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
var DRAFT_LINK = By.xpath(".//header/nav/.//li/a[text()='Draft']")


var SCOUT_TABLE = By.xpath(".//div[@class='reports']/.//table");
var TEAMS_TABLE = By.xpath(".//div[@class='teams']/.//table");
var LISTS_TABLE = By.xpath(".//div[@class='tags']/.//table");
var DRAFT_CARDS_CONTAINER = By.xpath(".//div[@class='draft']/.//div[@inject='draftCards']");

var LOGOUT_LINK = By.xpath(".//header/nav/.//div[@class='navbar-right'][1]/ul/li/a");

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
  this.click(DRAFT_LINK);
  return this.waitUntilStaleness(DRAFT_CARDS_CONTAINER, 10000);
};

Navbar.prototype.clickLogoutLink = function() {
  return this.click(LOGOUT_LINK);
};

module.exports = Navbar;