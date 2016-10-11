'use strict';

// Load Base Page
var BasePage = require('../../../pages/base/base_page.js');

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;

// Locators
var STREAK_TYPE_SELECT = By.id('s2id_pageControlBaseballStrkType');
var STREAK_TYPE_INPUT = By.id('s2id_autogen1_search');

var CONSTRAINT_COMPARE_SELECT = By.id('s2id_pageControlBaseballStrkConstraintCompare');
var CONSTRAINT_COMPARE_INPUT = By.id('s2id_autogen2_search');

var CONSTRAINT_VALUE_INPUT = By.id('pageControlBaseballStrkConstraintValue');

var CONSTRAINT_STAT_SELECT = By.id('s2id_pageControlBaseballStrkConstraintStat');
var CONSTRAINT_STAT_INPUT = By.id('s2id_autogen3_search');

var STREAK_GROUPING_SELECT = By.id('s2id_pageControlBaseballStrkGrouping');
var STREAK_GROUPING_INPUT = By.id('s2id_autogen4_search');

var STREAK_SCOPE_SELECT = By.id('s2id_pageControlBaseballStrkScope');
var STREAK_SCOPE_INPUT = By.id('s2id_autogen5_search');

var UPDATE_CONSTRAINTS_BUTTON = By.id('pageControlBaseballStrkBtnUpdate');

function StreaksPage(driver) {
  BasePage.call(this, driver);
};

StreaksPage.prototype = Object.create(BasePage.prototype);
StreaksPage.prototype.constructor = StreaksPage;

StreaksPage.prototype.getTableHeader = function(col) {
  var locator = By.xpath(`.//div[@id='tableBaseballTeamsStreaksContainer']/table/thead/tr/th[${col}]`);
  return this.getText(locator);
};

StreaksPage.prototype.getTableStat = function(row, col) {
  var locator = By.xpath(`.//div[@id='tableBaseballTeamsStreaksContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator);
};

StreaksPage.prototype.changeMainConstraint = function(streakType, constraintCompare, constraintValue, constraintStat, streakGrouping, streakScope) {
  this.changeDropdown(STREAK_TYPE_SELECT, STREAK_TYPE_INPUT, streakType);
  this.changeDropdown(CONSTRAINT_COMPARE_SELECT, CONSTRAINT_COMPARE_INPUT, constraintCompare);
  this.clear(CONSTRAINT_VALUE_INPUT)
  this.sendKeys(CONSTRAINT_VALUE_INPUT, constraintValue);
  this.changeDropdown(CONSTRAINT_STAT_SELECT, CONSTRAINT_STAT_INPUT, constraintStat);
  this.changeDropdown(STREAK_GROUPING_SELECT, STREAK_GROUPING_INPUT, streakGrouping);
  this.changeDropdown(STREAK_SCOPE_SELECT, STREAK_SCOPE_INPUT, streakScope);
  this.click(UPDATE_CONSTRAINTS_BUTTON);
};

StreaksPage.prototype.addConstraint = function(constraintCompare, constraintValue, constraintStat) {

};

StreaksPage.prototype.removeConstraint = function(constraintNum) {

};

module.exports = StreaksPage;