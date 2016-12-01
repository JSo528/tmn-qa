var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var constants = require('../../../lib/constants.js');

// Page Objects
var Navbar = require('../../../pages/mlb/navbar.js');
var Filters = require('../../../pages/mlb/filters.js');
var PlayerPage = require('../../../pages/mlb/players/player_page.js');

var navbar, filters, playerPage;

test.describe('#Player Batting Section', function() {
  test.before(function() {  
    navbar  = new Navbar(driver);  
    filters  = new Filters(driver);  
    playerPage = new PlayerPage(driver);

    navbar.search('Jose Altuve', 1);
  });  

  test.it('should be on Jose Altuve 2016 player page', function() {
    playerPage.getPlayerName().then(function(text) {
      assert.equal( text, 'Jose Altuve');
    });
  });

  // Overview Section
  test.describe("#Subsection: Overview", function() {
    // Heat Map & Hit Charts
    test.describe("#Heat Maps & Hit Charts", function() {
      test.it('has the correct number of plot points (hits) initially', function() {
        playerPage.getHitChartHitCount().then(function(hitCount) {
          assert.equal(hitCount, 224);
        });
      });

      test.it('selecting a heat map rectangle updates the hit chart', function() {
        playerPage.drawBoxOnHeatMap(150,150,100,40);

        playerPage.getHitChartHitCount('single').then(function(count) {
          assert.equal(count, 31, 'correct number of singles');
        });
        
        playerPage.getHitChartHitCount('double').then(function(count) {
          assert.equal(count, 9, 'correct number of doubles');
        });        

        playerPage.getHitChartHitCount('triple').then(function(count) {
          assert.equal(count, 1, 'correct number of triples');
        });        

        playerPage.getHitChartHitCount('homeRun').then(function(count) {
          assert.equal(count, 10, 'correct number of home runs');
        });        
      });      

      test.it('selecting a heat map rectangle updates the data table', function() {
        playerPage.getOverviewTableStat(6,5).then(function(count) {
          assert.equal(count, 325, 'correct number of pitches');
        });              
      });            

      test.it('clicking a hit chart hit shows pitches on the heat map', function() {
        playerPage.clickHitChartPoint(1);
        playerPage.getHeatMapPitchCount().then(function(pitches) {
          assert.equal(pitches, 3);
        });
      });

      test.it('clicking a hit chart hit shows pitches on the team grid', function() {
        playerPage.getHeatMapPitchCount().then(function(pitches) {
          assert.equal(pitches, 3);
        });
      });  

      test.it('pitch view shows 500 pitches', function() {
        playerPage.clickPitchViewLink();
        playerPage.getPitchViewPitchCount().then(function(pitches) {
          assert.equal(pitches, 500);
        });
      });    

      test.it('clearing the heat maps resets the hit chart', function() {
        playerPage.clickHeatMapLink();
        playerPage.clearHeatMap();
        playerPage.getHitChartHitCount().then(function(hitCount) {
          assert.equal(hitCount, 224);
        });
      });                 

      test.it('clearing the heat maps resets the data table', function() {
        playerPage.getOverviewTableStat(6,5).then(function(count) {
          assert.equal(count, 2474, 'correct number of pitches');
        });        
      }); 
    });

    // eBIS Modal
    test.describe("#eBIS Modal", function() {
      test.it('modal shows the correct data', function() {
        playerPage.clickEbisModalBtn();
        playerPage.getEbisModalText(1, 3).then(function(data) {
          assert.equal(data, 'Draft: Not Drafted', 'Jose Altuve draft information');
        });
      });

      test.after(function() {
        playerPage.clickCloseEbisModalBtn();
      })
    })

    // Visual Mode Dropdown
    test.describe("#visual modes", function() {
      var visualModes = [
        { type: 'SLG', title: 'SLG' },  
        { type: 'ISO', title: 'ISO' },  
        { type: 'wOBA', title: 'wOBA' },  
        { type: 'Expected BA', title: 'ExAVG' },  
        { type: 'Expected SLG', title: 'ExSLG' },  
        { type: 'Expected ISO', title: 'ExISO' },  
        { type: 'Expected wOBA', title: 'ExWOBA' },  
        { type: 'In Play BA', title: 'BA' },  
        { type: 'In Play SLG', title: 'SLG' },  
        { type: 'In Play ISO', title: 'ISO' },  
        { type: 'Line Drive Rate', title: 'Line%' },
        { type: 'Groundball Rate', title: 'Ground%' },  
        { type: 'Flyball Rate', title: 'Fly%' },  
        { type: 'Flyball Distance', title: 'FBDst' },  
        { type: 'Exit Velocity', title: 'ExitVel' },  
        { type: 'Forward Velocity', title: 'ForwVel' },  
        { type: 'Efficient Velocity', title: 'EffVel' },  
        // { type: 'Pitch Frequency', title: 'Pitch Frequency' }, // looks like this doesn't follow the pattern of the others
        // { type: 'Release Velocity', title: 'Release Velocity' },  // TODO - looks like its broken
        { type: 'Called Strike Rate', title: 'CallStrk%' },  
        { type: 'Strike Looking Above Average', title: 'SLAA' },  
        { type: 'Correct Call Rate', title: 'CC%' },  
        { type: 'Strike Rate', title: 'Strike%' }, // selecting wrong option, need to change dropdown so it selects based off of text  
        { type: 'Ball Rate', title: 'Ball%' },  
        { type: 'Swing Rate', title: 'Swing%' },  
        { type: 'Contact Rate', title: 'Contact%' },  
        { type: 'Miss Rate', title: 'Miss%' },  
        { type: 'In Play Rate', title: 'InPlay%' },  
        { type: 'Foul Rate', title: 'Foul%' }  
      ];

      visualModes.forEach(function(visualMode) {
        test.it("selecting " + visualMode.type + " shows the correct title ", function() {
          playerPage.changeVisualMode(visualMode.type);
          playerPage.getHeatMapImageTitle().then(function(title) {
            assert.equal(title, visualMode.title);
          });
        });
      });        
    });

    // Grid Mode Dropdown
    test.describe("#grid modes", function() {
      var gridModes = [
        { mode: 'HOTCOLD' },  
        { mode: 'HOT' },  
        { mode: 'COLD' },  
        { mode: 'CONTINUOUS' },  
        
      ];

      gridModes.forEach(function(gridMode) {
        test.it("selecting " + gridMode.mode + " gets he correct grid mode", function() {
          playerPage.changeGridMode(gridMode.mode);
          playerPage.getGridHrefMode().then(function(mode) {
            assert.equal(mode, gridMode.mode);
          });
        });
      });        
    });

    // Video Playlist
    // TODO - these aren't correct values bc feature is currently broken
    test.describe('#VideoPlaylist', function() {    
      test.it('clicking on a stat opens the play by play modal', function() {
        playerPage.clickOverviewTableStat(1,7);
        playerPage.getMatchupsAtBatHeaderText(1).then(function(text) {
          assert.equal(text, 'Vs RHP A. Sanchez (TOR), Bot 1, 2 Out');
        });
      });

      test.it('clicking into video opens correct video', function() {
        playerPage.clickPitchVideoIcon(1);
        playerPage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "Bot 1, 2 out");
        });

        playerPage.getVideoPlaylistText(1,3).then(function(text) {
          assert.equal(text, "2-2 Fastball 98 MPH");
        });          
      }); 

      test.after(function() {
        playerPage.closeVideoPlaylistModal();
        playerPage.closePlayByPlaytModal();
      });
    });

    test.describe("#Reports", function() {
      var reports = [
        { type: 'Counting', topStat: 216, statType: "H" },  
        { type: 'Pitch Rates', topStat: "36.4%", statType: "Foul%" },  
        { type: 'Pitch Count', topStat: 1132, statType: "InZone#" },  
        { type: 'Pitch Types', topStat: "5.4%", statType: "Sinker%" },  
        { type: 'Pitch Type Counts', topStat: 132, statType: "Sinker#" },  
        { type: 'Pitch Locations', topStat: "48.0%", statType: "LowHalf%" },  
        { type: 'Pitch Calls', topStat: 15, statType: "BallFrmd" },  
        { type: 'Hit Types', topStat: 253, statType: "Ground#" },  
        { type: 'Hit Locations', topStat: "29.8%", statType: "HLftCtr%" },  
        { type: 'Home Runs', topStat: 18, statType: "HRPull" },  
        { type: 'Exit Data', topStat: 0.008, statType: "ExSLGDf" },  
        
      ];
      reports.forEach(function(report) {
        test.it("selecting " + report.type + " shows the correct stat value for " + report.statType, function() {
          playerPage.changeReport(report.type);  
          // 2016 Season, 12th Col
          playerPage.getOverviewTableStat(6,12).then(function(stat) {
            assert.equal(stat, report.topStat, '2016 Season: ' + report.statType);
          });
        });
      });        

      test.after(function() {
        playerPage.changeReport('Rate');
      });
    });
  });

  // Game Logs Section
  test.describe("#Subsection: Game Log", function() {
    test.before(function() {
      playerPage.goToSubSection("gameLog");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('should show the correct game data for 10/2/2016', function() {
      playerPage.getGameLogTableStat(1,4).then(function(date) {
        assert.equal(date, '10/2/2016');
      });

      playerPage.getGameLogTableStat(1,5).then(function(score) {
        assert.equal(score, 'L 1-8', 'Score of game');
      });      

      playerPage.getGameLogTableStat(1,9).then(function(ab) {
        assert.equal(ab, 4, '# of AtBats');
      });            
    });

    // Video Playlist
    test.describe('#VideoPlaylist', function() {    
      test.it('clicking on a stat opens the play by play modal', function() {
        playerPage.clickGameLogTableStat(1,7);
        playerPage.getMatchupsAtBatHeaderText(1).then(function(text) {
          assert.equal(text, 'Vs RHP J. Chacin (LAA), Top 1, 1 Out');
        });
      });

      test.it('clicking into video opens correct video', function() {
        playerPage.clickPitchVideoIcon(2);
        playerPage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "Top 1, 1 out");
        });

        playerPage.getVideoPlaylistText(1,3).then(function(text) {
          assert.equal(text, "0-0 Slider 85 MPH");
        });          
      }); 

      test.after(function() {
        playerPage.closeVideoPlaylistModal();
        playerPage.closePlayByPlaytModal();
      });
    });

    test.describe("#filters", function() {
      test.it('adding filter: (Batted Ball: Hard Ground Ball) from sidebar displays correct data', function() {
        filters.toggleSidebarFilter("Batted Ball:", 'Hard Ground Ball', true);

        playerPage.getGameLogTableStat(1,4).then(function(date) {
          assert.equal(date, '10/2/2016');
        });

        playerPage.getGameLogTableStat(1,9).then(function(ab) {
          assert.equal(ab, 1, '# of AtBats');
        });          

        playerPage.getGameLogTableStat(1,10).then(function(ba) {
          assert.equal(ba, 0.000, 'BA');
        });                  
      });

      test.after(function() {
        filters.toggleSidebarFilter("Batted Ball:", 'Hard Ground Ball', false);
      })
    });
  });  

  // Splits Section
  test.describe("#Subsection: Splits", function() {
    test.before(function() {
      playerPage.goToSubSection("splits");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
      filters.toggleSidebarFilter("Men On:", 'Empty', true);
    });

    test.it('should show the correct data in the lhp/rhp subsection', function() {
      playerPage.getSplitsTableStat(5,1).then(function(rowTitle) {
        assert.equal(rowTitle, 'vs LHP', 'vs LHP title');
      });             

      playerPage.getSplitsTableStat(5,3).then(function(pitches) {
        assert.equal(pitches, 408, 'vs LHP pitches');
      });             

      playerPage.getSplitsTableStat(6,1).then(function(rowTitle) {
        assert.equal(rowTitle, 'vs RHP', 'vs RHP title');
      });                   

      playerPage.getSplitsTableStat(6,6).then(function(ba) {
        assert.equal(ba, 0.352, 'vs RHP ba');
      });                         
    });

    test.describe("#Reports", function() {
      var reports = [
        { type: 'Counting', topStat: 128, statType: "H" },  
        { type: 'Pitch Rates', topStat: "0.0%", statType: "Foul%" },  
        { type: 'Pitch Count', topStat: 258, statType: "InZone#" },  
        { type: 'Pitch Types', topStat: "7.3%", statType: "Sinker%" },  
        { type: 'Pitch Type Counts', topStat: 25, statType: "Sinker#" },  
        { type: 'Pitch Locations', topStat: "49.4%", statType: "LowHalf%" },  
        { type: 'Pitch Calls', topStat: 0, statType: "BallFrmd" },  
        { type: 'Hit Types', topStat: 152, statType: "Ground#" },  
        { type: 'Hit Locations', topStat: "32.2%", statType: "HLftCtr%" },  
        { type: 'Home Runs', topStat: 12, statType: "HRPull" },  
        { type: 'Exit Data', topStat: 0.007, statType: "ExSLGDf" },  
        
      ];
      reports.forEach(function(report) {
        test.it("selecting " + report.type + " shows the correct stat value for " + report.statType, function() {
          playerPage.changeReport(report.type);  
          // 2016 Season, In Play, 10th Col
          playerPage.getSplitsTableStat(2,10).then(function(stat) {
            assert.equal(stat, report.topStat, '2016 Season: ' + report.statType);
          });
        });
      });        
    }); 

    test.after(function() {
      filters.toggleSidebarFilter("Men On:", 'Empty', false);
    })                        
  });      

  // Pitch Logs
  test.describe("#Subsection: Pitch Log", function() {
    test.before(function() {
      playerPage.goToSubSection("pitchLog");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.describe('when selecting filter (Batted Ball Angle Range: 0 - 10)', function() {
      test.before(function() {
        filters.changeFilterGroupDropdown('PA');
        filters.changeValuesForRangeSidebarFilter('Batted Ball Angle Range:', 0, 10);
      });
      
      test.it('should show the correct at bat header text', function() {
        playerPage.getMatchupsAtBatHeaderText(1).then(function(text) {
          assert.equal(text, "Vs RHP N. Vincent (SEA), Bot 11, 1 Out");
        });
      });

      test.it('should show the correct row data', function() {
        playerPage.getMatchupsPitchText(1,4).then(function(pitch) {
          assert.equal(pitch, 'Fastball');
        });
        playerPage.getMatchupsPitchText(1,6).then(function(pitch) {
          assert.equal(pitch, 'Single on a Line Drive');
        });
      });
    });

    test.describe('when clicking flat view tab', function() {
      test.it('should show the correct stats', function() {
        playerPage.clickFlatViewTab();
        playerPage.getFlatViewPitchText(1,2).then(function(num) {
          assert.equal(num, '5', 'row 1 Num (pitches) col');
        });

        playerPage.getFlatViewPitchText(1,3).then(function(count) {
          assert.equal(count, '1-2', 'row 1 count');
        });
      });
    })

    test.after(function() {
      filters.closeDropdownFilter('Batted Ball Angle Range:');
    });
  });

  // Occurences & Streaks
  test.describe('#SubSection: Occurrences & Streaks', function() {
    test.before(function() {
      playerPage.goToSubSection("occurrencesAndStreaks");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('changing the main constraint should show the correct section header', function() {
      playerPage.changeMainConstraint("Streaks Of", "At Least", 1, "H (Batting)", "In a Game", "Within a Season");
      playerPage.getStreaksSectionHeaderText().then(function(text) {
        assert.equal(text, "12 Times", 'Longest Streak');
      });

      playerPage.getStreaksTableStat(1,4).then(function(stat) {
        assert.equal(stat, 3, 'hits on 6/6/2016');
      });
    });
  });

  // Multi-Filter
  test.describe('#SubSection: Multi-Filter', function() {
    test.before(function() {
      playerPage.goToSubSection("multiFilter");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('should show the correct data initially', function() {
      playerPage.getMultiFilterStat(1,1).then(function(rowTitle) {
        assert.equal(rowTitle, 'top');
      });

      playerPage.getMultiFilterStat(2,1).then(function(rowTitle) {
        assert.equal(rowTitle, 'bottom');
      });      

      playerPage.getMultiFilterStat(1,8).then(function(slg) {
        assert.equal(slg, 0.531, 'top slg');
      });
    });

    // doing a notEqual because drawing the same box doesnt always lead to the exact same stats
    test.it('drawing a box on the heat map should update the stats table for both sections', function() {
      var originalPitches;
      playerPage.getMultiFilterStat(1,3).then(function(pitches) {
        originalPitches = pitches;
      });

      playerPage.drawBoxOnMultiFilterHeatMap('top', 160,120,25,25);

      playerPage.getMultiFilterStat(1, 3).then(function(pitches) {
        assert.notEqual(pitches, originalPitches, 'correct number of pitches for top row');
      });        

      playerPage.getMultiFilterStat(2, 3).then(function(pitches) {
        assert.notEqual(pitches, originalPitches, 'correct number of pitches for bottom row');
      });        
    });

    // doing less than because of the same reason as above
    test.it('drawing a box on the heat map should update the hit chart for both sections', function() {
      playerPage.getMultiFilterHitChartHitCount('top').then(function(count) {
        assert.isAtMost(count, 4, 'correct number of hits for top hitChart');
      });      

      playerPage.getMultiFilterHitChartHitCount('bottom').then(function(count) {
        assert.isAtMost(count, 4, 'correct number of hits for bottom hitChart');
      });            
    });    

    test.it('when sync is turned on, both heat maps should update ', function() {
      playerPage.changeMultiFilterVisualMode('top', 'ISO');

      playerPage.getMultiFilterHeatMapImageTitle('top').then(function(title) {
        assert.equal(title, 'ISO', "top heat map has title 'ISO'");
      });

      playerPage.getMultiFilterHeatMapImageTitle('bottom').then(function(title) {
        assert.equal(title, 'ISO', "bottom heat map has title 'ISO'");
      });
    });

    test.it('when sync is turned off, changing the top should not change the bottom', function() {
      playerPage.changeMultiFilterVisualMode('bottom', 'BA');
      playerPage.changeMultiFilterVisualMode('top', 'SLG');

      playerPage.getMultiFilterHeatMapImageTitle('top').then(function(title) {
        assert.equal(title, 'SLG', "top heat map has title 'SLG'");
      });

      playerPage.getMultiFilterHeatMapImageTitle('bottom').then(function(title) {
        assert.equal(title, 'BA', "bottom heat map has title 'BA'");
      });     
    });
  });

  // Comps
  test.describe('#SubSection: Comps', function() {
    test.before(function() {
      playerPage.goToSubSection("comps");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('selecting Robinson Cano on comp 2 search should add him to table', function() {
      playerPage.selectForCompSearch(2, 'Robinson Cano');
      playerPage.getCompTableStat(2,1).then(function(playerName) {
        assert.equal(playerName, 'Robinson Cano');
      });

      playerPage.getCompTableStat(2,6).then(function(obp) {
        assert.equal(obp, 0.298);
      });
    });
  });

  // Matchups
  test.describe('#SubSection: Matchups', function() {
    test.before(function() {
      playerPage.goToSubSection("matchups");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('should show the correct data in the table', function() {
      playerPage.getMatchupsAtBatHeaderText(1).then(function(sectionHeaderText) {
        assert.equal(sectionHeaderText, 'Vs RHP J. Chacin (LAA), Top 1, 1 Out', 'header for 1st at bat');
      });
    }); 

    test.it('selecting Feilx Hernandez on comp 2 search should update the pitch log', function() {
      playerPage.selectForCompSearch(2, 'Felix Hernandez');
      playerPage.getMatchupsAtBatHeaderText(1).then(function(sectionHeaderText) {
        assert.equal(sectionHeaderText, 'Vs RHP F. Hernandez (SEA), Bot 1, 1 Out');
      });
    });

    test.it('video playlist displays correct side information', function() {
      playerPage.clickPitchVideoIcon(1);
      playerPage.getVideoPlaylistText(2,1).then(function(text) {
        assert.equal(text, 'Bot 1, 1 out', '2nd video, top line');
      });

      playerPage.getVideoPlaylistText(2,2).then(function(text) {
        assert.equal(text, 'Vs RHP F. Hernandez (SEA)');
      });      
    });  
  });  

  // Vs. Teams
  test.describe("#Subsection: Vs Teams", function() {
    test.before(function() {
      playerPage.goToSubSection("vsTeams");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('should show the correct data', function() {
      playerPage.getVsTableStat(1,6).then(function(ba) {
        assert.equal(ba, 0.500, 'ba against Min');
      });                                   
    });

    test.describe("#filters", function() {
      test.it('adding filter: (Venue: Away) displays correct data', function() {
        filters.toggleSidebarFilter("Venue:", "Away", true);

        playerPage.getVsTableStat(2,9).then(function(ops) {
          assert.equal(ops, 1.163, 'OPS against BOS');
        });                                   
      });

      test.after(function() {
        filters.toggleSidebarFilter("Venue:", "Away", false);
      });
    });                 
  });   

  // Vs. Pitchers
  test.describe("#Subsection: Vs Pitchers", function() {
    test.before(function() {
      playerPage.goToSubSection("vsPitchers");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('should show the correct data', function() {
      playerPage.getVsTableStat(1,2).then(function(pitcher) {
        assert.equal(pitcher, 'Danny Duffy', '1st row pitcher');
      });         

      playerPage.getVsTableStat(1,7).then(function(ba) {
        assert.equal(ba, 1.000, '2nd row ba');
      });                                           
    });

    test.describe("#filters", function() {
      test.it('adding filter: (Opp Org: Oak) displays correct data', function() {
        filters.changeFilterGroupDropdown("Season");
        filters.addSelectionToDropdownSidebarFilter("Opp Org:", "Oak");

        playerPage.getVsTableStat(1,2).then(function(pitcher) {
          assert.equal(pitcher, 'Dillon Overton', '1st row pitcher');
        });                                   

        playerPage.getVsTableStat(1,5).then(function(pa) {
          assert.equal(pa, 3, '1st row PA');
        });                                           
      });

      test.after(function() {
        filters.removeSelectionFromDropdownSidebarFilter("Opp Org:", "Oak");
      })
    });                 
  });  

  // Defensive Positioning
  test.describe("#Subsection: Defensive Positioning", function() {
    test.before(function() {
      playerPage.goToSubSection("defensivePositioning");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.describe('clicking into OF Area', function() {
      test.it('clicking a statcast fielding event shoud show correct data in modal', function() {
        playerPage.clickStatcastFieldingChartEvent(1);
        playerPage.getStatcastFieldingModalTitle().then(function(title) {
          assert.equal(title, 'Pop up Play by Play', 'modal title');
        });

        playerPage.getStatcastFieldingModalTableHeader(1).then(function(header) {
          assert.equal(header, 'Inn', '1st col header');
        });

        playerPage.getStatcastFieldingModalTableHeader(3).then(function(header) {
          assert.equal(header, 'Opp', '3rd col header');
        });

        playerPage.getStatcastFieldingModalTableHeader(8).then(function(header) {
          assert.equal(header, 'OutProb', '8th col header');
        });

        playerPage.getStatcastFieldingModalTableHeader(9).then(function(header) {
          assert.equal(header, 'PosIndOutProb', '9th col header');
        });  
      });

      test.after(function() {
        playerPage.closeStatcastFieldingModal();
      });
    });

    // Video Playlist
    // TODO - feature currently broken so fix these tests once feature is fixed
    test.describe('#VideoPlaylist', function() {    
      test.it('clicking on a stat opens the play by play modal', function() {
        playerPage.clickDefensivePositioningTableStat(1,6);
        playerPage.getMatchupsAtBatHeaderText(1).then(function(text) {
          assert.equal(text, 'Vs RHP A. Sanchez (TOR), Bot 1, 2 Out');
        });
      });

      test.it('clicking into video opens correct video', function() {
        playerPage.clickPitchVideoIcon(2);
        playerPage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "Bot 1, 2 out");
        });

        playerPage.getVideoPlaylistText(1,3).then(function(text) {
          assert.equal(text, "2-2 Fastball 98 MPH");
        });          
      }); 

      test.after(function() {
        playerPage.closeVideoPlaylistModal();
        playerPage.closePlayByPlaytModal();
      });
    });


    test.describe('changing ballpark', function() {
      test.it('should change background image for fielding widget', function() {
        playerPage.changeBallparkDropdown('Fenway Park');
        playerPage.getCurrentBallparkImageID().then(function(id) {
          assert.equal(id, 'BOS_3', 'image id');
        });
      });   
    });
  });
});