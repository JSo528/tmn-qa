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
var BODY_CONTENT = By.css('.draft-management');
var SAVE_ICON = By.css('.status');

var CHECKBOX_TRUE = 'check_box';
var CHECKBOX_FALSE = 'check_box_outline_blank';

// var NAME_LINK = By.xpath(".//div[contains(@class,'title')]/div/a");
// var MANAGE_DRAFT_LINK = By.xpath(".//div[@inject='player.draftLink']/a");

// // IncidentReport
// var INCIDENT_REPORT_SPACER = By.css('.-incidents .-show');
// var CREATE_INCIDENT_REPORT_BTN = By.css('.-incidents .-create');
// var INCIDENT_REPORT_WEEK_INPUT = By.xpath(".//div[@class='incident']/div/div/.//div[@inject='week']/div");
// var INCIDENT_REPORT_DATE_INPUT = By.xpath(".//div[@class='incident']/div/div/.//div[@inject='date']/input");
// var INCIDENT_REPORT_TYPE_INPUT = By.xpath(".//div[@class='incident']/div/div/.//div[@inject='type']/div");
// var INCIDENT_REPORT_COMMENT_INPUT = By.xpath(".//div[@class='incident']/div/div/.//div[@inject='comment']/div");
// var INCIDENT_DIVS = By.css('.incidents .incident');

// // Reports
// var CREATE_EVALUATION_REPORT_BTN = By.xpath(".//div[@inject='evaluationReports']/.//button[text()=' Create ']");
// var CREATE_SCOUTING_REPORT_BTN = By.xpath(".//div[@inject='scoutingReports']/.//button[text()=' Create ']");
// var CREATE_INTERVIEW_REPORT_BTN = By.xpath(".//div[@inject='interviewReports']/.//button[text()=' Create ']");

// // DatePicker
// var DAYS_PICKER_SWITCH = By.css('.datepicker-days .picker-switch');
// var MONTHS_PICKER_SWITCH = By.css('.datepicker-months .picker-switch');
// var DATEPICKER_DAYS_TABLE = By.css(".datepicker .datepicker-days");
// var DATEPICKER_MONTHS_TABLE = By.css(".datepicker .datepicker-months");

/****************************************************************************
** Constructor
*****************************************************************************/
function ManageDraftPage(driver) {
  BasePage.call(this, driver);
};

ManageDraftPage.prototype = Object.create(BasePage.prototype);
ManageDraftPage.prototype.constructor = ManageDraftPage;

/****************************************************************************
** Functions
*****************************************************************************/
ManageDraftPage.prototype.waitForPageToLoad = function() {
  return this.waitForEnabled(BODY_CONTENT, 10000);
};

/****************************************************************************
** Profile
*****************************************************************************/
ManageDraftPage.prototype.getProfileInput = function(field) {
//   var thiz = this;
//   var d = Promise.defer();

//   var locator = By.xpath(`.//div[contains(@class, 'interview-report')]/div[1]/.//div[div/label[text()='${field}']]/.//input`);
  
//   this.driver.wait(Until.elementLocated(locator),100).then(function() {
//     d.fulfill(thiz.getAttribute(locator, 'value'));
//   }, function(err) {
//     locator = By.xpath(`.//div[contains(@class, 'interview-report')]/div[1]/.//div[@inject='${field}']/.//input`);
//     d.fulfill(thiz.getAttribute(locator, 'value'));
//   });

//   return d.promise;
};

ManageDraftPage.prototype.changeProfileInput = function(field, value) {
//   var thiz = this;
//   var d = Promise.defer();

//   var locator = By.xpath(`.//div[contains(@class, 'interview-report')]/div[1]/.//div[div/label[text()='${field}']]/.//input`);
  
//   this.driver.wait(Until.elementLocated(locator),100).then(function() {
//     // found
//   }, function(err) {
//     locator = By.xpath(`.//div[contains(@class, 'interview-report')]/div[1]/.//div[@inject='${field}']/.//input`);
//   }).then(function() {
//     thiz.clear(locator); // 1st clear changes it to 0
//     thiz.clear(locator);
//     thiz.sendKeys(locator, value);
//     thiz.sendKeys(locator, Key.ENTER);
//     d.fulfill(thiz.waitUntilStaleness(SAVE_ICON, 500));
//   });

//   return d.promise;
};

