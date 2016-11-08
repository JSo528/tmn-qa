'use strict';

// Load Base Page
var BasePage = require('../../pages/base/base_page.js');

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;

// Locators
var BATTING_REPORT_SELECT = By.id('s2id_reportNavBaseballTeamsStatBatting');
var PITCHING_REPORT_SELECT = By.id("s2id_reportNavBaseballTeamsStatPitching");
var CATCHING_REPORT_SELECT = By.id("s2id_reportNavBaseballTeamsStatTeamcatching");

var GROUP_BY_SELECT = By.id("s2id_pageControlBaseballGroupByConf");
var DROPDOWN_INPUT = By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input");

var STATS_VIEW_SELECT = By.id("s2id_pageControlBaseballStatsViewTeams");

function GroupsPage(driver) {
  BasePage.call(this, driver);
}

GroupsPage.prototype = Object.create(BasePage.prototype);
GroupsPage.prototype.constructor = GroupsPage;

GroupsPage.prototype.goToSection = function(section) {
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
    default: 
      linkNum = 1;
      lastLocator = BATTING_REPORT_SELECT;
  }

  var section = By.xpath(`.//div[@class='navbar-header']/ul/li[${linkNum}]/a`);
  this.click(section);
  return this.waitForEnabled(lastLocator);
}


GroupsPage.prototype.getTableHeader = function(col) {
  var locator = By.xpath(`.//div[@id='tableBaseballGroupsStatsContainer']/table/thead/tr/th[${col}]`);
  return this.getText(locator, 30000);
};

GroupsPage.prototype.getTableStat = function(groupNum, col) {
  // First 5 rows are for the headers
  var row = 5 + groupNum;
  var locator = By.xpath(`.//div[@id='tableBaseballGroupsStatsContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator, 30000);
};

GroupsPage.prototype.getTableBgColor = function(groupNum, col) {
  // First 5 rows are for the headers
  var row = 5 + groupNum;
  var locator = By.xpath(`.//div[@id='tableBaseballGroupsStatsContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getCssValue(locator, "background-color");
};

GroupsPage.prototype.clickTableColumnHeader = function(col) {
  var locator = By.xpath(`.//div[@id='tableBaseballGroupsStatsContainer']/table/thead/tr/th[${col}]`);
  return this.click(locator); 
};

GroupsPage.prototype.changeGroupBy = function(groupBy) {
  return this.changeDropdown(GROUP_BY_SELECT, DROPDOWN_INPUT, groupBy);
};

GroupsPage.prototype.changeStatsView = function(view) {
  return this.changeDropdown(STATS_VIEW_SELECT, DROPDOWN_INPUT, view);
};

GroupsPage.prototype.changeBattingReport = function(report) {
  return this.changeDropdown(BATTING_REPORT_SELECT, DROPDOWN_INPUT, report);
};

GroupsPage.prototype.changePitchingReport = function(report) {
  return this.changeDropdown(PITCHING_REPORT_SELECT, DROPDOWN_INPUT, report);
};

GroupsPage.prototype.changeCatchingReport = function(report) {
  return this.changeDropdown(CATCHING_REPORT_SELECT, DROPDOWN_INPUT, report);
};

module.exports = GroupsPage;