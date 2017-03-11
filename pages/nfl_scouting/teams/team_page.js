'use strict';

// Load Base Page
var BasePage = require('../../../pages/base/base_page.js')

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;
var Key = require('selenium-webdriver').Key;

// Mixins
var _ = require('underscore');
var inputs = require('../mixins/inputs.js');

/****************************************************************************
** Locators
*****************************************************************************/
var BODY_CONTENT = By.css('.roster table');

/****************************************************************************
** Constructor
*****************************************************************************/
function TeamPage(driver) {
  BasePage.call(this, driver)
};

TeamPage.prototype = Object.create(BasePage.prototype);
TeamPage.prototype.constructor = TeamPage;

// Mixins
_.extend(TeamPage.prototype, inputs);

/****************************************************************************
** Functions
*****************************************************************************/
TeamPage.prototype.waitForPageToLoad = function() {
  return this.waitForEnabled(BODY_CONTENT);
};

// sorting/filtering
TeamPage.prototype.clickTableHeader = function(col) {
  var locator = By.xpath(`.//div[@class='roster']/.//table/thead/tr/th[${col}]`);
  return this.click(locator);
};

TeamPage.prototype.clickSortIcon = function(col) {
  var locator = By.xpath(`.//div[@class='roster']/.//table/thead/tr/th[${col}]/i[contains(@class, 'material-icons')]`);
  return this.click(locator);
};

TeamPage.prototype.clickRemoveSortIcon = function(col) {
  var locator = By.xpath(`.//div[@class='roster']/.//table/thead/tr/th[${col}]/i[contains(@class, '-cancel')]`);
  return this.click(locator);
};

// table stats
TeamPage.prototype.getTableStat = function(row, col) {
  var d = Promise.defer();
  var thiz = this;
  var inputLocator = By.xpath(`.//div[@class='roster']/.//table/tbody[@inject='rows']/tr[${row}]/td[${col}]/div/input`);
  var locator = By.xpath(`.//div[@class='roster']/.//table/tbody[@inject='rows']/tr[${row}]/td[${col}]/div/*[self::div or self::a or self::input]`);
  
  this.driver.wait(Until.elementLocated(inputLocator),100).then(function() {
    d.fulfill(thiz.driver.findElement(inputLocator).getAttribute('value'));
  }, function(err) {
    d.fulfill(thiz.getText(locator));
  });

  return d.promise;
};

TeamPage.prototype.clickTableStat = function(row, col) {
  var locator = By.xpath(`.//div[@class='roster']/.//table/tbody[@inject='rows']/tr[${row}]/td[${col}]/div/*[self::div or self::a or self::input]`);
  return this.click(locator);
};

TeamPage.prototype.changeTableStatInput = function(row, col, value) {
  var locator = By.xpath(`.//div[@class='roster']/.//table/tbody[@inject='rows']/tr[${row}]/td[${col}]/div/input`);
  return this.changeInput(locator, value)
};

TeamPage.prototype.changeTableStatDropdown = function(row, col, value, placeholder) {
  var d = Promise.defer();
  var currentValue;
  var thiz = this
  
  this.getTableStat(row, col).then(function(stat) {
    currentValue = stat
  }).then(function() {
    if (value && value != placeholder) {
      if (value != currentValue) {
        var locator = By.xpath(`.//div[@class='roster']/.//div[contains(@class,'scroll-wrap-x')]/table/tbody[@inject='rows']/tr[not(contains(@class,'hidden'))][${row}]/td[${col}]/div`);
        var optionLocator = By.xpath(`.//div[@class='roster']/.//div[contains(@class,'scroll-wrap-x')]/table/tbody[@inject='rows']/tr[not(contains(@class,'hidden'))][${row}]/td[${col}]/.//li[text()='${value}']`)
        d.fulfill(thiz.changeDropdown(locator, optionLocator));
      } else {
        d.fulfill(true)
      }
    } else {
      if (currentValue != placeholder) {
        var locator = By.xpath(`.//div[@class='roster']/.//div[contains(@class,'scroll-wrap-x')]/table/tbody[@inject='rows']/tr[not(contains(@class,'hidden'))][${row}]/td[${col}]/div`);
        var optionLocator = By.xpath(`.//div[@class='roster']/.//div[contains(@class,'scroll-wrap-x')]/table/tbody[@inject='rows']/tr[not(contains(@class,'hidden'))][${row}]/td[${col}]/.//li[text()='${currentValue}']`)
        d.fulfill(thiz.changeDropdown(locator, optionLocator));
      }
    }
  });

  return d.promise;
};

TeamPage.prototype.getTableStatCheckbox = function(row, col) {
  var locator = By.xpath(`.//div[@class='roster']/.//table/tbody[@inject='rows']/tr[${row}]/td[${col}]/div`);
  return this.getCheckbox(locator);
};

TeamPage.prototype.changeTableStatCheckbox = function(row, col, selected) {
  var locator = By.xpath(`.//div[@class='roster']/.//table/tbody[@inject='rows']/tr[${row}]/td[${col}]/div`);
  return this.changeCheckbox(locator, selected);
};

TeamPage.prototype.changeTableStatYear = function(row, col, year) {
  var locator = By.xpath(`.//div[@class='roster']/.//table/tbody[@inject='rows']/tr[${row}]/td[${col}]/div`);
  return this.changeDatePicker(locator, year);
};

TeamPage.prototype.getTableStatsForCol = function(col) {
  var d = Promise.defer();
  var thiz = this;
  var inputLocator = By.xpath(`.//div[@class='roster']/.//table/tbody[@inject='rows']/tr/td[${col}]/div/input`);
  var locator = By.xpath(`.//div[@class='roster']/.//table/tbody[@inject='rows']/tr/td[${col}]/div/*[self::div or self::a or self::input]`);
  
  this.driver.wait(Until.elementLocated(inputLocator),100).then(function() {
    d.fulfill(thiz.getInputValueArray(inputLocator));
  }, function(err) {
    d.fulfill(thiz.getTextArray(locator));
  })

  return d.promise;
};

TeamPage.prototype.getTableCheckboxStats = function(col) {
  var locator = By.xpath(`.//div[@class='roster']/.//table/tbody[@inject='rows']/tr/td[${col}]/div`);
  return this.getCheckboxArray(locator);
};

/****************************************************************************
** Aggregate Helpers
*****************************************************************************/
TeamPage.prototype.getTableStatField = function(type, row, col) {
  switch (type) {
    case 'input':
    case 'dropdown':
    case 'date':
      return this.getTableStat(row, col);
    case 'checkbox':
      return this.getTableStatCheckbox(row, col);
  }
};

TeamPage.prototype.changeTableStatField = function(type, row, col, value, placeholder) {
  switch (type) {
    case 'input':
      return this.changeTableStatInput(row, col, value, placeholder);
    case 'dropdown':
      return this.changeTableStatDropdown(row, col, value, placeholder);
    case 'checkbox':
      return this.changeTableStatCheckbox(row, col, value, placeholder);
    case 'date':
      return this.changeTableStatYear(row, col, value, placeholder);
  }
};

module.exports = TeamPage;