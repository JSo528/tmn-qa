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
var statcastWidgets = require('../mixins/statcastWidgets.js');

/****************************************************************************
** Locators
*****************************************************************************/
var TEAM_NAME = By.css('h1.name');
var SECTION_LINK_NUM = {
  'batting': 1,
  'pitching': 2,
  'catching': 3,
  'statcastFielding': 4
}

var SUB_SECTION_TITLE = {
  'overview': 'Overview',
  'roster': 'Roster',
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
}

var REPORT_SELECT = {
  'batting': By.id('s2id_reportNavBaseballTeamStatBatting'),
  'pitching': By.id('s2id_reportNavBaseballTeamStatPitching'),
  'catching': By.id('s2id_reportNavBaseballTeamStatTeamcatching'),
  'statcastFielding': By.id('s2id_reportNavBaseballTeamStatTeamstatcast')
}

var VISUAL_MODE_SELECT = By.id('s2id_pageControlBaseballVisMode');

var DROPDOWN_INPUT = By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input");

// Overview
var OVERVIEW_HEAT_MAP_ID = 'teamHeatMap';
var OVERVIEW_PITCH_VIEW_ID = 'teamPitchChart';
var HEAT_MAP_LINK = By.id('visualBaseballHeatMapTeam');
var PITCH_VIEW_LINK = By.id('visualBaseballPitchChartTeamBatter');

// Catcher Overview
var LEFT_CATCHING_HEATMAP_ID = 'teamHeatMapLefty';
var RIGHT_CATCHING_HEATMAP_ID = 'teamHeatMapRighty';

// StatcastFielding Overview
var BALLPARK_IMAGE = By.css('.field-container svg g');
var BALLPARK_SELECT = By.css('tmn-ballpark-selector select');

// Roster
var ROSTER_TABLE_ID = {
  'batting': 'tableBaseballTeamStatsRosterBattingContainer',
  'pitching': 'tableBaseballTeamStatsRosterPitchingContainer',
  'catching': 'tableBaseballTeamStatsRosterCatchingContainer',
  'statcastFielding': 'tableBaseballTeamStatsRosterContainer'
}

var ON_TEAM_SELECT = By.id("s2id_pageControlBaseballRosterOnTeam");

// Pitch Logs
var BY_INNING_TABLE_ID = {
  'batting': 'tableBaseballTeamPitchLogBattingContainer',
  'pitching': 'tableBaseballTeamPitchLogPitchingContainer',
  'catching': 'tableBaseballTeamPitchLogCatchingContainer',
  'statcastFielding': 'tableBaseballTeamPitchLogStatcastContainer'
}

var FLAT_VIEW_TABLE_ID = {
  'batting': 'tableBaseballTeamPitchTableBattingContainer',
  'pitching': 'tableBaseballTeamPitchTablePitchingContainer',
  'catching': 'tableBaseballTeamPitchTableCatchingContainer',
  'statcastFielding': 'tableBaseballTeamPitchTableStatcastContainer'
}

// Occurences & Streaks
var STREAK_GROUPING_SELECT = By.id('s2id_pageControlBaseballStrkGrouping');
var CONSTRAINT_STAT_SELECT = {
  'batting': By.id('s2id_pageControlBaseballStrkConstraintStat'),
  'pitching': By.id('s2id_pageControlBaseballStrkConstraintStatPitching'),
  'catching': By.id('s2id_pageControlBaseballStrkConstraintStatCatching')
  // 'statcastFielding': 
}

// Multi-Filter
var TOP_HEATMAP_ID = 'teamHeatMapMultiFilter1';
var BOTTOM_HEATMAP_ID = 'teamHeatMapMultiFilter2';

var TOP_HIT_CHART_ID = 'hitChartMultiFilter1';
var BOTTOM_HIT_CHART_ID = 'hitChartMultiFilter2';

var VISUAL_MODE_TOP_SELECT = By.id('s2id_pageControlBaseballVisMode');
var VISUAL_MODE_BOTTOM_SELECT = By.id('s2id_pageControlBaseballVisMode2');

