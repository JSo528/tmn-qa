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
var playByPlay = require('../mixins/playByPlay.js');
/****************************************************************************
** Locators
*****************************************************************************/
var SECTION_NAMES = {
  'summary': 'Summary',
  'possessions': 'Possessions',
  'passes': 'Passes',
  'creativity': 'Creativity',
  'shots': 'Shots',
  'defence': 'Defence',
  'setPieces': 'Set Pieces',
  'goalkeeper': 'Goalkeeper',
  'discipline': 'Discipline',
  'multiFilter': 'Multi-Filter',
  'comps': 'Comps',
  'passZones': 'Pass Zones'
};

var TAB_NAME = {
  'stats': 'Stats',
  'splits': 'Splits',
  'squad': 'Squad',
  'playByPlay': 'Play By Play',
  'passMatrix': 'Pass Matrix',
  'assistMatrix': 'Assist Matrix',
};

var TABLE_CLASS = {
  'stats': 'tmn-table-soccer-team-stats-report',
  'splits': 'tmn-table-soccer-team-splits-report',
  'squad': 'tmn-table-soccer-team-roster-report',
  'playByPlay': 'tmn-table-soccer-team-pbp-report',
  'passMatrix': 'tmn-table-soccer-team-pass-matrix-report',
  'assistMatrix': 'tmn-table-soccer-team-assist-matrix-report',
};

// Comp
var COMP_SEARCH_ID = {
  1: 'compSearch1',
  2: 'compSearch2',
  3: 'compSearch3'
};

var PASS_ZONES_MAIN_BLOCK = By.css("svg > .mainData > rect");
var PASS_ZONES_DRILL_DOWN_BLOCK = By.css("svg > .drillDownData > rect");


var GROUP_BY_SELECT = By.id("s2id_pageControlSoccerGroupByTeam");
var STATS_VIEW_SELECT = By.id("s2id_pageControlSoccerStatsViewTeamSimple");
var REPORT_SELECT = By.id("s2id_reportNavSoccerTeamSub");
var DROPDOWN_INPUT = By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input");

function TeamPage(driver) {
  BasePage.call(this, driver);
  this.section = 'summary'
  this.tabName = 'stats'
};

TeamPage.prototype = Object.create(BasePage.prototype);
TeamPage.prototype.constructor = TeamPage;

// Mixins
_.extend(TeamPage.prototype, chartColumns);
_.extend(TeamPage.prototype, scatterPlot);
_.extend(TeamPage.prototype, customReport);
_.extend(TeamPage.prototype, playByPlay);

TeamPage.prototype.DEFAULT_CHART_COLUMNS_DATA_TABLE_CSS = {
  'stats': '.tmn-table-soccer-team-stats-report',
  'splits': '.tmn-table-soccer-team-splits-report',
  'squad': '.tmn-table-soccer-team-roster-report',
  'playByPlay': '.tmn-table-soccer-team-pbp-report'
};

TeamPage.prototype.CUSTOM_REPORT_MODAL_TAG = TABLE_CLASS;
TeamPage.prototype.PLAY_BY_PLAY_MODAL_TAG = TABLE_CLASS;
// TeamPage.prototype.CUSTOM_REPORT_MODAL_TAG = {
//   'stats': 'tmn-table-soccer-team-stats-report',
//   'splits': 'tmn-table-soccer-team-splits-report',
//   'squad': 'tmn-table-soccer-team-roster-report',
//   'playByPlay': 'tmn-table-soccer-team-pbp-report'
// };

// TeamPage.prototype.PLAY_BY_PLAY_MODAL_TAG = {
//   'stats': 'tmn-table-soccer-team-stats-report',
//   'splits': 'tmn-table-soccer-team-splits-report',
//   'squad': 'tmn-table-soccer-team-roster-report',
// };



/****************************************************************************
** Shared
*****************************************************************************/
TeamPage.prototype.changeGroupBy = function(groupBy) {
  return this.changeDropdown(GROUP_BY_SELECT, DROPDOWN_INPUT, groupBy);
};

TeamPage.prototype.changeStatsView = function(statsView) {
  return this.changeDropdown(STATS_VIEW_SELECT, DROPDOWN_INPUT, statsView);
};

TeamPage.prototype.changeReport = function(report) {
  return this.changeDropdown(REPORT_SELECT, DROPDOWN_INPUT, report);
};

TeamPage.prototype.waitForTableToLoad = function() {
  var locator = By.xpath(`.//tmn-table[contains(@class, '${TABLE_CLASS[this.tabName]}')]/table`);
  this.waitUntilStaleness(locator, 1000);
  return this.waitForEnabled(locator, 10000);
};

