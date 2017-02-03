'use strict';

// Load Base Page
var BasePage = require('../../../pages/base/base_page.js');

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;
var Key = require('selenium-webdriver').Key;

/****************************************************************************
** Locators
*****************************************************************************/
var YEAR_SELECT = By.id('s2id_pageControlFootballYear');
var WEEK_SELECT = By.id('s2id_pageControlFootballWeekSingle');
var DROPDOWN_INPUT = By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input");

var FOOTER_LINKS = {
  "Box Score": 1,
  "Team Summary": 2,
  "Play By Play": 3,
  "Drives": 4
}
function ScoresPage(driver, section) {
  BasePage.call(this, driver);
};

ScoresPage.prototype = Object.create(BasePage.prototype);
ScoresPage.prototype.constructor = ScoresPage;

/****************************************************************************
** Functions
*****************************************************************************/
ScoresPage.prototype.changeYearAndWeek = function(year, week) {
  this.changeDropdown(YEAR_SELECT, DROPDOWN_INPUT, year);
  return this.changeDropdown(WEEK_SELECT, DROPDOWN_INPUT, week);
};

ScoresPage.prototype.getBoxScoreDatetime = function(boxScoreNum) {
  var boxScore = By.xpath(`.//div[@class='col-md-5 box-score'][${boxScoreNum}]/div[@class='row box-score-header-final']/div[@class='col-md-6']/h5`)
  return this.getText(boxScore);
};

ScoresPage.prototype.getBoxScorePtsForQuarter = function(boxScoreNum, homeOrAway, quarter) {
  var team = homeOrAway == "home" ? 2 : 1
  var colNum = quarter + 1;
  var element = By.xpath(`.//div[@class='col-md-5 box-score'][${boxScoreNum}]/div[@class='row'][1]/table/tbody/tr[${team}]/td[${colNum}]`)
  return this.getText(element);
};

ScoresPage.prototype.getBoxScoreTotalPts = function(boxScoreNum, homeOrAway) {
  var team = homeOrAway == "home" ? 2 : 1
  var element = By.xpath(`.//div[@class='col-md-5 box-score'][${boxScoreNum}]/div[@class='row'][1]/table/tbody/tr[${team}]/td[last()]`);
  return this.getText(element);
};

ScoresPage.prototype.getBoxScoreTeam = function(boxScoreNum, homeOrAway) {
  var team = homeOrAway == "home" ? 2 : 1
  var element = By.xpath(`.//div[@class='col-md-5 box-score'][${boxScoreNum}]/div[@class='row'][1]/table/tbody/tr[${team}]/td[1]`);
  return this.getText(element);
};

ScoresPage.prototype.teamLogoDisplayed = function(boxScoreNum, homeOrAway) {
  var team = homeOrAway == "home" ? 2 : 1
  var locator = By.xpath(`.//div[@class='col-md-5 box-score'][${boxScoreNum}]/div[@class='row'][1]/table/tbody/tr[${team}]/td[1]/img`);
  return this.isDisplayed(locator, 2000);
};

ScoresPage.prototype.getBoxScoreRowColor = function(boxScoreNum, homeOrAway) {
  var team = homeOrAway == "home" ? 2 : 1
  var element = By.xpath(`.//div[@class='col-md-5 box-score'][${boxScoreNum}]/div[@class='row'][1]/table/tbody/tr[${team}]`);
  return this.getCssValue(element, 'background-color');
};

ScoresPage.prototype.clickTeam = function(boxScoreNum, homeOrAway) {
  var team = homeOrAway == "home" ? 2 : 1
  var teamLink = By.xpath(`.//div[@class='col-md-5 box-score'][${boxScoreNum}]/div[@class='row'][1]/table/tbody/tr[${team}]/td[1]/a`);
  return this.click(teamLink);
};

ScoresPage.prototype.clickBoxScoreFooter = function(boxScoreNum, type) {
  var linkNum = FOOTER_LINKS[type];
  var link = By.xpath(`.//div[@class='col-md-5 box-score'][${boxScoreNum}]/div[@class='row box-score-footer'][1]/div[@class='col-md-12']/h5/a[${linkNum}]`);
  return this.click(link);
};

ScoresPage.prototype.clickBoxScore = function(boxScoreNum) {
  var link = By.xpath(`.//div[@class='col-md-5 box-score'][${boxScoreNum}]`)
  return this.click(link);
};


module.exports = ScoresPage;