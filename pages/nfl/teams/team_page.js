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
  'summary': 'Summary',
  'gameLog': 'Game Log',
  'playByPlay': 'Play By Play',
  'occurrencesAndStreaks': 'Occurrences & Streaks',
  'splits': 'Splits',
  'roster': 'Roster',
  'multiFilter': 'Multi-Filter',
  'playCard': 'Play Card',
  'gameDayParticipation': 'Game Day Participation',
}

// shared
var REPORT_SELECT = {
  'gameLog': By.id("s2id_reportNavFootballTeamSubCommon"),
  'splits': By.id("s2id_reportNavFootballTeamSubCommon"),
  'roster': By.id("s2id_reportNavFootballPlayerSubCommon"),
  'multiFilter': By.id("s2id_reportNavFootballTeamSubCommon")
}

var GROUP_BY_SELECT = {
  'roster': By.id("s2id_pageControlFootballPlayerGroupBy"),
  'multiFilter': By.id("s2id_pageControlFootballGroupBy")
}

var STATS_VIEW_SELECT = By.id("s2id_pageControlFootballStatsViewPlayers");
var DROPDOWN_INPUT = By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input");
var TEAM_NAME = By.css('h1.name');
var CONTAINER = By.css('.container');

var PLAY_CARD_MODAL_TABLE = By.css('#tableFootballFindSimilarPlayByPlayStandaloneTableModalContainer > table');

function TeamPage(driver, section) {
  BasePage.call(this, driver);
  this.section = 'overview';
};

TeamPage.prototype = Object.create(BasePage.prototype);
TeamPage.prototype.constructor = TeamPage;

// Mixins
_.extend(TeamPage.prototype, videoPlaylist);
_.extend(TeamPage.prototype, occurrencesAndStreaks);
_.extend(TeamPage.prototype, chartColumns);

TeamPage.prototype.DEFAULT_BY_POSSESSION_ID = {
  'gameLog': 'tableFootballTeamPlayByPlayModalContainer',
  'playByPlay': 'tableFootballTeamPlayByPlayModalContainer',
  'roster': 'tableFootballPlayerPlayByPlayRosterModalContainer',
  'multiFilter': 'tableFootballTeamPlayByPlayModalMFilterContainer',
  'gameDayParticipation': 'tableFootballPersonnelPlayByPlayModalStandaloneModalContainer'
};

TeamPage.prototype.DEFAULT_FLAT_VIEW_ID = {
  'gameLog': 'tableFootballTeamPlayByPlayModalTableContainer',                                      
  'playByPlay': 'tableFootballTeamPlayByPlayModalTableContainer',                                      
  'roster': 'tableFootballPlayerPlayByPlayRosterModalTableContainer',
  'multiFilter': 'tableFootballTeamPlayByPlayModalMFilterTableContainer',
  'gameDayParticipation': 'tableFootballPersonnelPlayByPlayModalStandaloneTableContainer'
};                                     
  
TeamPage.prototype.DEFAULT_CHART_COLUMNS_DATA_TABLE_ID = 'tableFootballTeamRosterContainer';
TeamPage.prototype.DEFAULT_CHART_COLUMNS_ISO_TABLE_ID = 'tableFootballTeamRosterISOContainer';

/****************************************************************************
** Shared
*****************************************************************************/

TeamPage.prototype.goToSection = function(section) {
  this.section = section;
  var sectionName = SECTION_NAMES[section];
  var locator = By.xpath(`.//div[@class='navbar-header']/ul/li/a[text()='${sectionName}']`);
  return this.click(locator);
};

TeamPage.prototype.getTeamName = function() {
  return this.getText(TEAM_NAME, 30000);
};

TeamPage.prototype.waitForTableToLoad = function() {
  this.waitUntilStaleness(CONTAINER, 10000);
  return this.waitForEnabled(CONTAINER, 10000);
};

TeamPage.prototype.changeReport = function(report) {
  this.changeDropdown(REPORT_SELECT[this.section], DROPDOWN_INPUT, report);
  return this.waitForEnabled(REPORT_SELECT[this.section], 30000);
};

TeamPage.prototype.changeGroupBy = function(filter) {
  return this.changeDropdown(GROUP_BY_SELECT[this.section], DROPDOWN_INPUT, filter);
};

TeamPage.prototype.changeStatsView = function(filter) {
  return this.changeDropdown(STATS_VIEW_SELECT, DROPDOWN_INPUT, filter);
};

