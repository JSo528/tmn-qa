var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var constants = require('../../lib/constants.js');

// Page Objects
var Navbar = require('../../pages/nfl_scouting/navbar.js');
var TeamsPage = require('../../pages/nfl_scouting/teams/teams_page.js');
var navbar, teamsPage;

test.describe('#Page: Teams', function() {
  test.before(function() {
    navbar.goToTeamsPage();
  })

  test.it('should be on the correct page', function()) {
    driver.getCurrentUrl().then(function(url) {
      assert.match(url, '/teams', 'page URL');
    };
  };

  test.it('teams list should be initially populatted', function()) {

  };

  test.describe('#sorting', function() {
    test.it('Teams List should be sorted alphabetically by code initially', function() {

    });

    test.it('clicking arrow next to code header should reverse the sort', function() {

    });

    test.it('removing the code sorter and selecting the name sorter should sort the list by school name', function() {

    });
  });

  test.describe('#clicking', function() {
    test.it('clicking into a team bring user to correct page', function() {

    });
  });
});