'use strict';

// Load Base Page
var BasePage = require('../../../pages/base/base_page.js')

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;
var Key = require('selenium-webdriver').Key

/****************************************************************************
** Locators
*****************************************************************************/
var NAME_LINK = By.xpath(".//div[contains(@class,'title')]/div/a");
var BODY_CONTENT = By.css('.player-profile table');
var SAVE_ICON = By.css('.status');


// IncidentReport
var INCIDENT_REPORT_SPACER = By.css('.-incidents .-show');
var CREATE_INCIDENT_REPORT_BTN = By.css('.-incidents .-create');
var INCIDENT_REPORT_WEEK_INPUT = By.xpath(".//div[@class='incident']/div/div/.//div[@inject='week']/div");
var INCIDENT_REPORT_DATE_INPUT = By.xpath(".//div[@class='incident']/div/div/.//div[@inject='date']/input");
var INCIDENT_REPORT_TYPE_INPUT = By.xpath(".//div[@class='incident']/div/div/.//div[@inject='type']/div");
var INCIDENT_REPORT_COMMENT_INPUT = By.xpath(".//div[@class='incident']/div/div/.//div[@inject='comment']/div");
var INCIDENT_DIVS = By.css('.incidents .incident');

// Reports
var CREATE_EVALUATION_REPORT_BTN = By.xpath(".//div[@inject='evaluationReports']/.//button[text()=' Create ']");
var CREATE_SCOUTING_REPORT_BTN = By.xpath(".//div[@inject='scoutingReports']/.//button[text()=' Create ']");

// DatePicker
var DAYS_PICKER_SWITCH = By.css('.datepicker-days .picker-switch');
var MONTHS_PICKER_SWITCH = By.css('.datepicker-months .picker-switch');
var DATEPICKER_DAYS_TABLE = By.css(".datepicker .datepicker-days");
var DATEPICKER_MONTHS_TABLE = By.css(".datepicker .datepicker-months");

/****************************************************************************
** Constructor
*****************************************************************************/
function PlayerPage(driver) {
  BasePage.call(this, driver);
};

PlayerPage.prototype = Object.create(BasePage.prototype);
PlayerPage.prototype.constructor = PlayerPage;

/****************************************************************************
** Functions
*****************************************************************************/
PlayerPage.prototype.waitForPageToLoad = function() {
  return this.waitForEnabled(BODY_CONTENT, 10000);
};

PlayerPage.prototype.getPlayerName = function() {
  return this.getText(NAME_LINK);
};

// Player Profile 
PlayerPage.prototype.changeProfileInput = function(field, value) {
  var locator = By.xpath(`.//div[@class='player-profile']/.//div[div/label[text()='${field}']]/div/div/input`)
  this.click(locator);
  this.clear(locator);
  this.sendKeys(locator, value);
  this.sendKeys(locator, Key.ENTER);
  return this.waitUntilStaleness(SAVE_ICON);
};

PlayerPage.prototype.getProfileInput = function(field) {
  var locator = By.xpath(`.//div[@class='player-profile']/.//div[div/label[text()='${field}']]/div/div/input`)
  return this.driver.findElement(locator).getAttribute('value');
};

PlayerPage.prototype.toggleProfileCheckbox = function(field) {
  var locator = By.xpath(`.//div[@class='player-profile']/.//div[div/label[text()='${field}']]/div/div`)
  this.click(locator);
  return this.waitUntilStaleness(SAVE_ICON);
};

PlayerPage.prototype.getProfileCheckbox = function(field) {
  var locator = By.xpath(`.//div[@class='player-profile']/.//div[div/label[text()='${field}']]/div/div`)
  return this.getText(locator);
};

PlayerPage.prototype.changeProfileDropdown = function(field, value) {
  var locator = By.xpath(`.//div[@class='player-profile']/.//div[div/label[text()='${field}']]/div/div/div`);
  this.click(locator);
  var optionLocator = By.xpath(`.//div[@class='player-profile']/.//div[div/label[text()='${field}']]/div/div/ul/li[text()='${value}']`);
  this.click(optionLocator);
  return this.waitUntilStaleness(SAVE_ICON);
};

PlayerPage.prototype.getProfileDropdown = function(field) {
  var locator = By.xpath(`.//div[@class='player-profile']/.//div[div/label[text()='${field}']]/div/div/div`);
  return this.getText(locator);
};

PlayerPage.prototype.changeProfileDraftYear = function(year) {
  var locator = By.xpath(`.//div[@class='player-profile']/.//div[div/label[text()='Draft Year']]/div/div/input`)
  this.click(locator);
  var yearLocator = By.xpath(`.//div[@class='datepicker']/div[@class='datepicker-years']/table/tbody/tr/td/span[text()='${year}']`)
  this.click(yearLocator);
  return this.waitUntilStaleness(SAVE_ICON);
};

PlayerPage.prototype.getProfileLists = function() {
  var locator = By.xpath(`.//div[@class='player-profile']/.//div[div/label[text()=' Lists ']]/.//span[contains(@class, 'tag')]/span`);
  return this.getTextArray(locator);
};

