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
var incidentReports = require('../mixins/incidentReports.js');

/****************************************************************************
** Locators
*****************************************************************************/
var GAME_REPORTS_SPACER = By.css('.-game-reports .bottom-spacer i');

var DELETE_BTN = By.css('.evaluation-report .player-headline button');
var PROFILE_POSITION_DROPDOWN = By.xpath(".//div[contains(@class,'player-headline')]/.//div[contains(@class,'dropdown control')]");
var PROFILE_JERSEY_INPUT = By.xpath(".//div[contains(@class,'player-headline')]/div[@class='form-inline row']/.//input");
var PROFILE_GRADE_DROPDOWN = By.css(".dropdown.grade");

/****************************************************************************
** Constructor
*****************************************************************************/
function EvaluationReportPage(driver) {
  BasePage.call(this, driver);
};

EvaluationReportPage.prototype = Object.create(BasePage.prototype);
EvaluationReportPage.prototype.constructor = EvaluationReportPage;

// Mixins
_.extend(EvaluationReportPage.prototype, inputs);
_.extend(EvaluationReportPage.prototype, incidentReports);

/****************************************************************************
** Functions
*****************************************************************************/
// profiles
EvaluationReportPage.prototype.getProfileStat = function(field) {
  var locator = By.xpath(`.//div[@class='well']/.//div[div/label[text()='${field}']]/.//input`);
  return this.getInput(locator);
};

EvaluationReportPage.prototype.changeProfileStat = function(field, value) {
  var locator = By.xpath(`.//div[@class='well']/.//div[div/label[text()='${field}']]/.//input`);
  return this.changeInput(locator, value);
};

EvaluationReportPage.prototype.changeProfileReportDate = function(date) {
  var locator = By.xpath(`.//div[@class='well']/.//div[div/label[text()='Report Date']]/.//input`)
  return this.changeDatePicker(locator, date.year, date.month, date.day)
};

EvaluationReportPage.prototype.changeProfileDraftYear = function(year) {
  var locator = By.xpath(`.//div[@class='well']/.//div[div/label[text()='Draft Year']]/.//input`)
  var yearLocator = By.xpath(`.//div[@class='datepicker']/div[@class='datepicker-years']/table/tbody/tr/td/span[text()='${year}']`)
  return this.changeDropdown(locator, yearLocator);
};

EvaluationReportPage.prototype.changeProfileOverallGrade = function(value) {
  var optionLocator = By.xpath(`.//div[contains(@class, 'grade')]/ul/li[contains(text(), '${value}')]`);
  return this.changeDropdown(PROFILE_GRADE_DROPDOWN, optionLocator);
};

EvaluationReportPage.prototype.getProfileOverallGrade = function() {
  return this.getDropdown(PROFILE_GRADE_DROPDOWN);
};

EvaluationReportPage.prototype.changeProfilePosition = function(value) {
  var optionLocator = By.xpath(`.//div[contains(@class,'player-headline')]/.//ul[@class='dropdown-menu']/li[text()='${value}']`);
  return this.changeDropdown(PROFILE_POSITION_DROPDOWN, optionLocator)
};

EvaluationReportPage.prototype.getProfilePosition = function(value) {
  return this.getDropdown(PROFILE_POSITION_DROPDOWN);
};

EvaluationReportPage.prototype.changeProfileJersey = function(value) {
  return this.changeInput(PROFILE_JERSEY_INPUT, value);
};

EvaluationReportPage.prototype.getProfileJersey = function() {
return this.getInput(PROFILE_JERSEY_INPUT);
};

EvaluationReportPage.prototype.clickDeleteBtn = function() {
  return this.click(DELETE_BTN);
};

EvaluationReportPage.prototype.getDeleteBtnText = function() {
  return this.getText(DELETE_BTN);
};

EvaluationReportPage.prototype.getDeleteBtnBgColor = function() {
  return this.getCssValue(DELETE_BTN, 'background-color');
};

// sections
EvaluationReportPage.prototype.changeSectionGrade = function(section, grade) {
  var locator = By.xpath(`.//div[@class='well']/.//div[div/div[text()=' ${section} ']]/.//input`);
  return this.changeInput(locator, grade)
};

EvaluationReportPage.prototype.changeSectionText = function(section, text) {
  var locator = By.xpath(`.//div[@class='well'][div/div/div[text()=' ${section} ']]/.//div[contains(@class, '-editor')]`);
  return this.changeTextField(locator, text);
};

EvaluationReportPage.prototype.changeHelpJagsCheckbox = function(selected) {
  var locator = By.xpath(`.//div[@class='well']/.//div[div/div[text()=' Help Jags ']]/.//i`);
  return this.changeCheckbox(locator, selected)
};

EvaluationReportPage.prototype.clickGameReportsSpacer = function() {
  var d = Promise.defer();
  var thiz = this;

  this.click(GAME_REPORTS_SPACER, 1000).then(function() {
    d.fulfill(true);
  }, function(err) {
    d.fulfill(thiz.click(GAME_REPORTS_SPACER, 1000));
  });

  return d.promise;
};

EvaluationReportPage.prototype.getSectionGrade = function(section) {
  var locator = By.xpath(`.//div[@class='well']/.//div[div/div[text()=' ${section} ']]/.//input`);
  return this.getInput(locator);
};

EvaluationReportPage.prototype.getSectionText = function(section) {
  var locator = By.xpath(`.//div[@class='well'][div/div/div[text()=' ${section} ']]/.//div[contains(@class, '-editor')]`);
  return this.getTextField(locator);
};

EvaluationReportPage.prototype.getHelpJagsCheckbox = function() {
  var locator = By.xpath(`.//div[@class='well']/.//div[div/div[text()=' Help Jags ']]/.//i`);
  return this.getCheckbox(locator);
};

module.exports = EvaluationReportPage;