// Comps
var COMP_SEARCH_1_INPUT = By.css('#compSearch1 input');
var COMP_SEARCH_2_INPUT = By.css('#compSearch2 input');
var COMP_CONTAINER = By.id('tableBaseballCompContainer');

// Matchups
var MATCHUPS_AT_BAT_TABLE_ID = {
  'batting': 'tableBaseballTeamPitchLogBattingVidMatchupContainer',
  'pitching': 'tableBaseballTeamPitchLogPitchingVidMatchupContainer'
}

var MATCHUPS_VIDEO_TEXT_TABLE_ID = {
  'batting': 'videoInlinetableBaseballTeamPitchLogBattingVidMatchupModal',
  'pitching': 'videoInlinetableBaseballTeamPitchLogPitchingVidMatchupModal'
}

// Vs Teams/Players
var AT_BAT_TABLE = By.xpath('.//div[@id="tableBaseballTeamPitchLogBattingContainer"]/table')
var VS_TABLE = By.xpath('.//div[@id="tableBaseballTeamStatsContainer"]/table')

/****************************************************************************
** Constructor
*****************************************************************************/
function TeamPage(driver, section, subSection) {
  BasePage.call(this, driver);
  this.section = 'batting';
  this.subSection = 'overview';
};

TeamPage.prototype = Object.create(BasePage.prototype);
TeamPage.prototype.constructor = TeamPage;

// Mixins
_.extend(TeamPage.prototype, videoPlaylist); // Matchups
_.extend(TeamPage.prototype, occurrencesAndStreaks);
_.extend(TeamPage.prototype, hitChartFunctions());
_.extend(TeamPage.prototype, statcastWidgets);


/****************************************************************************
** Controls
*****************************************************************************/
// after going to new section, need to wait for the page to be fully loaded
// last thing to update appears to be the report select for each page
TeamPage.prototype.goToSection = function(section) {
  this.section = section;
  var section = By.xpath(`.//nav[contains(@class, 'navbar-blue')]/.//li[${SECTION_LINK_NUM[this.section]}]/a`);
  this.click(section);
  return this.waitForEnabled(REPORT_SELECT[this.section], 30000);
}

TeamPage.prototype.goToSubSection = function(subSection) {
  this.subSection = subSection
  var locator = By.xpath(`.//nav[contains(@class, 'report-nav')]/.//a[text()='${SUB_SECTION_TITLE[subSection]}']`);
  return this.click(locator);
}

TeamPage.prototype.getTeamName = function() {
  return this.getText(TEAM_NAME, 30000);
}

TeamPage.prototype.changeReport = function(report) {
  this.changeDropdown(REPORT_SELECT[this.section], DROPDOWN_INPUT, report);
  return this.waitForEnabled(REPORT_SELECT[this.section], 30000);
};

TeamPage.prototype.changeVisualMode = function(mode) { 
  this.click(VISUAL_MODE_SELECT);
  var locator = By.xpath(`.//ul[@id='select2-results-1']/li/div[text()='${mode}']`);
  return this.click(locator)
};

TeamPage.prototype.waitForTableToLoad = function() {
  this.waitUntilStaleness(this.statsTable(), 10000);
  return this.waitForEnabled(this.statsTable(), 10000);
};
 
/****************************************************************************
** Overview
*****************************************************************************/
TeamPage.prototype.getOverviewTableStat = function(col) {
  var locator = By.xpath(`.//div[@id='tableBaseballTeamStatsOverviewContainer']/table/tbody/tr[4]/td[${col}]`);
  return this.getText(locator, 30000);
};

TeamPage.prototype.clickOverviewTableStat = function(col) {
  var locator = By.xpath(`.//div[@id='tableBaseballTeamStatsOverviewContainer']/table/tbody/tr[4]/td[${col}]/span`);
  return this.click(locator);
};

TeamPage.prototype.drawBoxOnOverviewHeatMap = function(x,y,width,height) {
  return this.drawBoxOnHeatMap(x,y,width,height, OVERVIEW_HEAT_MAP_ID);
};

