'use strict';

// Load Base Page
var BasePage = require('../../../pages/base/base_page.js');

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;
var Key = require('selenium-webdriver').Key;

function ScorePage(driver, section) {
  BasePage.call(this, driver);
};

ScorePage.prototype = Object.create(BasePage.prototype);
ScorePage.prototype.constructor = ScorePage;

ScorePage.prototype.goToSection = function(section) {
  var locator = By.xpath(`.//div[@class='navbar-header']/ul/li/a[text()='${section}']`);
  return this.click(locator);
};

module.exports = ScorePage;