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
var incidentReports = require('../mixins/incidentReports.js')

/****************************************************************************
** Locators
*****************************************************************************/
var SUBMIT_BUTTON = By.xpath(".//button[contains(@class,'-state')]");
var OBSERVATIONS_TITLE = By.css('.-observations .title');
var GAME_REPORTS_SPACER = By.css('.-game-reports .bottom-spacer i');
var PLAYER_LINK = By.css(".title .link a");

/****************************************************************************
** Constructor
*****************************************************************************/
function ScoutingReportPage(driver) {
  BasePage.call(this, driver);
};

ScoutingReportPage.prototype = Object.create(BasePage.prototype);
ScoutingReportPage.prototype.constructor = ScoutingReportPage;

// Mixins
_.extend(ScoutingReportPage.prototype, inputs);
_.extend(ScoutingReportPage.prototype, incidentReports);


ScoutingReportPage.prototype.waitForPageToLoad = function() {
  return this.waitForEnabled(By.css('.scouting-report'));
};

ScoutingReportPage.prototype.clickSubmitButton = function() {
  return this.click(SUBMIT_BUTTON);
};

ScoutingReportPage.prototype.isSubmitButtonDisplayed = function() {
  return this.isDisplayed(SUBMIT_BUTTON);
};

ScoutingReportPage.prototype.clickPlayerLink = function() {
  return this.click(PLAYER_LINK);
};

/****************************************************************************
** Observations
*****************************************************************************/
ScoutingReportPage.prototype.getObservationsDropdown = function(field) {
  var locator = By.xpath(`.//div[contains(@class,'-observations')]/.//div[div/label[text()='${field}']]/.//div[contains(@class, 'dropdown-toggle')]`);
  return this.getDropdown(locator);
};

ScoutingReportPage.prototype.changeObservationsDropdown = function(field, value) {
  var locator = By.xpath(`.//div[contains(@class,'-observations')]/.//div[div/label[text()='${field}']]/.//div[contains(@class,'dropdown-toggle')]`);
  var optionLocator = By.xpath(`.//div[contains(@class,'-observations')]/.//div[div/label[text()='${field}']]/.//ul/li[text()='${value}']`);
  return this.changeDropdown(locator, optionLocator);
};

ScoutingReportPage.prototype.getObservationsInput = function(field) {
  var locator = By.xpath(`.//div[contains(@class,'-observations')]/.//div[div/label[text()='${field}']]/.//input`);
  return this.getInput(locator);
};

ScoutingReportPage.prototype.changeObservationsInput = function(field, value) {
  var locator = By.xpath(`.//div[contains(@class,'-observations')]/.//div[div/label[text()='${field}']]/.//input`);
  return this.changeInput(locator, value);
};

// frame, specialTeams, alignment
ScoutingReportPage.prototype.getObservationsText = function(field) {
  var locator = By.xpath(`.//div[contains(@class,'-observations')]/.//div[@inject='${field}']/div[@class='-editor control']`);
  return this.getTextField(locator);
};

ScoutingReportPage.prototype.changeObservationsText = function(field, text) {
  var locator = By.xpath(`.//div[contains(@class,'-observations')]/.//div[@inject='${field}']/div[@class='-editor control']`);
  return this.changeTextField(locator, text);
};

/****************************************************************************
** Profile
*****************************************************************************/
ScoutingReportPage.prototype.getProfileInput = function(field) {
  var locator = By.xpath(`.//div[contains(@class, 'scouting-report')]/div[1]/.//div[div/label[text()='${field}']]/.//input`);
  var secondaryLocator = By.xpath(`.//div[contains(@class, 'scouting-report')]/div[1]/.//div[@inject='${field}']/.//input`);
  return this.getInput(locator, secondaryLocator);
};

ScoutingReportPage.prototype.changeProfileInput = function(field, value) {
  var locator = By.xpath(`.//div[contains(@class, 'scouting-report')]/div[1]/.//div[div/label[text()='${field}']]/.//input`);
  var secondaryLocator =  By.xpath(`.//div[contains(@class, 'scouting-report')]/div[1]/.//div[@inject='${field}']/.//input`);

  return this.changeInput(locator, value, secondaryLocator);
};

ScoutingReportPage.prototype.changeProfileDraftYear = function(year) {
  var locator = By.xpath(`.//div[contains(@class, 'scouting-report')]/div[1]/.//div[div/label[text()='Draft Year']]/.//input`);
  var yearLocator = By.xpath(`.//div[@class='datepicker']/div[@class='datepicker-years']/table/tbody/tr/td/span[text()='${year}']`)
  return this.changeDropdown(locator, yearLocator);
};

