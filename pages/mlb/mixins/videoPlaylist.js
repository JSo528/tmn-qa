// PlayByPlay Modal
// SimilarPlays Modal
// PitchVisuals Modal
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
  SAME_POSITION_CHECKBOX: By.id('samePos'),
  SAME_STADIUM_CHECKBOX: By.id('sameVenue'),
  INCLUDE_WALL_CHECKBOX: By.id('includeWall'),
  SIMILAR_PLAYS_HEADER: By.css('#tableBaseballFindSimilarModalId .modal-header h4.modal-title'),

  // SimiliarPlays PitchVideo Modal
  SIMILIAR_PLAYS_PITCH_VIDEO_HEADER: By.css('#videoModaltableBaseballFindSimilarModalModal .modal-header'),
  SIMILIAR_PLAYS_PITCH_VIDEO_CLOSE_BTN: By.css('#videoModaltableBaseballFindSimilarModalModal .modal-footer button'),

  // SimiliarPlays HitChart
  SIMILIAR_PLAYS_HIT_CHART_PLOT_POINT: By.css('#tableBaseballFindSimilarModalId #similarHitChart circle.plotPoint'),
  SIMILIAR_PLAYS_TOOLTIP_PITCH_VIDEO_ICON: By.css('.modalTooltip i.vidIcon'),
  SIMILIAR_PLAYS_TOOLTIP_PITCH_VIDEO_HEADER: By.css('#videoModalsimilarHitChart .modal-header'),
  SIMILIAR_PLAYS_TOOLTIP_PITCH_VIDEO_CLOSE_BTN: By.css('#videoModalsimilarHitChart .modal-footer button'),

  // PitchVisuals Modal
  DEFAULT_PITCH_VISUALS_MODAL_ID: 'tableBaseballPlayerTeamPitchLogBattingModalModal',
  PITCH_VISUALS_MODAL_ID: function() {
    return this.DEFAULT_PITCH_VISUALS_MODAL_ID;
  },
  PITCH_VISUALS_PITCH_SEQUENCE: function() {
    return By.css(`#${this.PITCH_VISUALS_MODAL_ID()} .modal-bb-pitch-by-pitch #gamePitchSeq`);
  },
  PITCH_VISUALS_HIT_CHART_PLOT_POINT: function() {
    return By.css(`#${this.PITCH_VISUALS_MODAL_ID()} #gameHitChart svg circle.plotPoint`);
  },
  PITCH_VISUALS_MODAL_CLOSE_BTN: function() {
    return By.css(`#${this.PITCH_VISUALS_MODAL_ID()} .modal-bb-pitch-by-pitch > .modal-content > .modal-footer button`);
  },
  PITCH_VISUALS_PITCH: function() {
    return By.css(`#${this.PITCH_VISUALS_MODAL_ID()} .modal-bb-pitch-by-pitch circle.heat-map-ball`);
  },
  PITCH_VISUALS_BG_IMAGE_HREF: function() {
    return By.css(`#${this.PITCH_VISUALS_MODAL_ID()} .modal-bb-pitch-by-pitch #heatmapBg`);
  },


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
  getFlatViewPitchText: function(rowNum, col) {
    var locator = By.xpath(`.//div[not(contains(@class, 'hidden'))]/div/div/div/table/tbody/tr[${rowNum}]/td[${col}]`);
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

  getVideoPlaylistCount: function() {
    var locator = By.xpath(`.//div[@class='row playlistItems']/div/a`);
    return this.getElementCount(locator);
  },
  isVideoModalDisplayed: function() {
    return this.isDisplayed(this.VIDEO_PLAYLIST_MODAL, 2000);
  },

  selectFromPlayVideosDropdown: function(option) {
    var dropdownLocator = By.css('tmn-menu-button.tmn-play-top');
    this.click(dropdownLocator);

    var optionLocator = By.xpath(`.//paper-menu/.//paper-item[text()='${option}']`);
    return this.click(optionLocator);
  },

  // SimilarPlays Modal
  clickSimiliarPlaysIcon: function(pitchNum) {
    var locator = By.xpath(`.//table/tbody/tr[contains(@data-tmn-row-type,'row')][${pitchNum}]/td[1]/i[contains(@class, 'statcastFindSimIcon')]`);
    this.click(locator);
    return this.waitForEnabled(this.SIMILIAR_PLAYS_TABLE);
  },    
  getSimiliarPlaysHeader: function() {
    return this.getText(this.SIMILAR_PLAYS_HEADER);
  },
  getSimiliarPlaysAvgTableStat: function(col) {
    var locator = By.xpath(`.//div[@id='tableBaseballFindSimilarModalContainer']/table/tbody/tr[1]/td[${col}]`);
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
  toggleSamePositionCheckbox: function(select) {
    var d = Promise.defer();
    var thiz = this;
    var element = this.driver.findElement(this.SAME_POSITION_CHECKBOX);
    element.isSelected().then(function(selected) {
      if (selected != select) {
        d.fulfill(thiz.click(thiz.SAME_POSITION_CHECKBOX));
      } else {
        d.fulfill(false);
      }
    });

    return d.promise;
  },
  toggleSameStadiumCheckbox: function(select) {
    var d = Promise.defer();
    var thiz = this;

    var element = this.driver.findElement(this.SAME_STADIUM_CHECKBOX);
    element.isSelected().then(function(selected) {
      if (selected != select) {
        d.fulfill(thiz.click(thiz.SAME_STADIUM_CHECKBOX));
      } else {
        d.fulfill(false);
      }
    });

    return d.promise;
  },
  toggleDistToWallCheckbox: function(select) {
    var d = Promise.defer();
    var thiz = this;

    var element = this.driver.findElement(this.INCLUDE_WALL_CHECKBOX);
    element.isSelected().then(function(selected) {
      if (selected != select) {
        d.fulfill(thiz.click(thiz.INCLUDE_WALL_CHECKBOX));
      } else {
        d.fulfill(false);
      }
    });

    return d.promise;
  },
  clickSimiliarPlaysPitchVideoIcon: function(pitchNum) {
    var row = pitchNum + 1;
    var locator = By.xpath(`.//div[@id='tableBaseballFindSimilarModalId']/.//table/tbody/tr[contains(@data-tmn-row-type,'row')][${row}]/td[1]/tmn-video-icon/paper-icon-button/iron-icon`);
    return this.click(locator);
  },
  getSimiliarPlaysPitchVideoHeader: function() {
    return this.getText(this.SIMILIAR_PLAYS_PITCH_VIDEO_HEADER);
  },
  closeSimilarPlaysPitchVideoModal: function() {
    return this.click(this.SIMILIAR_PLAYS_PITCH_VIDEO_CLOSE_BTN);
  },
  clickSimiliarPlaysHitChartPlotPoint: function() {
    return this.clickOffset(this.SIMILIAR_PLAYS_HIT_CHART_PLOT_POINT, 5, 5);
  },
  clickSimiliarPlaysTooltipPitchVideoIcon: function() {
    return this.click(this.SIMILIAR_PLAYS_TOOLTIP_PITCH_VIDEO_ICON);
  },
  getSimiliarPlaysTooltipPitchVideoHeader: function() {
    return this.getText(this.SIMILIAR_PLAYS_TOOLTIP_PITCH_VIDEO_HEADER);
  },
  closeSimiliarPlaysTooltipPitchVideoModal: function() {
    return this.click(this.SIMILIAR_PLAYS_TOOLTIP_PITCH_VIDEO_CLOSE_BTN);
  },

  // PitchVisuals Modal
  clickPitchVisualsIcon: function(atBatNum) {
    var locator = By.xpath(`.//table/tbody/tr[@class='sectionHeaderAlt sectionStartOfBat'][${atBatNum}]/td/span[contains(@class,'table-action-visual')]`);
    return this.click(locator);
  },  
  getPitchVisualsBgImageHref: function() {
    this.waitForEnabled(this.PITCH_VISUALS_PITCH_SEQUENCE());
    return this.getAttribute(this.PITCH_VISUALS_BG_IMAGE_HREF(), 'href');
  },
  getPitchVisualsPitchCount: function() {
    this.waitForEnabled(this.PITCH_VISUALS_PITCH_SEQUENCE());
    return this.getElementCount(this.PITCH_VISUALS_PITCH());
  },
  clickPitchVisualsHitChartPlotPoint: function() {
    return this.click(this.PITCH_VISUALS_HIT_CHART_PLOT_POINT());
  },
  closePitchVisualsModal: function() {
    return this.click(this.PITCH_VISUALS_MODAL_CLOSE_BTN());
  },  

  // VideoLibrary
  addAllVideosToNewList: function(listName) {
    var btnLocator = By.css("tmn-playlist-add-all paper-button");
    var optionLocator = By.css("tmn-playlistadditem-menu paper-item:nth-of-type(2)");
    var createNewBtn = By.css("tmn-playlist-add-dialog .iron-selected paper-button");
    var inputLocator = By.css("tmn-playlist-add-dialog input");
    var submitBtnLocator = By.css("tmn-playlist-add-dialog #createBtn");
    var overlayLocator = By.css("iron-overlay-backdrop");
    this.click(btnLocator);
    this.click(optionLocator);
    this.click(createNewBtn);
    this.sendKeys(inputLocator, listName);
    this.click(submitBtnLocator);
    return this.waitUntilStaleness(overlayLocator, 10000);
  },
  addAllVideosToList: function(listName) {
    var btnLocator = By.css("tmn-playlist-add-all paper-button");
    var optionLocator = By.css("tmn-playlistadditem-menu paper-item:nth-of-type(2)");
    var listOptionLocator = By.xpath(`.//tmn-playlist-add-dialog/.//div[contains(@class, 'playlistTitle')][text()='${listName}']`);
    this.click(btnLocator);
    this.click(optionLocator);
    return this.click(listOptionLocator);
  },
  addVideoToNewList: function(videoNum, listName) {
    var addVideoLocator = By.xpath(`.//div[not(contains(@class, 'hidden'))]/div/div/div/table/tbody/tr[contains(@data-tmn-row-type,'row')][${videoNum}]/td[1]/tmn-playlistadditem/paper-icon-button/iron-icon`);
    var optionLocator = By.css("tmn-playlistadditem-menu paper-item:nth-of-type(2)");
    var createNewLocator = By.css("tmn-playlist-add-dialog .iron-selected paper-button");
    var inputLocator = By.css("tmn-playlist-add-dialog input");
    var submitBtnLocator = By.css("tmn-playlist-add-dialog #createBtn");
    this.click(addVideoLocator);
    this.click(optionLocator);
    this.click(createNewLocator);
    this.sendKeys(inputLocator, listName);
    return this.click(submitBtnLocator);
  },
  addVideoToList: function(videoNum, listName) {
    var addVideoLocator = By.xpath(`.//div[not(contains(@class, 'hidden'))]/div/div/div/table/tbody/tr[contains(@data-tmn-row-type,'row')][${videoNum}]/td[1]/tmn-playlistadditem/paper-icon-button/iron-icon`);
    var optionLocator = By.xpath(`.//tmn-callout-menu/div/paper-menu/div/paper-item[text()='${listName}']`)
    this.click(addVideoLocator);
    return this.click(optionLocator);
  },
  pbpRemoveVideoFromList: function(videoNum) {
    var removeVideoLocator = By.xpath(`.//div[not(contains(@class, 'hidden'))]/div/div/div/table/tbody/tr[contains(@data-tmn-row-type,'row')][${videoNum}]/td[1]/tmn-playlistadditem/paper-icon-button/iron-icon`);
    return this.click(removeVideoLocator);
    
  },
  openVideoList: function(listName) {
    var locator = By.xpath(`.//tmn-sidebar-panel/.//paper-item-body/div[contains(@class, 'tmn-playlist-summary')][1][text()='${listName}']`);
    var sidebarPanelLocator = By.css("tmn-sidebar-panel #mainContainer tmn-playlist-summarylist");
    this.click(locator);
    return this.waitUntilStaleness(sidebarPanelLocator, 5000);

  },
  navigateBackToListIndex: function() {
    var locator = By.xpath(".//tmn-playlist-itemlist/.//paper-icon-button[@icon='tmn-icons:arrow-back']/iron-icon");
    return this.click(locator);
  },
  getVideoCountFromList: function() {
    var locator = By.css(".playlistItemContent paper-icon-item");
    return this.getElementCount(locator);
  },
  playVideoFromList: function(videoNum) {
    var locator = By.css(`.playlistItemContent paper-icon-item:nth-of-type(${videoNum}) iron-icon`);
    var modalLocator = By.id('videoModaladaptor');
    return this.click(locator);
  },
  removeVideoFromList: function(videoNum) {
    var locator = By.xpath(`.//div[contains(@class, 'playlistItemContent')]/paper-icon-item/paper-icon-button[${videoNum}]`);
    var sidebarPanelLocator = By.css("tmn-sidebar-panel #mainContainer tmn-playlist-summarylist");
    this.click(locator);
    return this.waitUntilStaleness(sidebarPanelLocator, 5000);
  },
  changeNameOfList: function(listName, newListName) {
    var optionsLocator = By.xpath(`.//paper-icon-item[paper-item-body/div[text()='${listName}']]/paper-icon-button`);
    var renameLocator = By.xpath(`.//paper-icon-item[paper-item-body/div[text()='${listName}']]/.//paper-item[text()='Rename']`);
    var inputLocator = By.xpath(`.//paper-icon-item[paper-item-body/div[text()='${listName}']]/.//tmn-confirmation-dialog/.//input`);
    var submitBtnLocator = By.xpath(`.//paper-icon-item[paper-item-body/div[text()='${listName}']]/.//paper-button[text()='Rename']`);
    this.click(optionsLocator);
    this.click(renameLocator);
    this.clear(inputLocator);
    this.sendKeys(inputLocator, newListName);
    return this.click(submitBtnLocator);
  },
  deleteListFromLibrary: function(listName) {
    var optionsLocator = By.xpath(`.//paper-icon-item[paper-item-body/div[text()='${listName}']]/paper-icon-button`);
    var deleteLocator = By.xpath(`.//paper-icon-item[paper-item-body/div[text()='${listName}']]/.//paper-item[text()='Delete']`);
    var confirmationLocator = By.xpath(".//tmn-playlist-summarylist/.//tmn-confirmation-dialog/paper-dialog[not(contains(@aria-hidden, 'true'))]/.//paper-button[text()='Delete Playlist']");
    var containerLocator = By.css("tmn-sidebar-panel #mainContainer");
    this.click(optionsLocator);
    this.click(deleteLocator);
    this.click(confirmationLocator);
    return this.waitUntilStaleness(containerLocator, 5000);

  },
  openVideoLibrary: function() {
    var locator = By.css("tmn-sidebar #externalToggle iron-icon");
    return this.click(locator);
  },
  closeVideoLibrary: function() {
    var locator = By.xpath(".//tmn-sidebar-panel/.//paper-toolbar/.//paper-icon-button[@icon='icons:close']");
    return this.click(locator);
  },
  listExistsInVideoLibrary: function(listName) {
    var d = Promise.defer();
    var locator = By.css("tmn-sidebar-panel paper-item-body .tmn-playlist-summary:nth-of-type(1)");
    this.getTextArray(locator).then(function(textArray) {
       d.fulfill(textArray.indexOf(listName) != -1);
    });
    return d.promise;
  }
}

module.exports = VideoPlaylist;