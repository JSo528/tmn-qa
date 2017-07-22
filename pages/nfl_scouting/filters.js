'use strict';

// Load Base Page
var BasePage = require('../../pages/base/base_page.js')

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;

// Mixins
var _ = require('underscore');
var inputs = require('./mixins/inputs.js');

/****************************************************************************
** Constructor
*****************************************************************************/
function Filters(driver) {
  BasePage.call(this, driver)
};

Filters.prototype = Object.create(BasePage.prototype);
Filters.prototype.constructor = Filters;

// Mixins
_.extend(Filters.prototype, inputs);

/****************************************************************************
** Functions
*****************************************************************************/
Filters.prototype.setResourceSetFilter = function(filterName, optionNames) {
  var d = Promise.defer();
  var thiz = this;
  
  var filterInput = By.xpath(`.//div[not(contains(@class, 'hidden'))]/div[@class='filter'][div[text()=' ${filterName} ']]/div[@class='filter-control']/div/div/span/input[contains(@class, 'tt-input')]`);
  var selectedOptionLocators = By.xpath(`.//div[not(contains(@class, 'hidden'))]/div[@class='filter'][div[text()=' ${filterName} ']]/.//div[@class='entities']/span/i`);

  this.driver.findElements(selectedOptionLocators).then(function(elements) {
    var count = elements.length;

    for(var i=1; i<=count; i++) {
      var option = By.xpath(`.//div[not(contains(@class, 'hidden'))]/div[@class='filter'][div[text()=' ${filterName} ']]/.//div[@class='entities']/span/i`);
    
      thiz.click(option);
    }
  }).then(function() {
    optionNames.forEach(function(optionName) {
      thiz.sendKeys(filterInput, optionName);
      thiz.click(By.xpath(`.//div[contains(@class,'tt-menu')]/.//div[contains(@class, 'tt-suggestion')]/strong[text()='${optionName}']`));
    });
  });
  return d.promise;
};

Filters.prototype.setDropdownFilter = function(filterName, optionNames, parentInject) {
  var t = new Date();
  var d = Promise.defer();
  var thiz = this;

  if (parentInject) {
    var filterInput = By.xpath(`.//div[@inject="${parentInject}"]/.//div[not(contains(@class, 'hidden'))]/div[@class='filter'][div[text()=' ${filterName} ']]/div[@class='filter-control']`);
    var selectedOptionLocators = By.xpath(`.//div[@inject="${parentInject}"]/.//div[not(contains(@class, 'hidden'))]/div[@class='filter'][div[text()=' ${filterName} ']]/.//li[contains(@class, 'selected')]`);
  } else {
    var filterInput = By.xpath(`.//div[@class='filter'][div[text()=' ${filterName} ']]/div[@class='filter-control']`);
    var selectedOptionLocators = By.xpath(`.//div[not(contains(@class, 'hidden'))]/div[@class='filter'][div[text()=' ${filterName} ']]/.//li[contains(@class, 'selected')]`);  
    
  }
  

  thiz.click(filterInput);

  this.driver.findElements(selectedOptionLocators).then(function(elements) {
    var count = elements.length;

    for(var i=1; i<=count; i++) {    
      thiz.click(selectedOptionLocators);
      thiz.click(filterInput);
    }

  }).then(function() {
    optionNames.forEach(function(optionName) {
      if (parentInject) {
        var optionLocator = By.xpath(`.//div[@inject="${parentInject}"]/.//div[not(contains(@class, 'hidden'))]/div[@class='filter'][div[text()=' ${filterName} ']]/.//li[text()='${optionName}']`);
      } else {
        var optionLocator = By.xpath(`.//div[not(contains(@class, 'hidden'))]/div[@class='filter'][div[text()=' ${filterName} ']]/.//li[text()='${optionName}']`);  
      }
      thiz.click(optionLocator);
      thiz.click(filterInput);
    });
  }).then(function() {
    d.fulfill(thiz.click(filterInput));
  });

  return d.promise;
};

Filters.prototype.changeDropdownFilter = function(filterName, optionName) {
  var locator = By.xpath(`.//div[not(contains(@class, 'hidden'))]/div[@class='filter'][div[text()=' ${filterName} ']]/div[@class='filter-control']`);
  var optionLocator = By.xpath(`.//div[not(contains(@class, 'hidden'))]/div[@class='filter'][div[text()=' ${filterName} ']]/.//li[text()='${optionName}']`)
  return this.changeDropdown(locator, optionLocator);
};

Filters.prototype.changeCheckboxFilter = function(filterName, selected) {
  var locator = By.xpath(`.//div[not(contains(@class, 'hidden'))]/div[@class='filter'][div[text()=' ${filterName} ']]/div/div`);
  return this.changeCheckbox(locator, selected);
};

Filters.prototype.changeRangeFilter = function(filterName, minValue, maxValue) {
  var minLocator = By.xpath(`.//div[not(contains(@class, 'hidden'))]/div[@class='filter'][div[text()=' ${filterName} ']]/.//div[@inject='min']/input`);
  var maxLocator = By.xpath(`.//div[not(contains(@class, 'hidden'))]/div[@class='filter'][div[text()=' ${filterName} ']]/.//div[@inject='max']/input`);

  this.changeInput(minLocator, minValue);
  return this.changeInput(maxLocator, maxValue);
};

Filters.prototype.changeTextFilter = function(filterName, value) {
  var locator = By.xpath(`.//div[not(contains(@class, 'hidden'))]/div[@class='filter'][div[text()=' ${filterName} ']]/div/div/input`);
  return this.changeInput(locator, value);
};

Filters.prototype.changeFilterLogic = function(filterName, logic) {
    var d = Promise.defer();
    var logicLocator = By.xpath(`.//div[not(contains(@class, 'hidden'))]/div[@class='filter'][div[text()=' ${filterName} ']]/span[contains(@class,'-logic')]`);

    this.getText(logicLocator).then(function(text) {
      if (text != logic) {
        this.click(logicLocator);
      }
      d.fulfill(true);
    }.bind(this));
    return d.promise;
};

Filters.prototype.removeFilter = function(filterName) {
  var locator = By.xpath(`.//div[not(contains(@class, 'hidden'))]/div[@class='filter'][div[text()=' ${filterName} ']]/i[contains(@class,'-remove')]`)
  return this.click(locator);
};

module.exports = Filters;