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
      // TODO - will need to go to specific date
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
        assert.equal( runs, 1, 'Correct runs');
      });

      scoresPage.getBoxScoreTotalRuns(1, "away", 2).then(function(runs) {
        assert.equal( runs, 5, 'Correct total runs');
      });      

      scoresPage.getBoxScorePitcher(1, 'win').then(function(pitcher) {
        assert.equal( pitcher, 'Kevin Gausman')
      })

      scoresPage.teamLogoDisplayed(1, "home").then(function(displayed) {
      assert.equal( displayed, true)
      })
    });

    test.it('shows the winner highlighted in the box score summary', function() {
      scoresPage.getBoxScoreRowColor(1, "away").then(function(color) {
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
      // TODO - put direct URL into page object
      driver.get('https://dodgers.trumedianetworks.com/baseball/game-batting/NYY-BAL/2016-10-02/449283?f=%7B%7D&is=true');
      var MlbDetailedScorePage = require('../pages/mlb_detailed_score_page.js');
      detailedScorePage = new MlbDetailedScorePage(driver);
    });

    test.describe('#Section: Batting', function() {
      // TODO - add tests for select all, changing filters on the created dropdowns
      test.describe('#Filters', function() {
        test.it('adding filter: (pitcher hand-left) from dropdown displays correct data', function() {
          detailedScorePage.addDropdownFilter('Pitcher Hand: Righty');

          // Brett Gardner faced 16 pitches against a righty pitcher this game
          detailedScorePage.getPlayerBattingStat("home", 1, 5).then(function(pitches) {
            assert.equal(pitches, 16);
          })
        })

        test.it('adding filter: (2 outs) from sidebar displays correct data', function() {
          detailedScorePage.toggleSidebarFilter('Outs:', 3);

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
          detailedScorePage.toggleSidebarFilter("Pitcher Hand:", 2);
          detailedScorePage.getPlayerBattingStat("home", 1, 5).then(function(pitches) {
            assert.equal(pitches, 20);
          })
        })         
      })

      test.describe('#Reports', function() {
        test.describe('#Report: Rate (Home)', function() {
          test.it('team box score displays correct data', function() {
            detailedScorePage.getBoxScoreTotalHits("away").then(function(hits) {
              assert.equal(hits, 7);
            });      
          });

          test.it('team batting stats displays correct data', function() {
            detailedScorePage.getTeamBattingStat("home", 6).then(function(battingAverage) {
              assert.equal(battingAverage, 0.278);
            });      
          });

          test.it('player batting stats displays correct data', function() {
            detailedScorePage.getPlayerBattingStat("away", 3, 10).then(function(sluggingPercentage) {
              assert.equal(sluggingPercentage, 0.250);
            });      
          });
        })

        // var reports is an array that holds data used to dynamically create tests
        // for each report we're testing the stat for: 
        // teamBatting - away team's 7th column
        // playerBatting - home team's leadoff hitter's 9th column
        // both these stats should be the same stat type
        var reports = [
          {
            reportName: 'Counting', 
            expectedUrlContains: /BattingCounting/, 
            statType: "Pitches", 
            teamBattingStat: 127, 
            playerBattingStat: 20
          },
          {
            reportName: 'Pitch Rates', 
            expectedUrlContains: /PitchRates/, 
            statType: "Contact%", 
            teamBattingStat: "70.5%", 
            playerBattingStat: "66.7%"
          },     
          {
            reportName: 'Pitch Counts', 
            expectedUrlContains: /PitchCounts/, 
            statType: "Strike#", 
            teamBattingStat: 85, 
            playerBattingStat: 13
          },  
          {
            reportName: 'Pitch Types', 
            expectedUrlContains: /PitchTypes/, 
            statType: "Curve%", 
            teamBattingStat: "5.5%", 
            playerBattingStat: "0.0%"
          }, 
          {
            reportName: 'Pitch Type Counts', 
            expectedUrlContains: /PitchTypeCounts/, 
            statType: "Curve#", 
            teamBattingStat: 7, 
            playerBattingStat: 0
          }, 
          {
            reportName: 'Pitch Locations', 
            expectedUrlContains: /PitchLocations/, 
            statType: "VMid%", 
            teamBattingStat: "27.6%", 
            playerBattingStat: "25.0%",
          },   
          {
            reportName: 'Pitch Calls', 
            expectedUrlContains: /PitchCalls/, 
            statType: "FrmRAA", 
            teamBattingStat: -0.13, 
            playerBattingStat: 0.02
          },   
          {
            reportName: 'Hit Types', 
            expectedUrlContains: /HitTypes/, 
            statType: "Line%", 
            teamBattingStat: "33.3%", 
            playerBattingStat: "33.3%"
          },             
          {
            reportName: 'Hit Locations', 
            expectedUrlContains: /HitLocations/, 
            statType: "HPull%", 
            teamBattingStat: "66.7%", 
            playerBattingStat: "0.0%"
          },
          {
            reportName: 'Home Runs', 
            expectedUrlContains: /HomeRuns/, 
            statType: "HR/FB", 
            teamBattingStat: "18.2%", 
            playerBattingStat: "0.0%"
          },
                    {
            reportName: 'Exit Data', 
            expectedUrlContains: /ExitData/, 
            statType: "SLG", 
            teamBattingStat: ".452", 
            playerBattingStat: ".400"
          },
        ];

        reports.forEach(function(report) {
          test.describe('#Report: ' + report.reportName, function() {
            test.it('selecting report: ' + report.reportName + ' goes to the correct url', function() {
              detailedScorePage.changeReport(report.reportName);
              driver.getCurrentUrl().then(function(url) {
                assert.match(url, report.expectedUrlContains);
              });
            });

            test.it('team batting stats display correct ' + report.statType, function() {
              detailedScorePage.getTeamBattingStat("away", 7).then(function(stat) {
                assert.equal(stat, report.teamBattingStat);
              });      
            });

            test.it('player batting stats display correct ' + report.statType, function() {
              detailedScorePage.getPlayerBattingStat("home", 1, 9).then(function(stat) {
                assert.equal(stat, report.playerBattingStat);
              });      
            });        
          });
        });
      });
    });

    test.describe('#Section: Pitching', function() {
      test.it("clicking pitching tab goes to the correct URL", function() {
        detailedScorePage.goToSection("Pitching");
        driver.getCurrentUrl().then(function(url) {
          assert.match(url, /game\-pitching/);
        });
      })

      // TODO - add tests for select all, changing filters on the created dropdowns
      test.describe.skip('#Filters', function() {
        test.it('adding filter: (pitch type - fastball) from dropdown displays correct data', function() {
          detailedScorePage.addDropdownFilter("Pitch Type: Fastball");

          // Kevin Gausman threw 31 fastballs
          detailedScorePage.getPlayerPitchingStat("away", 1, 3).then(function(pitches) {
            assert.equal(pitches, 60);
          });
        });

        test.it('adding filter: (pitch result = strike) from sidebar displays correct data', function() {
          detailedScorePage.toggleSidebarFilter("Pitch Result:", 1)

          // Michael Bourn faced 12 pitches against a righty pitcher w/ 2 outs this game
          detailedScorePage.getPlayerPitchingStat("away", 1, 3).then(function(pitches) {
            assert.equal(pitches, 31);
          });
        });

        test.it('removing filter: (pitch result = strike) from top section displays correct data', function() {
          detailedScorePage.closeDropdownFilter(2);
          detailedScorePage.getPlayerPitchingStat("away", 1, 3).then(function(pitches) {
            assert.equal(pitches, 60);
          });
        }); 

        test.it('removing filter: (pitch type - fastball) from sidebar displays correct data', function() {
          detailedScorePage.toggleSidebarFilter("Pitch Type:", 8);
          detailedScorePage.getPlayerPitchingStat("away", 1, 3).then(function(pitches) {
            assert.equal(pitches, 106);
          });
        });         
      }); 

      test.describe('#Reports', function() {
        test.describe('#Report: Traditional', function() {
          test.it('team pitching stats display correct Hits', function() {
            detailedScorePage.getTeamPitchingStat("away", 11).then(function(stat) {
              assert.equal(stat, 10);
            });      
          });

          test.it('player pitching stats display correct Hits', function() {
            detailedScorePage.getPlayerPitchingStat("home", 1, 12).then(function(stat) {
              assert.equal(stat, 5);
            });      
          });        
        });      

        // var reports is an array that holds data used to dynamically create tests
        // for each report we're testing the stat for: 
        // teamPitching - away team's 11th column
        // playerPitching - home team's 1st pitcher's 12th column
        // if colOffset is set then we shift those columns by adding the default # by the colOffset value
        // both these stats should be the same stat type
        var reports = [
          {
            reportName: 'Rate', 
            expectedUrlContains: /PitchingRate/, 
            statType: "K%", 
            teamStat: "16.2%", 
            playerStat: "27.3%"
          },        
          {
            reportName: 'Counting', 
            expectedUrlContains: /PitchingCounting/, 
            statType: "HBP", 
            teamStat: 0, 
            playerStat: 0
          },
          {
            reportName: 'Pitch Rates', 
            expectedUrlContains: /PitchingPitchRates/, 
            statType: "InZone%", 
            teamStat: "52.4%", 
            playerStat: "53.2%"
          },
          {
            reportName: 'Pitch Counts', 
            expectedUrlContains: /PitchingPitchCounts/, 
            statType: "Chase#", 
            teamStat: 24, 
            playerStat: 13
          },
          {
            reportName: 'Pitch Types', 
            expectedUrlContains: /PitchingPitchTypes/, 
            statType: "Split%", 
            teamStat: "7.9%", 
            playerStat: "1.3%"
          },
          {
            reportName: 'Pitch Type Count', 
            expectedUrlContains: /PitchingPitchTypeCounts/, 
            statType: "Split#", 
            teamStat: 10, 
            playerStat: 1
          },
          {
            reportName: 'Pitch Locations', 
            expectedUrlContains: /PitchingPitchLocations/, 
            statType: "Inside%", 
            teamStat: "26.2%", 
            playerStat: "14.3%"
          },
                              {
            reportName: 'Pitch Calls', 
            expectedUrlContains: /PitchingPitchCalls/, 
            statType: "BallFrmd", 
            teamStat: 0, 
            playerStat: 1
          },
          {
            reportName: 'Hit Types', 
            expectedUrlContains: /PitchingHitTypes/, 
            statType: "Fly#", 
            teamStat: 6, 
            playerStat: 2
          },
          {
            reportName: 'Hit Locations', 
            expectedUrlContains: /PitchingHitLocations/, 
            statType: "HDeadCtr%", 
            teamStat: "26.7%", 
            playerStat: "12.5%"
          }, 
          {
            reportName: 'Movement', 
            expectedUrlContains: /PitchingMovement/, 
            statType: "SpinDir", 
            teamStat: 201.8, 
            playerStat: 203.2
          },
          {
            reportName: 'Home Runs', 
            expectedUrlContains: /PitchingHomeRuns/, 
            statType: "HRDst", 
            teamStat: 370.8,
            playerStat: 429.9,
            colOffset: -4
          },
          {
            reportName: 'Bids', 
            expectedUrlContains: /PitchingBids/, 
            statType: "HRDst", 
            teamStat: 0.1,
            playerStat: 2.0,
            colOffset: 2
          },
          {
            reportName: 'Baserunning', 
            expectedUrlContains: /PitchingBaserunning/, 
            statType: "BF", 
            teamStat: 37,
            playerStat: 22,
            colOffset: -8
          },
          {
            reportName: 'Exit Data', 
            expectedUrlContains: /PitchingExitData/, 
            statType: "ExISO", 
            teamStat: .061,
            playerStat: .218
          }          
        ];

        reports.forEach(function(report) {
          test.describe('#Report: ' + report.reportName, function() {
            test.it('selecting report: ' + report.reportName + ' goes to the correct url', function() {
              detailedScorePage.changeReport(report.reportName);
              driver.getCurrentUrl().then(function(url) {
                assert.match(url, report.expectedUrlContains);
              });
            });

            test.it('team pitching stats display correct ' + report.statType, function() {
              var colNum = (report.colOffset == undefined) ? 11 : 11 + report.colOffset;
              detailedScorePage.getTeamPitchingStat("away", colNum).then(function(stat) {
                assert.equal(stat, report.teamStat);
              });      
            });

            test.it('player pitching stats display correct ' + report.statType, function() {
              var colNum = (report.colOffset == undefined) ? 12 : 12 + report.colOffset;
              detailedScorePage.getPlayerPitchingStat("home", 1, colNum).then(function(stat) {
                assert.equal(stat, report.playerStat);
              });      
            });        
          });
        });        
      });     
    });

    test.describe('#Section: Pitch By Pitch', function() {
      /*
        - decisive event
        - filters
        - video playlist
        -
      */
    });   

    test.describe.only('#Section: Pitching Splits', function() {
      test.before(function() {
        detailedScorePage.goToSection("Pitching Splits");
        var ScorePitchingSplitsPage = require('../pages/score_pitching_splits_page.js');
        scorePitchingSplitsPage = new ScorePitchingSplitsPage(driver);
      })

      test.it("'Pitch Type Splits' displays correct stat", function() {
        scorePitchingSplitsPage.getPitchingSplitStat(1, 1, 1, 4).then(function(stat) {
          // Kevin Gausman threw 38 pitches to RHB
          assert.equal(stat, 38);
        });
      });

      test.it("'Fastball Velocity Splits' displays correct stat", function() {
        scorePitchingSplitsPage.getPitchingSplitStat(1, 2, 2, 12).then(function(stat) {
          // Kevin Gausman threw 12 fastballs between 95-97 MPH in the 3rd inning
          assert.equal(stat, 12);
        });
      });

      test.it("'Pitch Location Splits' displays correct stat", function() {
        scorePitchingSplitsPage.getPitchingSplitStat(2, 3, 1, 2).then(function(stat) {
          // Zach Britton threw 12 pitches in zone
          assert.equal(stat, 12);
        });
      });

      test.it("'Pitch Types: Game Vs 3 Year Avg Splits' displays correct stat", function() {
        scorePitchingSplitsPage.getPitchingSplitStat(3, 4, 2, 2).then(function(stat) {
          // Luis Cessa's 3yr average for fastballs is 55.2%
          assert.equal(stat, "55.2%");
        });
      }); 

      test.it("'Velocities: Game Vs 3 Year Avg Splits' displays correct stat", function() {
        scorePitchingSplitsPage.getPitchingSplitStat(3, 5, 2, 3).then(function(stat) {
          // Luis Cessa's 3yr average for fastballs between 95-97MPH is 28.5%
          assert.equal(stat, "28.5%");
        });
      }); 

      test.it("'Locations: Game Vs 3 Year Avg Splits' displays correct stat", function() {
        scorePitchingSplitsPage.getPitchingSplitStat(3, 6, 1, 3).then(function(stat) {
          // Luis Cessa's this game average for inside% is 14.3%
          assert.equal(stat, "14.3%");
        });
      });

      test.describe('#Filters', function() {
        test.it("pitcher filter returns correct pitcher", function() {
          scorePitchingSplitsPage.addPitcherFilter("Adam Warren");

          scorePitchingSplitsPage.getPitcherName(1).then(function(name) {
            assert.include(name, "Adam Warren");
          });
        });
      });       
    });    
  }); 






  
  // test.afterEach(function() {
    // driver.manage().deleteAllCookies();
  // });
   
  test.after(function() {
    driver.quit();
  });  
});
 
