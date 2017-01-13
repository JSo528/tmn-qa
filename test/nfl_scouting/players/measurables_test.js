var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;

var extensions = require('../../../lib/extensions.js');

// Page Objects
var PlayerPage = require('../../../pages/nfl_scouting/players/player_page.js');
var MeasurablesPage = require('../../../pages/nfl_scouting/players/measurables_page.js');
var playerPage, measurablesPage;

// Tests
test.describe('#Page: Measurables', function() {
  test.before(function() {
    playerPage = new PlayerPage(driver);
    browser.visit(url + 'player/31686');
    playerPage.clickMeasurablesLink();
  })

  
});