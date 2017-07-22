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
var LAST_LOCATOR = By.xpath(".//div[@inject='content']/.//div[contains(@class,'scroll-wrap-x')]/table");

// Reports
var REPORTS_TABLE_LOCATOR = By.xpath(".//div[@inject='reports']/.//div[contains(@class,'scroll-wrap-x')]/table");
var REPORTS_TABLE_ROW_COUNT_INPUT = By.xpath(".//div[@inject='reports']/.//div[@inject='page.count']/input");
var REPORTS_TABLE_ROWS = By.xpath(".//div[@inject='reports']/.//div[contains(@class,'scroll-wrap-x')]/table/tbody/tr[not(contains(@class, 'hidden'))]");
var REPORTS_ADD_FILTER_INPUT = By.xpath(".//div[@inject='reports']/.//div[@inject='availableFilters']/.//input[@class='typeahead tt-input']");
var SEARCH_REPORTS_TITLE = By.xpath(".//div[text()=' Search Players ']");
var REPORTS_TOGGLE_COLUMNS_INPUT = By.xpath(".//div[@inject='reports']/.//div[@inject='availableColumns']/span/input[contains(@class, 'tt-input')]");
var REPORTS_EXPORT_BUTTON = By.css("div[inject='reports'] button.-csv");
var REPORTS_NEXT_BUTTON = By.css("div[inject='reports'] button.-next");
var REPORTS_PREVIOUS_BUTTON = By.css("div[inject='reports'] button.-previous");

var TABLE_LOCATOR_SUFFIX = {
  'First Name': 'div/a',
  'Last Name': 'div/a',
  'Team Code': 'div',
  'Tier': 'div',
  'First Name': 'div/input',
  'Draft Year': 'div/input',
  'Pos': 'div/div',
  'Bowl Game': 'div',
  'Feb. Grade': 'div',
  'Dec. Grade': 'div',
  'Final. Grade': 'div',
  'Final. Grade': 'div',
  'Alerts': 'div',
  'Draft Position': 'div',
  'Starter': 'div/i',
  'Underclassman': 'div',
  'Jag Head': 'div',
  'Skull/Crossbones': 'div',
  'T': 'div',
  'SR': 'div',
  'NIC': 'div',
  'Red Dot': 'div',
  'Blk': 'div',
  'Blk+': 'div',
  'Jersey': 'div'
}
/****************************************************************************
** Constructor
*****************************************************************************/
function SearchPage(driver) {
  BasePage.call(this, driver);
};

SearchPage.prototype = Object.create(BasePage.prototype);
SearchPage.prototype.constructor = SearchPage;

// Mixins
_.extend(SearchPage.prototype, inputs);

/****************************************************************************
** Functions
*****************************************************************************/
SearchPage.prototype.waitForPageToLoad = function() {
  return this.waitUntilStaleness(REPORTS_TABLE_LOCATOR, 20000);
};

/****************************************************************************
** Sorting
*****************************************************************************/
SearchPage.prototype.clickReportsTableHeader = function(col) {
  var locator = By.xpath(`.//div[@inject='reports']/.//div[contains(@class,'scroll-wrap-x')]/table/thead/tr/th[${col}]`);
  this.click(locator);
  return this.waitForPageToLoad();
};

SearchPage.prototype.clickReportsSortIcon = function(col) {
  var locator = By.xpath(`.//div[@inject='reports']/.//div[contains(@class,'scroll-wrap-x')]/table/thead/tr/th[${col}]/i[@class='material-icons']`);
  this.click(locator);
  return this.waitForPageToLoad();
};

SearchPage.prototype.clickReportsRemoveSortIcon = function(col) {
  var locator = By.xpath(`.//div[@inject='reports']/.//div[contains(@class,'scroll-wrap-x')]/table/thead/tr/th[${col}]/i[contains(@class, '-cancel')]`);
  this.click(locator);
  return this.waitForPageToLoad();
};


/****************************************************************************
** Table Stats
*****************************************************************************/
SearchPage.prototype.getReportsTableStats = function(col) {
  var d = Promise.defer();
  var thiz = this;
  var inputLocator = By.xpath(`.//div[@inject='reports']/.//div[contains(@class,'scroll-wrap-x')]/table/tbody[@inject='rows']/tr[not(contains(@class,'hidden'))]/td[${col}]/div/input`);
  var locator = By.xpath(`.//div[@inject='reports']/.//div[contains(@class,'scroll-wrap-x')]/table/tbody[@inject='rows']/tr[not(contains(@class,'hidden'))]/td[${col}]/div/*[self::div or self::a or self::input]`);
  
  this.driver.wait(Until.elementLocated(inputLocator),100).then(function() {
    d.fulfill(thiz.getInputValueArray(inputLocator));
  }, function(err) {
    d.fulfill(thiz.getTextArray(locator));
  })

  return d.promise;
};

SearchPage.prototype.getReportsTableStatsForCol = function(col) {
  var d = Promise.defer();
  var thiz = this;
  var inputLocator = By.xpath(`.//div[@inject='reports']/.//table/tbody[@inject='rows']/tr/td[${col}]/div/input`);
  var locator = By.xpath(`.//div[@inject='reports']/.//table/tbody[@inject='rows']/tr/td[${col}]/div/*[self::div or self::a or self::input]`);
  
  this.driver.wait(Until.elementLocated(inputLocator),100).then(function() {
    d.fulfill(thiz.getInputValueArray(inputLocator));
  }, function(err) {
    d.fulfill(thiz.getTextArray(locator));
  })

  return d.promise;
};

