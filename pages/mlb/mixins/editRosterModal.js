var By = require('selenium-webdriver').By;
var Promise = require('selenium-webdriver').promise;

EditRosterModal = {
  EDIT_ROSTER_MODAL_BTN: {
    'batters': By.id('editRosterBatters'),
    'sp': By.id('editRosterSP'),
    'rp': By.id('editRosterRP'),
    'pitchers': By.id('editRosterPitchers')
  },
  EDIT_ROSTER_MODAL_ID: {
  'batters': 'tableBaseballRosterBattersModal',
  'sp': 'tableBaseballRosterSPModal',
  'rp': 'tableBaseballRosterRPModal',
  'pitchers': 'tableBaseballRosterPitchersModal',
  },
  EDIT_ROSTER_MODAL_TABLE_ID: {
    'batters': 'tableBaseballRosterBattersContainer',
    'sp': 'tableBaseballRosterSPContainer',
    'rp': 'tableBaseballRosterRPContainer',
    'pitchers': 'tableBaseballRosterPitchersContainer'
  },
  EDIT_ROSTER_MODAL_SEARCH_INPUT: {
    'batters': By.css('#tableBaseballRosterBattersRosterSearch input'),
    'sp': By.css('#tableBaseballRosterSPRosterSearch input'),
    'rp': By.css('#tableBaseballRosterRPRosterSearch input'),
    'pitchers': By.css('#tableBaseballRosterPitchersRosterSearch input'),
  },

  clickEditRosterBtn: function(modalType) {
    var thiz = this;
    var d = Promise.defer()
    this.modalType = modalType;
    this.waitForEnabled(this.EDIT_ROSTER_MODAL_BTN[this.modalType]);
    this.click(this.EDIT_ROSTER_MODAL_BTN[this.modalType]);

    // often times the button won't be ready to click yet and the modal won't show
    this.waitForEnabled(By.xpath(`.//div[@id='${this.EDIT_ROSTER_MODAL_TABLE_ID[this.modalType]}']/table`), 10000).then(function() {
      d.fulfill(true);
    }, function(err) {
      console.log("** error - clickEditRosterBtn: " + err)
      d.fulfill(thiz.click(thiz.EDIT_ROSTER_MODAL_BTN[thiz.modalType]));
    });

    return d.promise;
  },

  removePlayerFromModal: function(playerNum) {
    var locator = By.xpath(`.//div[@id='${this.EDIT_ROSTER_MODAL_TABLE_ID[this.modalType]}']/table/tbody/tr[${playerNum}]/td[1]/span`);
    return this.clickOffset(locator, 5, 5);
  },

  getModalTableStat: function(playerNum, col) {
    var locator = By.xpath(`.//div[@id='${this.EDIT_ROSTER_MODAL_TABLE_ID[this.modalType]}']/table/tbody/tr[${playerNum}]/td[${col}]`);
    return this.getText(locator);
  },

  selectForAddPlayerSearch: function(name) {
    return this.selectFromSearch(this.EDIT_ROSTER_MODAL_SEARCH_INPUT[this.modalType], name, 1);
  },

  selectDefaultRoster: function() {
    var locator = By.xpath(`.//div[@id='${this.EDIT_ROSTER_MODAL_ID[this.modalType]}']/.//div[@class='modal-footer']/button[1]`);
    return this.click(locator);
  },

  closeModal: function() {
    var locator = By.xpath(`.//div[@id='${this.EDIT_ROSTER_MODAL_ID[this.modalType]}']/.//div[@class='modal-footer']/button[2]`);
    return this.click(locator);
  }
};

module.exports = EditRosterModal;