'use strict';

// Load Base Page
var BasePage = require('../../../pages/base/base_page.js');

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;

// Locators
var DROPDOWN_INPUT = By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input");
var STREAK_TYPE_SELECT = By.id('s2id_pageControlBaseballStrkType');
var CONSTRAINT_COMPARE_SELECT = By.id('s2id_pageControlBaseballStrkConstraintCompare');
var CONSTRAINT_VALUE_INPUT = By.id('pageControlBaseballStrkConstraintValue');
var CONSTRAINT_STAT_SELECT = By.id('s2id_pageControlBaseballStrkConstraintStatPlayer');
var STREAK_GROUPING_SELECT = By.id('s2id_pageControlBaseballStrkGroupingPlayer');
var STREAK_SCOPE_SELECT = By.id('s2id_pageControlBaseballStrkScope');
var UPDATE_CONSTRAINTS_BUTTON = By.id('pageControlBaseballStrkBtnUpdate');

function StreaksPage(driver) {
  BasePage.call(this, driver);
};

StreaksPage.prototype = Object.create(BasePage.prototype);
StreaksPage.prototype.constructor = StreaksPage;

StreaksPage.prototype.getTableHeader = function(col) {
  var locator = By.xpath(`.//div[@id='tableBaseballPlayersStreaksContainer']/table/thead/tr/th[${col}]`);
  return this.getText(locator);
};

StreaksPage.prototype.getTableStat = function(row, col) {
  var locator = By.xpath(`.//div[@id='tableBaseballPlayersStreaksContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator, 30000);
};

StreaksPage.prototype.changeMainConstraint = function(streakType, constraintCompare, constraintValue, constraintStat, streakGrouping, streakScope) {
  this.changeDropdown(STREAK_TYPE_SELECT, DROPDOWN_INPUT, streakType);
  this.changeDropdown(CONSTRAINT_COMPARE_SELECT, DROPDOWN_INPUT, constraintCompare);
  this.clear(CONSTRAINT_VALUE_INPUT)
  this.sendKeys(CONSTRAINT_VALUE_INPUT, constraintValue);
  this.changeDropdown(CONSTRAINT_STAT_SELECT, DROPDOWN_INPUT, constraintStat);
  this.changeDropdown(STREAK_GROUPING_SELECT, DROPDOWN_INPUT, streakGrouping);
  this.changeDropdown(STREAK_SCOPE_SELECT, DROPDOWN_INPUT, streakScope);
  return this.click(UPDATE_CONSTRAINTS_BUTTON);
};

// // TODO - figure out how to get the xpaths for these
// StreaksPage.prototype.addConstraint = function(constraintCompare, constraintValue, constraintStat) {

// };

// StreaksPage.prototype.removeConstraint = function(constraintNum) {

// };

module.exports = StreaksPage;