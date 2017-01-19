var By = require('selenium-webdriver').By;
var Promise = require('selenium-webdriver').promise;
var Until = require('selenium-webdriver').until;

ScatterPlot = {

  /****************************************************************************
  ** Locators
  *****************************************************************************/
  X_STAT_SELECT: By.id('s2id_pageControlBaseballScatterXStatType'),
  Y_STAT_SELECT: By.id('s2id_pageControlBaseballScatterYStatType'),
  GLOBAL_FILTER_SELECT: By.id('s2id_addFilter'),
  X_AXIS_FILTER_SELECT: By.css("#xAxisFilters #s2id_addFilter"),
  Y_AXIS_FILTER_SELECT: By.css("#yAxisFilters #s2id_addFilter"),
  DROPDOWN_INPUT: By.xpath(".//div[@id='select2-drop']/div/input"),
  GLOBAL_FILTER_UPDATE_BTN: By.css("#filterSet button.update"),
  X_AXIS_FILTER_UPDATE_BTN: By.css("#xAxisFilters button.update"),
  Y_AXIS_FILTER_UPDATE_BTN: By.css("#yAxisFilters button.update"),
  X_AXIS_FILTER_EXPANDER_BTN: By.xpath(".//div[@id='xAxisFilters']/div/div/div/a/i[contains(@class,'filter-set-expand')]"),
  Y_AXIS_FILTER_EXPANDER_BTN: By.xpath(".//div[@id='yAxisFilters']/div/div/div/a/i[contains(@class,'filter-set-expand')]"),
  SCATTER_PLOT_LOGO_ICON: By.css('svg.svgchart > g.root > g.data > g > image'),
  DISPLAY_TREND_LINE_CHECKBOX: By.xpath(".//span[@class='checkbox']/label/input[@class='toggle']"),
  
  /****************************************************************************
  ** Functions
  *****************************************************************************/
  changeXStat: function(xStat) {
    return this.changeDropdown(this.X_STAT_SELECT, this.DROPDOWN_INPUT, xStat);
  },
  changeYStat: function(yStat) {
    return this.changeDropdown(this.Y_STAT_SELECT, this.DROPDOWN_INPUT, yStat);
  },
  addGlobalFilter: function(filter) {
    return this.changeDropdown(this.GLOBAL_FILTER_SELECT, this.DROPDOWN_INPUT, filter);
  },
  addXFilter: function(filter) {
    return this.changeDropdown(this.X_AXIS_FILTER_SELECT, this.DROPDOWN_INPUT, filter);
  },
  addYFilter: function(filter) {
    return this.changeDropdown(this.Y_AXIS_FILTER_SELECT, this.DROPDOWN_INPUT, filter);
  },
  removeGlobalFilter: function(filterNum) {
    var locator = By.xpath(`.//div[@id='filterSet']/div/div/div/div[${filterNum}]/div/span[contains(@class,'closer')]`);
    return this.removeFilter(locator, this.GLOBAL_FILTER_UPDATE_BTN);
  },
  removeXFilter: function(filterNum) {
    var locator = By.xpath(`.//div[@id='xAxisFilters']/div/div/div/div[${filterNum}]/div/span[contains(@class,'closer')]`);
    return this.removeFilter(locator, this.X_AXIS_FILTER_UPDATE_BTN);
  },
  removeYFilter: function(filterNum) {
    var locator = By.xpath(`.//div[@id='yAxisFilters']/div/div/div/div[${filterNum}]/div/span[contains(@class,'closer')]`);
    return this.removeFilter(locator, this.Y_AXIS_FILTER_UPDATE_BTN);
  },
  openXAxisFilterContainer: function() {
    return this.click(this.X_AXIS_FILTER_EXPANDER_BTN);
  },
  openYAxisFilterContainer: function() {
    return this.click(this.Y_AXIS_FILTER_EXPANDER_BTN);
  },
  getPlotLogoIconCount: function() {
    return this.getElementCount(this.SCATTER_PLOT_LOGO_ICON);
  },
  toggleDisplayTrendLine: function(select) {
    var d = Promise.defer();
    var thiz = this;
    
    var element = this.driver.findElement(this.DISPLAY_TREND_LINE_CHECKBOX);
    element.isSelected().then(function(selected) {
      if (selected != select) {
        d.fulfill(thiz.click(thiz.DISPLAY_TREND_LINE_CHECKBOX));
      } else {
        d.fulfill(false);
      }
    });
    return d.promise;
  },
  isTrendLineVisible: function() {
    var locator = By.css("g line[stroke='#ff0000']");
    return this.isDisplayed(locator, 2000);

  }
}

module.exports = ScatterPlot;