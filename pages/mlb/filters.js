'use strict';

// Load Base Page
var BasePage = require('../base/base_page.js');

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;
var Key = require('selenium-webdriver').Key;

// Locators
var FILTER_SELECT = By.id('s2id_addFilter');
var DROPDOWN_INPUT = By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input");
var SIDEBAR_DROPDOWN_INPUT = By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input");
var SIDEBAR_FILTER_GROUP_SELECT = By.id('filterSideViewGroupSelect');
var UPDATE_BUTTON = By.className('update');  
var LOADING_CONTAINER = By.id('loadingContainer');
var DEFAULT_FILTERS_BUTTON = By.css('#filterSet button.default-filters');

function Filters(driver) {
  BasePage.call(this, driver);
}

Filters.prototype = Object.create(BasePage.prototype);
Filters.prototype.constructor = Filters;

/****************************************************************************
** Top Dropdown Filters
*****************************************************************************/
Filters.prototype.addDropdownFilter = function(filter) {
  this.changeDropdown(FILTER_SELECT, DROPDOWN_INPUT, filter);
  return this.waitUntilStaleness(LOADING_CONTAINER, 20000);
};

Filters.prototype.closeDropdownFilter = function(filterName) {
  var locator = By.xpath(`.//div[@id='filterSet']/div/div/div/div[div[contains(text()[1], "${filterName}")]]/div/span[contains(@class,'closer')]`);
  this.click(locator);
  return this.click(UPDATE_BUTTON);
};

// if no selection, remove the first option (good for dynamic default values like year)
Filters.prototype.removeSelectionFromDropdownFilter = function(filterName, selection, update) {
  var locator;
  if (selection) {
    locator = By.xpath(`.//div[@id='filterSet']/div/div/div/div[div[contains(text()[1], "${filterName}")]]/div/ul/li[div[contains(text()[1], ${selection})]]/a[@class='select2-search-choice-close']`);  
  } else {
    locator = By.xpath(`.//div[@id='filterSet']/div/div/div/div[div[contains(text()[1], "${filterName}")]]/div/ul/li[1]/a[@class='select2-search-choice-close']`);  
  }
  
  if (update) {
    this.click(locator);
    return this.click(UPDATE_BUTTON);
  } else {
    return this.click(locator);
  }
};

Filters.prototype.addSelectionToDropdownFilter = function(filterName, selection) {
  var locator = By.xpath(`.//div[@id='filterSet']/div/div/div/div[div[contains(text()[1], "${filterName}")]]/div/ul`);
  var inputLocator = By.xpath(`.//div[@id='filterSet']/div/div/div/div[div[contains(text()[1], "${filterName}")]]/div/ul/li[contains(@class, 'select2-search-field')]/input`);
  this.click(locator, 10000);
  this.sendKeys(inputLocator, selection, 10000);
  this.sendKeys(inputLocator, Key.ENTER);
  return this.sendKeys(inputLocator, Key.ESCAPE);
};

// single select dropdown filters
Filters.prototype.changeSelectionToDropdownFilter = function(filterName, selection) {
  var locator = By.xpath(`.//div[@id='filterSet']/div/div/div/div[div[contains(text()[1], "${filterName}")]]/div/a`);
  var inputLocator = By.xpath(`.//ul[@class='select2-results']/li/div[contains(text(),"${selection}")]`);
  this.click(locator);
  return this.click(inputLocator)
};

// filterName<String> : name of the filter that should be changed 
// select<Bool>       : whether the filter should be selected all or not  
// update<Bool>       : whether the update button should be pressed or not
Filters.prototype.selectAllForDropdownFilter = function(filterName, select, update) {
  var d = Promise.defer();
  var thiz = this;

  var locator = By.xpath(`.//div[@id='filterSet']/div/div/div/div[div[contains(text()[1], "${filterName}")]]/div/span[contains(@class,'select-all')]/input`);
  var element = this.driver.findElement(locator);
  element.isSelected().then(function(selected) {
    if (selected != select) {
      element.click().then(function() {
        d.fulfill(update ? thiz.click(UPDATE_BUTTON) : d.fulfill(true));
      });
    } else {
      d.fulfill(update ? thiz.click(UPDATE_BUTTON) : d.fulfill(false));
    }
  });

  return d.promise;
};

Filters.prototype.changeValuesForDateDropdownFilter = function(filterName, dateFrom, dateTo, update) {
  var dateFromLocator = By.xpath(`.//div[@id='filterSet']/div/div/div/div[div[contains(text()[1], "${filterName}")]]/div[2]/div/input[contains(@class,'date-range-from')]`);
  var dateToLocator = By.xpath(`.//div[@id='filterSet']/div/div/div/div[div[contains(text()[1], "${filterName}")]]/div[2]/div/input[contains(@class,'date-range-to')]`);
  this.clear(dateFromLocator);
  this.clear(dateToLocator);
  this.sendKeys(dateFromLocator, dateFrom);
  this.sendKeys(dateFromLocator, Key.ENTER);
  this.sendKeys(dateToLocator, dateTo);
  this.sendKeys(dateToLocator, Key.ENTER);

  return update ? this.click(UPDATE_BUTTON) : Promise.fulfilled(true);  
};

