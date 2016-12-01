var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var constants = require('../../lib/constants.js');
var credentials = require('../../lib/credentials.js');

// Page Objects
var Navbar = require('../../pages/mlb/navbar.js');
var LoginPage = require('../../pages/login_page.js');
var StandingsPage = require('../../pages/mlb/standings_page.js');
var TeamsPage = require('../../pages/mlb/teams/teams_page.js');
var TeamPage = require('../../pages/mlb/teams/team_page.js');
var ScoresPage = require('../../pages/mlb/scores/scores_page.js');
var DetailedScorePage = require('../../pages/mlb/scores/detailed_score_page.js');
var prodUrl = constants.urls.mlb.dodgers;

var navbar, standingsPage, teamsPage, teamPage, scoresPage, detailedScorePage;

test.describe('', function() {
  test.before(function() {    
    standingsPage = new StandingsPage(driver);
    teamsPage = new TeamsPage(driver);
    teamPage = new TeamPage(driver);
    navbar  = new Navbar(driver);
    scoresPage = new ScoresPage(driver);
    detailedScorePage = new DetailedScorePage(driver);
    loginPage = new LoginPage(driver);
  });

  // Home/Standings Page
  test.describe('@ standings page', function() {
    test.it('changing year shows correct data', function() {
      standingsPage.changeYear(2015);
      
      standingsPage.getTableStat(1,1,1,1).then(function(teamName) {
        assert.equal( teamName, 'Orioles', 'Correct Team in 1st');
      });
      standingsPage.getTableStat(1,1,1,8).then(function(pythWins) {
        assert.equal( pythWins, 93.7, 'Correct Pyth Wins');
      });
    });  

    test.it('clicking into team goes to the right page', function() {
      standingsPage.changeSeasonLevel("MLB");
      standingsPage.goToTeamPage(constants.divisions.al_east, 1);

      teamPage.getTeamName().then(function(text) {
        assert.equal( text, 'Los Angeles Dodgers', 'goes to the correct team page');
      });
    });
  });

  // Teams Page
  test.describe('@ teams page', function() {
    test.it('should have the correct page title', function() {
      navbar.goToTeamsPage();

      driver.getTitle().then(function(title) {
        assert.equal( title, 'Teams Batting', 'Correct title');
      });
    });  

    test.it('Red Sox should show 0.284 BA', function() {
      var teamOneBA, teamTenBA;

      teamsPage.getTeamTableStat(1,11).then(function(stat) {
        assert.equal(stat, 0.284);
      });           
    });    
  });

  // Detailed Score Page
  test.describe('@ detailed score page', function() {
    test.before(function() {
      navbar.goToScoresPage();
      scoresPage.clickBoxScore(1);
      detailedScorePage.goToSection("pitchByPitch");
      detailedScorePage.clickPitchVideoIcon(1);
    });

    test.it('video playlist shows correct video', function() {
      detailedScorePage.getVideoPlaylistText(1,1).then(function(text) {
        assert.equal(text, "Top 2, 0 Out");
      });
    });

    test.after(function() {
      detailedScorePage.closeVideoPlaylistModal();
    })
  });  

  // Data Comparison
  test.describe('Data Comparison', function() {
    test.before(function() {
      browser.openNewTab(prodUrl).then(function() {
        browser.switchToTab(1);  
      });
      
      loginPage.login(credentials.testUser.email, credentials.testUser.password);
    });  

    test.describe('@Scores Page', function() {
      test.before(function() {
        browser.executeForEachTab(function() {
          navbar.goToScoresPage();
        });
      });

      test.it('scores page shows the same data as production', function() {
        browser.getFullContentForEachTab(scoresPage.comparisonLocator, scoresPage.lastLocator).then(function(contentArray) {
          assert.equal( contentArray[0], contentArray[1]);
        }); 
      });
    });

    test.describe('@Detailed Scores Page', function() {
      test.describe("#batting subsection", function() {
        test.before(function() {
          browser.executeForEachTab(function() {
            scoresPage.clickBoxScore(1);
          });
        });

        test.it('detailed scores page shows the same data as production', function() {
          browser.getFullContentForEachTab(detailedScorePage.comparsionLocator, detailedScorePage.lastLocator).then(function(contentArray) {
            assert.equal( contentArray[0], contentArray[1]);
          })        
        });
      });

      test.describe("#pitch by pitch subsection", function() {
        test.before(function() {
          browser.executeForEachTab(function() {
            detailedScorePage.goToSection("pitchByPitch");
          })
        })

        test.it('pitch by pitch page shows the same data  as production', function() {
          browser.getFullContentForEachTab(detailedScorePage.comparisonDataContainer, detailedScorePage.lastLocator)
            .then(function(contentArray) {
            assert.equal( contentArray[0], contentArray[1] );
          });
        }); 
      });      
    });
  });
});