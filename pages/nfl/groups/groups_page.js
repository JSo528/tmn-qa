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

function GroupsPage(driver, section) {
  BasePage.call(this, driver);
};

GroupsPage.prototype = Object.create(BasePage.prototype);
GroupsPage.prototype.constructor = GroupsPage;

/****************************************************************************
** Shared
*****************************************************************************/
GroupsPage.prototype.getTableStats = function(colNum) {
  var locator = By.xpath(`.//div[@id='tableFootballConfStatsContainer']/table/tbody/tr[@data-tmn-row-type='row']/td[${colNum}]`);
  return this.getTextArray(locator); 
};

GroupsPage.prototype.getTableStat = function(rowNum, colNum) {
  var locator = By.xpath(`.//div[@id='tableFootballConfStatsContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[${colNum}]`);
  return this.getText(locator); 
};

GroupsPage.prototype.clickTableColumnHeader = function(colNum) {
  var locator = By.xpath(`.//div[@id='tableFootballConfStatsContainer']/table/thead/tr/th[${colNum}]`);
  return this.click(locator); 
};

module.exports = GroupsPage;