'use strict';

// Load Base Page
var BasePage = require('../../pages/base/base_page.js');

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;

// Locators
var TEAM_NAME = By.css('h1.name');
var BATTING_REPORT_SELECT = By.id('s2id_reportNavBaseballTeamsStatBatting');
var STATS_TABLE = By.xpath(".//div[@id='tableBaseballTeamsStatsContainer']/table");
var STREAKS_TABLE = By.xpath(".//div[2]/div/div/div/div/table");

function TeamsPage(driver) {
  BasePage.call(this, driver);
};

TeamsPage.prototype = Object.create(BasePage.prototype);
TeamsPage.prototype.constructor = TeamsPage;


TeamsPage.prototype.goToSection = function(section) {
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

TeamsPage.prototype.goToSubSection = function(section) {
  var linkNum; 
  switch (section) {
    case "Stats":
      linkNum = 1;
      break;
    case "Occurences & Streaks":
      linkNum = 2;
      break;
    case "Scatter Plot":
      linkNum = 3;
      break
    default: 
      linkNum = 1;
  }

  var section = By.xpath(`.//nav[@class='navbar navbar-default navbar-static-top report-nav navbar-gray']/div/div/ul/li[${linkNum}]/a`);
  return this.click(section);
}

TeamsPage.prototype.getTeamName = function() {
  return this.getText(TEAM_NAME);
}

TeamsPage.prototype.statsTable = STATS_TABLE;
TeamsPage.prototype.streaksTable = STREAKS_TABLE;

module.exports = TeamsPage;