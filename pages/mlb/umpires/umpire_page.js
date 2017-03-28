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
var videoPlaylist = require('../mixins/videoPlaylist.js');
var hitChartFunctions = require('../mixins/hitChartFunctions.js');

/****************************************************************************
** Locators
*****************************************************************************/
var SUB_SECTION_TITLE = {
  'overview': 'Overview',
  'gameLog': 'Game Log',
  'pitchLog': 'Pitch Log'
}

var REPORT_SELECT = By.id('s2id_reportNavBaseballUmpireStatUmpires');
var DROPDOWN_INPUT = By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input");
var UMPIRE_NAME = By.css('h1.name');

// OVERVIEW PAGE
var OVERVIEW_TABLE_ID = 'tableBaseballUmpireStatsOverviewContainer';
var LEFTY_HEATMAP_ID = 'umpireHeatMapLefty';
var LEFTY_HEAT_MAP_LINK = By.id('visualBaseballHeatMapUmpireLefty');
var LEFTY_PITCH_VIEW_LINK = By.id('visualBaseballPitchChartUmpireLefty');
var LEFTY_PITCH_VIEW_ID = 'umpirePitchChartLefty';

var RIGHTY_HEATMAP_ID = 'umpireHeatMapRighty';
var RIGHTY_HEAT_MAP_LINK = By.id('visualBaseballHeatMapUmpireRighty');
var RIGHTY_PITCH_VIEW_LINK = By.id('visualBaseballPitchChartUmpireRighty');
var RIGHTY_PITCH_VIEW_ID = 'umpirePitchChartRighty';

// VISUAL MODE
var VISUAL_MODE_SELECT = By.id('s2id_pageControlBaseballVisMode');
var VISUAL_MODE_UL_ID = 'select2-results-1';


/****************************************************************************
** Constructor
*****************************************************************************/
function UmpirePage(driver, subSection) {
  BasePage.call(this, driver);
  this.subSection = subSection || 'overview';
};

UmpirePage.prototype = Object.create(BasePage.prototype);
UmpirePage.prototype.constructor = UmpirePage;  

// Mixins
_.extend(UmpirePage.prototype, videoPlaylist); // Matchups
_.extend(UmpirePage.prototype, hitChartFunctions());

UmpirePage.prototype.DEFAULT_PITCH_VISUALS_MODAL_ID = 'tableBaseballUmpirePitchLogModalModal';

/****************************************************************************
** Controls
*****************************************************************************/
UmpirePage.prototype.getUmpireName = function() {
  return this.getText(UMPIRE_NAME, 30000);
};

UmpirePage.prototype.changeReport = function(report) {
  this.changeDropdown(REPORT_SELECT, DROPDOWN_INPUT, report);
  return this.waitForEnabled(REPORT_SELECT, 30000);
};

UmpirePage.prototype.goToSubSection = function(subSection) {
  this.subSection = subSection
  var locator = By.xpath(`.//nav[contains(@class, 'report-nav')]/.//a[text()='${SUB_SECTION_TITLE[subSection]}']`);
  return this.click(locator);
};

UmpirePage.prototype.waitForTableToLoad = function() {
  this.waitUntilStaleness(this.statsTable(), 10000);
  return this.waitForEnabled(this.statsTable(), 10000);
};

/****************************************************************************
** Overview
*****************************************************************************/
UmpirePage.prototype.drawBoxOnOverviewHeatMap = function(leftyOrRighty, x, y, width, height) {
  var heatmapID = (leftyOrRighty == 'lefty') ? LEFTY_HEATMAP_ID : RIGHTY_HEATMAP_ID;
  return this.drawBoxOnHeatMap(x,y,width,height, heatmapID);
};

UmpirePage.prototype.clearOverviewHeatMap = function(leftyOrRighty) {
  var heatMapID = (leftyOrRighty == 'lefty') ? LEFTY_HEATMAP_ID : RIGHTY_HEATMAP_ID;
  return this.clearHeatMap(heatMapID, OVERVIEW_TABLE_ID);
};