ManageDraftPage.prototype.getProfileDropdown = function(field) {
  var locator = By.xpath(`.//div[contains(@class, 'draft-management')]/.//div[div/label[text()='${field}']]/.//div[contains(@class,'dropdown-toggle')]`);
  return this.getText(locator);
};

ManageDraftPage.prototype.changeProfileDropdown = function(field, value) {
  var d = Promise.defer();
  var thiz = this;

  var locator = By.xpath(`.//div[contains(@class, 'draft-management')]/.//div[div/label[text()='${field}']]/.//div[contains(@class,'dropdown-toggle')]`);
  this.click(locator);
  if (value) {
    var optionLocator = By.xpath(`.//div[contains(@class, 'draft-management')]/.//div[div/label[text()='${field}']]/.//ul/li[text()='${value}']`);
  } else {
    // if user chooses a value of "", null, etc., function should deselect the currently selected option
    var optionLocator = By.xpath(`.//div[contains(@class, 'draft-management')]/.//div[div/label[text()='${field}']]/.//ul/li[contains(@class, 'selected')]`);
  }

  this.locate(optionLocator, 500).then(function() {
    thiz.click(optionLocator);
    d.fulfill(thiz.waitUntilStaleness(SAVE_ICON, 500));
  }, function(err) {
    // should only happen if optionLocator doesn't exist because no option was selected
    d.fulfill(thiz.click(locator));
  })

  return d.promise;
};

ManageDraftPage.prototype.getProfileCheckbox = function(field) {
  var d = Promise.defer();

  var locator = By.xpath(`.//div[contains(@class, 'draft-management')]/.//div[div/label[text()='${field}']]/.//i`);
  this.getText(locator).then(function(text) {
    if (text == CHECKBOX_TRUE) {
      d.fulfill(true);
    } else {
      d.fulfill(false);
    }
  });

  return d.promise;
};

ManageDraftPage.prototype.changeProfileCheckbox = function(field, selected) {
  var d = Promise.defer();
  var thiz = this;

    var locator = By.xpath(`.//div[contains(@class, 'draft-management')]/.//div[div/label[text()='${field}']]/.//i`);

  this.getText(locator).then(function(text) {
    if (text == CHECKBOX_TRUE && !selected || text == CHECKBOX_FALSE && selected) {
      thiz.click(locator);
      d.fulfill(thiz.waitUntilStaleness(SAVE_ICON, 5000));
    }
  });
  
  return d.promise;
};

// // /****************************************************************************
// // ** Section Fields
// // *****************************************************************************/
// ManageDraftPage.prototype.getSectionText = function(section) {
//   var locator = By.xpath(`.//div[@class='well'][div/div/div[text()=' ${section} ']]/.//div[contains(@class, '-editor')]`);
//   return this.getText(locator);
// };

// ManageDraftPage.prototype.changeSectionText = function(section, text) {
//   var labelLocator = By.xpath(`.//div[@class='well'][div/div/div[text()=' ${section} ']]`);
//   var locator = By.xpath(`.//div[@class='well'][div/div/div[text()=' ${section} ']]/.//div[contains(@class, '-editor')]`);
//   this.click(locator);
//   this.clear(locator);
//   this.sendKeys(locator, text);
//   this.clickOffset(labelLocator, 0, 0);
//   return this.waitUntilStaleness(SAVE_ICON, 5000);
// };

// ManageDraftPage.prototype.getLearnSystemCheckbox = function() {
//   var d = Promise.defer();

//   var locator = By.xpath(`.//div[@class='well']/.//div[div/div[text()=' Can Player Learn Team System? ']]/.//i`);
//   this.getText(locator).then(function(text) {
//     if (text == CHECKBOX_TRUE) {
//       d.fulfill(true);
//     } else {
//       d.fulfill(false);
//     }
//   });

//   return d.promise;
// };

// ManageDraftPage.prototype.changeLearnSystemCheckbox = function(selected) {
//   var d = Promise.defer();
//   var thiz = this;

//   var locator = By.xpath(`.//div[@class='well']/.//div[div/div[text()=' Can Player Learn Team System? ']]/.//i`);

