'use strict';

// Load Base Page
var BasePage = require('../../../pages/base/base_page.js');

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;
var Key = require('selenium-webdriver').Key;

function PlayersPage(driver, section) {
  BasePage.call(this, driver);
};

PlayersPage.prototype = Object.create(BasePage.prototype);
PlayersPage.prototype.constructor = PlayersPage;

PlayersPage.prototype.goToSection = function(section) {
  var locator = By.xpath(`.//div[@class='navbar-header']/ul/li/a[text()='${section}']`);
  return this.click(locator);
};

module.exports = PlayersPage;