UmpirePage.prototype.clickOverviewHeatMapLink = function(leftyOrRighty) {
  var locator = (leftyOrRighty == 'lefty') ? LEFTY_HEAT_MAP_LINK : RIGHTY_HEAT_MAP_LINK;
  return this.click(locator);
};

UmpirePage.prototype.clickOverviewPitchViewLink = function(leftyOrRighty) {
  var locator = (leftyOrRighty == 'lefty') ? LEFTY_PITCH_VIEW_LINK : RIGHTY_PITCH_VIEW_LINK;
  return this.click(locator);
};

UmpirePage.prototype.getOverviewPitchViewPitchCount = function(leftyOrRighty) {
  var pitchViewID = (leftyOrRighty == 'lefty') ? LEFTY_PITCH_VIEW_ID : RIGHTY_PITCH_VIEW_ID;
  return this.getPitchViewPitchCount(pitchViewID);
};

UmpirePage.prototype.getOverviewHeatMapImageTitle = function(leftyOrRighty) {
  var heatMapID = (leftyOrRighty == 'lefty') ? LEFTY_HEATMAP_ID : RIGHTY_HEATMAP_ID;
  return this.getHeatMapImageTitle(heatMapID)
};

UmpirePage.prototype.changeVisualMode = function(mode) {
  return this.clickDropdown(VISUAL_MODE_SELECT, VISUAL_MODE_UL_ID, mode);
};

UmpirePage.prototype.getOverviewTableStat = function(row, col) {
  // First 3 rows are for the headers
  var rowNum = row + 3;
  var locator = By.xpath(`.//div[@id='tableBaseballUmpireStatsOverviewContainer']/table/tbody/tr[${rowNum}]/td[${col}]`);
  return this.getText(locator, 30000);  
};

UmpirePage.prototype.clickOverviewTableStat = function(row, col) {
  // First 3 rows are for the headers
  var rowNum = row + 3;
  var locator = By.xpath(`.//div[@id='tableBaseballUmpireStatsOverviewContainer']/table/tbody/tr[${rowNum}]/td[${col}]/span`);
  return this.click(locator);  
};

/****************************************************************************
** Game Logs
*****************************************************************************/
UmpirePage.prototype.getGameLogTableStat = function(row, col) {
  var rowNum = row + 5;
  var locator = By.xpath(`.//div[@id='tableBaseballUmpireGameLogContainer']/table/tbody/tr[${rowNum}]/td[${col}]`);
  return this.getText(locator, 30000);  
};

UmpirePage.prototype.clickGameLogTableStat = function(row, col) {
  var rowNum = row + 5;
  var locator = By.xpath(`.//div[@id='tableBaseballUmpireGameLogContainer']/table/tbody/tr[${rowNum}]/td[${col}]/span`);
  return this.click(locator);  
};

UmpirePage.prototype.clickGameLogTableColumnHeader = function(col) {
  var locator = By.xpath(`.//div[@id='tableBaseballUmpireGameLogContainer']/table/thead/tr/th[${col}]`);
  return this.click(locator); 
};

UmpirePage.prototype.getGameLogTableStatsForCol = function(col) {
  var locator = By.xpath(`.//div[@id='tableBaseballUmpireGameLogContainer']/table/tbody/tr[@data-tmn-row-type="row"]/td[${col}]`);
  return this.getTextArray(locator);
};

/****************************************************************************
** Data Comparison
*****************************************************************************/
UmpirePage.prototype.statsTable = function() {
  switch(this.subSection) {
    case 'overview':
      return By.xpath(".//div[@id='tableBaseballUmpireStatsOverviewContainer']/table"); 
      break;
    case 'gameLog':
      return By.xpath(".//div[@id='tableBaseballUmpireGameLogContainer']/table");
      break;
    case 'pitchLog':
      return By.xpath(".//div[@id='tableBaseballUmpirePitchLogContainer']/table"); 
      break;    
  };
};

module.exports = UmpirePage;