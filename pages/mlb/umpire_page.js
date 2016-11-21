'use strict';

// Load Base Page
var BasePage = require('../../pages/base/base_page.js');

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;
var Key = require('selenium-webdriver').Key;

// Locators
var SUB_SECTION_TITLE = {
  'overview': 'Overview',
  'gameLog': 'Game Log',
  'pitchLog': 'Pitch Log'
}

var REPORT_SELECT = By.id('s2id_reportNavBaseballUmpireStatUmpires');
var DROPDOWN_INPUT = By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input");
var UMPIRE_NAME = By.css('h1.name');

// OVERVIEW PAGE
var LEFTY_HEATMAP = By.css('#umpireHeatMapLefty > svg');
var LEFTY_HEATMAP_IMAGE = By.css('#umpireHeatMapLefty #heatmapBg');
var CLOSE_LEFTY_HEATMAP_BOX_BUTTON = By.css('#umpireHeatMapLefty > svg > text');
var LEFTY_HEAT_MAP_LINK = By.id('visualBaseballHeatMapUmpireLefty');
var LEFTY_PITCH_VIEW_LINK = By.id('visualBaseballPitchChartUmpireLefty');
var LEFTY_PITCH_VIEW_PITCH = By.css('#umpirePitchChartLefty circle.pitch-chart-ball');

var RIGHTY_HEATMAP = By.css('#umpireHeatMapRighty > svg');
var RIGHTY_HEATMAP_IMAGE = By.css('#umpireHeatMapRighty #heatmapBg');
var CLOSE_RIGHTY_HEATMAP_BOX_BUTTON = By.css('#umpireHeatMapRighty > svg > text');
var RIGHTY_HEAT_MAP_LINK = By.id('visualBaseballHeatMapUmpireRighty');
var RIGHTY_PITCH_VIEW_LINK = By.id('visualBaseballPitchChartUmpireRighty');
var RIGHTY_PITCH_VIEW_PITCH = By.css('#umpirePitchChartRighty circle.pitch-chart-ball');

// VISUAL MODE
var VISUAL_MODE_SELECT = By.id('s2id_pageControlBaseballVisMode');
var VISUAL_MODE_UL_ID = 'select2-results-1';

// PITCH LOGS
var BY_INNING_TAB = By.xpath(".//div[@id='reportTabsSection0']/.//li[1]/a");
var FLAT_VIEW_TAB = By.xpath(".//div[@id='reportTabsSection0']/.//li[2]/a");

function UmpirePage(driver, subSection) {
  BasePage.call(this, driver);
  this.subSection = subSection || 'overview';
};

UmpirePage.prototype = Object.create(BasePage.prototype);
UmpirePage.prototype.constructor = UmpirePage;  

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
}


/****************************************************************************
** Overview
*****************************************************************************/
UmpirePage.prototype.drawBoxOnHeatMap = function(leftyOrRighty, x, y, width, height) {
  var locator = (leftyOrRighty == 'lefty') ? LEFTY_HEATMAP : RIGHTY_HEATMAP;
  var imageLocator = (leftyOrRighty == 'lefty') ? LEFTY_HEATMAP_IMAGE : RIGHTY_HEATMAP_IMAGE;
  var element = driver.findElement(locator);
  driver.actions()
    .mouseMove(element, {x: x, y: y}) // start at (x,y)
    .mouseDown() // click down
    .mouseMove({x: width, y: height}) // move mouse width to the right and height downwards
    .mouseUp() // click up
    .perform();
    
    return this.waitForEnabled(imageLocator)
};

UmpirePage.prototype.clearHeatMap = function(leftyOrRighty) {
  var locator = (leftyOrRighty == 'lefty') ? CLOSE_LEFTY_HEATMAP_BOX_BUTTON : CLOSE_RIGHTY_HEATMAP_BOX_BUTTON;
  var heatmapLocator = (leftyOrRighty == 'lefty') ? LEFTY_HEATMAP : RIGHTY_HEATMAP;
  this.driver.findElements(locator).then(function(elements) {
    for(var i=0; i < elements.length; i++) {
      elements[i].click();
    }
  })

  return this.waitForEnabled(heatmapLocator, 20000);
};

