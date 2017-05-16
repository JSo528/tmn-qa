'use strict';

// Load Base Page
var BasePage = require('../../../pages/base/base_page.js');

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;
var Key = require('selenium-webdriver').Key;

/****************************************************************************
** Locators
*****************************************************************************/
var DROPDOWN_INPUT = By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input");

function LeaguePage(driver) {
  BasePage.call(this, driver);
};

LeaguePage.prototype = Object.create(BasePage.prototype);
LeaguePage.prototype.constructor = LeaguePage;

/****************************************************************************
** Shared
*****************************************************************************/
LeaguePage.prototype.changeSeason = function(report) {
  // this.changeDropdown(REPORT_SELECT[this.section], DROPDOWN_INPUT, report);
  // return this.waitForEnabled(REPORT_SELECT[this.section], 30000);
};

LeaguePage.prototype.waitForTableToLoad = function() {
  // this.waitUntilStaleness(DATA_TABLE[this.section], 1000);
  // return this.waitForEnabled(DATA_TABLE[this.section], 10000);
};

/****************************************************************************
** Stats
*****************************************************************************/
LeaguePage.prototype.clickPerformanceStatsTableHeaderFor = function(colName) {
  // var locator = By.xpath(`.//div[@id='tableFootballTeamGamePerformanceContainer']/table/thead/tr/th[text()="${colName}"]`);
  return this.click(locator);
};

LeaguePage.prototype.getPerformanceStatsTableStatsFor = function(colName) {
  // var locator = By.xpath(`.//div[@id='tableFootballTeamGamePerformanceContainer']/table/tbody/tr[@data-tmn-row-type='row']/td[count(//div[@id='tableFootballTeamGamePerformanceContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getTextArray(locator);
};

LeaguePage.prototype.getPerformanceStatsTableStatFor = function(rowNum, colName) {
  // var locator = By.xpath(`.//div[@id='tableFootballTeamGamePerformanceContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[count(//div[@id='tableFootballTeamGamePerformanceContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getText(locator);
};

module.exports = LeaguePage;