/****************************************************************************
** Overview
*****************************************************************************/
TeamPage.prototype.getOverviewRosterTableStat = function(rowNum, colName) {
  var locator = By.xpath(`.//div[@id='teamSummaryRosterTableZebraContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[count(//div[@id='teamSummaryRosterTableZebraContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getText(locator);
};

TeamPage.prototype.getOverviewResultsTableStat = function(rowNum, colName) {
  var locator = By.xpath(`.//div[@id='tableNFLTeamSummaryGameByGameZebraContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[count(//div[@id='tableNFLTeamSummaryGameByGameZebraContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getText(locator);
};

TeamPage.prototype.getOverviewRankTableStat = function(rowNum, colName) {
  var locator = By.xpath(`.//div[@id='tableTeamOverviewRankContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[count(//div[@id='tableTeamOverviewRankContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getText(locator);
};

TeamPage.prototype.clickRosterTab = function(tabName) {
  var locator = By.xpath(`.//div[@id='teamSummaryRosterTableZebraRadioControls']/btn-group/label[text()='${tabName}']`);
  return this.click(locator);
};

TeamPage.prototype.clickResultsTab = function(tabName) {
  var locator = By.xpath(`.//div[@id='tableNFLTeamSummaryGameByGameZebraRadioControls']/btn-group/label[text()='${tabName}']`);
  return this.click(locator);
};

TeamPage.prototype.clickRankTab = function(tabName) {
  var locator = By.xpath(`.//div[@id='tableTeamOverviewRankRadioControls']/btn-group/label[text()='${tabName}']`);
  return this.click(locator);
};

/****************************************************************************
** Summary
*****************************************************************************/
TeamPage.prototype.getSummaryRosterTableStat = function(rowNum, colNum) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamSummaryContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[${colNum}]`);
  return this.getText(locator);
};

TeamPage.prototype.getSummaryStatsTableStat = function(rowNum, colNum) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamSummaryStatsContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[${colNum}]`);
  return this.getText(locator);
};

/****************************************************************************
** Game Log
*****************************************************************************/
TeamPage.prototype.clickGameLogTableHeaderFor = function(colName) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamGameLogContainer']/table/thead/tr/th[text()="${colName}"]`);
  return this.click(locator);
};

TeamPage.prototype.getGameLogTableStatsFor = function(colName) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamGameLogContainer']/table/tbody/tr[@data-tmn-row-type='row']/td[count(//div[@id='tableFootballTeamGameLogContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getTextArray(locator);
};

TeamPage.prototype.getGameLogTableStatFor = function(rowNum, colName) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamGameLogContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[count(//div[@id='tableFootballTeamGameLogContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getText(locator);
};

TeamPage.prototype.clickGameLogTableStatFor = function(rowNum, colName) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamGameLogContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[count(//div[@id='tableFootballTeamGameLogContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]/span`);
  return this.click(locator);
};

/****************************************************************************
** Play by Play
*****************************************************************************/
TeamPage.prototype.clickPlayByPlayPossessionTab = function(possession) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamPlayByPlayRadioControls']/btn-group/label[text()='${possession}']`);
  return this.click(locator);
};

TeamPage.prototype.clickPlayByPlayVideoIcon = function(playNum) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamPlayByPlayContainer']/table/tbody/tr[@data-tmn-row-type='row'][${playNum}]/td/tmn-video-icon`);
  return this.click(locator);
};

TeamPage.prototype.getPlayByPlayTableStat = function(rowNum, colNum) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamPlayByPlayContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[${colNum}]`);
  return this.getText(locator);
};

/****************************************************************************
** Occurrences & Streaks
*****************************************************************************/
TeamPage.prototype.getStreaksTableHeader = function(col) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamStreaksContainer']/table/thead/tr/th[${col}]`);
  return this.getText(locator);
};

TeamPage.prototype.getStreaksTableStat = function(row, col) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamStreaksContainer']/table/tbody/tr[@data-tmn-row-type='row'][${row}]/td[${col}]`);
  return this.getText(locator);
};

/****************************************************************************
** Splits
*****************************************************************************/
TeamPage.prototype.getSplitsTableHeaderText = function(headerNum) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamSplitsContainer']/table/tbody/tr[@class='sectionHeader'][${headerNum}]/td[1]`);
  return this.getText(locator);
};

TeamPage.prototype.getSplitsTableStat = function(row, col) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamSplitsContainer']/table/tbody/tr[@data-tmn-row-type='row'][${row}]/td[${col}]`);
  return this.getText(locator);
};

TeamPage.prototype.getSplitsTableStatFor = function(rowNum, colName) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamSplitsContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[count(//div[@id='tableFootballTeamSplitsContainer']/table/tbody/tr[1]/td[text()="${colName}"]/preceding-sibling::td)+1]`);
  return this.getText(locator);
};

/****************************************************************************
** Roster
*****************************************************************************/
TeamPage.prototype.clickRosterTableHeaderFor = function(colName) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamRosterContainer']/table/thead/tr/th[text()="${colName}"]`);
  return this.click(locator);
};