//   this.getText(locator).then(function(text) {
//     if (text == CHECKBOX_TRUE && !selected || text == CHECKBOX_FALSE && selected) {
//       thiz.click(locator);
//       d.fulfill(thiz.waitUntilStaleness(SAVE_ICON, 5000));
//     }
//   });
  
//   return d.promise;
// };

// ManageDraftPage.prototype.getPersonalStatusCheckbox = function(field) {
//   var d = Promise.defer();

//   var locator = By.xpath(`.//div[div/div/div[text()=' Personal Status ']]/.//div[div/label[text()='${field}']]/.//i`);
//   this.getText(locator).then(function(text) {
//     if (text == CHECKBOX_TRUE) {
//       d.fulfill(true);
//     } else {
//       d.fulfill(false);
//     }
//   });

//   return d.promise;
// };

// ManageDraftPage.prototype.changePersonalStatusCheckbox = function(field, selected) {
//   var d = Promise.defer();
//   var thiz = this;

//   var locator = By.xpath(`.//div[div/div/div[text()=' Personal Status ']]/.//div[div/label[text()='${field}']]/.//i`);

//   this.getText(locator).then(function(text) {
//     if (text == CHECKBOX_TRUE && !selected || text == CHECKBOX_FALSE && selected) {
//       thiz.click(locator);
//       d.fulfill(thiz.waitUntilStaleness(SAVE_ICON, 5000));
//     }
//   });
  
//   return d.promise;
// };

// ManageDraftPage.prototype.getNumChildrenInput = function() {
//   var locator = By.xpath(`.//div[div/div/div[text()=' Personal Status ']]/.//div[@inject='player.childCount']/input`);
//   return this.getAttribute(locator, 'value');
// };

// ManageDraftPage.prototype.changeNumChildrenInput = function(value) {
//   var locator = By.xpath(`.//div[div/div/div[text()=' Personal Status ']]/.//div[@inject='player.childCount']/input`);
//   this.clear(locator); // 1st clear changes it to 0
//   this.clear(locator);
//   this.sendKeys(locator, value);
//   this.sendKeys(locator, Key.ENTER);
//   return this.waitUntilStaleness(SAVE_ICON, 500);
// };


// /****************************************************************************
// ** Character/Injury
// *****************************************************************************/
// ManageDraftPage.prototype.getCharacterCheckbox = function(field) {
//   var d = Promise.defer();

//   var locator = By.xpath(`.//div[div[@inject='makeup']]/.//div[div/label[text()='${field}']]/.//i`);
//   this.getText(locator).then(function(text) {
//     if (text == CHECKBOX_TRUE) {
//       d.fulfill(true);
//     } else {
//       d.fulfill(false);
//     }
//   });

//   return d.promise;
// };

// ManageDraftPage.prototype.changeCharacterCheckbox = function(field, selected) {
//   var d = Promise.defer();
//   var thiz = this;

//   var locator = By.xpath(`.//div[div[@inject='makeup']]/.//div[div/label[text()='${field}']]/.//i`);

//   this.getText(locator).then(function(text) {
//     if (text == CHECKBOX_TRUE && !selected || text == CHECKBOX_FALSE && selected) {
//       thiz.click(locator);
//       d.fulfill(thiz.waitUntilStaleness(SAVE_ICON, 5000));
//     }
//   });
  
//   return d.promise;  
// };

// /****************************************************************************
// ** Intelligence
// *****************************************************************************/
// ManageDraftPage.prototype.getIntelligenceCheckbox = function(field) {
//   var d = Promise.defer();

//   var locator = By.xpath(`.//div[div[@inject='intelligence']]/.//div[div/label[text()='${field}']]/.//i`);
//   this.getText(locator).then(function(text) {
//     if (text == CHECKBOX_TRUE) {
//       d.fulfill(true);
//     } else {
//       d.fulfill(false);
//     }
//   });

//   return d.promise;
// };

// ManageDraftPage.prototype.changeIntelligenceCheckbox = function(field, selected) {
//   var d = Promise.defer();
//   var thiz = this;

//   var locator = By.xpath(`.//div[div[@inject='intelligence']]/.//div[div/label[text()='${field}']]/.//i`);

//   this.getText(locator).then(function(text) {
//     if (text == CHECKBOX_TRUE && !selected || text == CHECKBOX_FALSE && selected) {
//       thiz.click(locator);
//       d.fulfill(thiz.waitUntilStaleness(SAVE_ICON, 5000));
//     }
//   });
  
