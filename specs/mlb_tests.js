var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var constants = require('../lib/constants.js');

var LoginPage = require('../pages/login_page.js');
var MlbNavbar = require('../pages/mlb_navbar.js');
var MlbStandingsPage = require('../pages/mlb_standings_page.js');
var MlbScoresPage = require('../pages/mlb_scores_page.js');

var url = constants.urls.mlb.dodgers;
var driver, loginPage, standingsPage, navbar;

test.describe('MLB Site', function() {
  this.timeout(constants.timeOuts.mocha);  

  test.before(function() {
    driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
    navbar = new MlbNavbar(driver);
  });

  // Login Page
  test.describe.only('#Login Page', function() {
    test.before(function() {
      loginPage = new LoginPage(driver, url);
    });

    test.it('starts at login page', function() {
      loginPage.visit();
      // driver.getTitle().then(function(title) {
      //   assert.equal( title, "FERP", 'Correct Title' );
      // });
      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /auth\/loginPage/, 'Correct URL')
      });
    })

    test.it('able to login', function() {
      loginPage.login(constants.testUser.email, constants.testUser.password);
      driver.getCurrentUrl().then(function(url) {
        assert.notMatch(url, /auth\/loginPage/, 'Correct URL')
      })
    })
  })

  // Home/Standings Page
  test.describe('#Standings Page', function() {
    test.before(function() {
      standingsPage = new MlbStandingsPage(driver);
    });

    test.it('at standings page', function() {
      driver.getTitle().then(function(title) {
        assert.equal( title, "Standings", 'Correct Title' );
      });
    });

    test.it('navbar is displayed', function() {
      standingsPage.navbarDisplayed().then(function(displayed) {
        assert.equal( displayed, true, 'Navbar Displayed');
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
      standingsPage.goToTeamPage(constants.divisions.al_east, 1).then(function() {
        
        // TODO - change this to team page object
        driver.findElement(webdriver.By.css('h1.name')).getText().then(function(text) {
          assert.equal( text, 'Baltimore Orioles', 'goes to the correct team page');
        });
      });
    });       
  }); 

  // Scores Page
  test.describe('#Scores Page', function() {
    test.before(function() {
      scoresPage = new MlbScoresPage(driver);
    });

    test.it('clicking the scores link goes to the correct page', function() {
      navbar.goToScoresPage();

      driver.getTitle().then(function(title) {
        assert.equal( title, 'Scores', 'Correct title');
      });
    });

    test.it('shows the proper data in the box score summary', function() {
      scoresPage.getBoxScoreDatetime(1).then(function(datetimeText) {
        assert.equal( datetimeText, '10/2/2016, 3:05 PM ET', 'Correct datetime');
      });

      scoresPage.getBoxScoreRunsForInning(1, "home", 4).then(function(runs) {
        assert.equal( runs, 2, 'Correct runs');
      });

      scoresPage.getBoxScoreTotalRuns(1, "away", 2).then(function(runs) {
        assert.equal( runs, 2, 'Correct total runs');
      });      

      scoresPage.getBoxScorePitcher(1, 'win').then(function(pitcher) {
        assert.equal( pitcher, 'Kevin Gausman')
      })

      scoresPage.teamLogoDisplayed(1, "home").then(function(displayed) {
      assert.equal( displayed, true)
      })
    });

    test.it('shows the winner highlighted in the box score summary', function() {
      scoresPage.getBoxScoreRowColor(1, "home").then(function(color) {
        assert.equal( color, 'rgba(179, 255, 186, 1)', 'Correct background-color for winner');
      })
    }); 

    test.it('changing the date shows correct data', function() {
      scoresPage.changeDate('2016-05-02').then()

      scoresPage.getBoxScoreDatetime(1).then(function(datetimeText) {
        assert.equal( datetimeText, '5/2/2016, 7:05 PM ET', 'Correct datetime');
      });
    });

    test.it('changing the season level shows correct data', function() {
      scoresPage.changeSeasonLevel("A+");
      
      scoresPage.getBoxScorePitcher(1, 'win').then(function(pitcher) {
        assert.equal( pitcher, 'Jordan Milbrath');
      });
    });    

    test.describe('#Checking Links', function() {
      test.beforeEach(function() {
        scoresPage.visit(url);
      });

      test.it('clicking into team goes to the correct page', function() {
        scoresPage.clickTeam(1, "home");
        
        // TODO - make sure right team
        driver.getTitle().then(function(title) {
          assert.equal( title, 'Team Batting');
        });
      });

      test.it('clicking into player goes to the correct page', function() {
        scoresPage.clickPitcher(1, "loss");
        
        // TODO - make sure right player
        driver.getTitle().then(function(title) {
          assert.equal( title, 'Player Pitching');
        });
      });           

      var footerLinks = [
        {linkNum: 1, linkName: 'Batting', expectedTitle: 'Game - Box Score - Batting'},
        {linkNum: 2, linkName: 'Pitching', expectedTitle: 'Game - Box Score - Pitching'},
        {linkNum: 3, linkName: 'Pitch By Pitch', expectedTitle: 'Game - Box Score - Pitch By Pitch'},
        {linkNum: 4, linkName: 'Pitching Splits', expectedTitle: 'Game - Box Score - Pitching Splits'}
      ]

      footerLinks.forEach(function(link) {
        test.it('clicking into footer: ' + link.linkName + ' goes to the correct page', function() {
          scoresPage.clickBoxScoreFooter(1, link.linkName);
          
          // TODO - more data validation
          driver.getTitle().then(function(title) {
            assert.equal( title, link.expectedTitle);
          });      
        });    
      })

      test.it('clicking box score goes to the correct page', function() {
        scoresPage.clickBoxScore(1);

        // TODO - more data validation
        driver.getTitle().then(function(title) {
          assert.equal( title, 'Game - Box Score - Batting');
        });              
      });    
    })
  })

  // Detailed Score Page
  test.describe.only('#DetailedScore Page', function() {
    test.before(function() {
      driver.get('https://dodgers.trumedianetworks.com/baseball/game-batting/NYY-BAL/2016-10-02/449283?f=%7B%7D&is=true');
      var MlbDetailedScorePage = require('../pages/mlb_detailed_score_page.js');
      detailedScorePage = new MlbDetailedScorePage(driver);
    });

    test.describe.only('#Section: Batting', function() {
      // TODO - add tests for select all, changing filters on the created dropdowns
      test.describe.only('#Filters', function() {
        test.it('adding filter: (pitcher hand-left) from dropdown displays correct data', function() {
          detailedScorePage.addDropdownFilter('Pitcher Hand: Righty');

          // Brett Gardner faced 16 pitches against a righty pitcher this game
          detailedScorePage.getPlayerBattingStat("home", 1, 5).then(function(pitches) {
            assert.equal(pitches, 16);
          })
        })

        test.it('adding filter: (2 outs) from sidebar displays correct data', function() {
          detailedScorePage.addSidebarFilter('Outs:', 3);

          // Michael Bourn faced 12 pitches against a righty pitcher w/ 2 outs this game
          detailedScorePage.getPlayerBattingStat("home", 1, 5).then(function(pitches) {
            assert.equal(pitches, 12);
          })
        })

        test.it('removing filter: (2 outs) from top section displays correct data', function() {
          detailedScorePage.closeDropdownFilter(2);
          detailedScorePage.getPlayerBattingStat("home", 1, 5).then(function(pitches) {
            assert.equal(pitches, 16);
          })
        }) 

        test.it('removing filter: (pitcher hand-left) from sidebar displays correct data', function() {
          detailedScorePage.closeDropdownFilter(1);
          detailedScorePage.getPlayerBattingStat("home", 1, 5).then(function(pitches) {
            assert.equal(pitches, 20);
          })
        })         
      })

      test.describe('#Report: Rate (Home)', function() {
        test.it('team box score displays correct data', function() {
          detailedScorePage.getBoxScoreTotalHits("away").then(function(hits) {
            assert.equal(hits, 10);
          });      
        });

        test.it('team batting stats displays correct data', function() {
          detailedScorePage.getTeamBattingStat("home", 6).then(function(battingAverage) {
            assert.equal(battingAverage, 0.226);
          });      
        });

        test.it('player batting stats displays correct data', function() {
          detailedScorePage.getPlayerBattingStat("away", 3, 10).then(function(sluggingPercentage) {
            assert.equal(sluggingPercentage, 0.250);
          });      
        });
      })

      test.describe.only('#Report: Counting', function() {

      });

      test.describe.only('#Report: Pitch Rates', function() {

      });

      test.describe.only('#Report: Pitch Types', function() {

      });

      test.describe.only('#Report: Pitch Type Counts', function() {

      });

      test.describe.only('#Report: Pitch Locations', function() {

      });

      test.describe.only('#Report: Pitch Calls', function() {

      });

      test.describe.only('#Report: Hit Types', function() {

      });

      test.describe.only('#Report: Hit Locations', function() {

      });

      test.describe.only('#Report: Home Runs', function() {

      });

      test.describe.only('#Report: Exit Data', function() {

      });
    });

    test.describe('#Section: Pitching', function() {

    });

    test.describe('#Section: Pitch By Pitch', function() {

    });   

    test.describe('#Section: Pitching Splits', function() {

    });    
  }); 






  
  // test.afterEach(function() {
    // driver.manage().deleteAllCookies();
  // });
   
  test.after(function() {
    driver.quit();
  });  
});
 
