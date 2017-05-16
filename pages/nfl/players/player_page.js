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
var chartColumns = require('../../mixins/chartColumns.js');

/****************************************************************************
** Locators
*****************************************************************************/
var SECTION_NAMES = {
  'overview': 'Overview',
  'gameLog': 'Game Log',
  'playByPlay': 'Play By Play',
  'occurrencesAndStreaks': 'Occurrences & Streaks',
  'splits': 'Splits',
  'roster': 'Roster',
  'multiFilter': 'Multi-Filter',
  'performanceLog': 'Performance Log',
  'punting': 'Punting',
  'kicking': 'Kicking',
  'alignment': 'Alignment'
}

// shared
var REPORT_SELECT = {
  'gameLog': By.id("s2id_reportNavFootballPlayerSubCommon"),
  'splits': By.id("s2id_reportNavFootballPlayerSubCommon"),
  'multiFilter': By.id("s2id_reportNavFootballPlayerSubCommon"),
  'performanceLog': By.id("s2id_reportNavFootballPlayerPracticeSubCommon")
}

var GROUP_BY_SELECT = {
  'multiFilter': By.id("s2id_pageControlFootballPlayerGroupBy")
}

var STATS_VIEW_SELECT = By.id("s2id_pageControlFootballStatsView");
var DROPDOWN_INPUT = By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input");

var DATA_TABLE = {
  'overview': By.css('.container'),
  'gameLog': By.css("#tableFootballPlayerGameLogContainer > table"),
  'performanceLog': By.css("#tableFootballPlayerPerformanceLogContainer > table"),
  'occurrencesAndStreaks': By.css("#tableFootballPlayerStreaksContainer > table"),
  'splits': By.css("#tableFootballPlayerSplitsContainer > table"),
  'multiFilter': By.css("#tableFootballPlayerMultiFilterContainer > table"),
  
}

var BAR_CHART_COLORS = {
  'walk': "rgb(26, 150, 65)",
  'jog': "rgb(166, 217, 106)",
  'run': "rgb(255, 255, 191)",
}

function PlayerPage(driver, section) {
  BasePage.call(this, driver);
  this.section = 'overview';
};

PlayerPage.prototype = Object.create(BasePage.prototype);
PlayerPage.prototype.constructor = PlayerPage;

// Mixins
_.extend(PlayerPage.prototype, videoPlaylist);
_.extend(PlayerPage.prototype, occurrencesAndStreaks);
_.extend(PlayerPage.prototype, chartColumns);

PlayerPage.prototype.DEFAULT_BY_POSSESSION_ID = {
  'overview': 'tableFootballPlayerPlayByPlayModalContainer',
  'gameLog': 'tableFootballPlayerPlayByPlayModalContainer',
  // 'playByPlay': 'tableFootballTeamPlayByPlayModalContainer',
  // 'roster': 'tableFootballPlayerPlayByPlayRosterModalContainer',
  'multiFilter': 'tableFootballPlayerPlayByPlayModalMFilterContainer',
  // 'gameDayParticipation': 'tableFootballPersonnelPlayByPlayModalStandaloneModalContainer'
};

PlayerPage.prototype.DEFAULT_FLAT_VIEW_ID = {
  'overview': 'tableFootballPlayerPlayByPlayModalTableContainer',
  'gameLog': 'tableFootballPlayerPlayByPlayModalTableContainer',                                      
  // 'playByPlay': 'tableFootballTeamPlayByPlayModalTableContainer',                                      
  // 'roster': 'tableFootballPlayerPlayByPlayRosterModalTableContainer',
  'multiFilter': 'tableFootballPlayerPlayByPlayModalMFilterTableContainer',
  // 'gameDayParticipation': 'tableFootballPersonnelPlayByPlayModalStandaloneTableContainer'
};                                     
  
// PlayerPage.prototype.DEFAULT_CHART_COLUMNS_DATA_TABLE_ID = 'tableFootballTeamRosterContainer';
// PlayerPage.prototype.DEFAULT_CHART_COLUMNS_ISO_TABLE_ID = 'tableFootballTeamRosterISOContainer';

PlayerPage.prototype.DEFAULT_CONSTRAINT_STAT_SELECT = By.id('s2id_pageControlFootballStrkConstraintStatPlayerZebra');
PlayerPage.prototype.DEFAULT_STREAK_GROUPING_SELECT = By.id('s2id_pageControlFootballStrkGroupingPlayer');

