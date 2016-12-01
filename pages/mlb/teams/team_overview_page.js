'use strict';

// Load Base Page
var BasePage = require('../../../pages/base/base_page.js');

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;

// Locators
// HEAT MAP
var HEATMAP = By.css('#teamHeatMap > svg');
var HEATMAP_IMAGE = By.id('heatmapBg');
var CLOSE_HEATMAP_BOX_BUTTON = By.css('#teamHeatMap > svg > text');
var HEAT_MAP_PITCH = By.css('#teamHeatMap circle.heat-map-ball');
var HEAT_MAP_LINK = By.id('visualBaseballHeatMapTeam');
var PITCH_VIEW_LINK = By.id('visualBaseballPitchChartTeamBatter');
var PITCH_VIEW_PITCH = By.css('#teamPitchChart circle.pitch-chart-ball');

// HIT CHART
var HIT_CHART = By.css('#hitChart > svg');
var HIT_PLOT_POINT = By.css('#hitChart > svg > circle.plotPoint');
var SINGLE_PLOT_POINT = By.css('#hitChart > svg > circle.plotPoint[fill="rgba(255,255,255,1)"]');
var DOUBLE_PLOT_POINT = By.css('#hitChart > svg > circle.plotPoint[fill="rgba(0,0,255,1)"]');
var TRIPE_PLOT_POINT = By.css('#hitChart > svg > circle.plotPoint[fill="rgba(128,0,128,1)"]');
var HOME_RUN_PLOT_POINT = By.css('#hitChart > svg > circle.plotPoint[fill="rgba(255,0,0,1)"]');
var ROE_PLOT_POINT = By.css('#hitChart > svg > circle.plotPoint[fill="rgba(255,255,0,1)"]');
var OUT_PLOT_POINT = By.css('#hitChart > svg > circle.plotPoint[fill="rgba(128,128,128,1)"]');

// TEAM GRID
var TEAM_GRID = By.css('#teamGrid > svg');
var TEAM_GRID_PITCH = By.css('#teamGrid circle.heat-map-ball');

var VISUAL_MODE_SELECT = By.id('s2id_pageControlBaseballVisMode');
var GRID_MODE_SELECT = By.id('s2id_pageControlBaseballGridMode');
var DROPDOWN_INPUT = By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input");

// CATCHING
var LEFT_CATCHING_HEATMAP = By.css('#teamHeatMapLefty > svg');
var RIGHT_CATCHING_HEATMAP = By.css('#teamHeatMapRighty > svg');
var LEFT_CATCHING_HEATMAP_IMAGE = By.css('#teamHeatMapLefty #heatmapBg');
var RIGHT_CATCHING_HEATMAP_IMAGE = By.css('#teamHeatMapRighty #heatmapBg');
var CLOSE_LEFT_CATCHING_HEATMAP_BOX_BUTTON = By.css('#teamHeatMapLefty > svg > text');
var CLOSE_RIGHT_CATCHING_HEATMAP_BOX_BUTTON = By.css('#teamHeatMapRighty > svg > text');

// STATCAST FIELDING
var BALLPARK_IMAGE = By.css('.field-container svg g');
var BALLPARK_SELECT = By.css('tmn-ballpark-selector select');

function TeamOverviewPage(driver) {
  BasePage.call(this, driver);
};

TeamOverviewPage.prototype = Object.create(BasePage.prototype);
TeamOverviewPage.prototype.constructor = TeamOverviewPage;

TeamOverviewPage.prototype.getTeamTableStat = function(col) {
  var locator = By.xpath(`.//div[@id='tableBaseballTeamStatsOverviewContainer']/table/tbody/tr[4]/td[${col}]`);
  return this.getText(locator, 30000);
};

/****************************************************************************
** Heat Maps & Hit Chart
*****************************************************************************/
// x, y is the point of the top left corner of the box
TeamOverviewPage.prototype.drawBoxOnHeatMap = function(x, y, width, height) {
  var element = driver.findElement(HEATMAP);
  driver.actions()
    .mouseMove(element, {x: x, y: y}) // start at (x,y)
    .mouseDown() // click down
    .mouseMove({x: width, y: height}) // move mouse width to the right and height downwards
    .mouseUp() // click up
    .perform();
    this.waitUntilStaleness(HEATMAP_IMAGE, 10000);
    return this.waitForEnabled(HEATMAP_IMAGE)
};

// not really a good way to signify which x to clear, so general function to clear all boxes
TeamOverviewPage.prototype.clearHeatMap = function() {
  this.driver.findElements(CLOSE_HEATMAP_BOX_BUTTON).then(function(elements) {
    for(var i=0; i < elements.length; i++) {
      elements[i].click();
    }
  })

  this.waitUntilStaleness(HIT_CHART, 10000);
  this.waitUntilStaleness(HIT_CHART, 10000); // becomes stale twice
  return(this.waitForEnabled(HIT_CHART))
};

TeamOverviewPage.prototype.getHitChartHitCount = function(hitType) {
  var d = Promise.defer();
  var locator;
  
  switch (hitType) {
    case 'single':
      locator = SINGLE_PLOT_POINT;
      break;
    case 'double':
      locator = DOUBLE_PLOT_POINT;
      break;
    case 'triple':
      locator = TRIPE_PLOT_POINT;
      break;
    case 'homeRun':
      locator = HOME_RUN_PLOT_POINT;
      break;
    case 'error':
      locator = ROE_PLOT_POINT;
      break;      
    case 'out':
      locator = OUT_PLOT_POINT;
      break;            
    default:
      locator = HIT_PLOT_POINT;
  }

  this.waitForEnabled(HIT_CHART, 30000);
  this.getElementCount(locator).then(function(count) {
    d.fulfill(count);
  });

  return d.promise;
};

