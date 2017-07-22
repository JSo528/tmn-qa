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
TeamPage.prototype.clickTableHeader = function(colName) {
  var locator = By.xpath(`.//div[@class='roster']/.//table/thead/tr/th[count(//div[@inject='players']/.//table/thead/tr/th[text()=" ${colName}"]/preceding-sibling::th)+1]`);
  return this.click(locator);
};

TeamPage.prototype.clickSortIcon = function(colName) {
  var locator = By.xpath(`.//div[@class='roster']/.//table/thead/tr/th[count(//div[@inject='players']/.//table/thead/tr/th[text()=" ${colName}"]/preceding-sibling::th)+1]/i[contains(@class, 'material-icons')]`);
  return this.click(locator);
};

TeamPage.prototype.clickRemoveSortIcon = function(colName) {
  var locator = By.xpath(`.//div[@class='roster']/.//table/thead/tr/th[count(//div[@inject='players']/.//table/thead/tr/th[text()=" ${colName}"]/preceding-sibling::th)+1]/i[contains(@class, '-cancel')]`);
  return this.click(locator);
};

// table stats
TeamPage.prototype.clickTableStat = function(row, colName) {
  var locator = By.xpath(`.//div[@class='roster']/.//table/tbody[@inject='rows']/tr[${row}]/td[count(//div[@inject='players']/.//table/thead/tr/th[text()=" ${colName}"]/preceding-sibling::th)+1]/div/*[self::div or self::a or self::input]`);
  return this.click(locator);
};

TeamPage.prototype.getTableStat = function(row, colName) {
  var d = Promise.defer();
  var thiz = this;
  var inputLocator = By.xpath(`.//div[@class='roster']/.//table/tbody[@inject='rows']/tr[${row}]/td[count(//div[@inject='players']/.//table/thead/tr/th[text()=" ${colName}"]/preceding-sibling::th)+1]/div/input`);
  var locator = By.xpath(`.//div[@class='roster']/.//table/tbody[@inject='rows']/tr[${row}]/td[count(//div[@inject='players']/.//table/thead/tr/th[text()=" ${colName}"]/preceding-sibling::th)+1]/div/*[self::div or self::a or self::input]`);
  
  this.driver.wait(Until.elementLocated(inputLocator),100).then(function() {
    d.fulfill(thiz.driver.findElement(inputLocator).getAttribute('value'));
  }, function(err) {
    d.fulfill(thiz.getText(locator));
  });

  return d.promise;
};

TeamPage.prototype.changeTableStatInput = function(row, colName, value) {
  var locator = By.xpath(`.//div[@class='roster']/.//table/tbody[@inject='rows']/tr[${row}]/td[count(//div[@inject='players']/.//table/thead/tr/th[text()=" ${colName}"]/preceding-sibling::th)+1]/div/input`);
  return this.changeInput(locator, value)
};

TeamPage.prototype.changeTableStatDropdown = function(row, colName, value, placeholder) {
  var d = Promise.defer();
  var currentValue;
  var thiz = this
  
  this.getTableStat(row, colName).then(function(stat) {
    currentValue = stat
  }).then(function() {
    if (value && value != placeholder) {
      if (value != currentValue) {
        var locator = By.xpath(`.//div[@class='roster']/.//div[contains(@class,'scroll-wrap-x')]/table/tbody[@inject='rows']/tr[not(contains(@class,'hidden'))][${row}]/td[count(//div[@inject='players']/.//table/thead/tr/th[text()=" ${colName}"]/preceding-sibling::th)+1]/div`);
        var optionLocator = By.xpath(`.//div[@class='roster']/.//div[contains(@class,'scroll-wrap-x')]/table/tbody[@inject='rows']/tr[not(contains(@class,'hidden'))][${row}]/td[count(//div[@inject='players']/.//table/thead/tr/th[text()=" ${colName}"]/preceding-sibling::th)+1]/.//li[text()='${value}']`)
        d.fulfill(thiz.changeDropdown(locator, optionLocator));
      } else {
        d.fulfill(true)
      }
    } else {
      if (currentValue != placeholder) {
        var locator = By.xpath(`.//div[@class='roster']/.//div[contains(@class,'scroll-wrap-x')]/table/tbody[@inject='rows']/tr[not(contains(@class,'hidden'))][${row}]/td[count(//div[@inject='players']/.//table/thead/tr/th[text()=" ${colName}"]/preceding-sibling::th)+1]/div`);
        var optionLocator = By.xpath(`.//div[@class='roster']/.//div[contains(@class,'scroll-wrap-x')]/table/tbody[@inject='rows']/tr[not(contains(@class,'hidden'))][${row}]/td[count(//div[@inject='players']/.//table/thead/tr/th[text()=" ${colName}"]/preceding-sibling::th)+1]/.//li[text()='${currentValue}']`)
        d.fulfill(thiz.changeDropdown(locator, optionLocator));
      }
    }
  });

  return d.promise;
};

