'use strict';

// Load Base Page
var BasePage = require('../../../pages/base/base_page.js')

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;

// Mixins
var _ = require('underscore');
var videoPlaylist = require('../mixins/videoPlaylist.js');
var chartColumns = require('../../mixins/chartColumns.js');
var occurrencesAndStreaks = require('../mixins/occurrencesAndStreaks.js');
var scatterPlot = require('../../mixins/scatterPlot.js');

/****************************************************************************
** Locators
*****************************************************************************/

// Stats
var STATS_TABLE = {
  'performanceStats': By.xpath(".//div[@id='tableFootballPlayersGamePracticeStatsContainer']/table"),
  'practice': By.xpath(".//div[@id='tableFootballTeamPracticeContainer']/table"),

};
var GROUP_BY_SELECT = By.id("s2id_pageControlFootballPlayerPracticeGameGroupBy");
var STATS_VIEW_SELECT = By.id("s2id_pageControlFootballStatsViewPlayersPracticeGame");
var REPORT_SELECT = By.id("s2id_reportNavFootballPlayerPracticeSubCommon");
var DROPDOWN_INPUT = By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input");

var BAR_CHART_COLORS = {
  'walk': "rgb(26, 150, 65)",
  'jog': "rgb(166, 217, 106)",
}

var DASHBOARD_BAR_COLORS = {
  'walking': '#bbbbbb',
  'jogging': '#999999',
  'lightRunning': '#777777',
  'mediumSpeed': '#555555',
  'highSpeed': '#333333'
}

var PRACTICE_REPORT_SECTIONS = {
  'team': By.id('team-report'),
  'positions': By.id('positions-report'),
  'players': By.id('players-report')
}

// var YEAR_SELECT = By.id('s2id_pageControlFootballYear');
// var WEEK_SELECT = By.id('s2id_pageControlFootballRegWeek');
// var VIEW_SELECT = By.id('s2id_pageControlFootballStandingsGroup');
// var DROPDOWN_INPUT = By.xpath(".//div[@id='select2-drop']/div/input");
// var TABLES = By.css('table');

/****************************************************************************
** Constructor
*****************************************************************************/
function PerformancePage(driver) {
  BasePage.call(this, driver)
};

PerformancePage.prototype = Object.create(BasePage.prototype);
PerformancePage.prototype.constructor = PerformancePage;

_.extend(PerformancePage.prototype, chartColumns);

PerformancePage.prototype.DEFAULT_CHART_COLUMNS_DATA_TABLE_ID = {
  'performanceStats': 'tableFootballPlayersGamePracticeStatsContainer',
  'practice': 'tableFootballTeamPracticeContainer',
};
PerformancePage.prototype.DEFAULT_CHART_COLUMNS_ISO_TABLE_ID = {
  'performanceStats': 'tableFootballPlayersGamePracticeStatsISOContainer',
  'practice': 'tableFootballTeamPracticeISOContainer',

};

/****************************************************************************
** Shared
*****************************************************************************/
PerformancePage.prototype.goToSection = function(section) {
  var locator = By.xpath(`.//div[@class='navbar-header']/ul/li/a[text()='${section}']`);
  return this.click(locator);
};

PerformancePage.prototype.waitForTableToLoad = function() {
  this.waitUntilStaleness(STATS_TABLE[this.section], 10000);
  return this.waitForEnabled(STATS_TABLE[this.section], 10000);
};

PerformancePage.prototype.setSection = function(section) {
  this.section = section;
};


