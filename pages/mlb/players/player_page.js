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
var occurrencesAndStreaks = require('../mixins/occurrencesAndStreaks.js');
var hitChartFunctions = require('../mixins/hitChartFunctions.js');

/****************************************************************************
** Locators
*****************************************************************************/
var REPORT_SELECT = {
  'batting': By.id('s2id_reportNavBaseballPlayerStatBatting'),
  'pitching': By.id('s2id_reportNavBaseballPlayerStatPitching'),
  'catching': By.id('s2id_reportNavBaseballPlayerStatCatching'),
  'statcastFielding': By.id('s2id_reportNavBaseballPlayerStatStatcast')
};

var SECTION_TITLE = {
  'batting': 'Batting',
  'pitching': 'Pitching',
  'catching': 'Catching',
  'statcastFielding': 'Statcast Fielding'
};

var SUB_SECTION_TITLE = {
  'overview': 'Overview',
  'gameLog': 'Game Log',
  'splits': 'Splits',
  'pitchLog': 'Pitch Log',
  'occurrencesAndStreaks': 'Occurrences & Streaks',
  'multiFilter': 'Multi-Filter',
  'comps': 'Comps',
  'matchups': 'Matchups',
  'vsTeams': 'Vs Teams',
  'vsPitchers': 'Vs Pitchers',
  'vsHitters': 'Vs Hitters',
  'defensivePositioning': 'Defensive Positioning',
};

var SUB_SECTION_LAST_LOCATOR = {
  'defensivePositioning': By.xpath(".//div[@id='tableBaseballPlayerStatsOverviewStatcastBatterPositioningContainer']/table")
};

var PLAYER_NAME = By.css('h1.name');

// Overview
var OVERVIEW_HEAT_MAP_ID = 'playerHeatMap';
var OVERVIEW_PITCH_CHART_ID = {
  'batting': 'teamPitchChart',
  'pitching': 'playerPitchChart',
};
var HEAT_MAP_LINK = By.id('visualBaseballHeatMapPlayer');
var PITCH_VIEW_LINK = {
  'batting': By.id('visualBaseballPitchChartPlayer'),
  'pitching': By.id('visualBaseballPitchChartPlayerPitcher')
};

var OVERVIEW_TABLE_ID = {
  'batting': 'tableBaseballPlayerStatsOverviewContainer',
  'pitching': 'tableBaseballPlayerStatsOverviewContainer',
  'catching': 'tableBaseballPlayerStatsOverviewCatchingContainer',
  'statcastFielding': 'tableBaseballPlayerStatsOverviewStatcastContainer'
};

var LEFTY_HEATMAP_ID = 'playerHeatMapCatcherLefty';
var LEFTY_HEAT_MAP_LINK = By.id('visualBaseballHeatMapPlayerCatcherLefty');
var LEFTY_PITCH_VIEW_LINK = By.id('visualBaseballPitchViewPlayerCatcherLefty');
var LEFTY_PITCH_VIEW_ID = 'playerPitchChartLefty';

var RIGHTY_HEATMAP_ID = 'playerHeatMapCatcherRighty';
var RIGHTY_HEAT_MAP_LINK = By.id('visualBaseballHeatMapPlayerCatcherRighty');
var RIGHTY_PITCH_VIEW_LINK = By.id('visualBaseballPitchChartPlayerCatcherRighty');
var RIGHTY_PITCH_VIEW_ID = 'playerPitchChartRighty';

// eBIS MODAL
var EBIS_MODAL_BUTTON = By.id('ebisModalButton');
var CLOSE_EBIS_MODAL_BUTTON = By.css('#ebisModal .modal-footer button');

// PLAYER GRID
var PLAYER_GRID = By.css('#playerGrid > svg');
var PLAYER_GRID_PITCH = By.css('#playerGrid circle.heat-map-ball');
var GRID_MODE_SELECT = By.id('s2id_pageControlBaseballGridMode');
var GRID_IMAGE = By.css('#playerGrid #heatmapBg');

// VISUAL MODE
var VISUAL_MODE_SELECT = By.id('s2id_pageControlBaseballVisMode');
var DROPDOWN_INPUT = By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input");

// PITCH LOGS
var BY_INNING_TABLE_ID = {
  'batting': 'tableBaseballPlayerPitchLogBattingContainer',
  'pitching': 'tableBaseballPlayerPitchLogPitchingContainer',
  'catching': 'tableBaseballPlayerPitchLogCatchingContainer',
  'statcastFielding': 'tableBaseballPlayerPitchLogStatcastContainer'
};