TeamPage.prototype.goToSection = function(section) {
  this.section = section;
  this.tabName = 'stats';
  var locator = By.xpath(`.//div[@class='navbar-header']/ul/li/a[text()='${SECTION_NAMES[section]}']`);
  return this.click(locator);
};

TeamPage.prototype.clickTab = function(tabName) {
  this.tabName = tabName;
  var locator = By.xpath(`.//div[@id='tabContainer']/ul/li/a[text()='${TAB_NAME[tabName]}']`);
  return this.click(locator);
};

/****************************************************************************
** Tab Tables
*****************************************************************************/
TeamPage.prototype.clickTableHeaderFor = function(colName) {
  var locator = By.xpath(`.//tmn-table[contains(@class, '${TABLE_CLASS[this.tabName]}')]/table/thead/tr/th[@data-col-key="${colName}"]`);
  return this.click(locator);
};

TeamPage.prototype.getTableStatsFor = function(colName) {
  var locator = By.xpath(`.//tmn-table[contains(@class, '${TABLE_CLASS[this.tabName]}')]/table/tbody/tr[not(@is='tmn-table-tr-section')]/td[count(//tmn-table[contains(@class, '${TABLE_CLASS[this.tabName]}')]/table[1]/thead/tr/th[@data-col-key="${colName}"]/preceding-sibling::th)+1]`);
  return this.getTextArray(locator);
};

TeamPage.prototype.getTableStatFor = function(rowNum, colName) {
  var locator = By.xpath(`.//tmn-table[contains(@class, '${TABLE_CLASS[this.tabName]}')]/table/tbody/tr[not(@is='tmn-table-tr-section')][${rowNum}]/td[count(//tmn-table[contains(@class, '${TABLE_CLASS[this.tabName]}')]/table[1]/thead/tr/th[@data-col-key="${colName}"]/preceding-sibling::th)+1]`);
  return this.getText(locator);
};

TeamPage.prototype.clickTableStatFor = function(rowNum, colName) {
  var locator = By.xpath(`.//tmn-table[contains(@class, '${TABLE_CLASS[this.tabName]}')]/table/tbody/tr[not(@is='tmn-table-tr-section')][${rowNum}]/td[count(//tmn-table[contains(@class, '${TABLE_CLASS[this.tabName]}')]/table[1]/thead/tr/th[@data-col-key="${colName}"]/preceding-sibling::th)+1]/div/span`);
  return this.click(locator);
};

TeamPage.prototype.getTableStatBgColor = function(rowNum, colName) {
  var locator = By.xpath(`.//tmn-table[contains(@class, '${TABLE_CLASS[this.tabName]}')]/table/tbody/tr[not(@is='tmn-table-tr-section')]/td[count(//tmn-table[contains(@class, '${TABLE_CLASS[this.tabName]}')]/table[1]/thead/tr/th[@data-col-key="${colName}"]/preceding-sibling::th)+1]`);
  return this.getCssValue(locator, 'background-color');
};

/****************************************************************************
** PlayByPlay
*****************************************************************************/
TeamPage.prototype.clickPbpPlayPossessionIcon = function(playNum) {
  var locator = By.xpath(`.//tmn-table-soccer-team-pbp-report/.//tmn-table/table/tbody/tr[not(@is='tmn-table-tr-section')][${playNum}]/td/tmn-table-action-column/span[contains(@class, 'fa-external-link-square')][2]`);
  return this.click(locator);
};

TeamPage.prototype.clickPbpPlayVideoIcon = function(playNum) {
  var d = Promise.defer();
  var locator = By.xpath(`.//tmn-table-soccer-team-pbp-report/.//tmn-table/table/tbody/tr[not(@is='tmn-table-tr-section')][${playNum}]/td/tmn-table-action-column/span/tmn-video-icon/paper-icon-button/iron-icon`);
  var bodyLocator = By.css('sp-root');
  this.click(locator);
  browser.setTabHandles().then(function() {
    browser.switchToTab(1)
    d.fulfill(this.waitForEnabled(bodyLocator));
  }.bind(this))
  return d.promise;
};

/****************************************************************************
** VisContainer
*****************************************************************************/
TeamPage.prototype.drawBoxOnVisContainer = function(leftOrRight, x, y, width, height) {
  var className = leftOrRight == 'left' ? '.left' : '.right';
  var locator = By.css(`#visContainer ${className} svg`);
  
  var element = driver.findElement(locator);
  driver.actions()
    .mouseMove(element, {x: x, y: y}) // start at (x,y)
    .mouseDown() // click down
    .mouseMove({x: width, y: height}) // move mouse width to the right and height downwards
    .mouseUp() // click up
    .perform();

  return this.waitForEnabled(locator);
};

