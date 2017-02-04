'use strict';

// Load Base Page
var BasePage = require('../../../pages/base/base_page.js')

// Webdriver helpers
var By = require('selenium-webdriver').By;
var Until = require('selenium-webdriver').until;
var Promise = require('selenium-webdriver').promise;
var Key = require('selenium-webdriver').Key

// Mixins
var _ = require('underscore');
var inputs = require('../mixins/inputs.js');

/****************************************************************************
** Locators
*****************************************************************************/
var LAST_LOCATOR = By.xpath(".//div[@inject='content']/.//div[@class='scroll-wrap-x']/table");

/****************************************************************************
** Constructor
*****************************************************************************/
function PlayersPage(driver) {
  BasePage.call(this, driver);
};

PlayersPage.prototype = Object.create(BasePage.prototype);
PlayersPage.prototype.constructor = PlayersPage;

// Mixins
_.extend(PlayersPage.prototype, inputs);

/****************************************************************************
** Functions
*****************************************************************************/
PlayersPage.prototype.waitForPageToLoad = function() {
  return this.waitUntilStaleness(LAST_LOCATOR, 10000);
};

module.exports = PlayersPage;