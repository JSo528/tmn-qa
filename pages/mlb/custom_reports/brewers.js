'use strict';

// Load Base Page
var BasePage = require('../../../pages/base/base_page.js');

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;
var Key = require('selenium-webdriver').Key;

// Locators
var DROPDOWN_INPUT = By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input");
var VISUAL_MODE_SELECT = By.id('s2id_pageControlBaseballVisMode');

var SUB_SECTION_TITLE = {
  'hittingSituationMaps': 'Hitting Situation Maps'
};

function Brewers(driver) {
  BasePage.call(this, driver);
}

Brewers.prototype = Object.create(BasePage.prototype);
Brewers.prototype.constructor = Brewers;

Brewers.prototype.goToSubSection = function(subSection) {
  this.subSection = subSection;
  var locator = By.xpath(`.//nav[contains(@class, 'report-nav')]/.//a[text()='${SUB_SECTION_TITLE[this.subSection]}']`);
  this.click(locator);
  return this.waitForEnabled(VISUAL_MODE_SELECT);
};

Brewers.prototype.getPlayerNameForRow = function(tableNum, rowNum) {
  var row = rowNum + 1;
  var locator = By.xpath(`.//div[@class='row'][2]/div/table[${tableNum}]/tbody/tr[${row}]/td[1]`);
  return this.getText(locator);
};

Brewers.prototype.getHeatmapTitle = function(tableNum, rowNum, colNum) {
  var d = Promise.defer();
  var thiz = this;
  
  var row = rowNum + 1;
  var col = colNum + 1;
  var locator = By.xpath(`.//div[@class='row'][2]/div/table[${tableNum}]/tbody/tr[${row}]/td[${col}]/img`);
  
  this.getAttribute(locator, 'src').then(function(src) {
    d.fulfill(thiz.getParameterByName('title', src));
  });

  return d.promise;
};

module.exports = Brewers;