var FLAT_VIEW_TABLE_ID = {
  'batting': 'tableBaseballPlayerPitchTableBattingContainer',
  'pitching': 'tableBaseballPlayerPitchTablePitchingContainer',
  'catching': 'tableBaseballPlayerPitchTableCatchingContainer',
  'statcastFielding': 'tableBaseballPlayerPitchTableStatcastContainer'
};

// OCCURENCES & STREAKS
var STREAK_GROUPING_SELECT = By.id('s2id_pageControlBaseballStrkGroupingPlayer');
var CONSTRAINT_STAT_SELECT = {
  'batting': By.id('s2id_pageControlBaseballStrkConstraintStatPlayer'),
  'pitching': By.id('s2id_pageControlBaseballStrkConstraintStatPlayerPitching'),
  'catching': By.id('s2id_pageControlBaseballStrkConstraintStatPlayerCatching'),
  'statcastFielding': By.id('s2id_pageControlBaseballStrkConstraintStatPlayerStatcast')
};

// Multi-Filter
var TOP_HEATMAP_ID = 'playerHeatMapMultiFilter1';
var BOTTOM_HEATMAP_ID = 'playerHeatMapMultiFilter2';
var TOP_HIT_CHART_ID = 'hitChartMultiFilter1';
var BOTTOM_HIT_CHART_ID = 'hitChartMultiFilter2';

var VISUAL_MODE_TOP_SELECT = By.id('s2id_pageControlBaseballVisMode');
var VISUAL_MODE_BOTTOM_SELECT = By.id('s2id_pageControlBaseballVisMode2');

// COMPS
var COMP_SEARCH_1_INPUT = By.css('#compSearch1 input');
var COMP_SEARCH_2_INPUT = By.css('#compSearch2 input');

// MATCHUPS
var MATCHUPS_AT_BAT_TABLE_ID = {
  'batting': 'tableBaseballPlayerPitchLogBattingVidMatchupContainer',
  'pitching': 'tableBaseballPlayerPitchLogPitchingVidMatchupContainer'
};

var MATCHUPS_VIDEO_TEXT_TABLE_ID = {
  'batting': 'videoInlinetableBaseballPlayerPitchLogBattingVidMatchupModal',
  'pitching': 'videoInlinetableBaseballPlayerPitchLogPitchingVidMatchupModal'
};

// VS TEAMS/PLAYERS
var VS_TABLE = By.xpath('.//div[@id="tableBaseballPlayerStatsContainer"]/table');

// STATCAST FIELDING
var BALLPARK_IMAGE = By.css('.field-container svg g:nth-of-type(1)');
var BALLPARK_SELECT = By.css('tmn-ballpark-selector select');
var STATCAST_FIELDING_CHART_EVENT = By.css('statcast-fielding-chart .bin-events path');
var STATCSAT_FIELDING_MODAL_CLOSE_BTN = By.css('#tableBaseballPlayerTeamPitchLogBattingModalStandaloneWithVideoId button');
var STATCAST_FIELDING_MODAL_TITLE = By.css('#tableBaseballPlayerTeamPitchLogBattingModalStandaloneWithVideoId h4.modal-title');

/****************************************************************************
** Constructor
*****************************************************************************/
function PlayerPage(driver, section, subSection) {
  BasePage.call(this, driver);
  this.section = section || 'batting';
  this.subSection = subSection || 'overview';
};

PlayerPage.prototype = Object.create(BasePage.prototype);
PlayerPage.prototype.constructor = PlayerPage;

// Mixins
_.extend(PlayerPage.prototype, videoPlaylist); // Matchups
_.extend(PlayerPage.prototype, occurrencesAndStreaks);
_.extend(PlayerPage.prototype, hitChartFunctions());


PlayerPage.prototype.goToSection = function(section) {
  this.section = section;
  var sectionLink = By.xpath(`.//nav[contains(@class, 'navbar-blue')]/.//li/a[text()='${SECTION_TITLE[section]}']`);
  this.click(sectionLink);
  return this.waitForEnabled(REPORT_SELECT[this.section], 30000);
};

PlayerPage.prototype.goToSubSection = function(subSection) {
  this.subSection = subSection
  var locator = By.xpath(`.//nav[contains(@class, 'report-nav')]/.//a[text()='${SUB_SECTION_TITLE[subSection]}']`);
  if (SUB_SECTION_LAST_LOCATOR[subSection]) {
    this.click(locator);
    this.waitForEnabled(SUB_SECTION_LAST_LOCATOR[subSection])
  } else {
    return this.click(locator);
  }
};

PlayerPage.prototype.getPlayerName = function() {
  return this.getText(PLAYER_NAME, 30000);
};

