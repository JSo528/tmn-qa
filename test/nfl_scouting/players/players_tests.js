var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;

var extensions = require('../../../lib/extensions.js');

// Page Objects
var Navbar = require('../../../pages/nfl_scouting/navbar.js');
var PlayersPage = require('../../../pages/nfl_scouting/players/players_page.js');
var navbar, playersPage;

// Tests
test.describe('#Page: Players', function() {
  test.before(function() {
    playersPage = new PlayersPage(driver);
    navbar = new Navbar(driver);
  });

  test.it('navigate to players page', function() {
    navbar.goToPlayersPage();
  });

  test.describe('#table', function() {
      test.describe('#sorting', function() {

    });

    test.describe('#updatingFields', function() {

    });

    test.describe('#toggleColumns', function() {

    });

    test.describe('#controls', function() {

    });
  });

  test.describe('#filters', function() {

  });

  test.describe('#exportCsv', function() {

  });
});