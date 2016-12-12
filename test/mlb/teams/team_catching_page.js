var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var constants = require('../../../lib/constants.js');

// Page Objects
var Navbar = require('../../../pages/mlb/navbar.js');
var Filters = require('../../../pages/mlb/filters.js');
var TeamsPage = require('../../../pages/mlb/teams/teams_page.js');
var TeamPage = require('../../../pages/mlb/teams/team_page.js');

var navbar, filters, teamsPage, teamPage, teamPage;

test.describe('#Team Catching Section', function() {
  test.before(function() {  
    navbar  = new Navbar(driver);  
    filters  = new Filters(driver);  
    teamsPage = new TeamsPage(driver);
    teamPage = new TeamPage(driver);

    navbar.goToTeamsPage();
    filters.removeSelectionFromDropdownFilter("Seasons:");
    filters.addSelectionToDropdownFilter("Seasons:", 2016);
    teamsPage.clickTeamTableCell(5,3); // should click into Texas Rangers
    teamPage.goToSection("catching");
  });  

  test.it('should be on Texas Rangers 2016 team page', function() {
    teamPage.getTeamName().then(function(text) {
      assert.equal( text, 'Texas Rangers');
    });
  });

  // Overview Section
  test.describe("#Subsection: Overview", function() {
    test.it('should initially have the correct data', function() {
        teamPage.getOverviewTableStat(10).then(function(strkFrmd) {
          assert.equal(strkFrmd, 169, 'StrkFrmd');
        });        
      });            

    // Heat Map & Hit Charts
    test.describe("#Heat Maps & Hit Charts", function() {
      test.it('selecting a heat map rectangle on the left image updates the data table', function() {
        teamPage.drawBoxOnCatcherHeatMap('left', 130,120,120,49);  

        teamPage.getOverviewTableStat(10).then(function(strkFrmd) {
          assert.equal(strkFrmd, 27, 'StrkFrmd');
        });        
      });            

      test.it('clearing the left heat map resets the data table', function() {
        teamPage.clearCatcherHeatMap('left');
        teamPage.getOverviewTableStat(10).then(function(strkFrmd) {
          assert.equal(strkFrmd, 169, 'StrkFrmd');
        });        
      });     

      test.it('selecting a heat map rectangle on the right image updates the data table', function() {
        teamPage.drawBoxOnCatcherHeatMap('right', 130,220,120,49);  

        teamPage.getOverviewTableStat(10).then(function(strkFrmd) {
          assert.isAtMost(strkFrmd, 61, 'StrkFrmd');
        });        
      });   

      test.it('clearing the right heat maps resets the data table', function() {
        teamPage.clearCatcherHeatMap('right');
        teamPage.getOverviewTableStat(10).then(function(strkFrmd) {
          assert.equal(strkFrmd, 169, 'StrkFrmd');
        });        
      }); 
    });

    test.describe("#filters", function() {
      test.it('adding filter: (Decisive Pitch: Yes) from sidebar displays correct data', function() {
        filters.changeFilterGroupDropdown('Pitch')
        filters.selectForBooleanDropdownSidebarFilter('Decisive Pitch:', 'Yes');

        teamPage.getOverviewTableStat(5).then(function(pitches) {
          assert.equal(pitches, 6186, 'Pitches');
        });
      });

      test.it('adding filter: (Decisive Pitch: Yes) from sidebar displays correct data', function() {
        filters.changeValuesForRangeSidebarFilter('Extension:', 5, 7);
        
        teamPage.getOverviewTableStat(5).then(function(pitches) {
          assert.equal(pitches, 5962, 'Pitches');
        });
      });

      test.it('adding filter: (Last Count: 1 Strike) from sidebar displays correct data', function() {
        filters.addSelectionToDropdownSidebarFilter('Last Count:', '1 Strike');
        
        teamPage.getOverviewTableStat(5).then(function(pitches) {
          assert.equal(pitches, 1875, 'Pitches');
        });
      });

      test.it('adding filter: (Last Horizontal Location: Outer Half) from sidebar displays correct data', function() {
        filters.addSelectionToDropdownSidebarFilter('Last Horizontal Location:', 'Outer Half');
        
        teamPage.getOverviewTableStat(5).then(function(pitches) {
          assert.equal(pitches, 1032, 'Pitches');
        });
      }); 

      test.it('adding filter: (Last Pitch Result: Take) from sidebar displays correct data', function() {
        filters.addSelectionToDropdownSidebarFilter('Last Pitch Result:', 'Take');
        
        teamPage.getOverviewTableStat(5).then(function(pitches) {
          assert.equal(pitches, 583, 'Pitches');
        });
      }); 

      test.it('adding filter: (Last Pitch Type: Fastball) from sidebar displays correct data', function() {
        filters.addSelectionToDropdownSidebarFilter('Last Pitch Type:', 'Fastball');
        
        teamPage.getOverviewTableStat(5).then(function(pitches) {
          assert.equal(pitches, 168, 'Pitches');
        });
      }); 

      test.it('adding filter: (Last Pitch Velocity: 90-100) from sidebar displays correct data', function() {
        filters.changeValuesForRangeSidebarFilter('Last Pitch Velocity:', 90, 100);
        
        teamPage.getOverviewTableStat(5).then(function(pitches) {
          assert.equal(pitches, 103, 'Pitches');
        });
      });      

      test.it('adding filter: (Last Vertical Location: Lower Half) from sidebar displays correct data', function() {
        filters.addSelectionToDropdownSidebarFilter('Last Vertical Location:', 'Lower Half');
        
        teamPage.getOverviewTableStat(5).then(function(pitches) {
          assert.equal(pitches, 77, 'Pitches');
        });
      }); 

      test.it('adding filter: (Last Zone Location: Competitve) from sidebar displays correct data', function() {
        filters.selectForBooleanDropdownSidebarFilter('Last Zone Location:', 'Competitive');

        teamPage.getOverviewTableStat(5).then(function(pitches) {
          assert.equal(pitches, 54, 'Pitches');
        });
      });

      test.it('adding filter: (PZ: 1-3) from sidebar displays correct data', function() {
        filters.changeValuesForRangeSidebarFilter('PZ:', 1, 3);
        
        teamPage.getOverviewTableStat(5).then(function(pitches) {
          assert.equal(pitches, 49, 'Pitches');
        });
      });  

      test.it('adding filter: (Plate Vel X (ft/s): -5 to 8) from sidebar displays correct data', function() {
        filters.changeValuesForRangeSidebarFilter('Plate Vel X (ft/s):', -5, 8);
        
        teamPage.getOverviewTableStat(5).then(function(pitches) {
          assert.equal(pitches, 45, 'Pitches');
        });
      });  

      test.it('adding filter: (Plate Vel Z (ft/s): -16 to -10) from sidebar displays correct data', function() {
        filters.changeValuesForRangeSidebarFilter('Plate Vel Z (ft/s):', -16, -10);
        
        teamPage.getOverviewTableStat(5).then(function(pitches) {
          assert.equal(pitches, 37, 'Pitches');
        });
      });  

      test.it('adding filter: (Spin Rate: 2000 - 2500) from sidebar displays correct data', function() {
        filters.changeValuesForRangeSidebarFilter('Spin Rate:', 2000, 2500);
        
        teamPage.getOverviewTableStat(5).then(function(pitches) {
          assert.equal(pitches, 24, 'Pitches');
        });
      });        

      test.it('clicking "default filters" returns filters back to default state', function() {
        filters.clickDefaultFiltersBtn();

        teamPage.getOverviewTableStat(5).then(function(pitches) {
          assert.equal(pitches, 23637, 'Pitches');
        });
      });        
    });

    // Video Playlist
    test.describe('#VideoPlaylist', function() {    
      test.it('clicking on a stat opens the play by play modal', function() {
        teamPage.clickOverviewTableStat(10);
        teamPage.getMatchupsAtBatHeaderText(1).then(function(text) {
          assert.equal(text, 'Vs LHB C. Dickerson (TB), Top 3, 0 Out');
        });
      });

      test.it('clicking into video opens correct video', function() {
        teamPage.clickPitchVideoIcon(1);
        teamPage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "Top 3, 0 out");
        });

        teamPage.getVideoPlaylistText(1,3).then(function(text) {
          assert.equal(text, "0-1 Fastball 93.9341 MPH ,20.3% ProbSL - Strike Looking");
        });          
      }); 

      test.after(function() {
        teamPage.closeVideoPlaylistModal();
        teamPage.closePlayByPlaytModal();
      });
    });

    test.describe("#Reports", function() {
      var reports = [
        { type: 'Pitch Types', topStat: '10.9%', statType: "Curve%" },  
        { type: 'Pitch Type Counts', topStat: 2570, statType: "Curve#" },  
        { type: 'Catcher Defense', topStat: 3, statType: "E" },  
        { type: 'Catcher Opposing Batters', topStat: 534, statType: "BB" },  
        { type: 'Catcher Pitch Rates', topStat: '46.7%', statType: "Swing%" },  
        { type: 'Catcher Pitch Counts', topStat: 2452, statType: "Miss#" },  
      ];
      reports.forEach(function(report) {
        test.it("selecting " + report.type + " shows the correct stat value for " + report.statType, function() {
          teamPage.changeReport(report.type);  
          teamPage.getOverviewTableStat(8).then(function(stat) {
            assert.equal(stat, report.topStat);
          });
        });
      });        

      test.after(function() {
        teamPage.changeReport('Catcher Framing');
      });
    });
  });

  // Roster Section
  test.describe("#Subsection: Roster", function() {
    test.before(function() {
      teamPage.goToSubSection("roster");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.describe("#filters", function() {
      test.it('adding filter: (Pitch Type: Cutter) from sidebar displays correct data', function() {
        filters.toggleSidebarFilter('Pitch Type:', 'Cutter', true);

        teamPage.getRosterTableStat(1,1).then(function(player) {
          assert.equal(player, 'Bobby Wilson');
        });

        teamPage.getRosterTableStat(1,7).then(function(slaa) {
          assert.equal(slaa, 0.65, 'Bobby Wilson SLAA');
        });          
      });

      test.it('adding filter: (Prob Called Strike: 0 to 0.5) from sidebar displays correct data', function() {
        filters.changeFilterGroupDropdown('Pitch');
        filters.changeValuesForRangeSidebarFilter('Prob of Called Strike:', 0, 0.5);

        teamPage.getRosterTableStat(1,6).then(function(stat) {
          assert.equal(stat, 200, 'Pitches');
        });
      });

      test.it('adding filter: (Current Run Diff: 0 to 1) from sidebar displays correct data', function() {
        filters.changeFilterGroupDropdown('Situation');
        filters.changeValuesForRangeSidebarFilter('Current Run Diff:', 0, 1);

        teamPage.getRosterTableStat(1,5).then(function(stat) {
          assert.equal(stat, 6, 'Bryan Holaday BF');
        });
      });
      
      test.it('adding filter: (Current Opp Runs Scored: 0 to 3) from sidebar displays correct data', function() {
        filters.changeValuesForRangeSidebarFilter('Current Opp Runs Scored:', 0, 3);

        teamPage.getRosterTableStat(1,8).then(function(stat) {
          assert.equal(stat, 112.3, 'Bobby Wilson SL+');
        });
      }); 

      test.it('adding filter: (Current Team Runs Scored: 0 to 3) from sidebar displays correct data', function() {
        filters.changeValuesForRangeSidebarFilter('Current Team Runs Scored:', 0, 3);

        teamPage.getRosterTableStat(1,6).then(function(stat) {
          assert.equal(stat, 86, 'Bobby Wilson Pitches');
        });
      }); 

      test.it('clicking "default filters" returns filters back to default state', function() {
        filters.clickDefaultFiltersBtn();

        teamPage.getRosterTableStat(1,6).then(function(stat) {
          assert.equal(stat, 5515, 'Bobby Wilson Pitches');
        });
      }); 
    });
  });

  // Game Logs Section
  test.describe("#Subsection: Game Log", function() {
    test.before(function() {
      teamPage.goToSubSection("gameLog");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('should show the correct game data for 10/2/2016', function() {
      teamPage.getGameLogTableStat(1,3).then(function(date) {
        assert.equal(date, '10/2/2016');
      });

      teamPage.getGameLogTableStat(1,4).then(function(score) {
        assert.equal(score, 'L 4-6');
      });      

      teamPage.getGameLogTableStat(1,8).then(function(slaa) {
        assert.equal(slaa, -6.41, 'row 1 SLAA column');
      });            
    });

    // Video Playlist
    test.describe('#VideoPlaylist', function() {    
      test.it('clicking on a stat opens the play by play modal', function() {
        teamPage.clickGameLogTableStat(1,6);
        teamPage.getMatchupsAtBatHeaderText(1).then(function(text) {
          assert.equal(text, 'Vs RHB L. Forsythe (TB), Top 1, 0 Out');
        });
      });

      test.it('clicking into video opens correct video', function() {
        teamPage.clickPitchVideoIcon(2);
        teamPage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "Top 1, 0 out");
        });

        teamPage.getVideoPlaylistText(1,3).then(function(text) {
          assert.equal(text, "0-1 Changeup 85.1066 MPH ,98.1% ProbSL - Ground Out");
        });          
      }); 

      test.after(function() {
        teamPage.closeVideoPlaylistModal();
        teamPage.closePlayByPlaytModal();
      });
    });    

    test.describe("#filters", function() {
      test.it('adding filter: (Vs Team: LA Angels) from sidebar displays correct data', function() {
        filters.addSelectionToDropdownSidebarFilter("Vs Team:", "LA Angels", true);

        teamPage.getGameLogTableStat(1,3).then(function(date) {
          assert.equal(date, '9/21/2016');
        });

        teamPage.getGameLogTableStat(1,6).then(function(bf) {
          assert.equal(bf, 38, 'row 1 batters faced');
        });          

        teamPage.getGameLogTableStat(1,10).then(function(frmRaa) {
          assert.equal(frmRaa, -0.07, 'row 1 FrmRAA');
        });                  
      });

      test.after(function() {
        filters.closeDropdownFilter('Vs Team:');
      });
    });
  });     

  // Pitch Logs
  test.describe("#Subsection: Pitch Log", function() {
    test.before(function() {
      teamPage.goToSubSection("pitchLog");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.describe('when selecting filter (Exit Direction: 0-30)', function() {
      test.before(function() {
        filters.changeValuesForRangeSidebarFilter('Exit Direction:', 0, 30);
      });
      
      test.it('should show the correct at bat header text', function() {
        teamPage.getMatchupsAtBatHeaderText(1).then(function(text) {
          assert.equal(text, "Vs LHB C. Dickerson (TB), Top 3, 0 Out");
        });
      });

      test.it('should show the correct row data', function() {
        teamPage.getMatchupsPitchText(1,4).then(function(pitch) {
          assert.equal(pitch, 'Fastball');
        });
        teamPage.getMatchupsPitchText(1,6).then(function(probSL) {
          assert.equal(probSL, '88.4%');
        });
      });

      test.it('selecting "Play Top 25" videos adds 25 videos to playlist', function() {
        teamPage.selectFromPlayVideosDropdown('Play Top 25');
        teamPage.getVideoPlaylistCount().then(function(videoCount) {
          assert.equal(videoCount, 25, '# videos on playlist');
        });
      });  

      test.it('when clicking flat view tab it should show the correct stats', function() {
        teamPage.closeVideoPlaylistModal();
        teamPage.clickFlatViewTab();
        teamPage.getFlatViewPitchText(1,2).then(function(num) {
          assert.equal(num, 5, 'row 1 Num pithes');
        });

        teamPage.getFlatViewPitchText(1,3).then(function(count) {
          assert.equal(count, '0-2', 'row 1 count');
        });
      });
    });

    test.after(function() {
      filters.closeDropdownFilter('Exit Direction:');
    });
  });

  // Occurences & Streaks
  test.describe('#SubSection: Occurrences & Streaks', function() {
    test.before(function() {
      teamPage.goToSubSection("occurrencesAndStreaks");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('changing the main constraint should show the correct section header', function() {
      teamPage.changeMainConstraint("Streaks Of", "At Least", 1, "CS (Catching)", "In a Game", "Within a Season");
      teamPage.getStreaksSectionHeaderText(1).then(function(text) {
        assert.equal(text, "3 Times");
      });

      teamPage.getStreaksTableStat(1,4).then(function(stat) {
        assert.equal(stat, 1);
      });
    });
  });
});