TeamPage.prototype.removeBoxOnVisContainer = function(leftOrRight, boxNum) {
  var className = leftOrRight == 'left' ? '.left' : '.right';
  var locator = By.css(`#visContainer ${className} svg > text:nth-of-type(${boxNum})`);
  var visLocator = By.css(`#visContainer ${className} svg`);
  this.click(locator);
  return this.waitForEnabled(visLocator);
};

TeamPage.prototype.getScatterPlayCount = function(leftOrRight) {
  var className = leftOrRight == 'left' ? '.left' : '.right';
  var locator = By.css(`#visContainer ${className} g.marks image.mark`);
  return this.getElementCount(locator);
};

TeamPage.prototype.hoverOverScatterPlay = function(leftOrRight, playNum) {
  var className = leftOrRight == 'left' ? '.left' : '.right';
  var typeNum = playNum + 1;
  var locator = By.css(`#visContainer ${className} g.marks image:nth-of-type(${typeNum})`);
  var thiz = this;

  this.driver.findElement(locator).then(function(elem) {
    thiz.driver.actions().mouseMove(elem).perform();
    thiz.driver.sleep(5000);
  });
};

TeamPage.prototype.getArrowsPlayCount = function(leftOrRight) {
  var className = leftOrRight == 'left' ? '.left' : '.right';
  var locator = By.css(`#visContainer ${className} g.marks line.mark`);
  return this.getElementCount(locator);
};

TeamPage.prototype.hoverOverArrowsPlay = function(leftOrRight, playNum) {
  var className = leftOrRight == 'left' ? '.left' : '.right';
  var locator = By.css(`#visContainer ${className} g.marks line:nth-of-type(${playNum})`);
  var thiz = this;

  this.driver.findElement(locator).then(function(elem) {
    thiz.driver.actions().mouseMove(elem).perform();
    thiz.driver.sleep(5000);
  });
};

TeamPage.prototype.getVisContainerPlayDetail = function(leftOrRight) {
  var className = leftOrRight == 'left' ? '.left' : '.right';
  var locator = By.css(`#visContainer ${className} g.marks text:nth-of-type(2)`)
  return this.getText(locator);
};

TeamPage.prototype.changeVisChartTypeDropdown = function(leftOrRight, visType) {
  var selectLocator = leftOrRight == 'left' ? By.id('s2id_leftChartType') : By.id('s2id_rightChartType');
  var className = leftOrRight == 'left' ? '.left' : '.right';
  var visLocator = By.css(`#visContainer ${className} svg`);

  this.click(selectLocator);
  this.sendKeys(DROPDOWN_INPUT, visType, 10000);
  this.sendKeys(this.DROPDOWN_INPUT, Key.ENTER, 10000);
  return this.waitUntilStaleness(visLocator, 5000);
};

TeamPage.prototype.changeVisFilterTypeDropdown = function(leftOrRight, passesType) {
  var selectLocator = leftOrRight == 'left' ? By.id('s2id_leftFilterType') : By.id('s2id_rightFilterType');
  var className = leftOrRight == 'left' ? '.left' : '.right';
  var visLocator = By.css(`#visContainer ${className} svg`);

  this.click(selectLocator);
  this.sendKeys(DROPDOWN_INPUT, passesType, 10000);
  this.sendKeys(this.DROPDOWN_INPUT, Key.ENTER, 10000);
  return this.waitUntilStaleness(visLocator, 5000);
};

TeamPage.prototype.getScatterPlayTransform = function(leftOrRight, playNum) {
  var className = leftOrRight == 'left' ? '.left' : '.right';
  var typeNum = playNum + 1;
  var locator = By.css(`#visContainer ${className} g.marks image:nth-of-type(${typeNum})`);
  return this.getAttribute(locator, 'transform');
};

TeamPage.prototype.getTagCloudPlayerFontSize = function(leftOrRight, playNum) {
  var className = leftOrRight == 'left' ? '.left' : '.right';
  var locator = By.css(`#visContainer ${className} g > g.marks > text:nth-of-type(${playNum})`);
  return this.getCssValue(locator, 'font-size');
};

