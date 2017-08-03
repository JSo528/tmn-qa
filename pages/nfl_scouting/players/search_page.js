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

// Players
var PLAYERS_TABLE_ROW_COUNT_INPUT = By.xpath(".//div[@inject='players']/.//div[@inject='page.count']/input");
var PLAYERS_TABLE_ROWS = By.xpath(".//div[@inject='players']/.//div[contains(@class,'scroll-wrap-x')]/table/tbody/tr[not(contains(@class, 'hidden'))][td/div[@inject='_m._selected']]");
var PLAYERS_ADD_FILTER_INPUT = By.xpath(".//div[@inject='players']/.//div[@inject='availableFilters']/.//input[@class='typeahead tt-input']");
var SEARCH_PLAYERS_TITLE = By.xpath(".//div[text()=' Search Players ']");
var PLAYERS_TOGGLE_COLUMNS_INPUT = By.xpath(".//div[@inject='players']/.//div[@inject='availableColumns']/span/input[contains(@class, 'tt-input')]");
var PLAYERS_EXPORT_BUTTON = By.css("div[inject='players'] button.-csv");
var PLAYERS_NEXT_BUTTON = By.css("div[inject='players'] button.-next");
var PLAYERS_PREVIOUS_BUTTON = By.css("div[inject='players'] button.-previous");

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
  return this.waitUntilStaleness(LAST_LOCATOR, 20000);
};

/****************************************************************************
** Sorting
*****************************************************************************/
SearchPage.prototype.clickPlayersTableHeader = function(colName) {
  var locator = By.xpath(`.//div[@inject='players']/.//div[contains(@class,'scroll-wrap-x')]/table/thead/tr/th[text()=' ${colName}']`);
  this.click(locator);
  return this.waitForPageToLoad();
};

SearchPage.prototype.clickPlayersSortIcon = function(colName) {
  var locator = By.xpath(`.//div[@inject='players']/.//div[contains(@class,'scroll-wrap-x')]/table/thead/tr/th[text()=' ${colName}']/i[@class='material-icons']`);
  this.click(locator);
  return this.waitForPageToLoad();
};

SearchPage.prototype.clickPlayersRemoveSortIcon = function(colName) {
  var locator = By.xpath(`.//div[@inject='players']/.//div[contains(@class,'scroll-wrap-x')]/table/thead/tr/th[text()=' ${colName}']/i[contains(@class, '-cancel')]`);
  this.click(locator);
  return this.waitForPageToLoad();
};

/****************************************************************************
** Table Stats
*****************************************************************************/
SearchPage.prototype.getPlayersTableStats = function(colName) {
  var d = Promise.defer();
  var thiz = this;
  var inputLocator = By.xpath(`.//div[@inject='players']/.//div[contains(@class,'scroll-wrap-x')]/table/tbody/tr[not(contains(@class,'hidden'))]/td[count(//div[@inject='players']/.//table/thead/tr/th[text()=" ${colName}"]/preceding-sibling::th)+1]/div/input`);
  var locator = By.xpath(`.//div[@inject='players']/.//div[contains(@class,'scroll-wrap-x')]/table/tbody/tr[not(contains(@class,'hidden'))]/td[count(//div[@inject='players']/.//table/thead/tr/th[text()=" ${colName}"]/preceding-sibling::th)+1]/${TABLE_LOCATOR_SUFFIX[colName]}`);
  
  this.driver.wait(Until.elementLocated(inputLocator),100).then(function() {
    d.fulfill(thiz.getInputValueArray(inputLocator));
  }, function(err) {
    d.fulfill(thiz.getTextArray(locator));
  })

  return d.promise;
};