TeamPage.prototype.clearOverviewHeatMap = function(x,y,width,height) {
  return this.clearHeatMap(OVERVIEW_HEAT_MAP_ID);
};

TeamPage.prototype.getOverviewHeatMapPitchCount = function() {
  return this.getHeatMapPitchCount(OVERVIEW_HEAT_MAP_ID);
};

TeamPage.prototype.getOverviewHeatMapImageTitle = function() {
  return this.getHeatMapImageTitle(OVERVIEW_HEAT_MAP_ID);
};

TeamPage.prototype.getOverviewPitchViewPitchCount = function() {
  return this.getPitchViewPitchCount(OVERVIEW_PITCH_VIEW_ID);
};

TeamPage.prototype.clickHeatMapLink = function() {
  return this.click(HEAT_MAP_LINK);
};

TeamPage.prototype.clickPitchViewLink = function() {
  return this.click(PITCH_VIEW_LINK);
};

TeamPage.prototype.clickOverviewPitchViewPlotPoint = function() {
  return this.clickPitchViewPlotPoint(OVERVIEW_PITCH_VIEW_ID);
};

// Catcher
TeamPage.prototype.drawBoxOnCatcherHeatMap = function(leftOrRight, x, y, width, height) {
  var locator = (leftOrRight == 'left') ? LEFT_CATCHING_HEATMAP_ID : RIGHT_CATCHING_HEATMAP_ID;
  return this.drawBoxOnHeatMap(x,y,width,height,locator)
};

TeamPage.prototype.clearCatcherHeatMap = function(leftOrRight) {
  var locator = (leftOrRight == 'left') ? LEFT_CATCHING_HEATMAP_ID : RIGHT_CATCHING_HEATMAP_ID;
  return this.clearHeatMap(locator, locator);
};

