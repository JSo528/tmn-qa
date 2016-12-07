'use strict';

// Load Base Page
var BasePage = require('../../../pages/base/base_page.js');

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;

// Mixins
var _ = require('underscore');
var videoPlaylist = require('../mixins/videoPlaylist.js');
var chartColumns = require('../mixins/chartColumns.js');

/****************************************************************************
** Locators
*****************************************************************************/
var PAGE_TITLE = By.css('h2.report-title');
var GROUP_BY_SELECT = By.id("s2id_pageControlBaseballUmpiresGroupBy");
var DROPDOWN_INPUT = By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input");

var QUALIFY_BY_SELECT = By.id("s2id_pageControlBaseballQualifyByUmpires");
var QUALIFY_BY_STAT_SELECT = By.id("s2id_pageControlBaseballQualifyByUmpiresStats");
var QUALIFY_BY_INPUT = By.id("pageControlBaseballQualifyByUmpiresInput");
var QUALIFY_BY_SUBMIT = By.css(".pc-qualify-by > button");
var STATS_VIEW_SELECT = By.id("s2id_pageControlBaseballStatsViewPlayers");
var REPORT_SELECT = By.id("s2id_reportNavBaseballUmpiresStatUmpires");

var STATS_TABLE = By.xpath(".//div[@id='tableBaseballUmpiresStatsContainer']/table");

/****************************************************************************
** Constructor
*****************************************************************************/
function UmpiresPage(driver) {
  BasePage.call(this, driver);
}

UmpiresPage.prototype = Object.create(BasePage.prototype);
UmpiresPage.prototype.constructor = UmpiresPage;

_.extend(UmpiresPage.prototype, videoPlaylist);
_.extend(UmpiresPage.prototype, chartColumns);

UmpiresPage.prototype.DEFAULT_CHART_COLUMNS_DATA_TABLE_ID = 'tableBaseballUmpiresStatsContainer';
UmpiresPage.prototype.DEFAULT_CHART_COLUMNS_ISO_TABLE_ID = 'tableBaseballUmpiresStatsISOContainer';

/****************************************************************************
** Stats
*****************************************************************************/
UmpiresPage.prototype.getPageTitle = function() {
  return this.getText(PAGE_TITLE);
};

UmpiresPage.prototype.getTableHeader = function(col) {
  var locator = By.xpath(`.//div[@id='tableBaseballUmpiresStatsContainer']/table/thead/tr/th[${col}]`);
  return this.getText(locator, 30000);
};

UmpiresPage.prototype.getTableStat = function(umpireNum, col) {
  // First 3 rows are for the headers
  var row = 3 + umpireNum;
  var locator = By.xpath(`.//div[@id='tableBaseballUmpiresStatsContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator, 30000);
};

UmpiresPage.prototype.getTableBgColor = function(umpireNum, col) {
  // First 3 rows are for the headers
  var row = 3 + umpireNum;
  var locator = By.xpath(`.//div[@id='tableBaseballUmpiresStatsContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getCssValue(locator, "background-color");
};

UmpiresPage.prototype.clickTableColumnHeader = function(col) {
  var locator = By.xpath(`.//div[@id='tableBaseballUmpiresStatsContainer']/table/thead/tr/th[${col}]`);
  return this.click(locator); 
};

UmpiresPage.prototype.goToUmpirePage = function(umpireNum) {
  var row = 3 + umpireNum;
  var locator = By.xpath(`.//div[@id='tableBaseballUmpiresStatsContainer']/table/tbody/tr[${row}]/td[3]/a`);
  return this.click(locator); 
};

UmpiresPage.prototype.clickTableStat = function(umpireNum, col) {
  var row = 3 + umpireNum;
  var locator = By.xpath(`.//div[@id='tableBaseballUmpiresStatsContainer']/table/tbody/tr[${row}]/td[${col}]/span`);
  return this.click(locator); 
};

UmpiresPage.prototype.changeGroupBy = function(groupBy) {
  return this.changeDropdown(GROUP_BY_SELECT, DROPDOWN_INPUT, groupBy);
};

UmpiresPage.prototype.changeQualifyBy = function(filter, stat, input) {
  if(filter == "Custom") {
    this.changeDropdown(QUALIFY_BY_SELECT, DROPDOWN_INPUT, filter);
    this.changeDropdown(QUALIFY_BY_STAT_SELECT, DROPDOWN_INPUT, stat);
    this.sendKeys(QUALIFY_BY_INPUT, input);
    return this.click(QUALIFY_BY_SUBMIT);
  } else {
    return this.changeDropdown(QUALIFY_BY_SELECT, DROPDOWN_INPUT, filter);  
  }
};

UmpiresPage.prototype.changeStatsView = function(view) {
  return this.changeDropdown(STATS_VIEW_SELECT, DROPDOWN_INPUT, view);
};

UmpiresPage.prototype.changeReport = function(report) {
  return this.changeDropdown(REPORT_SELECT, DROPDOWN_INPUT, report);
};

UmpiresPage.prototype.statsTable = STATS_TABLE;

// Mixins
_.extend(UmpiresPage.prototype, videoPlaylist);

module.exports = UmpiresPage;