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
var PLAYER_LINK = By.css(".title .link a");

/****************************************************************************
** Constructor
*****************************************************************************/
function MedicalReportPage(driver) {
  BasePage.call(this, driver);
};

MedicalReportPage.prototype = Object.create(BasePage.prototype);
MedicalReportPage.prototype.constructor = MedicalReportPage;

// Mixins
_.extend(MedicalReportPage.prototype, inputs);

MedicalReportPage.prototype.waitForPageToLoad = function() {
  return this.waitForEnabled(By.css('.medical-report'));
};

MedicalReportPage.prototype.clickPlayerLink = function() {
  return this.click(PLAYER_LINK);
};

/****************************************************************************
** Profile
*****************************************************************************/
MedicalReportPage.prototype.changeProfileCheckbox = function(field, selected) {
  var locator = By.xpath(`.//div[contains(@class,'medical-report')]/.//div[div/label[text()='${field}']]/div/div[contains(@class, 'switch')]`);
  return this.changeCheckbox(locator, selected);
};

MedicalReportPage.prototype.getProfileCheckbox = function(field) {
  var locator = By.xpath(`.//div[contains(@class,'medical-report')]/.//div[div/label[text()='${field}']]/div/div[contains(@class, 'switch')]`);
  return this.getCheckbox(locator);
};

MedicalReportPage.prototype.getComputedGrade = function() {
  var locator = By.xpath(".//div[@inject='computedGrade']");
  return this.getText(locator);
};

// /****************************************************************************
// ** Comments Fields
// *****************************************************************************/
MedicalReportPage.prototype.getCommentsText = function(section) {
  var locator = By.xpath(`.//div[contains(@class, 'medical-report')]/.//div[div/div/div[text()=' ${section} ']]/.//div[contains(@inject, 'text')]/div`);
  return this.getTextField(locator);
};

MedicalReportPage.prototype.getCommentsDate = function(section) {
  var locator = By.xpath(`.//div[contains(@class, 'medical-report')]/.//div[div/div/div[text()=' ${section} ']]/.//div[contains(@inject, 'date')]/input`);
  return this.getInput(locator);
};

MedicalReportPage.prototype.getCommentsDoctor = function(section) {
  var locator = By.xpath(`.//div[contains(@class, 'medical-report')]/.//div[div/div/div[text()=' ${section} ']]/.//div[contains(@inject, 'doctor')]/input`);
  return this.getInput(locator);
};

MedicalReportPage.prototype.changeCommentsText = function(section, text) {
  var locator = By.xpath(`.//div[contains(@class, 'medical-report')]/.//div[div/div/div[text()=' ${section} ']]/.//div[contains(@inject, 'text')]/div`);
  return this.changeTextField(locator, text);
};

MedicalReportPage.prototype.changeCommentsDate = function(section, date) {
  var locator = By.xpath(`.//div[contains(@class, 'medical-report')]/.//div[div/div/div[text()=' ${section} ']]/.//div[contains(@inject, 'date')]/input`);
  return this.changeDatePicker(locator, date.year, date.month, date.day);
};

MedicalReportPage.prototype.changeCommentsDoctor = function(section, doctor) {
  var locator = By.xpath(`.//div[contains(@class, 'medical-report')]/.//div[div/div/div[text()=' ${section} ']]/.//div[contains(@inject, 'doctor')]/input`);
  return this.changeTextField(locator, doctor);
};

/****************************************************************************
** Aggregate Helpers
*****************************************************************************/
MedicalReportPage.prototype.changeCommentsField = function(type, section, value) {
  switch (type) {
    case 'text':
      return this.changeCommentsText(section, value);
    case 'date':
      return this.changeCommentsDate(section, value);
    case 'doctor':
      return this.changeCommentsDoctor(section, value);
  }
};

MedicalReportPage.prototype.getCommentsField = function(type, section) {
  switch (type) {
    case 'text':
      return this.getCommentsText(section);
    case 'date':
      return this.getCommentsDate(section);
    case 'doctor':
      return this.getCommentsDoctor(section);
  }
};

module.exports = MedicalReportPage;