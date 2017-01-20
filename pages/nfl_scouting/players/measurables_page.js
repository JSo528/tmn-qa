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
var CREATE_BUTTON = By.xpath(".//tbody[@class='-controls controls']/.//button[contains(@class,'-create')]");

/****************************************************************************
** Constructor
*****************************************************************************/
function MeasurablesPage(driver) {
  BasePage.call(this, driver);
};

MeasurablesPage.prototype = Object.create(BasePage.prototype);
MeasurablesPage.prototype.constructor = MeasurablesPage;

// Mixins
_.extend(MeasurablesPage.prototype, inputs);

/****************************************************************************
** Functions
*****************************************************************************/
MeasurablesPage.prototype.clickCreateButton = function() {
  return this.click(CREATE_BUTTON);
};

MeasurablesPage.prototype.changeInput = function(rowNum, field, value) {
  return this.click(CREATE_BUTTON);
};

// MeasurablesPage.prototype.waitForPageToLoad = function() {
//   return this.waitForEnabled(BODY_CONTENT, 10000);
// };

// MeasurablesPage.prototype.getPlayerName = function() {
//   return this.getText(NAME_LINK);
// };

// MeasurablesPage.prototype.clickManageDraftLink = function() {
//   return this.click(MANAGE_DRAFT_LINK);
// };

// MeasurablesPage.prototype.clickMeasurablesLink = function() {
//   return this.click(MEASURABLES_LINK);
// };

// // Player Profile 
// MeasurablesPage.prototype.changeProfileInput = function(field, value) {
//   var locator = By.xpath(`.//div[@class='player-profile']/.//div[div/label[text()='${field}']]/div/div/input`)
//   return this.changeInput(locator, value);
// };

// MeasurablesPage.prototype.getProfileInput = function(field) {
//   var locator = By.xpath(`.//div[@class='player-profile']/.//div[div/label[text()='${field}']]/div/div/input`)
//   return this.getInput(locator);
// };

// MeasurablesPage.prototype.changeProfileCheckbox = function(field, selected) {
//   var locator = By.xpath(`.//div[@class='player-profile']/.//div[div/label[text()='${field}']]/div/div`)
//   return this.changeCheckbox(locator, selected);
// };

// MeasurablesPage.prototype.getProfileCheckbox = function(field) {
//   var locator = By.xpath(`.//div[@class='player-profile']/.//div[div/label[text()='${field}']]/div/div`)
//   return this.getCheckbox(locator);
// };

// MeasurablesPage.prototype.changeProfileDropdown = function(field, value) {
//   var locator = By.xpath(`.//div[@class='player-profile']/.//div[div/label[text()='${field}']]/div/div/div`);
//   var optionLocator = By.xpath(`.//div[@class='player-profile']/.//div[div/label[text()='${field}']]/div/div/ul/li[text()='${value}']`);
//   return this.changeDropdown(locator, optionLocator);
// };

// MeasurablesPage.prototype.getProfileDropdown = function(field) {
//   var locator = By.xpath(`.//div[@class='player-profile']/.//div[div/label[text()='${field}']]/div/div/div`);
//   return this.getDropdown(locator);
// };

// MeasurablesPage.prototype.changeProfileDraftYear = function(year) {
//   var locator = By.xpath(`.//div[@class='player-profile']/.//div[div/label[text()='Draft Year']]/div/div/input`)
//   var yearLocator = By.xpath(`.//div[@class='datepicker']/div[@class='datepicker-years']/table/tbody/tr/td/span[text()='${year}']`)
//   return this.changeDropdown(locator, yearLocator);
// };

// MeasurablesPage.prototype.getProfileLists = function() {
//   var locator = By.xpath(`.//div[@class='player-profile']/.//div[div/label[text()=' Lists ']]/.//span[contains(@class, 'tag')]/span`);
//   return this.getTextArray(locator);
// };

// MeasurablesPage.prototype.addProfileList = function(list) {
//   var locator = By.xpath(`.//div[@class='player-profile']/.//div[div/label[text()=' Lists ']]/.//input[2]`)
//   return this.changeInputSuggestion(locator, list);
// };

// MeasurablesPage.prototype.removeProfileList = function(list) {
//   var locator = By.xpath(`.//div[@class='player-profile']/.//div[div/label[text()=' Lists ']]/.//span[contains(@class, 'tag')][span[text()='${list}']]/i`);
//   return this.click(locator);
// };

// MeasurablesPage.prototype.changeProfileDOB = function(date) {
//   var locator = By.xpath(`.//div[@class='player-profile']/.//div[div/label[text()='DOB']]/.//input`)
//   this.click(locator);
//   return this.changeDatePicker(date.year, date.month, date.day);
// };

