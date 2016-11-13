'use strict';

// Load Base Page
var BasePage = require('../../../pages/base/base_page.js');

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;
var Key = require('selenium-webdriver').Key;

// Locators
var TEAM_NAME = By.css('h1.name');
var SECTION_LINK_NUM = {
  'batting': 1,
  'pitching': 2,
  'catching': 3,
  'statcastFielding': 4
}
var REPORT_SELECT = {
  'batting': By.id('s2id_reportNavBaseballTeamStatBatting'),
  'pitching': By.id('s2id_reportNavBaseballTeamStatPitching'),
  'catching': By.id('s2id_reportNavBaseballTeamStatTeamcatching'),
  'statcastFielding': By.id('s2id_reportNavBaseballTeamStatTeamstatcast')
}
var DROPDOWN_INPUT = By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input");

// Occurences & Streaks
var STREAK_TYPE_SELECT = By.id('s2id_pageControlBaseballStrkType');
var CONSTRAINT_COMPARE_SELECT = By.id('s2id_pageControlBaseballStrkConstraintCompare');
var CONSTRAINT_VALUE_INPUT = By.id('pageControlBaseballStrkConstraintValue');

var STREAK_GROUPING_SELECT = By.id('s2id_pageControlBaseballStrkGrouping');
var STREAK_SCOPE_SELECT = By.id('s2id_pageControlBaseballStrkScope');
var UPDATE_CONSTRAINTS_BUTTON = By.id('pageControlBaseballStrkBtnUpdate');

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
var TYPEAHEAD_SUGGESTION_BOX = By.css('.tt-suggestions');

// Matchups
var INLINE_VIDEO_PLAYLIST_HEADER = By.css('h5.video-inline-header-txt');
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

function TeamPage(driver) {
  BasePage.call(this, driver);
  this.section = 'batting'
};

TeamPage.prototype = Object.create(BasePage.prototype);
TeamPage.prototype.constructor = TeamPage;

// after going to new section, need to wait for the page to be fully loaded
// last thing to update appears to be the report select for each page
TeamPage.prototype.goToSection = function(section) {
  this.section = section;
  var section = By.xpath(`.//nav[contains(@class, 'navbar-blue')]/.//li[${SECTION_LINK_NUM[this.section]}]/a`);
  this.click(section);
  return this.waitForEnabled(REPORT_SELECT[this.section]);
}

TeamPage.prototype.goToSubSection = function(subSection) {
  var locator = By.xpath(`.//nav[contains(@class, 'report-nav')]/.//a[text()='${subSection}']`);
  return this.click(locator);
}

TeamPage.prototype.getTeamName = function() {
  return this.getText(TEAM_NAME, 30000);
}

TeamPage.prototype.changeReport = function(report) {
  this.changeDropdown(REPORT_SELECT[this.section], DROPDOWN_INPUT, report);
  return this.waitForEnabled(REPORT_SELECT[this.section]);
};

// Game Log Page
TeamPage.prototype.getGameLogTableStat = function(gameNum, col) {
  var row = gameNum + 5;
  var locator = By.xpath(`.//div[@id='tableBaseballTeamGameLogContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator, 30000);
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
TeamPage.prototype.changeMainConstraint = function(streakType, constraintCompare, constraintValue, constraintStat, streakGrouping, streakScope) {
  this.changeDropdown(STREAK_TYPE_SELECT, DROPDOWN_INPUT, streakType);
  this.changeDropdown(CONSTRAINT_COMPARE_SELECT, DROPDOWN_INPUT, constraintCompare);
  this.clear(CONSTRAINT_VALUE_INPUT)
  this.sendKeys(CONSTRAINT_VALUE_INPUT, constraintValue);
  this.changeDropdown(CONSTRAINT_STAT_SELECT[this.section], DROPDOWN_INPUT, constraintStat);
  this.changeDropdown(STREAK_GROUPING_SELECT, DROPDOWN_INPUT, streakGrouping);
  this.changeDropdown(STREAK_SCOPE_SELECT, DROPDOWN_INPUT, streakScope);
  return this.click(UPDATE_CONSTRAINTS_BUTTON);
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
    
    this.waitUntilStaleness(imageLocator);
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
  this.clear(locator);
  this.sendKeys(locator, name); 
  return this.click(TYPEAHEAD_SUGGESTION_BOX);
};

TeamPage.prototype.getCompTableStat = function(rowNum, col) {
  var locator = By.xpath(`.//div[@id='tableBaseballCompContainer']/table/tbody/tr[${rowNum}]/td[${col}]`);
  return this.getText(locator, 10000);
};

// Matchups
TeamPage.prototype.getMatchupsCurrentVideoHeader = function() {
  return this.getText(INLINE_VIDEO_PLAYLIST_HEADER, 10000);
}

TeamPage.prototype.getMatchupsVideoText = function(videoNum, lineNum) {
  var locator = By.xpath(`.//div[@id='${MATCHUPS_VIDEO_TEXT_TABLE_ID[this.section]}']/.//a[@class='list-group-item'][${videoNum}]/div[${lineNum}]`);
  return this.getText(locator, 10000);
};

TeamPage.prototype.getMatchupsAtBatHeaderText = function(atBatNum) {
  this.waitUntilStaleness(AT_BAT_TABLE, 30000)
  var locator = By.xpath(`.//div[@id='${MATCHUPS_AT_BAT_TABLE_ID[this.section]}']/table/tbody/tr[@class='sectionHeaderAlt sectionStartOfBat'][${atBatNum}]/td`);
  return this.getText(locator, 30000);
};

TeamPage.prototype.clickPitchVideoIcon = function(pitchNum) {
  var locator = By.xpath(`.//div[@id='${MATCHUPS_AT_BAT_TABLE_ID[this.section]}']/table/tbody/tr[contains(@data-tmn-row-type,'row')][${pitchNum}]/td[1]/i[@class='fa fa-film pull-left film-icon']`);
  return this.click(locator);
}

// Vs Teams/Pitchers
TeamPage.prototype.getVsTableStat = function(rowNum, col) {
  this.waitUntilStaleness(VS_TABLE, 5000)
  var locator = By.xpath(`.//div[@id='tableBaseballTeamStatsContainer']/table/tbody/tr[${rowNum}]/td[${col}]`);
  return this.getText(locator, 10000);
};


module.exports = TeamPage;