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
  'hittingMaps': 'Hitting Maps',
  'sprayCharts': 'Spray Charts',
  'infieldSprayCharts': 'Infield Spray Charts',
  'swingMissMaps': 'Swing/Miss Maps',
  'twoStrikeMaps': '2 Strike Maps',
  'heatMaps': 'Heat Maps'
};

// // Hitting Matchups / Pitching Matchups
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

function Twins(driver) {
  BasePage.call(this, driver);
}

Twins.prototype = Object.create(BasePage.prototype);
Twins.prototype.constructor = Twins;

Twins.prototype.goToSubSection = function(subSection) {
  this.subSection = subSection;
  var locator = By.xpath(`.//nav[contains(@class, 'report-nav')]/.//a[text()='${SUB_SECTION_TITLE[this.subSection]}']`);
  return this.click(locator);
};

// Team Heat Maps
Twins.prototype.getTeamHeatMapTitle = function(playerNum, rowNum, colNum) {
  var d = Promise.defer();
  var thiz = this;
  var row = rowNum + 1;
  var locator = By.xpath(`.//table[${playerNum}]/tbody/tr[${row}]/td[${colNum}]/img`);
  
  this.getAttribute(locator, 'src').then(function(src) {
    d.fulfill(thiz.getParameterByName('title', src));
  });

  return d.promise;  
};

// Player Heat Maps
Twins.prototype.getPlayerHeatMapTitle = function(rowNum, colNum) {
  var d = Promise.defer();
  var thiz = this;
  var locator = By.xpath(`.//div[contains(@class,'heat-map-row')][${rowNum}]/div[@class='col-xs-5'][${colNum}]/img`);
  
  this.getAttribute(locator, 'src').then(function(src) {
    d.fulfill(thiz.getParameterByName('title', src));
  });

  return d.promise;  
};

// Player Heat Maps
Twins.prototype.getUmpireHeatMapTitle = function(rowNum) {
  var d = Promise.defer();
  var thiz = this;
  var row = rowNum + 1;
  var locator = By.xpath(`.//table/tbody/tr[${row}]/td/img`);
  
  this.getAttribute(locator, 'src').then(function(src) {
    d.fulfill(thiz.getParameterByName('title', src));
  });

  return d.promise;  
};

// Spray Charts
Twins.prototype.getSprayChartPlayerName = function(playerNum) {
  // for things like last(), etc.
  var row = (isNaN(playerNum)) ? playerNum : playerNum * 2 - 1;
    
  var locator = By.xpath(`.//table[${row}]/tbody/tr[1]/td/legend/h2`);
  return this.getText(locator);
};

Twins.prototype.getSprayChartStat = function(playerNum, colNum, rowNum) {
  var tableNum = playerNum * 2 - 1;
  var locator = By.xpath(`.//table[${tableNum}]/tbody/tr[2]/td[${colNum}]/div/table/tbody/tr/h5[${rowNum}]`);
  return this.getText(locator);
};

// modal
Twins.prototype.clickEditRosterBtn = function(modalType) {
  this.modalType = modalType;
  this.waitForEnabled(MODAL_BTN[this.modalType]);
  this.click(MODAL_BTN[this.modalType]);
  return this.waitForEnabled(By.xpath(`.//div[@id='${MODAL_TABLE_ID[this.modalType]}']/table`));
};

Twins.prototype.removePlayerFromModal = function(playerNum) {
  var locator = By.xpath(`.//div[@id='${MODAL_TABLE_ID[this.modalType]}']/table/tbody/tr[${playerNum}]/td[1]/span`);
  return this.clickOffset(locator, 5, 5);
};

Twins.prototype.getModalTableStat = function(playerNum, col) {
  var locator = By.xpath(`.//div[@id='${MODAL_TABLE_ID[this.modalType]}']/table/tbody/tr[${playerNum}]/td[${col}]`);
  return this.getText(locator);
};

Twins.prototype.selectForAddPlayerSearch = function(name) {
  return this.selectFromSearch(MODAL_SEARCH_INPUT[this.modalType], name, 1);
};

Twins.prototype.selectDefaultRoster = function() {
  var locator = By.xpath(`.//div[@id='${MODAL_ID[this.modalType]}']/.//div[@class='modal-footer']/button[1]`);
  return this.click(locator);
};

Twins.prototype.closeModal = function() {
  var locator = By.xpath(`.//div[@id='${MODAL_ID[this.modalType]}']/.//div[@class='modal-footer']/button[2]`);
  return this.click(locator);
};

module.exports = Twins;