var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var constants = require('../../lib/constants.js');

// Page Objects
var Navbar = require('../../pages/nfl/navbar.js');
var StandingsPage = require('../../pages/nfl/standings_page.js');
var TeamPage = require('../../pages/nfl/teams/team_page.js');
var standingsPage, teamsPage, navbar;

test.describe('#Page: Standings', function() {
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
      assert.equal( teamName, ' New England Patriots', '1st place team in AFC East');
    });
    standingsPage.getTableStat(1,1,1,2).then(function(wins) {
      assert.equal( wins, 12, 'New England Patriots Wins');
    });
    standingsPage.getTableStat(1,1,1,8).then(function(playoffText) {
      assert.equal( playoffText, 'SB Win', 'New England Patriots Playoff Text');
    });
  });

  test.it('changing week shows correct data', function() {
    standingsPage.changeWeek('W10');
    
    standingsPage.getTableStat(1,1,1,1).then(function(teamName) {
      assert.equal( teamName, ' New England Patriots', '1st place team in AFC East');
    });
    standingsPage.getTableStat(1,1,1,2).then(function(wins) {
      assert.equal( wins, 7, 'New England Patriots Wins');
    });
    standingsPage.getTableStat(1,1,1,8).then(function(playoffText) {
      assert.equal( playoffText, '', 'New England Patriots Playoff Text');
    });
  });  

  test.it('changing view shows correct data', function() {
    standingsPage.changeView('By Conference');
    
    standingsPage.getTableStat(1,1,2,1).then(function(teamName) {
      assert.equal( teamName, ' Denver Broncos', '2nd place team in AFC');
    });
    standingsPage.getTableStat(1,1,2,5).then(function(ps) {
      assert.equal( ps, 286, 'Denver Broncos PS');
    });
    standingsPage.getTableStat(1,1,2,6).then(function(pa) {
      assert.equal( pa, 202, 'Denver Broncos PA');
    });
    standingsPage.getTableStat(1,1,2,7).then(function(streakText) {
      assert.equal( streakText, 'W1', 'Denver Broncos Streak Text');
    });
  });  

  test.it('clicking into team goes to the right page', function() {
    standingsPage.goToTeamPage(1,1,1,1);
      
    teamPage.getTeamName().then(function(text) {
      assert.equal( text, 'New England Patriots', 'team name for page');
    });
  });
});