TeamOverviewPage.prototype.clickHitChartPoint = function(pointNum) {
  var d = Promise.defer();
  var thiz = this;

  this.driver.findElements(HIT_PLOT_POINT).then(function(points) {
    points[pointNum].click();
    thiz.waitUntilStaleness(HIT_CHART, 30000);
    d.fulfill(true);
  })

  return d.promise;
};

TeamOverviewPage.prototype.getHeatMapPitchCount = function() {
  var d = Promise.defer();

  this.getElementCount(HEAT_MAP_PITCH).then(function(count) {
    d.fulfill(count/2); // 2 circles per pitch
  });

  return d.promise;
};

TeamOverviewPage.prototype.getTeamGridPitchCount = function() {
  var d = Promise.defer();

  this.getElementCount(TEAM_GRID_PITCH).then(function(count) {
    d.fulfill(count/2); // 2 circles per pitch
  });

  return d.promise;
};

TeamOverviewPage.prototype.clickPitchViewLink = function() {
  var element = this.driver.findElement(PITCH_VIEW_LINK);
  return element.click();
};

TeamOverviewPage.prototype.clickHeatMapLink = function() {
  var element = this.driver.findElement(HEAT_MAP_LINK);
  return element.click();  
};

TeamOverviewPage.prototype.getPitchViewPitchCount = function() {
  var d = Promise.defer();

  this.getElementCount(PITCH_VIEW_PITCH).then(function(count) {
    d.fulfill(count/2); // 2 circles per pitch
  });

  return d.promise;
};

// TODO - this function isn't very reliable
TeamOverviewPage.prototype.getHeatMapImageTitle = function() {
  var d = Promise.defer();

  this.getAttribute(HEATMAP_IMAGE, 'href').then(function(href) {
    // get the title from the image href
    d.fulfill(href.match(/(%5B).{2,20}(%5D.+from)/)[0].replace(/(%5B|%5D.+)/g, '').replace(/(%25)/g, '%'));
  });

  return d.promise;
};

TeamOverviewPage.prototype.changeVisualMode = function(mode) { 
  this.click(VISUAL_MODE_SELECT);
  var locator = By.xpath(`.//ul[@id='select2-results-1']/li/div[text()='${mode}']`);
  return this.click(locator)
};

/****************************************************************************
** Catching Heat Maps
*****************************************************************************/
TeamOverviewPage.prototype.drawBoxOnCatcherHeatMap = function(leftOrRight, x, y, width, height) {
  var heatmapLocator = (leftOrRight == 'left') ? LEFT_CATCHING_HEATMAP : RIGHT_CATCHING_HEATMAP
  var heatmapImageLocator = (leftOrRight == 'left') ? LEFT_CATCHING_HEATMAP_IMAGE : RIGHT_CATCHING_HEATMAP_IMAGE

  var element = driver.findElement(heatmapLocator);
  driver.actions()
    .mouseMove(element, {x: x, y: y}) // start at (x,y)
    .mouseDown() // click down
    .mouseMove({x: width, y: height}) // move mouse width to the right and height downwards
    .mouseUp() // click up
    .perform();

    return this.waitForEnabled(heatmapImageLocator)
};

// not really a good way to signify which x to clear, so general function to clear all boxes
TeamOverviewPage.prototype.clearCatcherHeatMap = function(leftOrRight) {
  var closeHeatmapLocator = (leftOrRight == 'left') ? CLOSE_LEFT_CATCHING_HEATMAP_BOX_BUTTON : CLOSE_RIGHT_CATCHING_HEATMAP_BOX_BUTTON
  var heatmapLocator = (leftOrRight == 'left') ? LEFT_CATCHING_HEATMAP : RIGHT_CATCHING_HEATMAP

  this.driver.findElements(closeHeatmapLocator).then(function(elements) {
    for(var i=0; i < elements.length; i++) {
      elements[i].click();
    }
  })

  return(this.waitForEnabled(heatmapLocator))
};

/****************************************************************************
** Statcast Fielding
*****************************************************************************/
TeamOverviewPage.prototype.getStatcastFieldingModalTableStat = function(row, col) {
  var locator = By.xpath(`.//div[@id='tableBaseballPlayerTeamPitchLogBattingModalStandaloneWithVideoContainer']/table/tbody/tr[${row}]/td[${col}]`);
  return this.getText(locator, 30000);
};

TeamOverviewPage.prototype.clickStatcastFieldingChartEvent = function(eventNum) {
  var d = Promise.defer();
  var locator = By.css('statcast-fielding-chart .bin-events path');
  
  driver.findElements(locator).then(function(elements) {
    d.fulfill(elements[eventNum].click());
  });

  return d.promise;
};

TeamOverviewPage.prototype.closeStatcastFieldingModal = function() {
  var locator = By.css('#tableBaseballPlayerTeamPitchLogBattingModalStandaloneWithVideoId button');
  var element = driver.findElement(locator);
  return element.click();
};

TeamOverviewPage.prototype.changeBallparkDropdown = function(ballpark) {
  this.click(BALLPARK_SELECT);
  var optionLocator = By.xpath(`.//tmn-ballpark-selector/select/option[text()="${ballpark}"]`);
  this.click(optionLocator);

  return this.waitUntilStaleness(BALLPARK_IMAGE, 30000);
}

TeamOverviewPage.prototype.getCurrentBallparkImageID = function() {
  var d = Promise.defer();

  this.driver.findElements(BALLPARK_IMAGE).then(function(elements) {
    elements[0].getAttribute('id').then(function(id) {
      d.fulfill(id);
    });
  });
  return d.promise;
};



module.exports = TeamOverviewPage;