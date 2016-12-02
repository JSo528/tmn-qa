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
  BY_INNING_TAB: By.xpath(".//div[@id='reportTabsSection0']/.//li[1]/a"),
  FLAT_VIEW_TAB: By.xpath(".//div[@id='reportTabsSection0']/.//li[2]/a"),

  // Video Modal
  VIDEO_PLAYLIST_MODAL: By.css('.in .videoModal'),
  VIDEO_PLAYLIST_CLOSE_BTN: By.css(".in .videoModal .modal-footer button"),

  // PlayByPlay Modal
  PLAY_BY_PLAY_MODAL: By.css(".in .modal-bb-pitch-by-pitch"),
  PLAY_BY_PLAY_CLOSE_BTN: By.css(".in .modal-bb-pitch-by-pitch .modal-footer button"),
  
  // SimiliarPlays Modal
  SIMILIAR_PLAYS_CLOSE_BTN: By.css(".in .find-similar-modal .modal-footer button"),
  SIMILIAR_PLAYS_TABLE: By.css(".in .find-similar-modal table"),
  
  // PitchVisuals Modal
  PITCH_VISUALS_MODAL: By.css(".in .modal-bb-pitch-by-pitch"),
  PITCH_VISUALS_CLOSE_BTN: By.css(".modal.in .modal-bb-pitch-by-pitch > .modal-content > .modal-footer button"),
  PITCH_VISUALS_BG_IMAGE: By.css(".in .modal-bb-pitch-by-pitch #heatmapBg"),
  PITCH_VISUALS_PITCH_CIRCLE: By.css('.in .modal-bb-pitch-by-pitch circle.heat-map-ball'),
  
  /****************************************************************************
  ** Functions
  *****************************************************************************/
  
  // Controls
  clickByInningTab: function() {
    this.click(this.BY_INNING_TAB);  
    return this.waitUntilStaleness(this.LOADING_CONTAINER);
  },
  clickFlatViewTab: function() {
    this.click(this.FLAT_VIEW_TAB);  
    return this.waitUntilStaleness(this.LOADING_CONTAINER);
  },
  
  // Playlist ByInning Table/Modal
  getInningHeaderText: function(topOrBottom, inning) {
    var addRow = (topOrBottom == "bottom") ? 2 : 1;
    var row = inning * 2 - 2 + addRow;
    
    var locator = By.xpath(`.//table/tbody/tr[@class='sectionHeader sectionInning'][${row}]/td`);
    return this.getText(locator, 20000);
  },
  getMatchupsAtBatHeaderText: function(atBatNum) {
    var locator = By.xpath(`.//table/tbody/tr[@class='sectionHeaderAlt sectionStartOfBat'][${atBatNum}]/td`);
    return this.getText(locator, 30000);
  },
  getMatchupsPitchText: function(pitchNum, col) {
    var locator = By.xpath(`.//table/tbody/tr[contains(@data-tmn-row-type,'row')][${pitchNum}]/td[${col}]`);
    return this.getText(locator);
  },
  getMatchupsAtBatFooterText: function(atBatNum) {
  var locator = By.xpath(`.//table/tbody/tr[@class='sectionHeaderAlt sectionEndOfBat'][${atBatNum}]/td`);
  return this.getText(locator);
  },
  isPlayByPlayModalDisplayed: function() {
    return this.isDisplayed(this.PLAY_BY_PLAY_MODAL, 2000);
  },
  closePlayByPlaytModal: function() {
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
  getFlatViewPitchText: function(rowNum, col) {
    var locator = By.xpath(`.//table/tbody/tr[${rowNum}]/td[${col}]`);
    return this.getText(locator, 30000);
  },

  // Video Modal
  clickPitchVideoIcon: function(pitchNum) {
    var locator = By.xpath(`.//table/tbody/tr[contains(@data-tmn-row-type,'row')][${pitchNum}]/td[1]/tmn-video-icon/paper-icon-button/iron-icon`);
    return this.click(locator);
  },  
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
    var locator = By.xpath(`.//div[contains(@class, 'playlistItems')]/div[@class='list-group']/a[${videoNum}]/.//div[contains(@class,'tmn-play-summary-baseball')]/div[${lineNum}]`);
    return this.getText(locator);
  },
  isVideoModalDisplayed: function() {
    return this.isDisplayed(this.VIDEO_PLAYLIST_MODAL, 2000);
  },

  // SimilarPlays Modal
  clickSimiliarPlaysIcon: function(pitchNum) {
    var locator = By.xpath(`.//table/tbody/tr[contains(@data-tmn-row-type,'row')][${pitchNum}]/td[1]/i[contains(@class, 'statcastFindSimIcon')]`);
    this.click(locator);
    return this.waitForEnabled(this.SIMILIAR_PLAYS_TABLE);
  },    
  getSimiliarPlaysHeader: function() {
    var locator = By.css('#tableBaseballFindSimilarModalId .modal-header h4.modal-title');
    return this.getText(locator);
  },
  getSimiliarPlaysTableStat: function(row, col) {
    row = row + 1;
    var locator = By.xpath(`.//div[@id='tableBaseballFindSimilarModalContainer']/table/tbody/tr[${row}]/td[${col}]`);
    return this.getText(locator);
  },
  closeSimiliarPlaysModal: function() {
    var d = Promise.defer();
    var thiz = this;

    this.driver.wait(Until.elementLocated(this.SIMILIAR_PLAYS_CLOSE_BTN),1000).then(function() {
      d.fulfill(thiz.click(thiz.SIMILIAR_PLAYS_CLOSE_BTN, 10000));
    }, function(err) {
      console.log(err)
      d.fulfill(false)
    })

    return d.promise;    
  },

  // PitchVisuals Modal
  clickPitchVisualsIcon: function(atBatNum) {
    var locator = By.xpath(`.//table/tbody/tr[@class='sectionHeaderAlt sectionStartOfBat'][${atBatNum}]/td/span[contains(@class,'table-action-visual')]`);
    return this.click(locator);
  },  
  getPitchVisualsBgImageHref: function() {
    this.driver.wait(Until.elementLocated(this.PITCH_VISUALS_MODAL, 30000));
    return this.getAttribute(this.PITCH_VISUALS_BG_IMAGE, 'href');
  },

  getPitchVisualsPitchCount: function() {
    this.driver.wait(Until.elementLocated(this.PITCH_VISUALS_MODAL, 30000));
    return this.getElementCount(this.PITCH_VISUALS_PITCH_CIRCLE);
  },

  closePitchVisualsModal: function() {
    var d = Promise.defer();
    var thiz = this;

    this.driver.wait(Until.elementLocated(this.PITCH_VISUALS_CLOSE_BTN),1000).then(function() {
      d.fulfill(thiz.click(thiz.PITCH_VISUALS_CLOSE_BTN, 10000));
    }, function(err) {
      console.log(err)
      d.fulfill(false)
    })

    return d.promise;
  },  
}

module.exports = VideoPlaylist;