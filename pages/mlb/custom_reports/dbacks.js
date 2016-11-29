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
var SUB_SECTION_TITLE = {
  'hittingSituationMaps': 'Hitting Situation Maps',
  'heatMaps': 'Heat Maps'
};

function Dbacks(driver) {
  BasePage.call(this, driver);
}

Dbacks.prototype = Object.create(BasePage.prototype);
Dbacks.prototype.constructor = Dbacks;

Dbacks.prototype.goToSubSection = function(subSection) {
  this.subSection = subSection;
  var locator = By.xpath(`.//nav[contains(@class, 'report-nav')]/.//a[text()='${SUB_SECTION_TITLE[this.subSection]}']`);
  return this.click(locator);
};

// Team Heat Maps
Dbacks.prototype.getTeamHeatMapTitle = function(playerNum, slgOrAvg, row, col) {
  var d = Promise.defer();
  var thiz = this;

  var tableNum;

  if (isNaN(playerNum)) {
    tableNum = playerNum;
  } else {
    var addRows = (slgOrAvg == 'slg') ? 1 : 2;
    tableNum = (playerNum - 1) * 2 + addRows;  
  }

  var rowNum = row+1;
  
  var locator = By.xpath(`.//table[${tableNum}]/tbody/tr[${rowNum}]/td[${col}]/img`);
  
  this.getAttribute(locator, 'src').then(function(src) {
    d.fulfill(thiz.getParameterByName('title', src));
  });

  return d.promise;  
};

Dbacks.prototype.getPlayerName = function(playerNum, slgOrAvg) {
  // for things like last(), etc.
  var row;
  if (isNaN(playerNum)) {
    row = playerNum;
  } else {
    var addRows = (slgOrAvg == 'slg') ? 1 : 2;
    row = (playerNum - 1) * 2 + addRows;  
  }
    
  var locator = By.xpath(`.//table[${row}]/tbody/tr[1]/td/h4`);
  return this.getText(locator);
};

// Umpire Heat Maps
Dbacks.prototype.getUmpireHeatMapTitle = function(table, row, col) {
  var d = Promise.defer();
  var thiz = this;
  var rowNum = row * 2 + 1;

  var locator = By.xpath(`.//div/table[${table}]/tbody/tr[${rowNum}]/td[${col}]/img`);
  
  this.getAttribute(locator, 'src').then(function(src) {
    d.fulfill(thiz.getParameterByName('title', src));
  });

  return d.promise;  
};

Dbacks.prototype.getUmpireHeatMapSectionTitle = function(table) {
  var locator = By.xpath(`.//table[${table}]/tbody/tr[1]/td/h4`);
  
  return this.getText(locator);
};

// Mixins
_.extend(Dbacks.prototype, editRosterModal);

module.exports = Dbacks;