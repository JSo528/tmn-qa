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
var LAST_LOCATOR = By.xpath(".//div[@inject='content']/.//div[@class='scroll-wrap-x']/table");

var TABLE_ROW_COUNT_INPUT = By.xpath(".//div[@inject='page.count']/input");
var TABLE_ROWS = By.xpath(".//div[@inject='content']/.//div[@class='scroll-wrap-x']/table/tbody/tr[not(contains(@class, 'hidden'))]");

var ADD_FILTER_INPUT = By.xpath(".//div[@inject='availableFilters']/.//input[@class='typeahead tt-input']");
var SEARCH_PLAYERS_TITLE = By.xpath(".//div[text()=' Search Players ']");
var TOGGLE_COLUMNS_INPUT = By.xpath(".//div[@inject='availableColumns']/span/input[contains(@class, 'tt-input')]");
var EXPORT_BUTTON = By.css("button.-csv");
var NEXT_BUTTON = By.css("button.-next");
var PREVIOUS_BUTTON = By.css("button.-previous");

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
function PlayersPage(driver) {
  BasePage.call(this, driver);
};

PlayersPage.prototype = Object.create(BasePage.prototype);
PlayersPage.prototype.constructor = PlayersPage;

// Mixins
_.extend(PlayersPage.prototype, inputs);

/****************************************************************************
** Functions
*****************************************************************************/
PlayersPage.prototype.waitForPageToLoad = function() {
  return this.waitUntilStaleness(LAST_LOCATOR, 20000);
};

/****************************************************************************
** Sorting
*****************************************************************************/
PlayersPage.prototype.clickTableHeader = function(col) {
  var locator = By.xpath(`.//div[@class='search']/.//table/thead/tr/th[${col}]`);
  this.click(locator);
  return this.waitForPageToLoad();
};

PlayersPage.prototype.clickSortIcon = function(col) {
  var locator = By.xpath(`.//div[@class='search']/.//table/thead/tr/th[${col}]/i[contains(@class, 'material-icons')]`);
  this.click(locator);
  return this.waitForPageToLoad();
};

PlayersPage.prototype.clickRemoveSortIcon = function(col) {
  var locator = By.xpath(`.//div[@class='search']/.//table/thead/tr/th[${col}]/i[contains(@class, '-cancel')]`);
  this.click(locator);
  return this.waitForPageToLoad();
};

/****************************************************************************
** Table Stats
*****************************************************************************/
PlayersPage.prototype.getTableStats = function(col) {
  var d = Promise.defer();
  var thiz = this;
  var inputLocator = By.xpath(`.//div[@class='search']/.//table/tbody[@inject='rows']/tr[not(contains(@class,'hidden'))]/td[${col}]/div/input`);
  var locator = By.xpath(`.//div[@class='search']/.//table/tbody[@inject='rows']/tr[not(contains(@class,'hidden'))]/td[${col}]/div/*[self::div or self::a or self::input]`);
  
  this.driver.wait(Until.elementLocated(inputLocator),100).then(function() {
    d.fulfill(thiz.getInputValueArray(inputLocator));
  }, function(err) {
    d.fulfill(thiz.getTextArray(locator));
  })

  return d.promise;
};

PlayersPage.prototype.getTableStatsFor = function(name) {
  var d = Promise.defer();
  var thiz = this;
  var inputLocator = By.xpath(`.//div[@class='search']/.//table/tbody/tr/td[count(//table/thead/tr/th[text()=" ${name}"]/preceding-sibling::th)+1]/div/input`);
  var locator = By.xpath(`.//div[@class='search']/.//table/tbody/tr/td[count(//table/thead/tr/th[text()=" ${name}"]/preceding-sibling::th)+1]/${TABLE_LOCATOR_SUFFIX[name]}`);
  
  this.driver.wait(Until.elementLocated(inputLocator),100).then(function() {
    d.fulfill(thiz.getInputValueArray(inputLocator));
  }, function(err) {
    d.fulfill(thiz.getTextArray(locator));
  })

  return d.promise;
};

