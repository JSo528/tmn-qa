'use strict';

// Load Base Page
var BasePage = require('../../pages/base/base_page.js')

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;

// Locators
var FILTER_SELECT = By.id('s2id_addFilter');
var FILTER_INPUT = By.id('s2id_autogen1_search');
var UPDATE_BUTTON = By.className('update');

var BATTING_REPORT_SELECT = By.id("s2id_reportNavBaseballTeamStatBatting");
var PITCHING_REPORT_SELECT = By.id("s2id_reportNavBaseballTeamStatPitching");
var REPORT_INPUT = By.xpath(".//div[@id='select2-drop']/div/input");
var LOADING_CONTAINER = By.id('loadingContainer');

function DetailedScorePage(driver) {
  BasePage.call(this, driver);
};

DetailedScorePage.prototype = Object.create(BasePage.prototype);
DetailedScorePage.prototype.constructor = DetailedScorePage;

// Section Tabs & Report Dropdown
DetailedScorePage.prototype.goToSection = function(section) {
  var linkNum; 
  switch (section) {
    case "Batting":
      linkNum = 1;
      break;
    case "Pitching":
      linkNum = 2;
      break;
    case "Pitch By Pitch":
      linkNum = 3;
      break
    case "Pitching Splits":
      linkNum = 4;
      break      
    default: 
      linkNum = 1;
  }

  var section = By.xpath(`.//div[@class='navbar-header']/ul/li[${linkNum}]/a`);
  return this.click(section);
}

DetailedScorePage.prototype.changeBattingReport = function(report) {
  this.changeDropdown(BATTING_REPORT_SELECT, REPORT_INPUT, report);
};

DetailedScorePage.prototype.changePitchingReport = function(report) {
  this.changeDropdown(PITCHING_REPORT_SELECT, REPORT_INPUT, report);
};

// Filters
DetailedScorePage.prototype.addDropdownFilter = function(filter) {
  return this.changeDropdown(FILTER_SELECT, FILTER_INPUT, filter)
};

DetailedScorePage.prototype.toggleSidebarFilter = function(filterName, selection) {
  var locator = By.xpath(`.//div[@id='common']/div/div/div[@class='row'][div[@class='col-md-4 filter-modal-entry-label']/h5[contains(text()[1], '${filterName}')]]/div[@class='col-md-8']/div/div/label[${selection}]`);
  return this.clickAndWait(locator, LOADING_CONTAINER);
};

DetailedScorePage.prototype.closeDropdownFilter = function(filterNum) {
  var locator = By.xpath(`.//div[@class='col-md-8 activated']/div[${filterNum}]/div[@class='filter-header text-left']/span[@class='closer fa fa-2x fa-times-circle pull-right']`);
  return this.removeFilter(locator, UPDATE_BUTTON)
};

// Get Stat
DetailedScorePage.prototype.getBoxScoreTotalHits = function(homeOrAway) {
  var team = homeOrAway == "home" ? 2 : 1
  var element = By.xpath(`.//table[@class='table table-box-scores']/tbody/tr[${team}]/td[13]`)
  return this.getText(element);
}

DetailedScorePage.prototype.getTeamBattingStat = function(homeOrAway, col) {
  var team = homeOrAway == "home" ? 2 : 1
  var element = By.xpath(`.//div[@id='tableBaseballGameTeamBattingStatsContainer']/table/tbody/tr[${team}]/td[${col}]`);
  return this.getText(element, 30000);
}

DetailedScorePage.prototype.getPlayerBattingStat = function(homeOrAway, row, col) {
  var tableID = (homeOrAway == "home") ? 'tableBaseballGamePlayerBattingStatsHomeContainer' : 'tableBaseballGamePlayerBattingStatsAwayContainer';     
  var element = By.xpath(`.//div[@id='${tableID}']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(element, 30000);
};

DetailedScorePage.prototype.getTeamPitchingStat = function(homeOrAway, col) {
  var team = homeOrAway == "home" ? 2 : 1
  var element = By.xpath(`.//div[@id='tableBaseballGameTeamPitchingStatsContainer']/table/tbody/tr[${team}]/td[${col}]`);
  return this.getText(element, 30000);
}

DetailedScorePage.prototype.getPlayerPitchingStat = function(homeOrAway, row, col) {
  var tableID = (homeOrAway == "home") ? 'tableBaseballGamePlayerPitchingStatsHomeContainer' : 'tableBaseballGamePlayerPitchingStatsAwayContainer';     
  var element = By.xpath(`.//div[@id='${tableID}']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(element, 30000);
};

module.exports = DetailedScorePage;