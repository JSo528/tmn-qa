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
var SEASON_SELECT = By.id('s2id_league');
var WEEK_SELECT = By.id('s2id_week');
var DROPDOWN_INPUT = By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input");

var FOOTER_LINKS = {
  "Stats": 1,
  "Win Probability": 2
}
function MatchesPage(driver, section) {
  BasePage.call(this, driver);
};

MatchesPage.prototype = Object.create(BasePage.prototype);
MatchesPage.prototype.constructor = MatchesPage;

/****************************************************************************
** Functions
*****************************************************************************/
MatchesPage.prototype.changeSeason = function(season) {
  return this.changeDropdown(SEASON_SELECT, DROPDOWN_INPUT, season);
};

MatchesPage.prototype.changeWeek = function(week) {
  return this.changeDropdown(WEEK_SELECT, DROPDOWN_INPUT, week);
};

MatchesPage.prototype.getBoxScoreDatetime = function(boxScoreNum) {
  var d = Promise.defer();
  var locator = By.xpath(`.//div[@class='col-md-5 box-score'][${boxScoreNum}]/div[contains(@class, 'box-score-header-played')]/div/h5`)
  this.getText(locator).then(function(text) {
    d.fulfill(text.split(/\n/)[1]);
  });
  return d.promise;
};

MatchesPage.prototype.getBoxScoreAttendance = function(boxScoreNum) {
  var d = Promise.defer();
  var locator = By.xpath(`.//div[@class='col-md-5 box-score'][${boxScoreNum}]/div[contains(@class, 'box-score-header-played')]/div[2]/h5`)
  this.getText(locator).then(function(text) {
    d.fulfill(text.split(':')[1]);
  });
  return d.promise;
};

MatchesPage.prototype.getBoxScoreScore = function(boxScoreNum) {
  var locator = By.xpath(`.//div[@class='col-md-5 box-score'][${boxScoreNum}]/div[2]/div[2]/div[1]`);
  return this.getText(locator);
};

MatchesPage.prototype.getBoxScoreEventPlayer = function(boxScoreNum, homeOrAway, playerNum) {
  var divNum = homeOrAway == 'home' ? 1 : 3;
  var locator = By.xpath(`.//div[@class='col-md-5 box-score'][${boxScoreNum}]/div[contains(@class, 'box-score-events')]/div[${divNum}]/h6/a[${playerNum}]`)
  return this.getText(locator);
};

MatchesPage.prototype.getBoxScoreTeam = function(boxScoreNum, homeOrAway) {
  var divNum = homeOrAway == "home" ? 1 : 3;
  var teamLink = By.xpath(`.//div[@class='col-md-5 box-score'][${boxScoreNum}]/div[2]/div[${divNum}]/h4/a`);
  return this.getText(teamLink);
};

MatchesPage.prototype.isBoxScoreTeamLogoDisplayed = function(boxScoreNum, homeOrAway) {
  var divNum = homeOrAway == "home" ? 1 : 3;
  var element = By.xpath(`.//div[@class='col-md-5 box-score'][${boxScoreNum}]/div[2]/div[${divNum}]/h4/a/img`);
  return this.isDisplayed(element, 500);
};

MatchesPage.prototype.clickBoxScoreTeam = function(boxScoreNum, homeOrAway) {
  var divNum = homeOrAway == "home" ? 1 : 3;
  var teamLink = By.xpath(`.//div[@class='col-md-5 box-score'][${boxScoreNum}]/div[2]/div[${divNum}]/h4/a`);
  return this.click(teamLink);
};

MatchesPage.prototype.clickBoxScoreEventPlayer = function(boxScoreNum, homeOrAway, playerNum) {
  var divNum = homeOrAway == 'home' ? 1 : 3;
  var locator = By.xpath(`.//div[@class='col-md-5 box-score'][${boxScoreNum}]/div[contains(@class, 'box-score-events')]/div[${divNum}]/h6/a[${playerNum}]`)
  return this.click(locator);
};

MatchesPage.prototype.clickBoxScoreLeague = function(boxScoreNum) {
  var locator = By.xpath(`.//div[@class='col-md-5 box-score'][${boxScoreNum}]/div[contains(@class, 'box-score-header-played')]/div/h5/a`);
  return this.click(locator);
};

MatchesPage.prototype.clickBoxScoreFooter = function(boxScoreNum, type) {
  var linkNum = FOOTER_LINKS[type];
  var link = By.xpath(`.//div[@class='col-md-5 box-score'][${boxScoreNum}]/div[@class='row box-score-footer'][1]/div[@class='col-md-12']/h5/a[${linkNum}]`);
  return this.click(link);
};

MatchesPage.prototype.clickBoxScore = function(boxScoreNum) {
  var link = By.xpath(`.//div[@class='col-md-5 box-score'][${boxScoreNum}]`)
  return this.click(link);
};

module.exports = MatchesPage;