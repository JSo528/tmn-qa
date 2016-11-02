'use strict';

// Load Base Page
var BasePage = require('../../pages/base/base_page.js')

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;

// Locators
var FILTER_SELECT = By.id('s2id_addFilter');
var FILTER_INPUT = By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input");
var UPDATE_BUTTON = By.className('update');

var DECISIVE_EVENT_FILTER_SELECT = By.id('s2id_pageControlBaseballGameEventDecisive');
var DECISIVE_EVENT_FILTER_INPUT = By.id('s2id_autogen1_search');

var VIDEO_PLAYLIST_MODAL = By.xpath(".//div[@id='videoModal']/div[@class='modal-dialog modal-lg']/div[@class='modal-content']");
var VIDEO_PLAYLIST_CLOSE_BTN = By.xpath(".//div[@id='videoModal']/div/div/div/button");

var PITCH_VISUALS_MODAL = By.xpath(".//div[@id='tableBaseballGamePitchByPitchModal']/div/div[@class='modal-content']");
var PITCH_VISUALS_CLOSE_BTN = By.xpath(".//div[@id='tableBaseballGamePitchByPitchModal']/div/div/div/button[@class='btn btn-primary']");
var PITCH_VISUALS_BG_IMAGE = By.id("heatmapBg");
var PITCH_VISUALS_PITCH_CIRCLE = By.css('circle.heat-map-ball');

var DATA_CONTAINER = By.xpath(".//div[@id='tableBaseballGamePitchByPitchContainer']/table");

// when the video playlist modal is closed, the body tag loses its class
var EMPTY_BODY = By.xpath(".//body[@class='']");

function ScorePitchByPitch(driver) {
  BasePage.call(this, driver);
};

ScorePitchByPitch.prototype = Object.create(BasePage.prototype);
ScorePitchByPitch.prototype.constructor = ScorePitchByPitch;

// Filters
ScorePitchByPitch.prototype.addDropdownFilter = function(filter) {
  return this.changeDropdown(FILTER_SELECT, FILTER_INPUT, filter);
};

ScorePitchByPitch.prototype.toggleSidebarFilter = function(filterName, selection) {
  var locator = By.xpath(`.//div[@id='common']/div/div/div[@class='row'][div[@class='col-md-4 filter-modal-entry-label']/h5[contains(text()[1], '${filterName}')]]/div[@class='col-md-8']/div/div/label[${selection}]`)
  return this.clickAndWait(locator, DATA_CONTAINER);
};

ScorePitchByPitch.prototype.closeDropdownFilter = function(filterNum) {
  var locator = By.xpath(`.//div[@class='col-md-8 activated']/div[${filterNum}]/div[@class='filter-header text-left']/span[@class='closer fa fa-2x fa-times-circle pull-right']`);
  return this.removeFilter(locator, UPDATE_BUTTON);
};

ScorePitchByPitch.prototype.addDecisiveEventFilter = function(filter) {
  return this.changeDropdown(DECISIVE_EVENT_FILTER_SELECT, DECISIVE_EVENT_FILTER_INPUT, filter);
};

// text getters
ScorePitchByPitch.prototype.getInningHeaderText = function(topOrBottom, inning) {
  var addRow = (topOrBottom == "bottom") ? 2 : 1;
  var row = inning * 2 - 2 + addRow;
  
  var locator = By.xpath(`.//div[@id='tableBaseballGamePitchByPitchContainer']/table/tbody/tr[@class='sectionHeader sectionInning'][${row}]/td`);
  return this.getText(locator, 20000);
};

ScorePitchByPitch.prototype.getAtBatHeaderText = function(atBatNum) {
  var locator = By.xpath(`.//div[@id='tableBaseballGamePitchByPitchContainer']/table/tbody/tr[@class='sectionHeaderAlt sectionStartOfBat'][${atBatNum}]/td`);
  return this.getText(locator);
};

ScorePitchByPitch.prototype.getAtBatFooterText = function(atBatNum) {
  var locator = By.xpath(`.//div[@id='tableBaseballGamePitchByPitchContainer']/table/tbody/tr[@class='sectionHeaderAlt sectionEndOfBat'][${atBatNum}]/td`);
  return this.getText(locator);
};