TeamPage.prototype.getTableStatCheckbox = function(row, colName) {
  var locator = By.xpath(`.//div[@class='roster']/.//table/tbody[@inject='rows']/tr[${row}]/td[count(//div[@inject='players']/.//table/thead/tr/th[text()=" ${colName}"]/preceding-sibling::th)+1]/div`);
  return this.getCheckbox(locator);
};

TeamPage.prototype.changeTableStatCheckbox = function(row, colName, selected) {
  var locator = By.xpath(`.//div[@class='roster']/.//table/tbody[@inject='rows']/tr[${row}]/td[count(//div[@inject='players']/.//table/thead/tr/th[text()=" ${colName}"]/preceding-sibling::th)+1]/div`);
  return this.changeCheckbox(locator, selected);
};

TeamPage.prototype.getTableStatColorCheckbox = function(row, colName, selectedColor) {
  var locator = By.xpath(`.//div[@class='roster']/.//table/tbody[@inject='rows']/tr[${row}]/td[count(//div[@inject='players']/.//table/thead/tr/th[text()=" ${colName}"]/preceding-sibling::th)+1]/div`);
  return this.getColorCheckbox(locator, selectedColor);
};

TeamPage.prototype.changeTableStatColorCheckbox = function(row, colName, selected, selectedColor) {
  var locator = By.xpath(`.//div[@class='roster']/.//table/tbody[@inject='rows']/tr[${row}]/td[count(//div[@inject='players']/.//table/thead/tr/th[text()=" ${colName}"]/preceding-sibling::th)+1]/div`);
  return this.changeColorCheckbox(locator, selected, selectedColor);
};

TeamPage.prototype.changeTableStatYear = function(row, colName, year) {
  var locator = By.xpath(`.//div[@class='roster']/.//table/tbody[@inject='rows']/tr[${row}]/td[count(//div[@inject='players']/.//table/thead/tr/th[text()=" ${colName}"]/preceding-sibling::th)+1]/div`);
  return this.changeDatePicker(locator, year);
};

TeamPage.prototype.getTableStatsForCol = function(colName) {
  var d = Promise.defer();
  var thiz = this;
  var inputLocator = By.xpath(`.//div[@class='roster']/.//table/tbody[@inject='rows']/tr/td[count(//div[@inject='players']/.//table/thead/tr/th[text()=" ${colName}"]/preceding-sibling::th)+1]/div/input`);
  var locator = By.xpath(`.//div[@class='roster']/.//table/tbody[@inject='rows']/tr/td[count(//div[@inject='players']/.//table/thead/tr/th[text()=" ${colName}"]/preceding-sibling::th)+1]/div/*[self::div or self::a or self::input]`);
  
  this.driver.wait(Until.elementLocated(inputLocator),100).then(function() {
    d.fulfill(thiz.getInputValueArray(inputLocator));
  }, function(err) {
    d.fulfill(thiz.getTextArray(locator));
  })

  return d.promise;
};

TeamPage.prototype.getTableCheckboxStats = function(colName) {
  var locator = By.xpath(`.//div[@class='roster']/.//table/tbody[@inject='rows']/tr/td[count(//div[@inject='players']/.//table/thead/tr/th[text()=" ${colName}"]/preceding-sibling::th)+1]/div`);
  return this.getCheckboxArray(locator);
};

TeamPage.prototype.clickCreateScoutingReport = function(row) {
  var locator = By.xpath(`.//div[@class='roster']/.//table/tbody[@inject='rows']/tr[${row}]/td[2]/div/div`);
  var optionLocator = By.xpath(`.//div[@class='roster']/.//table/tbody[@inject='rows']/tr[${row}]/td[2]/div/ul/li[1]`);
  this.click(locator);
  return this.click(optionLocator);
};

TeamPage.prototype.clickCreateNewPlayer = function() {
  var locator = By.xpath(".//div[@class='roster']/.//table/thead/tr/td/button[contains(@class,'-create')]");
  return this.click(locator);
};

/****************************************************************************
** Aggregate Helpers
*****************************************************************************/
TeamPage.prototype.getTableStatField = function(type, row, colName, options) {
  switch (type) {
    case 'input':
    case 'dropdown':
    case 'date':
      return this.getTableStat(row, colName);
    case 'checkbox':
      return this.getTableStatCheckbox(row, colName);
    case 'colorCheckbox':
      return this.getTableStatColorCheckbox(row, colName, options.selectedColor);
  }
};

TeamPage.prototype.changeTableStatField = function(type, row, colName, value, options) {
  switch (type) {
    case 'input':
      return this.changeTableStatInput(row, colName, value, options.placeholder);
    case 'dropdown':
      return this.changeTableStatDropdown(row, colName, value, options.placeholder);
    case 'checkbox':
      return this.changeTableStatCheckbox(row, colName, value, options.placeholder);
    case 'date':
      return this.changeTableStatYear(row, colName, value, options.placeholder);
    case 'colorCheckbox':
      return this.changeTableStatColorCheckbox(row, colName, value, options.selectedColor);
  }
};

module.exports = TeamPage;