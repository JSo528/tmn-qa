'use strict';

// Load Base Page
var BasePage = require('../../../pages/base/base_page.js');

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;
var Key = require('selenium-webdriver').Key;

function ScoresPage(driver, section) {
  BasePage.call(this, driver);
};

ScoresPage.prototype = Object.create(BasePage.prototype);
ScoresPage.prototype.constructor = ScoresPage;

ScoresPage.prototype.goToSection = function(section) {
  var locator = By.xpath(`.//div[@class='navbar-header']/ul/li/a[text()='${section}']`);
  return this.click(locator);
};

module.exports = ScoresPage;