// TODO - try to add a paramter for the atBat#
// the way the table is set up makes it incredibly difficult to do since you need to traverse paths with lots of conditions using XPath
// explanation -> http://stackoverflow.com/questions/3428104/selecting-siblings-between-two-nodes-using-xpath
ScorePitchByPitch.prototype.getPitchText = function(pitchNum, col) {
  var locator = By.xpath(`.//div[@id='tableBaseballGamePitchByPitchContainer']/table/tbody/tr[contains(@data-tmn-row-type,'row')][${pitchNum}]/td[${col}]`);
  return this.getText(locator);
};

// Video Playlist
ScorePitchByPitch.prototype.clickPitchVideoIcon = function(pitchNum) {
  var locator = By.xpath(`.//div[@id='tableBaseballGamePitchByPitchContainer']/table/tbody/tr[contains(@data-tmn-row-type,'row')][${pitchNum}]/td[1]/i[@class='fa fa-film pull-left film-icon']`);
  this.click(locator);

  var element = this.driver.findElement(VIDEO_PLAYLIST_MODAL);
  return this.driver.wait(Until.elementIsVisible(element), 30000);
}

ScorePitchByPitch.prototype.closeVideoPlaylistModal = function() {
  this.click(VIDEO_PLAYLIST_CLOSE_BTN, 10000);
  return this.driver.wait(Until.elementLocated(EMPTY_BODY), 2000);
}

ScorePitchByPitch.prototype.getVideoPlaylistText = function(videoNum, lineNum) {
  var locator = By.xpath(`.//div[@class='col-md-3 playlistContainer']/div/div/a[${videoNum}]/div[${lineNum}]`)
  return this.getText(locator);
}

ScorePitchByPitch.prototype.isVideoModalDisplayed = function() {
  return this.isDisplayed(VIDEO_PLAYLIST_MODAL, 2000);
};

// Pitch Visuals Modal
ScorePitchByPitch.prototype.clickPitchVisualsIcon = function(atBatNum) {
  var locator = By.xpath(`.//div[@id='tableBaseballGamePitchByPitchContainer']/table/tbody/tr[@class='sectionHeaderAlt sectionStartOfBat'][${atBatNum}]/td/span[@class='table-action-visual fa fa-lg fa-external-link-square']`);
  this.click(locator);
  var element = this.driver.findElement(PITCH_VISUALS_MODAL);
  // hack to focus on the screen, otherwise modal doesn't open
  this.driver.takeScreenshot();
  this.driver.wait(Until.elementIsVisible(element), 30000).then(function() {
    return true;
  }, function(err) {
    console.log('error opening pitch visuals modal:' + err);
    return false;
  })
};

ScorePitchByPitch.prototype.closePitchVisualsIcon = function() {
  this.click(PITCH_VISUALS_CLOSE_BTN);
  this.driver.wait(Until.elementLocated(By.xpath(".//body[not(@class='modal-open')]")), 10000).then(function() {
    return true;
  }, function(err) {
    console.log('error closing pitch visuals modal:' + err);
    return false;
  })
};

ScorePitchByPitch.prototype.isPitchVisualsModalDisplayed = function() {
  return this.isDisplayed(PITCH_VISUALS_MODAL, 2000)
};

ScorePitchByPitch.prototype.getPitchVisualsBgImageHref = function() {
  this.driver.wait(Until.elementLocated(PITCH_VISUALS_MODAL, 30000));
  return this.getAttribute(PITCH_VISUALS_BG_IMAGE, 'href');
};

ScorePitchByPitch.prototype.getPitchVisualsPitchCount = function() {
  this.driver.wait(Until.elementLocated(PITCH_VISUALS_MODAL, 30000));
 return this.getElementCount(PITCH_VISUALS_PITCH_CIRCLE);
};

ScorePitchByPitch.prototype.comparisonDataContainer = DATA_CONTAINER;
ScorePitchByPitch.prototype.lastLocator = DATA_CONTAINER;

module.exports = ScorePitchByPitch;