TeamPage.prototype.hoverOverVisShot = function(leftOrRight, playNum) {
  var className = leftOrRight == 'left' ? '.left' : '.right';
  var typeNum = playNum + 1;
  var locator = By.css(`#visContainer ${className} g > g.marks > image:nth-of-type(${typeNum})`);
  var thiz = this;

  this.driver.findElement(locator).then(function(elem) {
    thiz.driver.actions().mouseMove(elem).perform();
    thiz.driver.sleep(5000);
  });
};

TeamPage.prototype.getVisShotCount = function(leftOrRight) {
  var className = leftOrRight == 'left' ? '.left' : '.right';
  var locator = By.css(`#visContainer ${className} g > g.marks > image.mark`);
  return this.getElementCount(locator);
};

TeamPage.prototype.isThirdFieldImageDisplayed = function(leftOrRight) {
  var d = Promise.defer();
  var className = leftOrRight == 'left' ? '.left' : '.right';
  var locator = By.css(`#visContainer ${className} g > g.marks > image:nth-of-type(1)`);
  this.getAttribute(locator, 'href').then(function(attr) {
    if (attr == '/field-third-large.png') {
      d.fulfill(true);
    } else {
      d.fulfill(false);
    }
  })
  return d.promise;
};

TeamPage.prototype.toggleScaleShotsByExpectedValue = function() {
  var locator = By.id('scaleByExpectedGoals');
  var visLocator = By.css(`#visContainer .left svg`);
  this.click(locator);
  return this.waitUntilStaleness(visLocator, 5000);
};

TeamPage.prototype.getVisShotPixelHeight = function(leftOrRight, playNum) {
  var className = leftOrRight == 'left' ? '.left' : '.right';
  var typeNum = playNum + 1;
  var locator = By.css(`#visContainer ${className} g > g.marks > image:nth-of-type(${typeNum})`);
  return this.getAttribute(locator, 'height');
};