PlayerPage.prototype.changeReport = function(report) {
  this.changeDropdown(REPORT_SELECT[this.section], DROPDOWN_INPUT, report);
  return this.waitForEnabled(REPORT_SELECT[this.section], 30000);
};


/****************************************************************************
** Overview
*****************************************************************************/
PlayerPage.prototype.drawBoxOnOverviewHeatMap = function(x,y,width,height) {
  return this.drawBoxOnHeatMap(x,y,width,height, OVERVIEW_HEAT_MAP_ID);
};

PlayerPage.prototype.clearOverviewHeatMap = function(x,y,width,height) {
  return this.clearHeatMap(OVERVIEW_HEAT_MAP_ID);
};

PlayerPage.prototype.getOverviewHeatMapPitchCount = function() {
  return this.getHeatMapPitchCount(OVERVIEW_HEAT_MAP_ID);
};

PlayerPage.prototype.getOverviewHeatMapImageTitle = function() {
  return this.getHeatMapImageTitle(OVERVIEW_HEAT_MAP_ID);
};

PlayerPage.prototype.getOverviewPitchViewPitchCount = function() {
  return this.getPitchViewPitchCount(OVERVIEW_PITCH_CHART_ID[this.section]);
};

PlayerPage.prototype.clickHeatMapLink = function() {
  return this.click(HEAT_MAP_LINK);
};

PlayerPage.prototype.clickPitchViewLink = function() {
  return this.click(PITCH_VIEW_LINK[this.section]);
};

PlayerPage.prototype.getPlayerGridPitchCount = function() {
  var d = Promise.defer();

  this.getElementCount(PLAYER_GRID_PITCH).then(function(count) {
    d.fulfill(count/2); // 2 circles per pitch
  });

  return d.promise;
};

PlayerPage.prototype.changeVisualMode = function(mode) {
  return this.clickDropdown(VISUAL_MODE_SELECT, 'select2-results-1', mode);
};

PlayerPage.prototype.getGridHrefMode = function() {
  var d = Promise.defer();

  this.getAttribute(GRID_IMAGE, 'href').then(function(href) {
    d.fulfill(href.match(/&mode=.+&/)[0].replace(/(&mode=|&)/g,''));
  });

  return d.promise;
};

PlayerPage.prototype.changeGridMode = function(mode) {
  return this.clickDropdown(GRID_MODE_SELECT, 'select2-results-2', mode);
};

// eBIS Modal
PlayerPage.prototype.clickEbisModalBtn = function() {
  var element = this.driver.findElement(EBIS_MODAL_BUTTON);
  return element.click();
};

PlayerPage.prototype.clickCloseEbisModalBtn = function() {
  var element = this.driver.findElement(CLOSE_EBIS_MODAL_BUTTON);
  return element.click();
};

PlayerPage.prototype.getEbisModalText = function(sectionNum, divNum) {
  var locator = By.xpath(`.//div[@id='ebisModal']/.//div[@class='row ebisRow'][${sectionNum}]/div[${divNum}]`);
  return this.getText(locator, 30000);  
};

PlayerPage.prototype.getOverviewTableStat = function(row, col) {
  // First 3 rows are for the headers
  var rowNum = row + 3;
  var locator = By.xpath(`.//div[@id='${OVERVIEW_TABLE_ID[this.section]}']/table/tbody/tr[${rowNum}]/td[${col}]`);
  return this.getText(locator, 30000);  
};

PlayerPage.prototype.clickOverviewTableStat = function(row, col) {
  // First 3 rows are for the headers
  var rowNum = row + 3;
  var locator = By.xpath(`.//div[@id='${OVERVIEW_TABLE_ID[this.section]}']/table/tbody/tr[${rowNum}]/td[${col}]/span`);
  return this.click(locator);  
};

/****************************************************************************
** Catcher Overview
*****************************************************************************/
PlayerPage.prototype.drawBoxOnCatcherHeatMap = function(leftyOrRighty, x, y, width, height) {
  var heatmapID = (leftyOrRighty == 'lefty') ? LEFTY_HEATMAP_ID : RIGHTY_HEATMAP_ID;
  return this.drawBoxOnHeatMap(x,y,width,height, heatmapID);
};

PlayerPage.prototype.clearCatcherHeatMap = function(leftyOrRighty) {
  var heatMapID = (leftyOrRighty == 'lefty') ? LEFTY_HEATMAP_ID : RIGHTY_HEATMAP_ID;
  return this.clearHeatMap(heatMapID);
};