// table stats
SearchPage.prototype.getPlayersTableStat = function(row, colName, placeholder) {
  var d = Promise.defer();
  var thiz = this;
  var inputLocator = By.xpath(`.//div[@inject='players']/.//div[contains(@class,'scroll-wrap-x')]/table/tbody[@inject='rows']/tr[not(contains(@class,'hidden'))][${row}]/td[count(//div[@inject='players']/.//table/thead/tr/th[text()=" ${colName}"]/preceding-sibling::th)+1]/div/input`);
  var locator = By.xpath(`.//div[@inject='players']/.//div[contains(@class,'scroll-wrap-x')]/table/tbody[@inject='rows']/tr[not(contains(@class,'hidden'))][${row}]/td[count(//div[@inject='players']/.//table/thead/tr/th[text()=" ${colName}"]/preceding-sibling::th)+1]/div/*[self::div or self::a or self::input]`);
  
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

SearchPage.prototype.clickPlayersTableStat = function(row, colName) {
  var locator = By.xpath(`.//div[@inject='players']/.//div[contains(@class,'scroll-wrap-x')]/table/tbody[@inject='rows']/tr[${row}]/td[count(//div[@inject='players']/.//table/thead/tr/th[text()=" ${colName}"]/preceding-sibling::th)+1]/div/*[self::div or self::a or self::input]`);
  return this.click(locator);
};

SearchPage.prototype.changePlayersTableStatInput = function(row, colName, value) {
  var locator = By.xpath(`.//div[@inject='players']/.//div[contains(@class,'scroll-wrap-x')]/table/tbody[@inject='rows']/tr[not(contains(@class,'hidden'))][${row}]/td[count(//div[@inject='players']/.//table/thead/tr/th[text()=" ${colName}"]/preceding-sibling::th)+1]/div/input`);
  return this.changeInput(locator, value)
};

SearchPage.prototype.changePlayersTableStatDropdown = function(row, colName, value, placeholder) {
  var d = Promise.defer();
  var currentValue;
  var thiz = this
  
  this.getPlayersTableStat(row, colName).then(function(stat) {
    currentValue = stat
  }).then(function() {
    if (value && value != placeholder) {
      if (value != currentValue) {
        var locator = By.xpath(`.//div[@inject='players']/.//div[contains(@class,'scroll-wrap-x')]/table/tbody[@inject='rows']/tr[not(contains(@class,'hidden'))][${row}]/td[count(//div[@inject='players']/.//table/thead/tr/th[text()=" ${colName}"]/preceding-sibling::th)+1]/div`);
        var optionLocator = By.xpath(`.//div[@inject='players']/.//div[contains(@class,'scroll-wrap-x')]/table/tbody[@inject='rows']/tr[not(contains(@class,'hidden'))][${row}]/td[count(//div[@inject='players']/.//table/thead/tr/th[text()=" ${colName}"]/preceding-sibling::th)+1]/.//li[text()='${value}']`)
        d.fulfill(thiz.changeDropdown(locator, optionLocator));
      } else {
        d.fulfill(true)
      }
    } else {
      if (currentValue != placeholder) {
        var locator = By.xpath(`.//div[@inject='players']/.//div[contains(@class,'scroll-wrap-x')]/table/tbody[@inject='rows']/tr[not(contains(@class,'hidden'))][${row}]/td[count(//div[@inject='players']/.//table/thead/tr/th[text()=" ${colName}"]/preceding-sibling::th)+1]/div`);
        var optionLocator = By.xpath(`.//div[@inject='players']/.//div[contains(@class,'scroll-wrap-x')]/table/tbody[@inject='rows']/tr[not(contains(@class,'hidden'))][${row}]/td[count(//div[@inject='players']/.//table/thead/tr/th[text()=" ${colName}"]/preceding-sibling::th)+1]/.//li[text()='${currentValue}']`)
        d.fulfill(thiz.changeDropdown(locator, optionLocator));
      }
    }
  });

  return d.promise;
};

SearchPage.prototype.togglePlayerRow = function(row) {
  var rowNum = row * 3 - 2;
  var locator = By.xpath(`.//div[@inject='players']/.//div[contains(@class,'scroll-wrap-x')]/table/tbody[@inject='rows']/tr[${rowNum}]/td[1]/div/i`);
  return this.click(locator);
};

SearchPage.prototype.addListToPlayer = function(row, listName) {
  var rowNum = (row*3)-1;
  var locator = By.xpath(`.//div[@inject='players']/.//div[contains(@class,'scroll-wrap-x')]/table/tbody[@inject='rows']/tr[${rowNum}]/td/div[@inject='tags']/.//input[2]`);
  var selectionLocator = By.xpath(`.//div[@inject='players']/.//div[contains(@class,'scroll-wrap-x')]/table/tbody[@inject='rows']/tr[${rowNum}]/td/div[@inject='tags']/.//div[contains(@class,'tt-menu')]/div/div[1]`)
  this.sendKeys(locator, listName);
  return this.click(selectionLocator)
};

SearchPage.prototype.getPlayerLists = function(row) {
  var rowNum = (row*3)-1;
  var locator = By.xpath(`.//div[@inject='players']/.//div[contains(@class,'scroll-wrap-x')]/table/tbody[@inject='rows']/tr[${rowNum}]/td/div[@inject='tags']/div[contains(@class, 'entities')]/span/span`);
  return this.getTextArray(locator);
};

SearchPage.prototype.removeListFromPlayer = function(row, listName) {
  var rowNum = (row*3)-1;
  var locator = By.xpath(`.//div[@inject='players']/.//div[contains(@class,'scroll-wrap-x')]/table/tbody[@inject='rows']/tr[${rowNum}]/td/div[@inject='tags']/div[contains(@class, 'entities')]/span[span[text()='${listName}']]/i`)
  return this.click(locator);
};

SearchPage.prototype.createBatchMeasurables = function(event) {
  var expanderLocator = By.xpath(".//div[contains(@class, 'batch-measurables')]/div/div/div/div/i");
  var eventLocator = By.xpath(`.//div[contains(@class, 'batch-measurables')]/.//div[@inject="batchCreate.event"]/div`);
  var optionLocator = By.xpath(`.//div[contains(@class, 'batch-measurables')]/.//div[@inject="batchCreate.event"]/ul/li[text()='${event}']`);
  var createBtn = By.xpath(".//div[contains(@class, 'batch-measurables')]/.//button");

  this.click(expanderLocator);
  this.changeDropdown(eventLocator, optionLocator);
  return this.click(createBtn);
};


SearchPage.prototype.changeMeasurableInputField = function(playerNum, row, col, value) {
  var locator = By.xpath(`.//div[contains(@class, 'scroll-wrap-x')]/table/tbody/tr[contains(@class, 'details')][${playerNum}]/.//div[@inject="measurables"]/.//tbody[@inject='rows']/tr[not(contains(@class,'hidden'))][${row}]/td[${col}]/div/div`)
  return this.changeInput(locator, value);
};

SearchPage.prototype.getMeasurableInputField = function(playerNum, row, col) {
  var locator = By.xpath(`.//div[contains(@class, 'scroll-wrap-x')]/table/tbody/tr[contains(@class, 'details')][${playerNum}]/.//div[@inject="measurables"]/.//tbody[@inject='rows']/tr[not(contains(@class,'hidden'))][${row}]/td[${col}]/div/div`)
  return this.getText(locator);
};

SearchPage.prototype.getMeasurablesCount = function(playerNum) {
  var locator = By.xpath(`.//div[contains(@class, 'scroll-wrap-x')]/table/tbody/tr[contains(@class, 'details')][${playerNum}]/.//div[@inject="measurables"]/.//tbody[@inject='rows']/tr[not(contains(@class,'hidden'))]`);
  return this.getElementCount(locator);
};


/****************************************************************************
** Filters
*****************************************************************************/
SearchPage.prototype.addPlayersFilter = function(name, filterNum) {
  var d = Promise.defer();
  filterNum = filterNum || 1;
  var optionLocator = By.xpath(`.//div[@inject='players']/.//div[@class='tt-dataset tt-dataset-availableFilters']/div[@class='tt-suggestion tt-selectable'][text()='${name}'][${filterNum}]`)
  this.click(PLAYERS_ADD_FILTER_INPUT);
  this.click(optionLocator, 1000).then(function() {
    d.fulfill(true);
  }, function() {
    this.click(PLAYERS_ADD_FILTER_INPUT);
    d.fulfill(this.click(optionLocator, 1000));
  }.bind(this))

  return d.promise;
};

/****************************************************************************
** Table Controls
*****************************************************************************/
SearchPage.prototype.changePlayersNumberOfRows = function(numRows) {
  var thiz = this;
  var d = Promise.defer();

  this.getInput(PLAYERS_TABLE_ROW_COUNT_INPUT).then(function(stat) {
    var digits = stat.toString().length;
    for (var i=0; i<digits; i++) {
      thiz.sendKeys(PLAYERS_TABLE_ROW_COUNT_INPUT, Key.BACK_SPACE);    
    }

    thiz.sendKeys(PLAYERS_TABLE_ROW_COUNT_INPUT, numRows);
    d.fulfill(thiz.sendKeys(PLAYERS_TABLE_ROW_COUNT_INPUT, Key.ENTER));
  })

  return d.promise;
};

SearchPage.prototype.getPlayersTableRowCount = function() {
  return this.getElementCount(PLAYERS_TABLE_ROWS);
};

SearchPage.prototype.togglePlayersColumn = function(colName, selected) {
  var d = Promise.defer();
  var thiz = this;
 
  this.click(PLAYERS_TOGGLE_COLUMNS_INPUT);

  if (selected) {
    var optionLocator = By.xpath(`.//div[@inject='players']/.//div[contains(@class, 'tt-dataset-availableColumns')]/div[@class='tt-suggestion tt-selectable'][text()=' ${colName}']`);
  } else {
    var optionLocator = By.xpath(`.//div[@inject='players']/.//div[contains(@class, 'tt-dataset-availableColumns')]/div[@class='highlight tt-suggestion tt-selectable'][text()=' ${colName}']`);
  }

  this.locate(optionLocator, 100).then(function() {
    d.fulfill(thiz.click(optionLocator));
  }, function(err) {
    d.fulfill(thiz.click(SEARCH_PLAYERS_TITLE));
  });

  return d.promise;
};

SearchPage.prototype.clickPlayersNextButton = function() {
  this.click(PLAYERS_NEXT_BUTTON);
  return this.waitForPageToLoad();
};

SearchPage.prototype.clickPlayersPreviousButton = function() {
  this.click(PLAYERS_PREVIOUS_BUTTON);
  return this.waitForPageToLoad();
};

/****************************************************************************
** Exports
*****************************************************************************/
SearchPage.prototype.clickPlayersExportButton = function() {
  this.click(PLAYERS_EXPORT_BUTTON);
  return this.driver.sleep(5000);
};

SearchPage.prototype.readAndDeletePlayersExportCSV = function() {
  return this.readAndDeleteCSV('../Downloads/export.csv');
};

/****************************************************************************
** Aggregate Helpers
*****************************************************************************/
SearchPage.prototype.changePlayersTableStatField = function(type, row, colName, value, placeholder) {
  switch (type) {
    case 'input':
      return this.changePlayersTableStatInput(row, colName, value, placeholder);
    case 'dropdown':
      return this.changePlayersTableStatDropdown(row, colName, value, placeholder);
  }
};

module.exports = SearchPage;