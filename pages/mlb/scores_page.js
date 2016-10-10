'use strict';

// Load Base Page
var BasePage = require('../../pages/base/base_page.js')

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;
var Key = require('selenium-webdriver').Key;

// Locators
var DATE_INPUT = By.id('pageControlBaseballGameDate');
var SEASON_LEVEL_SELECT = By.id('s2id_pageControlBaseballSeasonLevelSingle');
var SEASON_LEVEL_INPUT = By.id('s2id_autogen1_search');
var CALENDAR = By.className('pika-single');

function ScoresPage(driver) {
  BasePage.call(this, driver);
};

ScoresPage.prototype = Object.create(BasePage.prototype);
ScoresPage.prototype.constructor = ScoresPage;

// Certain elements get added/updated after the page loads
ScoresPage.prototype.waitForPageToFullyLoad = function() {
  return this.driver.wait(Until.elementLocated(By.xpath(".//div[contains(@class, 'pika-single')]")));
};

// boxScoreNum is the 1st, 2nd, 3rd, etc. box score on the page
// boxScoreNum=1 -> 1st box score on the page
ScoresPage.prototype.getBoxScoreDatetime = function(boxScoreNum) {
  var boxScore = By.xpath(`.//div[@class='col-md-5 box-score'][${boxScoreNum}]/div[@class='row box-score-header-final']/div[@class='col-md-6']/h5`)
  return this.getText(boxScore);
};

// homeOrAway takes in "home" or "away" string. Anything other than "home" input will result in "away"
ScoresPage.prototype.getBoxScoreRunsForInning = function(boxScoreNum, homeOrAway, inning) {
  var team = homeOrAway == "home" ? 2 : 1
  inning += 1
  var element = By.xpath(`.//div[@class='col-md-5 box-score'][${boxScoreNum}]/div[@class='row'][1]/table/tbody/tr[${team}]/td[${inning}]`)
  return this.getText(element);
};

ScoresPage.prototype.getBoxScoreTotalRuns = function(boxScoreNum, homeOrAway) {
  var team = homeOrAway == "home" ? 2 : 1
  var element = By.xpath(`.//div[@class='col-md-5 box-score'][${boxScoreNum}]/div[@class='row'][1]/table/tbody/tr[${team}]/td[12]`);
  return this.getText(element);
};

ScoresPage.prototype.getBoxScoreRowColor = function(boxScoreNum, homeOrAway) {
  var team = homeOrAway == "home" ? 2 : 1
  
  var element = By.xpath(`.//div[@class='col-md-5 box-score'][${boxScoreNum}]/div[@class='row'][1]/table/tbody/tr[${team}]`);
  return this.getCssValue(element, 'background-color');
};

ScoresPage.prototype.getBoxScorePitcher = function(boxScoreNum, pitcherType) {
  var linkNum; 
  switch (pitcherType) {
    case "win":
      linkNum = 1;
      break;
    case "loss":
      linkNum = 2;
      break;
    case "save":
      linkNum = 3;
      break
    default: 
      linkNum = 1;
  }

  var element = By.xpath(`.//div[@class='col-md-5 box-score'][${boxScoreNum}]/div[@class='row'][2]/div[@class='col-md-12']/a[${linkNum}]`);
  return this.getText(element);
};

ScoresPage.prototype.getCalendarDate = function() {
  return this.getAttribute(DATE_INPUT);
};

ScoresPage.prototype.teamLogoDisplayed = function(boxScoreNum, homeOrAway) {
  var team = homeOrAway == "home" ? 2 : 1
  var locator = By.xpath(`.//div[@class='col-md-5 box-score'][${boxScoreNum}]/div[@class='row'][1]/table/tbody/tr[${team}]/td[1]/img`);
  return this.isDisplayed(locator, 2000);
};

ScoresPage.prototype.changeDate = function(date) {
  this.waitForPageToFullyLoad();
  this.click(DATE_INPUT);
  this.waitForEnabled(CALENDAR, 30000);
  this.clear(DATE_INPUT);
  this.sendKeys(DATE_INPUT, date);
  return this.sendKeys(DATE_INPUT, Key.ENTER);
};

ScoresPage.prototype.changeSeasonLevel = function(seasonLevel) {
  return this.changeDropdown(SEASON_LEVEL_SELECT, SEASON_LEVEL_INPUT, seasonLevel)
};

ScoresPage.prototype.clickTeam = function(boxScoreNum, homeOrAway) {
  var team = homeOrAway == "home" ? 2 : 1
  var teamLink = By.xpath(`.//div[@class='col-md-5 box-score'][${boxScoreNum}]/div[@class='row'][1]/table/tbody/tr[${team}]/td[1]/a`);
  var element = this.driver.findElement(teamLink);
  return element.click();
};

ScoresPage.prototype.clickPitcher = function(boxScoreNum, pitcherType) {
  var linkNum; 
  switch (pitcherType) {
    case "win":
      linkNum = 1;
      break;
    case "loss":
      linkNum = 2;
      break;
    case "save":
      linkNum = 3;
      break
    default: 
      linkNum = 1;
  }

  var pitcherLink = By.xpath(`.//div[@class='col-md-5 box-score'][${boxScoreNum}]/div[@class='row'][2]/div[@class='col-md-12']/a[${linkNum}]`);
  return this.click(pitcherLink);
};

ScoresPage.prototype.clickBoxScoreFooter = function(boxScoreNum, type) {
  var linkNum; 
  switch (type) {
    case "Batting":
      linkNum = 1;
      break;
    case "Pitching":
      linkNum = 2;
      break;
    case "Pitch By Pitch":
      linkNum = 3;
      break
    case "Pitching Splits":
      linkNum = 4;
      break      
    default: 
      linkNum = 1;
  }

  var link = By.xpath(`.//div[@class='col-md-5 box-score'][${boxScoreNum}]/div[@class='row box-score-footer'][1]/div[@class='col-md-12']/h5/a[${linkNum}]`);
  return this.click(link);
};

ScoresPage.prototype.clickBoxScore = function(boxScoreNum) {
  this.waitForPageToFullyLoad();
  var link = By.xpath(`.//div[@class='col-md-5 box-score'][${boxScoreNum}]`)
  return this.click(link);
};

module.exports = ScoresPage;