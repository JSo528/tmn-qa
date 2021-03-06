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
  'hittingMaps': 'Hitting Maps',
  'sprayCharts': 'Spray Charts',
  'infieldSprayCharts': 'Infield Spray Charts',
  'swingMissMaps': 'Swing/Miss Maps',
  'twoStrikeMaps': '2 Strike Maps',
  'heatMaps': 'Heat Maps'
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

// Mixins
_.extend(Twins.prototype, editRosterModal);

module.exports = Twins;