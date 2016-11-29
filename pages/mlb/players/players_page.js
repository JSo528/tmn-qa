'use strict';

// Load Base Page
var BasePage = require('../../../pages/base/base_page.js');

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;

// Locators
var REPORT_SELECT = {
  'batting': By.id('s2id_reportNavBaseballPlayersStatBatting'),
  'pitching': By.id('s2id_reportNavBaseballPlayersStatPitching'),
  'catching': By.id('s2id_reportNavBaseballPlayersStatCatching'),
  'statcastFielding': By.id('s2id_reportNavBaseballPlayersStatStatcast')
};

var SECTION_TITLE = {
  'batting': 'Batting',
  'pitching': 'Pitching',
  'catching': 'Catching',
  'statcastFielding': 'Statcast Fielding'
};

var SUB_SECTION_TITLE = {
  'stats': 'Stats',
  'occurrencesAndStreaks': 'Occurrences & Streaks',
  'scatterPlot': 'Scatter Plot'
}

function PlayersPage(driver) {
  BasePage.call(this, driver);
}

PlayersPage.prototype = Object.create(BasePage.prototype);
PlayersPage.prototype.constructor = PlayersPage;

PlayersPage.prototype.goToSection = function(section) {
  this.section = section;
  var sectionLink = By.xpath(`.//nav[contains(@class, 'navbar-blue')]/.//li/a[text()='${SECTION_TITLE[section]}']`);
  this.click(sectionLink);
  return this.waitForEnabled(REPORT_SELECT[this.section], 30000);
};

PlayersPage.prototype.goToSubSection = function(subSection) {
  this.subSection = subSection;
  var locator = By.xpath(`.//nav[contains(@class, 'report-nav')]/.//a[text()='${SUB_SECTION_TITLE[subSection]}']`);
  return this.click(locator);
};

module.exports = PlayersPage;