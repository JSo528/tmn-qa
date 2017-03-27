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

test.describe('#Player Pitching Section', function() {
  test.before(function() {  
    navbar  = new Navbar(driver);  
    filters  = new Filters(driver);  
    playerPage = new PlayerPage(driver, 'pitching');

    navbar.search('Kyle Hendricks', 1);
  });  

  test.it('should be on Kyle Hendricks 2016 player page', function() {
    playerPage.getPlayerName().then(function(text) {
      assert.equal( text, 'Kyle Hendricks');
    });
  });

  // Overview Section
  test.describe("#Subsection: Overview", function() {
    // Heat Map & Hit Charts
    test.describe("#Heat Maps & Hit Charts", function() {
      test.it('has the correct number of plot points (hits) initially', function() {
        playerPage.getHitChartHitCount().then(function(hitCount) {
          assert.equal(hitCount, 149);
        });
      });

      test.it('selecting a heat map rectangle updates the hit chart', function() {
        playerPage.drawBoxOnOverviewHeatMap(150,150,100,40);

        playerPage.getHitChartHitCount('single').then(function(count) {
          assert.equal(count, 11, 'correct number of singles');
        });
        
        playerPage.getHitChartHitCount('double').then(function(count) {
          assert.equal(count, 4, 'correct number of doubles');
        });        

        playerPage.getHitChartHitCount('triple').then(function(count) {
          assert.equal(count, 0, 'correct number of triples');
        });        

        playerPage.getHitChartHitCount('homeRun').then(function(count) {
          assert.equal(count, 4, 'correct number of home runs');
        });        
      });      

      test.it('selecting a heat map rectangle updates the data table', function() {
        playerPage.getOverviewTableStat(5,4).then(function(count) {
          assert.equal(count, 271, '2016 Season - # of pitches');
        });              
      });            

      test.it('clicking a hit chart hit shows pitches on the heat map', function() {
        playerPage.clickHitChartPlotPoint();
        playerPage.getOverviewHeatMapPitchCount().then(function(pitches) {
          assert.equal(pitches, 1);
        });
      });

      test.it('clicking a hit chart hit shows pitches on the team grid', function() {
        playerPage.getOverviewHeatMapPitchCount().then(function(pitches) {
          assert.equal(pitches, 1);
        });
      });  

      test.it('pitch view shows 500 pitches', function() {
        playerPage.clickPitchViewLink();
        playerPage.getOverviewPitchViewPitchCount().then(function(pitches) {
          assert.equal(pitches, 500);
        });
      });    

      test.it('clearing the heat maps resets the data table', function() {
        playerPage.clickHeatMapLink();
        playerPage.clearOverviewHeatMap();
        playerPage.getOverviewTableStat(10,4).then(function(count) {
          assert.equal(count, 2888, '2016 season - # of pitches');
        });        
      }); 
    });

    // eBIS Modal
    test.describe("#eBIS Modal", function() {
      test.it('modal shows the correct data', function() {
        playerPage.clickEbisModalBtn();
        playerPage.getEbisModalText(1, 3).then(function(data) {
          assert.equal(data, 'Draft: 2011 Round 8, Pick 264, TEX', 'draft information');
        });
      });

      test.after(function() {
        playerPage.clickCloseEbisModalBtn();
      })
    })

    // Grid Mode Dropdown
      test.describe("#grid modes", function() {
      var visualModes = [
        { mode: 'HOTCOLD' },  
        { mode: 'HOT' },  
        { mode: 'COLD' },  
        { mode: 'CONTINUOUS' },  
      ];

      visualModes.forEach(function(visualMode) {
        test.it("selecting " + visualMode.mode + " gets the correct grid mode", function() {
          playerPage.changeGridMode(visualMode.mode);
          playerPage.getGridHrefMode().then(function(mode) {
            assert.equal(mode, visualMode.mode);
          });
        });
      });        
    });

    // Video Playlist
    test.describe('#VideoPlaylist', function() {    
      test.it('clicking on a stat opens the play by play modal', function() {
        playerPage.clickOverviewTableStat(8,13);
        playerPage.getMatchupsAtBatHeaderText(1).then(function(text) {
          assert.equal(text, 'Vs LHB M. Carpenter (STL), Top 1, 0 Out');
        });
      });

      test.it('clicking into video opens correct video', function() {
        playerPage.clickPitchVideoIcon(1);
        playerPage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "Top 1, 0 out");
        });

        playerPage.getVideoPlaylistText(1,3).then(function(text) {
          assert.equal(text, "2-2 Changeup 81.1 MPH ,18.1% ProbSL");
        });          
      }); 

      test.after(function() {
        playerPage.closeVideoPlaylistModal();
        playerPage.closePlayByPlaytModal();
      });
    });      

    test.describe("#Reports", function() {
      var reports = [
        { type: 'Rate', topStat: '22.8%', statType: "K%" },  
        { type: 'Counting', topStat: 8, statType: "HBP" },  
        { type: 'Pitch Rates', topStat: "46.9%", statType: "InZone%" },  
        { type: 'Pitch Count', topStat: 483, statType: "Chase#" },  
        { type: 'Pitch Types', topStat: "0.0%", statType: "Split%" },  
        { type: 'Pitch Type Counts', topStat: 0, statType: "Split#" },  
        { type: 'Pitch Locations', topStat: "19.7%", statType: "Inside%" },  
        { type: 'Pitch Calls', topStat: 26, statType: "BallFrmd" },  
        { type: 'Hit Types', topStat: 96, statType: "Fly#" },  
        { type: 'Hit Locations', topStat: "17.2%", statType: "HDeadCtr%" },  
        { type: 'Home Runs', topStat: 2, statType: "HROpp" },  
        { type: 'Movement', topStat: '1:03', statType: "SpinDir" },  
        { type: 'Bids', topStat: 1, statType: "NH8++", colNum: 10 },  
        { type: 'Baserunning', topStat: '76.5%', statType: "SB%", colNum: 8 },  
        { type: 'Exit Data', topStat: 0.117, statType: "ExISO" },  
        
      ];
      reports.forEach(function(report) {
        test.it("selecting " + report.type + " shows the correct stat value for " + report.statType, function() {
          playerPage.changeReport(report.type);  
          // 2016 Season, 13th Col
          var col = report.colNum || 13
          playerPage.getOverviewTableStat(10,col).then(function(stat) {
            assert.equal(stat, report.topStat, '2016 Season: ' + report.statType);
          });
        });
      }); 

      test.after(function() {
        playerPage.changeReport('Traditional');
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
        assert.equal(score, 'ND 7-4', 'Score of game');
      });      

      playerPage.getGameLogTableStat(1,6).then(function(pitches) {
        assert.equal(pitches, 88, '# of Pitches');
      });            
    });


    // Video Playlist
    test.describe('#VideoPlaylist', function() {    
      test.it('clicking on a stat opens the play by play modal', function() {
        playerPage.clickGameLogTableStat(1,6);
        playerPage.getMatchupsAtBatHeaderText(1).then(function(text) {
          assert.equal(text, 'Vs RHB J. Peraza (CIN), Bot 1, 0 Out');
        });
      });

      test.it('clicking into video opens correct video', function() {
        playerPage.clickPitchVideoIcon(2);
        playerPage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "Bot 1, 0 out");
        });

        playerPage.getVideoPlaylistText(1,3).then(function(text) {
          assert.equal(text, "0-0 Fastball 86.7 MPH ,6.4% ProbSL");
        });          
      }); 

      test.after(function() {
        playerPage.closeVideoPlaylistModal();
        playerPage.closePlayByPlaytModal();
      });
    });    

    test.describe("#filters", function() {
      test.it('adding filter: (After Pitch Run Diff: -1 to 1) from sidebar displays correct data', function() {
        filters.changeFilterGroupDropdown('Situation');
        filters.changeValuesForRangeSidebarFilter('After Pitch Run Diff:', -1, 1);

        playerPage.getGameLogTableStat(1,4).then(function(date) {
          assert.equal(date, '10/2/2016');
        });

        playerPage.getGameLogTableStat(1,6).then(function(pitches) {
          assert.equal(pitches, 37, '10/2/2015 - # of Pitches');
        });          

        playerPage.getGameLogTableStat(1,21).then(function(ks) {
          assert.equal(ks, 1, '10/2/2016 - strikeouts');
        });                  
      });

      test.after(function() {
        filters.changeValuesForRangeSidebarFilter('After Pitch Run Diff:', '', '');
      })
    });
  });  

  // Splits Section
  test.describe("#Subsection: Splits", function() {
    test.before(function() {
      playerPage.goToSubSection("splits");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('should show the correct data in the lhb/rhb subsection', function() {
      playerPage.getSplitsTableStat(5,1).then(function(rowTitle) {
        assert.equal(rowTitle, 'vs LHB', 'vs LHB title');
      });             

      playerPage.getSplitsTableStat(5,2).then(function(pitches) {
        assert.equal(pitches, 1237, 'vs LHB pitches');
      });             

      playerPage.getSplitsTableStat(6,1).then(function(rowTitle) {
        assert.equal(rowTitle, 'vs RHB', 'vs RHB title');
      });                   

      playerPage.getSplitsTableStat(6,11).then(function(hits) {
        assert.equal(hits, 78, 'vs RHB hits');
      });                         
    });

    test.describe("#Reports", function() {
      var reports = [
        { type: 'Rate', topStat: '5.9%', statType: "BB%" },  
        { type: 'Counting', topStat: 28, statType: "2B" },  
        { type: 'Pitch Rates', topStat: "31.5%", statType: "Chase%" },  
        { type: 'Pitch Count', topStat: 639, statType: "CallStrk#" },  
        { type: 'Pitch Types', topStat: "0.0%", statType: "Spec%" },  
        { type: 'Pitch Type Counts', topStat: 1961, statType: "Hard#", colNum: 13 },  
        { type: 'Pitch Locations', topStat: "19.8%", statType: "HMid%" },  
        { type: 'Pitch Calls', topStat: 5.3, statType: "FrmCntRAA", colNum: 9 },  
        { type: 'Hit Types', topStat: 124, statType: "Line#" },  
        { type: 'Hit Locations', topStat: "20.5%", statType: "HRtCtr%" },  
        { type: 'Home Runs', topStat: 303.5, statType: "FBDst", colNum: 8 },   
        { type: 'Movement', topStat: 1533, statType: "SVSpin" },  
        { type: 'Bids', topStat: 8.0, statType: "NHIP", colNum: 13 },  
        { type: 'Baserunning', topStat: 13, statType: "SB", colNum: 4 },  
        { type: 'Exit Data', topStat: 0.281, statType: "ExWOBA" }        
      ];

      reports.forEach(function(report) {
        test.it("selecting " + report.type + " shows the correct stat value for " + report.statType, function() {
          playerPage.changeReport(report.type);  
          // 2016 Season, Totals, 12th Col
          var col = report.colNum || 12
          playerPage.getSplitsTableStat(1,col).then(function(stat) {
            assert.equal(stat, report.topStat, '2016 Season: ' + report.statType);
          });
        });
      });        
    }); 
  });      

  // Pitch Logs
  test.describe("#Subsection: Pitch Log", function() {
    test.before(function() {
      playerPage.goToSubSection("pitchLog");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.describe('when selecting filter (Catchers: Miguel Montero)', function() {
      test.before(function() {
        filters.changeFilterGroupDropdown('Situation');
        filters.addSelectionToDropdownSidebarFilter('Catchers:', 'Miguel Montero');
      });
      
      test.it('should show the correct at bat header text', function() {
        playerPage.getMatchupsAtBatHeaderText(1).then(function(text) {
          assert.equal(text, "Vs LHB J. Villar (MIL), Top 1, 0 Out");
        });
      });

      test.it('should show the correct row data', function() {
        playerPage.getMatchupsPitchText(1,4).then(function(pitch) {
          assert.equal(pitch, 'Fastball');
        });
        playerPage.getMatchupsPitchText(1,6).then(function(pitch) {
          assert.equal(pitch, 'Strike Looking');
        });
      });
    });

    test.describe('when clicking flat view tab', function() {
      test.it('should show the correct stats', function() {
        playerPage.clickFlatViewTab();
        playerPage.getFlatViewPitchText(1,2).then(function(num) {
          assert.equal(num, '1', 'row 1 Num (pitches) col');
        });

        playerPage.getFlatViewPitchText(1,3).then(function(count) {
          assert.equal(count, '0-0', 'row 1 count');
        });
      });
    })

    test.after(function() {
      filters.closeDropdownFilter('Catchers:');
    });
  });

  // Occurrences & Streaks
  test.describe('#SubSection: Occurrences & Streaks', function() {
    test.before(function() {
      playerPage.goToSubSection("occurrencesAndStreaks");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('changing the main constraint should show the correct section header', function() {
      playerPage.changeMainConstraint("Streaks Of", "At Least", 1, "W (Pitching)", "In a Game", "Within a Season");
      playerPage.getStreaksSectionHeaderText().then(function(text) {
        assert.equal(text, "4 Times", 'Longest Streak');
      });

      playerPage.getStreaksTableStat(1,4).then(function(stat) {
        assert.equal(stat, 1, 'wins on 9/12/2016');
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

      playerPage.getMultiFilterStat(1,7).then(function(winPer) {
        assert.equal(winPer, 0.667, 'top win%');
      });
    });

    // doing a notEqual because drawing the same box doesnt always lead to the exact same stats
    test.it('drawing a box on the heat map should update the stats table for both sections', function() {
      var originalPitches;
      playerPage.getMultiFilterStat(1,2).then(function(pitches) {
        originalPitches = pitches;
      });

      playerPage.drawBoxOnMultiFilterHeatMap('top', 160,120,25,25);

      playerPage.getMultiFilterStat(1, 2).then(function(pitches) {
        assert.notEqual(pitches, originalPitches, 'correct number of pitches for top row');
      });        

      playerPage.getMultiFilterStat(2, 2).then(function(pitches) {
        assert.notEqual(pitches, originalPitches, 'correct number of pitches for bottom row');
      });        
    });

    // doing less than because of the same reason as above
    test.it('drawing a box on the heat map should update the hit chart for both sections', function() {
      playerPage.getMultiFilterHitChartHitCount('top').then(function(count) {
        assert.isAtMost(count, 5, 'correct number of hits for top hitChart');
      });      

      playerPage.getMultiFilterHitChartHitCount('bottom').then(function(count) {
        assert.isAtMost(count, 5, 'correct number of hits for bottom hitChart');
      });            
    });    

    test.it('when sync is turned on, both heat maps should update ', function() {
      playerPage.changeMultiFilterVisualMode('bottom', 'Sync Visual Mode');
      playerPage.changeMultiFilterVisualMode('top', 'Forward Velocity');

      playerPage.getMultiFilterHeatMapImageTitle('top').then(function(title) {
        assert.equal(title, 'ForwVel', "top heat map has title 'ForwVel'");
      });

      playerPage.getMultiFilterHeatMapImageTitle('bottom').then(function(title) {
        assert.equal(title, 'ForwVel', "bottom heat map has title 'ForwVel'");
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

    test.it('selecting Clayton Kershaw on comp 2 search should add him to table', function() {
      playerPage.selectForCompSearch(2, 'Clayton Kershaw');
      playerPage.getCompTableStat(1,1).then(function(playerName) {
        assert.equal(playerName, 'Clayton Kershaw');
      });

      playerPage.getCompTableStat(1,10).then(function(ip) {
        assert.equal(ip, 152.0, 'Clayton Kershaw 2016 Season - # of IP');
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
        assert.equal(sectionHeaderText, 'Vs RHB J. Peraza (CIN), Bot 1, 0 Out');
      });
    }); 

    test.it('selecting Andrew McCutchen on comp 2 search should update the pitch log', function() {
      playerPage.selectForCompSearch(2, 'Andrew McCutchen');
      playerPage.getMatchupsAtBatHeaderText(1).then(function(sectionHeaderText) {
        assert.equal(sectionHeaderText, 'Vs RHB A. McCutchen (PIT), Bot 1, 1 Out');
      });
    });

    test.it('video playlist displays correct side information', function() {
      playerPage.clickPitchVideoIcon(1);
      playerPage.getVideoPlaylistText(2,1).then(function(text) {
        assert.equal(text, 'Bot 1, 1 out', '2nd video, top line');
      });

      playerPage.getVideoPlaylistText(2,3).then(function(text) {
        assert.equal(text, '0-1 Changeup 79.6 MPH');
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
      playerPage.getVsTableStat(1,20).then(function(whip) {
        assert.equal(whip, 1.07, 'WHIP against MIA');
      });                                   
    });

    test.describe("#filters", function() {
      test.it('adding filter: (Inning: 1) displays correct data', function() {
        filters.toggleSidebarFilter("Inning:", "1", true);

        playerPage.getVsTableStat(2,21).then(function(kPer) {
          assert.equal(kPer, 9.00, 'K/9 against ARI');
        });                                   
      });

      test.after(function() {
        filters.toggleSidebarFilter("Inning:", "1", false);
      });
    });                 
  });   

  // Vs. Hitters
  test.describe("#Subsection: Vs Hitters", function() {
    test.before(function() {
      playerPage.goToSubSection("vsHitters");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('should show the correct data', function() {
      playerPage.getVsTableStat(1,2).then(function(pitcher) {
        assert.equal(pitcher, 'Jean Segura', '1st row hitter');
      });         

      playerPage.getVsTableStat(1,3).then(function(pitches) {
        assert.equal(pitches, 10, 'pitches against Jean Segura');
      });                                           
    });

    test.describe("#filters", function() {
      test.it('adding filter: (count: 2 Strikes) displays correct data', function() {
        filters.addSelectionToDropdownSidebarFilter("count:", "2 Strikes");

        playerPage.getVsTableStat(1,2).then(function(pitcher) {
          assert.equal(pitcher, 'Chris Owings', '1st row hitter');
        });                                   

        playerPage.getVsTableStat(1,12).then(function(hits) {
          assert.equal(hits, 1, 'hits for Chris Owings');
        });                                           
      });

      test.after(function() {
        filters.removeSelectionFromDropdownSidebarFilter("count:", "2 Strikes");
      })
    });                 
  });  
});