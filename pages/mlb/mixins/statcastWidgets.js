var By = require('selenium-webdriver').By;
var Promise = require('selenium-webdriver').promise;

// Locators
var STATCAST_FIELDING_BALL = By.css("statcast-fielding-chart g.plays g.play");
var STATCAST_FIELDING_CHART = By.css('statcast-fielding-chart > svg > g');
var BINNED_BOXES_RECTANGLE = By.css('tmn-binned-events-chart-flat > div > svg > g > g.point');
var BINNED_BOXES_OUTS_ADDED_TEXT = By.css('tmn-binned-events-chart-flat > div > svg > g > g.total > text:nth-of-type(1)');
var OUT_PROBS = [.01, .1, .2, .3, .4, .5, .6, .7, .8, .9, .99, 1];
StatcastWidgets = {
  // statcast fielding widget
  getStatcastFieldingBallCount: function() {
    return this.getElementCount(STATCAST_FIELDING_BALL);
  },
  clickStatcastFieldingZoomBtn: function(btnLabel) {
    var locator = By.xpath(`.//paper-button[@label='${btnLabel}']`)
    return this.click(locator);
  },
  getStatcastFieldingChartTranslation: function() {
    return this.getAttribute(STATCAST_FIELDING_CHART, 'transform');
  },

  // statcast binned boxes
  getBinnedBoxesRectCount: function() {
    return this.getElementCount(BINNED_BOXES_RECTANGLE);
  },
  getBinnedBoxesPlayCountForOutProb: function(outProb) {
    var d = Promise.defer();
    var locator = By.css(`tmn-simple-histogram > div > svg > g > g.bin > text`);
    this.driver.findElements(locator).then(function(elements) {
      var el = elements[OUT_PROBS.indexOf(outProb)];
      d.fulfill(el.getText());
    }.bind(this))
    return d.promise;
  },
  getBinnedBoxesOutsAddedText: function() {
    return this.getText(BINNED_BOXES_OUTS_ADDED_TEXT);
  }
};

module.exports = StatcastWidgets;