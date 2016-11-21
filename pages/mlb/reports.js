'use strict';

// Load Base Page
var BasePage = require('../base/base_page.js')

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;

var BATTING_REPORTS = [
  "Rate",
  "Counting",
  "Pitch Rates",
  "Pitch Counts",
  "Pitch Types",
  "Pitch Type Counts",
  "Pitch Locations",
  "Pitch Calls",
  "Hit Types",
  "Hit Locations",
  "Home Runs",
  "Exit Data"
];

var PITCHING_REPORTS = [
  "Traditional",
  "Rate",
  "Counting",
  "Pitch Rates",
  "Pitch Counts",
  "Pitch Types",
  "Pitch Type Counts",
  "Pitch Locations",
  "Pitch Calls",
  "Hit Types",
  "Hit Locations",
  "Home Runs",
  "Movement",
  "Bids",
  "Baserunning",
  "Exit Data"
];  

var CATCHING_REPORTS = [
  "Catcher Framing",
  "Catcher Defense",
  "Catcher Opposing Batters",
  "Catcher Pitch Rates",
  "Catcher Pitch Counts",
  "Pitching Counting",
  "Catcher Pitch Types",
  "Catcher Pitch Type Rates",
];

var TEAM_STATCAST_FIELDING_REPORTS = [
  "Outfielder Air Defense Positioning",
  "Outfielder Air Defense Team Model",
  "Outfielder Air Defense Team Skills",
  "Outfield Batter Positioning",
];

var PLAYER_STATCAST_FIELDING_REPORTS = [
  "Outfielder Air Defense Range",
  "Outfielder Air Defense Positioning",
  "Outfielder Air Defense Skills",
  "Outfield Batter Positioning",
];

var UMPIRE_REPORTS = [
  "Pitch Calls",
  "Batters",
  "Pitch Rates",
  "Pitch Counts",
  "Pitch Types",
  "Pitch Type Counts",
];

var REPORTS = {
  'batting': BATTING_REPORTS,
  'pitching': PITCHING_REPORTS,
  'catching': CATCHING_REPORTS,
  'playerStatcastFielding': PLAYER_STATCAST_FIELDING_REPORTS,
  'teamStatcastFielding': TEAM_STATCAST_FIELDING_REPORTS,
  'umpire': UMPIRE_REPORTS
}

function Reports(driver) {
  BasePage.call(this, driver);
};

Reports.prototype = Object.create(BasePage.prototype);
Reports.prototype.constructor = Reports;

Reports.prototype.selectRandomReport = function(type) {
  var reports = REPORTS[type];
  return reports[Math.floor(Math.random() * reports.length)];
}

Reports.prototype.getReports = function(type) {
  return REPORTS[type];
}

module.exports = Reports;