// filterName<String> : name of the filter that should be changed 
// selection<String   : dropdown option value to be selected (exact text value)
Filters.prototype.changeDropdownForDateDropdownFilter = function(filterName, selection) {
  var selectLocator = By.xpath(`.//div[@id='filterSet']/div/div/div/div[div[contains(text()[1], "${filterName}")]]/div/select`);
  this.click(selectLocator);
  var optionLocator = By.xpath(`.//div[@id='filterSet']/div/div/div/div[div[contains(text()[1], "${filterName}")]]/div/select/option[contains(@value, "${selection}")]`);
  return this.click(optionLocator);
};

// for boolean dropdown filters like pitcher hand, homeOrAway, etc.
Filters.prototype.selectForBooleanDropdownFilter = function(filterName, selection) {
  var locator = By.xpath(`.//div[@id='filterSet']/div/div/div/div[div[contains(text()[1], "${filterName}")]]/div/a`);
  return this.changeDropdown(locator, DROPDOWN_INPUT, selection);
};

// for range dropdown filters like velocity, etc.
Filters.prototype.changeValuesForRangeDropdownFilter = function(filterName, rangeStart, rangeEnd, update) {
  var rangeStartLocator = By.xpath(`.//div[@id='filterSet']/div/div/div/div[div[contains(text()[1], "${filterName}")]]/div/input[contains(@class,'range-text-start')]`);
  var rangeEndLocator = By.xpath(`.//div[@id='filterSet']/div/div/div/div[div[contains(text()[1], "${filterName}")]]/div/input[contains(@class,'range-text-end')]`);
  this.clear(rangeStartLocator);
  this.clear(rangeEndLocator);
  this.sendKeys(rangeStartLocator, rangeStart);
  this.sendKeys(rangeEndLocator, rangeEnd);

  return update ? this.click(UPDATE_BUTTON) : Promise.fulfilled(true);  
};

Filters.prototype.getCurrentFiltersForDropdownFilter = function(filterName) {
  var d = Promise.defer();
  var locator = By.xpath(`.//div[@id='filterSet']/div/div/div/div[div[contains(text()[1], "${filterName}")]]/div/ul/li/div`);
  var filters = [];
  this.driver.findElements(locator).then(function(elements) {
    elements.forEach(function(element) {
      element.getText().then(function(text) {
        filters.push(text);
      });
    });
    d.fulfill(filters);
  });
  return d.promise;
};

Filters.prototype.clickDefaultFiltersBtn = function() {
  this.click(DEFAULT_FILTERS_BUTTON);
};

/****************************************************************************
** Sidebar Filters
*****************************************************************************/
Filters.prototype.changeFilterGroupDropdown = function(filterGroupName) {
  this.click(SIDEBAR_FILTER_GROUP_SELECT);
  var optionLocator = By.xpath(`.//select[@id='filterSideViewGroupSelect']/option[text()="${filterGroupName}"]`);
  return this.click(optionLocator);
};

// filterName<String> : name of the filter that should be changed 
// optionName<String> : name of the option that should be (de)selected (exact match)
// select<Bool>       : whether the option should be selected or not
Filters.prototype.toggleSidebarFilter = function(filterName, optionName, select) {
  var d = Promise.defer();
  var thiz = this;
  var locator = By.xpath(`.//div[@class='tab-content']/div[contains(@class, 'active')]/div/div/div[div/h5[text()='${filterName}']]/div/div/div/label[text()='${optionName}']`);

  this.getAttribute(locator, 'class').then(function(className) {
    var isSelected = className.includes('active');
    if ((isSelected && !select) || (!isSelected && select)) {
      d.fulfill(thiz.clickAndWait(locator, LOADING_CONTAINER, 10000));   
    } else {
      d.fulfill(false);
    }
  });
  
  return d.promise;
};

Filters.prototype.toggleSelectAllSidebarFilter = function(filterName, select) {
  var d = Promise.defer();
  var thiz = this;
  var locator = By.xpath(`.//div[@class='tab-content']/div[contains(@class, 'active')]/div/div/div[div/h5[text()='${filterName}']]/div/div/label[contains(@class, 'select-filter-all')]`);
  
  this.getAttribute(locator, 'class').then(function(className) {
    var isSelected = className.includes('active');
    if ((isSelected && !select) || (!isSelected && select)) {
      d.fulfill(thiz.clickAndWait(locator, LOADING_CONTAINER));   
    } else {
      d.fulfill(false);
    }
  });
  
  return d.promise;
};

