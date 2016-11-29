'use strict';

// Load Base Page
var BasePage = require('../../../pages/base/base_page.js');

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;
var Key = require('selenium-webdriver').Key;

// Locators
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

// OVERVIEW PAGE
var OVERVIEW_TABLE_ID = {
  'batting': 'tableBaseballPlayerStatsOverviewContainer',
  'pitching': 'tableBaseballPlayerStatsOverviewContainer',
  'catching': 'tableBaseballPlayerStatsOverviewCatchingContainer',
  'statcastFielding': 'tableBaseballPlayerStatsOverviewStatcastContainer'
};

// eBIS MODAL
var EBIS_MODAL_BUTTON = By.id('ebisModalButton');
var CLOSE_EBIS_MODAL_BUTTON = By.css('#ebisModal .modal-footer button');

// HEAT MAP
var HEATMAP = By.css('#playerHeatMap > svg');
var HEATMAP_IMAGE = By.id('heatmapBg');
var CLOSE_HEATMAP_BOX_BUTTON = By.css('#playerHeatMap > svg > text');
var HEAT_MAP_PITCH = By.css('#playerHeatMap circle.heat-map-ball');
var HEAT_MAP_LINK = By.id('visualBaseballHeatMapPlayer');
var PITCH_VIEW_LINK = {
  'batting': By.id('visualBaseballPitchChartPlayer'),
  'pitching': By.id('visualBaseballPitchChartPlayerPitcher')
};
var PITCH_VIEW_PITCH = By.css('.pitch-chart circle.pitch-chart-ball');

// HIT CHART
var HIT_CHART = By.css('#hitChart > svg');
var HIT_PLOT_POINT = By.css('#hitChart > svg > circle.plotPoint');
var HIT_TYPE = {
  'single': By.css('#hitChart > svg > circle.plotPoint[fill="rgba(255,255,255,1)"]'),
  'double': By.css('#hitChart > svg > circle.plotPoint[fill="rgba(0,0,255,1)"]'),
  'triple': By.css('#hitChart > svg > circle.plotPoint[fill="rgba(128,0,128,1)"]'),
  'homeRun': By.css('#hitChart > svg > circle.plotPoint[fill="rgba(255,0,0,1)"]'),
  'roe': By.css('#hitChart > svg > circle.plotPoint[fill="rgba(255,255,0,1)"]'),
  'out': By.css('#hitChart > svg > circle.plotPoint[fill="rgba(128,128,128,1)"]'),
  'all': By.css('#hitChart > svg > circle.plotPoint')
};

// PLAYER GRID
var PLAYER_GRID = By.css('#playerGrid > svg');
var PLAYER_GRID_PITCH = By.css('#playerGrid circle.heat-map-ball');
var GRID_MODE_SELECT = By.id('s2id_pageControlBaseballGridMode');
var GRID_IMAGE = By.css('#playerGrid #heatmapBg')

// VISUAL MODE
var VISUAL_MODE_SELECT = By.id('s2id_pageControlBaseballVisMode');
var DROPDOWN_INPUT = By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input");

// PITCH LOGS
var BY_INNING_TAB = By.xpath(".//div[@id='reportTabsSection0']/.//li[1]/a");
var FLAT_VIEW_TAB = By.xpath(".//div[@id='reportTabsSection0']/.//li[2]/a");

var BY_INNING_TABLE_ID = {
  'batting': 'tableBaseballPlayerPitchLogBattingContainer',
  'pitching': 'tableBaseballPlayerPitchLogPitchingContainer',
  'catching': 'tableBaseballPlayerPitchLogCatchingContainer',
  'statcastFielding': 'tableBaseballPlayerPitchLogStatcastContainer'
}

var FLAT_VIEW_TABLE_ID = {
  'batting': 'tableBaseballPlayerPitchTableBattingContainer',
  'pitching': 'tableBaseballPlayerPitchTablePitchingContainer',
  'catching': 'tableBaseballPlayerPitchTableCatchingContainer',
  'statcastFielding': 'tableBaseballPlayerPitchTableStatcastContainer'
}