UmpirePage.prototype.clickHeatMapLink = function(leftyOrRighty) {
  var locator = (leftyOrRighty == 'lefty') ? LEFTY_HEAT_MAP_LINK : RIGHTY_HEAT_MAP_LINK;
  return this.click(locator);
};

UmpirePage.prototype.clickPitchViewLink = function(leftyOrRighty) {
  var locator = (leftyOrRighty == 'lefty') ? LEFTY_PITCH_VIEW_LINK : RIGHTY_PITCH_VIEW_LINK;
  return this.click(locator);
};


UmpirePage.prototype.getPitchViewPitchCount = function(leftyOrRighty) {
  var d = Promise.defer();

  var locator = (leftyOrRighty == 'lefty') ? LEFTY_PITCH_VIEW_PITCH : RIGHTY_PITCH_VIEW_PITCH;
  this.getElementCount(locator).then(function(count) {
    d.fulfill(count/2); // 2 circles per pitch
  });

  return d.promise;
};

UmpirePage.prototype.getHeatMapImageTitle = function(leftyOrRighty) {
  var d = Promise.defer();
  var locator = (leftyOrRighty == 'lefty') ? LEFTY_HEATMAP_IMAGE : RIGHTY_HEATMAP_IMAGE;

  this.getAttribute(locator, 'href').then(function(href) {
    d.fulfill(href.match(/(%5B).{2,20}(%5D.+from)/)[0].replace(/(%5B|%5D.+)/g, '').replace(/(%25)/g, '%'));
  });

  return d.promise;
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

/****************************************************************************
** Game Logs
*****************************************************************************/
UmpirePage.prototype.getGameLogTableStat = function(row, col) {
  var rowNum = row + 5;
  var locator = By.xpath(`.//div[@id='tableBaseballUmpireGameLogContainer']/table/tbody/tr[${rowNum}]/td[${col}]`);
  return this.getText(locator, 30000);  
};


/****************************************************************************
** Pitch Logs
*****************************************************************************/
UmpirePage.prototype.clickByInningTab = function() {
  var element = this.driver.findElement(BY_INNING_TAB);
  return element.click();  
};

UmpirePage.prototype.clickFlatViewTab = function() {
  var element = this.driver.findElement(FLAT_VIEW_TAB);
  return element.click();  
};

// By Inning Table
UmpirePage.prototype.getByInningHeaderText = function(topOrBottom, inning) {
  var addRow = (topOrBottom == "bottom") ? 2 : 1;
  var row = inning * 2 - 2 + addRow;
  
  var locator = By.xpath(`.//div[@id='tableBaseballUmpirePitchLogContainer']/table/tbody/tr[@class='sectionHeader sectionInning'][${row}]/td`);
  return this.getText(locator, 20000);
};

UmpirePage.prototype.getByInningAtBatHeaderText = function(atBatNum) {
  var locator = By.xpath(`.//div[@id='tableBaseballUmpirePitchLogContainer']/table/tbody/tr[@class='sectionHeaderAlt sectionStartOfBat'][${atBatNum}]/td`);
  return this.getText(locator);
};

UmpirePage.prototype.getByInningAtBatFooterText = function(atBatNum) {
  var locator = By.xpath(`.//div[@id='tableBaseballUmpirePitchLogContainer']/table/tbody/tr[@class='sectionHeaderAlt sectionEndOfBat'][${atBatNum}]/td`);
  return this.getText(locator);
};

UmpirePage.prototype.getByInningTableStat = function(pitchNum, col) {
  var locator = By.xpath(`.//div[@id='tableBaseballUmpirePitchLogContainer']/table/tbody/tr[contains(@data-tmn-row-type,'row')][${pitchNum}]/td[${col}]`);
  return this.getText(locator);
};

// Flat View Table
UmpirePage.prototype.getFlatViewTableStat = function(rowNum, col) {
  var locator = By.xpath(`.//div[@id='tableBaseballUmpirePitchTableContainer']/table/tbody/tr[${rowNum}]/td[${col}]`);
  return this.getText(locator, 30000);
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