/****************************************************************************
** Practice and Games
*****************************************************************************/
PerformancePage.prototype.getTableStatFor = function(rowNum, colName) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamPracticeGameContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[count(//div[@id='tableFootballTeamPracticeGameContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getText(locator);
};

PerformancePage.prototype.clickTableStatFor = function(rowNum, colName) {
var locator = By.xpath(`.//div[@id='tableFootballTeamPracticeGameContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[count(//div[@id='tableFootballTeamPracticeGameContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]/a`);
  return this.click(locator);
};

/****************************************************************************
** Performance Stats
*****************************************************************************/
PerformancePage.prototype.changeGroupBy = function(filter) {
  return this.changeDropdown(GROUP_BY_SELECT, DROPDOWN_INPUT, filter);
};

PerformancePage.prototype.changeStatsView = function(filter) {
  return this.changeDropdown(STATS_VIEW_SELECT, DROPDOWN_INPUT, filter);
};

PerformancePage.prototype.changeReport = function(report) {
  this.changeDropdown(REPORT_SELECT, DROPDOWN_INPUT, report);
  return this.waitForEnabled(REPORT_SELECT, 30000);
};

PerformancePage.prototype.clickStatsTableHeaderFor = function(colName) {
  var locator = By.xpath(`.//div[@id='tableFootballPlayersGamePracticeStatsContainer']/table/thead/tr/th[text()="${colName}"]`);
  return this.click(locator);
};

PerformancePage.prototype.getStatsTableStatsFor = function(colName) {
  var locator = By.xpath(`.//div[@id='tableFootballPlayersGamePracticeStatsContainer']/table/tbody/tr[@data-tmn-row-type='row']/td[count(//div[@id='tableFootballPlayersGamePracticeStatsContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getTextArray(locator);
};

PerformancePage.prototype.getStatsTableStatFor = function(rowNum, colName) {
  var locator = By.xpath(`.//div[@id='tableFootballPlayersGamePracticeStatsContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[count(//div[@id='tableFootballPlayersGamePracticeStatsContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getText(locator);
};

PerformancePage.prototype.getStatsTableHeader = function(colNum) {
  var locator = By.xpath(`.//div[@id='tableFootballPlayersGamePracticeStatsContainer']/table/thead/tr/th[${colNum}]`);
  return this.getText(locator);
};

PerformancePage.prototype.hoverOverBarChartStack = function(playerNum, barType) {
    var fillText = BAR_CHART_COLORS[barType];
    var locator = By.css(`g.layer[style="fill: ${fillText};"] rect:nth-of-type(${playerNum})`);
    var thiz = this;

    this.driver.findElement(locator).then(function(elem) {
      thiz.driver.actions().mouseMove(elem).perform();
      thiz.driver.sleep(5000);
    });
};

PerformancePage.prototype.getBarChartTooltipText = function() {
  var locator = By.css('.d3-tip.n');
  return this.getText(locator);
};

PerformancePage.prototype.toggleBarChartType = function(type) {
  var checked = (type == 'Time');
  var d = Promise.defer();
  var thiz = this;

  var inputLocator = By.css("#checkboxContainer");
  var checkMarkLocator = By.css("#checkboxContainer #checkmark");
  
  this.isDisplayed(checkMarkLocator).then(function(displayed) {
    if (checked != displayed) {
      d.fulfill(thiz.click(inputLocator));
    }
  })
  return d.promise;
};

/****************************************************************************
** Dashboard
*****************************************************************************/
PerformancePage.prototype.changeDashboardDropdown = function(dropdown, listItem) {
  var dropdownLocator = By.css(`performance-dashboard-widget paper-dropdown-menu[label='${dropdown}']`);
  var listItemLocator = By.xpath(`.//performance-dashboard-widget/paper-dropdown-menu[@label="${dropdown}"]/.//paper-item[text()='${listItem}']`);
  var playerContainerLocator = By.id('player-container');
  this.click(dropdownLocator);
  this.click(listItemLocator);
  return this.waitUntilStaleness(playerContainerLocator, 1000);
};

PerformancePage.prototype.getDashboardPlayerPositions = function(position) {
  var d = Promise.defer();
  var locator = By.css("text.position");
  this.getTextArray(locator).then(function(arr) {
    var parsedArray = arr.map(function(str) {
      return str.split("#")[0].trim();
    })

    var uniqArray = Array.from(new Set(parsedArray));
    d.fulfill(uniqArray);
  });

  return d.promise;
};

PerformancePage.prototype.getDashboardBarWidth = function(playerNum, type) {
  var locator = By.css(`#player-container div.player:nth-of-type(${playerNum}) rect[fill='${DASHBOARD_BAR_COLORS[type]}']`);
  return this.getAttribute(locator, 'width');
}

PerformancePage.prototype.dashboardBarExists = function(playerNum, type) {
  var d = Promise.defer();
  var locator = By.css(`#player-container div.player:nth-of-type(${playerNum}) rect[fill='${DASHBOARD_BAR_COLORS[type]}']`);
  this.driver.wait(Until.elementLocated(locator),1000).then(function() {
    d.fulfill(true);
  }, function(err) {
    d.fulfill(false);
  });

  return d.promise;
};

PerformancePage.prototype.getEarliestDashboardBarDate = function(playerNum) {
  var d = Promise.defer();
  var thiz = this;
  var earliestDate;

  var eventLocators = By.css(`.player:nth-of-type(${playerNum}) line`);
  var contextLocator = By.css(`.player:nth-of-type(${playerNum}) text.context`);

  this.driver.findElements(eventLocators).then(function(elems) {
    return elems.map(function(elem) {
      return thiz.driver.actions().mouseMove(elem).perform()
        .then(function() {
          return thiz.getText(contextLocator).then(function(text) {
            var date = new Date(text.split(' ')[0])
            if (!earliestDate || earliestDate > date) earliestDate = date;
          })
      })
    });
  }).then(function() {
    d.fulfill(earliestDate);
  })

  return d.promise;

};

/****************************************************************************
** Practice - Performance Stats
*****************************************************************************/
PerformancePage.prototype.getPracticeStatsDateTitle = function() {
  var locator = By.xpath(".//div[contains(@class, 'team-summary')]/.//div/div[1]/h3");
  return this.getText(locator);
};

PerformancePage.prototype.getPracticeStatsIntensityTitle = function() {
  var locator = By.xpath(".//div[contains(@class, 'team-summary')]/.//div/div[2]/h3");
  return this.getText(locator);
};

PerformancePage.prototype.clickPracticeStatsTableHeaderFor = function(colName) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamPracticeContainer']/table/thead/tr/th[text()="${colName}"]`);
  return this.click(locator);
};

PerformancePage.prototype.getPracticeStatsTableStatsFor = function(colName) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamPracticeContainer']/table/tbody/tr[@data-tmn-row-type='row']/td[count(//div[@id='tableFootballTeamPracticeContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getTextArray(locator);
};