// OCCURENCES & STREAKS
var STREAK_TYPE_SELECT = By.id('s2id_pageControlBaseballStrkType');
var CONSTRAINT_COMPARE_SELECT = By.id('s2id_pageControlBaseballStrkConstraintCompare');
var CONSTRAINT_VALUE_INPUT = By.id('pageControlBaseballStrkConstraintValue');

var STREAK_GROUPING_SELECT = By.id('s2id_pageControlBaseballStrkGroupingPlayer');
var STREAK_SCOPE_SELECT = By.id('s2id_pageControlBaseballStrkScope');
var UPDATE_CONSTRAINTS_BUTTON = By.id('pageControlBaseballStrkBtnUpdate');

var CONSTRAINT_STAT_SELECT = {
  'batting': By.id('s2id_pageControlBaseballStrkConstraintStatPlayer'),
  'pitching': By.id('s2id_pageControlBaseballStrkConstraintStatPlayerPitching'),
  'catching': By.id('s2id_pageControlBaseballStrkConstraintStatPlayerCatching'),
  'statcastFielding': By.id('s2id_pageControlBaseballStrkConstraintStatPlayerStatcast')
}

// Multi-Filter
var HEATMAP_TOP = By.css('#playerHeatMapMultiFilter1 > svg');
var HEATMAP_BOTTOM = By.css('#plaherHeatMapMultiFilter2 > svg');
var HEATMAP_IMAGE_TOP = By.css('#playerHeatMapMultiFilter1 #heatmapBg');
var HEATMAP_IMAGE_BOTTOM = By.css('#playerHeatMapMultiFilter2 #heatmapBg');
var CLOSE_HEATMAP_BOX_BUTTON_TOP = By.css('#hitChartMultiFilter1 > svg > text');
var CLOSE_HEATMAP_BOX_BUTTON_BOTTOM = By.css('#hitChartMultiFilter2 > svg > text');

var HIT_CHART_TOP = By.css('#hitChartMultiFilter1 > svg');
var HIT_PLOT_POINT_TOP = By.css('#hitChartMultiFilter1 > svg > circle.plotPoint');
var HIT_CHART_BOTTOM = By.css('#hitChartMultiFilter2 > svg');
var HIT_PLOT_POINT_BOTTOM = By.css('#hitChartMultiFilter2 > svg > circle.plotPoint');

var VISUAL_MODE_TOP_SELECT = By.id('s2id_pageControlBaseballVisMode');
var VISUAL_MODE_BOTTOM_SELECT = By.id('s2id_pageControlBaseballVisMode2');

// COMPS
var COMP_SEARCH_1_INPUT = By.css('#compSearch1 input');
var COMP_SEARCH_2_INPUT = By.css('#compSearch2 input');

// MATCHUPS
var INLINE_VIDEO_PLAYLIST_HEADER = By.css('h5.video-inline-header-txt');
var MATCHUPS_AT_BAT_TABLE_ID = {
  'batting': 'tableBaseballPlayerPitchLogBattingVidMatchupContainer',
  'pitching': 'tableBaseballPlayerPitchLogPitchingVidMatchupContainer'
}

var MATCHUPS_VIDEO_TEXT_TABLE_ID = {
  'batting': 'videoInlinetableBaseballPlayerPitchLogBattingVidMatchupModal',
  'pitching': 'videoInlinetableBaseballPlayerPitchLogPitchingVidMatchupModal'
}

// VS TEAMS/PLAYERS
var VS_TABLE = By.xpath('.//div[@id="tableBaseballPlayerStatsContainer"]/table')

// STATCAST FIELDING
var BALLPARK_IMAGE = By.css('.field-container svg g');
var BALLPARK_SELECT = By.css('tmn-ballpark-selector select');
var STATCAST_FIELDING_CHART_EVENT = By.css('statcast-fielding-chart .bin-events path');
var STATCSAT_FIELDING_MODAL_CLOSE_BTN = By.css('#tableBaseballPlayerTeamPitchLogBattingModalStandaloneWithVideoId button');
var STATCAST_FIELDING_MODAL_TITLE = By.css('#tableBaseballPlayerTeamPitchLogBattingModalStandaloneWithVideoId h4.modal-title');


