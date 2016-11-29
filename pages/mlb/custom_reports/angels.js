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
  'sprayCharts': 'Spray Charts',
};

// Spray Charts
var LAST_BALLS_IN_PLAY_INPUT = By.id('pageControlBaseballRecentBaseballBallsInPlayValue');
var LAST_BALLS_IN_PLAY_SUBMIT = By.id('pageControlBaseballBIPUpdate');

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

// Mixins
_.extend(Angels.prototype, editRosterModal);

module.exports = Angels;