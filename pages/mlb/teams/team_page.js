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

// Locators
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
var DROPDOWN_INPUT = By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input");

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
var HEATMAP_TOP = By.css('#teamHeatMapMultiFilter1 > svg');
var HEATMAP_BOTTOM = By.css('#teamHeatMapMultiFilter2 > svg');
var HEATMAP_IMAGE_TOP = By.css('#teamHeatMapMultiFilter1 #heatmapBg');
var HEATMAP_IMAGE_BOTTOM = By.css('#teamHeatMapMultiFilter2 #heatmapBg');
var CLOSE_HEATMAP_BOX_BUTTON_TOP = By.css('#hitChartMultiFilter1 > svg > text');
var CLOSE_HEATMAP_BOX_BUTTON_BOTTOM = By.css('#hitChartMultiFilter2 > svg > text');

var HIT_CHART_TOP = By.css('#hitChartMultiFilter1 > svg');
var HIT_PLOT_POINT_TOP = By.css('#hitChartMultiFilter1 > svg > circle.plotPoint');
var HIT_CHART_BOTTOM = By.css('#hitChartMultiFilter2 > svg');
var HIT_PLOT_POINT_BOTTOM = By.css('#hitChartMultiFilter2 > svg > circle.plotPoint');

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

// Overview
TeamPage.prototype.clickOverviewTableStat = function(col) {
  var locator = By.xpath(`.//div[@id='tableBaseballTeamStatsOverviewContainer']/table/tbody/tr[4]/td[${col}]/span`);
  return this.click(locator);
};


// Roster
TeamPage.prototype.getRosterTableStat = function(playerNum, col) {
  // First 3 rows are for the headers
  var row = playerNum + 3;
  var locator = By.xpath(`.//div[@id='${ROSTER_TABLE_ID[this.section]}']/table/tbody/tr[4]/td[${col}]`);

  return this.getText(locator, 30000);
};

TeamPage.prototype.clickRosterTableStat = function(playerNum, col) {
  // First 3 rows are for the headers
  var row = playerNum + 3;
  var locator = By.xpath(`.//div[@id='${ROSTER_TABLE_ID[this.section]}']/table/tbody/tr[4]/td[${col}]/span`);

  return this.click(locator);
};

TeamPage.prototype.changeOnTeamDropdown = function(report) {
  return this.changeDropdown(ON_TEAM_SELECT, DROPDOWN_INPUT, report);  
};

// Game Log Page
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

// Splits Page
TeamPage.prototype.getSplitsTableStat = function(rowNum, col) {
  var row = rowNum + 1;
  var locator = By.xpath(`.//div[@id='tableBaseballTeamSplitsContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator, 30000);
};

TeamPage.prototype.getSplitsTableHeaderText = function(headerNum) {
  var locator = By.xpath(`.//div[@id='tableBaseballTeamSplitsContainer']/table/tbody/tr[@class='sectionHeader'][${headerNum}]`);
  return this.getText(locator, 30000);
};

// Occurences & Steaks
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

// Multi-Filter
TeamPage.prototype.drawBoxOnHeatMap = function(topOrBottom, x, y, width, height) {
  var locator = (topOrBottom == 'top') ? HEATMAP_TOP : HEATMAP_BOTTOM;
  var imageLocator = (topOrBottom == 'top') ? HEATMAP_IMAGE_TOP : HEATMAP_IMAGE_BOTTOM;
  var element = driver.findElement(locator);
  driver.actions()
    .mouseMove(element, {x: x, y: y}) // start at (x,y)
    .mouseDown() // click down
    .mouseMove({x: width, y: height}) // move mouse width to the right and height downwards
    .mouseUp() // click up
    .perform();
    
    this.waitUntilStaleness(imageLocator, 10000);
    return this.waitForEnabled(imageLocator)
};

TeamPage.prototype.getMultiFilterStat = function(rowNum, col) {
  var locator = By.xpath(`.//div[@id='tableBaseballMultiFilterContainer']/table/tbody/tr[${rowNum}]/td[${col}]`);
  return this.getText(locator, 30000);
}

TeamPage.prototype.getHitChartHitCount = function(topOrBottom) {
  var d = Promise.defer();
  var hitChartLocator = (topOrBottom == 'top') ? HIT_CHART_TOP : HIT_CHART_BOTTOM;
  var hitPlotPointLocator = (topOrBottom == 'top') ? HIT_PLOT_POINT_TOP : HIT_PLOT_POINT_BOTTOM;

  this.waitForEnabled(hitChartLocator);
  this.getElementCount(hitPlotPointLocator).then(function(count) {
    d.fulfill(count);
  });

  return d.promise;
};

TeamPage.prototype.changeVisualMode = function(topOrBottom, type) {
  var locator = (topOrBottom == 'top') ? VISUAL_MODE_TOP_SELECT : VISUAL_MODE_BOTTOM_SELECT;
  return this.changeDropdown(locator, DROPDOWN_INPUT, type);
};

TeamPage.prototype.getHeatMapImageTitle = function(topOrBottom) {
  var d = Promise.defer();
  var locator = (topOrBottom == 'top') ? HEATMAP_IMAGE_TOP : HEATMAP_IMAGE_BOTTOM;

  this.getAttribute(locator, 'href').then(function(href) {
    d.fulfill(href.match(/(%5B).{2,20}(%5D.+from)/)[0].replace(/(%5B|%5D.+)/g, '').replace(/(%25)/g, '%'));
  });

  return d.promise;
};

// Comps
TeamPage.prototype.selectForCompSearch = function(compNum, name) {
  var locator = compNum == 1 ? COMP_SEARCH_1_INPUT : COMP_SEARCH_2_INPUT
  return this.selectFromSearch(locator, name, 1, COMP_CONTAINER)
};

TeamPage.prototype.getCompTableStat = function(rowNum, col) {
  var locator = By.xpath(`.//div[@id='tableBaseballCompContainer']/table/tbody/tr[${rowNum}]/td[${col}]`);
  return this.getText(locator, 30000);
};

// Vs Teams/Pitchers
TeamPage.prototype.getVsTableStat = function(rowNum, col) {
  var locator = By.xpath(`.//div[@id='tableBaseballTeamStatsContainer']/table/tbody/tr[${rowNum}]/td[${col}]`);
  return this.getText(locator, 10000);
};

// Data Comparison
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