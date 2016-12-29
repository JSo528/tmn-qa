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
var BODY_CONTENT = By.css('.draft-management');
var SAVE_ICON = By.css('.status');

var CHECKBOX_TRUE = 'check_box';
var CHECKBOX_FALSE = 'check_box_outline_blank';

// IncidentReport
var NEW_INCIDENT_REPORT_DIV_NUM = 2
var INCIDENT_REPORT_SPACER = By.css('.-incidents .-show');
var CREATE_INCIDENT_REPORT_BTN = By.css('.-incidents .-create');
var INCIDENT_REPORT_WEEK_INPUT = By.xpath(`.//div[${NEW_INCIDENT_REPORT_DIV_NUM}]/div/div[@class='incident']/.//div[@inject='week']/div`);
var INCIDENT_REPORT_DATE_INPUT = By.xpath(`.//div[${NEW_INCIDENT_REPORT_DIV_NUM}]/div/div[@class='incident']/.//div[@inject='date']/input`);
var INCIDENT_REPORT_TYPE_INPUT = By.xpath(`.//div[${NEW_INCIDENT_REPORT_DIV_NUM}]/div/div[@class='incident']/.//div[@inject='type']/div`);
var INCIDENT_REPORT_COMMENT_INPUT = By.xpath(`.//div[${NEW_INCIDENT_REPORT_DIV_NUM}]/div/div[@class='incident']/.//div[@inject='comment']/div`);
var INCIDENT_DIVS = By.css('.incidents .incident');

// DatePicker
var DAYS_PICKER_SWITCH = By.css('.datepicker-days .picker-switch');
var MONTHS_PICKER_SWITCH = By.css('.datepicker-months .picker-switch');
var DATEPICKER_DAYS_TABLE = By.css(".datepicker .datepicker-days");
var DATEPICKER_MONTHS_TABLE = By.css(".datepicker .datepicker-months");

/****************************************************************************
** Constructor
*****************************************************************************/
function ManageDraftPage(driver) {
  BasePage.call(this, driver);
};

ManageDraftPage.prototype = Object.create(BasePage.prototype);
ManageDraftPage.prototype.constructor = ManageDraftPage;

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
  return this.getAttribute(locator, 'value');
};

ManageDraftPage.prototype.changeProfileInput = function(field, value) {
  var locator = By.xpath(`.//div[contains(@class, 'draft-management')]/.//div[div/label[text()='${field}']]/.//input`);
  
  this.clear(locator); // 1st clear changes it to 0
  this.clear(locator);
  this.sendKeys(locator, value);
  this.sendKeys(locator, Key.ENTER);
  return this.waitUntilStaleness(SAVE_ICON, 500);
};

ManageDraftPage.prototype.getProfileDropdown = function(field) {
  var locator = By.xpath(`.//div[contains(@class, 'draft-management')]/.//div[div/label[text()='${field}']]/.//div[contains(@class,'dropdown-toggle')]`);
  return this.getText(locator);
};

ManageDraftPage.prototype.changeProfileDropdown = function(field, value) {
  var d = Promise.defer();
  var thiz = this;

  var locator = By.xpath(`.//div[contains(@class, 'draft-management')]/.//div[div/label[text()='${field}']]/.//div[contains(@class,'dropdown-toggle')]`);
  

  this.getProfileDropdown(field).then(function(currentValue) {
    if (!value && currentValue) {
      var optionLocator = By.xpath(`.//div[contains(@class, 'draft-management')]/.//div[div/label[text()='${field}']]/.//ul/li[text()='${currentValue}']`);
      thiz.click(locator);
      thiz.click(optionLocator);
      d.fulfill(thiz.waitUntilStaleness(SAVE_ICON, 500));
    } else if (currentValue != value) {
      var optionLocator = By.xpath(`.//div[contains(@class, 'draft-management')]/.//div[div/label[text()='${field}']]/.//ul/li[text()='${value}']`);
      thiz.click(locator);
      thiz.click(optionLocator);
      d.fulfill(thiz.waitUntilStaleness(SAVE_ICON, 500));
    } 
  })

  return d.promise;
};

