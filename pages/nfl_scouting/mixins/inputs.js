var By = require('selenium-webdriver').By;
var Promise = require('selenium-webdriver').promise;
var Until = require('selenium-webdriver').until;
var Key = require('selenium-webdriver').Key;

// SaveIcon
var SAVE_ICON = By.css('.status');
  
// CheckBoxes
var CHECKBOX_TRUE = 'check_box';
var CHECKBOX_FALSE = 'check_box_outline_blank';
var CHECKBOX_BOTH = '--';

var CHECKBOX_INT = {
  'check_box': 0,
  'check_box_outline_blank': 1,
  '--': 2
}
var CHECKBOX_SELECTION = {
  true: 0,
  false: 1,
  'both': 2
}

var CHECKBOX_CONVERSION = {
  'check_box': true,
  'check_box_outline_blank': false,
  '--': 'both'
}

// DatePicker
var DATEPICKER = By.css(".datepicker");
var DAYS_PICKER_SWITCH = By.css('.datepicker-days .picker-switch');
var MONTHS_PICKER_SWITCH = By.css('.datepicker-months .picker-switch');
var DATEPICKER_DAYS_TABLE = By.css(".datepicker .datepicker-days");
var DATEPICKER_MONTHS_TABLE = By.css(".datepicker .datepicker-months");

Inputs = {
  /****************************************************************************
  ** Functions
  *****************************************************************************/
  getInput: function(locator, secondaryLocator) {
    var thiz = this;
    var d = Promise.defer();
    
    this.waitForDisplayed(locator, 500).then(function() {      
      d.fulfill(thiz.getAttribute(locator, 'value'));  
    }, function(err) {
      d.fulfill(thiz.getAttribute(secondaryLocator, 'value'));  
    });

    return d.promise;
  },
  changeInput: function(locator, value, secondaryLocator) {
    var thiz = this;
    var d = Promise.defer();
    var foundLocator;

    this.waitForEnabled(locator, 500).then(function() {
      foundLocator = locator;
    }, function(err) {
      foundLocator = secondaryLocator;
    }).then(function() {
      thiz.clear(foundLocator); // 1st clear changes it to 0
      thiz.clear(foundLocator);
      thiz.sendKeys(foundLocator, value);
      thiz.sendKeys(foundLocator, Key.ENTER);
      return thiz.waitUntilStaleness(SAVE_ICON, 500);
    });

    return d.promise;
  },
  getDropdown: function(locator, secondaryLocator) {
    var thiz = this;
    var d = Promise.defer();
    
    this.waitForDisplayed(locator, 500).then(function() {      
      d.fulfill(thiz.getText(locator));
    }, function(err) {
      d.fulfill(thiz.getText(secondaryLocator));  
    });

    return d.promise;
  },
  changeDropdown: function(locator, optionLocator, secondaryLocator, secondaryOptionLocator) {
    var thiz = this;
    var d = Promise.defer();
    var foundLocator, foundOptionLocator;
    
    this.waitForEnabled(locator, 500).then(function() {      
      foundLocator = locator;
      foundOptionLocator = optionLocator;
    }, function(err) {
      foundLocator = secondaryLocator;
      foundOptionLocator = secondaryOptionLocator;
    }).then(function() {
      thiz.click(foundLocator);
      thiz.click(foundOptionLocator);
      d.fulfill(thiz.waitUntilStaleness(SAVE_ICON, 500));
    });

    return d.promise;
  },
  getCheckbox: function(locator) {
    var d = Promise.defer();

    this.getText(locator).then(function(text) {
      if (text == CHECKBOX_TRUE) {
        d.fulfill(true);
      } else {
        d.fulfill(false);
      }
    });

    return d.promise;
  },
  changeCheckbox: function(locator, selected) {
    var d = Promise.defer();
    var thiz = this;

    this.getText(locator).then(function(text) {
      if (text == CHECKBOX_TRUE && !selected || text == CHECKBOX_FALSE && selected) {
        thiz.click(locator);
        d.fulfill(thiz.waitUntilStaleness(SAVE_ICON, 500));
      }
    });
    
    return d.promise;
  },
  getTriCheckbox: function(locator) {
    var d = Promise.defer();

    this.getText(locator).then(function(text) {
      if (text == CHECKBOX_TRUE) {
        d.fulfill(true);
      } else if (text == CHECKBOX_BOTH) {
        d.fulfill('both');
      } else {
        d.fulfill(false);
      }
    });

    return d.promise;
  },
  // selected is true, false, or 'both'
  changeTriCheckbox: function(locator, selected) {
    var d = Promise.defer();
    var thiz = this;

    this.getText(locator).then(function(text) {
      var currentInt = CHECKBOX_INT[String(text)];
      var userInt = CHECKBOX_SELECTION[selected];
      var numClicks = (userInt - currentInt + 3) % 3;

      for(i=0; i<numClicks; i++) {
        thiz.click(locator);
      }
      d.fulfill(thiz.waitUntilStaleness(SAVE_ICON, 5000));
    });
    return d.promise;
  },
  getTextField: function(locator) {
    return this.getText(locator);
  },
  changeTextField: function(locator, text) {
    this.click(locator);
    this.clear(locator);
    this.sendKeys(locator, text);
    this.sendKeys(locator, Key.TAB);
    return this.waitUntilStaleness(SAVE_ICON, 500);
  },
  changeDatePicker: function(locator, year, month, day) {
    var d = Promise.defer();
    var thiz = this;

    this.click(locator)

    this.isDisplayed(DATEPICKER, 2000).then(function(displayed) {
      // sometimes doesn't pick up first click
      if (!displayed) {
        thiz.click(locator);
      }
    }).then(function() {
      thiz.isDisplayed(DATEPICKER_DAYS_TABLE, 500).then(function(displayed) {
        if (displayed) { 
          thiz.click(DAYS_PICKER_SWITCH); 
        };
      });
    }).then(function() {
      thiz.isDisplayed(DATEPICKER_MONTHS_TABLE, 500).then(function(displayed) {
        if (displayed) { 
          thiz.click(MONTHS_PICKER_SWITCH); 
        };
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
  },
  changeInputSuggestion: function(locator, value) {
    this.clear(locator); // 1st clear changes it to 0
    this.clear(locator);
    this.sendKeys(locator, value);
    this.click(By.xpath(`.//div[contains(@class,'tt-menu')]/.//div[contains(@class, 'tt-suggestion')]/strong[text()='${value}']`));
    return this.waitUntilStaleness(SAVE_ICON, 500);
  },
  clickAndSave: function(locator) {
    this.click(locator)
    return this.waitUntilStaleness(SAVE_ICON, 5000);
  },
  getCheckboxArray: function(locator) {
    var d = Promise.defer();
    var checkboxArray = []
    
    this.driver.findElements(locator).then(function(elements) {
      elements.forEach(function(el) {
        el.getText().then(function(text) {
          checkboxArray.push(CHECKBOX_CONVERSION[text])
        })
      })

      d.fulfill(checkboxArray);
    })

    return d.promise;
  }
}

module.exports = Inputs;