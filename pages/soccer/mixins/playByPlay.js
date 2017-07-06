var By = require('selenium-webdriver').By;
var Promise = require('selenium-webdriver').promise;
var Until = require('selenium-webdriver').until;
var Key = require('selenium-webdriver').Key;

PlayByPlay = {
  /****************************************************************************
  ** Locators
  *****************************************************************************/
  DEFAULT_MODAL_TAG: 'body',
  MODAL_TAG: function() {
    if (this.PLAY_BY_PLAY_MODAL_TAG && this.tabName) {
      return this.PLAY_BY_PLAY_MODAL_TAG[this.tabName];
    } else {
      return this.DEFAULT_MODAL_TAG;
    }
  },
  /****************************************************************************
  ** Functions
  *****************************************************************************/
  // Play By Play Modal
  getPlayByPlayModalTableStatFor: function(rowNum, colName) {
    var locator = By.xpath(`.//${this.MODAL_TAG()}/.//tmn-table[contains(@class,'tmn-play-by-play-modal')]/table/tbody/tr[not(@is='tmn-table-tr-section')][${rowNum}]/td[count(//${this.MODAL_TAG()}/.//tmn-table[contains(@class,'tmn-play-by-play-modal')]/table/thead/tr/th[@data-col-key="${colName}"]/preceding-sibling::th)+1]`);
    return this.getText(locator);
  },
  closePlayByPlayModal: function() {
    var locator = By.xpath(`.//${this.MODAL_TAG()}/.//tmn-play-by-play-modal/tmn-modal/.//button[contains(text(),'Close')]`);
    this.click(locator);
    return this.driver.sleep(100);
  },
  isPlayByPlayModalDisplayed: function() {
    var locator = By.xpath(`.//${this.MODAL_TAG()}/.//tmn-play-by-play-modal/tmn-modal/paper-dialog`);
    return this.isDisplayed(locator, 100);
  },

  // Play Possession Modal
  clickPlayPossessionIcon: function(playNum) {
    var locator = By.xpath(`.//${this.MODAL_TAG()}/.//tmn-table[contains(@class,'tmn-play-by-play-modal')]/table/tbody/tr[not(@is='tmn-table-tr-section')][${playNum}]/td/tmn-table-action-column/span[contains(@class, 'fa-external-link-square')][2]`);
    return this.click(locator);
  },
  isPlayPossessionModalDisplayed: function() {
    var locator = By.xpath(`.//${this.MODAL_TAG()}/.//tmn-pass-sequence-modal/tmn-modal/paper-dialog`);
    return this.isDisplayed(locator, 500);
  },
  getPlayPossessionTableStatFor: function(rowNum, colName) {
    var locator = By.xpath(`.//${this.MODAL_TAG()}/.//tmn-table[contains(@class,'tmn-pass-sequence-modal')]/table/tbody/tr[@data-tmn-row-i][${rowNum}]/td[count(//${this.MODAL_TAG()}/.//tmn-table[contains(@class,'tmn-pass-sequence-modal')]/table/thead/tr/th[@data-col-key="${colName}"]/preceding-sibling::th)+1]`);
    return this.getText(locator);
  },
  getPlayPossessionTablePlayCount: function() {
    var locator = By.xpath(`.//${this.MODAL_TAG()}/.//tmn-table[contains(@class,'tmn-pass-sequence-modal')]/table/tbody/tr[@data-tmn-row-i]`);
    return this.getElementCount(locator);
  },
  getPlayPossessionVisualPlayCount: function() {
    var locator = By.css(`${this.MODAL_TAG()} g > g.marks > g.tmn-pass-sequence`);
    return this.getElementCount(locator);
  },
  hoverOverPlayPossessionPlay: function(playNum) {
    var thiz = this;
    var locator = By.css(`${this.MODAL_TAG()} g > g.marks > g.tmn-pass-sequence:nth-of-type(${playNum})`);
    this.driver.findElement(locator).then(function(elem) {
      thiz.driver.actions().mouseMove(elem).perform();
      thiz.driver.sleep(5000);
    });
  },
  getPlayPossessionVisualDescription: function() {
    var locator = By.css(`${this.MODAL_TAG()} g.marks > text:nth-of-type(2)`);
    return this.getText(locator);
  },
  getPlayPossessionTableStatBgColor: function(rowNum) {
    var locator = By.xpath(`.//${this.MODAL_TAG()}/.//tmn-table[contains(@class,'tmn-pass-sequence-modal')]/table/tbody/tr[@data-tmn-row-i][${rowNum}]`);
    return this.getCssValue(locator, 'background-color');
  },
  changePlayPossessionCropSlider: function(xOffset) {
    var locator = By.css(`${this.MODAL_TAG()} div.slider.ui-slider`);
    var tableLocator = By.xpath(`.//${this.MODAL_TAG()}/.//tmn-table[contains(@class,'tmn-pass-sequence-modal')]/table`);
    this.clickOffset(locator, xOffset, 0)
    return this.waitUntilStaleness(tableLocator, 5000);
  },
  clickPlayPossessionExportButton: function() {
    var locator = By.css(`${this.MODAL_TAG()} tmn-modal.tmn-pass-sequence-modal .modal-footer button:nth-of-type(1)`);
    return this.click(locator);
  },
  isPlayPossessionExportModalDisplayed: function() {
    var locator = By.css("div.modal.export-modal");
    return this.isDisplayed(locator, 500);
  },
  clickPlayPossessionExportCloseButton: function() {
    var locator = By.css("div.modal.export-modal button.close");
    return this.click(locator);
  },

  // Video Player
  clickPlayVideoIcon: function(playNum) {
    var d = Promise.defer();
    var locator = By.xpath(`.//${this.MODAL_TAG()}/.//tmn-table[contains(@class,'tmn-play-by-play-modal')]/table/tbody/tr[not(@is='tmn-table-tr-section')][${playNum}]/td/tmn-table-action-column/span/tmn-video-icon/paper-icon-button/iron-icon`);
    var bodyLocator = By.css('sp-root');
    this.click(locator);
    browser.setTabHandles().then(function() {
      browser.switchToTab(1)
      d.fulfill(this.waitForEnabled(bodyLocator));
    }.bind(this))
    return d.promise;
  },
  getVideoPlayerFixtureInfoHomeTeam: function(playNum) {
    var locator = By.xpath(`.//sp-playlist/div/div/div[${playNum}]/sp-playlist-item/div/div/span[@class='fixture-info']/span[@class='home-team']`);
    return this.getText(locator);
  },
  getVideoPlayerFixtureInfoAwayTeam: function(playNum) {
    var locator = By.xpath(`.//sp-playlist/div/div/div[${playNum}]/sp-playlist-item/div/div/span[@class='fixture-info']/span[@class='away-team']`);
    return this.getText(locator);
  },
  getVideoPlayerFixtureInfoScore: function(playNum) {
    var locator = By.xpath(`.//sp-playlist/div/div/div[${playNum}]/sp-playlist-item/div/div/span[@class='fixture-info']/span[@class='score']`);
    return this.getText(locator);
  },
  getVideoPlayerEventTimes: function(playNum) {
    var locator = By.xpath(`.//sp-playlist/div/div/div[${playNum}]/sp-playlist-item/div/div[@class='event-times']/s7-display-time`);
    return this.getText(locator);
  },
  closeVideoPlayerWindow: function() {
    browser.driver.close();
    browser.setTabHandles();
    return browser.switchToTab(0);
  }
}

module.exports = PlayByPlay;