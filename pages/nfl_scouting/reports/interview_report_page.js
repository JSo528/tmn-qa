'use strict';

// Load Base Page
var BasePage = require('../../../pages/base/base_page.js')

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;
var Key = require('selenium-webdriver').Key

/****************************************************************************
** Locators
*****************************************************************************/
// var SUBMIT_BUTTON = By.xpath(".//button[contains(@class,'-state')]");
var SAVE_ICON = By.css('.status');
// var OBSERVATIONS_TITLE = By.css('.-observations .title');
// var GAME_REPORTS_SPACER = By.css('.-game-reports .bottom-spacer i');
// var INCIDENT_REPORTS_SPACER = By.css('.-incidents .bottom-spacer i');

// DatePicker
var DAYS_PICKER_SWITCH = By.css('.datepicker-days .picker-switch');
var MONTHS_PICKER_SWITCH = By.css('.datepicker-months .picker-switch');
var DATEPICKER_DAYS_TABLE = By.css(".datepicker .datepicker-days");
var DATEPICKER_MONTHS_TABLE = By.css(".datepicker .datepicker-months");

// Checkbox
var CHECKBOX_TRUE = 'check_box';
var CHECKBOX_FALSE = 'check_box_outline_blank';

/****************************************************************************
** Constructor
*****************************************************************************/
function InterviewReportPage(driver) {
  BasePage.call(this, driver);
};

InterviewReportPage.prototype = Object.create(BasePage.prototype);
InterviewReportPage.prototype.constructor = InterviewReportPage;


InterviewReportPage.prototype.waitForPageToLoad = function() {
  return this.waitForEnabled(By.css('.interview-report'));
};

/****************************************************************************
** Profile
*****************************************************************************/
InterviewReportPage.prototype.getProfileInput = function(field) {
  var thiz = this;
  var d = Promise.defer();

  var locator = By.xpath(`.//div[contains(@class, 'interview-report')]/div[1]/.//div[div/label[text()='${field}']]/.//input`);
  
  this.driver.wait(Until.elementLocated(locator),100).then(function() {
    d.fulfill(thiz.getAttribute(locator, 'value'));
  }, function(err) {
    locator = By.xpath(`.//div[contains(@class, 'interview-report')]/div[1]/.//div[@inject='${field}']/.//input`);
    d.fulfill(thiz.getAttribute(locator, 'value'));
  });

  return d.promise;
};

InterviewReportPage.prototype.changeProfileInput = function(field, value) {
  var thiz = this;
  var d = Promise.defer();

  var locator = By.xpath(`.//div[contains(@class, 'interview-report')]/div[1]/.//div[div/label[text()='${field}']]/.//input`);
  
  this.driver.wait(Until.elementLocated(locator),100).then(function() {
    // found
  }, function(err) {
    locator = By.xpath(`.//div[contains(@class, 'interview-report')]/div[1]/.//div[@inject='${field}']/.//input`);
  }).then(function() {
    thiz.clear(locator); // 1st clear changes it to 0
    thiz.clear(locator);
    thiz.sendKeys(locator, value);
    thiz.sendKeys(locator, Key.ENTER);
    d.fulfill(thiz.waitUntilStaleness(SAVE_ICON, 500));
  });

  return d.promise;
};

InterviewReportPage.prototype.getProfileDropdown = function(field) {
  var thiz = this;
  var d = Promise.defer();

  var locator = By.xpath(`.//div[contains(@class, 'interview-report')]/div[1]/.//div[div/label[text()='${field}']]/.//div[contains(@class,'dropdown')]`);
  this.driver.wait(Until.elementLocated(locator),100).then(function() {
    d.fulfill(thiz.getText(locator));
  }, function(err) {
    locator = By.xpath(`.//div[contains(@class, 'interview-report')]/div[1]/.//div[@inject='${field}']/.//div[contains(@class,'dropdown')]`);
    d.fulfill(thiz.getText(locator));
  });

  return d.promise;  
};

InterviewReportPage.prototype.changeProfileDropdown = function(field, value) {
  var thiz = this;
  var d = Promise.defer();

  var locator = By.xpath(`.//div[contains(@class, 'interview-report')]/div[1]/.//div[div/label[text()='${field}']]/.//div[contains(@class,'dropdown-toggle')]`);
  var optionLocator;

  this.driver.wait(Until.elementLocated(locator),100).then(function() {
    optionLocator = By.xpath(`.//div[contains(@class, 'interview-report')]/div[1]/.//div[div/label[text()='${field}']]/.//ul/li[text()='${value}']`);
  }, function(err) {
    locator = By.xpath(`.//div[contains(@class, 'interview-report')]/div[1]/.//div[@inject='${field}']/.//div[contains(@class,'dropdown-toggle')]`);
    optionLocator = By.xpath(`.//div[contains(@class, 'interview-report')]/div[1]/.//div[@inject='${field}']/.//ul/li[contains(text(),'${value}')]`);
  }).then(function() {
    thiz.click(locator);
    thiz.click(optionLocator);
    d.fulfill(thiz.waitUntilStaleness(SAVE_ICON, 500));
  })

  return d.promise;  
};

