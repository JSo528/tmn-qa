'use strict';

// Load Base Page
var BasePage = require('../../pages/base/base_page.js')

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;

/****************************************************************************
** Locators
*****************************************************************************/
var SCOUTING_REPORTS_TABLE = By.css('.reports table');
var SCOUTING_REPORTS_COUNT = By.xpath(".//div[@class='reports']/.//table/tbody[@inject='rows']/tr");
// var YEAR_SELECT = By.id('s2id_pageControlFootballYear');
// var WEEK_SELECT = By.id('s2id_pageControlFootballRegWeek');
// var VIEW_SELECT = By.id('s2id_pageControlFootballStandingsGroup');
// var DROPDOWN_INPUT = By.xpath(".//div[@id='select2-drop']/div/input");
// var TABLES = By.css('table');

/****************************************************************************
** Constructor
*****************************************************************************/
function ScoutPage(driver) {
  BasePage.call(this, driver)
};

ScoutPage.prototype = Object.create(BasePage.prototype);
ScoutPage.prototype.constructor = ScoutPage;

/****************************************************************************
** Functions
*****************************************************************************/
ScoutPage.prototype.getVisibleReportsCount = function() {
  return this.getElementCount(SCOUTING_REPORTS_COUNT);
};

ScoutPage.prototype.getTableStat = function(row, col) {
  var d = Promise.defer();
  var thiz = this;
  var inputLocator = By.xpath(`.//div[@class='reports']/.//table/tbody[@inject='rows']/tr[${row}]/td[${col}]/div/input`);
  var locator = By.xpath(`.//div[@class='reports']/.//table/tbody[@inject='rows']/tr[${row}]/td[${col}]/div/*[self::div or self::a or self::input]`);
  
  this.driver.wait(Until.elementLocated(inputLocator),100).then(function() {
    d.fulfill(thiz.driver.findElement(inputLocator).getAttribute('value'));
  }, function(err) {
    d.fulfill(thiz.getText(locator));
  })

  return d.promise;
};

ScoutPage.prototype.clickTableHeader = function(col) {
  var locator = By.xpath(`.//div[@class='reports']/.//table/thead/tr/th[${col}]`);
  return this.click(locator);
  // return this.waitUntilStaleness(SCOUTING_REPORTS_TABLE)
};

ScoutPage.prototype.clickSortIcon = function(col) {
  var locator = By.xpath(`.//div[@class='reports']/.//table/thead/tr/th[${col}]/i[contains(@class, 'material-icons')]`);
  return this.click(locator);
};

ScoutPage.prototype.clickRemoveSortIcon = function(col) {
  var locator = By.xpath(`.//div[@class='reports']/.//table/thead/tr/th[${col}]/i[contains(@class, '-cancel')]`);
  return this.click(locator);
};

ScoutPage.prototype.toggleDropdownFilter = function(filterName, optionName, selected) {
  var locator = By.xpath(`.//div[@class='filter'][div[contains(text(),'${filterName}')]]`);
  this.click(locator);
  var optionLocator = By.xpath(`.//div[@class='filter'][div[contains(text(),'${filterName}')]]/.//li[text()='${optionName}']`)
  return this.click(optionLocator);
};

ScoutPage.prototype.clickTableStat = function(row, col) {
  var locator = By.xpath(`.//div[@class='reports']/.//table/tbody[@inject='rows']/tr[${row}]/td[${col}]/div/a`);
  return this.click(locator);
};

ScoutPage.prototype.clickTableRow = function(row) {
  var locator = By.xpath(`.//div[@class='reports']/.//table/tbody[@inject='rows']/tr[${row}]/td[2]`);
  return this.click(locator);
};

// StandingsPage.prototype.changeYear = function(year) {
//   return this.changeDropdown(YEAR_SELECT, DROPDOWN_INPUT, year);
// };

// StandingsPage.prototype.changeWeek = function(year) {
//   return this.changeDropdown(WEEK_SELECT, DROPDOWN_INPUT, year);
// };

// StandingsPage.prototype.changeView = function(year) {
//   return this.changeDropdown(VIEW_SELECT, DROPDOWN_INPUT, year);
// };

// StandingsPage.prototype.getTableStat = function(tableRow, tableCol, teamRank, statCol) {
//   var tableRow = 1 + tableRow;
//   var teamRow = 1 + teamRank; 

//   var locator = By.xpath(`.//div[${tableRow}]/div[${tableCol}]/div/div/div/table/tbody/tr[${teamRow}]/td[${statCol}]`);
//   return this.getText(locator);
// };

// StandingsPage.prototype.getSeasonLevel = function() {
//   return this.getText(SEASON_LEVEL_SELECT);
// };

// StandingsPage.prototype.goToTeamPage = function(tableRow, tableCol, teamRank) {
//   var tableRow = 1 + tableRow;
//   var teamRow = 1 + teamRank;
  
//   var locator = By.xpath(`.//div[${tableRow}]/div[${tableCol}]/div/div/div/table/tbody/tr[${teamRow}]/td[1]/a`);
//   return this.click(locator);
// };

module.exports = ScoutPage;