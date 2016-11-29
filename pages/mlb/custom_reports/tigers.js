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
  'opposingHittingMatchupsWOBA': 'Opposing Hitting Matchups (wOBA)',
  'opposingHittingMatchupsAVG': 'Opposing Hitting Matchups (AVG)',
  'hittingTendencies': 'Hitting Tendencies',
  'tendenciesByCount': 'Tendencies by Count',
  'sprayCharts': 'Spray Charts',
  'opposingPitchingMatchupsWOBA': 'Opposing Pitching Matchups (wOBA)',
  'opposingPitchingMatchupsAVG': 'Opposing Pitching Matchups (AVG)',
  'pitcherTendencies': 'Pitcher Tendencies'
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

// Mixins
_.extend(Tigers.prototype, editRosterModal);

module.exports = Tigers;