InterviewReportPage.prototype.getProfileDate = function(field) {
  var locator = By.xpath(`.//div[contains(@class, 'interview-report')]/div[1]/.//div[div/label[text()='${field}']]/.//input`)
  return this.getAttribute(locator, 'value');
};

InterviewReportPage.prototype.changeProfileDate = function(field, date) {
  var d = Promise.defer();
  var thiz = this;
  var locator = By.xpath(`.//div[contains(@class, 'interview-report')]/div[1]/.//div[div/label[text()='${field}']]/.//input`)
  this.click(locator);
  this.click(locator); // for some reason need to click twice
  this.waitForDisplayed(By.css('.datepicker')).then(function() {
    d.fulfill(thiz.changeDatePicker(date.year, date.month, date.day))
  })

  return d.promise; 
};

// /****************************************************************************
// ** Section Fields
// *****************************************************************************/
InterviewReportPage.prototype.getSectionText = function(section) {
  var locator = By.xpath(`.//div[@class='well'][div/div/div[text()=' ${section} ']]/.//div[contains(@class, '-editor')]`);
  return this.getText(locator);
};

InterviewReportPage.prototype.changeSectionText = function(section, text) {
  var labelLocator = By.xpath(`.//div[@class='well'][div/div/div[text()=' ${section} ']]`);
  var locator = By.xpath(`.//div[@class='well'][div/div/div[text()=' ${section} ']]/.//div[contains(@class, '-editor')]`);
  this.click(locator);
  this.clear(locator);
  this.sendKeys(locator, text);
  this.clickOffset(labelLocator, 0, 0);
  return this.waitUntilStaleness(SAVE_ICON, 5000);
};

InterviewReportPage.prototype.getLearnSystemCheckbox = function() {
  var d = Promise.defer();

  var locator = By.xpath(`.//div[@class='well']/.//div[div/div[text()=' Can Player Learn Team System? ']]/.//i`);
  this.getText(locator).then(function(text) {
    if (text == CHECKBOX_TRUE) {
      d.fulfill(true);
    } else {
      d.fulfill(false);
    }
  });

  return d.promise;
};

InterviewReportPage.prototype.changeLearnSystemCheckbox = function(selected) {
  var d = Promise.defer();
  var thiz = this;

  var locator = By.xpath(`.//div[@class='well']/.//div[div/div[text()=' Can Player Learn Team System? ']]/.//i`);

  this.getText(locator).then(function(text) {
    if (text == CHECKBOX_TRUE && !selected || text == CHECKBOX_FALSE && selected) {
      thiz.click(locator);
      d.fulfill(thiz.waitUntilStaleness(SAVE_ICON, 5000));
    }
  });
  
  return d.promise;
};

InterviewReportPage.prototype.getPersonalStatusCheckbox = function(field) {
  var d = Promise.defer();

  var locator = By.xpath(`.//div[div/div/div[text()=' Personal Status ']]/.//div[div/label[text()='${field}']]/.//i`);
  this.getText(locator).then(function(text) {
    if (text == CHECKBOX_TRUE) {
      d.fulfill(true);
    } else {
      d.fulfill(false);
    }
  });

  return d.promise;
};

InterviewReportPage.prototype.changePersonalStatusCheckbox = function(field, selected) {
  var d = Promise.defer();
  var thiz = this;

  var locator = By.xpath(`.//div[div/div/div[text()=' Personal Status ']]/.//div[div/label[text()='${field}']]/.//i`);

  this.getText(locator).then(function(text) {
    if (text == CHECKBOX_TRUE && !selected || text == CHECKBOX_FALSE && selected) {
      thiz.click(locator);
      d.fulfill(thiz.waitUntilStaleness(SAVE_ICON, 5000));
    }
  });
  
  return d.promise;
};

InterviewReportPage.prototype.getNumChildrenInput = function() {
  var locator = By.xpath(`.//div[div/div/div[text()=' Personal Status ']]/.//div[@inject='player.childCount']/input`);
  return this.getAttribute(locator, 'value');
};

InterviewReportPage.prototype.changeNumChildrenInput = function(value) {
  var locator = By.xpath(`.//div[div/div/div[text()=' Personal Status ']]/.//div[@inject='player.childCount']/input`);
  this.clear(locator); // 1st clear changes it to 0
  this.clear(locator);
  this.sendKeys(locator, value);
  this.sendKeys(locator, Key.ENTER);
  return this.waitUntilStaleness(SAVE_ICON, 500);
};


/****************************************************************************
** Character/Injury
*****************************************************************************/
InterviewReportPage.prototype.getCharacterCheckbox = function(field) {
  var d = Promise.defer();

  var locator = By.xpath(`.//div[div[@inject='makeup']]/.//div[div/label[text()='${field}']]/.//i`);
  this.getText(locator).then(function(text) {
    if (text == CHECKBOX_TRUE) {
      d.fulfill(true);
    } else {
      d.fulfill(false);
    }
  });

  return d.promise;
};