//   return d.promise;  
// };

// /****************************************************************************
// ** Presentation
// *****************************************************************************/
// ManageDraftPage.prototype.getPresentationCheckbox = function(field) {
//   var d = Promise.defer();

//   var locator = By.xpath(`.//div[div[@inject='presentation']]/.//div[div/label[text()='${field}']]/.//i`);
//   this.getText(locator).then(function(text) {
//     if (text == CHECKBOX_TRUE) {
//       d.fulfill(true);
//     } else {
//       d.fulfill(false);
//     }
//   });

//   return d.promise;
// };

// ManageDraftPage.prototype.changePresentationCheckbox = function(field, selected) {
//   var d = Promise.defer();
//   var thiz = this;

//   var locator = By.xpath(`.//div[div[@inject='presentation']]/.//div[div/label[text()='${field}']]/.//i`);

//   this.getText(locator).then(function(text) {
//     if (text == CHECKBOX_TRUE && !selected || text == CHECKBOX_FALSE && selected) {
//       thiz.click(locator);
//       d.fulfill(thiz.waitUntilStaleness(SAVE_ICON, 5000));
//     }
//   });
  
//   return d.promise;  
// };

// // /****************************************************************************
// // ** Metrics
// // *****************************************************************************/
// // ManageDraftPage.prototype.getMetricsInput = function(field) {
// //   var locator = By.xpath(`.//div[contains(@class,'interview-report')]/div[3]/.//div[div/div[text()='${field}']]/.//input`);
// //   return this.getAttribute(locator, 'value');
// // };

// // ManageDraftPage.prototype.changeMetricsInput = function(field, value) {
// //   var locator = By.xpath(`.//div[contains(@class,'interview-report')]/div[3]/.//div[div/div[text()='${field}']]/.//input`);
// //   this.clear(locator); // 1st clear changes it to 0
// //   this.clear(locator);
// //   this.sendKeys(locator, value);
// //   this.sendKeys(locator, Key.ENTER);
// //   return this.waitUntilStaleness(SAVE_ICON, 500);
// // };


// // ManageDraftPage.prototype.getMetricsSectionAverage = function(section) {
// //   var d = Promise.defer();

// //   var locator = By.xpath(`.//div[contains(@class,'interview-report')]/div[3]/.//div[div[text()=' ${section} ']]/div[2]`);
// //   this.getText(locator).then(function(text) {
// //     d.fulfill(text.replace(/AVG\:/, '').trim());
// //   });

// //   return d.promise;
// // };

// // // Groups -> Top Starter: topStarterSkills, Starter: starterSkills, Backup: backupSkills
// // ManageDraftPage.prototype.getGradeGroupSkills = function(group) {
// //   var locator = By.xpath(`.//div[@inject='${group}']/div[@class='row'][2]/div`);
// //   return this.getTextArray(locator);
// // };

// // /****************************************************************************
// // ** Helpers
// // *****************************************************************************/
// ManageDraftPage.prototype.changeDatePicker = function(year, month, day) {
//   var d = Promise.defer();
//   var thiz = this;
//   this.isDisplayed(DATEPICKER_DAYS_TABLE, 500).then(function(displayed) {
//     if (displayed) { thiz.click(DAYS_PICKER_SWITCH); };
//   }).then(function() {
//     thiz.isDisplayed(DATEPICKER_MONTHS_TABLE, 500).then(function(displayed) {
//       if (displayed) { thiz.click(MONTHS_PICKER_SWITCH); };
//     });
//   }).then(function() {
//     var yearLocator = By.xpath(`.//div[@class='datepicker-years']/table/tbody/tr/td/span[text()='${year}']`);
//     thiz.click(yearLocator, 500);
//     var monthLocator = By.xpath(`.//div[@class='datepicker-months']/table/tbody/tr/td/span[text()='${month}']`);
//     thiz.click(monthLocator, 500);
//     var dayLocator  = By.xpath(`.//div[@class='datepicker-days']/table/tbody/tr/td[not(contains(@class,'old'))][text()='${day}']`);
//     d.fulfill(thiz.click(dayLocator, 500));
//   });  

//   return d.promise;
// };

module.exports = ManageDraftPage;