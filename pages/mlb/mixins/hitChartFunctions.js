var By = require('selenium-webdriver').By;
var Promise = require('selenium-webdriver').promise;
var Until = require('selenium-webdriver').until;

/****************************************************************************
** Locators
*****************************************************************************/
var DEFAULT_HIT_CHART_ID = 'hitChart';
var HIT_CHART_SETTINGS_SAVE_AND_CLOSE_BTN = By.css('#hitChartModalContainer .modal-footer button:nth-of-type(1)');
var HIT_CHART_SETTINGS_BTN = By.css('#hitChart image.settingsButton');
var HIT_CHART_SETTINGS_CLOSE_BTN = By.css('#hitChartModalContainer .modal-footer button:nth-of-type(2)');

var HIT_CHART_TOOLTIP_PITCH_VIDEO_ICON = By.css('.plotTooltip i.vidIcon');
var HIT_CHART_TOOLTIP_PITCH_VIDEO_HEADER = By.css('#videoModalhitChart .modal-header');
var HIT_CHART_TOOLTIP_PITCH_VIDEO_CLOSE_BTN = By.css('#videoModalhitChart .modal-footer button');

function HitChartFunctions() {
  /****************************************************************************
  ** Private Functions
  *****************************************************************************/
  function hitChart(hitChartID) {
    return By.css(`#${hitChartID} > svg`);
  }

  function hitChartHitType(hitChartID, hitType) {
    var hitType = hitType || 'all'
    var hitTypeLocators = {
      'single': By.css(`#${hitChartID} > svg > circle.plotPoint[fill="rgba(255,255,255,1)"]`),
      'double': By.css(`#${hitChartID} > svg > circle.plotPoint[fill="rgba(0,0,255,1)"]`),
      'triple': By.css(`#${hitChartID} > svg > circle.plotPoint[fill="rgba(128,0,128,1)"]`),
      'homeRun': By.css(`#${hitChartID} > svg > circle.plotPoint[fill="rgba(255,0,0,1)"]`),
      'roe': By.css(`#${hitChartID} > svg > circle.plotPoint[fill="rgba(255,255,0,1)"]`),
      'out': By.css(`#${hitChartID} > svg > circle.plotPoint[fill="rgba(128,128,128,1)"]`),
      'all': By.css(`#${hitChartID} > svg > circle.plotPoint`)
    };

    return hitTypeLocators[hitType];
  }

  function hitChartPlotPoint(hitChartID) {
    return By.css(`#${hitChartID} > svg > circle.plotPoint`);
  }

  function hitChartSettingsBtn(hitChartID) {
    return By.css(`#${hitChartID} image.settingsButton`);
  }

  /****************************************************************************
  ** Public Functions
  *****************************************************************************/
  function getHitChartHitCount(hitType, hitChartID) {  
    var d = Promise.defer();

    var hitChartID = hitChartID || DEFAULT_HIT_CHART_ID;
    var hitTypeLocator = hitChartHitType(hitChartID, hitType);
    this.waitForEnabled(hitChart(hitChartID));

    this.getElementCount(hitTypeLocator).then(function(count) {
      d.fulfill(count);
    });

    return d.promise;
  }
  
  function clickHitChartPlotPoint(hitChartID) {
    var hitChartID = hitChartID || DEFAULT_HIT_CHART_ID;
    return this.clickOffset(hitChartPlotPoint(hitChartID), 5, 5);
  }

  // HitChart Settings
  function clickSettingsBtn(hitChartID) {
    var hitChartID = hitChartID || DEFAULT_HIT_CHART_ID;
    return this.click(hitChartSettingsBtn(hitChartID));
  }

  function toggleSettingsOption(option, select) {
    var d = Promise.defer();
    var thiz = this;
    var locator = By.xpath(`.//div[@id='hitChartModalContainer']/.//div[@class='modal-body']/div/div/div/div/div[contains(text(),'${option}')]/input`);
    var element = this.driver.findElement(locator);
    element.isSelected().then(function(selected) {
      if (selected != select) {
        d.fulfill(thiz.click(locator));
      } else {
        d.fulfill(false);
      }
    });
  }

  function saveAndCloseSettingsModal() {
    return this.click(HIT_CHART_SETTINGS_SAVE_AND_CLOSE_BTN);
  }

  function closeSettingsModal() {
    return this.click(HIT_CHART_SETTINGS_CLOSE_BTN);
  }

  // Tooltip
  function clickHitChartTooltipPitchVideoIcon() {
    return this.click(HIT_CHART_TOOLTIP_PITCH_VIDEO_ICON);
  }
  
  function getHitChartTooltipPitchVideoHeader() {
    return this.getText(HIT_CHART_TOOLTIP_PITCH_VIDEO_HEADER);
  }
  
  function closeHitChartTooltipPitchVideoModal() {
    return this.click(HIT_CHART_TOOLTIP_PITCH_VIDEO_CLOSE_BTN);
  }

  // HeatMap
  function drawBoxOnHeatMap(x, y, width, height, heatMapID, hitChartLocator) {
    var heatMapLocator = By.css(`#${heatMapID} > svg`);
    var heatMapImageLocator = By.css(`#${heatMapID} #heatmapBg`);
    
    var element = driver.findElement(heatMapLocator);
    driver.actions()
      .mouseMove(element, {x: x, y: y}) // start at (x,y)
      .mouseDown() // click down
      .mouseMove({x: width, y: height}) // move mouse width to the right and height downwards
      .mouseUp() // click up
      .perform();

    this.waitUntilStaleness(heatMapImageLocator, 10000);
    if (hitChartLocator) {
      this.waitUntilStaleness(hitChartLocator, 10000);
    }
    return this.waitForEnabled(heatMapImageLocator)
  };

  // not really a good way to signify which x to clear, so general function to clear all boxes
  function clearHeatMap(heatMapID, hitChartID) {
    var locator = By.css(`#${heatMapID} > svg > text`);

    var hitChartID = hitChartID || DEFAULT_HIT_CHART_ID;
    var hitChartLocator = By.id(hitChartID);

    this.driver.findElements(locator).then(function(elements) {
      for(var i=0; i < elements.length; i++) {
        elements[i].click();
      }
    })

    this.waitUntilStaleness(hitChartLocator, 10000);
    this.waitUntilStaleness(hitChartLocator, 10000); // becomes stale twice
    return this.waitForEnabled(hitChartLocator)
  };

  function getHeatMapPitchCount(heatMapID) {
    var d = Promise.defer();

    var locator = By.css(`#${heatMapID} circle.heat-map-ball`);
    this.waitForEnabled(locator);

    this.getElementCount(locator).then(function(count) {
      d.fulfill(count/2); // 2 circles per pitch
    });

    return d.promise;
  };

  function getHeatMapImageTitle(heatMapID) {
    var heatMapImageLocator = By.css(`#${heatMapID} #heatmapBg`);

    var d = Promise.defer();

    this.getAttribute(heatMapImageLocator, 'href').then(function(href) {
      // get the title from the image href
      d.fulfill(href.match(/(%5B).{2,20}(%5D.+from)/)[0].replace(/(%5B|%5D.+|%7C.+)/g, '').replace(/(%25)/g, '%'));
    });

    return d.promise;
  };

  // PitchView
  function getPitchViewPitchCount(pitchChartID) {
    var d = Promise.defer();

    var locator = By.css(`#${pitchChartID} circle.pitch-chart-ball`);
    var pitchViewLocator = By.id(pitchChartID);
    
    this.waitForEnabled(pitchViewLocator);
    this.getElementCount(locator).then(function(count) {
      d.fulfill(count/2); // 2 circles per pitch
    });

    return d.promise;
  };

  function clickPitchViewPlotPoint(pitchViewID) {
    var locator = By.css(`#${pitchViewID} circle.pitch-chart-ball`);
    return this.clickOffset(locator, 5, 5);
  };

  return {
    getHitChartHitCount: getHitChartHitCount,
    clickHitChartPlotPoint: clickHitChartPlotPoint,
    clickSettingsBtn: clickSettingsBtn,
    toggleSettingsOption: toggleSettingsOption,
    saveAndCloseSettingsModal: saveAndCloseSettingsModal,
    closeSettingsModal: closeSettingsModal,
    clickHitChartTooltipPitchVideoIcon: clickHitChartTooltipPitchVideoIcon,
    getHitChartTooltipPitchVideoHeader: getHitChartTooltipPitchVideoHeader,
    closeHitChartTooltipPitchVideoModal: closeHitChartTooltipPitchVideoModal,
    drawBoxOnHeatMap: drawBoxOnHeatMap,
    clearHeatMap: clearHeatMap,
    getHeatMapPitchCount: getHeatMapPitchCount,
    getHeatMapImageTitle: getHeatMapImageTitle,
    getPitchViewPitchCount: getPitchViewPitchCount,
    clickPitchViewPlotPoint: clickPitchViewPlotPoint
  }
}

module.exports = HitChartFunctions;