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
var SAVE_ICON = By.css('.status');
var GAME_REPORTS_SPACER = By.css('.-game-reports .bottom-spacer i');

var DELETE_BTN = By.css('.evaluation-report .player-headline button');
var PROFILE_POSITION_DROPDOWN = By.xpath(".//div[contains(@class,'player-headline')]/.//div[contains(@class,'dropdown control')]");
var PROFILE_JERSEY_INPUT = By.xpath(".//div[contains(@class,'player-headline')]/div[@class='form-inline row']/.//input");
var PROFILE_GRADE_DROPDOWN = By.css(".dropdown.grade");

// DatePicker
var DAYS_PICKER_SWITCH = By.css('.datepicker-days .picker-switch');
var MONTHS_PICKER_SWITCH = By.css('.datepicker-months .picker-switch');
var DATEPICKER_DAYS_TABLE = By.css(".datepicker .datepicker-days");
var DATEPICKER_MONTHS_TABLE = By.css(".datepicker .datepicker-months");

/****************************************************************************
** Constructor
*****************************************************************************/
function EvaluationReportsPage(driver) {
  BasePage.call(this, driver);
};

EvaluationReportsPage.prototype = Object.create(BasePage.prototype);
EvaluationReportsPage.prototype.constructor = EvaluationReportsPage;

/****************************************************************************
** Functions
*****************************************************************************/
// profiles
EvaluationReportsPage.prototype.getProfileStat = function(field) {
  var locator = By.xpath(`.//div[@class='well']/.//div[div/label[text()='${field}']]/.//input`);
  return this.getAttribute(locator, 'value');
};

EvaluationReportsPage.prototype.changeProfileStat = function(field, value) {
  var locator = By.xpath(`.//div[@class='well']/.//div[div/label[text()='${field}']]/.//input`);
  this.click(locator);
  this.clear(locator); // 1st clear changes it to 0
  this.clear(locator);
  this.sendKeys(locator, value);
  this.sendKeys(locator, Key.ENTER);
  return this.waitUntilStaleness(SAVE_ICON, 500);
};

EvaluationReportsPage.prototype.changeProfileReportDate = function(date) {
  var d = Promise.defer();
  var thiz = this;
  var locator = By.xpath(`.//div[@class='well']/.//div[div/label[text()='Report Date']]/.//input`)
  this.click(locator);
  this.click(locator); // for some reason need to click twice
  this.waitForDisplayed(By.css('.datepicker')).then(function() {
    d.fulfill(thiz.changeDatePicker(date.year, date.month, date.day))
  })

  return d.promise; 
};

EvaluationReportsPage.prototype.changeProfileDraftYear = function(year) {
  var locator = By.xpath(`.//div[@class='well']/.//div[div/label[text()='Draft Year']]/.//input`)
  this.click(locator);
  var yearLocator = By.xpath(`.//div[@class='datepicker']/div[@class='datepicker-years']/table/tbody/tr/td/span[text()='${year}']`)
  this.click(yearLocator);
  return this.waitUntilStaleness(SAVE_ICON, 500);
};

EvaluationReportsPage.prototype.changeProfileOverallGrade = function(value) {
  this.click(PROFILE_GRADE_DROPDOWN);
  var optionLocator = By.xpath(`.//div[contains(@class, 'grade')]/ul/li[contains(text(), '${value}')]`);
  return this.click(optionLocator);
};

EvaluationReportsPage.prototype.getProfileOverallGrade = function() {
  return this.getText(PROFILE_GRADE_DROPDOWN);
};

EvaluationReportsPage.prototype.changeProfilePosition = function(value) {
  this.click(PROFILE_POSITION_DROPDOWN);
  var optionLocator = By.xpath(`.//div[contains(@class,'player-headline')]/.//ul[@class='dropdown-menu']/li[text()='${value}']`);
  return this.click(optionLocator)
};

EvaluationReportsPage.prototype.getProfilePosition = function(value) {
  return this.getText(PROFILE_POSITION_DROPDOWN);
};

EvaluationReportsPage.prototype.changeProfileJersey = function(value) {
  this.click(PROFILE_JERSEY_INPUT);
  this.clear(PROFILE_JERSEY_INPUT);
  this.sendKeys(PROFILE_JERSEY_INPUT, value);
  this.sendKeys(PROFILE_JERSEY_INPUT, Key.ENTER);
  return this.waitUntilStaleness(SAVE_ICON, 500);
};

EvaluationReportsPage.prototype.getProfileJersey = function() {
return this.getAttribute(PROFILE_JERSEY_INPUT, 'value');
};

EvaluationReportsPage.prototype.clickDeleteBtn = function() {
  return this.click(DELETE_BTN);
};

EvaluationReportsPage.prototype.getDeleteBtnText = function() {
  return this.getText(DELETE_BTN);
};

EvaluationReportsPage.prototype.getDeleteBtnBgColor = function() {
  return this.getCssValue(DELETE_BTN, 'background-color');
};

// sections
EvaluationReportsPage.prototype.changeSectionGrade = function(section, grade) {
  var locator = By.xpath(`.//div[@class='well']/.//div[div/div[text()=' ${section} ']]/.//input`);
  this.click(locator);
  this.sendKeys(locator, Key.BACK_SPACE);
  this.sendKeys(locator, grade);
  this.sendKeys(locator, Key.ENTER);
  return this.waitUntilStaleness(SAVE_ICON, 5000);
};

EvaluationReportsPage.prototype.changeSectionText = function(section, text) {
  var labelLocator = By.xpath(`.//div[@class='well'][div/div/div[text()=' ${section} ']]`);
  var locator = By.xpath(`.//div[@class='well'][div/div/div[text()=' ${section} ']]/.//div[contains(@class, '-editor')]`);
  this.click(locator);
  this.clear(locator);
  this.sendKeys(locator, text);
  this.clickOffset(labelLocator, 0, 0);
  return this.waitUntilStaleness(SAVE_ICON, 5000);
};

EvaluationReportsPage.prototype.toggleHelpJagsCheckbox = function() {
  var locator = By.xpath(`.//div[@class='well']/.//div[div/div[text()=' Help Jags ']]/.//i`);
  this.click(locator);
  return this.waitUntilStaleness(SAVE_ICON, 5000);
};

EvaluationReportsPage.prototype.clickGameReportsSpacer = function() {
  var d = Promise.defer();
  var thiz = this;

  this.click(GAME_REPORTS_SPACER, 1000).then(function() {
    d.fulfill(true);
  }, function(err) {
    d.fulfill(thiz.click(GAME_REPORTS_SPACER, 1000));
  });

  return d.promise;
};

EvaluationReportsPage.prototype.getSectionGrade = function(section) {
  var locator = By.xpath(`.//div[@class='well']/.//div[div/div[text()=' ${section} ']]/.//input`);
  return this.getAttribute(locator, 'value');
};

EvaluationReportsPage.prototype.getSectionText = function(section) {
  var locator = By.xpath(`.//div[@class='well'][div/div/div[text()=' ${section} ']]/.//div[contains(@class, '-editor')]`);
  return this.getText(locator);
};

EvaluationReportsPage.prototype.getHelpJagsCheckbox = function() {
  var locator = By.xpath(`.//div[@class='well']/.//div[div/div[text()=' Help Jags ']]/.//i`);
  return this.getText(locator);
};

// Helper
EvaluationReportsPage.prototype.changeDatePicker = function(year, month, day) {
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

module.exports = EvaluationReportsPage;

