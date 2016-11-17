'use strict';

// Load Base Page
var BasePage = require('../../../pages/base/base_page.js');

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;

function PlayersPage(driver) {
  BasePage.call(this, driver);
};

PlayersPage.prototype = Object.create(BasePage.prototype);
PlayersPage.prototype.constructor = PlayersPage;


PlayersPage.prototype.goToSection = function(section) {
  var linkNum; 
  switch (section) {
    case "Batting":
      linkNum = 1;
      break;
    case "Pitching":
      linkNum = 2;
      break;
    case "Catching":
      linkNum = 3;
      break;
    case "Statcast Fielding":
      linkNum = 4;
      break      
    default: 
      linkNum = 1;
  }

  var section = By.xpath(`.//nav[contains(@class, 'navbar-blue')]/div/div/ul/li[${linkNum}]/a`);
  return this.click(section);
}

PlayersPage.prototype.goToSubSection = function(subSection) {
  var locator = By.xpath(`.//nav[contains(@class, 'report-nav')]/.//a[text()='${subSection}']`);
  return this.click(locator);
}

module.exports = PlayersPage;