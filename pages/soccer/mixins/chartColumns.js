var By = require('selenium-webdriver').By;
var Promise = require('selenium-webdriver').promise;
var Until = require('selenium-webdriver').until;
var Key = require('selenium-webdriver').Key;

ChartColumns = {
  /****************************************************************************
  ** Locators
  *****************************************************************************/
  
  // Histogram
  CHART_COLUMNS_BTN: By.css('tmn-table-header > div.table-header > div:nth-of-type(1) > button'),
  CLEAR_PINS_BTN: By.css('tmn-table-header > div.table-header > div:nth-of-type(4) > button'),

  HISTOGRAM_LINK: By.xpath(".//div[@class='chart-popover']/div[@class='chart'][1]/a"),
  HISTOGRAM_CIRCLE: By.css('.modal-dialog .focus-group circle'),
  HISTOGRAM_BAR: By.css('.modal-dialog g.stack rect'),
  HISTOGRAM_DISPLAY_PINS_AS_BARS_INPUT: By.css('.modal-dialog .modal-footer input[name="histogramFocusDisplay"'),
  HISTOGRAM_BIN_COUNT_SELECT: By.id('histogramBinCount'),
  
  HISTOGRAM_TITLE: By.css('.modal.in svg text.chart-title'),
  HISTOGRAM_TITLE_INPUT: By.css('input.customization.title'),

  // ScatterChart
  SCATTER_CHART_LINK: By.xpath(".//div[@class='chart-popover']/div[@class='chart'][2]/a"),

  // ISO Mode
  ISO_BTN_ON: By.css('.iso-on'),
  ISO_BTN_OFF: By.css('.iso-off'),
  ISO_TEAM_SEARCH_INPUT: By.css('tmn-search-bar input'),

  // Modal
  MODAL: By.xpath(".//div[@class='modal modal-chart in']/div/div[@class='modal-content']"),
  MODAL_CLOSE_BTN: By.xpath(".//div[@class='modal modal-chart in']/div/div/div/button[@class='close']"),

  // Tooltip
  TOOLTIP: By.css('.d3-tip.e'),

  // Defaults
  DEFAULT_CHART_COLUMNS_DATA_TABLE_ID: 'results-table', 
  DEFAULT_CHART_COLUMNS_ISO_TABLE_ID: 'pinned-table', 

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
    var histogramLocator = By.xpath(`.//tmn-table[@id='results-table']/table[1]/thead/tr/th[${colNum}]/paper-tooltip/.//div[contains(@class, 'tmn-table-thead')]/div[1]/a`)
    this.clickChartColumnsTableHeader(colNum);
    return this.click(histogramLocator);
  },
  getHistogramBarCount: function() {
    return this.getElementCount(this.HISTOGRAM_BAR);
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
    var scatterChartLinkOne = By.xpath(`.//tmn-table[@id='results-table']/table[1]/thead/tr/th[${selectionOne}]/paper-tooltip/.//div[contains(@class, 'tmn-table-thead')]/div[2]/a`)
    var scatterChartLinkTwo = By.xpath(`.//tmn-table[@id='results-table']/table[1]/thead/tr/th[${selectionTwo}]/paper-tooltip/.//div[contains(@class, 'tmn-table-thead')]/div[2]/a`)
    this.clickChartColumnsTableHeader(selectionOne);
    this.click(scatterChartLinkOne);
    this.clickChartColumnsTableHeader(selectionTwo);
    return this.click(scatterChartLinkTwo);
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
    var locator = By.xpath(`.//tmn-table[@id='${this.CHART_COLUMNS_TABLE_ID()}']/table/tbody/tr[@data-tmn-row][${rowNum}]/td[1]/tmn-table-action-column/span[@data-tmn-table-row-pin]`);
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
    var row = rowNum + 3;
    var locator = By.xpath(`.//tmn-table[@id='${this.CHART_COLUMNS_ISO_TABLE_ID()}']/table/tbody/tr[@data-tmn-row][${row}]/td[${col}]`);
    return this.getText(locator);
  },
  addToIsoTable: function(name, selectionNum) {
    var selectionNum = selectionNum || 1;
    var selectionLocator = By.xpath(`.//tmn-search-bar/div[contains(@class, 'tmn-dropdown-menu')]/div[contains(@class,'tmn-dropdown-item')][${selectionNum}]`);

    this.clear(this.ISO_TEAM_SEARCH_INPUT);
    this.sendKeys(this.ISO_TEAM_SEARCH_INPUT, name); 
    this.sendKeys(this.ISO_TEAM_SEARCH_INPUT, Key.SPACE); 
    return this.click(selectionLocator);
  },
  getPinnedTotalTableStat: function(col) {
    var locator = By.xpath(`.//tmn-table[@id='${this.CHART_COLUMNS_ISO_TABLE_ID()}']/table/tbody/tr[@data-tmn-row][3]/td[${col}]`);
    return this.getText(locator);
  },
  getPinnedAverageTableStat: function(col) {
    var locator = By.xpath(`.//tmn-table[@id='${this.CHART_COLUMNS_ISO_TABLE_ID()}']/table/tbody/tr[@data-tmn-row][2]/td[${col}]`);
    return this.getText(locator);
  }
}

module.exports = ChartColumns;