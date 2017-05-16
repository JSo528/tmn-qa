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
var chartColumns = require('../../mixins/chartColumns.js')

/****************************************************************************
** Locators
*****************************************************************************/
var SECTION_NAMES = {
  'boxScore': 'Box Score',
  'performanceStats': 'Performance Stats',
  'report': 'Report',
  'teamSummary': 'Team Summary',
  'playByPlay': 'Play By Play',
  'drives': 'Drives'
};

var REPORT_SELECT = {
  'boxScore': By.id('tableFootballGameBoxScoreZebraContainer'),
  'performanceStats': By.id("s2id_reportNavFootballPlayerGamePerformanceSubCommon")
}


var DATA_TABLE = {
  'boxScore': By.css('#tableFootballGameBoxScoreZebraContainer > table'),
  'performanceStats': By.css("#tableFootballTeamGamePerformanceContainer > table"),
  'teamSummary': By.css("#tableFootballGameDrivesContainer > table"),
  'playByPlay': By.css("#tableFootballGamePlayByPlayContainer > table"),
  'drives': By.css("#tableFootballGameDrivesContainer > table"),
}

var DROPDOWN_INPUT = By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input");

function GamePage(driver, section) {
  BasePage.call(this, driver);
  this.section = 'boxScore';
};

GamePage.prototype = Object.create(BasePage.prototype);
GamePage.prototype.constructor = GamePage;

// Mixins
_.extend(GamePage.prototype, videoPlaylist);
_.extend(GamePage.prototype, chartColumns);

GamePage.prototype.DEFAULT_BY_POSSESSION_ID = {
  'boxScore': 'tableFootballPlayerPlayByPlayGameModalContainer'
}

GamePage.prototype.DEFAULT_FLAT_VIEW_ID = {
  'boxScore': 'tableFootballPlayerPlayByPlayGameModalTableContainer'
}

GamePage.prototype.DEFAULT_CHART_COLUMNS_DATA_TABLE_ID = {
  'performanceStats': 'tableFootballTeamGamePerformanceContainer'
};
GamePage.prototype.DEFAULT_CHART_COLUMNS_ISO_TABLE_ID = {
  'performanceStats': 'tableFootballTeamGamePerformanceISOContainer'
};

/****************************************************************************
** Shared
*****************************************************************************/
GamePage.prototype.goToSection = function(section) {
  this.section = section;
  var locator = By.xpath(`.//div[@class='navbar-header']/ul/li/a[text()='${SECTION_NAMES[this.section]}']`);
  return this.click(locator);
};

GamePage.prototype.changeReport = function(report) {
  this.changeDropdown(REPORT_SELECT[this.section], DROPDOWN_INPUT, report);
  return this.waitForEnabled(REPORT_SELECT[this.section], 30000);
};

GamePage.prototype.waitForTableToLoad = function() {
  this.waitUntilStaleness(DATA_TABLE[this.section], 1000);
  return this.waitForEnabled(DATA_TABLE[this.section], 10000);
};

/****************************************************************************
** Box Score
*****************************************************************************/
GamePage.prototype.getBoxScorePageTitle = function() {
  var locator = By.xpath(`//div[contains(@class, 'player-summary')]/div[1]/div/h3`);
  return this.getText(locator);
};

GamePage.prototype.getBoxScoreTableStat = function(rowNum, colNum) {
  var locator = By.xpath(`.//div[@id='tableFootballGameBoxScoreZebraContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[${colNum}]`);
  return this.getText(locator);
};

GamePage.prototype.clickBoxScoreTableStat = function(rowNum, colNum) {
  var locator = By.xpath(`.//div[@id='tableFootballGameBoxScoreZebraContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[${colNum}]/span`);
  return this.click(locator);
};

GamePage.prototype.getBoxScoreSummaryText = function(rowNum, colNum) {
  var locator = By.xpath(`.//div[@id='tableFootballGameScoringSummaryContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[${colNum}]`);
  return this.getText(locator);
};

GamePage.prototype.clickBoxScoreSummaryPlayVideoIcon = function(rowNum, colNum) {
  var locator = By.xpath(`.//div[@id='tableFootballGameScoringSummaryContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td/tmn-video-icon`);
  return this.click(locator);
};