PlayerPage.prototype.clickCatcherHeatMapLink = function(leftyOrRighty) {
  var locator = (leftyOrRighty == 'lefty') ? LEFTY_HEAT_MAP_LINK : RIGHTY_HEAT_MAP_LINK;
  return this.click(locator);
};

PlayerPage.prototype.clickCatcherPitchViewLink = function(leftyOrRighty) {
  var locator = (leftyOrRighty == 'lefty') ? LEFTY_PITCH_VIEW_LINK : RIGHTY_PITCH_VIEW_LINK;
  return this.click(locator);
};

PlayerPage.prototype.getCatcherPitchViewPitchCount = function(leftyOrRighty) {
  var pitchViewID = (leftyOrRighty == 'lefty') ? LEFTY_PITCH_VIEW_ID : RIGHTY_PITCH_VIEW_ID;
  return this.getPitchViewPitchCount(pitchViewID);
};

PlayerPage.prototype.getCatcherHeatMapImageTitle = function(leftyOrRighty) {
  var heatMapID = (leftyOrRighty == 'lefty') ? LEFTY_HEATMAP_ID : RIGHTY_HEATMAP_ID;
  return this.getHeatMapImageTitle(heatMapID)
};

/****************************************************************************
** Game Logs
*****************************************************************************/
PlayerPage.prototype.getGameLogTableStat = function(row, col) {
  var rowNum = row + 5;
  var locator = By.xpath(`.//div[@id='tableBaseballPlayerGameLogContainer']/table/tbody/tr[${rowNum}]/td[${col}]`);
  return this.getText(locator, 30000);  
};

PlayerPage.prototype.clickGameLogTableStat = function(row, col) {
  var rowNum = row + 5;
  var locator = By.xpath(`.//div[@id='tableBaseballPlayerGameLogContainer']/table/tbody/tr[${rowNum}]/td[${col}]/span`);
  return this.click(locator);  
};

/****************************************************************************
** Splits
*****************************************************************************/
PlayerPage.prototype.getSplitsTableStat = function(row, col) {
  var locator = By.xpath(`.//div[@id='tableBaseballPlayerSplitsContainer']/table[@class='table table-striped']/tbody/tr[not(contains(@class, 'sectionHeader'))][${row}]/td[${col}]`);
  return this.getText(locator, 30000);  
};

/****************************************************************************
** Occurences & Steaks
*****************************************************************************/
PlayerPage.prototype.constraintStatSelect = function() {
  return CONSTRAINT_STAT_SELECT[this.section];
};

PlayerPage.prototype.streakGroupingSelect = function() {
  return STREAK_GROUPING_SELECT;
};

