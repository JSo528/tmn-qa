'use strict';

// Load Base Page
var BasePage = require('../../../pages/base/base_page.js');

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;
var Key = require('selenium-webdriver').Key;

// Locators
var TEAM_NAME = By.css('h1.name');
var CONTAINER = By.css('.container');

function TeamPage(driver, section) {
  BasePage.call(this, driver);
};

TeamPage.prototype = Object.create(BasePage.prototype);
TeamPage.prototype.constructor = TeamPage;


TeamPage.prototype.goToSection = function(section) {
  var locator = By.xpath(`.//div[@class='navbar-header']/ul/li/a[text()='${section}']`);
  return this.click(locator);
};

TeamPage.prototype.getTeamName = function() {
  return this.getText(TEAM_NAME, 30000);
};

TeamPage.prototype.waitForTableToLoad = function() {
  this.waitUntilStaleness(CONTAINER, 10000);
  return this.waitForEnabled(CONTAINER, 10000);
};


module.exports = TeamPage;