PerformancePage.prototype.getPracticeStatsTableStatFor = function(rowNum, colName) {
  var locator = By.xpath(`.//div[@id='tableFootballTeamPracticeContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[count(//div[@id='tableFootballTeamPracticeContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getText(locator);
};

PerformancePage.prototype.getPracticeSessionTableStatFor = function(rowNum, colName) {
  var locator = By.xpath(`.//div[@id='tableFootballPlayersPracticeSessionsContainer']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[count(//div[@id='tableFootballPlayersPracticeSessionsContainer']/table/thead/tr/th[text()="${colName}"]/preceding-sibling::th)+1]`);
  return this.getText(locator);
};

PerformancePage.prototype.toggleShowPinnedPlayerSessions = function() {
  var locator = By.css("#tableFootballPlayersPracticeSessionsControls div.btn");
  return this.click(locator);
};

/****************************************************************************
** Practice - Report
*****************************************************************************/
PerformancePage.prototype.changeReportDropdown = function(dropdown, listItem) {
  var dropdownLocator = By.css(`football-performance-report-widget paper-dropdown-menu[label='${dropdown}']`);
  var listItemLocator = By.xpath(`.//paper-dropdown-menu[@label="${dropdown}"]/.//paper-item[text()='${listItem}']`);
  var containerLocator = By.css('.football-performance-report-widget');
  this.click(dropdownLocator);
  this.click(listItemLocator);
  return this.waitUntilStaleness(containerLocator, 1000);
};

PerformancePage.prototype.changeReportPlayersDropdown = function(dropdown, listItem) {
  var dropdownLocator = By.css(`football-performance-report-widget paper-dropdown-menu[label='${dropdown}']`);
  var listItemLocator = By.xpath(`.//paper-dropdown-menu[@label="${dropdown}"]/.//paper-item/div[contains(text(),'${listItem}')]`);
  var containerLocator = By.css('.football-performance-report-widget');
  this.click(dropdownLocator);
  this.click(listItemLocator);
  return this.waitUntilStaleness(containerLocator, 1000);
};

PerformancePage.prototype.reportSectionDisplayed = function(section) {
  var locator = PRACTICE_REPORT_SECTIONS[section];
  return this.isDisplayed(locator, 100);
};

PerformancePage.prototype.reportPositionDisplayed = function(position) {
  var locator = By.id('position-'+position);
  return this.isDisplayed(locator, 100);
};

PerformancePage.prototype.reportPlayerDisplayed = function(player) {
  var locator = By.xpath(`.//football-performance-report-player/.//h3[contains(text(),'${player}')]`);
  return this.isDisplayed(locator, 100);
}

PerformancePage.prototype.getReportPlayerStat = function(player, stat) {
  var locator = By.xpath(`.//football-performance-report-player[div/div/h3[contains(text(),'${player}')]]/.//div[div[text()='${stat}']]/div/span[1]`);
  return this.getText(locator);
};

PerformancePage.prototype.getReportPlayerStatChange = function(player, stat) {
  var locator = By.xpath(`.//football-performance-report-player[div/div/h3[contains(text(),'${player}')]]/.//div[div[text()='${stat}']]/div/span[3]`);
  return this.getText(locator);
};





module.exports = PerformancePage;