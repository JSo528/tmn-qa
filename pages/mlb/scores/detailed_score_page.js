'use strict';

// Load Base Page
var BasePage = require('../../../pages/base/base_page.js')

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;

// Mixins
var _ = require('underscore');
var videoPlaylist = require('../mixins/videoPlaylist.js');

/****************************************************************************
** Locators
*****************************************************************************/
var SECTION_LINK_NUM = {
  'batting': 1,
  'pitching': 2,
  'pitchByPitch': 3,
  'pitchingSplits': 4
};

var REPORT_INPUT = By.xpath(".//div[@id='select2-drop']/div/input");
var LOADING_CONTAINER = By.id('loadingContainer');
var TABLES = By.css('table');

// Batting
var BATTING_REPORT_SELECT = By.id("s2id_reportNavBaseballTeamStatBatting");
var AWAY_BATTING_TABLE = By.xpath(".//div[@id='tableBaseballGamePlayerBattingStatsAwayContainer']/table");
// Pitching
var PITCHING_REPORT_SELECT = By.id("s2id_reportNavBaseballTeamStatPitching");
var AWAY_PITCHING_TABLE = By.xpath(".//div[@id='tableBaseballGamePlayerPitchingStatsAwayContainer']/table");

// PitchByPitch
var DECISIVE_EVENT_FILTER_SELECT = By.id('s2id_pageControlBaseballGameEventDecisive');
var DECISIVE_EVENT_FILTER_INPUT = By.id('s2id_autogen1_search');


/****************************************************************************
** Constructor
*****************************************************************************/
function DetailedScorePage(driver) {
  BasePage.call(this, driver);
};

DetailedScorePage.prototype = Object.create(BasePage.prototype);
DetailedScorePage.prototype.constructor = DetailedScorePage;

// Mixins
_.extend(DetailedScorePage.prototype, videoPlaylist);

DetailedScorePage.prototype.DEFAULT_PITCH_VISUALS_MODAL_ID = 'tableBaseballGamePitchByPitchModal';

/****************************************************************************
** Controls
*****************************************************************************/
DetailedScorePage.prototype.goToSection = function(section) {
  this.section = section;
  var section = By.xpath(`.//nav[contains(@class, 'navbar-blue')]/.//li[${SECTION_LINK_NUM[this.section]}]/a`);
  return this.click(section);
}

DetailedScorePage.prototype.getBoxScoreTotalHits = function(homeOrAway) {
  var team = homeOrAway == "home" ? 2 : 1
  var locator = By.xpath(`.//table[@class='table table-box-scores']/tbody/tr[${team}]/td[13]`)
  return this.getText(locator);
}

/****************************************************************************
** Batting
*****************************************************************************/
DetailedScorePage.prototype.changeBattingReport = function(report) {
  return this.changeDropdown(BATTING_REPORT_SELECT, REPORT_INPUT, report);
};

DetailedScorePage.prototype.getTeamBattingStat = function(homeOrAway, col) {
  var team = homeOrAway == "home" ? 2 : 1
  var locator = By.xpath(`.//div[@id='tableBaseballGameTeamBattingStatsContainer']/table/tbody/tr[${team}]/td[${col}]`);
  return this.getText(locator, 30000);
}

