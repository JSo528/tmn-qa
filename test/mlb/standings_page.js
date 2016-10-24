var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var constants = require('../../lib/constants.js');

// Page Objects
var Navbar = require('../../pages/mlb/navbar.js');
var StandingsPage = require('../../pages/mlb/standings_page.js');
var TeamsPage = require('../../pages/mlb/teams_page.js');
var standingsPage, teamsPage, navbar;

test.describe('#Standings Page', function() {
  test.before(function() {
    standingsPage = new StandingsPage(driver);
    teamsPage = new TeamsPage(driver);
    navbar  = new Navbar(driver);
  });

  test.it('clicking the standings link goes to the correct page', function() {
    navbar.goToStandingsPage();

    driver.getTitle().then(function(title) {
      assert.equal( title, "Standings", 'Correct Title' );
    });
  });

  test.it('changing year shows correct data', function() {
    standingsPage.changeYear(2014);
    
    standingsPage.getTeamName(constants.divisions.al_east, 1).then(function(teamName) {
      assert.equal( teamName, 'Orioles', 'Correct Team in 1st');
    });
    standingsPage.getPythWins(constants.divisions.al_east, 1).then(function(pythWins) {
      assert.equal( pythWins, 93.7, 'Correct Pyth Wins');
    });
  });

  test.it('changing season level shows correct data', function() {
    standingsPage.changeSeasonLevel("AAA");
    
    standingsPage.getTeamName(constants.divisions.pcl_as, 1).then(function(teamName) {
      assert.equal( teamName, 'Redbirds (STL)', 'Correct Team in 1st');
    });
    standingsPage.getPythWins(constants.divisions.pcl_as, 1).then(function(pythWins) {
      assert.equal( pythWins, 83.4, 'Correct Pyth Wins');
    });
  });  

  test.it('clicking into team goes to the right page', function() {
    standingsPage.changeSeasonLevel("MLB");
    standingsPage.goToTeamPage(constants.divisions.al_east, 1);
      
    teamsPage.getTeamName().then(function(text) {
      assert.equal( text, 'Baltimore Orioles', 'goes to the correct team page');
    });
  });
});