var By = require('selenium-webdriver').By;
var Promise = require('selenium-webdriver').promise;
var Until = require('selenium-webdriver').until;
var Key = require('selenium-webdriver').Key;

// SaveIcon
var SAVE_ICON = By.css('.status');
  
var NEW_INCIDENT_REPORT_DIV_NUM = 2
var INCIDENT_REPORT_SPACER = By.css('.-incidents .-show');
var CREATE_INCIDENT_REPORT_BTN = By.css('.-incidents .-create');
var INCIDENT_REPORT_WEEK_INPUT = By.xpath(`.//div[${NEW_INCIDENT_REPORT_DIV_NUM}]/div/div[@class='incident']/.//div[@inject='week']/div`);
var INCIDENT_REPORT_DATE_INPUT = By.xpath(`.//div[${NEW_INCIDENT_REPORT_DIV_NUM}]/div/div[@class='incident']/.//div[@inject='date']/input`);
var INCIDENT_REPORT_TYPE_INPUT = By.xpath(`.//div[${NEW_INCIDENT_REPORT_DIV_NUM}]/div/div[@class='incident']/.//div[@inject='type']/div`);
var INCIDENT_REPORT_COMMENT_INPUT = By.xpath(`.//div[${NEW_INCIDENT_REPORT_DIV_NUM}]/div/div[@class='incident']/.//div[@inject='comment']/div`);
var INCIDENT_DIVS = By.css('.incidents .incident');

IncidentReports = {
  clickIncidentReportSpacer: function() {
    return this.click(INCIDENT_REPORT_SPACER);
  },

  // week: TC, P1, W1, etc.
  // date: {year: 2015, month: 'Jan', day: 11}
  // type: C, X, IR
  // comment: text
  createIncidentReport: function(week, date, type, comment) {
    this.click(CREATE_INCIDENT_REPORT_BTN);

    // week
    var weekOptionLocator = By.xpath(`.//div[${NEW_INCIDENT_REPORT_DIV_NUM}]/div/div[@class='incident']/.//div[@inject='week']/ul/li[text()='${week}']`);
    this.changeDropdown(INCIDENT_REPORT_WEEK_INPUT, weekOptionLocator);

    // date
    this.changeDatePicker(INCIDENT_REPORT_DATE_INPUT, date.year, date.month, date.day);

    // type
    var typeOptionLocator = By.xpath(`.//div[${NEW_INCIDENT_REPORT_DIV_NUM}]/div/div[@class='incident']/.//div[@inject='type']/ul/li[text()='${type}']`);
    this.changeDropdown(INCIDENT_REPORT_TYPE_INPUT, typeOptionLocator);

    // comment
    return this.changeTextField(INCIDENT_REPORT_COMMENT_INPUT, comment);
  },

  getIncidentReportCount: function() {
    return this.getElementCount(INCIDENT_DIVS);
  },

  getIncidentReportValue: function(reportNum, field) {
    if (field =='date') {
      var locator = By.xpath(`.//div[${reportNum}]/div/div[@class='incident']/.//div[@inject='date']/input`);
      return this.getInput(locator);
    } else {
      var locator = By.xpath(`.//div[${reportNum}]/div/div[@class='incident']/.//div[@inject='${field}']/div`);
      return this.getText(locator);
    }
  },

  toggleDeleteIncidentReport: function(reportNum) {
    var locator = By.xpath(`.//div[${NEW_INCIDENT_REPORT_DIV_NUM}]/div/div[@class='incident']/.//div[contains(@class, '-remove-item')]/button`);
    return this.clickAndSave(locator);
  }
}

module.exports = IncidentReports;