DetailedScorePage.prototype.getPlayerBattingStat = function(homeOrAway, row, col) {
  var tableID = (homeOrAway == "home") ? 'tableBaseballGamePlayerBattingStatsHomeContainer' : 'tableBaseballGamePlayerBattingStatsAwayContainer';     
  var locator = By.xpath(`.//div[@id='${tableID}']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator, 30000);
};

DetailedScorePage.prototype.clickTeamBattingStat = function(homeOrAway, col) {
  var team = homeOrAway == "home" ? 2 : 1
  var locator = By.xpath(`.//div[@id='tableBaseballGameTeamBattingStatsContainer']/table/tbody/tr[${team}]/td[${col}]/span`);
  return this.click(locator, 30000);
}

DetailedScorePage.prototype.clickPlayerBattingStat = function(homeOrAway, row, col) {
  var tableID = (homeOrAway == "home") ? 'tableBaseballGamePlayerBattingStatsHomeContainer' : 'tableBaseballGamePlayerBattingStatsAwayContainer';     
  var locator = By.xpath(`.//div[@id='${tableID}']/table/tbody/tr[${row}]/td[${col}]/span`);
  return this.click(locator, 30000);
};

/****************************************************************************
** Pitching
*****************************************************************************/
DetailedScorePage.prototype.changePitchingReport = function(report) {
  return this.changeDropdown(PITCHING_REPORT_SELECT, REPORT_INPUT, report);
};

DetailedScorePage.prototype.getTeamPitchingStat = function(homeOrAway, col) {
  var team = homeOrAway == "home" ? 2 : 1
  var locator = By.xpath(`.//div[@id='tableBaseballGameTeamPitchingStatsContainer']/table/tbody/tr[${team}]/td[${col}]`);
  return this.getText(locator, 30000);
}

DetailedScorePage.prototype.getPlayerPitchingStat = function(homeOrAway, row, col) {
  var tableID = (homeOrAway == "home") ? 'tableBaseballGamePlayerPitchingStatsHomeContainer' : 'tableBaseballGamePlayerPitchingStatsAwayContainer';     
  var locator = By.xpath(`.//div[@id='${tableID}']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator, 30000);
};

DetailedScorePage.prototype.clickTeamPitchingStat = function(homeOrAway, col) {
  var team = homeOrAway == "home" ? 2 : 1
  var locator = By.xpath(`.//div[@id='tableBaseballGameTeamPitchingStatsContainer']/table/tbody/tr[${team}]/td[${col}]/span`);
  return this.click(locator, 30000);
}

DetailedScorePage.prototype.clickPlayerPitchingStat = function(homeOrAway, row, col) {
  var tableID = (homeOrAway == "home") ? 'tableBaseballGamePlayerPitchingStatsHomeContainer' : 'tableBaseballGamePlayerPitchingStatsAwayContainer';     
  var locator = By.xpath(`.//div[@id='${tableID}']/table/tbody/tr[${row}]/td[${col}]/span`);
  return this.click(locator, 30000);
};

/****************************************************************************
** Pitch by Pitch
*****************************************************************************/
DetailedScorePage.prototype.addDecisiveEventFilter = function(filter) {
  return this.changeDropdown(DECISIVE_EVENT_FILTER_SELECT, DECISIVE_EVENT_FILTER_INPUT, filter);
};

/****************************************************************************
** Pitching Splits
*****************************************************************************/
DetailedScorePage.prototype.getPitchingSplitStat = function(playerNum, tableNum, row, col) {
  // row input starts from 'Total' Row
  var outerRow = (playerNum - 1) * 7  + tableNum + 4;
  var innerRow = row + 3
  var locator = By.xpath(`.//div[@id='pad-wrapper']/div[2]/div/div[@class='row'][${outerRow}]/div/table/tbody/tr[${innerRow}]/td[${col}]`);
  
  return this.getText(locator);
};

DetailedScorePage.prototype.getPitchingSplitsPitcherName = function(playerNum) {
  var row = (playerNum - 1) * 7 + 4;  
  var locator = By.xpath(`.//div[@id='pad-wrapper']/div[2]/div/div[@class='row'][${row}]/div/h1`)
  
  return this.getText(locator);
};

/****************************************************************************
** Data Comparison 
*****************************************************************************/
DetailedScorePage.prototype.comparsionLocator = TABLES;
DetailedScorePage.prototype.battingLastLocator = AWAY_BATTING_TABLE;
DetailedScorePage.prototype.pitchingLastLocator = AWAY_PITCHING_TABLE;

module.exports = DetailedScorePage;