GamePage.prototype.clickBoxScoreExportLink = function() {
  var locator = By.id("tableFootballGameScoringSummaryTableExport");
  this.click(locator);
  return this.driver.sleep(1000);
};

/****************************************************************************
** Performance Stats
*****************************************************************************/
GamePage.prototype.clickPerformanceStatsTableHeaderFor = function(colName) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamGamePerformanceContainer']/table/thead/tr/th[text()="${colName}"]`);
  return this.click(locator);
};

GamePage.prototype.getPerformanceStatsTableStatsFor = function(colName) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamGamePerformanceContainer']/table/tbody/tr[@data-tmn-row-type='row']/td[count(//div[@id='tableFootballTeamGamePerformanceContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getTextArray(locator);
};

GamePage.prototype.getPerformanceStatsTableStatFor = function(rowNum, colName) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamGamePerformanceContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[count(//div[@id='tableFootballTeamGamePerformanceContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getText(locator);
};

GamePage.prototype.toggleShowPinnedPlayerSessions = function(colName) {
  var locator = By.css("#tableFootballPlayersGameSessionsControls div.btn");
  return this.click(locator);
};

GamePage.prototype.getPerformanceStatsSessionTableStatFor = function(rowNum, colName) {
  var locator = By.xpath(`.//div[@id='tableFootballPlayersGameSessionsContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[count(//div[@id='tableFootballPlayersGameSessionsContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getText(locator);
};

GamePage.prototype.clickPerformanceStatsChartColumnsTableHeader = function(col) {
  var locator = By.css(`#tableFootballPlayersGameSessionsContainer table th:nth-of-type(${col})`);    
  this.waitForEnabled(locator);
  return this.click(locator); 
},

GamePage.prototype.openPerformanceStatsHistogram = function(colNum) {
  this.clickPerformanceStatsChartColumnsTableHeader(colNum);
  return this.click(this.HISTOGRAM_LINK);
};

GamePage.prototype.openPerformanceStatsScatterChart = function(selectionOne, selectionTwo) {
  this.clickPerformanceStatsChartColumnsTableHeader(selectionOne);
  this.click(this.SCATTER_CHART_LINK);
  this.clickPerformanceStatsChartColumnsTableHeader(selectionTwo);
  return this.click(this.SCATTER_CHART_LINK);
};

GamePage.prototype.clickPerformanceExportLink = function() {
  var locator = By.id("tableFootballTeamGamePerformanceTableExport");
  this.click(locator);
  return this.driver.sleep(1000);
};

GamePage.prototype.clickPerformanceExportAllLink = function() {
  var locator = By.id("<%=name%>TableExportAll");
  this.click(locator);
  return this.driver.sleep(1000);
};

GamePage.prototype.clickPerformanceExportLegacyLink = function() {
  var locator = By.css(".export-link-custom");
  this.click(locator);
  return this.driver.sleep(1000);
};

GamePage.prototype.clickPerformanceZebraExportLink = function() {
  var locator = By.css(".export-link-custom-2");
  this.click(locator);
  return this.driver.sleep(1000);
};

GamePage.prototype.clickPerformanceSessionsExportLink = function() {
  var locator = By.id("tableFootballPlayersGameSessionsTableExport");
  this.click(locator);
  return this.driver.sleep(1000);
};

/****************************************************************************
** Report
*****************************************************************************/
GamePage.prototype.changeReportDropdown = function(dropdown, listItem) {
  var d = Promise.defer();
  var dropdownLocator = By.css(`football-performance-report-widget paper-dropdown-menu[label='${dropdown}']`);
  var listItemLocator = By.xpath(`.//football-performance-report-widget/div/div/paper-dropdown-menu[@label="${dropdown}"]/.//paper-item[text()='${listItem}']`);
  var playerContainerLocator = By.css('football-performance-report-widget > div:nth-of-type(2)');
  this.isDisplayed(listItemLocator, 1000).then(function(displayed) {
    if (!displayed) this.click(dropdownLocator);
    this.click(listItemLocator);
    d.fulfill(this.waitUntilStaleness(playerContainerLocator, 1000));
  }.bind(this))
  return d.promise;
};

GamePage.prototype.changeReportPlayerDropdown = function(listItem) {
  var d = Promise.defer();
  var dropdownLocator = By.css(`football-performance-report-widget paper-dropdown-menu[label='Players']`);
  var listItemLocator = By.xpath(`.//football-performance-report-widget/div/div/paper-dropdown-menu[@label="Players"]/.//paper-item/div[contains(text()[1],'${listItem}')]`);
  var playerContainerLocator = By.css('football-performance-report-widget > div:nth-of-type(2)');
  this.isDisplayed(listItemLocator, 1000).then(function(displayed) {
    if (!displayed) this.click(dropdownLocator);
    this.click(listItemLocator);
    d.fulfill(this.waitUntilStaleness(playerContainerLocator, 1000));
  }.bind(this))
  return d.promise;
};

GamePage.prototype.getReportPositions = function(position) {
  var d = Promise.defer();
  var locator = By.css("football-performance-report-positions#positions-report div.football-performance-report-position > h3");
  this.getTextArray(locator).then(function(arr) {
    var parsedArray = arr.map(function(str) {
      if (str.split("-").length == 2) {
        return str.split("-")[1].trim();  
      }
    })

    var uniqArray = Array.from(new Set(parsedArray));
    d.fulfill(uniqArray);
  });

  return d.promise;
};

GamePage.prototype.getReportPlayers = function(position) {
  var d = Promise.defer();
  var locator = By.css("football-performance-report-players#players-report div.football-performance-report-player > h3");
  this.getTextArray(locator).then(function(arr) {
    var parsedArray = arr.map(function(str) {
      str = str.split('Performance Report')[0];
      str = str.split(/^#\d{1,2}\s\w{1,4}/)[1];
      if (str) return str.trim();
    })

    var uniqArray = Array.from(new Set(parsedArray));
    d.fulfill(uniqArray);
  });

  return d.promise;
};

GamePage.prototype.isReportPositionsDisplayed = function() {
  var locator = By.css('football-performance-report-position');
  return this.isDisplayed(locator, 1000);
};

GamePage.prototype.isReportTeamDisplayed = function() {
  var locator = By.css('football-performance-report-team-summary');
  return this.isDisplayed(locator, 1000);
};

GamePage.prototype.isReportPlayersDisplayed = function() {
  var locator = By.css('football-performance-report-players');
  return this.isDisplayed(locator, 1000);
};

GamePage.prototype.getReportTeamComparedToString = function() {
  var d = Promise.defer();
  var locator = By.xpath(".//football-performance-report-widget/div/football-performance-report-team[@id='team-report']/football-performance-report-team-summary/div[4]");
  this.getText(locator).then(function(text) {
    d.fulfill(text.split("Compared To")[1].trim());
  });
  return d.promise;
};

/****************************************************************************
** Team Summary
*****************************************************************************/
GamePage.prototype.getTeamSummaryTableStat = function(rowNum, colNum) {
  var locator = By.xpath(`.//div[@id='tableFootballGameDrivesContainer']/table/tbody/tr[not(contains(@class,'sectionHeader'))][${rowNum}]/td[${colNum}]`);
  return this.getText(locator);
};

GamePage.prototype.getTeamSummaryScoringSummaryTableStat = function(rowNum, colNum) {
  var locator = By.xpath(`.//div[@id='tableFootballGameScoringSummaryContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[${colNum}]`);
  return this.getText(locator);
};

GamePage.prototype.clickTeamSummaryScoringSummaryVideoIcon = function(rowNum, colNum) {
  var locator = By.xpath(`.//div[@id='tableFootballGameScoringSummaryContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td/tmn-video-icon`);
  return this.click(locator);
};

GamePage.prototype.clickTeamSummaryExportLink = function() {
  var locator = By.id("tableFootballGameScoringSummaryTableExport");
  this.click(locator);
  return this.driver.sleep(1000);
};

/****************************************************************************
** Play By Play
*****************************************************************************/
GamePage.prototype.clickPlayByPlayTab = function(tab) {
  var tabNum = tab == 'flatView' ? 2 : 1;
  var locator = By.xpath(`.//div[@id='tabContainer']/ul/li[${tabNum}]/a`);
  return this.click(locator);
};

GamePage.prototype.getPlayByPlayByPosessionTableStat = function(rowNum, colNum) {
  var locator = By.xpath(`.//div[@id='tableFootballGamePlayByPlayContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[${colNum}]`);
  return this.getText(locator);
};

GamePage.prototype.clickPlayByPlayByPosessionVideoIcon = function(playNum) {
  var locator = By.xpath(`.//div[@id='tableFootballGamePlayByPlayContainer']/table/tbody/tr[@data-tmn-row-type='row'][${playNum}]/td/tmn-video-icon`);
  return this.click(locator);
};

GamePage.prototype.getPlayByPlayFlatViewTableStat = function(rowNum, colNum) {
  var locator = By.xpath(`.//div[@id='tableFootballGamePlayByPlayTableContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[${colNum}]`);
  return this.getText(locator);
};

GamePage.prototype.clickPlayByPlayFlatViewVideoIcon = function(playNum) {
  var locator = By.xpath(`.//div[@id='tableFootballGamePlayByPlayTableContainer']/table/tbody/tr[@data-tmn-row-type='row'][${playNum}]/td/tmn-video-icon`);
  return this.click(locator);
};

GamePage.prototype.getPlayByPlayFlatViewVideoPlaylistText = function(videoNum, lineNum) {
  var locator = By.xpath(`.//div[@id='videoModaltableFootballGamePlayByPlayTableModal']/.//div[contains(@class, 'playlistItems')]/div[@class='list-group']/a[${videoNum}]/.//div[contains(@class,'tmn-play-summary-football')]/div[${lineNum}]`);
  return this.getText(locator);
};

GamePage.prototype.getPlayByPlayScoringSummaryTableStat = function(rowNum, colNum) {
  var locator = By.xpath(`.//div[@id='tableFootballGameScoringSummaryContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[${colNum}]`);
  return this.getText(locator);
};

GamePage.prototype.clickPlayByPlayScoringSummaryVideoIcon = function(playNum) {
  var locator = By.xpath(`.//div[@id='tableFootballGameScoringSummaryContainer']/table/tbody/tr[@data-tmn-row-type='row'][${playNum}]/td/tmn-video-icon`);
  return this.click(locator);
};

GamePage.prototype.getPlayByPlayScoringSummaryVideoPlaylistText = function(videoNum, lineNum) {
  var locator = By.xpath(`.//div[@id='videoModaltableFootballGameScoringSummaryModal']/.//div[contains(@class, 'playlistItems')]/div[@class='list-group']/a[${videoNum}]/.//div[contains(@class,'tmn-play-summary-football')]/div[${lineNum}]`);
  return this.getText(locator);
};

GamePage.prototype.clickPlayByPlayExportLink = function() {
  var locator = By.id("tableFootballGameScoringSummaryTableExport");
  this.click(locator);
  return this.driver.sleep(1000);
};

/****************************************************************************
** Drives
*****************************************************************************/
GamePage.prototype.getDrivesTableStat = function(rowNum, colNum) {
  var locator = By.xpath(`.//div[@id='tableFootballGameDrivesContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[${colNum}]`);
  return this.getText(locator);
};

GamePage.prototype.getDrivesSummaryTableStat = function(rowNum, colNum) {
  var locator = By.xpath(`.//div[@id='tableFootballGameScoringSummaryContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[${colNum}]`);
  return this.getText(locator);
};

GamePage.prototype.clickDrivesSummaryPlayVideoIcon = function(rowNum, colNum) {
  var locator = By.xpath(`.//div[@id='tableFootballGameScoringSummaryContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td/tmn-video-icon`);
  return this.click(locator);
};

GamePage.prototype.clickDrivesExportLink = function() {
  var locator = By.id("tableFootballGameDrivesTableExport");
  this.click(locator);
  return this.driver.sleep(1000);
};

GamePage.prototype.clickDrivesSummaryExportLink = function() {
  var locator = By.id("tableFootballGameScoringSummaryTableExport");
  this.click(locator);
  return this.driver.sleep(1000);
};


module.exports = GamePage;