'use strict';

// Load Base Page
var BasePage = require('../../../pages/base/base_page.js');

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;

// Locators
var TEAM_NAME = By.css('h1.name');
var BATTING_REPORT_SELECT = By.id('s2id_reportNavBaseballTeamsStatBatting');
var PITCHING_REPORT_SELECT = By.id("s2id_reportNavBaseballTeamsStatPitching");
var CATCHING_REPORT_SELECT = By.id("s2id_reportNavBaseballTeamsStatTeamcatching");
var STATCAST_FIELDING_REPORT_SELECT = By.id("s2id_reportNavBaseballTeamsStatStatcast");

var STATS_TABLE = By.xpath(".//div[@id='tableBaseballTeamsStatsContainer']/table");
var STREAKS_TABLE = By.xpath(".//div[2]/div/div/div/div/table");


function TeamsPage(driver) {
  BasePage.call(this, driver);
};

TeamsPage.prototype = Object.create(BasePage.prototype);
TeamsPage.prototype.constructor = TeamsPage;

// after going to new section, need to wait for the page to be fully loaded
// last thing to update appears to be the report select for each page
TeamsPage.prototype.goToSection = function(section) {
  var linkNum, lastLocator; 
  switch (section) {
    case "Batting":
      linkNum = 1;
      lastLocator = BATTING_REPORT_SELECT;
      break;
    case "Pitching":
      linkNum = 2;
      lastLocator = PITCHING_REPORT_SELECT;
      break;
    case "Catching":
      linkNum = 3;
      lastLocator = CATCHING_REPORT_SELECT;
      break;
    case "Statcast Fielding":
      linkNum = 4;
      lastLocator = STATCAST_FIELDING_REPORT_SELECT;
      break      
    default: 
      linkNum = 1;
  }

  var section = By.xpath(`.//nav[contains(@class, 'navbar-blue')]/div/div/ul/li[${linkNum}]/a`);
  this.click(section);
  return this.waitForEnabled(lastLocator);
}

TeamsPage.prototype.goToSubSection = function(subSection) {
  var locator = By.xpath(`.//nav[contains(@class, 'report-nav')]/.//a[text()='${subSection}']`);
  return this.click(locator);
}

TeamsPage.prototype.statsTable = STATS_TABLE;
TeamsPage.prototype.streaksTable = STREAKS_TABLE;

module.exports = TeamsPage;