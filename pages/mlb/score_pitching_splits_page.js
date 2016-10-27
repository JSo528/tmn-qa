'use strict';

// Load Base Page
var BasePage = require('../../pages/base/base_page.js')

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;

// Locators
var FILTER_SELECT = By.id('s2id_filterBaseballPitcherForGame');
var FILTER_INPUT = By.id('s2id_autogen48_search');
var TABLES = By.css('table');

function ScorePitchingSplitsPage(driver) {
  BasePage.call(this, driver);
};

ScorePitchingSplitsPage.prototype = Object.create(BasePage.prototype);
ScorePitchingSplitsPage.prototype.constructor = ScorePitchingSplitsPage;

ScorePitchingSplitsPage.prototype.getPitchingSplitStat = function(playerNum, tableNum, row, col) {
  // row input starts from 'Total' Row
  var outerRow = (playerNum - 1) * 7  + tableNum + 4;
  var innerRow = row + 3
  var locator = By.xpath(`.//div[@id='pad-wrapper']/div[2]/div/div[@class='row'][${outerRow}]/div/table/tbody/tr[${innerRow}]/td[${col}]`);
  
  return this.getText(locator);
};

ScorePitchingSplitsPage.prototype.getPitcherName = function(playerNum) {
  var row = (playerNum - 1) * 7 + 4;  
  var locator = By.xpath(`.//div[@id='pad-wrapper']/div[2]/div/div[@class='row'][${row}]/div/h1`)
  
  return this.getText(locator);
};

ScorePitchingSplitsPage.prototype.addPitcherFilter = function(pitcher) {
  return this.changeDropdown(FILTER_SELECT, FILTER_INPUT, pitcher);
}

ScorePitchingSplitsPage.prototype.comparisonLocator = TABLES;

module.exports = ScorePitchingSplitsPage;