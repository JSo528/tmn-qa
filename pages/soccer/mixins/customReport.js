var By = require('selenium-webdriver').By;
var Promise = require('selenium-webdriver').promise;
var Until = require('selenium-webdriver').until;
var Key = require('selenium-webdriver').Key;

CustomReport = {
  /****************************************************************************
  ** Locators
  *****************************************************************************/
  PREVIEW_TABLE: By.xpath(".//tmn-table[contains(@class,'tmn-custom-report-modal')]/table"),
  DROPDOWN_INPUT: By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input"),
  DEFAULT_MODAL_TAG: 'body',
  MODAL_TAG: function() {
    if (this.CUSTOM_REPORT_MODAL_TAG && this.tabName) {
      return this.CUSTOM_REPORT_MODAL_TAG[this.tabName];
    } else {
      return this.DEFAULT_MODAL_TAG;
    }
  },
  /****************************************************************************
  ** Functions
  *****************************************************************************/
  clickCreateReportBtn: function() {
    var locator = By.xpath(`.//${this.MODAL_TAG()}/.//tmn-custom-report-control-set/div[contains(@class, 'tmn-custom-report-control-set')]/button[contains(text(),'Create Report')]`);
    return this.clickVisible(locator);
  },
  clickEditReportBtn: function() {
    var locator = By.xpath(`.//${this.MODAL_TAG()}/.//tmn-custom-report-control-set/div[contains(@class, 'tmn-custom-report-control-set')]/button[contains(text(),'Edit Report')]`);
    return this.clickVisible(locator);
  },
  clickDeleteReportBtn: function() {
    var locator = By.xpath(`.//${this.MODAL_TAG()}/.//tmn-custom-report-control-set/div[contains(@class, 'tmn-custom-report-control-set')]/button[contains(text(),'Delete Report')]`);
    return this.clickVisible(locator);
  },
  selectCustomReport: function(reportName) {
    var d = Promise.defer();
    var noResultsLocator = By.xpath(".//div[@id='select2-drop']/ul/li[@class='select2-no-results']");
    var locator = By.xpath(`.//${this.MODAL_TAG()}/.//tmn-custom-report-control-set/div[contains(@class, 'tmn-custom-report-control-set')]/tmn-select2`);
    this.clickVisible(locator);
    this.sendKeys(this.DROPDOWN_INPUT, reportName, 10000);
    this.sendKeys(this.DROPDOWN_INPUT, Key.ENTER, 10000);
    this.isDisplayed(noResultsLocator, 100).then(function(displayed) {
      if (displayed) {
        d.fulfill(this.sendKeys(this.DROPDOWN_INPUT, Key.ESCAPE));
      } else {
        d.fulfill(true)
      }
    }.bind(this));
    return d.promise;
  },
  changeReportName: function(reportName) {
    var nameInput = By.xpath(`.//${this.MODAL_TAG()}/.//tmn-custom-report-modal/tmn-modal/paper-dialog/.//div/div/input[@placeholder='Report Name']`);
    this.clear(nameInput, 1000);
    return this.sendKeys(nameInput, reportName);
  },
  isCustomReportModalDisplayed: function() {
    var locator = By.xpath(`.//${this.MODAL_TAG()}/.//tmn-custom-report-modal/tmn-modal/paper-dialog`);
    return this.isDisplayed(locator, 100);
  },
  addStatToCustomReport: function(stat, alias) {
    var addStatButton = By.xpath(`.//${this.MODAL_TAG()}/.//tmn-custom-report-modal/tmn-modal/paper-dialog/.//button[contains(text(), 'Add Stat')]`);
    var statSelect = By.xpath(`.//${this.MODAL_TAG()}/.//tmn-custom-report-stat-select`);
    var aliasSelect = By.xpath(`.//${this.MODAL_TAG()}/.//tmn-custom-report-modal/tmn-modal/paper-dialog/.//div[div[contains(text(),'Alias')]]/div/input`);
    var saveButton = By.xpath(`.//${this.MODAL_TAG()}/.//tmn-custom-report-modal/.//div[contains(@class, 'subForm')]/div/button[1]`);
          
    this.click(addStatButton)
    this.changeDropdown(statSelect, this.DROPDOWN_INPUT, stat);
    this.sendKeys(aliasSelect, alias);
    this.click(saveButton);
    return this.waitUntilStaleness(this.PREVIEW_TABLE, 5000);
  },
  removeStatFromCustomReport: function(statName) {
    var statLocator = By.xpath(`.//tmn-custom-report-modal/tmn-modal/paper-dialog/.//tmn-list-button-list/div/tmn-list-button/button[span[contains(text(),'${statName}')]]/iron-icon`);
    return this.click(statLocator);
  },
  isCustomReportColumnDisplayed: function(colName) {
    var locator = By.xpath(`.//${this.MODAL_TAG()}/.//tmn-custom-report-modal/tmn-modal/paper-dialog/.//table/thead/tr/th[@data-col-key='${colName}']`)
    return this.isDisplayed(locator, 1000);
  },
  changeStatInCustomReport: function(statName, newStat, newAlias) {
    var statLocator = By.xpath(`.//${this.MODAL_TAG()}/.//tmn-custom-report-modal/tmn-modal/paper-dialog/.//tmn-list-button-list/div/tmn-list-button/button/span[contains(text(),'${statName}')]`);
    var statSelect = By.xpath(`.//${this.MODAL_TAG()}/.//tmn-custom-report-stat-select`);
    var aliasInput = By.xpath(`.//${this.MODAL_TAG()}/.//tmn-custom-report-modal/tmn-modal/paper-dialog/.//div[div[contains(text(),'Alias')]]/div/input`);
    var saveButton = By.xpath(`.//${this.MODAL_TAG()}/.//tmn-custom-report-modal/.//div[contains(@class, 'subForm')]/div/button[1]`);
    
    this.click(statLocator);
    if (newStat) this.changeDropdown(statSelect, this.DROPDOWN_INPUT, newStat);  
    this.sendKeys(aliasInput, newAlias);
    this.click(saveButton);
    return this.waitUntilStaleness(this.PREVIEW_TABLE, 5000);
  },
  changeSortColumnInCustomReport: function(colName) {
    var sortSelect = By.xpath(`.//${this.MODAL_TAG()}/.//tmn-select2[contains(@id,'sortOrderColSelect')]`);
    this.changeDropdown(sortSelect, this.DROPDOWN_INPUT, colName);
    return this.waitUntilStaleness(this.PREVIEW_TABLE, 5000);
  },
  getCustomReportPreviewTableStatsFor: function(colName) {
    var locator = By.xpath(`.//${this.MODAL_TAG()}/.//tmn-table[contains(@class,'tmn-custom-report-modal')]/table/tbody/tr[not(@is='tmn-table-tr-section')]/td[count(//tmn-table[contains(@class,'tmn-custom-report-modal')]/table/thead/tr/th[@data-col-key="${colName}"]/preceding-sibling::th)+1]`);
    return this.getTextArray(locator);
  },
  changeSortOrderInCustomReport: function(sortOrder) {
    var sortOrderSelect = By.xpath(`.//${this.MODAL_TAG()}/.//tmn-select2[contains(@id,'sortOrderSelect2')]`);
    var optionLocator = By.xpath(`.//${this.MODAL_TAG()}/.//tmn-select2[contains(@id,'sortOrderSelect2')]/select/option[text()="${sortOrder}"]`);
    this.click(sortOrderSelect);
    this.click(optionLocator);
    return this.waitUntilStaleness(this.PREVIEW_TABLE, 5000);
  },
  addFilterToCustomReport: function(filter) {
    var filterSelect = By.xpath(`.//${this.MODAL_TAG()}/.//tmn-custom-report-modal/tmn-modal/paper-dialog/.//div[@id='s2id_addFilter']`);
    this.changeDropdown(filterSelect, this.DROPDOWN_INPUT, filter);
    return this.waitUntilStaleness(this.PREVIEW_TABLE, 5000);
  },
  removeFilterFromCustomReport: function(filter) {
    var filterCloseBtn = By.xpath(`.//${this.MODAL_TAG()}/.//tmn-custom-report-modal/tmn-modal/paper-dialog/.//div[contains(@class,'filter-set-container')]/.//div[div[contains(text()[1], "${filter}")]]/div/span[contains(@class,'closer')]`);
    var updateButton = By.xpath(`.//tmn-custom-report-modal/tmn-modal/paper-dialog/.//div[contains(@class,'filter-set-container')]/.//button[text()='Update']`);
    this.click(filterCloseBtn);
    this.click(updateButton);
    return this.waitUntilStaleness(this.PREVIEW_TABLE, 5000);
  },
  getCustomReportPreviewTableStatFor: function(rowNum, colName) {
    var locator = By.xpath(`.//${this.MODAL_TAG()}/.//tmn-table[contains(@class,'tmn-custom-report-modal')]/table/tbody/tr[not(@is='tmn-table-tr-section')][${rowNum}]/td[count(//tmn-table[contains(@class,'tmn-custom-report-modal')]/table/thead/tr/th[@data-col-key="${colName}"]/preceding-sibling::th)+1]`);
    return this.getText(locator);
  },
  clickSaveCustomReportButton: function() {
    var locator = By.xpath(`.//${this.MODAL_TAG()}/.//tmn-custom-report-modal/tmn-modal/paper-dialog/div/div[contains(@class,'modal-footer')]/div/div/button[contains(text(), 'Save')]`);
    this.click(locator);
    return this.driver.sleep(2000);
  },
  clickCloseCustomReportButton: function() {
    var locator = By.xpath(`.//${this.MODAL_TAG()}/.//tmn-custom-report-modal/tmn-modal/paper-dialog/div/div[contains(@class,'modal-footer')]/div/div/button[contains(text(), 'Cancel')]`);
    return this.click(locator);
  },
  getCurrentReport: function() {
    var locator = By.xpath(`.//${this.MODAL_TAG()}/.//tmn-custom-report-control-set/div/tmn-select2/div/a/span[contains(@class, 'select2-chosen')]`);
    return this.getText(locator);
  }
}

module.exports = CustomReport;