// table stats
PlayersPage.prototype.getTableStat = function(row, col, placeholder) {
  var d = Promise.defer();
  var thiz = this;
  var inputLocator = By.xpath(`.//div[@class='search']/.//table/tbody[@inject='rows']/tr[not(contains(@class,'hidden'))][${row}]/td[${col}]/div/input`);
  var locator = By.xpath(`.//div[@class='search']/.//table/tbody[@inject='rows']/tr[not(contains(@class,'hidden'))][${row}]/td[${col}]/div/*[self::div or self::a or self::input]`);
  
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

PlayersPage.prototype.clickTableStat = function(row, col) {
  var locator = By.xpath(`.//div[@class='search']/.//table/tbody[@inject='rows']/tr[${row}]/td[${col}]/div/*[self::div or self::a or self::input]`);
  return this.click(locator);
};

PlayersPage.prototype.changeTableStatInput = function(row, col, value) {
  var locator = By.xpath(`.//div[@class='search']/.//table/tbody[@inject='rows']/tr[not(contains(@class,'hidden'))][${row}]/td[${col}]/div/input`);
  return this.changeInput(locator, value)
};

PlayersPage.prototype.changeTableStatDropdown = function(row, col, value) {
  if (value == '?') {
    var currentValue;
    var thiz = this
    var d = Promise.defer();

    this.getTableStat(row, col).then(function(stat) {
      currentValue = stat
    }).then(function() {
      if (currentValue != 'Select value') {
        var locator = By.xpath(`.//div[@class='search']/.//table/tbody[@inject='rows']/tr[not(contains(@class,'hidden'))][${row}]/td[${col}]/div`);
        var optionLocator = By.xpath(`.//div[@class='search']/.//table/tbody[@inject='rows']/tr[not(contains(@class,'hidden'))][${row}]/td[${col}]/.//li[text()='${currentValue}']`)
        d.fulfill(thiz.changeDropdown(locator, optionLocator));
      }
    });

    return d.promise;
  } else {
    var locator = By.xpath(`.//div[@class='search']/.//table/tbody[@inject='rows']/tr[not(contains(@class,'hidden'))][${row}]/td[${col}]/div`);
    var optionLocator = By.xpath(`.//div[@class='search']/.//table/tbody[@inject='rows']/tr[not(contains(@class,'hidden'))][${row}]/td[${col}]/.//li[text()='${value}']`)
    return this.changeDropdown(locator, optionLocator);  
  }
};

/****************************************************************************
** Filters
*****************************************************************************/
PlayersPage.prototype.addFilter = function(name) {
  var optionLocator = By.xpath(`.//div[@class='tt-dataset tt-dataset-availableFilters']/div[@class='tt-suggestion tt-selectable'][text()='${name}']`)
  this.click(ADD_FILTER_INPUT);
  return this.click(optionLocator);
};

/****************************************************************************
** Table Controls
*****************************************************************************/
PlayersPage.prototype.changeNumberOfRows = function(numRows) {
  var thiz = this;
  var d = Promise.defer();

  this.getTableRowCount().then(function(stat) {
    var digits = stat.toString().length;
    for (var i=0; i<digits; i++) {
      thiz.sendKeys(TABLE_ROW_COUNT_INPUT, Key.BACK_SPACE);    
    }

    thiz.sendKeys(TABLE_ROW_COUNT_INPUT, numRows);
    thiz.sendKeys(TABLE_ROW_COUNT_INPUT, Key.ENTER);
    d.fulfill(thiz.waitUntilStaleness(By.xpath(".//div[@inject='players']"), 500));
  })

  return d.promise;
};

PlayersPage.prototype.getTableRowCount = function() {
  return this.getElementCount(TABLE_ROWS);
};

PlayersPage.prototype.toggleColumn = function(colName, selected) {
  var d = Promise.defer();
  var thiz = this;
 
  this.click(TOGGLE_COLUMNS_INPUT);

  if (selected) {
    var optionLocator = By.xpath(`.//div[contains(@class, 'tt-dataset-availableColumns')]/div[@class='tt-suggestion tt-selectable'][text()=' ${colName}']`);
  } else {
    var optionLocator = By.xpath(`.//div[contains(@class, 'tt-dataset-availableColumns')]/div[@class='highlight tt-suggestion tt-selectable'][text()=' ${colName}']`);
  }

  this.locate(optionLocator, 100).then(function() {
    d.fulfill(thiz.click(optionLocator));
  }, function(err) {
    d.fulfill(thiz.click(SEARCH_PLAYERS_TITLE));
  });

  return d.promise;
};

PlayersPage.prototype.clickNextButton = function() {
  this.click(NEXT_BUTTON);
  return this.waitForPageToLoad();
};

PlayersPage.prototype.clickPreviousButton = function() {
  this.click(PREVIOUS_BUTTON);
  return this.waitForPageToLoad();
};

/****************************************************************************
** Exports
*****************************************************************************/
PlayersPage.prototype.clickExportButton = function() {
  this.click(EXPORT_BUTTON);
  return this.driver.sleep(5000);
};

PlayersPage.prototype.readAndDeleteExportCSV = function() {
  return this.readAndDeleteCSV('../Downloads/export.csv');
};

/****************************************************************************
** Aggregate Helpers
*****************************************************************************/
PlayersPage.prototype.changeTableStatField = function(type, row, col, value) {
  switch (type) {
    case 'input':
      return this.changeTableStatInput(row, col, value);
    case 'dropdown':
      return this.changeTableStatDropdown(row, col, value);
  }
};


module.exports = PlayersPage;