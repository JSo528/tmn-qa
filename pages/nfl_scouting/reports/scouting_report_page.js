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
var SUBMIT_BUTTON = By.xpath(".//button[contains(@class,'-state')]");
var SAVE_ICON = By.css('.status');
var OBSERVATIONS_TITLE = By.css('.-observations .title');
var GAME_REPORTS_SPACER = By.css('.-game-reports .bottom-spacer i');
var INCIDENT_REPORTS_SPACER = By.css('.-incidents .bottom-spacer i');

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
function ScoutingReportPage(driver) {
  BasePage.call(this, driver);
};

ScoutingReportPage.prototype = Object.create(BasePage.prototype);
ScoutingReportPage.prototype.constructor = ScoutingReportPage;


ScoutingReportPage.prototype.waitForPageToLoad = function() {
  return this.waitForEnabled(By.css('.scouting-report'));
};

ScoutingReportPage.prototype.clickSubmitButton = function() {
  return this.click(SUBMIT_BUTTON);
};

ScoutingReportPage.prototype.isSubmitButtonDisplayed = function() {
  return this.isDisplayed(SUBMIT_BUTTON);
};

/****************************************************************************
** Observations
*****************************************************************************/
ScoutingReportPage.prototype.getObservationsDropdown = function(field) {
  var locator = By.xpath(`.//div[contains(@class,'-observations')]/.//div[div/label[text()='${field}']]/.//div[contains(@class, 'dropdown-toggle')]`);
  return this.getText(locator);
};

ScoutingReportPage.prototype.changeObservationsDropdown = function(field, value) {
  var locator = By.xpath(`.//div[contains(@class,'-observations')]/.//div[div/label[text()='${field}']]/.//div[contains(@class,'dropdown-toggle')]`);
  var optionLocator = By.xpath(`.//div[contains(@class,'-observations')]/.//div[div/label[text()='${field}']]/.//ul/li[text()='${value}']`);

  this.click(locator);
  this.click(optionLocator);
  return this.waitUntilStaleness(SAVE_ICON, 500);
};

ScoutingReportPage.prototype.getObservationsInput = function(field) {
  var locator = By.xpath(`.//div[contains(@class,'-observations')]/.//div[div/label[text()='${field}']]/.//input`);
  return this.getAttribute(locator, 'value');
};

ScoutingReportPage.prototype.changeObservationsInput = function(field, value) {
  var locator = By.xpath(`.//div[contains(@class,'-observations')]/.//div[div/label[text()='${field}']]/.//input`);
  // this.click(locator);
  this.clear(locator); // 1st clear changes it to 0
  this.clear(locator);
  this.sendKeys(locator, value);
  this.sendKeys(locator, Key.ENTER);
  return this.waitUntilStaleness(SAVE_ICON, 500);
};



// frame, specialTeams, alignment
ScoutingReportPage.prototype.getObservationsText = function(field) {
  var locator = By.xpath(`.//div[contains(@class,'-observations')]/.//div[@inject='${field}']/div`);
  return this.getText(locator);
};

ScoutingReportPage.prototype.changeObservationsText = function(field, text) {
  var locator = By.xpath(`.//div[contains(@class,'-observations')]/.//div[@inject='${field}']/div`);
  this.clear(locator);
  this.sendKeys(locator, text);
  return this.click(OBSERVATIONS_TITLE);
};

/****************************************************************************
** Profile
*****************************************************************************/
ScoutingReportPage.prototype.getProfileInput = function(field) {
  var thiz = this;
  var d = Promise.defer();

  var locator = By.xpath(`.//div[contains(@class, 'scouting-report')]/div[1]/.//div[div/label[text()='${field}']]/.//input`);
  
  this.driver.wait(Until.elementLocated(locator),100).then(function() {
    d.fulfill(thiz.getAttribute(locator, 'value'));
  }, function(err) {
    locator = By.xpath(`.//div[contains(@class, 'scouting-report')]/div[1]/.//div[@inject='${field}']/.//input`);
    d.fulfill(thiz.getAttribute(locator, 'value'));
  });

  return d.promise;
};

ScoutingReportPage.prototype.changeProfileInput = function(field, value) {
  var thiz = this;
  var d = Promise.defer();

  var locator = By.xpath(`.//div[contains(@class, 'scouting-report')]/div[1]/.//div[div/label[text()='${field}']]/.//input`);
  
  this.driver.wait(Until.elementLocated(locator),100).then(function() {
    // found
  }, function(err) {
    locator = By.xpath(`.//div[contains(@class, 'scouting-report')]/div[1]/.//div[@inject='${field}']/.//input`);
  }).then(function() {
    thiz.clear(locator); // 1st clear changes it to 0
    thiz.clear(locator);
    thiz.sendKeys(locator, value);
    thiz.sendKeys(locator, Key.ENTER);
    d.fulfill(thiz.waitUntilStaleness(SAVE_ICON, 500));
  });

  return d.promise;
};