ScoutingReportPage.prototype.getProfileDropdown = function(field) {
  var locator = By.xpath(`.//div[contains(@class, 'scouting-report')]/div[1]/.//div[div/label[text()='${field}']]/.//div[@data-toggle='dropdown']`);
  var secondaryLocator = locator = By.xpath(`.//div[contains(@class, 'scouting-report')]/div[1]/.//div[@inject='${field}']/.//div[@data-toggle='dropdown']`);
  return this.getDropdown(locator, secondaryLocator);
};

ScoutingReportPage.prototype.changeProfileDropdown = function(field, value) {
  var locator = By.xpath(`.//div[contains(@class, 'scouting-report')]/div[1]/.//div[div/label[text()='${field}']]/.//div[@data-toggle='dropdown']`);
  var optionLocator = By.xpath(`.//div[contains(@class, 'scouting-report')]/div[1]/.//div[div/label[text()='${field}']]/.//ul/li[text()='${value}']`);
  var secondaryLocator = By.xpath(`.//div[contains(@class, 'scouting-report')]/div[1]/.//div[@inject='${field}']/.//div[@data-toggle='dropdown']`);
  var secondaryOptionLocator = By.xpath(`.//div[contains(@class, 'scouting-report')]/div[1]/.//div[@inject='${field}']/.//ul/li[contains(text(),'${value}')]`);
  return this.changeDropdown(locator, optionLocator, secondaryLocator, secondaryOptionLocator);  
};

ScoutingReportPage.prototype.getProfileDate = function(field) {
  var locator = By.xpath(`.//div[contains(@class, 'scouting-report')]/div[1]/.//div[div/label[text()='${field}']]/.//input`)
  return this.getInput(locator);
};

ScoutingReportPage.prototype.changeProfileDate = function(field, date) {
  var locator = By.xpath(`.//div[contains(@class, 'scouting-report')]/div[1]/.//div[div/label[text()='${field}']]/.//input`)
  return this.changeDatePicker(locator, date.year, date.month, date.day)
};

ScoutingReportPage.prototype.getProfileCheckbox = function(field) {
  var locator = By.xpath(`.//div[contains(@class, 'scouting-report')]/div[1]/.//div[div/label[text()='${field}']]/.//i`)
  return this.getCheckbox(locator);
};

ScoutingReportPage.prototype.changeProfileCheckbox = function(field, selected) {
  var locator = By.xpath(`.//div[contains(@class, 'scouting-report')]/div[1]/.//div[div/label[text()='${field}']]/.//i`)
  return this.changeCheckbox(locator, selected);
};

/****************************************************************************
** Notes
*****************************************************************************/


ScoutingReportPage.prototype.getNotesGrade = function(section) {
  var locator = By.xpath(`.//div[@class='well']/.//div[div/div[text()=' ${section} ']]/.//input`);
  return this.getInput(locator);
};

ScoutingReportPage.prototype.changeNotesGrade = function(section, grade) {
  var locator = By.xpath(`.//div[@class='well']/.//div[div/div[text()=' ${section} ']]/.//input`);
  return this.changeInput(locator, grade);
};

ScoutingReportPage.prototype.getNotesText = function(section) {
  var locator = By.xpath(`.//div[@class='well'][div/div/div[text()=' ${section} ']]/.//div[contains(@class, '-editor')]`);
  return this.getTextField(locator);
};

ScoutingReportPage.prototype.changeNotesText = function(section, text) {
  var locator = By.xpath(`.//div[@class='well'][div/div/div[text()=' ${section} ']]/.//div[contains(@class, '-editor')]`);
  return this.changeTextField(locator, text);
};

ScoutingReportPage.prototype.getNotesHelpJagsCheckbox = function() {
  var locator = By.xpath(`.//div[@class='well']/.//div[div/div[text()=' Help Jags ']]/.//i`);
  return this.getCheckbox(locator);
};

ScoutingReportPage.prototype.changeNotesHelpJagsCheckbox = function(selected) {
  var locator = By.xpath(`.//div[@class='well']/.//div[div/div[text()=' Help Jags ']]/.//i`);
  return this.changeCheckbox(locator, selected);
};

/****************************************************************************
** Character/Injury
*****************************************************************************/
ScoutingReportPage.prototype.getCharacterCheckbox = function(field) {
  var locator = By.xpath(`.//div[div[@inject='makeup']]/.//div[div/label[text()='${field}']]/.//i`);
  return this.getCheckbox(locator);
};

ScoutingReportPage.prototype.changeCharacterCheckbox = function(field, selected) {
  var locator = By.xpath(`.//div[div[@inject='makeup']]/.//div[div/label[text()='${field}']]/.//i`);
  return this.changeCheckbox(locator, selected);
};

/****************************************************************************
** Metrics
*****************************************************************************/
ScoutingReportPage.prototype.getMetricsInput = function(field) {
  var locator = By.xpath(`.//div[contains(@class,'scouting-report')]/div[3]/.//div[div/div[text()='${field}']]/.//input`);
  return this.getInput(locator);
};

