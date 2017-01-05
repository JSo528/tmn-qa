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
** Locators
*****************************************************************************/
var BODY_CONTENT = By.css('.draft-management');

/****************************************************************************
** Constructor
*****************************************************************************/
function ManageDraftPage(driver) {
  BasePage.call(this, driver);
};

ManageDraftPage.prototype = Object.create(BasePage.prototype);
ManageDraftPage.prototype.constructor = ManageDraftPage;

// Mixins
_.extend(ManageDraftPage.prototype, inputs);
_.extend(ManageDraftPage.prototype, incidentReports);

/****************************************************************************
** Functions
*****************************************************************************/
ManageDraftPage.prototype.waitForPageToLoad = function() {
  return this.waitForEnabled(BODY_CONTENT, 10000);
};

/****************************************************************************
** Profile
*****************************************************************************/
ManageDraftPage.prototype.getProfileInput = function(field) {
  var locator = By.xpath(`.//div[contains(@class, 'draft-management')]/.//div[div/label[text()='${field}']]/.//input`);
  return this.getInput(locator);
};

ManageDraftPage.prototype.changeProfileInput = function(field, value) {
  var locator = By.xpath(`.//div[contains(@class, 'draft-management')]/.//div[div/label[text()='${field}']]/.//input`);
  return this.changeInput(locator, value);
};

ManageDraftPage.prototype.getProfileDropdown = function(field) {
  var locator = By.xpath(`.//div[contains(@class, 'draft-management')]/.//div[div/label[text()='${field}']]/.//div[contains(@class,'dropdown-toggle')]`);
  return this.getDropdown(locator);
};

ManageDraftPage.prototype.changeProfileDropdown = function(field, value) {
  var d = Promise.defer();
  var thiz = this;

  var locator = By.xpath(`.//div[contains(@class, 'draft-management')]/.//div[div/label[text()='${field}']]/.//div[contains(@class,'dropdown-toggle')]`);

  this.getProfileDropdown(field).then(function(currentValue) {
    if (!value && currentValue) {
      var optionLocator = By.xpath(`.//div[contains(@class, 'draft-management')]/.//div[div/label[text()='${field}']]/.//ul/li[text()='${currentValue}']`);
    } else if (currentValue != value) {
      var optionLocator = By.xpath(`.//div[contains(@class, 'draft-management')]/.//div[div/label[text()='${field}']]/.//ul/li[text()='${value}']`);
    } 

    d.fulfill(thiz.changeDropdown(locator, optionLocator));
  })

  return d.promise;
};

ManageDraftPage.prototype.getProfileCheckbox = function(field) {
  var locator = By.xpath(`.//div[contains(@class, 'draft-management')]/.//div[div/label[text()='${field}']]/.//i`);
  return this.getCheckbox(locator);
};

ManageDraftPage.prototype.changeProfileCheckbox = function(field, selected) {
  var locator = By.xpath(`.//div[contains(@class, 'draft-management')]/.//div[div/label[text()='${field}']]/.//i`);
  return this.changeCheckbox(locator, selected);
};

ManageDraftPage.prototype.getProfileField = function(type, field) {
  switch (type) {
    case 'dropdown':
      return this.getProfileDropdown(field);
    case 'checkbox':
      return this.getProfileCheckbox(field);
    case 'input':
      return this.getProfileInput(field);
  }
};

ManageDraftPage.prototype.changeProfileField = function(type, field, value) {
  switch (type) {
    case 'dropdown':
      return this.changeProfileDropdown(field, value);
    case 'checkbox':
      return this.changeProfileCheckbox(field, value);
    case 'input':
      return this.changeProfileInput(field, value);
  }
};

/****************************************************************************
** Section Fields
*****************************************************************************/
ManageDraftPage.prototype.getSectionText = function(section) {
  var locator = By.xpath(`.//div[@class='well'][div/div/div[text()=' ${section} ']]/.//div[contains(@class, '-editor')]`);
  return this.getTextField(locator);
};

ManageDraftPage.prototype.changeSectionText = function(section, text) {
  var locator = By.xpath(`.//div[@class='well'][div/div/div[text()=' ${section} ']]/.//div[contains(@class, '-editor')]`);
  return this.changeTextField(locator, text);
};

module.exports = ManageDraftPage;