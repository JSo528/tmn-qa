'use strict';

// Load Base Page
var BasePage = require('../../../pages/base/base_page.js');

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;
var Key = require('selenium-webdriver').Key;

// Mixins
var _ = require('underscore');
var editRosterModal = require('../mixins/editRosterModal.js');

// Locators
var YEAR_SELECT = By.id('s2id_pageControlStatYear');
var DROPDOWN_INPUT = By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input");

var SUB_SECTION_TITLE = {
  'hittingMatchups': 'Hitting Matchups',
  'pitchingMatchups': 'Pitching Matchups',
  'dugoutCard': 'Dugout Card',
  'likelyOutcomes': 'Likely Outcomes',
  'hitterTendencies': 'Hitter Tendencies',
  'pitcherTendencies': 'Pitching Tendencies',
  'pitcherPercentages': 'Pitcher Percentages'
};

// Hitting Matchups / Pitching Matchups
var STARTERS_TABLE_ID = {
  'hittingMatchups': 'startersTable',
  'pitchingMatchups': 'StartingTable'
};

var RELIEVERS_TABLE_ID = {
  'hittingMatchups': 'relieversTable',
  'pitchingMatchups': 'relieverTable'
};

function Phillies(driver, currentPage) {
  BasePage.call(this, driver);
  this.currentPage = currentPage;
}

Phillies.prototype = Object.create(BasePage.prototype);
Phillies.prototype.constructor = Phillies;

Phillies.prototype.goToSubSection = function(subSection) {
  this.subSection = subSection;
  var locator = By.xpath(`.//nav[contains(@class, 'report-nav')]/.//a[text()='${SUB_SECTION_TITLE[this.subSection]}']`);
  return this.click(locator);
};

// Hitting/Pitching Matchups
Phillies.prototype.getTableTitle = function(tableNum) {
  var locator = By.xpath(`.//legend[${tableNum}]`);
  return this.getText(locator); 
};

Phillies.prototype.getStartersTableHeader = function(col) {
  var locator = By.xpath(`.//table[@id='${STARTERS_TABLE_ID[this.subSection]}']/tbody/tr/th[${col}]`);
  return this.getText(locator); 
};

Phillies.prototype.getStartersTableStat = function(playerNum, col) {
  var row = playerNum + 1;

  var locator = By.xpath(`.//table[@id='${STARTERS_TABLE_ID[this.subSection]}']/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator); 
};

Phillies.prototype.getRelieversTableHeader = function(col) {
  var locator = By.xpath(`.//table[@id='${RELIEVERS_TABLE_ID[this.subSection]}']/tbody/tr/th[${col}]`);
  return this.getText(locator); 
};

Phillies.prototype.getRelieversTableStat = function(playerNum, col) {
  var row = playerNum + 1;

  var locator = By.xpath(`.//table[@id='${RELIEVERS_TABLE_ID[this.subSection]}']/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator); 
};

// Dugout Card
Phillies.prototype.getDugoutCardTableTitle = function(tableNum) {
  var locator = By.xpath(`.//table[${tableNum}]/.//legend`);
  return this.getText(locator);
};

// Likely Outcomes
Phillies.prototype.getLikelyOutcomeInputValue = function(row, inputNum) {
  var d = Promise.defer();
  var locator = By.css(`table tr:nth-of-type(${row}) input:nth-of-type(${inputNum})`);
  this.getAttribute(locator, 'value').then(function(value) {
    d.fulfill(value);
  });
  return d.promise;
};

// Pitcher Tendencies
Phillies.prototype.getPitcherTendenciesInputValue = function(pitcherNum, inputNum) {
  var d = Promise.defer(); 
  var locator = By.css(`ul#pitcherList li.phillies-box-xs:nth-of-type(${pitcherNum}) > ul > li:nth-of-type(${inputNum}) input`);
  this.getAttribute(locator, 'value').then(function(value) {
    d.fulfill(value);
  });
  return d.promise;
};

// Hitter Tendencies
Phillies.prototype.getHeatMapImageCount = function() {
  var d = Promise.defer(); 
  var locator = By.css("table.PrintingOverSizeFontLarger td img");
  this.getElementCount(locator).then(function(count) {
    d.fulfill(count);
  });
  return d.promise;
};

Phillies.prototype.getHitterTendanciesTableHeader = function(table, col) {
  var locator = By.xpath(`.//table[contains(@class, 'PrintingOverSizeFontLarger')][${table}]/tbody/tr[1]/th[${col}]`);
  return this.getText(locator);
};

// Pitcher Percentages
Phillies.prototype.getPitcherPercentagesPitchVelocity = function(rowNum) {
  var row = rowNum + 1;
  var locator = By.xpath(`.//ul/li[${row}]/a/h4`);
  return this.getText(locator);
};

// Mixins
_.extend(Phillies.prototype, editRosterModal);

module.exports = Phillies;