ScoutingReportPage.prototype.changeProfileDraftYear = function(year) {
  var locator = By.xpath(`.//div[contains(@class, 'scouting-report')]/div[1]/.//div[div/label[text()='Draft Year']]/.//input`);
  this.click(locator);
  this.click(locator);
  var yearLocator = By.xpath(`.//div[@class='datepicker']/div[@class='datepicker-years']/table/tbody/tr/td/span[text()='${year}']`)
  this.click(yearLocator);
  return this.waitUntilStaleness(SAVE_ICON, 500);
};

ScoutingReportPage.prototype.getProfileDropdown = function(field) {
  var thiz = this;
  var d = Promise.defer();

  var locator = By.xpath(`.//div[contains(@class, 'scouting-report')]/div[1]/.//div[div/label[text()='${field}']]/.//div[contains(@class,'dropdown')]`);
  this.driver.wait(Until.elementLocated(locator),100).then(function() {
    d.fulfill(thiz.getText(locator));
  }, function(err) {
    locator = By.xpath(`.//div[contains(@class, 'scouting-report')]/div[1]/.//div[@inject='${field}']/.//div[contains(@class,'dropdown')]`);
    d.fulfill(thiz.getText(locator));
  });

  return d.promise;  
};

ScoutingReportPage.prototype.changeProfileDropdown = function(field, value) {
  var thiz = this;
  var d = Promise.defer();

  var locator = By.xpath(`.//div[contains(@class, 'scouting-report')]/div[1]/.//div[div/label[text()='${field}']]/.//div[contains(@class,'dropdown-toggle')]`);
  var optionLocator;

  this.driver.wait(Until.elementLocated(locator),100).then(function() {
    optionLocator = By.xpath(`.//div[contains(@class, 'scouting-report')]/div[1]/.//div[div/label[text()='${field}']]/.//ul/li[text()='${value}']`);
  }, function(err) {
    locator = By.xpath(`.//div[contains(@class, 'scouting-report')]/div[1]/.//div[@inject='${field}']/.//div[contains(@class,'dropdown-toggle')]`);
    optionLocator = By.xpath(`.//div[contains(@class, 'scouting-report')]/div[1]/.//div[@inject='${field}']/.//ul/li[contains(text(),'${value}')]`);
  }).then(function() {
    thiz.click(locator);
    thiz.click(optionLocator);
    d.fulfill(thiz.waitUntilStaleness(SAVE_ICON, 500));
  })

  return d.promise;  
};

ScoutingReportPage.prototype.getProfileDate = function(field) {
  var locator = By.xpath(`.//div[contains(@class, 'scouting-report')]/div[1]/.//div[div/label[text()='${field}']]/.//input`)
  return this.getAttribute(locator, 'value');
};

ScoutingReportPage.prototype.changeProfileDate = function(field, date) {
  var d = Promise.defer();
  var thiz = this;
  var locator = By.xpath(`.//div[contains(@class, 'scouting-report')]/div[1]/.//div[div/label[text()='${field}']]/.//input`)
  this.click(locator);
  this.click(locator); // for some reason need to click twice
  this.waitForDisplayed(By.css('.datepicker')).then(function() {
    d.fulfill(thiz.changeDatePicker(date.year, date.month, date.day))
  })

  return d.promise; 
};

ScoutingReportPage.prototype.getProfileCheckbox = function(field) {
  var d = Promise.defer();

  var locator = By.xpath(`.//div[contains(@class, 'scouting-report')]/div[1]/.//div[div/label[text()='${field}']]/.//i`)
  this.getText(locator).then(function(text) {
    if (text == CHECKBOX_TRUE) {
      d.fulfill(true);
    } else {
      d.fulfill(false);
    }
  });

  return d.promise;
};

ScoutingReportPage.prototype.changeProfileCheckbox = function(field, selected) {
  var d = Promise.defer();
  var thiz = this;

  var locator = By.xpath(`.//div[contains(@class, 'scouting-report')]/div[1]/.//div[div/label[text()='${field}']]/.//i`)

  this.getText(locator).then(function(text) {
    if (text == CHECKBOX_TRUE && !selected || text == CHECKBOX_FALSE && selected) {
      thiz.click(locator);
      d.fulfill(thiz.waitUntilStaleness(SAVE_ICON, 5000));
    }
  });
  
  return d.promise;
};

/****************************************************************************
** Notes
*****************************************************************************/
ScoutingReportPage.prototype.clickGameReportsSpacer = function() {
  var d = Promise.defer();
  var thiz = this;

  this.click(GAME_REPORTS_SPACER, 1000).then(function() {
    d.fulfill(true);
  }, function(err) {
    d.fulfill(thiz.click(GAME_REPORTS_SPACER, 1000));
  });

  return d.promise;
};

