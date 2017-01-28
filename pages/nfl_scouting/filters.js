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
Filters.prototype.changeDropdownFilter = function(filterName, optionName, selected) {
  var locator = By.xpath(`.//div[@class='filter'][div[contains(text(),'${filterName}')]]/div[@class='filter-control']`);
  var optionLocator = By.xpath(`.//div[@class='filter'][div[contains(text(),'${filterName}')]]/.//li[text()='${optionName}']`)
  return this.changeDropdown(locator, optionLocator);
};

Filters.prototype.changeCheckboxFilter = function(filterName, selected) {
  var locator = By.xpath(`.//div[@class='filter'][div[contains(text(),'${filterName}')]]/div/div`);
  return this.changeTriCheckbox(locator, selected);
};


module.exports = Filters;