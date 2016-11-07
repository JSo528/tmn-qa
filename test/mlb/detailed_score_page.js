var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var constants = require('../../lib/constants.js');

// Page Objects
var Filters = require('../../pages/mlb/filters.js');
var Navbar = require('../../pages/mlb/navbar.js');
var DetailedScorePage = require('../../pages/mlb/detailed_score_page.js');
var ScorePitchByPitchPage = require('../../pages/mlb/score_pitch_by_pitch_page.js');
var ScorePitchingSplitsPage = require('../../pages/mlb/score_pitching_splits_page.js');
var navbar, filters, detailedScorePage, scorePitchByPitchPage, scorePitchingSplitsPage;

// Page Specific
var gameURL = '/baseball/game-batting/NYY-BAL/2016-10-02/449283';

test.describe('#DetailedScore Page', function() {
  test.before(function() {
    detailedScorePage = new DetailedScorePage(driver);
    filters = new Filters(driver);
    detailedScorePage.visit(url+gameURL);
  });

  test.describe('#Section: Batting', function() {
    test.describe('#Filters', function() {
      test.it('adding filter: (pitcher hand-righty) from dropdown displays correct data', function() {
        filters.addDropdownFilter('Pitcher Hand: Righty');

        // Brett Gardner faced 16 pitches against a righty pitcher this game
        detailedScorePage.getPlayerBattingStat("home", 1, 5).then(function(pitches) {
          assert.equal(pitches, 16);
        });
      });

      test.it('adding filter: (2 outs) from sidebar displays correct data', function() {
        filters.toggleSidebarFilter('Outs:', 2, true);

        // Michael Bourn faced 12 pitches against a righty pitcher w/ 2 outs this game
        detailedScorePage.getPlayerBattingStat("home", 1, 5).then(function(pitches) {
          assert.equal(pitches, 12);
        });
      });

      test.it('removing filter: (2 outs) from top section displays correct data', function() {
        filters.closeDropdownFilter("Outs:");
        detailedScorePage.getPlayerBattingStat("home", 1, 5).then(function(pitches) {
          assert.equal(pitches, 16);
        });
      });

      test.it('removing filter: (pitcher hand-left) from sidebar displays correct data', function() {
        filters.toggleSidebarFilter("Pitcher Hand:", 'Righty', false);
        detailedScorePage.getPlayerBattingStat("home", 1, 5).then(function(pitches) {
          assert.equal(pitches, 20);
        });
      });         
    });

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
      });

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
          teamStat: 127, 
          playerStat: 20
        },
        {
          reportName: 'Pitch Rates', 
          expectedUrlContains: /PitchRates/, 
          statType: "Contact%", 
          teamStat: "70.5%", 
          playerStat: "66.7%"
        },     
        {
          reportName: 'Pitch Counts', 
          expectedUrlContains: /PitchCounts/, 
          statType: "Strike#", 
          teamStat: 85, 
          playerStat: 13
        },  
        {
          reportName: 'Pitch Types', 
          expectedUrlContains: /PitchTypes/, 
          statType: "Curve%", 
          teamStat: "5.5%", 
          playerStat: "0.0%"
        }, 
        {
          reportName: 'Pitch Type Counts', 
          expectedUrlContains: /PitchTypeCounts/, 
          statType: "Curve#", 
          teamStat: 7, 
          playerStat: 0
        }, 
        {
          reportName: 'Pitch Locations', 
          expectedUrlContains: /PitchLocations/, 
          statType: "VMid%", 
          teamStat: "27.6%", 
          playerStat: "25.0%",
        },   
        {
          reportName: 'Pitch Calls', 
          expectedUrlContains: /PitchCalls/, 
          statType: "StrkFrmd", 
          teamStat: 2, 
          playerStat: 1,
          colOffset: 2
        },   
        {
          reportName: 'Hit Types', 
          expectedUrlContains: /HitTypes/, 
          statType: "Line%", 
          teamStat: "33.3%", 
          playerStat: "33.3%"
        },             
        {
          reportName: 'Hit Locations', 
          expectedUrlContains: /HitLocations/, 
          statType: "HPull%", 
          teamStat: "66.7%", 
          playerStat: "0.0%"
        },
        {
          reportName: 'Home Runs', 
          expectedUrlContains: /HomeRuns/, 
          statType: "HR/FB", 
          teamStat: "18.2%", 
          playerStat: "0.0%"
        },
                  {
          reportName: 'Exit Data', 
          expectedUrlContains: /ExitData/, 
          statType: "SLG", 
          teamStat: ".452", 
          playerStat: ".400"
        },
      ];

      reports.forEach(function(report) {
        test.describe('#Report: ' + report.reportName, function() {
          test.it('selecting report: ' + report.reportName + ' goes to the correct url', function() {
            detailedScorePage.changeBattingReport(report.reportName);
            driver.getCurrentUrl().then(function(url) {
              assert.match(url, report.expectedUrlContains);
            });
          });

          test.it('team batting stats display correct ' + report.statType, function() {
            var colNum = (report.colOffset === undefined) ? 7 : 7 + report.colOffset;
            detailedScorePage.getTeamBattingStat("away", colNum).then(function(stat) {
              assert.equal(stat, report.teamStat);
            });      
          });

          test.it('player batting stats display correct ' + report.statType, function() {
            var colNum = (report.colOffset == undefined) ? 9 : 9 + report.colOffset;
            detailedScorePage.getPlayerBattingStat("home", 1, colNum).then(function(stat) {
              assert.equal(stat, report.playerStat);
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
    });

    test.describe('#Filters', function() {
      test.it('adding filter: (pitch type - fastball) from dropdown displays correct data', function() {
        filters.addDropdownFilter("Pitch Type: Fastball");

        // Kevin Gausman threw 31 fastballs
        detailedScorePage.getPlayerPitchingStat("away", 1, 3).then(function(pitches) {
          assert.equal(pitches, 60);
        });
      });

      test.it('adding filter: (pitch result = strike) from sidebar displays correct data', function() {
        filters.toggleSidebarFilter("Pitch Result:", "Strike", true);

        // Michael Bourn faced 12 pitches against a righty pitcher w/ 2 outs this game
        detailedScorePage.getPlayerPitchingStat("away", 1, 3).then(function(pitches) {
          assert.equal(pitches, 31);
        });
      });

      test.it('removing filter: (pitch result = strike) from top section displays correct data', function() {
        filters.closeDropdownFilter("Pitch Result:");
        detailedScorePage.getPlayerPitchingStat("away", 1, 3).then(function(pitches) {
          assert.equal(pitches, 60);
        });
      }); 

      test.it('removing filter: (pitch type - fastball) from sidebar displays correct data', function() {
        filters.toggleSidebarFilter("Pitch Type:", "Fastball", false);
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
          teamStat: 0.061,
          playerStat: 0.218
        }          
      ];

      reports.forEach(function(report) {
        test.describe('#Report: ' + report.reportName, function() {
          test.it('selecting report: ' + report.reportName + ' goes to the correct url', function() {
            detailedScorePage.changePitchingReport(report.reportName);
            driver.getCurrentUrl().then(function(url) {
              assert.match(url, report.expectedUrlContains);
            });
          });

          test.it('team pitching stats display correct ' + report.statType, function() {
            var colNum = (report.colOffset === undefined) ? 11 : 11 + report.colOffset;
            detailedScorePage.getTeamPitchingStat("away", colNum).then(function(stat) {
              assert.equal(stat, report.teamStat);
            });      
          });

          test.it('player pitching stats display correct ' + report.statType, function() {
            var colNum = (report.colOffset === undefined) ? 12 : 12 + report.colOffset;
            detailedScorePage.getPlayerPitchingStat("home", 1, colNum).then(function(stat) {
              assert.equal(stat, report.playerStat);
            });      
          });        
        });
      });        
    });     
  });

  test.describe('#Section: Pitch By Pitch', function() {
    test.before(function() {
      detailedScorePage.goToSection("Pitch By Pitch");
      scorePitchByPitchPage = new ScorePitchByPitchPage(driver);
    });

    test.describe('#main', function() {
      test.it("displays the inning header text", function() {
        scorePitchByPitchPage.getInningHeaderText("bottom", 2).then(function(text) {
          assert.equal(text, "Inning Bot 2");
        });
      });

      test.it("displays the at bat header text", function() {
        scorePitchByPitchPage.getAtBatHeaderText(1).then(function(text) {
          assert.equal(text, "LHB M. Bourn Vs RHP L. Cessa (NYY), Top 1, 0 Out");
        });
      });      

      test.it("displays the at bat footer text", function() {
        scorePitchByPitchPage.getAtBatFooterText(1).then(function(text) {
          assert.equal(text, "Michael Bourn Grounds Out Softly, Second Baseman Donovan Solano To First Baseman Mark Teixeira.");
        });
      });

      test.it("displays the at bat footer text", function() {
        scorePitchByPitchPage.getPitchText(1, 4).then(function(text) {
          assert.equal(text, "Fastball");
        });
      });
    });

    test.describe('#filters', function() {
      test.it("turning decisive event on successfully filters the pitches", function() {
        scorePitchByPitchPage.addDecisiveEventFilter("yes");

        scorePitchByPitchPage.getPitchText(1, 6).then(function(text) {
          assert.equal(text, "Ground Out");
        });

        scorePitchByPitchPage.getPitchText(2, 6).then(function(text) {
          assert.equal(text, "Strikeout (Swinging)");
        });        
      });

      test.it('adding filter: (batter hand - lefty) from dropdown displays correct data', function() {
        filters.addDropdownFilter("Batter Hand: Lefty");

        scorePitchByPitchPage.getAtBatHeaderText(2).then(function(text) {
          assert.equal(text, "LHB B. Gardner Vs RHP K. Gausman (BAL), Bot 1, 0 Out");
        });
      });

      test.it('removing filter: ((batter hand - lefty) from dropdown displays correct data', function() {
        filters.closeDropdownFilter("Batter Hand:");
        scorePitchByPitchPage.getAtBatHeaderText(2).then(function(text) {
          assert.equal(text, "RHB A. Jones Vs RHP L. Cessa (NYY), Top 1, 1 Out");
        });
      });        
    });

    test.describe('#video playlist', function() {
      test.it('clicking video icon opens video playlist', function() {
        scorePitchByPitchPage.clickPitchVideoIcon(1);
        scorePitchByPitchPage.isVideoModalDisplayed().then(function(modalDisplayed) {
          assert.equal(modalDisplayed, true);
        });
      });

      test.it('video playlist shows correct video', function() {
        scorePitchByPitchPage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "Top 1, 0 Out");
        });
        
        scorePitchByPitchPage.getVideoPlaylistText(1,2).then(function(text) {
          assert.equal(text, "LHB M. Bourn Vs RHP L. Cessa (NYY)");
        });          
      });        

      test.it('clicking close on video playlist closes modal', function() {
        scorePitchByPitchPage.closeVideoPlaylistModal();
        scorePitchByPitchPage.isVideoModalDisplayed().then(function(modalDisplayed) {
          assert.equal(modalDisplayed, false);
        });
      });                
    });

    test.describe('#pitch by pitch visuals', function() {
      test.before(function() {
        scorePitchByPitchPage.clickPitchVisualsIcon(1);
      });

      test.it('clicking visuals icon opens pitch by pitch visuals modal', function() {
        scorePitchByPitchPage.isPitchVisualsModalDisplayed().then(function(modalDisplayed) {
          assert.equal(modalDisplayed, true);
        });
      });

      // Should show lefty image for lefty hitter
      test.it('visuals modal should show correct background image', function() {
        scorePitchByPitchPage.getPitchVisualsBgImageHref().then(function(href) {
          assert.equal(href, "/img/pitcher-view-lefty.png");
        });
      });          

      test.it('visuals modal should show correct # of pitches', function() {
        scorePitchByPitchPage.getPitchVisualsPitchCount().then(function(pitchCount) {
          assert.equal(pitchCount, 3);
        });
      });                    

      // TODO - test position of the circles on the chart?

      test.it('visuals modal should show correct result on baseball diamond', function() {
        // TODO
      });     

      test.after(function() {
        scorePitchByPitchPage.closePitchVisualsIcon();
      });   
    });
  });   

  test.describe('#Section: Pitching Splits', function() {
    test.before(function() {
      detailedScorePage.goToSection("Pitching Splits");
      scorePitchingSplitsPage = new ScorePitchingSplitsPage(driver);
    });

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

    // Can't really test the values for the 3 year averages since they're dyanmic values
    test.it("'Pitch Types: Game Vs 3 Year Avg Splits' displays correct row header", function() {
      scorePitchingSplitsPage.getPitchingSplitStat(3, 4, 2, 1).then(function(stat) {
        assert.equal(stat, "3 Years Avg");
      });
    }); 

    test.it("'Velocities: Game Vs 3 Year Avg Splits' displays correct stat", function() {
      scorePitchingSplitsPage.getPitchingSplitStat(3, 5, 1, 3).then(function(stat) {
        // Luis Cessa's this game fastballs between 95-97MPH is 73.3%
        assert.equal(stat, "73.3%");
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