/****************************************************************************
** MultiFIlter
*****************************************************************************/
TeamPage.prototype.getMultiFilterTableStatFor = function(rowNum, colName) {
  var locator = By.xpath(`.//table/tbody/tr[not(@is='tmn-table-tr-section')][${rowNum}]/td[count(//table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getText(locator);
};

TeamPage.prototype.clickMultiFilterTableStatFor = function(rowNum, colName) {
  var locator = By.xpath(`.//table/tbody/tr[not(@is='tmn-table-tr-section')][${rowNum}]/td[count(//table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]/span`);
  return this.click(locator);
};

TeamPage.prototype.getMultiFilterPlayByPlayModalTableStatFor = function(rowNum, colName) {
  var locator = By.xpath(`.//div[@id='tableSoccerToPPlayByPlayModalContainer']/table/tbody/tr[@data-tmn-row][${rowNum}]/td[count(//div[@id='tableSoccerToPPlayByPlayModalContainer']/table/thead/tr/th[@data-col-key="${colName}"]/preceding-sibling::th)+1]`);
  return this.getText(locator);
};

TeamPage.prototype.clickMultiFilterPlayPossessionIcon = function(playNum) {
  var locator = By.xpath(`.//div[@id='tableSoccerToPPlayByPlayModalContainer']/table/tbody/tr[@data-tmn-row][${playNum}]/td/span[contains(@class, 'fa-external-link-square')]`);
  return this.click(locator);
};

TeamPage.prototype.clickMultiFilterlayVideoIcon = function(playNum) {
  var d = Promise.defer();
  var locator = By.xpath(`.//div[@id='tableSoccerToPPlayByPlayModalContainer']/table/tbody/tr[@data-tmn-row][${playNum}]/td/span/tmn-video-icon/paper-icon-button/iron-icon`);
  var bodyLocator = By.css('sp-root');
  this.click(locator);
  browser.setTabHandles().then(function() {
    browser.switchToTab(1)
    d.fulfill(this.waitForEnabled(bodyLocator));
  }.bind(this))
  return d.promise;
};

TeamPage.prototype.closeMultiFilterPlayByPlayModal = function() {
  var locator = By.xpath(`.//div[contains(@class,'modal-soccer-pbp')]/.//button[contains(text(),'Close')]`);
  this.click(locator);
  return this.driver.sleep(100);
};

TeamPage.prototype.isMultiFilterPlayByPlayModalDisplayed = function() {
  var locator = By.xpath(`.//div[contains(@class,'modal-soccer-pbp')]`);
  return this.isDisplayed(locator, 100);
};
  
/****************************************************************************
** Comps
*****************************************************************************/
TeamPage.prototype.getCompsTableStatFor = function(rowNum, colName) {
  var locator = By.xpath(`.//table/tbody/tr[not(@is='tmn-table-tr-section')][${rowNum}]/td[count(//table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getText(locator);
};

TeamPage.prototype.clickCompsTableStatFor = function(rowNum, colName) {
  var locator = By.xpath(`.//table/tbody/tr[not(@is='tmn-table-tr-section')][${rowNum}]/td[count(//table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]/span`);
  return this.click(locator);
};

TeamPage.prototype.selectForCompsSearch = function(compNum, name) {
  var locator = By.css(`#${COMP_SEARCH_ID[compNum]} input`);
  return this.selectFromSearch(locator, name, 1);
};

TeamPage.prototype.getCompsPlayByPlayModalTableStatFor = function(rowNum, colName) {
  var locator = By.xpath(`.//div[@id='tableSoccerToPPlayByPlayModalContainer']/table/tbody/tr[@data-tmn-row][${rowNum}]/td[count(//div[@id='tableSoccerToPPlayByPlayModalContainer']/table/thead/tr/th[@data-col-key="${colName}"]/preceding-sibling::th)+1]`);
  return this.getText(locator);
};

TeamPage.prototype.clickCompsPlayPossessionIcon = function(playNum) {
  var locator = By.xpath(`.//div[@id='tableSoccerToPPlayByPlayModalContainer']/table/tbody/tr[@data-tmn-row][${playNum}]/td/span[contains(@class, 'fa-external-link-square')]`);
  return this.click(locator);
};

TeamPage.prototype.clickCompsPlayVideoIcon = function(playNum) {
  var d = Promise.defer();
  var locator = By.xpath(`.//div[@id='tableSoccerToPPlayByPlayModalContainer']/table/tbody/tr[@data-tmn-row][${playNum}]/td/span/tmn-video-icon/paper-icon-button/iron-icon`);
  var bodyLocator = By.css('sp-root');
  this.click(locator);
  browser.setTabHandles().then(function() {
    browser.switchToTab(1)
    d.fulfill(this.waitForEnabled(bodyLocator));
  }.bind(this))
  return d.promise;
};

TeamPage.prototype.closeCompsPlayByPlayModal = function() {
  var locator = By.xpath(`.//div[contains(@class,'modal-soccer-pbp')]/.//button[contains(text(),'Close')]`);
  this.click(locator);
  return this.driver.sleep(100);
};

TeamPage.prototype.isCompsPlayByPlayModalDisplayed = function() {
  var locator = By.xpath(`.//div[contains(@class,'modal-soccer-pbp')]`);
  return this.isDisplayed(locator, 100);
};

TeamPage.prototype.getPassZoneMainBlockWidth = function(blockNum) {
  return this.getAttributeForElementNum(PASS_ZONES_MAIN_BLOCK, 'width', blockNum);
};

TeamPage.prototype.getPassZoneMainBlockColor = function(blockNum) {
  return this.getAttributeForElementNum(PASS_ZONES_MAIN_BLOCK, 'fill', blockNum);
};


TeamPage.prototype.hoverOverPlayZoneMainBlock = function(blockNum) {
  var thiz = this;

  var d = Promise.defer();
  this.driver.findElements(PASS_ZONES_MAIN_BLOCK).then(function(elements) {
    var elem = elements[blockNum];
    thiz.driver.actions().mouseMove(elem).perform();
    thiz.driver.sleep(5000);
  })
  return d.promise;
};

TeamPage.prototype.clickPassZoneMainBlock = function(blockNum) {
  var d = Promise.defer();
  this.driver.findElements(PASS_ZONES_MAIN_BLOCK).then(function(elements) {
    var elem = elements[blockNum];
    d.fulfill(elem.click());
  });
  return d.promise;
};

TeamPage.prototype.getDrillDownBlockCount = function() {
  return this.getElementCount(PASS_ZONES_DRILL_DOWN_BLOCK);
};

TeamPage.prototype.clickDrillDownBlock = function(blockNum) {
  var d = Promise.defer();
  var bodyLocator = By.css('sp-root');
  this.driver.findElements(PASS_ZONES_DRILL_DOWN_BLOCK).then(function(elements) {
    var elem = elements[blockNum];
    elem.click();
    browser.setTabHandles().then(function() {
      browser.switchToTab(1)
      d.fulfill(this.waitForEnabled(bodyLocator));
    }.bind(this))
  }.bind(this));
  return d.promise;
};

TeamPage.prototype.getPassZonesTooltipText = function() {
  var locator = By.css('.d3-tip.n');
  return this.getText(locator);
};
module.exports = TeamPage;