PlayerPage.prototype.DEFAULT_CHART_COLUMNS_DATA_TABLE_ID = {
  'performanceLog': 'tableFootballPlayerPerformanceLogContainer'
};
PlayerPage.prototype.DEFAULT_CHART_COLUMNS_ISO_TABLE_ID = {
  'performanceLog': 'tableFootballPlayerPerformanceLogISOContainer'
};

/****************************************************************************
** Shared
*****************************************************************************/
PlayerPage.prototype.goToSection = function(section) {
  this.section = section;
  var sectionName = SECTION_NAMES[section];
  var locator = By.xpath(`.//div[@class='navbar-header']/ul/li/a[text()='${sectionName}']`);
  return this.click(locator);
};

PlayerPage.prototype.waitForTableToLoad = function() {
  this.waitUntilStaleness(DATA_TABLE[this.section], 1000);
  return this.waitForEnabled(DATA_TABLE[this.section], 10000);
};

PlayerPage.prototype.changeReport = function(report) {
  this.changeDropdown(REPORT_SELECT[this.section], DROPDOWN_INPUT, report);
  return this.waitForEnabled(REPORT_SELECT[this.section], 30000);
};

PlayerPage.prototype.changeGroupBy = function(filter) {
  return this.changeDropdown(GROUP_BY_SELECT[this.section], DROPDOWN_INPUT, filter);
};

PlayerPage.prototype.changeStatsView = function(filter) {
  return this.changeDropdown(STATS_VIEW_SELECT, DROPDOWN_INPUT, filter);
};

PlayerPage.prototype.getPlayerNameTitle = function() {
  var nameTitle = By.xpath(".//div[1]/h1[@class='name']");
  return this.getText(nameTitle);
};

