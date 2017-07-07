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
var LAST_LOCATOR = By.xpath(".//div[@inject='evaluationReports']/.//table");

var NAME_LINK = By.xpath(".//div[contains(@class,'title')]/div/a");
var MANAGE_DRAFT_LINK = By.xpath(".//div[@inject='player.draftLink']/a");
var MEASURABLES_LINK = By.xpath(".//div[@inject='player.measurablesLink']/a");
var HRT_TESTING_LINK = By.xpath(".//div[@inject='player.hrtTestingLink']/a");

var DELETE_BTN = By.xpath(".//button[@inject='player.deleted']");

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
var CREATE_MEDICAL_REPORT_BTN = By.xpath(".//div[@inject='medicalReports']/.//button[text()=' Create ']");

var EVALUATION_REPORT_AUTHORS_INPUTS = By.xpath(".//div[@inject='evaluationReports']/.//table/tbody/tr/td[3]/div/input");
var SCOUTING_REPORT_AUTHORS_INPUTS = By.xpath(".//div[@inject='scoutingReports']/.//table/tbody/tr/td[4]/div/input");
var INTERVIEW_REPORT_AUTHORS_INPUTS = By.xpath(".//div[@inject='interviewReports']/.//table/tbody/tr/td[3]/div/input");
var REPORT_INJECT_VALUES = {
  'scouting': 'scoutingReports',
  'evaluation': 'evaluationReports',
  'interview': 'interviewReports'
}

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
  return this.waitUntilStaleness(LAST_LOCATOR, 10000);
};

PlayerPage.prototype.getPlayerName = function() {
  return this.getText(NAME_LINK);
};

PlayerPage.prototype.clickManageDraftLink = function() {
  return this.click(MANAGE_DRAFT_LINK);
};

PlayerPage.prototype.clickMeasurablesLink = function() {
  return this.click(MEASURABLES_LINK);
};

PlayerPage.prototype.clickHrtTestingLink = function() {
  return this.click(HRT_TESTING_LINK);
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
  return this.getCheckbox(locator);
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
  return this.changeDatePicker(locator, year);
};

PlayerPage.prototype.getProfileLists = function() {
  var locator = By.xpath(`.//div[@class='player-profile']/.//div[div/label[text()=' Lists ']]/.//span/span`);
  return this.getTextArray(locator);
};

PlayerPage.prototype.addProfileList = function(list) {
  var locator = By.xpath(`.//div[@class='player-profile']/.//div[div/label[text()=' Lists ']]/.//input[2]`)
  return this.changeInputSuggestion(locator, list);
};

PlayerPage.prototype.removeProfileList = function(list) {
  var locator = By.xpath(`.//div[@class='player-profile']/.//div[div/label[text()=' Lists ']]/.//span[span[text()='${list}']]/i`);

  return this.click(locator);
};

PlayerPage.prototype.changeProfileDOB = function(date) {
  var locator = By.xpath(`.//div[@class='player-profile']/.//div[div/label[text()='DOB']]/.//input`)
  return this.changeDatePicker(locator, date.year, date.month, date.day);
};

PlayerPage.prototype.getProfileDOB = function() {
  var locator = By.xpath(`.//div[@class='player-profile']/.//div[div/label[text()='DOB']]/.//input`)
  return this.getAttribute(locator, 'value');
};

