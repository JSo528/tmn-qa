var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var constants = require('../lib/constants.js');

var LoginPage = require('../pages/login_page.js');
var MlbNavbar = require('../pages/mlb_navbar.js');
var MlbStandingsPage = require('../pages/mlb_standings_page.js');
var MlbScoresPage = require('../pages/mlb_scores_page.js');

var driver, url, loginPage, standingsPage, navbar;

test.describe('MLB Site', function() {
  this.timeout(constants.timeOuts.mocha);  

  test.before(function() {
    driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
    navbar = new MlbNavbar(driver);
  });

  // Login Page
  test.describe('#Login Page', function() {
    test.before(function() {
      url = constants.urls.mlb.dodgers;
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

    test.it('clicking into team goes to the correct page', function() {
      
    });

    test.it('clicking into player goes to the correct page', function() {
      
    });        

    test.it('clicking into box score footer links go to the correct pages', function() {
      
    });    

    test.it('clicking box score goes to the correct page', function() {
      
    });    
  })






  
  // test.afterEach(function() {
    // driver.manage().deleteAllCookies();
  // });
   
  test.after(function() {
    driver.quit();
  });  
});
 
