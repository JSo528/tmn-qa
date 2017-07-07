'use strict';

// Load Base Page
var BasePage = require('../../../pages/base/base_page.js')

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;
var Key = require('selenium-webdriver').Key

// Mixins
var _ = require('underscore');
var inputs = require('../mixins/inputs.js');

/****************************************************************************
** Locators
*****************************************************************************/
var PROFILE_DRAFT_POSITION_DROPDOWN = By.xpath(".//div[@inject='player.draft.position']/.//div[contains(@class,'dropdown control')]");

var PLAYER_LINK = By.css(".title .link a");

/****************************************************************************
** Constructor
*****************************************************************************/
function HrtTestingReportPage(driver) {
  BasePage.call(this, driver);
};

HrtTestingReportPage.prototype = Object.create(BasePage.prototype);
HrtTestingReportPage.prototype.constructor = HrtTestingReportPage;

// Mixins
_.extend(HrtTestingReportPage.prototype, inputs);

/****************************************************************************
** Functions
*****************************************************************************/
HrtTestingReportPage.prototype.clickPlayerLink = function() {
  return this.click(PLAYER_LINK);
};

HrtTestingReportPage.prototype.waitForPageToLoad = function() {
  return this.waitForEnabled(By.css('.hrt-testing-report'));
};

/****************************************************************************
** Profile
*****************************************************************************/
HrtTestingReportPage.prototype.getProfileStat = function(field) {
  var locator = By.xpath(`.//div[@class='well']/.//div[div/label[text()='${field}']]/.//input`);
  return this.getInput(locator);
};

HrtTestingReportPage.prototype.changeProfileStat = function(field, value) {
  var locator = By.xpath(`.//div[@class='well']/.//div[div/label[text()='${field}']]/.//input`);
  return this.changeInput(locator, value);
};

HrtTestingReportPage.prototype.changeProfileReportDate = function(date) {
  var locator = By.xpath(`.//div[@class='well']/.//div[div/label[text()='Report Date']]/.//input`)
  return this.changeDatePicker(locator, date.year, date.month, date.day)
};

HrtTestingReportPage.prototype.changeProfileDraftPosition = function(value) {
  var optionLocator = By.xpath(`.//div[@inject='player.draft.position']/.//ul[@class='dropdown-menu']/li[text()='${value}']`);
  return this.changeDropdown(PROFILE_DRAFT_POSITION_DROPDOWN, optionLocator)
};

HrtTestingReportPage.prototype.getProfileDraftPosition = function() {
  return this.getDropdown(PROFILE_DRAFT_POSITION_DROPDOWN);
};

/****************************************************************************
** Sigma Motivation
*****************************************************************************/
HrtTestingReportPage.prototype.changeSigmaMotivationField = function(field, grade) {
  var d = Promise.defer();
  var locator = By.css(`div[inject='${field}']`);

  this.getCssValue(locator, 'width').then(function(val) {
    var xVal = parseFloat(val) / 10 * grade - 30;
    if (xVal < 0) xVal = 0;
    d.fulfill(this.clickOffset(locator, parseInt(xVal), 10));
  }.bind(this)) 
  return d.promise;
}

HrtTestingReportPage.prototype.getSigmaMotivationField = function(field) {
  var d = Promise.defer();
  var locator = By.css(`div[inject='${field}']`);
  var barLocator = By.css(`div[inject='${field}'] .bar`);
  

  this.getCssValue(locator, 'width').then(function(totalLength) {
    this.isDisplayed(barLocator, 100).then(function(displayed) {
      if (displayed) {
        this.getCssValue(barLocator, 'width').then(function(barLength) {
          d.fulfill(Math.round(parseFloat(barLength)/parseFloat(totalLength)*10));
        });  
      } else {
        d.fulfill(0)  
      }
    }.bind(this))

  }.bind(this));

  return d.promise;
}

/****************************************************************************
** Scores
*****************************************************************************/
HrtTestingReportPage.prototype.getScoresText = function(field) {
  var locator = By.xpath(`.//div[@inject='${field}']/.//div[contains(@class, 'editor')]`);
  return this.getText(locator);
};

HrtTestingReportPage.prototype.changeScoresText = function(field, value) {
  var locator = By.xpath(`.//div[@inject='${field}']/.//div[contains(@class, 'editor')]`);
  return this.changeTextField(locator, value);
};

HrtTestingReportPage.prototype.getScoresInput = function(field) {
  var locator = By.xpath(`.//div[@inject='${field}']/.//input`);
  return this.getInput(locator);
};

HrtTestingReportPage.prototype.changeScoresInput = function(field, value) {
  var locator = By.xpath(`.//div[@inject='${field}']/.//input`);
  return this.changeInput(locator, value);
};

HrtTestingReportPage.prototype.getOverallProfileScore = function() {
  var locator = By.xpath(`.//div[@inject='overallProfileScore']/.//div[@data-toggle='dropdown']`);
  return this.getDropdown(locator);
};

HrtTestingReportPage.prototype.changeOverallProfileScore = function(value) {
  var locator = By.xpath(`.//div[@inject='overallProfileScore']`);
  var optionLocator = By.xpath(`.//div[@inject='overallProfileScore']/.//ul/li[text()='${value}']`);
  return this.changeDropdown(locator, optionLocator);  
};


/****************************************************************************
** Aggregate Helpers
*****************************************************************************/
HrtTestingReportPage.prototype.getScoresSectionField = function(type, field) {
  switch (type) {
    case 'input':
      return this.getScoresInput(field);
    case 'text':
      return this.getScoresText(field);
    case 'profileScore':
      return this.getOverallProfileScore();
  }
};

HrtTestingReportPage.prototype.changeScoresSectionField = function(type, field, value) {
  switch (type) {
    case 'input':
      return this.changeScoresInput(field, value);
    case 'text':
      return this.changeScoresText(field, value);
    case 'profileScore':
      return this.changeOverallProfileScore(value);
  }
};

HrtTestingReportPage.prototype.getProfileField = function(type, field) {
  switch (type) {
    case 'input':
    case 'reportDate':
      return this.getProfileStat(field);
    case 'draftPosition':
      return this.getProfileDraftPosition(field);
  }
};

HrtTestingReportPage.prototype.changeProfileField = function(type, field, value) {
  switch (type) {
    case 'input':
      return this.changeProfileStat(field, value);
    case 'draftPosition':
      return this.changeProfileDraftPosition(value);
    case 'reportDate':
      return this.changeProfileReportDate(value);
  }
};

module.exports = HrtTestingReportPage;