ScoutingReportPage.prototype.getNotesGrade = function(section) {
  var locator = By.xpath(`.//div[@class='well']/.//div[div/div[text()=' ${section} ']]/.//input`);
  return this.getAttribute(locator, 'value');
};

ScoutingReportPage.prototype.changeNotesGrade = function(section, grade) {
  var locator = By.xpath(`.//div[@class='well']/.//div[div/div[text()=' ${section} ']]/.//input`);
  this.click(locator);
  this.sendKeys(locator, Key.BACK_SPACE);
  this.sendKeys(locator, grade);
  this.sendKeys(locator, Key.ENTER);
  return this.waitUntilStaleness(SAVE_ICON, 5000);
};

ScoutingReportPage.prototype.getNotesText = function(section) {
  var locator = By.xpath(`.//div[@class='well'][div/div/div[text()=' ${section} ']]/.//div[contains(@class, '-editor')]`);
  return this.getText(locator);
};

ScoutingReportPage.prototype.changeNotesText = function(section, text) {
  var labelLocator = By.xpath(`.//div[@class='well'][div/div/div[text()=' ${section} ']]`);
  var locator = By.xpath(`.//div[@class='well'][div/div/div[text()=' ${section} ']]/.//div[contains(@class, '-editor')]`);
  this.click(locator);
  this.clear(locator);
  this.sendKeys(locator, text);
  this.clickOffset(labelLocator, 0, 0);
  return this.waitUntilStaleness(SAVE_ICON, 5000);
};

ScoutingReportPage.prototype.getNotesHelpJagsCheckbox = function() {
  var d = Promise.defer();

  var locator = By.xpath(`.//div[@class='well']/.//div[div/div[text()=' Help Jags ']]/.//i`);
  this.getText(locator).then(function(text) {
    if (text == CHECKBOX_TRUE) {
      d.fulfill(true);
    } else {
      d.fulfill(false);
    }
  });

  return d.promise;
};

ScoutingReportPage.prototype.changeNotesHelpJagsCheckbox = function(selected) {
  var d = Promise.defer();
  var thiz = this;

  var locator = By.xpath(`.//div[@class='well']/.//div[div/div[text()=' Help Jags ']]/.//i`);

  this.getText(locator).then(function(text) {
    if (text == CHECKBOX_TRUE && !selected || text == CHECKBOX_FALSE && selected) {
      thiz.click(locator);
      d.fulfill(thiz.waitUntilStaleness(SAVE_ICON, 5000));
    }
  });
  
  return d.promise;
};

/****************************************************************************
** Character/Injury
*****************************************************************************/
ScoutingReportPage.prototype.getCharacterCheckbox = function(field) {
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

ScoutingReportPage.prototype.changeCharacterCheckbox = function(field, selected) {
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
** Metrics
*****************************************************************************/
ScoutingReportPage.prototype.getMetricsInput = function(field) {
  var locator = By.xpath(`.//div[contains(@class,'scouting-report')]/div[3]/.//div[div/div[text()='${field}']]/.//input`);
  return this.getAttribute(locator, 'value');
};

ScoutingReportPage.prototype.changeMetricsInput = function(field, value) {
  var locator = By.xpath(`.//div[contains(@class,'scouting-report')]/div[3]/.//div[div/div[text()='${field}']]/.//input`);
  this.clear(locator); // 1st clear changes it to 0
  this.clear(locator);
  this.sendKeys(locator, value);
  this.sendKeys(locator, Key.ENTER);
  return this.waitUntilStaleness(SAVE_ICON, 500);
};


ScoutingReportPage.prototype.getMetricsSectionAverage = function(section) {
  var d = Promise.defer();

  var locator = By.xpath(`.//div[contains(@class,'scouting-report')]/div[3]/.//div[div[text()=' ${section} ']]/div[2]`);
  this.getText(locator).then(function(text) {
    d.fulfill(text.replace(/AVG\:/, '').trim());
  });

  return d.promise;
};

// Groups -> Top Starter: topStarterSkills, Starter: starterSkills, Backup: backupSkills
ScoutingReportPage.prototype.getGradeGroupSkills = function(group) {
  var locator = By.xpath(`.//div[@inject='${group}']/div[@class='row'][2]/div`);
  return this.getTextArray(locator);
};

/****************************************************************************
** Incident Reports
*****************************************************************************/
ScoutingReportPage.prototype.clickIncidentReportsSpacer = function() {
  var d = Promise.defer();
  var thiz = this;

  this.click(INCIDENT_REPORTS_SPACER, 1000).then(function() {
    d.fulfill(true);
  }, function(err) {
    d.fulfill(thiz.click(INCIDENT_REPORTS_SPACER, 1000));
  });

  return d.promise;
};


/****************************************************************************
** Helpers
*****************************************************************************/
ScoutingReportPage.prototype.changeDatePicker = function(year, month, day) {
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

module.exports = ScoutingReportPage;