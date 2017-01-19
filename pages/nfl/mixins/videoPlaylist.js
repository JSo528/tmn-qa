// PlayByPlay Modal
// Video Modal

var By = require('selenium-webdriver').By;
var Promise = require('selenium-webdriver').promise;
var Until = require('selenium-webdriver').until;

VideoPlaylist = {

  /****************************************************************************
  ** Locators
  *****************************************************************************/
  
  // General
  LOADING_CONTAINER: By.id('loadingContainer'),
  
  // Controls
  BY_POSSESSION_TAB: By.xpath(".//div[@id='reportTabsSection0']/.//li[1]/a"),
  FLAT_VIEW_TAB: By.xpath(".//div[@id='reportTabsSection0']/.//li[2]/a"),

  // Video Modal
  VIDEO_PLAYLIST_MODAL: By.css('.in .videoModal'),
  VIDEO_PLAYLIST_CLOSE_BTN: By.css(".in .videoModal .modal-footer button"),

  // PlayByPlay Modal
  PLAY_BY_PLAY_MODAL: By.css(".in .modal-bb-pitch-by-pitch"),
  PLAY_BY_PLAY_CLOSE_BTN: By.css(".in .modal-bb-pitch-by-pitch .modal-footer button"),

  /****************************************************************************
  ** Functions
  *****************************************************************************/
  // Controls
  clickByPossessionTab: function() {
    return this.click(this.BY_POSSESSION_TAB);  
  },
  clickFlatViewTab: function() {
    return this.click(this.FLAT_VIEW_TAB);  
  },
  
  // Playlist ByPossession Table/Modal
  getPossessionHeaderText: function(posNum) {
    var row = posNum * 2 - 1;
    var locator = By.xpath(`.//table/tbody/tr[@class='sectionHeaderAlt'][${row}]/td[1]`);
    return this.getText(locator, 20000);
  },
  getPossessionPlayText: function(playNum, colNum) {
    var locator = By.xpath(`.//div[@id='${this.BY_POSSESSION_ID}']/table/tbody/tr[@data-tmn-row-type='row'][${playNum}]/td[${colNum}]`);
    return this.getText(locator);
  },
  getPosessionFooterText: function(posNum) {
    var row = posNum * 2 ;
    var locator = By.xpath(`.//table/tbody/tr[@class='sectionHeaderAlt'][${row}]/td[1]`);
    return this.getText(locator);
  },
  clickByPossessionPlayVideoIcon: function(playNum) {
    var locator = By.xpath(`.//div[@id='${this.BY_POSSESSION_ID}']/table/tbody/tr[@data-tmn-row-type='row'][${playNum}]/td/tmn-video-icon`);
    return this.click(locator);
  },
  isPlayByPlayModalDisplayed: function() {
    return this.isDisplayed(this.PLAY_BY_PLAY_MODAL, 2000);
  },
  closePlayByPlayModal: function() {
    var d = Promise.defer();
    var thiz = this;

    this.driver.wait(Until.elementLocated(this.PLAY_BY_PLAY_CLOSE_BTN),1000).then(function() {
      d.fulfill(thiz.click(thiz.PLAY_BY_PLAY_CLOSE_BTN, 10000));
    }, function(err) {
      console.log(err)
      d.fulfill(false)
    })

    return d.promise;       
  },  
  // Flat View
  getFlatViewPlayText: function(playNum, colNum) {
    var locator = By.xpath(`.//div[@id='${this.FLAT_VIEW_ID}']/table/tbody/tr[@data-tmn-row-type='row'][${playNum}]/td[${colNum}]`);
    return this.getText(locator);
  },
  // Video Modal
  closeVideoPlaylistModal: function() {
    var d = Promise.defer();
    var thiz = this;

    this.driver.wait(Until.elementLocated(this.VIDEO_PLAYLIST_CLOSE_BTN),1000).then(function() {
      d.fulfill(thiz.click(thiz.VIDEO_PLAYLIST_CLOSE_BTN, 10000));
    }, function(err) {
      console.log(err)
      d.fulfill(false)
    })

    return d.promise;
  },
  getVideoPlaylistText: function(videoNum, lineNum) {
    var locator = By.xpath(`.//div[contains(@class, 'playlistItems')]/div[@class='list-group']/a[${videoNum}]/.//div[contains(@class,'tmn-play-summary-football')]/div[${lineNum}]`);
    return this.getText(locator);
  },

  getVideoPlaylistCount: function() {
    var locator = By.xpath(`.//div[@class='row playlistItems']/div/a`);
    return this.getElementCount(locator);
  },
  isVideoModalDisplayed: function() {
    return this.isDisplayed(this.VIDEO_PLAYLIST_MODAL, 2000);
  },

  selectFromPlayVideosDropdown: function(option) {
    var dropdownLocator = By.css('paper-button.tmn-progress-button')
    this.click(dropdownLocator);

    var optionLocator = By.xpath(`.//paper-menu/.//paper-item[text()='${option}']`);
    return this.click(optionLocator);
  }
}

module.exports = VideoPlaylist;