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
  'printableReport': 'Printable Report',
  'vsCounts': 'vs Counts',
};

function Indians(driver) {
  BasePage.call(this, driver);
}

Indians.prototype = Object.create(BasePage.prototype);
Indians.prototype.constructor = Indians;

Indians.prototype.goToSubSection = function(subSection) {
  this.subSection = subSection;
  var locator = By.xpath(`.//nav[contains(@class, 'report-nav')]/.//a[text()='${SUB_SECTION_TITLE[this.subSection]}']`);
  return this.click(locator);
};

// Printable Reports
Indians.prototype.getHeatmapTitle = function(playerNum, col) {
  var d = Promise.defer();
  var thiz = this;

  var locator = By.xpath(`.//table[${playerNum}]/tbody/tr[3]/td[${col}]/img`);
  
  this.getAttribute(locator, 'src').then(function(src) {
    d.fulfill(thiz.getParameterByName('title', src));
  });

  return d.promise;
};

Indians.prototype.getSectionTitle = function(playerNum, rhpOrLhp) {
  var tableNum;
  var addTables = (rhpOrLhp == 'rhp') ? 1 : 2;
  if (isNaN(playerNum)) {
    tableNum = playerNum;
  } else {
    tableNum = (playerNum - 1) * 2 + addTables;
  }
  var locator = By.xpath(`.//table[${tableNum}]/tbody/tr[1]/td/h4`);
  return this.getText(locator);
};

// modal
Indians.prototype.clickEditRosterBtn = function(modalType) {
  this.modalType = modalType;
  this.waitForEnabled(MODAL_BTN[this.modalType]);
  this.click(MODAL_BTN[this.modalType]);
  return this.waitForEnabled(By.xpath(`.//div[@id='${MODAL_TABLE_ID[this.modalType]}']/table`));
};

Indians.prototype.removePlayerFromModal = function(playerNum) {
  var locator = By.xpath(`.//div[@id='${MODAL_TABLE_ID[this.modalType]}']/table/tbody/tr[${playerNum}]/td[1]/span`);
  return this.clickOffset(locator, 5, 5);
};

Indians.prototype.getModalTableStat = function(playerNum, col) {
  var locator = By.xpath(`.//div[@id='${MODAL_TABLE_ID[this.modalType]}']/table/tbody/tr[${playerNum}]/td[${col}]`);
  return this.getText(locator);
};

Indians.prototype.selectForAddPlayerSearch = function(name) {
  return this.selectFromSearch(MODAL_SEARCH_INPUT[this.modalType], name, 1);
};

Indians.prototype.selectDefaultRoster = function() {
  var locator = By.xpath(`.//div[@id='${MODAL_ID[this.modalType]}']/.//div[@class='modal-footer']/button[1]`);
  return this.click(locator);
};

Indians.prototype.closeModal = function() {
  var locator = By.xpath(`.//div[@id='${MODAL_ID[this.modalType]}']/.//div[@class='modal-footer']/button[2]`);
  return this.click(locator);
};

// VS Counts
Indians.prototype.getVsCountSectionTitle = function(sectionNum) {
  var divNum = 3 + (sectionNum - 1) * 4;
  var locator = By.xpath(`.//div[@class='row'][${divNum}]/div/h3`);
  return this.getText(locator);
};

// Mixins
_.extend(Indians.prototype, editRosterModal);

module.exports = Indians;