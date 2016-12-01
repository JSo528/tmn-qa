'use strict';

// Load Base Page
var BasePage = require('../../../pages/base/base_page.js');

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;

// Catching Specific
var LEFTY_HEATMAP = By.css('#playerHeatMapCatcherLefty > svg');
var LEFTY_HEATMAP_IMAGE = By.css('#playerHeatMapCatcherLefty #heatmapBg');
var CLOSE_LEFTY_HEATMAP_BOX_BUTTON = By.css('#playerHeatMapCatcherLefty > svg > text');
var LEFTY_HEAT_MAP_LINK = By.id('visualBaseballHeatMapPlayerCatcherLefty');
var LEFTY_PITCH_VIEW_LINK = By.id('visualBaseballPitchViewPlayerCatcherLefty');
var LEFTY_PITCH_VIEW_PITCH = By.css('#playerPitchChartLefty circle.pitch-chart-ball');

var RIGHTY_HEATMAP = By.css('#playerHeatMapCatcherRighty > svg');
var RIGHTY_HEATMAP_IMAGE = By.css('#playerHeatMapCatcherRighty #heatmapBg');
var CLOSE_RIGHTY_HEATMAP_BOX_BUTTON = By.css('#playerHeatMapCatcherRighty > svg > text');
var RIGHTY_HEAT_MAP_LINK = By.id('visualBaseballHeatMapPlayerCatcherRighty');
var RIGHTY_PITCH_VIEW_LINK = By.id('visualBaseballPitchChartPlayerCatcherRighty');
var RIGHTY_PITCH_VIEW_PITCH = By.css('#playerPitchChartRighty circle.pitch-chart-ball');

function PlayerCatcherPage(driver, section) {
  BasePage.call(this, driver);
  this.section = section;
};

PlayerCatcherPage.prototype = Object.create(BasePage.prototype);
PlayerCatcherPage.prototype.constructor = PlayerCatcherPage;

PlayerCatcherPage.prototype.drawBoxOnHeatMap = function(leftyOrRighty, x, y, width, height) {
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

PlayerCatcherPage.prototype.clearHeatMap = function(leftyOrRighty) {
  var locator = (leftyOrRighty == 'lefty') ? CLOSE_LEFTY_HEATMAP_BOX_BUTTON : CLOSE_RIGHTY_HEATMAP_BOX_BUTTON;
  var heatmapLocator = (leftyOrRighty == 'lefty') ? LEFTY_HEATMAP : RIGHTY_HEATMAP;
  this.driver.findElements(locator).then(function(elements) {
    for(var i=0; i < elements.length; i++) {
      elements[i].click();
    }
  })

  return this.waitForEnabled(heatmapLocator, 20000);
};

PlayerCatcherPage.prototype.clickHeatMapLink = function(leftyOrRighty) {
  var locator = (leftyOrRighty == 'lefty') ? LEFTY_HEAT_MAP_LINK : RIGHTY_HEAT_MAP_LINK;
  return this.click(locator);
};

PlayerCatcherPage.prototype.clickPitchViewLink = function(leftyOrRighty) {
  var locator = (leftyOrRighty == 'lefty') ? LEFTY_PITCH_VIEW_LINK : RIGHTY_PITCH_VIEW_LINK;
  return this.click(locator);
};


PlayerCatcherPage.prototype.getPitchViewPitchCount = function(leftyOrRighty) {
  var d = Promise.defer();

  var locator = (leftyOrRighty == 'lefty') ? LEFTY_PITCH_VIEW_PITCH : RIGHTY_PITCH_VIEW_PITCH;
  this.getElementCount(locator).then(function(count) {
    d.fulfill(count/2); // 2 circles per pitch
  });

  return d.promise;
};

PlayerCatcherPage.prototype.getHeatMapImageTitle = function(leftyOrRighty) {
  var d = Promise.defer();
  var locator = (leftyOrRighty == 'lefty') ? LEFTY_HEATMAP_IMAGE : RIGHTY_HEATMAP_IMAGE;

  this.getAttribute(locator, 'href').then(function(href) {
    d.fulfill(href.match(/(%5B).{2,20}(%5D.+from)/)[0].replace(/(%5B|%5D.+|%7C.+)/g, '').replace(/(%25)/g, '%'));
  });

  return d.promise;
};
module.exports = PlayerCatcherPage;