TeamPage.prototype.clickRosterTableStatFor = function(rowNum, colName) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamRosterContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[count(//div[@id='tableFootballTeamRosterContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]/span`);
  return this.click(locator);
};

TeamPage.prototype.getRosterTableStatsFor = function(colName) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamRosterContainer']/table/tbody/tr[@data-tmn-row-type='row']/td[count(//div[@id='tableFootballTeamRosterContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getTextArray(locator);
};

TeamPage.prototype.getRosterTableStatFor = function(rowNum, colName) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamRosterContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[count(//div[@id='tableFootballTeamRosterContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getText(locator);
};

TeamPage.prototype.getRosterTableHeader = function(colNum) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamRosterContainer']/table/thead/tr/th[${colNum}]`);
  return this.getText(locator);
};

TeamPage.prototype.getRosterTableBgColorFor = function(rowNum, colName) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamRosterContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[count(//div[@id='tableFootballTeamRosterContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getCssValue(locator, "background-color");
};

/****************************************************************************
** Multi-Filter
*****************************************************************************/
TeamPage.prototype.getMultiFilterTableStatFor = function(rowNum, colName) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamMultiFilterContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[count(//div[@id='tableFootballTeamMultiFilterContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getText(locator);
};

TeamPage.prototype.clickMultiFilterTableStatFor = function(rowNum, colName) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamMultiFilterContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[count(//div[@id='tableFootballTeamMultiFilterContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]/span`);
  return this.click(locator);
};

/****************************************************************************
** Play Card
*****************************************************************************/
TeamPage.prototype.waitForPlayCardPageLoad = function() {
  var locator = By.css("tmn-football-scoreboard > paper-material > .tmn-football-scoreboard");
  this.waitUntilStaleness(locator, 5000);
  return this.waitForEnabled(locator, 5000);
};

TeamPage.prototype.getPlayCardPersonnel = function(homeOrAway) {
  var d = Promise.defer();
  var homeLocator = By.css(".tmn-football-scoreboard.home .personnel");
  var awayLocator = By.css(".tmn-football-scoreboard.away .personnel");

  var locator = homeOrAway == 'home' ? homeLocator : awayLocator;
  this.getText(locator).then(function(stat) {
    d.fulfill(stat.split('Personnel: ')[1]);
  })
  return d.promise;
};

TeamPage.prototype.getPlayCardQuarter = function() {
  var locator = By.css(".tmn-football-scoreboard.quarter");
  return this.getText(locator);
};

TeamPage.prototype.getPlayCardTime = function() {
  var locator = By.css(".tmn-football-scoreboard.clock");
  return this.getText(locator);
};

TeamPage.prototype.getPlayCardPlayResult = function() {
  var locator = By.css(".tmn-football-scoreboard.desc");
  return this.getText(locator);
};

TeamPage.prototype.clickPlayCardPlay = function(playNum) {
  var locator = By.xpath(`.//div[@id='items']/paper-item[${playNum}]`);
  return this.click(locator);
};

TeamPage.prototype.togglePlayCardShowPaths = function() {
  var locator = By.css("#show-paths #toggleButton");
  return this.click(locator);
};

TeamPage.prototype.togglePlayCardShowResult = function() {
  var locator = By.css("#show-result #toggleButton");
  return this.click(locator);
};

TeamPage.prototype.getPlayCardNumPlayers = function() {
  var locator = By.css("svg path.startingPoint");
  return this.getElementCount(locator);
};

TeamPage.prototype.getPlayCardNumPaths = function() {
  var locator = By.css("svg path.line[stroke-width='2']");
  return this.getElementCount(locator);
};

TeamPage.prototype.clickPlayCardJumpToSnap = function() {
  var locator = By.css("paper-button#jump-to-snap");
  return this.click(locator);
};

TeamPage.prototype.clickPlayCardJumpToThrow = function() {
  var locator = By.css("paper-button#jump-to-throw");
  return this.click(locator);
};

TeamPage.prototype.clickPlayCardJumpToCatch = function() {
  // TODO - seems like a bug with the id & class
  // var locator = By.css("paper-button#jump-to-catch");
  var locator = By.css("paper-button.toggleButtons");
  return this.click(locator);
};

TeamPage.prototype.clickPlayCardJumpToEnd = function() {
  var locator = By.css("paper-button#jump-to-end");
  return this.click(locator);
};

TeamPage.prototype.getPlayCardPlayerLocation = function(playerNum) {
  var locator = By.css(`g.football-field-chart > g.point:nth-of-type(${playerNum}) > path.startingPoint`);
  return this.getAttribute(locator, 'transform');
};

TeamPage.prototype.getPlayCardPlayTime = function() {
  var locator = By.css("#timeLabel > span");
  return this.getText(locator);
};

TeamPage.prototype.clickPlayCardTimeSlider = function(xOffset) {
  var locator = By.css('#sliderBar');
  return this.clickOffset(locator, xOffset, 0)
};

TeamPage.prototype.hoverOverPlayCardPlayer = function(playerNum) {
  var thiz = this;
  var locator = By.css(`g.football-field-chart > g.point:nth-of-type(${playerNum}) > path.startingPoint`);
  this.driver.findElement(locator).then(function(elem) {
    thiz.driver.actions().mouseMove(elem).perform();
    thiz.driver.sleep(5000);
  });
};

TeamPage.prototype.getPlayCardTooltip = function() {
  var locator = By.css('.d3-tip');
  return this.getText(locator);
};

TeamPage.prototype.getPlayCardParticipationTableBgColor = function(playerNum) {
  var locator = By.xpath(`.//table[contains(@class, 'football-participation-table')]/tbody/tr[contains(@class, 'playerRowDefense') or contains(@class, 'playerRowOffense')][${playerNum}]/td[1]`);
  return this.getCssValue(locator, 'background-color');
};

TeamPage.prototype.clickPlayCardParticipationTablePlayer = function(playerNum) {
  var locator = By.xpath(`.//table[contains(@class, 'football-participation-table')]/tbody/tr[contains(@class, 'playerRowDefense') or contains(@class, 'playerRowOffense')][${playerNum}]/td[1]`);
  return this.click(locator);
};

TeamPage.prototype.getPlayCardParticipationTablePlayerAction = function(playerNum) {
  var locator = By.xpath(`.//table[contains(@class, 'football-participation-table')]/tbody/tr[contains(@class, 'playerRowDefense') or contains(@class, 'playerRowOffense')][${playerNum}]/td[3]`);
  return this.getText(locator);
};

TeamPage.prototype.isPlayCardTackleDisplayed = function() {
  var locator = By.css('g.football-field-chart > path.point');
  return this.isDisplayed(locator, 500);
};

TeamPage.prototype.isPlayCardPassPathDisplayed = function() {
  var locator = By.css('g.football-field-chart > path.line:last-child');
  return this.isDisplayed(locator, 500);
};

TeamPage.prototype.isPlayCardIncompletePassDisplayed = function() {
  var locator = By.css("g.point > circle[r='7.4834905660377355']");
  return this.isDisplayed(locator, 500);
};

TeamPage.prototype.clickPlayCardFindSimilarPreSnapBtn = function() {
  var locator = By.xpath(".//paper-button[span[text()='Find Similar Pre-Snap']]");
  this.click(locator);
  return this.waitForEnabled(PLAY_CARD_MODAL_TABLE);
};

TeamPage.prototype.clickPlayCardFindSimilarPassBtn = function() {
  var locator = By.xpath(".//paper-button[span[text()='Find Similar - Pass']]");
  this.click(locator);
  return this.waitForEnabled(PLAY_CARD_MODAL_TABLE);
};

TeamPage.prototype.clickPlayCardVideoBtn = function() {
  var locator = By.xpath(".//paper-button[span[text()='Play Video']]");
  this.click(locator);
  return this.waitForEnabled(PLAY_CARD_MODAL_TABLE);
};

TeamPage.prototype.getPlayCardModalPlayCount = function() {
  var locator = By.xpath(".//div[@id='tableFootballFindSimilarPlayByPlayStandaloneTableModalContainer']/table/tbody/tr");
  return this.getElementCount(locator);
};

/****************************************************************************
** Game Day Participation
*****************************************************************************/
TeamPage.prototype.getGameDayTableStatFor = function(rowNum, colName) {
  var locator = By.xpath(`.//table[contains(@class, 'personnelGroupsTable')]/tbody/tr[contains(@class, 'top-level')][${rowNum}]/td[count(//table[contains(@class, 'personnelGroupsTable')]/tbody/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getText(locator);
};

TeamPage.prototype.clickGameDayTableStatFor = function(rowNum, colName) {
  var locator = By.xpath(`.//table[contains(@class, 'personnelGroupsTable')]/tbody/tr[contains(@class, 'top-level')][${rowNum}]/td[count(//table[contains(@class, 'personnelGroupsTable')]/tbody/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.click(locator);
};

TeamPage.prototype.getGameDayExpandedTableStat = function(rowNum, colNum) {
  var locator = By.xpath(`.//table[contains(@class, 'personnelGroupsTable')]/tbody/tr[contains(@class,'expand-level')][${rowNum}]/td[${colNum}]`);
  return this.getText(locator);
};

TeamPage.prototype.toggleGameDayShowPercentageBtn = function() {
  var locator = By.css("paper-toggle-button .toggle-button");
  return this.click(locator);
}


module.exports = TeamPage;