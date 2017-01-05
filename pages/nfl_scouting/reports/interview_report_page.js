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
var incidentReports = require('../mixins/incidentReports.js')

/****************************************************************************
** Constructor
*****************************************************************************/
function InterviewReportPage(driver) {
  BasePage.call(this, driver);
};

InterviewReportPage.prototype = Object.create(BasePage.prototype);
InterviewReportPage.prototype.constructor = InterviewReportPage;

// Mixins
_.extend(InterviewReportPage.prototype, inputs);
_.extend(InterviewReportPage.prototype, incidentReports);

InterviewReportPage.prototype.waitForPageToLoad = function() {
  return this.waitForEnabled(By.css('.interview-report'));
};

/****************************************************************************
** Profile
*****************************************************************************/
InterviewReportPage.prototype.getProfileInput = function(field) {
  var locator = By.xpath(`.//div[contains(@class, 'interview-report')]/div[1]/.//div[div/label[text()='${field}']]/.//input`);
  var secondaryLocator = By.xpath(`.//div[contains(@class, 'interview-report')]/div[1]/.//div[@inject='${field}']/.//input`);
  return this.getInput(locator, secondaryLocator);
};

InterviewReportPage.prototype.changeProfileInput = function(field, value) {
  var locator = By.xpath(`.//div[contains(@class, 'interview-report')]/.//div[div/label[text()='${field}']]/.//input`);
  var secondaryLocator = locator = By.xpath(`.//div[contains(@class, 'interview-report')]/div[1]/.//div[@inject='${field}']/.//input`);
  return this.changeInput(locator, value, secondaryLocator);
};

InterviewReportPage.prototype.getProfileDropdown = function(field) {
  var locator = By.xpath(`.//div[contains(@class, 'interview-report')]/div[1]/.//div[div/label[text()='${field}']]/.//div[contains(@class,'dropdown')]`);
  var secondaryLocator = By.xpath(`.//div[contains(@class, 'interview-report')]/div[1]/.//div[@inject='${field}']/.//div[contains(@class,'dropdown')]`);
  return this.getDropdown(locator, secondaryLocator);
};

InterviewReportPage.prototype.changeProfileDropdown = function(field, value) {
  var locator = By.xpath(`.//div[contains(@class, 'interview-report')]/div[1]/.//div[div/label[text()='${field}']]/.//div[contains(@class,'dropdown-toggle')]`);
  var optionLocator = By.xpath(`.//div[contains(@class, 'interview-report')]/div[1]/.//div[div/label[text()='${field}']]/.//ul/li[text()='${value}']`);
  var secondaryLocator = By.xpath(`.//div[contains(@class, 'interview-report')]/div[1]/.//div[@inject='${field}']/.//div[contains(@class,'dropdown-toggle')]`);
  var secondaryOptionLocator = By.xpath(`.//div[contains(@class, 'interview-report')]/div[1]/.//div[@inject='${field}']/.//ul/li[contains(text(),'${value}')]`);
  return this.changeDropdown(locator, optionLocator, secondaryLocator, secondaryOptionLocator);  
};

InterviewReportPage.prototype.getProfileDate = function(field) {
  var locator = By.xpath(`.//div[contains(@class, 'interview-report')]/div[1]/.//div[div/label[text()='${field}']]/.//input`)
  return this.getInput(locator);
};

InterviewReportPage.prototype.changeProfileDate = function(field, date) {;
  var locator = By.xpath(`.//div[contains(@class, 'interview-report')]/div[1]/.//div[div/label[text()='${field}']]/.//input`)
  return this.changeDatePicker(locator, date.year, date.month, date.day);
};

// /****************************************************************************
// ** Section Fields
// *****************************************************************************/
InterviewReportPage.prototype.getSectionText = function(section) {
  var locator = By.xpath(`.//div[@class='well'][div/div/div[text()=' ${section} ']]/.//div[contains(@class, '-editor')]`);
  // return this.getText(locator);
  return this.getTextField(locator);
};

InterviewReportPage.prototype.changeSectionText = function(section, text) {
  var locator = By.xpath(`.//div[@class='well'][div/div/div[text()=' ${section} ']]/.//div[contains(@class, '-editor')]`);
  return this.changeTextField(locator, text);
};

InterviewReportPage.prototype.getLearnSystemCheckbox = function() {
  var locator = By.xpath(`.//div[@class='well']/.//div[div/div[text()=' Can Player Learn Team System? ']]/.//i`);
  return this.getCheckbox(locator);
};

InterviewReportPage.prototype.changeLearnSystemCheckbox = function(selected) {
  var locator = By.xpath(`.//div[@class='well']/.//div[div/div[text()=' Can Player Learn Team System? ']]/.//i`);
  return this.changeCheckbox(locator, selected);
};

InterviewReportPage.prototype.getPersonalStatusCheckbox = function(field) {
  var locator = By.xpath(`.//div[div/div/div[text()=' Personal Status ']]/.//div[div/label[text()='${field}']]/.//i`);
  return this.getCheckbox(locator);
};

InterviewReportPage.prototype.changePersonalStatusCheckbox = function(field, selected) {
  var locator = By.xpath(`.//div[div/div/div[text()=' Personal Status ']]/.//div[div/label[text()='${field}']]/.//i`);
  return this.changeCheckbox(locator, selected);
};

InterviewReportPage.prototype.getNumChildrenInput = function() {
  var locator = By.xpath(`.//div[div/div/div[text()=' Personal Status ']]/.//div[@inject='player.childCount']/input`);
  return this.getInput(locator);
};

InterviewReportPage.prototype.changeNumChildrenInput = function(value) {
  var locator = By.xpath(`.//div[div/div/div[text()=' Personal Status ']]/.//div[@inject='player.childCount']/input`);
  return this.changeInput(locator, value);
};

/****************************************************************************
** Character/Injury
*****************************************************************************/
InterviewReportPage.prototype.getCharacterCheckbox = function(field) {
  var locator = By.xpath(`.//div[div[@inject='makeup']]/.//div[div/label[text()='${field}']]/.//i`);
  return this.getCheckbox(locator);
};

InterviewReportPage.prototype.changeCharacterCheckbox = function(field, selected) {
  var locator = By.xpath(`.//div[div[@inject='makeup']]/.//div[div/label[text()='${field}']]/.//i`);
  return this.changeCheckbox(locator, selected);
};

/****************************************************************************
** Intelligence
*****************************************************************************/
InterviewReportPage.prototype.getIntelligenceCheckbox = function(field) {
  var locator = By.xpath(`.//div[div[@inject='intelligence']]/.//div[div/label[text()='${field}']]/.//i`);
  return this.getCheckbox(locator);
};

InterviewReportPage.prototype.changeIntelligenceCheckbox = function(field, selected) {
  var locator = By.xpath(`.//div[div[@inject='intelligence']]/.//div[div/label[text()='${field}']]/.//i`);
  return this.changeCheckbox(locator, selected);
};

/****************************************************************************
** Presentation
*****************************************************************************/
InterviewReportPage.prototype.getPresentationCheckbox = function(field) {
  var locator = By.xpath(`.//div[div[@inject='presentation']]/.//div[div/label[text()='${field}']]/.//i`);
  return this.getCheckbox(locator);
};

InterviewReportPage.prototype.changePresentationCheckbox = function(field, selected) {
  var locator = By.xpath(`.//div[div[@inject='presentation']]/.//div[div/label[text()='${field}']]/.//i`);
  return this.changeCheckbox(locator, selected);
};

module.exports = InterviewReportPage;