ScoutingReportPage.prototype.changeMetricsInput = function(field, value) {
  var locator = By.xpath(`.//div[contains(@class,'scouting-report')]/div[3]/.//div[div/div[text()='${field}']]/.//input`);
  return this.changeInput(locator, value);
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
** Game Reports
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

ScoutingReportPage.prototype.createNewGame = function(row, week, date, opponent) {
  var newGameLocator = By.xpath(`.//div[@class='grade-grid']/div[${row}]/.//div[@class='new-game']`);

  var weekLocator = By.xpath(`.//div[@class='grade-grid']/div[${row}]/.//div[@inject='proGame.week']/div`);
  var weekOptionLocator = By.xpath(`.//div[@class='grade-grid']/div[${row}]/.//div[@inject='proGame.week']/ul/li[text()='${week}']`);

  var dateLocator = By.xpath(`.//div[@class='grade-grid']/div[${row}]/.//div[@inject='proGame.date']/input`);

  var opponentLocator = By.xpath(`.//div[@class='grade-grid']/div[${row}]/.//div[@inject='proGame.opponent']/div`);

  var createLocator = By.xpath(".//div[@class='grade-grid']/div[1]/.//button[contains(@class, '-create-game')]");

  this.click(newGameLocator);
  this.changeDropdown(weekLocator, weekOptionLocator);
  this.changeDatePicker(dateLocator, date.year, date.month, date.day);
  this.changeTextField(opponentLocator, opponent);
  return this.click(createLocator);
};

ScoutingReportPage.prototype.getGameInfo = function(row, gameNum) {
  var locator = By.xpath(`.//div[@class='grade-grid']/div[${row}]/.//li[@class='player-game'][${gameNum}]/div/div/div`);
  return this.getText(locator);
};

ScoutingReportPage.prototype.setGameGrade = function(row, gameNum, grade) {
  var dropdownLocator =  By.xpath(`.//div[@class='grade-grid']/div[${row}]/.//li[@class='player-game'][${gameNum}]/div/div/div`);
  var optionLocator =  By.xpath(`.//div[@class='grade-grid']/div[${row}]/.//li[@class='player-game'][${gameNum}]/div/div/ul/li[text()='${grade}']`);

  return this.changeDropdown(dropdownLocator, optionLocator, grade);
};

ScoutingReportPage.prototype.getGameNotesText = function() {
  var locator = By.xpath(`.//div[@inject='gameNotes']/div[contains(@class, '-editor')]`);
  return this.getTextField(locator);
};

ScoutingReportPage.prototype.changeGameNotesText = function(text) {
  var locator = By.xpath(`.//div[@inject='gameNotes']/div[contains(@class, '-editor')]`);
  return this.changeTextField(locator, text);
};



/****************************************************************************
** Aggregate Helpers
*****************************************************************************/
ScoutingReportPage.prototype.getObservationField = function(type, field) {
  switch (type) {
    case 'text':
      return this.getObservationsText(field);
    case 'dropdown':
      return this.getObservationsDropdown(field);
    case 'input':
      return this.getObservationsInput(field);
  }
};

ScoutingReportPage.prototype.changeObservationField = function(type, field, value) {
  switch (type) {
    case 'text':
      return this.changeObservationsText(field, value);
    case 'dropdown':
      return this.changeObservationsDropdown(field, value);
    case 'input':
      return this.changeObservationsInput(field, value);
  }
};

ScoutingReportPage.prototype.getProfileField = function(type, field) {
  switch (type) {
    case 'checkbox':
      return this.getProfileCheckbox(field);
    case 'date':
      return this.getProfileDate(field);
    case 'dropdown':
      return this.getProfileDropdown(field);
    case 'input':
      return this.getProfileInput(field);
  }
};

ScoutingReportPage.prototype.changeProfileField = function(type, field, value) {
  switch (type) {
    case 'checkbox':
      return this.changeProfileCheckbox(field, value);
    case 'date':
      return this.changeProfileDate(field, value);
    case 'dropdown':
      return this.changeProfileDropdown(field, value);
    case 'input':
      return this.changeProfileInput(field, value);
  }
};

ScoutingReportPage.prototype.getNotesField = function(type, field) {
  switch (type) {
    case 'text':
      return this.getNotesText(field);
    case 'grade':
      return this.getNotesGrade(field);
    case 'jagsCheckbox':
      return this.getNotesHelpJagsCheckbox();
  }
};

ScoutingReportPage.prototype.changeNotesField = function(type, field, value) {
  switch (type) {
    case 'text':
      return this.changeNotesText(field, value);
    case 'grade':
      return this.changeNotesGrade(field, value);
    case 'jagsCheckbox':
      return this.changeNotesHelpJagsCheckbox(value);
  }
};

module.exports = ScoutingReportPage;