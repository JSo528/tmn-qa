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
var BODY_CONTENT = By.css('.player-profile table');

var NAME_LINK = By.xpath(".//div[contains(@class,'title')]/div/a");
var MANAGE_DRAFT_LINK = By.xpath(".//div[@inject='player.draftLink']/a");

// IncidentReport
var NEW_INCIDENT_REPORT_DIV_NUM = 2
var INCIDENT_REPORT_SPACER = By.css('.-incidents .-show');
var CREATE_INCIDENT_REPORT_BTN = By.css('.-incidents .-create');
var INCIDENT_REPORT_WEEK_INPUT = By.xpath(`.//div[${NEW_INCIDENT_REPORT_DIV_NUM}]/div/div[@class='incident']/.//div[@inject='week']/div`);
var INCIDENT_REPORT_DATE_INPUT = By.xpath(`.//div[${NEW_INCIDENT_REPORT_DIV_NUM}]/div/div[@class='incident']/.//div[@inject='date']/input`);
var INCIDENT_REPORT_TYPE_INPUT = By.xpath(`.//div[${NEW_INCIDENT_REPORT_DIV_NUM}]/div/div[@class='incident']/.//div[@inject='type']/div`);
var INCIDENT_REPORT_COMMENT_INPUT = By.xpath(`.//div[${NEW_INCIDENT_REPORT_DIV_NUM}]/div/div[@class='incident']/.//div[@inject='comment']/div`);
var INCIDENT_DIVS = By.css('.incidents .incident');

// Reports
var CREATE_EVALUATION_REPORT_BTN = By.xpath(".//div[@inject='evaluationReports']/.//button[text()=' Create ']");
var CREATE_SCOUTING_REPORT_BTN = By.xpath(".//div[@inject='scoutingReports']/.//button[text()=' Create ']");
var CREATE_INTERVIEW_REPORT_BTN = By.xpath(".//div[@inject='interviewReports']/.//button[text()=' Create ']");

/****************************************************************************
** Constructor
*****************************************************************************/
function PlayerPage(driver) {
  BasePage.call(this, driver);
};

PlayerPage.prototype = Object.create(BasePage.prototype);
PlayerPage.prototype.constructor = PlayerPage;

// Mixins
_.extend(PlayerPage.prototype, inputs);
_.extend(PlayerPage.prototype, incidentReports);

/****************************************************************************
** Functions
*****************************************************************************/
PlayerPage.prototype.waitForPageToLoad = function() {
  return this.waitForEnabled(BODY_CONTENT, 10000);
};

PlayerPage.prototype.getPlayerName = function() {
  return this.getText(NAME_LINK);
};

PlayerPage.prototype.clickManageDraftLink = function() {
  return this.click(MANAGE_DRAFT_LINK);
};

// Player Profile 
PlayerPage.prototype.changeProfileInput = function(field, value) {
  var locator = By.xpath(`.//div[@class='player-profile']/.//div[div/label[text()='${field}']]/div/div/input`)
  return this.changeInput(locator, value);
};

PlayerPage.prototype.getProfileInput = function(field) {
  var locator = By.xpath(`.//div[@class='player-profile']/.//div[div/label[text()='${field}']]/div/div/input`)
  return this.getInput(locator);
};

PlayerPage.prototype.changeProfileCheckbox = function(field, selected) {
  var locator = By.xpath(`.//div[@class='player-profile']/.//div[div/label[text()='${field}']]/div/div`)
  return this.changeCheckbox(locator, selected);
};

PlayerPage.prototype.getProfileCheckbox = function(field) {
  var locator = By.xpath(`.//div[@class='player-profile']/.//div[div/label[text()='${field}']]/div/div`)
  return this.getText(locator);
};

PlayerPage.prototype.changeProfileDropdown = function(field, value) {
  var locator = By.xpath(`.//div[@class='player-profile']/.//div[div/label[text()='${field}']]/div/div/div`);
  var optionLocator = By.xpath(`.//div[@class='player-profile']/.//div[div/label[text()='${field}']]/div/div/ul/li[text()='${value}']`);
  return this.changeDropdown(locator, optionLocator);
};

PlayerPage.prototype.getProfileDropdown = function(field) {
  var locator = By.xpath(`.//div[@class='player-profile']/.//div[div/label[text()='${field}']]/div/div/div`);
  return this.getDropdown(locator);
};

PlayerPage.prototype.changeProfileDraftYear = function(year) {
  var locator = By.xpath(`.//div[@class='player-profile']/.//div[div/label[text()='Draft Year']]/div/div/input`)
  var yearLocator = By.xpath(`.//div[@class='datepicker']/div[@class='datepicker-years']/table/tbody/tr/td/span[text()='${year}']`)
  return this.changeDropdown(locator, yearLocator);
};

PlayerPage.prototype.getProfileLists = function() {
  var locator = By.xpath(`.//div[@class='player-profile']/.//div[div/label[text()=' Lists ']]/.//span[contains(@class, 'tag')]/span`);
  return this.getTextArray(locator);
};

PlayerPage.prototype.addProfileList = function(list) {
  var locator = By.xpath(`.//div[@class='player-profile']/.//div[div/label[text()=' Lists ']]/.//input[2]`)
  return this.changeInputSuggestion(locator, list);
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

// Reports
PlayerPage.prototype.clickCreateEvaluationReportBtn = function() {
  return this.click(CREATE_EVALUATION_REPORT_BTN);
};

PlayerPage.prototype.goToEvaluationReport = function(reportNum) {
  return this.click(By.xpath(`.//div[@inject='evaluationReports']/.//table/tbody/tr[${reportNum}]`));
};

PlayerPage.prototype.clickCreateScoutingReportBtn = function() {
  return this.click(CREATE_SCOUTING_REPORT_BTN);
};

PlayerPage.prototype.goToScoutingReport = function(reportNum) {
  return this.click(By.xpath(`.//div[@inject='scoutingReports']/.//table/tbody/tr[${reportNum}]`));
};

PlayerPage.prototype.clickCreateInterviewReportBtn = function() {
  return this.click(CREATE_INTERVIEW_REPORT_BTN);
};

PlayerPage.prototype.goToInterviewReport = function(reportNum) {
  return this.click(By.xpath(`.//div[@inject='interviewReports']/.//table/tbody/tr[${reportNum}]`));
};
module.exports = PlayerPage;