function PlayerPage(driver, section, subSection) {
  BasePage.call(this, driver);
  this.section = section || 'batting';
  this.subSection = subSection || 'overview';
};

PlayerPage.prototype = Object.create(BasePage.prototype);
PlayerPage.prototype.constructor = PlayerPage;

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
PlayerPage.prototype.getHitChartHitCount = function(hitType) {  
  var d = Promise.defer();
  this.waitForEnabled(HIT_CHART, 30000);
  var hitTypeLocator = HIT_TYPE[hitType] || HIT_TYPE['all'];
  this.getElementCount(hitTypeLocator).then(function(count) {
    d.fulfill(count);
  });

  return d.promise;
};

PlayerPage.prototype.drawBoxOnHeatMap = function(x, y, width, height) {
  var element = driver.findElement(HEATMAP);
  driver.actions()
    .mouseMove(element, {x: x, y: y}) // start at (x,y)
    .mouseDown() // click down
    .mouseMove({x: width, y: height}) // move mouse width to the right and height downwards
    .mouseUp() // click up
    .perform();

    this.waitUntilStaleness(HIT_CHART, 10000);
    return this.waitForEnabled(HIT_CHART)
};

PlayerPage.prototype.clearHeatMap = function() {
  this.driver.findElements(CLOSE_HEATMAP_BOX_BUTTON).then(function(elements) {
    for(var i=0; i < elements.length; i++) {
      elements[i].click();
    }
  })

  this.waitUntilStaleness(HIT_CHART, 10000);
  this.waitUntilStaleness(HIT_CHART, 10000);
  return this.waitForEnabled(HIT_CHART, 20000);
};

PlayerPage.prototype.clickHitChartPoint = function(pointNum) {
  var d = Promise.defer();
  var thiz = this;

  this.driver.findElements(HIT_PLOT_POINT).then(function(points) {
    points[pointNum].click();
    thiz.waitUntilStaleness(HIT_CHART, 30000);
    d.fulfill(true);
  })

  return d.promise;
};

PlayerPage.prototype.getHeatMapPitchCount = function() {
  var d = Promise.defer();

  this.getElementCount(HEAT_MAP_PITCH).then(function(count) {
    d.fulfill(count/2); // 2 circles per pitch
  });

  return d.promise;
};

PlayerPage.prototype.getPlayerGridPitchCount = function() {
  var d = Promise.defer();

  this.getElementCount(PLAYER_GRID_PITCH).then(function(count) {
    d.fulfill(count/2); // 2 circles per pitch
  });

  return d.promise;
};

PlayerPage.prototype.clickPitchViewLink = function() {
  var element = this.driver.findElement(PITCH_VIEW_LINK[this.section]);
  return element.click();
};

PlayerPage.prototype.clickHeatMapLink = function() {
  var element = this.driver.findElement(HEAT_MAP_LINK);
  return element.click();  
};

PlayerPage.prototype.getPitchViewPitchCount = function() {
  var d = Promise.defer();

  this.getElementCount(PITCH_VIEW_PITCH).then(function(count) {
    d.fulfill(count/2); // 2 circles per pitch
  });

  return d.promise;
};

