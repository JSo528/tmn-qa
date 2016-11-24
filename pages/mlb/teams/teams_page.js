'use strict';

// Load Base Page
var BasePage = require('../../../pages/base/base_page.js');

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;

// Locators
var REPORT_SELECT = {
  'batting': By.id('s2id_reportNavBaseballTeamsStatBatting'),
  'pitching': By.id('s2id_reportNavBaseballTeamsStatPitching'),
  'catching': By.id('s2id_reportNavBaseballTeamsStatTeamcatching'),
  'statcastFielding': By.id('s2id_reportNavBaseballTeamsStatStatcast')
}

var SECTION_TITLE = {
  'batting': 'Batting',
  'pitching': 'Pitching',
  'catching': 'Catching',
  'statcastFielding': 'Statcast Fielding'
}

var SUB_SECTION_TITLE = {
  'stats': 'stats',
  'occurrencesAndStreaks': 'Occurrences & Streaks',
  'scatterPlot': 'Scatter Plot'
}

var TEAM_NAME = By.css('h1.name');

var STATS_TABLE = By.xpath(".//div[@id='tableBaseballTeamsStatsContainer']/table");
var STREAKS_TABLE = By.xpath(".//div[2]/div/div/div/div/table");


function TeamsPage(driver, section, subSection) {
  BasePage.call(this, driver);
  this.section = section || 'batting';
  this.subSection = subSection || 'overview';
};

TeamsPage.prototype = Object.create(BasePage.prototype);
TeamsPage.prototype.constructor = TeamsPage;

TeamsPage.prototype.goToSection = function(section, subSection) {
  this.section = section;
  var sectionLink = By.xpath(`.//nav[contains(@class, 'navbar-blue')]/.//li/a[text()='${SECTION_TITLE[section]}']`);
  this.click(sectionLink);
  return this.waitForEnabled(REPORT_SELECT[this.section], 30000);
};

TeamsPage.prototype.goToSubSection = function(subSection) {
  this.subSection = subSection
  var locator = By.xpath(`.//nav[contains(@class, 'report-nav')]/.//a[text()='${SUB_SECTION_TITLE[subSection]}']`);
  return this.click(locator);
};

TeamsPage.prototype.statsTable = STATS_TABLE;
TeamsPage.prototype.streaksTable = STREAKS_TABLE;

module.exports = TeamsPage;