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
  'Select value': 2
}
var CHECKBOX_SELECTION = {
  true: 0,
  false: 1,
  'both': 2
}

var CHECKBOX_CONVERSION = {
  'check_box': true,
  'check_box_outline_blank': false,
  'Select value': 'both'
}

// DatePicker
var DATEPICKER = By.css(".datepicker");
var DAYS_PICKER_SWITCH = By.css('.datepicker-days .picker-switch');
var MONTHS_PICKER_SWITCH = By.css('.datepicker-months .picker-switch');
var DATEPICKER_DAYS_TABLE = By.css(".datepicker .datepicker-days");
var DATEPICKER_MONTHS_TABLE = By.css(".datepicker .datepicker-months");

var MONTH_ABBR = {
  "01": 'Jan',
  "02": 'Feb',
  "03": 'Mar',
  "04": 'Apr',
  "05": 'May',
  "06": 'Jun',
  "07": 'Jul',
  "08": 'Aug',
  "09": 'Sep',
  "10": 'Oct',
  "11": 'Nov',
  "12": 'Dec'
}

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
      if (secondaryLocator) {
        d.fulfill(thiz.getAttribute(secondaryLocator, 'value'));    
      } else {
        d.fulfill(thiz.getAttribute(locator, 'value'));  
      } 
      
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
      foundLocator = secondaryLocator ? secondaryLocator : locator;
    }).then(function() {
      thiz.clear(foundLocator); // 1st clear changes it to 0
      thiz.clear(foundLocator);
      thiz.sendKeys(foundLocator, value);
      thiz.sendKeys(foundLocator, Key.TAB);
      thiz.sendKeys(foundLocator, Key.ESCAPE);
      return thiz.waitUntilStaleness(SAVE_ICON, 500);
    });

    return d.promise;
  },
  getDropdown: function(primaryLocator, secondaryLocator, placeholder) {
    var thiz = this;
    var d = Promise.defer();
    
    this.waitForDisplayed(primaryLocator, 500).then(function() {      
      return primaryLocator;
    }, function(err) {
      return (secondaryLocator) ? secondaryLocator : primaryLocator;
    }).then(function(locator) {
      thiz.getText(locator).then(function(value) {
        d.fulfill(value == placeholder ? '' : value);
      });  
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
      foundLocator = secondaryLocator ? secondaryLocator : locator;
      foundOptionLocator = secondaryOptionLocator ? secondaryOptionLocator : optionLocator;
    }).then(function() {
      thiz.click(foundLocator);

      thiz.waitForEnabled(foundOptionLocator, 500).then(function() {      
        thiz.click(foundOptionLocator);
      }, function() {
        thiz.click(foundLocator);
      });

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
  getColorCheckbox: function(locator, selectedColor) {
    var d = Promise.defer();

    this.getCssValue(locator, 'backgroundColor').then(function(color) {
      
      console.log("** color " + color)
      console.log(selectedColor)

      if (color == selectedColor) {
        d.fulfill(true);
      } else {
        d.fulfill(false);
      }
    });

    return d.promise;
  },
  changeColorCheckbox: function(locator, selected, selectedColor) {
    var d = Promise.defer();
    var thiz = this;

    this.getColorCheckbox(locator, selectedColor).then(function(wasSelected) {
      console.log("** wasSelected " + wasSelected)
      console.log(selected)
      
      if (wasSelected && !selected || !wasSelected && selected) {
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
  changeDatePickerFromString: function(locator, dateString) {
    var day = parseInt(dateString.split("/")[1]).toString();
    var month = MONTH_ABBR[dateString.split("/")[0]];
    var year = dateString.split("/")[2];
    this.changeDatePicker(locator, year, month, day);
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
      if (year) {
        var yearLocator = By.xpath(`.//div[@class='datepicker-years']/table/tbody/tr/td/span[text()='${year}']`);
        thiz.click(yearLocator, 500);
      }
      
      if (month) {
        var monthLocator = By.xpath(`.//div[@class='datepicker-months']/table/tbody/tr/td/span[text()='${month}']`);
        thiz.click(monthLocator, 500);  
      }
      
      if (day) {
        var dayLocator  = By.xpath(`.//div[@class='datepicker-days']/table/tbody/tr/td[not(contains(@class,'old'))][text()='${day}']`);
        thiz.click(dayLocator, 500);
      }
    }).then(function() {
      d.fulfill(true);
    });  

    return d.promise;
  },
  changeInputSuggestion: function(locator, value) {
    var d = Promise.defer();
    var thiz = this;

    this.clear(locator); // 1st clear changes it to 0
    this.clear(locator);
    this.sendKeys(locator, value);
    var suggestionLocator = By.xpath(`.//div[contains(@class,'tt-menu')]/.//div[contains(@class, 'tt-suggestion')]/strong[text()='${value}']`);
    this.isDisplayed(suggestionLocator, 1000).then(function(displayed) {
      if (displayed) {
        thiz.click(suggestionLocator);
      } else {
        thiz.sendKeys(locator, Key.ENTER);
      }
    }).then(function() {
      d.fulfill(thiz.waitUntilStaleness(SAVE_ICON, 500));
    })
    
    return d.promise;
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