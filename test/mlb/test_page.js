var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var constants = require('../../lib/constants.js');
var credentials = require('../../lib/credentials.js');

// Page Objects
var StandingsPage = require('../../pages/mlb/standings_page.js');
var TeamsPage = require('../../pages/mlb/teams_page.js');
var StatsPage = require('../../pages/mlb/teams/stats_page.js');
var ScoresPage = require('../../pages/mlb/scores_page.js');
var Navbar = require('../../pages/mlb/navbar.js');
var LoginPage = require('../../pages/login_page.js');
var prodUrl = constants.urls.mlb.dodgers;

var standingsPage, teamsPage, navbar;

test.describe('', function() {
  test.before(function() {    
    standingsPage = new StandingsPage(driver);
    teamsPage = new TeamsPage(driver);
    navbar  = new Navbar(driver);
  });

  // Home/Standings Page
  test.describe('@ standings page', function() {
    test.it('changing year shows correct data', function() {
      standingsPage.changeYear(2015);
      
      standingsPage.getTeamName(constants.divisions.al_east, 1).then(function(teamName) {
        assert.equal( teamName, 'Orioles', 'Correct Team in 1st');
      });
      standingsPage.getPythWins(constants.divisions.al_east, 1).then(function(pythWins) {
        assert.equal( pythWins, 93.7, 'Correct Pyth Wins');
      });
    });

    test.it('changing season level shows correct data', function() {
      // fix season level
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
        assert.equal( text, 'Los Angeles Dodgers', 'goes to the correct team page');
      });
    });
  });

  // Teams Page
  test.describe('@ teams page', function() {
    test.before(function() {
      statsPage = new StatsPage(driver);

      battingAverageCol = 11;
      winsCol = 5;
    });

    test.it('should have the correct page title', function() {
      navbar.goToTeamsPage();

      driver.getTitle().then(function(title) {
        assert.equal( title, 'Teams Batting', 'Correct title');
      });
    });  

    test.it('should be sorted initially by BA ascending', function() {
      var teamOneBA, teamTwoBA, teamTenBA;

      statsPage.getTeamTableStat(1,battingAverageCol).then(function(stat) {
        teamOneBA = stat;
      });

      statsPage.getTeamTableStat(10,battingAverageCol).then(function(stat) {
        teamTenBA = stat;
        assert.isAtMost(teamOneBA, teamTenBA, "team ones's BA is >= team ten's BA");
      });           
    });    
  });

  // Data Comparison
  test.describe('Data Comparison', function() {
    test.before(function() {
      scoresPage = new ScoresPage(driver);

      browser.openNewTab(prodUrl).then(function() {
        browser.switchToTab(1);  
      })
      
      loginPage = new LoginPage(driver);
      loginPage.login(credentials.testUser.email, credentials.testUser.password);
    });  

    test.describe('@Scores Page', function() {
      test.before(function() {
        browser.executeForEachTab(function() {
          navbar.goToScoresPage();
        })
      });

      test.it('scores page shows the same data', function() {
        browser.getFullContentForEachTab(scoresPage.comparisonLocator, scoresPage.lastLocator).then(function(contentArray) {
          assert.equal( contentArray[0], contentArray[1], 'main data should be the same' );
        })  
      });
    });
  });
});