PlayerPage.prototype.getStreaksTableStat = function(rowNum, col) {
  var row = rowNum + 1;
  var locator = By.xpath(`.//div[@id='tableBaseballPlayerStreaksContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator, 30000);
};

PlayerPage.prototype.getStreaksSectionHeaderText = function(headerNum) {
  var headerNum = headerNum || 1
  var locator = By.xpath(`.//div[@id='tableBaseballPlayerStreaksContainer']/table/tbody/tr[@class='sectionHeader'][${headerNum}]`);
  return this.getText(locator, 30000);
};

/****************************************************************************
** Multi-Filter
*****************************************************************************/
PlayerPage.prototype.getMultiFilterStat = function(rowNum, col) {
  var locator = By.xpath(`.//div[@id='tableBaseballMultiFilterContainer']/table/tbody/tr[${rowNum}]/td[${col}]`);
  return this.getText(locator, 30000);
};

PlayerPage.prototype.getMultiFilterHitChartHitCount = function(topOrBottom) {
  var hitChartID = (topOrBottom == 'top') ? TOP_HIT_CHART_ID : BOTTOM_HIT_CHART_ID;
  return this.getHitChartHitCount('all', hitChartID);
};

PlayerPage.prototype.changeMultiFilterVisualMode = function(topOrBottom, type) {
  var locator = (topOrBottom == 'top') ? VISUAL_MODE_TOP_SELECT : VISUAL_MODE_BOTTOM_SELECT;
  return this.changeDropdown(locator, DROPDOWN_INPUT, type);
};

PlayerPage.prototype.drawBoxOnMultiFilterHeatMap = function(topOrBottom, x, y, width, height) {
  var locator = (topOrBottom == 'top') ? TOP_HEATMAP_ID : BOTTOM_HEATMAP_ID;
  return this.drawBoxOnHeatMap(x,y,width,height,locator)
};

PlayerPage.prototype.getMultiFilterHeatMapImageTitle = function(topOrBottom) {
  var locator = (topOrBottom == 'top') ? TOP_HEATMAP_ID : BOTTOM_HEATMAP_ID;
  return this.getHeatMapImageTitle(locator);
};

/****************************************************************************
** Comps
*****************************************************************************/
PlayerPage.prototype.selectForCompSearch = function(compNum, name) {
  var locator = compNum == 1 ? COMP_SEARCH_1_INPUT : COMP_SEARCH_2_INPUT
  return this.selectFromSearch(locator, name, 1);
};

PlayerPage.prototype.getCompTableStat = function(rowNum, col) {
  var locator = By.xpath(`.//div[@id='tableBaseballCompContainer']/table/tbody/tr[${rowNum}]/td[${col}]`);
  return this.getText(locator, 10000);
};

/****************************************************************************
** Vs Teams/Pitchers
*****************************************************************************/
PlayerPage.prototype.getVsTableStat = function(rowNum, col) {
  var locator = By.xpath(`.//div[@id='tableBaseballPlayerStatsContainer']/table/tbody/tr[${rowNum}]/td[${col}]`);
  return this.getText(locator, 10000);
};

/****************************************************************************
** Statcast Fielding
*****************************************************************************/
PlayerPage.prototype.getStatcastFieldingModalTitle = function() {
  return this.getText(STATCAST_FIELDING_MODAL_TITLE, 30000);
};

PlayerPage.prototype.getStatcastFieldingModalTableHeader = function(col) {
  var locator = By.xpath(`.//div[@id='tableBaseballPlayerTeamPitchLogBattingModalStandaloneWithVideoContainer']/table/thead/tr/th[${col}]`);
  return this.getText(locator, 30000);
};

PlayerPage.prototype.clickStatcastFieldingChartEvent = function(eventNum) {
  var d = Promise.defer();
  driver.findElements(STATCAST_FIELDING_CHART_EVENT).then(function(elements) {
    d.fulfill(elements[eventNum].click());
  });

  return d.promise;
};

PlayerPage.prototype.closeStatcastFieldingModal = function() {
  var element = driver.findElement(STATCSAT_FIELDING_MODAL_CLOSE_BTN);
  return element.click();
};

PlayerPage.prototype.changeBallparkDropdown = function(ballpark) {
  this.click(BALLPARK_SELECT);
  var optionLocator = By.xpath(`.//tmn-ballpark-selector/select/option[text()="${ballpark}"]`);
  this.click(optionLocator);
  return this.waitUntilStaleness(BALLPARK_IMAGE, 20000);
};

PlayerPage.prototype.getCurrentBallparkImageID = function() {
  return this.getAttribute(BALLPARK_IMAGE, 'id');
};

PlayerPage.prototype.getDefensivePositioningTableStat = function(row, col) {
  var rowNum = row + 3;
  var locator = By.xpath(`.//div[@id='tableBaseballPlayerStatsOverviewStatcastBatterPositioningContainer']/table/tbody/tr[${rowNum}]/td[${col}]`);
  return this.getText(locator, 30000);  
};

PlayerPage.prototype.clickDefensivePositioningTableStat = function(row, col) {
  var rowNum = row + 3;
  var locator = By.xpath(`.//div[@id='tableBaseballPlayerStatsOverviewStatcastBatterPositioningContainer']/table/tbody/tr[${rowNum}]/td[${col}]/span`);
  return this.click(locator);  
};

// Data Comparison
PlayerPage.prototype.statsTable = function() {
  switch(this.subSection) {
    case 'overview':
      return By.xpath(`.//div[@id='${OVERVIEW_TABLE_ID[this.section]}']/table`); 
      break;
    case 'gameLog':
      return By.xpath(".//div[@id='tableBaseballPlayerGameLogContainer']/table");
      break;
    case 'splits':
      return By.xpath(".//div[@id='tableBaseballPlayerSplitsContainer']/table");
      break;
    case 'pitchLog':
      return By.xpath(`.//div[@id='${BY_INNING_TABLE_ID[this.section]}']/table/tbody/tr[position() <= 20]`); 
      break;    
    case 'matchups':
      return By.xpath(`.//div[@id='${MATCHUPS_AT_BAT_TABLE_ID[this.section]}']/table`);
      break;    
    case 'vsTeams':
    case 'vsPitchers':
    case 'vsHitters':
      return By.xpath(".//div[@id='tableBaseballPlayerStatsContainer']/table");
      break;        
    case 'defensivePositioning':  
      return By.xpath(".//div[@id='tableBaseballPlayerStatsOverviewStatcastBatterPositioningContainer']/table");
      break;        
  };
};

module.exports = PlayerPage;