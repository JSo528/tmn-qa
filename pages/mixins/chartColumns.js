var By = require('selenium-webdriver').By;
var Promise = require('selenium-webdriver').promise;
var Until = require('selenium-webdriver').until;
var Key = require('selenium-webdriver').Key;

ChartColumns = {
  /****************************************************************************
  ** Locators
  *****************************************************************************/
  
  // Histogram
  CHART_COLUMNS_BTN: By.id('tableActive'),

  HISTOGRAM_LINK: By.xpath(".//div[@class='chart-popover']/div[@class='chart'][1]/a"),
  HISTOGRAM_CIRCLE: By.css('.modal-dialog .focus-group circle'),
  HISTOGRAM_BAR: By.css('.modal-dialog g.stack rect'),
  HISTOGRAM_DISPLAY_PINS_AS_BARS_INPUT: By.css('.modal-dialog .modal-footer input[name="histogramFocusDisplay"'),
  HISTOGRAM_BIN_COUNT_SELECT: By.id('histogramBinCount'),
  
  HISTOGRAM_TITLE: By.css('.modal.in svg text.chart-title'),
  HISTOGRAM_TITLE_INPUT: By.css('input.customization.title'),

  // ScatterChart
  SCATTER_CHART_LINK: By.xpath(".//div[@class='chart-popover']/div[@class='chart'][2]/a"),

  // Pins
  CLEAR_PINS_BTN: By.css('button.table-clear-pinned'),

  // ISO Mode
  ISO_BTN_ON: By.id('isoOnBtn'),
  ISO_BTN_OFF: By.id('isoOffBtn'),
  ISO_TEAM_SEARCH_INPUT: By.css('.table-isolation-controls input.tt-input'),

  // Modal
  MODAL: By.xpath(".//div[@class='modal modal-chart in']/div/div[@class='modal-content']"),
  MODAL_CLOSE_BTN: By.xpath(".//div[@class='modal modal-chart in']/div/div/div/button[@class='close']"),

  // Tooltip
  TOOLTIP: By.css('.d3-tip.e'),

  // Defaults
  DEFAULT_CHART_COLUMNS_DATA_TABLE_ID: 'tableBaseballTeamsStatsContainer', 
  DEFAULT_CHART_COLUMNS_ISO_TABLE_ID: 'tableBaseballTeamsStatsISOContainer', 

  CHART_COLUMNS_TABLE_ID: function() {
    return this.DEFAULT_CHART_COLUMNS_DATA_TABLE_ID[this.section] || this.DEFAULT_CHART_COLUMNS_DATA_TABLE_ID;
  },
  CHART_COLUMNS_ISO_TABLE_ID: function() {
    return this.DEFAULT_CHART_COLUMNS_ISO_TABLE_ID[this.section] || this.DEFAULT_CHART_COLUMNS_ISO_TABLE_ID;
  },
  /****************************************************************************
  ** Functions
  *****************************************************************************/
  clickChartColumnsBtn: function() {
    var locator = By.css(`#${this.CHART_COLUMNS_TABLE_ID()} table`);
    this.driver.wait(Until.elementLocated(locator));
    return this.click(this.CHART_COLUMNS_BTN);
  },
  clickChartColumnsTableHeader: function(col) {
    var locator = By.css(`#${this.CHART_COLUMNS_TABLE_ID()} table th:nth-of-type(${col})`);    
    this.waitForEnabled(locator);
    return this.click(locator); 
  },
  
  // Histogram
  openHistogram: function(colNum) {
    this.clickChartColumnsTableHeader(colNum);
    return this.click(this.HISTOGRAM_LINK);
  },

  getHistogramCircleCount: function() {
    return this.getElementCount(this.HISTOGRAM_CIRCLE);
  },
  getHistogramBarCount: function() {
    return this.getElementCount(this.HISTOGRAM_BAR);
  },
  toggleHistogramDisplayPinsAsBars: function() {
    return this.click(this.HISTOGRAM_DISPLAY_PINS_AS_BARS_INPUT);
  },
  changeHistogramBinCount: function(selection) {
    this.click(this.HISTOGRAM_BIN_COUNT_SELECT);
    var optionLocator = By.xpath(`.//select[@id='histogramBinCount']/option[text()="${selection}"]`);
    return this.click(optionLocator);
  },

  hoverOverHistogramStack: function(stackNum) {
    var locator = By.css(`.modal-dialog g.stack:nth-of-type(${stackNum}) rect`);
    var thiz = this;

    this.driver.findElement(locator).then(function(elem) {
      thiz.driver.actions().mouseMove(elem).perform();
      thiz.driver.sleep(5000);
    });
  },
  setTitleForHistogram: function(title) {
    this.clear(this.HISTOGRAM_TITLE_INPUT);
    this.sendKeys(this.HISTOGRAM_TITLE_INPUT, title);
    return this.sendKeys(this.HISTOGRAM_TITLE_INPUT, Key.ENTER);
  },

  getTitleForHistogram: function(title) {
    return this.getText(this.HISTOGRAM_TITLE);
  },

  // ScatterChart
  openScatterChart: function(selectionOne, selectionTwo) {
    this.clickChartColumnsTableHeader(selectionOne);
    this.click(this.SCATTER_CHART_LINK);
    this.clickChartColumnsTableHeader(selectionTwo);
    return this.click(this.SCATTER_CHART_LINK);
  },

  // Modal
  isModalDisplayed: function() {
    return this.isDisplayed(this.MODAL, 2000);
  },

  closeModal: function() {
    return this.click(this.MODAL_CLOSE_BTN);
  },

  // Tooltip
  getTooltipText: function() {
    return this.getText(this.TOOLTIP);
  },

  // Pinning
  clickTablePin: function(rowNum) {
    var locator = By.xpath(`.//div[@id='${this.CHART_COLUMNS_TABLE_ID()}']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td/span[@class='table-pin fa fa-lg fa-thumb-tack']`);
    return this.click(locator);
  },

  clearTablePins: function() {
    return this.click(this.CLEAR_PINS_BTN);
  },

  // ISO Mode
  clickIsoBtn: function(onOrOff) {
    var locator = (onOrOff == "on") ? this.ISO_BTN_ON : this.ISO_BTN_OFF
    return this.click(locator);
  },
  getIsoTableStat: function(rowNum, col) {
    var locator = By.xpath(`.//div[@id='${this.CHART_COLUMNS_ISO_TABLE_ID()}']/table/tbody/tr[@data-tmn-row-type='row'][${rowNum}]/td[${col}]`);
    return this.getText(locator);
  },
  addToIsoTable: function(name, selectionNum) {
    var selectionNum = selectionNum || 1;
    return this.selectFromSearch(this.ISO_TEAM_SEARCH_INPUT, name, selectionNum);
  },
  getPinnedTotalTableStat: function(col) {
    var locator = By.xpath(`.//div[@id='${this.CHART_COLUMNS_TABLE_ID()}']/table/tbody/tr[3]/td[${col}]`);
    return this.getText(locator);
  },
  getPinnedAverageTableStat: function(col) {
    var locator = By.xpath(`.//div[@id='${this.CHART_COLUMNS_TABLE_ID()}']/table/tbody/tr[2]/td[${col}]`);
    return this.getText(locator);
  }
}

module.exports = ChartColumns;