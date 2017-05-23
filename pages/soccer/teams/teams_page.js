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
var chartColumns = require('../mixins/chartColumns.js');
var scatterPlot = require('../../mixins/scatterPlot.js');
var customReport = require('../mixins/customReport.js');
/****************************************************************************
** Locators
*****************************************************************************/
var GROUP_BY_SELECT = By.id("s2id_pageControlSoccerGroupByTeams");
var STATS_VIEW_SELECT = By.id("s2id_pageControlSoccerStatsViewTeam");
var DROPDOWN_INPUT = By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input");
var DATA_TABLE = By.css('tmn-table#results-table > table:nth-of-type(1)');

function TeamsPage(driver) {
  BasePage.call(this, driver);
};

TeamsPage.prototype = Object.create(BasePage.prototype);
TeamsPage.prototype.constructor = TeamsPage;

// Mixins
_.extend(TeamsPage.prototype, chartColumns);
_.extend(TeamsPage.prototype, scatterPlot);
_.extend(TeamsPage.prototype, customReport);

/****************************************************************************
** Shared
*****************************************************************************/
// TeamsPage.prototype.changeSeason = function(report) {
//   this.changeDropdown(SEASON_DROPDOWN, DROPDOWN_INPUT, report);
//   return this.waitForEnabled(SEASON_DROPDOWN, 30000);
// };

// TeamsPage.prototype.isTableDisplayed = function() {
//   return this.isDisplayed(DATA_TABLE, 100);
// };

TeamsPage.prototype.changeGroupBy = function(filter) {
  return this.changeDropdown(GROUP_BY_SELECT, DROPDOWN_INPUT, filter);
};

TeamsPage.prototype.changeStatsView = function(filter) {
  return this.changeDropdown(STATS_VIEW_SELECT, DROPDOWN_INPUT, filter);
};

TeamsPage.prototype.waitForTableToLoad = function() {
  this.waitUntilStaleness(DATA_TABLE, 1000);
  return this.waitForEnabled(DATA_TABLE, 10000);
};

/****************************************************************************
** Summary
*****************************************************************************/

TeamsPage.prototype.clickSummaryTableHeaderFor = function(colName) {
  var locator = By.xpath(`.//tmn-table[@id='results-table']/table[1]/thead/tr/th[@data-col-key="${colName}"]`);
  return this.click(locator);
};

TeamsPage.prototype.getSummaryTableStatsFor = function(colName) {
  var locator = By.xpath(`.//tmn-table[@id='results-table']/table[1]/tbody/tr[not(@is='tmn-table-tr-section')]/td[count(//tmn-table[@id='results-table']/table[1]/thead/tr/th[@data-col-key="${colName}"]/preceding-sibling::th)+1]`);
  return this.getTextArray(locator);
};

TeamsPage.prototype.getSummaryTableStatFor = function(rowNum, colName) {
  var locator = By.xpath(`.//tmn-table[@id='results-table']/table[1]/tbody/tr[not(@is='tmn-table-tr-section')][${rowNum}]/td[count(//tmn-table[@id='results-table']/table[1]/thead/tr/th[@data-col-key="${colName}"]/preceding-sibling::th)+1]`);
  return this.getText(locator);
};

TeamsPage.prototype.clickSummaryTableStatFor = function(rowNum, colName) {
  var locator = By.xpath(`.//tmn-table[@id='results-table']/table[1]/tbody/tr[not(@is='tmn-table-tr-section')][${rowNum}]/td[count(//tmn-table[@id='results-table']/table[1]/thead/tr/th[@data-col-key="${colName}"]/preceding-sibling::th)+1]/div/span`);
  return this.click(locator);
};

TeamsPage.prototype.getSummaryTableStatBgColor = function(rowNum, colName) {
  var locator = By.xpath(`.//tmn-table[@id='results-table']/table[1]/tbody/tr[not(@is='tmn-table-tr-section')]/td[count(//tmn-table[@id='results-table']/table[1]/thead/tr/th[@data-col-key="${colName}"]/preceding-sibling::th)+1]`);
  return this.getCssValue(locator, 'background-color');
};

TeamsPage.prototype.getPlayByPlayModalTableStatFor = function(rowNum, colName) {
  var locator = By.xpath(`.//tmn-table[contains(@class,'tmn-play-by-play-modal')]/table/tbody/tr[not(@is='tmn-table-tr-section')][${rowNum}]/td[count(//tmn-table[contains(@class,'tmn-play-by-play-modal')]/table/thead/tr/th[@data-col-key="${colName}"]/preceding-sibling::th)+1]`);
  return this.getText(locator);
};

TeamsPage.prototype.closePlayByPlayModal = function() {
  var locator = By.css(".tmn-modal > .modal-footer  > .tmn-play-by-play-modal > button");
  return this.click(locator);
};

TeamsPage.prototype.isPlayByPlayModalDisplayed = function() {
  var locator = By.css("tmn-play-by-play-modal > tmn-modal > paper-dialog");
  return this.isDisplayed(locator, 100);
};

// Play Possession Modal
TeamsPage.prototype.clickPlayPossessionIcon = function(playNum) {
  var locator = By.xpath(`.//tmn-table[contains(@class,'tmn-play-by-play-modal')]/table/tbody/tr[not(@is='tmn-table-tr-section')][${playNum}]/td/tmn-table-action-column/span[contains(@class, 'fa-external-link-square')][2]`);
  return this.click(locator);
};

