'use strict';

// Load Base Page
var BasePage = require('../../../pages/base/base_page.js');

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;
var Key = require('selenium-webdriver').Key;

// Locators
var SUB_SECTION_TITLE = {
  'opposingHittingMatchupsWOBA': 'Opposing Hitting Matchups (wOBA)',
  'opposingHittingMatchupsAVG': 'Opposing Hitting Matchups (AVG)',
  'hittingTendencies': 'Hitting Tendencies',
  'tendenciesByCount': 'Tendencies by Count',
  'sprayCharts': 'Spray Charts',
  'opposingPitchingMatchupsWOBA': 'Opposing Pitching Matchups (wOBA)',
  'opposingPitchingMatchupsAVG': 'Opposing Pitching Matchups (AVG)',
  'pitcherTendencies': 'Pitcher Tendencies'
};

// Hitting Matchups / Pitching Matchups
var MODAL_BTN = {
  'batters': By.id('editRosterBatters'),
  'sp': By.id('editRosterSP'),
  'rp': By.id('editRosterRP')
};

var MODAL_ID = {
  'batters': 'tableBaseballRosterBattersModal',
  'sp': 'tableBaseballRosterSPModal',
  'rp': 'tableBaseballRosterRPModal'
};

var MODAL_TABLE_ID = {
  'batters': 'tableBaseballRosterBattersContainer',
  'sp': 'tableBaseballRosterSPContainer',
  'rp': 'tableBaseballRosterRPContainer'
};

var MODAL_SEARCH_INPUT = {
  'batters': By.css('#tableBaseballRosterBattersRosterSearch input'),
  'sp': By.css('#tableBaseballRosterSPRosterSearch input'),
  'rp': By.css('#tableBaseballRosterRPRosterSearch input')
};

function Tigers(driver) {
  BasePage.call(this, driver);
}

Tigers.prototype = Object.create(BasePage.prototype);
Tigers.prototype.constructor = Tigers;

Tigers.prototype.goToSubSection = function(subSection) {
  this.subSection = subSection;
  var locator = By.xpath(`.//nav[contains(@class, 'report-nav')]/.//a[text()='${SUB_SECTION_TITLE[this.subSection]}']`);
  return this.click(locator);
};

// Oppositing Hitting
Tigers.prototype.getOpposingPlayerStarterTableStat = function(outerRow, outerCol, innerRow, innerCol) {
  var locator = By.xpath(`.//row/table/tbody/tr[${outerRow}]/td[${outerCol}]/table/tbody/tr[${innerRow}]/td[${innerCol}]`);
  return this.getText(locator);
};

Tigers.prototype.getOpposingPlayerRelieverTableStat = function(outerRow, outerCol, innerRow, innerCol) {
  var locator = By.xpath(`.//div/table/tbody/tr[${outerRow}]/td[${outerCol}]/table/tbody/tr[${innerRow}]/td[${innerCol}]`);
  return this.getText(locator);
};

// Pattern is different on this page for some reason
Tigers.prototype.getPitcherWOBAOpposingPlayerTableStat = function(tableNum, outerRow, outerCol, innerRow, innerCol) {
  var locator = By.xpath(`.//table[${tableNum}]/tbody/tr[${outerRow}]/td[${outerCol}]/table/tbody/tr[${innerRow}]/td[${innerCol}]`);
  return this.getText(locator);
};

// modal
Tigers.prototype.clickEditRosterBtn = function(modalType) {
  this.modalType = modalType;
  this.waitForEnabled(MODAL_BTN[this.modalType]);
  this.click(MODAL_BTN[this.modalType]);
  return this.waitForEnabled(By.xpath(`.//div[@id='${MODAL_TABLE_ID[this.modalType]}']/table`));
};

Tigers.prototype.removePlayerFromModal = function(playerNum) {
  var locator = By.xpath(`.//div[@id='${MODAL_TABLE_ID[this.modalType]}']/table/tbody/tr[${playerNum}]/td[1]/span`);
  return this.clickOffset(locator, 5, 5);
};

Tigers.prototype.getModalTableStat = function(playerNum, col) {
  var locator = By.xpath(`.//div[@id='${MODAL_TABLE_ID[this.modalType]}']/table/tbody/tr[${playerNum}]/td[${col}]`);
  return this.getText(locator);
};

Tigers.prototype.selectForAddPlayerSearch = function(name) {
  return this.selectFromSearch(MODAL_SEARCH_INPUT[this.modalType], name, 1);
};

Tigers.prototype.selectDefaultRoster = function() {
  var locator = By.xpath(`.//div[@id='${MODAL_ID[this.modalType]}']/.//div[@class='modal-footer']/button[1]`);
  return this.click(locator);
};

Tigers.prototype.closeModal = function() {
  var locator = By.xpath(`.//div[@id='${MODAL_ID[this.modalType]}']/.//div[@class='modal-footer']/button[2]`);
  return this.click(locator);
};

// Hitting Tendencies
Tigers.prototype.getHeatmapTitle = function(playerNum, row, col) {
  var d = Promise.defer();
  var thiz = this;
  var locator = By.xpath(`.//div[2]/div/table[${playerNum}]/tbody/tr/td/table/tbody/tr[${row}]/td[${col}]/img`);
  this.getAttribute(locator, 'src').then(function(src) {
    d.fulfill(thiz.getParameterByName('title', src));
  });

  return d.promise;
};

// Pitcher Tendencies
Tigers.prototype.getPitcherTendenciesTableHeader = function(colNum) {
  var locator = By.xpath(`.//table/tbody/tr[1]/th[${colNum}]`);
  return this.getText(locator);
};

// Tendencies by Count
Tigers.prototype.getTendenciesByCountTableHeader = function(colNum) {
  var locator = By.xpath(`.//table/thead/tr/th[${colNum}]`);
  return this.getText(locator);
};

// Spray Charts
Tigers.prototype.isSprayChartDisplayed = function(playerNum, outfieldOrInfield) {
  var d = Promise.defer();
  var svgNum = (outfieldOrInfield == 'outfield') ? 1 : 2;
  var locator = By.css(`table:nth-of-type(${playerNum}) tr:nth-of-type(2) > td:nth-of-type(${svgNum}) svg`);
  return this.isDisplayed(locator);
};

module.exports = Tigers;