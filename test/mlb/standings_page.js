var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var constants = require('../../lib/constants.js');

// Page Objects
var Navbar = require('../../pages/mlb/navbar.js');
var StandingsPage = require('../../pages/mlb/standings_page.js');
var TeamPage = require('../../pages/mlb/teams/team_page.js');
var standingsPage, teamsPage, navbar;

test.describe('#Standings Page', function() {
  test.before(function() {
    standingsPage = new StandingsPage(driver);
    teamPage = new TeamPage(driver);
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
    
    standingsPage.getTableStat(1,1,1,1).then(function(teamName) {
      assert.equal( teamName, ' Orioles', '1st place team in AL East');
    });
    standingsPage.getTableStat(1,1,1,8).then(function(pythWins) {
      assert.equal( pythWins, 93.7, 'PythW for 1st place team in AL East');
    });
  });

  test.it('changing season level shows correct data', function() {
    standingsPage.changeSeasonLevel("AAA");
    
    standingsPage.getTableStat(1,2,1,1).then(function(teamName) {
      assert.equal( teamName, ' Redbirds (STL)', '1st place team in PCL (AS)');
    });
    standingsPage.getTableStat(1,2,1,8).then(function(pythWins) {
      assert.equal( pythWins, 83.4, 'Pyth Wins for 1st place team in PCL (AS)');
    });
  });  

  test.it('clicking into team goes to the right page', function() {
    standingsPage.changeSeasonLevel("MLB");
    standingsPage.goToTeamPage(1,1,1);
      
    teamPage.getTeamName().then(function(text) {
      assert.equal( text, 'Baltimore Orioles', 'team name for page');
    });
  });
});