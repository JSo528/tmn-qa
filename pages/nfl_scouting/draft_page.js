'use strict';

// Load Base Page
var BasePage = require('../../pages/base/base_page.js')

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;

/****************************************************************************
** Locators
*****************************************************************************/
var DRAFT_CARD_ROWS = By.css('.draft-card');

/****************************************************************************
** Constructor
*****************************************************************************/
function DraftPage(driver) {
  BasePage.call(this, driver)
};

DraftPage.prototype = Object.create(BasePage.prototype);
DraftPage.prototype.constructor = DraftPage;

/****************************************************************************
** Functions
*****************************************************************************/
DraftPage.prototype.getCardCount = function() {
  return this.getElementCount(DRAFT_CARD_ROWS);
};

DraftPage.prototype.getValueGrade = function(cardNum) {
  var locator = By.xpath(`.//div[contains(@class, 'draft-card')][${cardNum}]/.//div[@class='value grade']`);
  return this.getText(locator)
};

module.exports = DraftPage;