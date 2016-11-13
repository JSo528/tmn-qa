'use strict';

// Load Base Page
var BasePage = require('../../../pages/base/base_page.js');

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;

// Locators
var BY_INNING_TAB = By.xpath(".//div[@id='reportTabsSection0']/.//li[1]/a");
var FLAT_VIEW_TAB = By.xpath(".//div[@id='reportTabsSection0']/.//li[2]/a");
var SIMILAR_PLAYS_MODAL_CLOSE_BTN = By.css('#tableBaseballFindSimilarModalId button');

var BY_INNING_TABLE_ID = {
  'batting': 'tableBaseballTeamPitchLogBattingContainer',
  'pitching': 'tableBaseballTeamPitchLogPitchingContainer',
  'catching': 'tableBaseballTeamPitchLogCatchingContainer',
  'statcastFielding': 'tableBaseballTeamPitchLogStatcastContainer'
}

var FLAT_VIEW_TABLE_ID = {
  'batting': 'tableBaseballTeamPitchTableBattingContainer',
  'pitching': 'tableBaseballTeamPitchTablePitchingContainer',
  'catching': 'tableBaseballTeamPitchTableCatchingContainer',
  'statcastFielding': 'tableBaseballTeamPitchTableStatcastContainer'
}

function PitchLogPage(driver, section) {
  BasePage.call(this, driver);
  this.section = section;
};

PitchLogPage.prototype = Object.create(BasePage.prototype);
PitchLogPage.prototype.constructor = PitchLogPage;


PitchLogPage.prototype.clickByInningTab = function() {
  var element = this.driver.findElement(BY_INNING_TAB);
  return element.click();  
};

PitchLogPage.prototype.clickFlatViewTab = function() {
  var element = this.driver.findElement(FLAT_VIEW_TAB);
  return element.click();  
};

// By Inning Table
PitchLogPage.prototype.getByInningHeaderText = function(topOrBottom, inning) {
  var addRow = (topOrBottom == "bottom") ? 2 : 1;
  var row = inning * 2 - 2 + addRow;
  
  var locator = By.xpath(`.//div[@id='${BY_INNING_TABLE_ID[this.section]}']/table/tbody/tr[@class='sectionHeader sectionInning'][${row}]/td`);
  return this.getText(locator, 20000);
};

PitchLogPage.prototype.getByInningAtBatHeaderText = function(atBatNum) {
  var locator = By.xpath(`.//div[@id='${BY_INNING_TABLE_ID[this.section]}']/table/tbody/tr[@class='sectionHeaderAlt sectionStartOfBat'][${atBatNum}]/td`);
  return this.getText(locator);
};

PitchLogPage.prototype.getByInningAtBatFooterText = function(atBatNum) {
  var locator = By.xpath(`.//div[@id='${BY_INNING_TABLE_ID[this.section]}']/table/tbody/tr[@class='sectionHeaderAlt sectionEndOfBat'][${atBatNum}]/td`);
  return this.getText(locator);
};

PitchLogPage.prototype.getByInningTableStat = function(pitchNum, col) {
  var locator = By.xpath(`.//div[@id='${BY_INNING_TABLE_ID[this.section]}']/table/tbody/tr[contains(@data-tmn-row-type,'row')][${pitchNum}]/td[${col}]`);
  return this.getText(locator);
};

// Flat View Table
PitchLogPage.prototype.getFlatViewTableStat = function(rowNum, col) {
  var locator = By.xpath(`.//div[@id='${FLAT_VIEW_TABLE_ID[this.section]}']/table/tbody/tr[${rowNum}]/td[${col}]`);
  return this.getText(locator, 30000);
};


// Statcast Fielding Specific
PitchLogPage.prototype.clickStatcastFieldingSimiliarIcon = function(pitchNum) {
  var locator = By.xpath(`//div[@id='tableBaseballTeamPitchLogStatcastContainer']/table/tbody/tr[contains(@data-tmn-row-type,'row')][${pitchNum}]/td[1]/i[contains(@class,'statcastFindSimIcon')]`);
  return this.click(locator);
};

PitchLogPage.prototype.getSimiliarPlaysTableStat = function(playNum, col) {
  var row = playNum + 1;
  var locator = By.xpath(`//div[@id='tableBaseballFindSimilarModalContainer']/table/tbody/tr[contains(@data-tmn-row-type,'row')][${row}]/td[${col}]`);
  return this.getText(locator);  
};

PitchLogPage.prototype.closeSimiliarPlaysModal = function() {
  var element = driver.findElement(SIMILAR_PLAYS_MODAL_CLOSE_BTN);
  element.click();
  return this.waitForEnabled(By.xpath(`//div[@id='tableBaseballFindSimilarModalContainer']/table`));
};


module.exports = PitchLogPage;