// MeasurablesPage.prototype.getProfileDOB = function() {
//   var locator = By.xpath(`.//div[@class='player-profile']/.//div[div/label[text()='DOB']]/.//input`)
//   return this.getAttribute(locator, 'value');
// };

// // Statistics
// MeasurablesPage.prototype.getStatTableHeader = function(col) {
//   var locator = By.xpath(`.//div[@inject='stats']/.//table/thead/tr/th[${col}]`);
//   return this.getText(locator);
// };

// MeasurablesPage.prototype.getStatTableValue = function(row, col) {
//   var locator = By.xpath(`.//div[@inject='stats']/.//table/tbody/tr[${row}]/td[${col}]/div/input`);
//   return this.driver.findElement(locator).getAttribute('value');
// };

// /****************************************************************************
// ** Reports
// *****************************************************************************/
// MeasurablesPage.prototype.clickCreateEvaluationReportBtn = function() {
//   return this.click(CREATE_EVALUATION_REPORT_BTN);
// };

// MeasurablesPage.prototype.goToEvaluationReport = function(reportNum) {
//   return this.click(By.xpath(`.//div[@inject='evaluationReports']/.//table/tbody/tr[${reportNum}]`));
// };

// MeasurablesPage.prototype.getEvaluationReportAuthors = function() {
//   return this.getInputValueArray(EVALUATION_REPORT_AUTHORS_INPUTS);
// };

// MeasurablesPage.prototype.clickCreateScoutingReportBtn = function() {
//   return this.click(CREATE_SCOUTING_REPORT_BTN);
// };

// MeasurablesPage.prototype.goToScoutingReport = function(reportNum) {
//   return this.click(By.xpath(`.//div[@inject='scoutingReports']/.//table/tbody/tr[${reportNum}]`));
// };

// MeasurablesPage.prototype.getScoutingReportAuthors = function() {
//   return this.getInputValueArray(SCOUTING_REPORT_AUTHORS_INPUTS);
// };

// MeasurablesPage.prototype.clickCreateInterviewReportBtn = function() {
//   return this.click(CREATE_INTERVIEW_REPORT_BTN);
// };

// MeasurablesPage.prototype.goToInterviewReport = function(reportNum) {
//   return this.click(By.xpath(`.//div[@inject='interviewReports']/.//table/tbody/tr[${reportNum}]`));
// };

// MeasurablesPage.prototype.getInterviewReportAuthors = function() {
//   return this.getInputValueArray(INTERVIEW_REPORT_AUTHORS_INPUTS);
// };

// /****************************************************************************
// ** Aggregate Helpers
// *****************************************************************************/
// MeasurablesPage.prototype.getProfileField = function(type, field) {
//   switch (type) {
//     case 'input':
//     case 'date':
//       return this.getProfileInput(field);
//     case 'dropdown':
//       return this.getProfileDropdown(field);
//     case 'checkbox':
//       return this.getProfileCheckbox(field);
//   }
// };

// MeasurablesPage.prototype.changeProfileField = function(type, field, value) {
//   switch (type) {
//     case 'input':
//       return this.changeProfileInput(field, value);
//     case 'dropdown':
//       return this.changeProfileDropdown(field, value);
//     case 'checkbox':
//       return this.changeProfileCheckbox(field, value);
//     case 'date':
//       return this.changeProfileDraftYear(value);
//   }
// };


// // sorting
// MeasurablesPage.prototype.clickReportTableHeader = function(reportName, col) {
//   var locator = By.xpath(`.//div[@inject='${REPORT_INJECT_VALUES[reportName]}']/.//table/thead/tr/th[${col}]`);
//   return this.click(locator);
// };

// MeasurablesPage.prototype.getStatsForReportAndCol = function(reportName, col) {
//   var locator = By.xpath(`.//div[@inject='${REPORT_INJECT_VALUES[reportName]}']/.//table/tbody/tr/td[${col}]/div/input`);
//   return this.getInputValueArray(locator);
// };

// MeasurablesPage.prototype.clickSortIconForReport = function(reportName, col) {
//   var locator = By.xpath(`.//div[@inject='${REPORT_INJECT_VALUES[reportName]}']/.//table/thead/tr/th[${col}]/i[contains(@class, 'material-icons')]`);
//   return this.click(locator);
// };

// MeasurablesPage.prototype.clickRemoveSortIconForReport = function(reportName, col) {
//   var locator = By.xpath(`.//div[@inject='${REPORT_INJECT_VALUES[reportName]}']/.//table/thead/tr/th[${col}]/i[contains(@class, '-cancel')]`);
//   return this.click(locator);
// };

module.exports = MeasurablesPage;