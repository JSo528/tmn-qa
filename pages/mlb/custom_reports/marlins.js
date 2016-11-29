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
var DROPDOWN_INPUT = By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input");

var SUB_SECTION_TITLE = {
  'customBatting': 'Custom Batting',
  'dugoutCard': 'Dugout Card',
  'customPitching': 'Custom Pitching',
  'menechinoReport': 'Menechino Report',
};

// Custom Batting
var GRID_ZONE_SELECT = By.id('s2id_pageControlBaseballGridZones');
var FIRST_HEATMAP_IMAGE = By.css('.heat-map-row img:nth-of-type(1)');

function Marlins(driver) {
  BasePage.call(this, driver);
}

Marlins.prototype = Object.create(BasePage.prototype);
Marlins.prototype.constructor = Marlins;

Marlins.prototype.goToSubSection = function(subSection) {
  this.subSection = subSection;
  var locator = By.xpath(`.//nav[contains(@class, 'report-nav')]/.//a[text()='${SUB_SECTION_TITLE[this.subSection]}']`);
  return this.click(locator);
};

// Team - Custom Batting/Pitching
Marlins.prototype.changeGridZones = function(number) {
  return this.changeDropdown(GRID_ZONE_SELECT, DROPDOWN_INPUT, number);
};

// 1st Image
Marlins.prototype.getNumberOfGridZonesForImages = function() {
  var d = Promise.defer();
  var thiz = this;

  this.getAttribute(FIRST_HEATMAP_IMAGE, 'src').then(function(href) {
    var zones = thiz.getParameterByName('zones', href);
    d.fulfill(zones*zones);
  });

  return d.promise;  
};

// 1st Player
Marlins.prototype.getHeaderForFirstPlayer = function() {
  var locator = By.xpath(".//div[@class='row'][2]/div/div[contains(@class,'player-summary-header')]/div[1]/h4");
  return this.getText(locator);
};


// Team - Dugout Card
Marlins.prototype.getLineupTableStat = function(row, col) {
  var locator = By.xpath(`.//table[@id='lineupBatters']/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator);
};

Marlins.prototype.getBullpenTableStat = function(row, col) {
  var locator = By.xpath(`.//table[@id='bullpenPitchers']/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator);
};

// Mendochino Report
Marlins.prototype.getMenechinoFirstPlayerHeatMapCount = function() {
  var d = Promise.defer();
  var locator = By.xpath(".//div[@class='row pageBreakAfter'][1]/div/div/div/img");
  this.getElementCount(locator).then(function(count) {
    d.fulfill(count);
  });

  return d.promise;
};

// Player - Custom Batting/Pitching
Marlins.prototype.getPlayerHeatMapCount = function() {
  var d = Promise.defer();
  var locator = By.css('.heat-map-row img');
  this.getElementCount(locator).then(function(count) {
    d.fulfill(count);
  });

  return d.promise;
};

// Mixins
_.extend(Marlins.prototype, editRosterModal);

module.exports = Marlins;