/****************************************************************************
** Overview
*****************************************************************************/
PlayerPage.prototype.getOverviewSeasonTableStat = function(rowNum, colName) {
  var locator = By.xpath(`.//div[@id='tablePlayerOverviewSeasonContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[count(//div[@id='tablePlayerOverviewSeasonContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getText(locator);
};

PlayerPage.prototype.getOverviewResultTableStat = function(rowNum, colName) {
  var locator = By.xpath(`.//div[@id='tablePlayerOverviewGameByGameContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[count(//div[@id='tablePlayerOverviewGameByGameContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getText(locator);
};

PlayerPage.prototype.getOverviewRankTableStat = function(rowNum, colName) {
  var locator = By.xpath(`.//div[@id='tablePlayerOverviewRankContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[count(//div[@id='tablePlayerOverviewRankContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getText(locator);
};

PlayerPage.prototype.clickOverviewSeasonTableStat = function(rowNum, colName) {
  var locator = By.xpath(`.//div[@id='tablePlayerOverviewSeasonContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[count(//div[@id='tablePlayerOverviewSeasonContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]/span`);
  return this.click(locator);
};

PlayerPage.prototype.clickOverviewSeasonsExportLink = function() {
  var locator = By.id("tablePlayerOverviewSeasonTableExport");
  this.click(locator);
  return this.driver.sleep(3000);
};

PlayerPage.prototype.clickOverviewResultsExportLink = function() {
  var locator = By.id("tablePlayerOverviewGameByGameTableExport");
  this.click(locator);
  return this.driver.sleep(3000);
};

PlayerPage.prototype.clickOverviewRankExportLink = function() {
  var locator = By.id("tablePlayerOverviewRankTableExport");
  this.click(locator);
  return this.driver.sleep(3000);
};

/****************************************************************************
** Game Log
*****************************************************************************/
PlayerPage.prototype.clickGameLogTableHeaderFor = function(colName) {
  var locator = By.xpath(`.//div[@id='tableFootballPlayerGameLogContainer']/table/thead/tr/th[text()="${colName}"]`);
  return this.click(locator);
};

PlayerPage.prototype.getGameLogTableStatsFor = function(colName) {
  var locator = By.xpath(`.//div[@id='tableFootballPlayerGameLogContainer']/table/tbody/tr[@data-tmn-row-type='row']/td[count(//div[@id='tableFootballPlayerGameLogContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getTextArray(locator);
};

PlayerPage.prototype.getGameLogTableStatFor = function(rowNum, colName) {
  var locator = By.xpath(`.//div[@id='tableFootballPlayerGameLogContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[count(//div[@id='tableFootballPlayerGameLogContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getText(locator);
};

PlayerPage.prototype.clickGameLogTableStatFor = function(rowNum, colName) {
  var locator = By.xpath(`.//div[@id='tableFootballPlayerGameLogContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[count(//div[@id='tableFootballPlayerGameLogContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]/span`);
  return this.click(locator);
};

PlayerPage.prototype.getGameLogTableBgColorFor = function(rowNum, colName) {
  var locator = By.xpath(`.//div[@id='tableFootballPlayerGameLogContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[count(//div[@id='tableFootballPlayerGameLogContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getCssValue(locator, "background-color");
};

PlayerPage.prototype.clickGameLogExportLink = function() {
  var locator = By.id("tableFootballPlayerGameLogTableExport");
  this.click(locator);
  return this.driver.sleep(1000);
};

PlayerPage.prototype.clickGameLogExportAllLink = function() {
  var locator = By.id("<%=name%>TableExportAll");
  this.click(locator);
  return this.driver.sleep(1000);
};

/****************************************************************************
** Play by Play
*****************************************************************************/
PlayerPage.prototype.clickPlayByPlayPossessionTab = function(possession) {
  var locator = By.xpath(`.//div[@id='tableFootballPlayerPlayByPlayRadioControls']/btn-group/label[text()='${possession}']`);
  return this.click(locator);
};

PlayerPage.prototype.clickPlayByPlayVideoIcon = function(playNum) {
  var locator = By.xpath(`.//div[@id='tableFootballPlayerPlayByPlayContainer']/table/tbody/tr[@data-tmn-row-type='row'][${playNum}]/td/tmn-video-icon`);
  return this.click(locator);
};

PlayerPage.prototype.getPlayByPlayTableStat = function(rowNum, colNum) {
  var locator = By.xpath(`.//div[@id='tableFootballPlayerPlayByPlayContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[${colNum}]`);
  return this.getText(locator);
};

PlayerPage.prototype.clickPlayByPlayExportLink = function() {
  var locator = By.id("tableFootballPlayerPlayByPlayTableExport");
  this.click(locator);
  return this.driver.sleep(1000);
};

/****************************************************************************
** Occurrences & Streaks
*****************************************************************************/
PlayerPage.prototype.getStreaksTableHeader = function(col) {
  var locator = By.xpath(`.//div[@id='tableFootballPlayerStreaksContainer']/table/thead/tr/th[${col}]`);
  return this.getText(locator);
};

PlayerPage.prototype.getStreaksTableStat = function(row, col) {
  var locator = By.xpath(`.//div[@id='tableFootballPlayerStreaksContainer']/table/tbody/tr[@data-tmn-row-type='row'][${row}]/td[${col}]`);
  return this.getText(locator);
};

PlayerPage.prototype.clickStreaksExportLink = function() {
  var locator = By.id("tableFootballPlayerStreaksTableExport");
  this.click(locator);
  return this.driver.sleep(1000);
};

/****************************************************************************
** Splits
*****************************************************************************/
PlayerPage.prototype.getSplitsTableHeaderText = function(headerNum) {
  var locator = By.xpath(`.//div[@id='tableFootballPlayerSplitsContainer']/table/tbody/tr[@class='sectionHeader'][${headerNum}]/td[1]`);
  return this.getText(locator);
};

PlayerPage.prototype.getSplitsTableStat = function(row, col) {
  var locator = By.xpath(`.//div[@id='tableFootballPlayerSplitsContainer']/table/tbody/tr[@data-tmn-row-type='row'][${row}]/td[${col}]`);
  return this.getText(locator);
};

PlayerPage.prototype.getSplitsTableStatFor = function(rowNum, colName) {
  var locator = By.xpath(`.//div[@id='tableFootballPlayerSplitsContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[count(//div[@id='tableFootballPlayerSplitsContainer']/table/tbody/tr[1]/td[text()="${colName}"]/preceding-sibling::td)+1]`);
  return this.getText(locator);
};

PlayerPage.prototype.clickSplitsFilterExportLink = function() {
  var locator = By.id("tableFootballPlayerSplitsTableExport");
  this.click(locator);
  return this.driver.sleep(1000);
};

/****************************************************************************
** Multi-Filter
*****************************************************************************/
PlayerPage.prototype.getMultiFilterTableStatFor = function(rowNum, colName) {
  var locator = By.xpath(`.//div[@id='tableFootballPlayerMultiFilterContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[count(//div[@id='tableFootballPlayerMultiFilterContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getText(locator);
};

PlayerPage.prototype.clickMultiFilterTableStatFor = function(rowNum, colName) {
  var locator = By.xpath(`.//div[@id='tableFootballPlayerMultiFilterContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[count(//div[@id='tableFootballPlayerMultiFilterContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]/span`);
  return this.click(locator);
};

PlayerPage.prototype.clickMultiFilterExportLink = function() {
  var locator = By.id("tableFootballPlayerMultiFilterTableExport");
  this.click(locator);
  return this.driver.sleep(1000);
};

/****************************************************************************
** Performance Log
*****************************************************************************/
PlayerPage.prototype.clickPerformanceLogTableHeaderFor = function(colName) {
  var locator = By.xpath(`.//div[@id='tableFootballPlayerPerformanceLogContainer']/table/thead/tr/th[text()="${colName}"]`);
  return this.click(locator);
};

PlayerPage.prototype.getPerformanceLogTableStatsFor = function(colName) {
  var locator = By.xpath(`.//div[@id='tableFootballPlayerPerformanceLogContainer']/table/tbody/tr[@data-tmn-row-type='row']/td[count(//div[@id='tableFootballPlayerPerformanceLogContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getTextArray(locator);
};

PlayerPage.prototype.getPerformanceLogTableStatFor = function(rowNum, colName) {
  var locator = By.xpath(`.//div[@id='tableFootballPlayerPerformanceLogContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[count(//div[@id='tableFootballPlayerPerformanceLogContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getText(locator);
};

PlayerPage.prototype.toggleShowPinnedPlayerSessions = function() {
  var locator = By.css("#tableFootballPlayerPracticeSessionsControls div.btn");
  return this.click(locator);
};


PlayerPage.prototype.clickPerformanceLogSessionTableHeaderFor = function(colName) {
  var locator = By.xpath(`.//div[@id='tableFootballPlayerPracticeSessionsContainer']/table/thead/tr/th[text()="${colName}"]`);
  return this.click(locator);
};

PlayerPage.prototype.getPerformanceLogSessionTableStatFor = function(rowNum, colName) {
  var locator = By.xpath(`.//div[@id='tableFootballPlayerPracticeSessionsContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[count(//div[@id='tableFootballPlayerPracticeSessionsContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getText(locator);
};

PlayerPage.prototype.getPerformanceLogSessionTableBgColorFor = function(rowNum, colName) {
  var locator = By.xpath(`.//div[@id='tableFootballPlayerPracticeSessionsContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[count(//div[@id='tableFootballPlayerPracticeSessionsContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getCssValue(locator, 'background-color');
};

PlayerPage.prototype.clickPerformanceLogChartColumnsTableHeader = function(col) {
  var locator = By.css(`#tableFootballPlayerPracticeSessionsContainer table th:nth-of-type(${col})`);    
  this.waitForEnabled(locator);
  return this.click(locator); 
},

PlayerPage.prototype.openPerformanceLogSessionsHistogram = function(colNum) {
  this.clickPerformanceLogChartColumnsTableHeader(colNum);
  return this.click(this.HISTOGRAM_LINK);
};

PlayerPage.prototype.openPerformanceLogSessionsScatterPlot = function(selectionOne, selectionTwo) {
  this.clickPerformanceLogChartColumnsTableHeader(selectionOne);
  this.click(this.SCATTER_CHART_LINK);
  this.clickPerformanceLogChartColumnsTableHeader(selectionTwo);
  return this.click(this.SCATTER_CHART_LINK);
};

PlayerPage.prototype.getPracticeSessionBarChartTooltipText = function() {
  var locator = By.xpath(".//div[@class='d3-tip n'][1]")
  return this.getText(locator);
};

PlayerPage.prototype.getPerformanceLogBarChartTooltipText = function() {
  var locator = By.xpath(".//div[@class='d3-tip n'][2]")
  return this.getText(locator);
};

PlayerPage.prototype.hoverOverPracticeSessionBarChartStack = function(sessionNum, barType) {
  var fillText = BAR_CHART_COLORS[barType];
  var locator = By.css(`football-performance-bar-chart[table-name='tableFootballPlayerPracticeSessions'] g.layer[style="fill: ${fillText};"] rect:nth-of-type(${sessionNum})`);
  var thiz = this;

  this.driver.findElement(locator).then(function(elem) {
    thiz.driver.actions().mouseMove(elem).perform();
    thiz.driver.sleep(1000);
  });
};

PlayerPage.prototype.togglePracticeSessionBarChartType = function(type) {
  var checked = (type == 'Time');
  var d = Promise.defer();
  var thiz = this;

  var inputLocator = By.css("football-performance-bar-chart[table-name='tableFootballPlayerPracticeSessions'] #checkboxContainer");
  var checkMarkLocator = By.css("football-performance-bar-chart[table-name='tableFootballPlayerPracticeSessions'] #checkboxContainer #checkmark");
  
  this.isDisplayed(checkMarkLocator, 1000).then(function(displayed) {
    if (checked != displayed) {
      d.fulfill(thiz.click(inputLocator));
    }
  })
  return d.promise;
};

PlayerPage.prototype.hoverOverPerformanceLogBarChartStack = function(sessionNum, barType) {
  var fillText = BAR_CHART_COLORS[barType];
  var locator = By.css(`football-performance-bar-chart[table-name='tableFootballPlayerPerformanceLog'] g.layer[style="fill: ${fillText};"] rect:nth-of-type(${sessionNum})`);
  var thiz = this;

  this.driver.findElement(locator).then(function(elem) {
    thiz.driver.actions().mouseMove(elem).perform();
    thiz.driver.sleep(1000);
  });
};

PlayerPage.prototype.togglePerformanceLogChartType = function(type) {
  var checked = (type == 'Time');
  var d = Promise.defer();
  var thiz = this;

  var inputLocator = By.css("football-performance-bar-chart[table-name='tableFootballPlayerPerformanceLog'] #checkboxContainer");
  var checkMarkLocator = By.css("football-performance-bar-chart[table-name='tableFootballPlayerPerformanceLog'] #checkboxContainer #checkmark");
  
  this.isDisplayed(checkMarkLocator, 1000).then(function(displayed) {
    if (checked != displayed) {
      d.fulfill(thiz.click(inputLocator));
    }
  })
  return d.promise;
};

PlayerPage.prototype.clickPerformanceLogExportLink = function() {
  var locator = By.id("tableFootballPlayerPerformanceLogTableExport");
  this.click(locator);
  return this.driver.sleep(1000);
};

PlayerPage.prototype.clickPerformanceLogExportAllLink = function() {
  var locator = By.id("<%=name%>TableExportAll");
  this.click(locator);
  return this.driver.sleep(1000);
};

/****************************************************************************
** Punting
*****************************************************************************/
PlayerPage.prototype.getPuntingTableStatFor = function(rowNum, colName) {
  var locator = By.xpath(`.//div[@id='tableCowboysPlayerPuntingContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[count(//div[@id='tableCowboysPlayerPuntingContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getText(locator);
};

PlayerPage.prototype.clickPuntingTablePlayVideoIcon = function(playNum) {
  var locator = By.xpath(`.//div[@id='tableCowboysPlayerPuntingContainer']/table/tbody/tr[@data-tmn-row-type='row'][${playNum}]/td[2]/tmn-video-icon/paper-icon-button`);
  return this.click(locator);
};

PlayerPage.prototype.getPuntingTableStatBgColorFor = function(puntNum) {
  var locator = By.xpath(`.//div[@id='tableCowboysPlayerPuntingContainer']/table/tbody/tr[@data-tmn-row-type='row'][${puntNum}]/td[1]`);
  return this.getCssValue(locator, 'background-color');
};

PlayerPage.prototype.getFortyPlusPuntCount = function() {
  var locator = By.css("div > div:nth-of-type(1) > football-punt-chart svg g.point");
  return this.getElementCount(locator);
};

PlayerPage.prototype.toggleFortyPlusSequenceNumbers = function() {
  var locator = By.css("div > div:nth-of-type(1) > football-punt-chart  #toggleButton");
  return this.click(locator);
};

PlayerPage.prototype.getFortyPlusPuntMarkerText = function(puntNum) {
  var typeNum = puntNum + 1;
  var locator = By.css(`div > div:nth-of-type(1) > football-punt-chart  g.football-field-chart > g:nth-of-type(${typeNum}) > text`);
  return this.getText(locator);
};

PlayerPage.prototype.hoverOverFortyPlusPunt = function(puntNum) {
  var typeNum = puntNum + 1;
  var locator = By.css(`div > div:nth-of-type(1) > football-punt-chart  g.football-field-chart > g:nth-of-type(${typeNum}) > text`);
  var thiz = this;

  this.driver.findElement(locator).then(function(elem) {
    thiz.driver.actions().mouseMove(elem).perform();
    thiz.driver.sleep(1000);
  });
};

PlayerPage.prototype.getFortyMinusPuntCount = function() {
  var locator = By.css("div > div:nth-of-type(3) > football-punt-chart svg g.point");
  return this.getElementCount(locator);
};

PlayerPage.prototype.toggleFortyMinusSequenceNumbers = function() {
  var locator = By.css("div > div:nth-of-type(3) > football-punt-chart  #toggleButton");
  return this.click(locator);
};

PlayerPage.prototype.getFortyMinusPuntMarkerText = function(puntNum) {
  var typeNum = puntNum + 1;
  var locator = By.css(`div > div:nth-of-type(3) > football-punt-chart  g.football-field-chart > g:nth-of-type(${typeNum}) > text`);
  return this.getText(locator);
};

PlayerPage.prototype.hoverOverFortyMinusPunt = function(puntNum) {
  var typeNum = puntNum + 1;
  var locator = By.css(`div > div:nth-of-type(3) > football-punt-chart  g.football-field-chart > g:nth-of-type(${typeNum}) > text`);
  var thiz = this;

  this.driver.findElement(locator).then(function(elem) {
    thiz.driver.actions().mouseMove(elem).perform();
    thiz.driver.sleep(1000);
  });
};

PlayerPage.prototype.clickPuntingExportLink = function() {
  var locator = By.id("tableCowboysPlayerPuntingTableExport");
  this.click(locator);
  return this.driver.sleep(1000);
};

/****************************************************************************
** Kicking
*****************************************************************************/
PlayerPage.prototype.getKickingTableStatFor = function(rowNum, colName) {
  var locator = By.xpath(`.//div[@id='tableCowboysPlayerKickingContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[count(//div[@id='tableCowboysPlayerKickingContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getText(locator);
};

PlayerPage.prototype.clickKickingTablePlayVideoIcon = function(playNum) {
  var locator = By.xpath(`.//div[@id='tableCowboysPlayerKickingContainer']/table/tbody/tr[@data-tmn-row-type='row'][${playNum}]/td[2]/tmn-video-icon/paper-icon-button`);
  return this.click(locator);
};

PlayerPage.prototype.getKickingTableStatBgColorFor = function(kickNum) {
  var locator = By.xpath(`.//div[@id='tableCowboysPlayerKickingContainer']/table/tbody/tr[@data-tmn-row-type='row'][${kickNum}]/td[1]`);
  return this.getCssValue(locator, 'background-color');
};

PlayerPage.prototype.getKickingKickoffCount = function() {
  var locator = By.css("football-kickoff-chart svg g.point");
  return this.getElementCount(locator);
};

PlayerPage.prototype.toggleKickingSequenceNumbers = function() {
  var locator = By.css("football-kickoff-chart  #toggleButton");
  return this.click(locator);
};

PlayerPage.prototype.getKickingMarkerText = function(kickNum) {
  var typeNum = kickNum + 1;
  var locator = By.css(`football-kickoff-chart  g.football-field-chart > g:nth-of-type(${typeNum}) > text`);
  return this.getText(locator);
};

PlayerPage.prototype.hoverOverKickingKickoff = function(kickNum) {
  var typeNum = kickNum + 1;
  var locator = By.css(`football-kickoff-chart  g.football-field-chart > g:nth-of-type(${typeNum}) > text`);
  var thiz = this;

  this.driver.findElement(locator).then(function(elem) {
    thiz.driver.actions().mouseMove(elem).perform();
    thiz.driver.sleep(1000);
  });
};

PlayerPage.prototype.clickKickingExportLink = function() {
  var locator = By.id("tableCowboysPlayerKickingTableExport");
  this.click(locator);
  return this.driver.sleep(1000);
};

/****************************************************************************
** Alignment
*****************************************************************************/
PlayerPage.prototype.changeAlignmentPlayMode = function(mode) {
  var locator = By.xpath(`.//tmn-pre-snap-legend/.//div[span[contains(text(), '${mode}')]]/i`);
  return this.click(locator);
};

PlayerPage.prototype.changeAlignmentViewMode = function(mode) {
  var locator = By.xpath(`.//tmn-group-view-mode/.//div[span[contains(text(), '${mode}')]]/i`);
  return this.click(locator);
};

PlayerPage.prototype.getAlignmentPlaylistCount = function() {
  var d = Promise.defer();
  var locator = By.xpath(".//paper-toolbar/div/span");
  this.getText(locator).then(function(text) {
    d.fulfill(text.split('/')[1].match(/^\d*/)[0]);
  });
  return d.promise;
};

PlayerPage.prototype.getAlignmentPlaylistShownCount = function() {
  var d = Promise.defer();
  var locator = By.xpath(".//paper-toolbar/div/span");
  this.getText(locator).then(function(text) {
    d.fulfill(text.split('/')[0]);
  });
  return d.promise;
};

PlayerPage.prototype.clickAlignmentPlaylistPlay = function(playNum) {
  var locator = By.xpath(`.//tmn-play-summary-container/paper-material/iron-list/div[@id='items']/.//paper-item[${playNum}]/paper-checkbox/div[@id='checkboxContainer']`)
  return this.click(locator);
};

PlayerPage.prototype.toggleAlignmentPlaylistSelectAll = function() {
  var locator = By.xpath(".//tmn-play-summary-container/paper-material/paper-toolbar/.//div[@id='checkboxContainer']");
  return this.click(locator);
};

// Visual
PlayerPage.prototype.getAlignmentVisualLocationCount = function() {
  var locator = By.css("g.football-field-chart g.point > circle.startingPoint");
  return this.getElementCount(locator);
};

PlayerPage.prototype.hoverOverAlignmentVisualPlay = function(playNum) {
  var typeNum = playNum + 1;
  var locator = By.css(`g.football-field-chart > g:nth-of-type(3) > circle.startingPoint`);
  var thiz = this;

  this.driver.findElement(locator).then(function(elem) {
    thiz.driver.actions().mouseMove(elem).perform();
    thiz.driver.sleep(1000);
  });
};

PlayerPage.prototype.getAlignmentTooltip = function() {
  var locator = By.xpath(".//div[@class='d3-tip n']")
  return this.getText(locator);
};

PlayerPage.prototype.getAlignmentPlayerLocation = function(playNum) {
  var d = Promise.defer();
  var typeNum = playNum + 1;
  var locator = By.css(`g.football-field-chart > g:nth-of-type(${typeNum}) > circle.startingPoint`);
  var location;

  this.getAttribute(locator, 'cx').then(function(xStat) {
    this.getAttribute(locator, 'cy').then(function(yStat) {
      location = xStat + "," + yStat;
      d.fulfill(location)
    })
  }.bind(this))
    
  return d.promise;
};

// Controls
PlayerPage.prototype.toggleAlignmentSectionDisplay = function(section) {
  var locator = By.xpath(`.//tmn-row-square-histogram/table/tbody/tr/th/paper-checkbox[div[contains(text(),'${section}')]]/div[@id='checkboxContainer']`)
  return this.click(locator);
};

PlayerPage.prototype.toggleAlignmentShowPath = function() {
  var locator = By.xpath(`.//paper-toggle-button[@id='show-paths']/div/div[@id='toggleButton']`);
  return this.click(locator);
};

PlayerPage.prototype.getAlignmentVisualPathCount = function() {
  var locator = By.css("g.football-field-chart > g.point > path");
  return this.getElementCount(locator);
};

PlayerPage.prototype.toggleAlignmentShowPlayerLocations = function() {
  var locator = By.xpath(`.//paper-toggle-button[@id='show-locations']/div/div[@id='toggleButton']`);
  return this.click(locator);
};

PlayerPage.prototype.clickAlignmentTimeSlider = function(xOffset) {
  var locator = By.css('#sliderBar');
  return this.clickOffset(locator, xOffset, 0)
};



module.exports = PlayerPage;