var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var constants = require('../../../lib/constants.js');

// Page Objects
var Filters = require('../../../pages/mlb/filters.js');
var Navbar = require('../../../pages/mlb/navbar.js');
var DetailedScorePage = require('../../../pages/mlb/scores/detailed_score_page.js');
var navbar, filters, detailedScorePage;

// Page Specific
var gameURL = '/baseball/game-batting/NYY-BAL/2016-10-02/449283';

test.describe('#DetailedScore Page', function() {
  test.it('test setup', function() {
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

      test.after(function() {
        filters.closeDropdownFilter("Outs:");
        filters.toggleSidebarFilter("Pitcher Hand:", 'Righty', false);
      });         
    });

    test.describe('#VideoPlaylist', function() {    
      test.describe('#TeamStat', function() {    
        test.it('clicking on a team stat opens the play by play modal', function() {
          detailedScorePage.clickTeamBattingStat('home', 5);
          detailedScorePage.getMatchupsAtBatHeaderText(2).then(function(text) {
            assert.equal(text, 'Vs RHP K. Gausman (BAL), Bot 1, 1 Out');
          });
        });

        test.it('clicking into video opens correct video', function() {
          detailedScorePage.clickPitchVideoIcon(2);
          detailedScorePage.getVideoPlaylistText(1,1).then(function(text) {
            assert.equal(text, "Bot 1, 0 out");
          });

          detailedScorePage.getVideoPlaylistText(1,3).then(function(text) {
            assert.equal(text, "0-2 Changeup 85.4 MPH");
          });          
        }); 

        test.after(function() {
          detailedScorePage.closeVideoPlaylistModal();
          detailedScorePage.closePlayByPlayModal();
        });
      });

      test.describe('#PlayerStat', function() {    
        test.it('clicking on a player stat opens the play by play modal', function() {
          detailedScorePage.clickPlayerBattingStat('home', 1, 5);
          detailedScorePage.getMatchupsAtBatHeaderText(1).then(function(text) {
            assert.equal(text, 'Vs RHP K. Gausman (BAL), Bot 1, 0 Out');
          });
        });

        test.it('clicking into video opens correct video', function() {
          detailedScorePage.clickPitchVideoIcon(2);
          detailedScorePage.getVideoPlaylistText(1,1).then(function(text) {
            assert.equal(text, "Bot 1, 0 out");
          });

          detailedScorePage.getVideoPlaylistText(1,3).then(function(text) {
            assert.equal(text, "0-0 Fastball 93.7 MPH");
          });          
        }); 

        test.it('closing video modal', function() {
          detailedScorePage.closeVideoPlaylistModal();
        });
      });

      // Video Library
      test.describe('#VideoLibrary - add all videos to new playlist', function() {
        test.it('should create new playlist', function() {
          detailedScorePage.addAllVideosToNewList("Detailed Score Tests");
        });

        test.it('playlist should exist in library', function() {
          detailedScorePage.closePlayByPlayModal();
          detailedScorePage.openVideoLibrary();
          detailedScorePage.listExistsInVideoLibrary('Detailed Score Tests').then(function(exists) {
            assert.equal(exists, true, 'Detailed Score Tests playlist exists in library');
          });
        });

        test.it('should have correct # of videos', function() {
          detailedScorePage.openVideoList('Detailed Score Tests');
          detailedScorePage.getVideoCountFromList().then(function(count) {
            assert.equal(count, 20);
          });
        });

        test.it('should be able to play video', function() {
          detailedScorePage.playVideoFromList(1);
          detailedScorePage.isVideoModalDisplayed().then(function(displayed){
            assert.equal(displayed, true);
          });        
        });

        test.it('closing video modal', function() {
          detailedScorePage.closeVideoPlaylistModal();
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
        { name: 'Counting', urlContains: /BattingCounting/, statType: "Pitches", teamStat: 127, playerStat: 20 },
        { name: 'Pitch Rates', urlContains: /PitchRates/, statType: "Contact%", teamStat: "70.5%", playerStat: "66.7%" },     
        { name: 'Pitch Counts', urlContains: /PitchCounts/, statType: "Strike#", teamStat: 85, playerStat: 13 },  
        { name: 'Pitch Types', urlContains: /PitchTypes/, statType: "Curve%", teamStat: "5.5%", playerStat: "0.0%" }, 
        { name: 'Pitch Type Counts', urlContains: /PitchTypeCounts/, statType: "Curve#", teamStat: 7, playerStat: 0 }, 
        { name: 'Pitch Locations', urlContains: /PitchLocations/, statType: "VMid%", teamStat: "27.6%", playerStat: "25.0%" },   
        { name: 'Pitch Calls', urlContains: /PitchCalls/, statType: "StrkFrmd", teamStat: 2, playerStat: 1, colOffset: 2 },   
        { name: 'Hit Types', urlContains: /HitTypes/, statType: "Line%", teamStat: "33.3%", playerStat: "33.3%" },             
        { name: 'Hit Locations', urlContains: /HitLocations/, statType: "HPull%", teamStat: "66.7%", playerStat: "0.0%" },
        { name: 'Home Runs', urlContains: /HomeRuns/, statType: "HR/FB", teamStat: "18.2%", playerStat: "0.0%" },
        { name: 'Exit Data', urlContains: /ExitData/, statType: "SLG", teamStat: ".452", playerStat: ".400" }
      ];

      reports.forEach(function(report) {
        test.describe('#Report: ' + report.name, function() {
          test.it('selecting report: ' + report.name + ' goes to the correct url', function() {
            detailedScorePage.changeBattingReport(report.name);
            driver.getCurrentUrl().then(function(url) {
              assert.match(url, report.urlContains);
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
      detailedScorePage.goToSection("pitching");
      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /game\-pitching/);
      });
    });

    test.describe('#Filters', function() {
      test.it('adding filter: (pitch type - Soft (change/curve/slider/splitter)) from dropdown displays correct data', function() {
        filters.toggleSidebarFilter("Pitch Type:", "Soft (change/curve/slider/splitter)", true);
        driver.sleep(1000); 
        detailedScorePage.getPlayerPitchingStat("away", 1, 3).then(function(pitches) {
          assert.equal(pitches, 46, '# pitches for Kevin Gausman');
        });
      });

      test.it('adding filter: (pitch result = strike) from sidebar displays correct data', function() {
        filters.toggleSidebarFilter("Pitch Result:", "Strike", true);
        
        detailedScorePage.getPlayerPitchingStat("away", 1, 3).then(function(pitches) {
          assert.equal(pitches, 12, '# pitches for Kevin Gausman');
        });
      });

      test.it('adding filter: (vertical location: Lower Third) from sidebar displays correct data', function() {
        filters.toggleSidebarFilter("Vertical Location:", "Lower Third", true);

        detailedScorePage.getPlayerPitchingStat("away", 1, 3).then(function(pitches) {
          assert.equal(pitches, 8, '# pitches for Kevin Gausman');
        });
      });

      test.it('adding filter: (PA Result: Out) from sidebar displays correct data', function() {
        filters.toggleSidebarFilter("PA Result:", "Out", true);

        detailedScorePage.getPlayerPitchingStat("away", 1, 3).then(function(pitches) {
          assert.equal(pitches, 1, '# pitches for Kevin Gausman');
        });
      });   

      test.it('clicking default filters btn returns to default filters', function() {
        filters.clickDefaultFiltersBtn();

        detailedScorePage.getPlayerPitchingStat("away", 1, 3).then(function(pitches) {
          assert.equal(pitches, 106, '# pitches for Kevin Gausman');
        });
      });   
    }); 
    
    // TODO - once this is fixed, add tests for video library, similiar plays, etc.
    test.describe('#VideoPlaylist', function() {    
      test.describe('#TeamStat', function() {    
        test.it('clicking on a team stat opens the play by play modal', function() {
          detailedScorePage.clickTeamPitchingStat('home', 11);
          detailedScorePage.getMatchupsAtBatHeaderText(2).then(function(text) {
            assert.equal(text, 'Vs RHP K. Gausman (BAL), Bot 1, 1 Out');
          });
        });

        test.it('clicking into video opens correct video', function() {
          detailedScorePage.clickPitchVideoIcon(2);
          detailedScorePage.getVideoPlaylistText(1,1).then(function(text) {
            assert.equal(text, "Bot 1, 0 out");
          });

          detailedScorePage.getVideoPlaylistText(1,3).then(function(text) {
            assert.equal(text, "0-2 Changeup 85.4 MPH");
          });          
        }); 

        test.after(function() {
          detailedScorePage.closeVideoPlaylistModal();
          detailedScorePage.closePlayByPlayModal();
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
        { name: 'Rate', urlContains: /PitchingRate/, statType: "K%", teamStat: "16.2%", playerStat: "27.3%" },        
        { name: 'Counting', urlContains: /PitchingCounting/, statType: "HBP", teamStat: 0, playerStat: 0 },
        { name: 'Pitch Rates', urlContains: /PitchingPitchRates/, statType: "InZone%", teamStat: "52.4%", playerStat: "53.2%" },
        { name: 'Pitch Counts', urlContains: /PitchingPitchCounts/, statType: "Chase#", teamStat: 24, playerStat: 13 },
        { name: 'Pitch Types', urlContains: /PitchingPitchTypes/, statType: "Split%", teamStat: "7.9%", playerStat: "1.3%" },
        { name: 'Pitch Type Count', urlContains: /PitchingPitchTypeCounts/, statType: "Split#", teamStat: 10, playerStat: 1 },
        { name: 'Pitch Locations', urlContains: /PitchingPitchLocations/, statType: "Inside%", teamStat: "26.2%", playerStat: "14.3%" },
        { name: 'Pitch Calls', urlContains: /PitchingPitchCalls/, statType: "BallFrmd", teamStat: 0, playerStat: 1 },
        { name: 'Hit Types', urlContains: /PitchingHitTypes/, statType: "Fly#", teamStat: 6, playerStat: 2 },
        { name: 'Hit Locations', urlContains: /PitchingHitLocations/, statType: "HDeadCtr%", teamStat: "26.7%", playerStat: "12.5%" }, 
        { name: 'Movement', urlContains: /PitchingMovement/, statType: "TMTilt", teamStat: '1:02', playerStat: '12:55' },
        { name: 'Home Runs', urlContains: /PitchingHomeRuns/, statType: "HRDst", teamStat: 370.8, playerStat: 429.9, colOffset: -4 },
        { name: 'Bids', urlContains: /PitchingBids/, statType: "HRDst", teamStat: 0.1, playerStat: 2.0, colOffset: 2 },
        { name: 'Baserunning', urlContains: /PitchingBaserunning/, statType: "BF", teamStat: 37, playerStat: 22, colOffset: -8 },
        { name: 'Exit Data', urlContains: /PitchingExitData/, statType: "ExISO", teamStat: 0.061, playerStat: 0.218 }          
      ];

      reports.forEach(function(report) {
        test.describe('#Report: ' + report.name, function() {
          test.it('selecting report: ' + report.name + ' goes to the correct url', function() {
            detailedScorePage.changePitchingReport(report.name);
            driver.getCurrentUrl().then(function(url) {
              assert.match(url, report.urlContains);
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
    test.it('test setup', function() {
      detailedScorePage.goToSection("pitchByPitch");
    });

    test.describe('#main', function() {
      test.it("displays the inning header text", function() {
        detailedScorePage.getInningHeaderText("bottom", 2).then(function(text) {
          assert.equal(text, "Inning Bot 2");
        });
      });

      test.it("displays the at bat header text", function() {
        detailedScorePage.getMatchupsAtBatHeaderText(1).then(function(text) {
          assert.equal(text, "LHB M. Bourn Vs RHP L. Cessa (NYY), Top 1, 0 Out");
        });
      });      

      test.it("displays the at bat footer text", function() {
        detailedScorePage.getMatchupsAtBatFooterText(1).then(function(text) {
          assert.equal(text, "Michael Bourn Grounds Out Softly, Second Baseman Donovan Solano To First Baseman Mark Teixeira.");
        });
      });

      test.it("displays the at bat footer text", function() {
        detailedScorePage.getMatchupsPitchText(1, 4).then(function(text) {
          assert.equal(text, "Fastball");
        });
      });
    });

    test.describe('#filters', function() {
      test.it("turning decisive event on successfully filters the pitches", function() {
        detailedScorePage.addDecisiveEventFilter("yes");

        detailedScorePage.getMatchupsPitchText(1, 6).then(function(text) {
          assert.equal(text, "Ground Out");
        });

        detailedScorePage.getMatchupsPitchText(2, 6).then(function(text) {
          assert.equal(text, "Strikeout (Swinging)");
        });        
      });

      test.it('adding filter: (batter hand - lefty) from dropdown displays correct data', function() {
        filters.addDropdownFilter("Batter Hand: Lefty");

        detailedScorePage.getMatchupsAtBatHeaderText(2).then(function(text) {
          assert.equal(text, "LHB B. Gardner Vs RHP K. Gausman (BAL), Bot 1, 0 Out");
        });
      });

      test.it('removing filter: ((batter hand - lefty) from dropdown displays correct data', function() {
        filters.closeDropdownFilter("Batter Hand:");
        detailedScorePage.getMatchupsAtBatHeaderText(2).then(function(text) {
          assert.equal(text, "RHB A. Jones Vs RHP L. Cessa (NYY), Top 1, 1 Out");
        });
      });        
    });

    test.describe('#video playlist', function() {
      test.it('clicking video icon opens video playlist', function() {
        detailedScorePage.clickPitchVideoIcon(1);
        detailedScorePage.isVideoModalDisplayed().then(function(modalDisplayed) {
          assert.equal(modalDisplayed, true);
        });
      });

      test.it('video playlist shows correct video', function() {
        detailedScorePage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "Top 1, 0 out");
        });
        
        detailedScorePage.getVideoPlaylistText(1,2).then(function(text) {
          assert.equal(text, "Vs RHP L. Cessa (NYY) LHB M. Bourn");
        });          
      });        

      test.it('clicking close on video playlist closes modal', function() {
        detailedScorePage.closeVideoPlaylistModal();
        detailedScorePage.isVideoModalDisplayed().then(function(modalDisplayed) {
          assert.equal(modalDisplayed, false);
        });
      });  

      test.it('selecting "Play All" videos adds all videos to playlist', function() {
        detailedScorePage.selectFromPlayVideosDropdown('Play All');
        detailedScorePage.getVideoPlaylistCount().then(function(videoCount) {
          assert.equal(videoCount, 70, '# videos on playlist');
        });
      });  

      test.it('close video playlist modal', function() {
        detailedScorePage.closeVideoPlaylistModal();
      });        
    }); 

    test.describe('#VideoLibrary - selecting "Add All" to existing playlist', function() {
      test.it('should have correct # of videos', function() {
        detailedScorePage.addAllVideosToList('Detailed Score Tests');
        detailedScorePage.closePlayByPlayModal();
        detailedScorePage.openVideoLibrary();
        detailedScorePage.openVideoList('Detailed Score Tests');
        detailedScorePage.getVideoCountFromList().then(function(count) {
          assert.equal(count, 20);
        });
      });

      test.it('should be able to play video', function() {
        detailedScorePage.playVideoFromList(1);
        detailedScorePage.isVideoModalDisplayed().then(function(displayed){
          assert.equal(displayed, true);
        });        
      });

      test.it('closing video modal', function() {
        detailedScorePage.closeVideoPlaylistModal();
      }); 
    });

    test.describe('#VideoLibrary - deleting playlist', function() {
      test.it('should remove playlist', function() {
        detailedScorePage.openVideoLibrary();
        detailedScorePage.deleteListFromLibrary('Detailed Score Tests');
        
        detailedScorePage.listExistsInVideoLibrary('Detailed Score Tests').then(function(exists) {
          assert.equal(exists, false);
        })
      });

      test.it('close video library', function() {
        detailedScorePage.closeVideoLibrary();
      });
    });    

    test.describe('#pitch by pitch visuals', function() {
      test.it('test setup', function() {
        detailedScorePage.clickPitchVisualsIcon(1);
      });

      // Should show lefty image for lefty hitter
      test.it('visuals modal should show correct background image', function() {
        detailedScorePage.getPitchVisualsBgImageHref().then(function(href) {
          assert.equal(href, "/img/pitcher-view-lefty.png");
        });
      });          

      test.it('visuals modal should show correct # of pitches', function() {
        detailedScorePage.getPitchVisualsPitchCount().then(function(pitchCount) {
          assert.equal(pitchCount, 3);
        });
      });                    

      // TODO - test position of the circles on the chart?

      test.it('visuals modal should show correct result on baseball diamond', function() {
        // TODO
      });     

      test.after(function() {
        detailedScorePage.closePitchVisualsModal();
      });   
    });
  });   

  test.describe('#Section: Pitching Splits', function() {
    test.it('test setup', function() {
      detailedScorePage.goToSection("pitchingSplits");
    });

    test.it("'Pitch Type Splits' displays correct stat", function() {
      detailedScorePage.getPitchingSplitStat(1, 1, 1, 4).then(function(stat) {
        // Kevin Gausman threw 38 pitches to RHB
        assert.equal(stat, 38);
      });
    });

    test.it("'Fastball Velocity Splits' displays correct stat", function() {
      detailedScorePage.getPitchingSplitStat(1, 2, 2, 12).then(function(stat) {
        // Kevin Gausman threw 12 fastballs between 95-97 MPH in the 3rd inning
        assert.equal(stat, 12);
      });
    });

    test.it("'Pitch Location Splits' displays correct stat", function() {
      detailedScorePage.getPitchingSplitStat(2, 3, 1, 2).then(function(stat) {
        // Zach Britton threw 12 pitches in zone
        assert.equal(stat, 12);
      });
    });

    // Can't really test the values for the 3 year averages since they're dyanmic values
    test.it("'Pitch Types: Game Vs 3 Year Avg Splits' displays correct row header", function() {
      detailedScorePage.getPitchingSplitStat(3, 4, 2, 1).then(function(stat) {
        assert.equal(stat, "3 Years Avg");
      });
    }); 

    test.it("'Velocities: Game Vs 3 Year Avg Splits' displays correct stat", function() {
      detailedScorePage.getPitchingSplitStat(3, 5, 1, 3).then(function(stat) {
        // Luis Cessa's this game fastballs between 95-97MPH is 73.3%
        assert.equal(stat, "73.3%");
      });
    }); 

    test.it("'Locations: Game Vs 3 Year Avg Splits' displays correct stat", function() {
      detailedScorePage.getPitchingSplitStat(3, 6, 1, 3).then(function(stat) {
        // Luis Cessa's this game average for inside% is 14.3%
        assert.equal(stat, "14.3%");
      });
    });

    test.describe('#Filters', function() {
      test.it("pitcher filter returns correct pitcher", function() {
        filters.changeSelectionToDropdownFilter("Pitchers:", "Adam Warren");

        detailedScorePage.getPitchingSplitsPitcherName(1).then(function(name) {
          assert.include(name, "Adam Warren");
        });
      });
    });       
  });    
}); 