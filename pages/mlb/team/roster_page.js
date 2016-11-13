'use strict';

// Load Base Page
var BasePage = require('../../../pages/base/base_page.js');

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;

// Locators
var ON_TEAM_SELECT = By.id("s2id_pageControlBaseballRosterOnTeam");
var TABLE_ID = {
  'batting': 'tableBaseballTeamStatsRosterBattingContainer',
  'pitching': 'tableBaseballTeamStatsRosterPitchingContainer',
  'catching': 'tableBaseballTeamStatsRosterCatchingContainer',
  'statcastFielding': 'tableBaseballTeamStatsRosterContainer'
}

function RosterPage(driver, section) {
  BasePage.call(this, driver);
  this.section = section;
};

RosterPage.prototype = Object.create(BasePage.prototype);
RosterPage.prototype.constructor = RosterPage;

RosterPage.prototype.getTableStat = function(playerNum, col) {
  // First 3 rows are for the headers
  var row = playerNum + 3;
  var locator = By.xpath(`.//div[@id='${TABLE_ID[this.section]}']/table/tbody/tr[4]/td[${col}]`);

  return this.getText(locator, 30000);
};

RosterPage.prototype.changeOnTeamDropdown = function(type) {
  return this.changeDropdown(ON_TEAM_SELECT, DROPDOWN_INPUT, report);
  
};

module.exports = RosterPage;