// StatcastFielding
TeamPage.prototype.getStatcastFieldingModalTableStat = function(row, col) {
  var locator = By.xpath(`.//div[@id='tableBaseballPlayerTeamPitchLogBattingModalStandaloneWithVideoContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator, 30000);
};

TeamPage.prototype.clickStatcastFieldingChartEvent = function(eventNum) {
  var d = Promise.defer();
  var locator = By.css('statcast-fielding-chart .bin-events path');
  
  driver.findElements(locator).then(function(elements) {
    d.fulfill(elements[eventNum].click());
  });

  return d.promise;
};

TeamPage.prototype.closeStatcastFieldingModal = function() {
  var locator = By.css('#tableBaseballPlayerTeamPitchLogBattingModalStandaloneWithVideoId button');
  var element = driver.findElement(locator);
  return element.click();
};

TeamPage.prototype.changeBallparkDropdown = function(ballpark) {
  this.click(BALLPARK_SELECT);
  var optionLocator = By.xpath(`.//tmn-ballpark-selector/select/option[text()="${ballpark}"]`);
  this.click(optionLocator);

  return this.waitUntilStaleness(BALLPARK_IMAGE, 30000);
}

TeamPage.prototype.getCurrentBallparkImageID = function() {
  var d = Promise.defer();

  this.driver.findElements(BALLPARK_IMAGE).then(function(elements) {
    elements[0].getAttribute('id').then(function(id) {
      d.fulfill(id);
    });
  });
  return d.promise;
};


/****************************************************************************
** Roster
*****************************************************************************/
TeamPage.prototype.getRosterTableStat = function(playerNum, col) {
  // First 3 rows are for the headers
  var row = playerNum + 3;
  var locator = By.xpath(`.//div[@id='${ROSTER_TABLE_ID[this.section]}']/table/tbody/tr[${row}]/td[${col}]`);

  return this.getText(locator, 30000);
};

TeamPage.prototype.clickRosterTableStat = function(playerNum, col) {
  // First 3 rows are for the headers
  var row = playerNum + 3;
  var locator = By.xpath(`.//div[@id='${ROSTER_TABLE_ID[this.section]}']/table/tbody/tr[${row}]/td[${col}]/span`);

  return this.click(locator);
};

TeamPage.prototype.changeOnTeamDropdown = function(report) {
  return this.changeDropdown(ON_TEAM_SELECT, DROPDOWN_INPUT, report);  
};

TeamPage.prototype.clickRosterTableColumnHeader = function(col) {
  var locator = By.xpath(`.//div[@id='${ROSTER_TABLE_ID[this.section]}']/table/thead/tr/th[${col}]`);
  return this.click(locator); 
};

TeamPage.prototype.getRosterTableStatsForCol = function(col) {
  var locator = By.xpath(`.//div[@id='${ROSTER_TABLE_ID[this.section]}']/table/tbody/tr[@data-tmn-row-type="row"]/td[${col}]`);
  return this.getTextArray(locator);
};

/****************************************************************************
** Game Log Page
*****************************************************************************/
TeamPage.prototype.getGameLogTableStat = function(gameNum, col) {
  var row = gameNum + 5;
  var locator = By.xpath(`.//div[@id='tableBaseballTeamGameLogContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator, 30000);
};

TeamPage.prototype.clickGameLogTableStat = function(gameNum, col) {
  var row = gameNum + 5;
  var locator = By.xpath(`.//div[@id='tableBaseballTeamGameLogContainer']/table/tbody/tr[${row}]/td[${col}]/span`);
  return this.click(locator);
};

TeamPage.prototype.clickGameLogTableColumnHeader = function(col) {
  var locator = By.xpath(`.//div[@id='tableBaseballTeamGameLogContainer']/table/thead/tr/th[${col}]`);
  return this.click(locator); 
};

TeamPage.prototype.getGameLogTableStatsForCol = function(col) {
  var locator = By.xpath(`.//div[@id='tableBaseballTeamGameLogContainer']/table/tbody/tr[@data-tmn-row-type="row"]/td[${col}]`);
  return this.getTextArray(locator);
};

/****************************************************************************
** Splits Page
*****************************************************************************/
TeamPage.prototype.getSplitsTableStat = function(rowNum, col) {
  var row = rowNum + 1;
  var locator = By.xpath(`.//div[@id='tableBaseballTeamSplitsContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator, 30000);
};

TeamPage.prototype.getSplitsTableHeaderText = function(headerNum) {
  var locator = By.xpath(`.//div[@id='tableBaseballTeamSplitsContainer']/table/tbody/tr[@class='sectionHeader'][${headerNum}]`);
  return this.getText(locator, 30000);
};

/****************************************************************************
** Occurrences & Steaks
*****************************************************************************/
TeamPage.prototype.constraintStatSelect = function() {
  return CONSTRAINT_STAT_SELECT[this.section];
};

TeamPage.prototype.streakGroupingSelect = function() {
  return STREAK_GROUPING_SELECT;
};

TeamPage.prototype.getStreaksTableStat = function(rowNum, col) {
  var row = rowNum + 1;
  var locator = By.xpath(`.//div[@id='tableBaseballTeamStreaksContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator, 30000);
};

TeamPage.prototype.getStreaksSectionHeaderText = function(headerNum) {
  var headerNum = headerNum || 1
  var locator = By.xpath(`.//div[@id='tableBaseballTeamStreaksContainer']/table/tbody/tr[@class='sectionHeader'][${headerNum}]`);
  return this.getText(locator, 30000);
};

/****************************************************************************
** Multi-Filter
*****************************************************************************/
TeamPage.prototype.drawBoxOnMultiFilterHeatMap = function(topOrBottom, x, y, width, height) {
  var heatmapID = (topOrBottom == 'top') ? TOP_HEATMAP_ID : BOTTOM_HEATMAP_ID;
  var hitChartID = (topOrBottom == 'top') ? TOP_HIT_CHART_ID : BOTTOM_HIT_CHART_ID
  var hitChartLocator = By.css(`#${hitChartID} svg`);
  return this.drawBoxOnHeatMap(x,y,width,height,heatmapID, hitChartLocator);
};

TeamPage.prototype.getMultiFilterStat = function(rowNum, col) {
  var locator = By.xpath(`.//div[@id='tableBaseballMultiFilterContainer']/table/tbody/tr[${rowNum}]/td[${col}]`);
  return this.getText(locator, 30000);
}

TeamPage.prototype.getMultiFilterHitChartHitCount = function(topOrBottom) {
  var hitChartID = (topOrBottom == 'top') ? TOP_HIT_CHART_ID : BOTTOM_HIT_CHART_ID;
  return this.getHitChartHitCount('all', hitChartID);
};

TeamPage.prototype.changeMultiFilterVisualMode = function(topOrBottom, type) {
  var locator = (topOrBottom == 'top') ? VISUAL_MODE_TOP_SELECT : VISUAL_MODE_BOTTOM_SELECT;
  return this.changeDropdown(locator, DROPDOWN_INPUT, type);
};

TeamPage.prototype.getMultiFilterHeatMapImageTitle = function(topOrBottom) {
  var locator = (topOrBottom == 'top') ? TOP_HEATMAP_ID : BOTTOM_HEATMAP_ID;
  return this.getHeatMapImageTitle(locator);
};

/****************************************************************************
** Comps
*****************************************************************************/
TeamPage.prototype.selectForCompSearch = function(compNum, name) {
  var locator = compNum == 1 ? COMP_SEARCH_1_INPUT : COMP_SEARCH_2_INPUT
  return this.selectFromSearch(locator, name, 1, COMP_CONTAINER)
};

TeamPage.prototype.getCompTableStat = function(rowNum, col) {
  var locator = By.xpath(`.//div[@id='tableBaseballCompContainer']/table/tbody/tr[${rowNum}]/td[${col}]`);
  return this.getText(locator, 30000);
};

/****************************************************************************
** Vs Teams/Pitchers
*****************************************************************************/
TeamPage.prototype.getVsTableStat = function(rowNum, col) {
  var locator = By.xpath(`.//div[@id='tableBaseballTeamStatsContainer']/table/tbody/tr[${rowNum}]/td[${col}]`);
  return this.getText(locator, 10000);
};

TeamPage.prototype.clickVsTableColumnHeader = function(col) {
  var locator = By.xpath(`.//div[@id='tableBaseballTeamStatsContainer']/table/thead/tr[1]/th[${col}]`);
  return this.click(locator);
};

TeamPage.prototype.getVsTableStatsForCol = function(col) {
  var locator = By.xpath(`.//div[@id='tableBaseballTeamStatsContainer']/table/tbody/tr[@data-tmn-row-type="row"]/td[${col}]`);
  return this.getTextArray(locator);
};

/****************************************************************************
** Data Comparison
*****************************************************************************/
TeamPage.prototype.statsTable = function() {
  var statsTables = {
    'overview': By.xpath(".//div[@id='tableBaseballTeamStatsOverviewContainer']/table"),
    'roster': By.xpath(`.//div[@id='${ROSTER_TABLE_ID[this.section]}']/table`),
    'gameLog': By.xpath(".//div[@id='tableBaseballTeamGameLogContainer']/table"),
    'splits': By.xpath(".//div[@id='tableBaseballTeamSplitsContainer']/table"),
    'pitchLog': By.xpath(`.//div[@id='${BY_INNING_TABLE_ID[this.section]}']/table/tbody/tr[position() <= 20]`),
    'matchups': By.xpath(`.//div[@id='${MATCHUPS_AT_BAT_TABLE_ID[this.section]}']/table`),
    'vsTeams': By.xpath(".//div[@id='tableBaseballTeamStatsContainer']/table"),
    'vsPitchers': By.xpath(".//div[@id='tableBaseballTeamStatsContainer']/table"),
    'vsHitters': By.xpath(".//div[@id='tableBaseballTeamStatsContainer']/table")
  };

  return statsTables[this.subSection];
};

module.exports = TeamPage;