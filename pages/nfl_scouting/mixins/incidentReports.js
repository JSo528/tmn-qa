var By = require('selenium-webdriver').By;
var Promise = require('selenium-webdriver').promise;
var Until = require('selenium-webdriver').until;
var Key = require('selenium-webdriver').Key;

// SaveIcon
var SAVE_ICON = By.css('.status');
  
var NEW_INCIDENT_REPORT_DIV_NUM = 1
var INCIDENT_REPORT_SPACER = By.css('.-incidents .-show');
var CREATE_INCIDENT_REPORT_BTN = By.css('.-incidents .-create');
var INCIDENT_REPORT_WEEK_INPUT = By.xpath(`.//div[${NEW_INCIDENT_REPORT_DIV_NUM}]/div/div[@class='incident']/.//div[@inject='week']/div`);
var INCIDENT_REPORT_DATE_INPUT = By.xpath(`.//div[${NEW_INCIDENT_REPORT_DIV_NUM}]/div/div[@class='incident']/.//div[@inject='date']/input`);
var INCIDENT_REPORT_TYPE_INPUT = By.xpath(`.//div[${NEW_INCIDENT_REPORT_DIV_NUM}]/div/div[@class='incident']/.//div[@inject='type']/div`);
var INCIDENT_REPORT_COMMENT_INPUT = By.xpath(`.//div[${NEW_INCIDENT_REPORT_DIV_NUM}]/div/div[@class='incident']/.//div[@inject='comment']/div`);
var INCIDENT_DIVS = By.css('.incidents .incident');
var INCIDENT_REPORT_TABLE = By.css('.incident-table');

IncidentReports = {
  INCIDENT_REPORTS_WEEK_ENUMERATION: [
    'OS',
    'TC',
    'P1',
    'P2',
    'P3',
    'P4',
    'W1',
    'W2',
    'W3',
    'W4',
    'W5',
    'W6',
    'W7',
    'W8',
    'W9',
    'W10',
    'W11',
    'W12',
    'W13',
    'W14',
    'W15',
    'W16',
    ''
  ],
  INCIDENT_REPORTS_TYPE_ENUMERATION: [
    'C',
    'X',
    'IR',
    ''
  ],
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

  changeIncidentReport: function(reportNum, options) {
    for (var key in options) {
      switch(key) {
        case 'week':
          var locator = By.xpath(`.//div[${reportNum}]/div/div[@class='incident']/.//div[@inject='week']/div`);
          var weekOptionLocator = By.xpath(`.//div[${reportNum}]/div/div[@class='incident']/.//div[@inject='week']/ul/li[text()='${options[key]}']`);
          this.changeDropdown(locator, weekOptionLocator);
          break;
        case 'date':
          var locator = By.xpath(`.//div[${reportNum}]/div/div[@class='incident']/.//div[@inject='date']/input`);
          this.changeDatePicker(locator, options[key].year, options[key].month, options[key].day);
          break;
        case 'type':
          var locator = By.xpath(`.//div[${reportNum}]/div/div[@class='incident']/.//div[@inject='type']/div`);
          var typeOptionLocator = By.xpath(`.//div[${reportNum}]/div/div[@class='incident']/.//div[@inject='type']/ul/li[text()='${options[key]}']`);
          this.changeDropdown(locator, typeOptionLocator);
          break;
        case 'comment':
          var locator = By.xpath(`.//div[${reportNum}]/div/div[@class='incident']/.//div[@inject='comment']/div`);
          this.changeTextField(locator, options[key]);
          break;
      }
    }
    return this.waitUntilStaleness(SAVE_ICON, 5000);
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
  },
  clickIncidentReportsTableHeader: function(colNum) {
    var locator = By.xpath(`.//div[contains(@class,'-incidents')]/.//div[${colNum}]/th`);
    this.click(locator);
    return this.waitUntilStaleness(INCIDENT_REPORT_TABLE, 5000);
  },
  getIncidentReportsTableValues: function(field) {
    if (field =='date') {
      var locator = By.xpath(`.//div[contains(@class,'-incidents')]/.//div[@inject='date']/input`);
      return this.getInputValueArray(locator, 'Select date/time');
    } else {
      var locator = By.xpath(`.//div[contains(@class,'-incidents')]/.//div[@inject='${field}']/div`);
      return this.getTextArray(locator, 'Select value');
    }
  },
  clickIncidentReportsSortIcon: function(colNum) {
   var locator = By.xpath(`.//div[contains(@class,'-incidents')]/.//div[${colNum}]/th/i[contains(@class, 'material-icons')]`);
    this.click(locator); 
    return this.waitUntilStaleness(INCIDENT_REPORT_TABLE, 5000);
  },
  clickIncidentReportsRemoveSortIcon: function(colNum) {
    var locator = By.xpath(`.//div[contains(@class,'-incidents')]/.//div[${colNum}]/th/i[contains(@class, '-cancel')]`);
    this.click(locator);
    return this.waitUntilStaleness(INCIDENT_REPORT_TABLE, 5000);
  }
}

module.exports = IncidentReports;