// TODO - this function isn't very reliable
PlayerPage.prototype.getHeatMapImageTitle = function() {
  var d = Promise.defer();

  this.getAttribute(HEATMAP_IMAGE, 'href').then(function(href) {
    // get the title from the image href
    d.fulfill(href.match(/(%5B).{2,20}(%5D.+from)/)[0].replace(/(%5B|%5D.+)/g, '').replace(/(%25)/g, '%'));
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
}

PlayerPage.prototype.getOverviewTableStat = function(row, col) {
  // First 3 rows are for the headers
  var rowNum = row + 3;
  var locator = By.xpath(`.//div[@id='${OVERVIEW_TABLE_ID[this.section]}']/table/tbody/tr[${rowNum}]/td[${col}]`);
  return this.getText(locator, 30000);  
}

/****************************************************************************
** Game Logs
*****************************************************************************/
PlayerPage.prototype.getGameLogTableStat = function(row, col) {
  var rowNum = row + 5;
  var locator = By.xpath(`.//div[@id='tableBaseballPlayerGameLogContainer']/table/tbody/tr[${rowNum}]/td[${col}]`);
  return this.getText(locator, 30000);  
}

/****************************************************************************
** Splits
*****************************************************************************/
PlayerPage.prototype.getSplitsTableStat = function(row, col) {
  var locator = By.xpath(`.//div[@id='tableBaseballPlayerSplitsContainer']/table[@class='table table-striped']/tbody/tr[not(contains(@class, 'sectionHeader'))][${row}]/td[${col}]`);
  return this.getText(locator, 30000);  
}

/****************************************************************************
** Pitch Logs
*****************************************************************************/
PlayerPage.prototype.clickByInningTab = function() {
  var element = this.driver.findElement(BY_INNING_TAB);
  return element.click();  
};

PlayerPage.prototype.clickFlatViewTab = function() {
  var element = this.driver.findElement(FLAT_VIEW_TAB);
  return element.click();  
};

// By Inning Table
PlayerPage.prototype.getByInningHeaderText = function(topOrBottom, inning) {
  var addRow = (topOrBottom == "bottom") ? 2 : 1;
  var row = inning * 2 - 2 + addRow;
  
  var locator = By.xpath(`.//div[@id='${BY_INNING_TABLE_ID[this.section]}']/table/tbody/tr[@class='sectionHeader sectionInning'][${row}]/td`);
  return this.getText(locator, 20000);
};

PlayerPage.prototype.getByInningAtBatHeaderText = function(atBatNum) {
  var locator = By.xpath(`.//div[@id='${BY_INNING_TABLE_ID[this.section]}']/table/tbody/tr[@class='sectionHeaderAlt sectionStartOfBat'][${atBatNum}]/td`);
  return this.getText(locator);
};

PlayerPage.prototype.getByInningAtBatFooterText = function(atBatNum) {
  var locator = By.xpath(`.//div[@id='${BY_INNING_TABLE_ID[this.section]}']/table/tbody/tr[@class='sectionHeaderAlt sectionEndOfBat'][${atBatNum}]/td`);
  return this.getText(locator);
};

PlayerPage.prototype.getByInningTableStat = function(pitchNum, col) {
  var locator = By.xpath(`.//div[@id='${BY_INNING_TABLE_ID[this.section]}']/table/tbody/tr[contains(@data-tmn-row-type,'row')][${pitchNum}]/td[${col}]`);
  return this.getText(locator);
};

// Flat View Table
PlayerPage.prototype.getFlatViewTableStat = function(rowNum, col) {
  var locator = By.xpath(`.//div[@id='${FLAT_VIEW_TABLE_ID[this.section]}']/table/tbody/tr[${rowNum}]/td[${col}]`);
  return this.getText(locator, 30000);
};

/****************************************************************************
** Occurences & Steaks
*****************************************************************************/
PlayerPage.prototype.changeMainConstraint = function(streakType, constraintCompare, constraintValue, constraintStat, streakGrouping, streakScope) {
  this.changeDropdown(STREAK_TYPE_SELECT, DROPDOWN_INPUT, streakType);
  this.changeDropdown(CONSTRAINT_COMPARE_SELECT, DROPDOWN_INPUT, constraintCompare);
  this.clear(CONSTRAINT_VALUE_INPUT)
  this.sendKeys(CONSTRAINT_VALUE_INPUT, constraintValue);
  this.changeDropdown(CONSTRAINT_STAT_SELECT[this.section], DROPDOWN_INPUT, constraintStat);
  this.changeDropdown(STREAK_GROUPING_SELECT, DROPDOWN_INPUT, streakGrouping);
  this.changeDropdown(STREAK_SCOPE_SELECT, DROPDOWN_INPUT, streakScope);
  return this.click(UPDATE_CONSTRAINTS_BUTTON);
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
}

PlayerPage.prototype.drawBoxOnMultiFilterHeatMap = function(topOrBottom, x, y, width, height) {
  var locator = (topOrBottom == 'top') ? HEATMAP_TOP : HEATMAP_BOTTOM;
  var hitChartLocator = (topOrBottom == 'top') ? HIT_CHART_TOP : HIT_CHART_BOTTOM;
  var element = driver.findElement(locator);
  driver.actions()
    .mouseMove(element, {x: x, y: y}) // start at (x,y)
    .mouseDown() // click down
    .mouseMove({x: width, y: height}) // move mouse width to the right and height downwards
    .mouseUp() // click up
    .perform();
    
    this.waitUntilStaleness(hitChartLocator, 10000);
    return this.waitForEnabled(hitChartLocator);
};

PlayerPage.prototype.getMultiFilterHitChartHitCount = function(topOrBottom) {
  var d = Promise.defer();
  var hitChartLocator = (topOrBottom == 'top') ? HIT_CHART_TOP : HIT_CHART_BOTTOM;
  var hitPlotPointLocator = (topOrBottom == 'top') ? HIT_PLOT_POINT_TOP : HIT_PLOT_POINT_BOTTOM;

  this.waitForEnabled(hitChartLocator);
  this.getElementCount(hitPlotPointLocator).then(function(count) {
    d.fulfill(count);
  });

  return d.promise;
};

PlayerPage.prototype.changeMultiFilterVisualMode = function(topOrBottom, type) {
  var locator = (topOrBottom == 'top') ? VISUAL_MODE_TOP_SELECT : VISUAL_MODE_BOTTOM_SELECT;
  return this.changeDropdown(locator, DROPDOWN_INPUT, type);
};

PlayerPage.prototype.getMultiFilterHeatMapImageTitle = function(topOrBottom) {
  var d = Promise.defer();
  var locator = (topOrBottom == 'top') ? HEATMAP_IMAGE_TOP : HEATMAP_IMAGE_BOTTOM;

  this.getAttribute(locator, 'href').then(function(href) {
    d.fulfill(href.match(/(%5B).{2,20}(%5D.+from)/)[0].replace(/(%5B|%5D|%7C.+|%2C.+)/g, '').replace(/(%25)/g, '%'));
  });

  return d.promise;
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
** Matchups
*****************************************************************************/
PlayerPage.prototype.getMatchupsCurrentVideoHeader = function() {
  return this.getText(INLINE_VIDEO_PLAYLIST_HEADER, 10000);
}

PlayerPage.prototype.getMatchupsVideoText = function(videoNum, lineNum) {
  var locator = By.xpath(`.//div[@id='${MATCHUPS_VIDEO_TEXT_TABLE_ID[this.section]}']/.//a[@class='list-group-item'][${videoNum}]/div[${lineNum}]`);
  return this.getText(locator, 10000);
};

PlayerPage.prototype.getMatchupsAtBatHeaderText = function(atBatNum) {
  var locator = By.xpath(`.//div[@id='${MATCHUPS_AT_BAT_TABLE_ID[this.section]}']/table/tbody/tr[@class='sectionHeaderAlt sectionStartOfBat'][${atBatNum}]/td`);
  return this.getText(locator, 30000);
};

PlayerPage.prototype.clickPitchVideoIcon = function(pitchNum) {
  var locator = By.xpath(`.//div[@id='${MATCHUPS_AT_BAT_TABLE_ID[this.section]}']/table/tbody/tr[contains(@data-tmn-row-type,'row')][${pitchNum}]/td[1]/i[@class='fa fa-film pull-left film-icon']`);
  return this.click(locator);
}

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

  return this.waitUntilStaleness(BALLPARK_IMAGE, 30000);
}

PlayerPage.prototype.getCurrentBallparkImageID = function() {
  var d = Promise.defer();

  this.driver.findElements(BALLPARK_IMAGE).then(function(elements) {
    elements[0].getAttribute('id').then(function(id) {
      d.fulfill(id);
    });
  });
  return d.promise;
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