InterviewReportPage.prototype.changeCharacterCheckbox = function(field, selected) {
  var d = Promise.defer();
  var thiz = this;

  var locator = By.xpath(`.//div[div[@inject='makeup']]/.//div[div/label[text()='${field}']]/.//i`);

  this.getText(locator).then(function(text) {
    if (text == CHECKBOX_TRUE && !selected || text == CHECKBOX_FALSE && selected) {
      thiz.click(locator);
      d.fulfill(thiz.waitUntilStaleness(SAVE_ICON, 5000));
    }
  });
  
  return d.promise;  
};

/****************************************************************************
** Intelligence
*****************************************************************************/
InterviewReportPage.prototype.getIntelligenceCheckbox = function(field) {
  var d = Promise.defer();

  var locator = By.xpath(`.//div[div[@inject='intelligence']]/.//div[div/label[text()='${field}']]/.//i`);
  this.getText(locator).then(function(text) {
    if (text == CHECKBOX_TRUE) {
      d.fulfill(true);
    } else {
      d.fulfill(false);
    }
  });

  return d.promise;
};

InterviewReportPage.prototype.changeIntelligenceCheckbox = function(field, selected) {
  var d = Promise.defer();
  var thiz = this;

  var locator = By.xpath(`.//div[div[@inject='intelligence']]/.//div[div/label[text()='${field}']]/.//i`);

  this.getText(locator).then(function(text) {
    if (text == CHECKBOX_TRUE && !selected || text == CHECKBOX_FALSE && selected) {
      thiz.click(locator);
      d.fulfill(thiz.waitUntilStaleness(SAVE_ICON, 5000));
    }
  });
  
  return d.promise;  
};

/****************************************************************************
** Presentation
*****************************************************************************/
InterviewReportPage.prototype.getPresentationCheckbox = function(field) {
  var d = Promise.defer();

  var locator = By.xpath(`.//div[div[@inject='presentation']]/.//div[div/label[text()='${field}']]/.//i`);
  this.getText(locator).then(function(text) {
    if (text == CHECKBOX_TRUE) {
      d.fulfill(true);
    } else {
      d.fulfill(false);
    }
  });

  return d.promise;
};

InterviewReportPage.prototype.changePresentationCheckbox = function(field, selected) {
  var d = Promise.defer();
  var thiz = this;

  var locator = By.xpath(`.//div[div[@inject='presentation']]/.//div[div/label[text()='${field}']]/.//i`);

  this.getText(locator).then(function(text) {
    if (text == CHECKBOX_TRUE && !selected || text == CHECKBOX_FALSE && selected) {
      thiz.click(locator);
      d.fulfill(thiz.waitUntilStaleness(SAVE_ICON, 5000));
    }
  });
  
  return d.promise;  
};

// /****************************************************************************
// ** Metrics
// *****************************************************************************/
// InterviewReportPage.prototype.getMetricsInput = function(field) {
//   var locator = By.xpath(`.//div[contains(@class,'interview-report')]/div[3]/.//div[div/div[text()='${field}']]/.//input`);
//   return this.getAttribute(locator, 'value');
// };

// InterviewReportPage.prototype.changeMetricsInput = function(field, value) {
//   var locator = By.xpath(`.//div[contains(@class,'interview-report')]/div[3]/.//div[div/div[text()='${field}']]/.//input`);
//   this.clear(locator); // 1st clear changes it to 0
//   this.clear(locator);
//   this.sendKeys(locator, value);
//   this.sendKeys(locator, Key.ENTER);
//   return this.waitUntilStaleness(SAVE_ICON, 500);
// };


// InterviewReportPage.prototype.getMetricsSectionAverage = function(section) {
//   var d = Promise.defer();

//   var locator = By.xpath(`.//div[contains(@class,'interview-report')]/div[3]/.//div[div[text()=' ${section} ']]/div[2]`);
//   this.getText(locator).then(function(text) {
//     d.fulfill(text.replace(/AVG\:/, '').trim());
//   });

//   return d.promise;
// };

// // Groups -> Top Starter: topStarterSkills, Starter: starterSkills, Backup: backupSkills
// InterviewReportPage.prototype.getGradeGroupSkills = function(group) {
//   var locator = By.xpath(`.//div[@inject='${group}']/div[@class='row'][2]/div`);
//   return this.getTextArray(locator);
// };

// /****************************************************************************
// ** Helpers
// *****************************************************************************/
InterviewReportPage.prototype.changeDatePicker = function(year, month, day) {
  var d = Promise.defer();
  var thiz = this;
  this.isDisplayed(DATEPICKER_DAYS_TABLE, 500).then(function(displayed) {
    if (displayed) { thiz.click(DAYS_PICKER_SWITCH); };
  }).then(function() {
    thiz.isDisplayed(DATEPICKER_MONTHS_TABLE, 500).then(function(displayed) {
      if (displayed) { thiz.click(MONTHS_PICKER_SWITCH); };
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
};

module.exports = InterviewReportPage;