PlayerPage.prototype.addProfileList = function(list) {
  var locator = By.xpath(`.//div[@class='player-profile']/.//div[div/label[text()=' Lists ']]/.//input[2]`)
  this.click(locator);
  this.clear(locator);
  this.sendKeys(locator, list);
  this.sendKeys(locator, Key.ENTER);
  return this.waitUntilStaleness(SAVE_ICON);
};

PlayerPage.prototype.removeProfileList = function(list) {
  var locator = By.xpath(`.//div[@class='player-profile']/.//div[div/label[text()=' Lists ']]/.//span[contains(@class, 'tag')][span[text()='${list}']]/i`);
  return this.click(locator);
};

PlayerPage.prototype.changeProfileDOB = function(date) {
  var locator = By.xpath(`.//div[@class='player-profile']/.//div[div/label[text()='DOB']]/.//input`)
  this.click(locator);
  return this.changeDatePicker(date.year, date.month, date.day);
};

PlayerPage.prototype.getProfileDOB = function() {
  var locator = By.xpath(`.//div[@class='player-profile']/.//div[div/label[text()='DOB']]/.//input`)
  return this.getAttribute(locator, 'value');
};

// Statistics
PlayerPage.prototype.getStatTableHeader = function(col) {
  var locator = By.xpath(`.//div[@inject='stats']/.//table/thead/tr/th[${col}]`);
  return this.getText(locator);
};

PlayerPage.prototype.getStatTableValue = function(row, col) {
  var locator = By.xpath(`.//div[@inject='stats']/.//table/tbody/tr[${row}]/td[${col}]/div/input`);
  return this.driver.findElement(locator).getAttribute('value');
};

// Incidence Reports
PlayerPage.prototype.clickIncidentReportSpacer = function() {
  return this.click(INCIDENT_REPORT_SPACER);
};

// week: TC, P1, W1, etc.
// date: {year: 2015, month: 'Jan', day: 11}
// type: C, X, IR
// comment: text
PlayerPage.prototype.createIncidentReport = function(week, date, type, comment) {
  this.click(CREATE_INCIDENT_REPORT_BTN);

  // week
  this.click(INCIDENT_REPORT_WEEK_INPUT);
  var weekOptionLocator = By.xpath(`.//div[@class='incident']/div/div/.//div[@inject='week']/ul/li[text()='${week}']`);
  this.click(weekOptionLocator);

  // date
  this.click(INCIDENT_REPORT_DATE_INPUT);
  this.changeDatePicker(date.year, date.month, date.day);

  // type
  this.click(INCIDENT_REPORT_TYPE_INPUT);
  var typeOptionLocator = By.xpath(`.//div[@class='incident']/div/div/.//div[@inject='type']/ul/li[text()='${type}']`);
  this.click(typeOptionLocator);

  // comment
  this.click(INCIDENT_REPORT_COMMENT_INPUT);
  this.clear(INCIDENT_REPORT_COMMENT_INPUT);
  this.sendKeys(INCIDENT_REPORT_COMMENT_INPUT, comment);
  return this.sendKeys(INCIDENT_REPORT_COMMENT_INPUT, Key.TAB);
};

PlayerPage.prototype.getIncidentReportCount = function() {
  return this.getElementCount(INCIDENT_DIVS);
};

PlayerPage.prototype.getIncidentReportValue = function(reportNum, field) {
  if (field =='date') {
    var locator = By.xpath(`.//div[contains(@class,'incidents')]/div/div[${reportNum}]/.//div[@inject='date']/input`);
    return this.getAttribute(locator, 'value');
  } else {
    var locator = By.xpath(`.//div[contains(@class,'incidents')]/div/div[${reportNum}]/.//div[@inject='${field}']/div`);
    return this.getText(locator);
  }
};

// Reports
PlayerPage.prototype.clickCreateEvaluationReportBtn = function() {
  return this.click(CREATE_EVALUATION_REPORT_BTN);
};

PlayerPage.prototype.clickCreateScoutingReportBtn = function() {
  return this.click(CREATE_SCOUTING_REPORT_BTN);
};


// Helper
PlayerPage.prototype.changeDatePicker = function(year, month, day) {
  var d = Promise.defer();
  var thiz = this;
  this.isDisplayed(DATEPICKER_DAYS_TABLE, 500).then(function(displayed) {
    if (displayed) { thiz.click(DAYS_PICKER_SWITCH); };
  }).then(function() {
    thiz.isDisplayed(DATEPICKER_MONTHS_TABLE, 500).then(function(displayed) {
      if (displayed) { thiz.click(MONTHS_PICKER_SWITCH); };
    });
  }).then(function() {
    var yearLocator = By.xpath(`.//div[@class='datepicker-years']/table/tbody/tr/td/span[text()='${year}']`);
    thiz.click(yearLocator, 500);
    var monthLocator = By.xpath(`.//div[@class='datepicker-months']/table/tbody/tr/td/span[text()='${month}']`);
    thiz.click(monthLocator, 500);
    var dayLocator  = By.xpath(`.//div[@class='datepicker-days']/table/tbody/tr/td[not(contains(@class,'old'))][text()='${day}']`);
    d.fulfill(thiz.click(dayLocator, 500));
  });  

  return d.promise;
};


module.exports = PlayerPage;