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
  'sprayCharts': 'Spray Charts',
};

// Spray Charts
var LAST_BALLS_IN_PLAY_INPUT = By.id('pageControlBaseballRecentBaseballBallsInPlayValue');
var LAST_BALLS_IN_PLAY_SUBMIT = By.id('pageControlBaseballBIPUpdate');

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

function Angels(driver) {
  BasePage.call(this, driver);
}

Angels.prototype = Object.create(BasePage.prototype);
Angels.prototype.constructor = Angels;

Angels.prototype.goToSubSection = function(subSection) {
  this.subSection = subSection;
  var locator = By.xpath(`.//nav[contains(@class, 'report-nav')]/.//a[text()='${SUB_SECTION_TITLE[this.subSection]}']`);
  return this.click(locator);
};

// Spray Charts
Angels.prototype.getSprayChartPlayerName = function(playerNum) {    
  var locator = By.xpath(`.//table[${playerNum}]/tbody/tr[1]/td/legend/h2`);
  return this.getText(locator);
};

Angels.prototype.getSprayChartBallCount = function(playerNum, row, col) {    
  var locator = By.css(`table:nth-of-type(${playerNum}) tr:nth-of-type(${row}) td:nth-of-type(${col}) circle.plotPoint`);
  return this.getElementCount(locator);
};

Angels.prototype.changeLastBallsInPlayInput = function(numBalls) {
  this.clear(LAST_BALLS_IN_PLAY_INPUT);
  this.sendKeys(LAST_BALLS_IN_PLAY_INPUT, numBalls);
  return this.click(LAST_BALLS_IN_PLAY_SUBMIT);
};

// modal
Angels.prototype.clickEditRosterBtn = function(modalType) {
  this.modalType = modalType;
  this.waitForEnabled(MODAL_BTN[this.modalType]);
  this.click(MODAL_BTN[this.modalType]);
  return this.waitForEnabled(By.xpath(`.//div[@id='${MODAL_TABLE_ID[this.modalType]}']/table`));
};

Angels.prototype.removePlayerFromModal = function(playerNum) {
  var locator = By.xpath(`.//div[@id='${MODAL_TABLE_ID[this.modalType]}']/table/tbody/tr[${playerNum}]/td[1]/span`);
  return this.clickOffset(locator, 5, 5);
};

Angels.prototype.getModalTableStat = function(playerNum, col) {
  var locator = By.xpath(`.//div[@id='${MODAL_TABLE_ID[this.modalType]}']/table/tbody/tr[${playerNum}]/td[${col}]`);
  return this.getText(locator);
};

Angels.prototype.selectForAddPlayerSearch = function(name) {
  return this.selectFromSearch(MODAL_SEARCH_INPUT[this.modalType], name, 1);
};

Angels.prototype.selectDefaultRoster = function() {
  var locator = By.xpath(`.//div[@id='${MODAL_ID[this.modalType]}']/.//div[@class='modal-footer']/button[1]`);
  return this.click(locator);
};

Angels.prototype.closeModal = function() {
  var locator = By.xpath(`.//div[@id='${MODAL_ID[this.modalType]}']/.//div[@class='modal-footer']/button[2]`);
  return this.click(locator);
};

module.exports = Angels;