SearchPage.prototype.getReportsTableStatsFor = function(name) {
  var d = Promise.defer();
  var thiz = this;
  var inputLocator = By.xpath(`.//div[@inject='reports']/.//div[contains(@class,'scroll-wrap-x')]/table/tbody/tr[not(contains(@class,'hidden'))]/td[count(//div[@inject='reports']/.//table/thead/tr/th[text()=" ${name}"]/preceding-sibling::th)+1]/div/input`);
  var locator = By.xpath(`.//div[@inject='reports']/.//div[contains(@class,'scroll-wrap-x')]/table/tbody/tr[not(contains(@class,'hidden'))]/td[count(//div[@inject='reports']/.//table/thead/tr/th[text()=" ${name}"]/preceding-sibling::th)+1]/${TABLE_LOCATOR_SUFFIX[name]}`);
  
  this.driver.wait(Until.elementLocated(inputLocator),100).then(function() {
    d.fulfill(thiz.getInputValueArray(inputLocator));
  }, function(err) {
    d.fulfill(thiz.getTextArray(locator));
  })

  return d.promise;
};

// table stats
SearchPage.prototype.getReportsTableStat = function(row, col, placeholder) {
  var d = Promise.defer();
  var thiz = this;
  var inputLocator = By.xpath(`.//div[@inject='reports']/.//div[contains(@class,'scroll-wrap-x')]/table/tbody[@inject='rows']/tr[not(contains(@class,'hidden'))][${row}]/td[${col}]/div/input`);
  var locator = By.xpath(`.//div[@inject='reports']/.//div[contains(@class,'scroll-wrap-x')]/table/tbody[@inject='rows']/tr[not(contains(@class,'hidden'))][${row}]/td[${col}]/div/*[self::div or self::a or self::input]`);
  
  this.driver.wait(Until.elementLocated(inputLocator),100).then(function() {
    thiz.driver.findElement(inputLocator).getAttribute('value').then(function(stat) {
      if (placeholder && stat == placeholder) {
        d.fulfill("");
      } else {
        d.fulfill(stat);
      }
    })
  }, function(err) {
    thiz.getText(locator).then(function(stat) {
      if (placeholder && stat == placeholder) {
        d.fulfill("");
      } else {
        d.fulfill(stat);
      }

    })

  });

  return d.promise;
};

/****************************************************************************
** Filters
*****************************************************************************/
SearchPage.prototype.addReportsFilter = function(name) {
  var optionLocator = By.xpath(`.//div[@inject='reports']/.//div[@class='tt-dataset tt-dataset-availableFilters']/div[@class='tt-suggestion tt-selectable'][text()='${name}']`)
  this.click(REPORTS_ADD_FILTER_INPUT);
  return this.click(optionLocator);
};

SearchPage.prototype.removeReportsFilter = function(name) {
  var locator = By.xpath(`.//div[@inject='reports']/.//div[@class='filter'][div[@class='filter-label'][text()=" ${name} "]]/i`)
  return this.click(locator);
};

/****************************************************************************
** Table Controls
*****************************************************************************/
SearchPage.prototype.changeReportsNumberOfRows = function(numRows) {
  var thiz = this;
  var d = Promise.defer();

  this.getInput(REPORTS_TABLE_ROW_COUNT_INPUT).then(function(stat) {
    var digits = stat.toString().length;
    for (var i=0; i<digits; i++) {
      thiz.sendKeys(REPORTS_TABLE_ROW_COUNT_INPUT, Key.BACK_SPACE);    
    }

    thiz.sendKeys(REPORTS_TABLE_ROW_COUNT_INPUT, numRows);
    d.fulfill(thiz.sendKeys(REPORTS_TABLE_ROW_COUNT_INPUT, Key.ENTER));
  })

  return d.promise;
};

SearchPage.prototype.getReportsTableRowCount = function() {
  return this.getElementCount(REPORTS_TABLE_ROWS);
};

SearchPage.prototype.toggleReportsColumn = function(colName, selected) {
  var d = Promise.defer();
  var thiz = this;
 
  this.click(REPORTS_TOGGLE_COLUMNS_INPUT);

  if (selected) {
    var optionLocator = By.xpath(`.//div[@inject='reports']/.//div[contains(@class, 'tt-dataset-availableColumns')]/div[@class='tt-suggestion tt-selectable'][text()=' ${colName}']`);
  } else {
    var optionLocator = By.xpath(`.//div[@inject='reports']/.//div[contains(@class, 'tt-dataset-availableColumns')]/div[@class='highlight tt-suggestion tt-selectable'][text()=' ${colName}']`);
  }

  this.locate(optionLocator, 100).then(function() {
    d.fulfill(thiz.click(optionLocator));
  }, function(err) {
    d.fulfill(thiz.click(SEARCH_REPORTS_TITLE));
  });

  return d.promise;
};

SearchPage.prototype.clickReportsNextButton = function() {
  this.click(REPORTS_NEXT_BUTTON);
  return this.waitForPageToLoad();
};

SearchPage.prototype.clickReportsPreviousButton = function() {
  this.click(REPORTS_PREVIOUS_BUTTON);
  return this.waitForPageToLoad();
};

/****************************************************************************
** Exports
*****************************************************************************/
SearchPage.prototype.clickReportsExportButton = function() {
  this.click(REPORTS_EXPORT_BUTTON);
  return this.driver.sleep(5000);
};

SearchPage.prototype.readAndDeleteReportsExportCSV = function() {
  return this.readAndDeleteCSV('../Downloads/export.csv');
};

module.exports = SearchPage;