ManageDraftPage.prototype.getProfileCheckbox = function(field) {
  var d = Promise.defer();

  var locator = By.xpath(`.//div[contains(@class, 'draft-management')]/.//div[div/label[text()='${field}']]/.//i`);
  this.getText(locator).then(function(text) {
    if (text == CHECKBOX_TRUE) {
      d.fulfill(true);
    } else {
      d.fulfill(false);
    }
  });

  return d.promise;
};

ManageDraftPage.prototype.changeProfileCheckbox = function(field, selected) {
  var d = Promise.defer();
  var thiz = this;

    var locator = By.xpath(`.//div[contains(@class, 'draft-management')]/.//div[div/label[text()='${field}']]/.//i`);

  this.getText(locator).then(function(text) {
    if (text == CHECKBOX_TRUE && !selected || text == CHECKBOX_FALSE && selected) {
      thiz.click(locator);
      d.fulfill(thiz.waitUntilStaleness(SAVE_ICON, 5000));
    }
  });
  
  return d.promise;
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
  return this.getText(locator);
};

ManageDraftPage.prototype.changeSectionText = function(section, text) {
  var labelLocator = By.xpath(`.//div[@class='well'][div/div/div[text()=' ${section} ']]`);
  var locator = By.xpath(`.//div[@class='well'][div/div/div[text()=' ${section} ']]/.//div[contains(@class, '-editor')]`);
  this.click(locator);
  this.clear(locator);
  this.sendKeys(locator, text);
  this.clickOffset(labelLocator, 0, 0);
  return this.waitUntilStaleness(SAVE_ICON, 5000);
};

/****************************************************************************
** Incident Reports
*****************************************************************************/

ManageDraftPage.prototype.clickIncidentReportSpacer = function() {
  return this.click(INCIDENT_REPORT_SPACER);
};

// week: TC, P1, W1, etc.
// date: {year: 2015, month: 'Jan', day: 11}
// type: C, X, IR
// comment: text
ManageDraftPage.prototype.createIncidentReport = function(week, date, type, comment) {
  this.click(CREATE_INCIDENT_REPORT_BTN);

  // week
  this.click(INCIDENT_REPORT_WEEK_INPUT);
  var weekOptionLocator = By.xpath(`.//div[${NEW_INCIDENT_REPORT_DIV_NUM}]/div/div[@class='incident']/.//div[@inject='week']/ul/li[text()='${week}']`);
  this.click(weekOptionLocator);

  // date
  this.click(INCIDENT_REPORT_DATE_INPUT);
  this.changeDatePicker(date.year, date.month, date.day);

  // type
  this.click(INCIDENT_REPORT_TYPE_INPUT);
  var typeOptionLocator = By.xpath(`.//div[${NEW_INCIDENT_REPORT_DIV_NUM}]/div/div[@class='incident']/.//div[@inject='type']/ul/li[text()='${type}']`);
  this.click(typeOptionLocator);

  // comment
  this.click(INCIDENT_REPORT_COMMENT_INPUT);
  this.clear(INCIDENT_REPORT_COMMENT_INPUT);
  this.sendKeys(INCIDENT_REPORT_COMMENT_INPUT, comment);
  return this.sendKeys(INCIDENT_REPORT_COMMENT_INPUT, Key.TAB);
};

ManageDraftPage.prototype.getIncidentReportCount = function() {
  return this.getElementCount(INCIDENT_DIVS);
};

ManageDraftPage.prototype.getIncidentReportValue = function(reportNum, field) {
  if (field =='date') {

    var locator = By.xpath(`.//div[${reportNum}]/div/div[@class='incident']/.//div[@inject='date']/input`);
    return this.getAttribute(locator, 'value');
  } else {
    var locator = By.xpath(`.//div[${reportNum}]/div/div[@class='incident']/.//div[@inject='${field}']/div`);
    return this.getText(locator);
  }
};

ManageDraftPage.prototype.toggleDeleteIncidentReport = function(reportNum) {
  var locator = By.xpath(`.//div[${NEW_INCIDENT_REPORT_DIV_NUM}]/div/div[@class='incident']/.//div[contains(@class, '-remove-item')]/button`);
  return this.click(locator)
};

// Helper
ManageDraftPage.prototype.changeDatePicker = function(year, month, day) {
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
module.exports = ManageDraftPage;