PlayerPage.prototype.clickDeleteBtn = function() {
  return this.click(DELETE_BTN);
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

/****************************************************************************
** Reports
*****************************************************************************/
PlayerPage.prototype.clickCreateEvaluationReportBtn = function() {
  return this.click(CREATE_EVALUATION_REPORT_BTN);
};

PlayerPage.prototype.goToEvaluationReport = function(reportNum) {
  return this.click(By.xpath(`.//div[@inject='evaluationReports']/.//table/tbody/tr[${reportNum}]`));
};

PlayerPage.prototype.getEvaluationReportAuthors = function() {
  return this.getInputValueArray(EVALUATION_REPORT_AUTHORS_INPUTS);
};

PlayerPage.prototype.clickCreateScoutingReportBtn = function() {
  return this.click(CREATE_SCOUTING_REPORT_BTN);
};

PlayerPage.prototype.goToScoutingReport = function(reportNum) {
  return this.click(By.xpath(`.//div[@inject='scoutingReports']/.//div[contains(@class, 'table-wrap')]/table/tbody/tr[${reportNum}]`));
};

PlayerPage.prototype.getScoutingReportAuthors = function() {
  return this.getInputValueArray(SCOUTING_REPORT_AUTHORS_INPUTS);
};

PlayerPage.prototype.clickCreateInterviewReportBtn = function() {
  return this.click(CREATE_INTERVIEW_REPORT_BTN);
};

PlayerPage.prototype.goToInterviewReport = function(reportNum) {
  return this.click(By.xpath(`.//div[@inject='interviewReports']/.//table/tbody/tr[${reportNum}]`));
};

PlayerPage.prototype.getInterviewReportAuthors = function() {
  return this.getInputValueArray(INTERVIEW_REPORT_AUTHORS_INPUTS);
};

PlayerPage.prototype.clickCreateMedicalReportBtn = function() {
  return this.click(CREATE_MEDICAL_REPORT_BTN);
};

/****************************************************************************
** Aggregate Helpers
*****************************************************************************/
PlayerPage.prototype.getProfileField = function(type, field) {
  switch (type) {
    case 'input':
    case 'date':
      return this.getProfileInput(field);
    case 'dropdown':
      return this.getProfileDropdown(field);
    case 'checkbox':
      return this.getProfileCheckbox(field);
  }
};

PlayerPage.prototype.changeProfileField = function(type, field, value) {
  switch (type) {
    case 'input':
      return this.changeProfileInput(field, value);
    case 'dropdown':
      return this.changeProfileDropdown(field, value);
    case 'checkbox':
      return this.changeProfileCheckbox(field, value);
    case 'date':
      return this.changeProfileDraftYear(value);
  }
};


// sorting
PlayerPage.prototype.clickReportTableHeader = function(reportName, col) {
  var locator = By.xpath(`.//div[@inject='${REPORT_INJECT_VALUES[reportName]}']/.//table/thead/tr/th[${col}]`);
  this.click(locator);
  var tableLocator = By.xpath(`.//div[@inject='${REPORT_INJECT_VALUES[reportName]}']/.//div[contains(@class, 'table-wrap')]/table`);
  return this.waitUntilStaleness(tableLocator, 5000);
};

PlayerPage.prototype.getStatsForReportAndCol = function(reportName, col) {
  var locator = By.xpath(`.//div[@inject='${REPORT_INJECT_VALUES[reportName]}']/.//table/tbody/tr/td[${col}]/div/input`);
  return this.getInputValueArray(locator);
};

PlayerPage.prototype.clickSortIconForReport = function(reportName, col) {
  var locator = By.xpath(`.//div[@inject='${REPORT_INJECT_VALUES[reportName]}']/.//table/thead/tr/th[${col}]/i[contains(@class, 'material-icons')]`);
  this.click(locator);
  var tableLocator = By.xpath(`.//div[@inject='${REPORT_INJECT_VALUES[reportName]}']/.//div[contains(@class, 'table-wrap')]/table`);
  return this.waitUntilStaleness(tableLocator, 5000);
};

PlayerPage.prototype.clickRemoveSortIconForReport = function(reportName, col) {
  var locator = By.xpath(`.//div[@inject='${REPORT_INJECT_VALUES[reportName]}']/.//table/thead/tr/th[${col}]/i[contains(@class, '-cancel')]`);
  this.click(locator);
  var tableLocator = By.xpath(`.//div[@inject='${REPORT_INJECT_VALUES[reportName]}']/.//div[contains(@class, 'table-wrap')]/table`);
  return this.waitUntilStaleness(tableLocator, 5000);
};

module.exports = PlayerPage;