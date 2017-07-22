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
var LAST_LOCATOR = By.xpath(".//div[@inject='measurables']/.//table/tbody[@inject='rows']");
var CREATE_BUTTON = By.xpath(".//tbody[@class='-controls controls']/.//button[contains(@class,'-create')]");
var COLUMN_NUMS = {
  event: 2,
  date: 3,
  fieldCondition: 4,
  fieldType: 5,
  height: 7,
  weight: 8,
  hand: 9,
  arm: 10,
  wing: 11,
  m40_1: 12,
  m40_2: 13,
  m10_1: 14,
  m10_2: 15,
  m20_1: 16,
  m20_2: 17,
  verticalJump: 18,
  broadJump: 19,
  benchPress: 20,
  shuttles20: 21,
  shuttles60: 22,
  shuttles3: 23
};

var LIVE_ROW_COLUMN_NUMS = {
  height: 6,
  weight: 7,
  hand: 8,
  arm: 9,
  wing: 10,
  m40_1: 11,
  m40_2: 12,
  m10_1: 13,
  m10_2: 14,
  m20_1: 15,
  m20_2: 16,
  verticalJump: 17,
  broadJump: 18,
  benchPress: 19,
  shuttles20: 20,
  shuttles60: 21,
  shuttles3: 22
};

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
MeasurablesPage.prototype.waitForPageToLoad = function() {
  return this.waitForEnabled(LAST_LOCATOR, 20000);
};

MeasurablesPage.prototype.clickCreateButton = function() {
  return this.click(CREATE_BUTTON);
};

MeasurablesPage.prototype.changeInputField = function(rowNum, field, value) {
  var locator = By.xpath(`.//table/tbody[1]/tr[not(contains(@class, '-details'))][${rowNum}]/td[${COLUMN_NUMS[field]}]/div/div[contains(@class, 'control')]`);
  return this.changeInput(locator, value);
};

MeasurablesPage.prototype.changeDateField = function(rowNum, field, dateString) {
  var locator = By.xpath(`.//table/tbody[1]/tr[not(contains(@class, '-details'))][${rowNum}]/td[${COLUMN_NUMS[field]}]/div/input`);
  return this.changeDatePickerFromString(locator, dateString);
};

MeasurablesPage.prototype.changeDropdownField = function(rowNum, field, value) {
  var locator = By.xpath(`.//table/tbody[1]/tr[not(contains(@class, '-details'))][${rowNum}]/td[${COLUMN_NUMS[field]}]/div[contains(@class, 'control')]`);
  var optionLocator = By.xpath(`.//table/tbody[1]/tr[not(contains(@class, '-details'))][${rowNum}]/td[${COLUMN_NUMS[field]}]/div[contains(@class, 'control')]/ul/li[text()='${value}']`);
  return this.changeDropdown(locator, optionLocator);
};

MeasurablesPage.prototype.getInputField = function(rowNum, field) {
  var locator = By.xpath(`.//table/tbody[1]/tr[not(contains(@class, '-details'))][${rowNum}]/td[${COLUMN_NUMS[field]}]/div/div[contains(@class, 'control')]`);
  return this.getText(locator);
};

MeasurablesPage.prototype.getDateField = function(rowNum, field) {
  var locator = By.xpath(`.//table/tbody[1]/tr[not(contains(@class, '-details'))][${rowNum}]/td[${COLUMN_NUMS[field]}]/div/input`);
  return this.getInput(locator);
};

MeasurablesPage.prototype.getDropdownField = function(rowNum, field) {
  var d = Promise.defer();
  var locator = By.xpath(`.//table/tbody[1]/tr[not(contains(@class, '-details'))][${rowNum}]/td[${COLUMN_NUMS[field]}]/div/div`);
  this.getText(locator).then(function(text) {
    d.fulfill(text.trim());
  })
  return d.promise;
};

MeasurablesPage.prototype.errorMessageDisplayed = function(rowNum, field) {
  var locator = By.xpath(`.//table/tbody[1]/tr[not(contains(@class, '-details'))][${rowNum}]/td[${COLUMN_NUMS[field]}]/div/div/div[@class='message']`);
  return this.isDisplayed(locator);
};

MeasurablesPage.prototype.getRowNumForValue = function(field, value) {
  var d = Promise.defer();

  var locator = By.xpath(`.//table/tbody[1]/tr[not(contains(@class, '-details'))]/td[${COLUMN_NUMS[field]}]/div/div[contains(@class, 'control')]`);
  var foundIndex;

  this.driver.findElements(locator).then(function(elements) {
    elements.forEach(function(el, index) {
      el.getText().then(function(text) {
        if (text == value) {
          foundIndex = index;
        }
      });
    });
  }).then(function() {
    d.fulfill((foundIndex != undefined) ? foundIndex + 1 : null);
  })

  return d.promise;
};

MeasurablesPage.prototype.getLiveRowDateField = function() {
  var locator = By.xpath(`.//tbody[@id='liveRow']/tr/td[${COLUMN_NUMS['date']}]/div`);
  return this.getText(locator);
}

MeasurablesPage.prototype.getLiveRowInputField = function(field) {
  var colNum = LIVE_ROW_COLUMN_NUMS[field] || COLUMN_NUMS[field];
  var locator = By.xpath(`.//tbody[@id='liveRow']/tr/td[${colNum}]/div/div[contains(@class, 'control')]`);
  return this.getText(locator);
}

MeasurablesPage.prototype.changeLiveRowInputField = function(field, value) {
  var colNum = LIVE_ROW_COLUMN_NUMS[field] || COLUMN_NUMS[field];
  var locator = By.xpath(`.//tbody[@id='liveRow']/tr/td[${colNum}]/div/div[contains(@class, 'control')]`);
  return this.changeTextField(locator, value);
}

/****************************************************************************
** Aggregate Helpers
*****************************************************************************/
MeasurablesPage.prototype.changeStatField = function(type, rowNum, field, value) {
  switch (type) {
    case 'dropdown':
      return this.changeDropdownField(rowNum, field, value);
    case 'date':
      return this.changeDateField(rowNum, field, value);
    default:
      return this.changeInputField(rowNum, field, value);
  }
};

MeasurablesPage.prototype.getStatField = function(type, rowNum, field) {
  switch (type) {
    case 'dropdown':
    return this.getDropdownField(rowNum, field);
    case 'date':
      return this.getDateField(rowNum, field);
    default:
      return this.getInputField(rowNum, field);
  }
};

MeasurablesPage.prototype.getLiveRowField = function(type, field) {
  switch (type) {
    case 'date':
      return this.getLiveRowDateField();
    default:
      return this.getLiveRowInputField(field);
  }
};

module.exports = MeasurablesPage;