// filterName<String> : name of the filter that should be changed(exact text value)
// dateFrom<String>   : from date in the format of 'YYYY-MM-DD'
// dateTo<String>     : to date in the format of 'YYYY-MM-DD'
Filters.prototype.changeValuesForDateSidebarFilter = function(filterName, dateFrom, dateTo) {
  var dateFromLocator = By.xpath(`.//div[@class='tab-content']/div[contains(@class, 'active')]/div/div/div[div/h5[text()='${filterName}']]/div/div/div/div/input[contains(@class, 'date-range-from')]`);
  var dateToLocator = By.xpath(`.//div[@class='tab-content']/div[contains(@class, 'active')]/div/div/div[div/h5[text()='${filterName}']]/div/div/div/div/input[contains(@class, 'date-range-to')]`);
  this.clear(dateFromLocator);
  this.clear(dateToLocator);
  this.sendKeys(dateFromLocator, dateFrom);
  this.sendKeys(dateFromLocator, Key.ENTER);
  this.sendKeys(dateToLocator, dateTo);
  this.sendKeys(dateToLocator, Key.ENTER);
  return this.waitUntilStaleness(LOADING_CONTAINER);
};

// filterName<String> : name of the filter that should be changed(exact text value)
// selection<String   : dropdown option value to be selected (exact text value)
Filters.prototype.changeDropdownForDateSidebarFilter = function(filterName, selection) {
  var selectLocator = By.xpath(`.//div[@class='tab-content']/div[contains(@class, 'active')]/div/div/div[div/h5[text()='${filterName}']]/div/div/div/select`);
  this.click(selectLocator);
  var optionLocator = By.xpath(`.//div[@class='tab-content']/div[contains(@class, 'active')]/div/div/div[div/h5[text()='${filterName}']]/div/div/div/select/option[text()="${selection}"]`);
  this.click(optionLocator);
  return this.waitUntilStaleness(LOADING_CONTAINER);
};

// filterName<String> : name of the filter that should be changed (exact text value)
// update<Bool>       : whether the update button should be pressed or not
Filters.prototype.clickClearSidebarFilter = function(filterName, update) {
  var clearLink = By.xpath(`.//div[@class='tab-content']/div[contains(@class, 'active')]/div/div/div[div/h5[text()='${filterName}']]/div/a[contains(@class,'clear-link')]`);
  this.click(clearLink);

  return update ? this.clickAndWait(UPDATE_BUTTON, LOADING_CONTAINER) : Promise.fulfilled(true);  
};

Filters.prototype.changeValuesForRangeSidebarFilter = function(filterName, rangeStart, rangeEnd) {
  var rangeStartLocator = By.xpath(`.//div[@class='tab-content']/div[contains(@class, 'active')]/div/div/div[div/h5[text()='${filterName}']]/div/div/div/input[contains(@class,'range-text-start')]`);
  var rangeEndLocator = By.xpath(`.//div[@class='tab-content']/div[contains(@class, 'active')]/div/div/div[div/h5[text()='${filterName}']]/div/div/div/input[contains(@class,'range-text-end')]`);
  this.clear(rangeStartLocator);
  this.clear(rangeEndLocator);
  this.sendKeys(rangeStartLocator, rangeStart);
  this.sendKeys(rangeEndLocator, rangeEnd);
  this.sendKeys(rangeEndLocator, Key.ENTER);
  return this.waitUntilStaleness(LOADING_CONTAINER, 30000);
};

Filters.prototype.removeSelectionFromDropdownSidebarFilter = function(filterName, selection) {
  var locator = By.xpath(`.//div[@class='tab-content']/div[contains(@class, 'active')]/div/div/div[div/h5[text()='${filterName}']]/div/div/div/ul/li[div[text()='${selection}']]/a[@class='select2-search-choice-close']`);  
  return this.click(locator);
};

Filters.prototype.addSelectionToDropdownSidebarFilter = function(filterName, selection) {
  var locator = By.xpath(`.//div[@class='tab-content']/div[contains(@class, 'active')]/div/div/div[div/h5[text()='${filterName}']]/div/div/div/ul`);
  this.click(locator);
  var inputLocator = By.xpath(`.//div[@class='tab-content']/div[contains(@class, 'active')]/div/div/div[div/h5[text()='${filterName}']]/div/div/div/ul/li/input`);
  this.waitForEnabled(inputLocator);
  this.sendKeys(inputLocator, selection, 30000);
  this.sendKeys(inputLocator, Key.ENTER);
  this.sendKeys(inputLocator, Key.ESCAPE);
  return this.waitUntilStaleness(LOADING_CONTAINER, 30000);
};

Filters.prototype.selectAllForDropdownSidebarFilter = function(filterName, select) {
  var d = Promise.defer();
  var thiz = this;

  var locator = By.xpath(`.//div[@class='tab-content']/div[contains(@class, 'active')]/div/div/div[div/h5[text()='${filterName}']]/div/span/input`);
  var element = this.driver.findElement(locator);
  element.isSelected().then(function(selected) {
    if (selected != select) {
      d.fulfill(thiz.clickAndWait(locator, LOADING_CONTAINER, 30000));
    } else {
      d.fulfill(false);
    }
  });

  return d.promise;
};

Filters.prototype.selectForBooleanDropdownSidebarFilter = function(filterName, selection) {
  var locator = By.xpath(`.//div[@class='tab-content']/div[contains(@class, 'active')]/div/div/div[div/h5[text()='${filterName}']]/div/div/div/a`);
  this.changeDropdown(locator, SIDEBAR_DROPDOWN_INPUT, selection);
  return this.waitUntilStaleness(LOADING_CONTAINER, 30000);
};

module.exports = Filters;