TeamsPage.prototype.isPlayPossessionModalDisplayed = function() {
  var locator = By.css('tmn-pass-sequence-modal > tmn-modal > paper-dialog');
  return this.isDisplayed(locator, 500);
};

TeamsPage.prototype.getPlayPossessionTableStatFor = function(rowNum, colName) {
  var locator = By.xpath(`.//tmn-table[contains(@class,'tmn-pass-sequence-modal')]/table/tbody/tr[@data-tmn-row-i][${rowNum}]/td[count(//tmn-table[contains(@class,'tmn-pass-sequence-modal')]/table/thead/tr/th[@data-col-key="${colName}"]/preceding-sibling::th)+1]`);
  return this.getText(locator);
};

TeamsPage.prototype.getPlayPossessionTablePlayCount = function() {
  var locator = By.xpath(`.//tmn-table[contains(@class,'tmn-pass-sequence-modal')]/table/tbody/tr[@data-tmn-row-i]`);
  return this.getElementCount(locator);
};

TeamsPage.prototype.getPlayPossessionVisualPlayCount = function() {
  var locator = By.css("g > g.marks > g.tmn-pass-sequence");
  return this.getElementCount(locator);
};

TeamsPage.prototype.hoverOverPlayPossessionPlay = function(playNum) {
  var thiz = this;
  var locator = By.css(`g > g.marks > g.tmn-pass-sequence:nth-of-type(${playNum})`);
  this.driver.findElement(locator).then(function(elem) {
    thiz.driver.actions().mouseMove(elem).perform();
    thiz.driver.sleep(5000);
  });
};

TeamsPage.prototype.getPlayPossessionVisualDescription = function() {
  var locator = By.css('g.marks > text:nth-of-type(2)');
  return this.getText(locator);
};

TeamsPage.prototype.getPlayPossessionTableStatBgColor = function(rowNum) {
  var locator = By.xpath(`.//tmn-table[contains(@class,'tmn-pass-sequence-modal')]/table/tbody/tr[@data-tmn-row-i][${rowNum}]`);
  return this.getCssValue(locator, 'background-color');
};

TeamsPage.prototype.changePlayPossessionCropSlider = function(xOffset) {
  var locator = By.css('div.slider.ui-slider');
  var tableLocator = By.xpath(`.//tmn-table[contains(@class,'tmn-pass-sequence-modal')]/table`);
  this.clickOffset(locator, xOffset, 0)
  return this.waitUntilStaleness(tableLocator, 5000);
};

TeamsPage.prototype.clickPlayPossessionExportButton = function() {
  var locator = By.css("tmn-modal.tmn-pass-sequence-modal .modal-footer button:nth-of-type(1)");
  return this.click(locator);

};

TeamsPage.prototype.isPlayPossessionExportModalDisplayed = function() {
  var locator = By.css("div.modal.export-modal");
  return this.isDisplayed(locator, 500);
};

TeamsPage.prototype.clickPlayPossessionExportCloseButton = function() {
  var locator = By.css("div.modal.export-modal button.close");
  return this.click(locator);
};

// Video Player
TeamsPage.prototype.clickPlayVideoIcon = function(playNum) {
  var d = Promise.defer();
  var locator = By.xpath(`.//tmn-table[contains(@class,'tmn-play-by-play-modal')]/table/tbody/tr[not(@is='tmn-table-tr-section')][${playNum}]/td/tmn-table-action-column/span/tmn-video-icon/paper-icon-button/iron-icon`);
  var bodyLocator = By.css('sp-root');
  this.click(locator);
  browser.setTabHandles().then(function() {
    browser.switchToTab(1)
    d.fulfill(this.waitForEnabled(bodyLocator));
  }.bind(this))
  return d.promise;
};

TeamsPage.prototype.getVideoPlayerFixtureInfoHomeTeam = function(playNum) {
  var locator = By.xpath(`.//sp-playlist/div/div/div[${playNum}]/sp-playlist-item/div/div/span[@class='fixture-info']/span[@class='home-team']`);
  return this.getText(locator);
};

TeamsPage.prototype.getVideoPlayerFixtureInfoAwayTeam = function(playNum) {
  var locator = By.xpath(`.//sp-playlist/div/div/div[${playNum}]/sp-playlist-item/div/div/span[@class='fixture-info']/span[@class='away-team']`);
  return this.getText(locator);
};

TeamsPage.prototype.getVideoPlayerFixtureInfoScore = function(playNum) {
  var locator = By.xpath(`.//sp-playlist/div/div/div[${playNum}]/sp-playlist-item/div/div/span[@class='fixture-info']/span[@class='score']`);
  return this.getText(locator);
};

TeamsPage.prototype.getVideoPlayerEventTimes = function(playNum) {
  var locator = By.xpath(`.//sp-playlist/div/div/div[${playNum}]/sp-playlist-item/div/div[@class='event-times']/s7-display-time`);
  return this.getText(locator);
};

TeamsPage.prototype.closeVideoPlayerWindow = function() {
  browser.driver.close();
  browser.setTabHandles();
  return browser.switchToTab(0);
};




module.exports = TeamsPage;