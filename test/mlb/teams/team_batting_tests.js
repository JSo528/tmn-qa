var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var constants = require('../../../lib/constants.js');
var extensions = require('../../../lib/extensions.js');

// Page Objects
var Navbar = require('../../../pages/mlb/navbar.js');
var Filters = require('../../../pages/mlb/filters.js');
var TeamsPage = require('../../../pages/mlb/teams/teams_page.js');
var TeamPage = require('../../../pages/mlb/teams/team_page.js');

var navbar, filters, teamsPage, teamPage;

test.describe('#Team Batting Section', function() {
  test.it('test setup', function() {  
    navbar  = new Navbar(driver);  
    filters  = new Filters(driver);  
    teamsPage = new TeamsPage(driver);
    teamPage = new TeamPage(driver);

    navbar.goToTeamsPage();
    filters.removeSelectionFromDropdownFilter("Seasons:");
    filters.addSelectionToDropdownFilter("Seasons:", 2016);
    teamsPage.clickTeamTableCell(1,3); // should click into BOS team link
  });  

  test.it('should be on BOS 2016 team page', function() {
    teamPage.getTeamName().then(function(text) {
      assert.equal( text, 'Boston Red Sox');
    });
  });

  // Overview Section
  test.describe("#Subsection: Overview", function() {
    // Heat Map & Hit Charts
    test.describe("#Heat Maps & Hit Charts", function() {
      test.it('test setup', function() {
        teamPage.changeReport("Counting");
      });

      test.it('has the correct number of plot points (hits) initially', function() {
        teamPage.getHitChartHitCount().then(function(hitCount) {
          assert.equal(hitCount, 1651);
        });
      });

      test.it('selecting a heat map rectangle updates the hit chart', function() {
        teamPage.drawBoxOnOverviewHeatMap(150,150,25,25);

        teamPage.getHitChartHitCount('single').then(function(count) {
          assert.equal(count, 9, 'correct number of singles');
        });
        
        teamPage.getHitChartHitCount('double').then(function(count) {
          assert.equal(count, 6, 'correct number of doubles');
        });        

        teamPage.getHitChartHitCount('triple').then(function(count) {
          assert.equal(count, 2, 'correct number of triples');
        });        

        teamPage.getHitChartHitCount('homeRun').then(function(count) {
          assert.equal(count, 4, 'correct number of home runs');
        });        
      });      

      test.it('selecting a heat map rectangle updates the data table', function() {
        teamPage.getOverviewTableStat(12).then(function(count) {
          assert.equal(count, 6, 'correct number of doubles');
        });        

        teamPage.getOverviewTableStat(13).then(function(count) {
          assert.equal(count, 2, 'correct number of triples');
        });        

        teamPage.getOverviewTableStat(14).then(function(count) {
          assert.equal(count, 4, 'correct number of home runs');
        });        
      });            

      test.it('clicking a hit chart hit shows pitches on the heat map', function() {
        teamPage.clickHitChartPlotPoint();
        teamPage.getOverviewHeatMapPitchCount().then(function(pitches) {
          assert.equal(pitches, 2);
        });
      });

      test.it('clicking a hit chart hit shows pitches on the team grid', function() {
        teamPage.getOverviewHeatMapPitchCount().then(function(pitches) {
          assert.equal(pitches, 2);
        });
      });  

      test.it('pitch view shows 500 pitches', function() {
        teamPage.clickPitchViewLink();
        teamPage.getOverviewPitchViewPitchCount().then(function(pitches) {
          assert.equal(pitches, 500);
        });
      });  

      test.it('clicking pitch view tooltip opens video modal', function() {
        teamPage.clickOverviewPitchViewPlotPoint();
        teamPage.clickHitChartTooltipPitchVideoIcon();
        teamPage.getHitChartTooltipPitchVideoHeader().then(function(text) {
          assert.equal(text, '(Away - 4/9/2016) Vs RHP R. Dickey (TOR)', 'Video Modal header');
        });
      });  


      test.it('clearing the heat maps resets the hit chart', function() {
        teamPage.closeHitChartTooltipPitchVideoModal();
        teamPage.clickHeatMapLink();
        teamPage.clearOverviewHeatMap();
        teamPage.getHitChartHitCount().then(function(hitCount) {
          assert.equal(hitCount, 1651);
        });
      });                 

      test.it('clearing the heat maps resets the data table', function() {
        teamPage.getOverviewTableStat(11).then(function(hitCount) {
          assert.equal(hitCount, 1598, 'correct number of hits');
        });        
      }); 
    });
  
    // Video Playlist
    test.describe('#VideoPlaylist', function() {    
      test.it('clicking on a stat opens the play by play modal', function() {
        teamPage.clickOverviewTableStat(13);
        teamPage.getMatchupsAtBatHeaderText(1).then(function(text) {
          assert.equal(text, 'Vs RHP J. Biagini (TOR), Bot 6, 1 Out');
        });
      });

      test.it('clicking into video opens correct video', function() {
        teamPage.clickPitchVideoIcon(2);
        teamPage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "Bot 6, 1 out");
        });

        teamPage.getVideoPlaylistText(1,3).then(function(text) {
          assert.equal(text, "1-2 Cutter 95.5 MPH ,70.3% ProbSL");
        });          
      }); 

      test.after(function() {
        teamPage.closeVideoPlaylistModal();
      });
    });

    // Video Library
    test.describe('#VideoLibrary - add video to new playlist from flat view', function() {     
      test.it('should create new playlist', function() {
        teamPage.clickFlatViewTab();
      });

      test.it('playlist should exist in library', function() {
        teamPage.addVideoToNewList(1, 'Team Batting Tests');
        teamPage.closePlayByPlayModal();
        teamPage.openVideoLibrary();
        teamPage.listExistsInVideoLibrary('Team Batting Tests').then(function(exists) {
          assert.equal(exists, true, 'Team Batting Tests playlist exists in library');
        });
      });

      test.it('should have correct # of videos', function() {
        teamPage.openVideoList('Team Batting Tests');
        teamPage.getVideoCountFromList().then(function(count) {
          assert.equal(count, 1);
        });
      });

      test.it('should be able to play video', function() {
        teamPage.playVideoFromList(1);
        teamPage.isVideoModalDisplayed().then(function(displayed){
          assert.equal(displayed, true);
        });        
      });

      test.it('closing video modal', function() {
        teamPage.closeVideoPlaylistModal();
      });
    });    

    test.describe("#filters", function() {
      test.it('adding filter: (Men On: On 1B Only) from sidebar displays correct data', function() {
        filters.toggleSidebarFilter('Men On:', 'On 1B Only', true);

        teamPage.getOverviewTableStat(8).then(function(pitches) {
          assert.equal(pitches, 4782, '2016 Bos Pitches');
        });
      });

      test.it('adding filter: (Men On: On 2B Only) from sidebar displays correct data', function() {
        filters.toggleSidebarFilter('Men On:', 'On 2B Only', true);

        teamPage.getOverviewTableStat(8).then(function(pitches) {
          assert.equal(pitches, 6762, '2016 Bos Pitches');
        });
      });      

      test.it('adding filter: (Batted Ball: IF Air Out) from sidebar displays correct data', function() {
        filters.toggleSidebarFilter('Batted Ball:', 'IF Air Out', true);

        teamPage.getOverviewTableStat(8).then(function(pitches) {
          assert.equal(pitches, 105, '2016 Bos Pitches');
        });
      });

      test.it('adding filter: (Batted Ball: Pop Up) from sidebar displays correct data', function() {
        filters.toggleSidebarFilter('Batted Ball:', 'Pop Up', true);

        teamPage.getOverviewTableStat(8).then(function(pitches) {
          assert.equal(pitches, 149, '2016 Bos Pitches');
        });
      });

      test.it('adding filter: (Pitch Type: Hard (Fast/Sink/Cut)) from sidebar displays correct data', function() {
        filters.toggleSidebarFilter('Pitch Type:', 'Hard (Fast/Sink/Cut)', true);

        teamPage.getOverviewTableStat(8).then(function(pitches) {
          assert.equal(pitches, 89, '2016 Bos Pitches');
        });
      });

      test.it('adding filter: (Vertical Location: Upper Half) from sidebar displays correct data', function() {
        filters.toggleSidebarFilter('Vertical Location:', 'Upper Half', true);

        teamPage.getOverviewTableStat(8).then(function(pitches) {
          assert.equal(pitches, 57, '2016 Bos Pitches');
        });
      });      

      test.it('adding filter: (Zone Location: Competitve) from sidebar displays correct data', function() {
        filters.toggleSidebarFilter('Zone Location:', 'Competitive', true);

        teamPage.getOverviewTableStat(8).then(function(pitches) {
          assert.equal(pitches, 50, '2016 Bos Pitches');
        });
      });            

      test.it('adding filter: (Launch Angle: 50 to _) from sidebar displays correct data', function() {
        filters.changeValuesForRangeSidebarFilter('Launch Angle:', 50, "");

        teamPage.getOverviewTableStat(8).then(function(pitches) {
          assert.equal(pitches, 16, '2016 Bos Pitches');
        });
      });  

      test.it('clicking "default filters" returns filters back to default state', function() {
        filters.clickDefaultFiltersBtn();
        filters.removeSelectionFromDropdownFilter("Seasons:");
        filters.addSelectionToDropdownFilter("Seasons:", 2016);
      });          
    });

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
        { type: 'Strike Rate', title: 'Strike%' },
        { type: 'Ball Rate', title: 'Ball%' },  
        { type: 'Swing Rate', title: 'Swing%' },  
        { type: 'Contact Rate', title: 'Contact%' },  
        { type: 'Miss Rate', title: 'Miss%' },  
        { type: 'In Play Rate', title: 'InPlay%' },  
        { type: 'Foul Rate', title: 'Foul%' }  
      ];

      visualModes.forEach(function(visualMode) {
        test.it("selecting " + visualMode.type + " shows the correct title ", function() {
          teamPage.changeVisualMode(visualMode.type);
          teamPage.getOverviewHeatMapImageTitle().then(function(title) {
            assert.equal(title, visualMode.title);
          });
        });
      });        
    });

    test.describe("#Reports", function() {
      var reports = [
        { type: 'Counting', topStat: 1598, statType: "H" },  
        { type: 'Pitch Rates', topStat: "38.7%", statType: "Foul%" },  
        { type: 'Pitch Count', topStat: 12623, statType: "InZone#" },  
        { type: 'Pitch Types', topStat: "2.7%", statType: "Sinker%" },  
        { type: 'Pitch Type Counts', topStat: 658, statType: "Sinker#" },  
        { type: 'Pitch Locations', topStat: "60.2%", statType: "LowHalf%" },  
        { type: 'Pitch Calls', topStat: 233, statType: "BallFrmd" },  
        { type: 'Hit Types', topStat: 2060, statType: "Ground#" },  
        { type: 'Hit Locations', topStat: "22.3%", statType: "HLftCtr%" },  
        { type: 'Home Runs', topStat: 153, statType: "HRPull" },  
        { type: 'Exit Data', topStat: 0.031, statType: "ExSLGDf" },  
        
      ];
      reports.forEach(function(report) {
        test.it("selecting " + report.type + " shows the correct stat value for " + report.statType, function() {
          teamPage.changeReport(report.type);  
          teamPage.getOverviewTableStat(11).then(function(stat) {
            assert.equal(stat, report.topStat);
          });
        });
      });        

      test.after(function() {
        teamPage.changeReport('Rate');
      });
    });
  });

  // Roster Section
  test.describe("#Subsection: Roster", function() {
    test.it('test setup', function() {
      teamPage.goToSubSection("roster");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    // Sorting
    test.describe("#sorting", function() {
      var columns = [
        { colNum: 8, colName: 'Batting Average', sortType: 'ferpNumber', defaultSort: 'desc', initialCol: true },
        { colNum: 5, colName: 'PA', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colNum: 12, colName: 'ISO', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colNum: 15, colName: 'K/BB', sortType: 'ferpNumber', defaultSort: 'asc' },
        { colNum: 19, colName: 'BABIP', sortType: 'ferpNumber', defaultSort: 'desc' },
      ]

      columns.forEach(function(column) {
        test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
          if (!column.initialCol) teamPage.clickRosterTableColumnHeader(column.colNum);
          teamPage.waitForTableToLoad();
          teamPage.getRosterTableStatsForCol(column.colNum).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
            assert.deepEqual(stats, sortedArray);
          })
        });

        test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
          teamPage.clickRosterTableColumnHeader(column.colNum);
          teamPage.waitForTableToLoad();
          teamPage.getRosterTableStatsForCol(column.colNum).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
            var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
            assert.deepEqual(stats, sortedArray);
          })
        });
      });

      test.after(function() {
        teamPage.clickRosterTableColumnHeader(8);
      });        
    });

    // Video Playlist
    test.describe('#VideoPlaylist', function() {    
      test.it('clicking on a stat opens the play by play modal', function() {
        teamPage.clickRosterTableStat(1,7);
        teamPage.getMatchupsAtBatHeaderText(1).then(function(text) {
          assert.equal(text, 'Vs RHP A. Sanchez (TOR), Bot 1, 2 Out');
        });
      });

      test.it('clicking into video opens correct video', function() {
        teamPage.clickPitchVideoIcon(2);
        teamPage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "Bot 1, 2 out");
        });

        teamPage.getVideoPlaylistText(1,3).then(function(text) {
          assert.equal(text, "2-2 Fastball 97.5 MPH ,56.6% ProbSL");
        });          
      }); 

      test.after(function() {
        teamPage.closeVideoPlaylistModal();
      });
    });

    // Video Library
    test.describe('#VideoLibrary - add video to existing playlist', function() {     
      test.it('should have correct # of videos', function() {
        teamPage.addVideoToList(1, 'Team Batting Tests');
        teamPage.closePlayByPlayModal();
        teamPage.openVideoLibrary();
        teamPage.openVideoList('Team Batting Tests');
        teamPage.getVideoCountFromList().then(function(count) {
          assert.equal(count, 2);
        });
      });

      test.it('should be able to play video', function() {
        teamPage.playVideoFromList(2);
        teamPage.isVideoModalDisplayed().then(function(displayed){
          assert.equal(displayed, true);
        });        
      });

      test.it('closing video modal', function() {
        teamPage.closeVideoPlaylistModal();
      });
    });

    test.describe("#filters", function() {
      test.it('adding filter: (opponent starter: Corey Kluber) from dropdown displays correct data', function() {
        filters.changeFilterGroupDropdown("Game Participation");
        filters.addSelectionToDropdownSidebarFilter('Opponent Starter:', 'Corey Kluber');

        teamPage.getRosterTableStat(1,1).then(function(player) {
          assert.equal(player, 'Mookie Betts');
        });

        teamPage.getRosterTableStat(1,8).then(function(battingAVG) {
          assert.equal(battingAVG, 0.444);
        });          
      });

      test.it('adding filter: (Pitch Result: Miss) from sidebar displays correct data', function() {
        filters.changeFilterGroupDropdown("Common");
        filters.toggleSidebarFilter('Pitch Result:', 'Miss', true);

        teamPage.getRosterTableStat(1,5).then(function(pitches) {
          assert.equal(pitches, 6, 'David Ortiz Pitches');
        });          
      });

      test.it('adding filter: (Pitch Result: Foul) from sidebar displays correct data', function() {
        filters.toggleSidebarFilter('Pitch Result:', 'Foul', true);

        teamPage.getRosterTableStat(1,5).then(function(pitches) {
          assert.equal(pitches, 12, 'David Ortiz Pitches');
        });          
      });      

      test.it('adding filter: (Pitch Result: Ball) from sidebar displays correct data', function() {filters.changeFilterGroupDropdown("Common");
        filters.toggleSidebarFilter('Pitch Result:', 'Ball', true);

        teamPage.getRosterTableStat(1,5).then(function(pitches) {
          assert.equal(pitches, 31, 'David Ortiz Pitches');
        });          
      });  

      test.it('adding filter: (Horizontal Location: Inner Third) from sidebar displays correct data', function() {filters.changeFilterGroupDropdown("Common");
        filters.toggleSidebarFilter('Horizontal Location:', 'Inner Third', true);

        teamPage.getRosterTableStat(1,5).then(function(pitches) {
          assert.equal(pitches, 9, 'David Ortiz Pitches');
        });          
      });  

      test.it('adding filter: (Vertical Location: Lower Half) from sidebar displays correct data', function() {filters.changeFilterGroupDropdown("Common");
        filters.toggleSidebarFilter('Vertical Location:', 'Lower Half', true);

        teamPage.getRosterTableStat(1,5).then(function(pitches) {
          assert.equal(pitches, 8, 'David Ortiz Pitches');
        });          
      });        

      test.it('clicking "default filters" returns filters back to default state', function() {
        filters.clickDefaultFiltersBtn();
      });          
    });
  });

  // Game Logs Section
  test.describe("#Subsection: Game Log", function() {
    test.it('test setup', function() {
      teamPage.goToSubSection("gameLog");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('should show the correct game data for 10/2/2016', function() {
      teamPage.getGameLogTableStat(1,3).then(function(date) {
        assert.equal(date, '10/2/2016');
      });

      teamPage.getGameLogTableStat(1,4).then(function(score) {
        assert.equal(score, 'L 1-2');
      });      

      teamPage.getGameLogTableStat(1,10).then(function(obp) {
        assert.equal(obp, 0.235);
      });            
    });

    // Sorting
    test.describe("#sorting", function() {
      var columns = [
        { colNum: 3, colName: 'Date', sortType: 'dates', defaultSort: 'desc', initialCol: true },
        { colNum: 4, colName: 'Score', sortType: 'string', defaultSort: 'asc' },
        { colNum: 11, colName: 'SLG', sortType: 'ferpNumber', defaultSort: 'asc' },
        { colNum: 15, colName: 'BB%', sortType: 'ferpNumber', defaultSort: 'asc' },
        { colNum: 17, colName: 'HR%', sortType: 'ferpNumber', defaultSort: 'asc' },
      ]

      columns.forEach(function(column) {
        test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
          if (!column.initialCol) teamPage.clickGameLogTableColumnHeader(column.colNum);
          teamPage.waitForTableToLoad();
          teamPage.getGameLogTableStatsForCol(column.colNum).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
            assert.deepEqual(stats, sortedArray);
          })
        });

        test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
          teamPage.clickGameLogTableColumnHeader(column.colNum);
          teamPage.waitForTableToLoad();
          teamPage.getGameLogTableStatsForCol(column.colNum).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
            var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
            assert.deepEqual(stats, sortedArray);
          })
        });
      });

      test.after(function() {
        teamPage.clickGameLogTableColumnHeader(3);
        teamPage.clickGameLogTableColumnHeader(3);
      });        
    });    

    // Video Playlist
    test.describe('#VideoPlaylist', function() {    
      test.it('clicking on a stat opens the play by play modal', function() {
        teamPage.clickGameLogTableStat(1,8);
        teamPage.getMatchupsAtBatHeaderText(1).then(function(text) {
          assert.equal(text, 'Vs RHP A. Sanchez (TOR), Bot 1, 0 Out');
        });
      });

      test.it('clicking into video opens correct video', function() {
        teamPage.clickPitchVideoIcon(2);
        teamPage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "Bot 1, 0 out");
        });

        teamPage.getVideoPlaylistText(1,3).then(function(text) {
          assert.equal(text, "1-1 Fastball 96.5 MPH ,86.2% ProbSL");
        });          
      }); 

      test.after(function() {
        teamPage.closeVideoPlaylistModal();
      });
    });

    // Video Library
    test.describe('#VideoLibrary - add video to existing playlist', function() {     
      test.it('should have correct # of videos', function() {
        teamPage.addVideoToList(1, 'Team Batting Tests');
        teamPage.closePlayByPlayModal();
        teamPage.openVideoLibrary();
        teamPage.openVideoList('Team Batting Tests');
        teamPage.getVideoCountFromList().then(function(count) {
          assert.equal(count, 3);
        });
      });

      test.it('should be able to play video', function() {
        teamPage.playVideoFromList(1);
        teamPage.isVideoModalDisplayed().then(function(displayed){
          assert.equal(displayed, true);
        });        
      });

      test.it('closing video modal', function() {
        teamPage.closeVideoPlaylistModal();
      });
    });    

    test.describe('#VideoLibrary - removing video thru pbp', function() {     
      test.it('should have correct # of videos', function() {
        teamPage.clickGameLogTableStat(1,8);
        teamPage.pbpRemoveVideoFromList(1, 'Team Batting Tests');
        teamPage.closePlayByPlayModal();
        teamPage.openVideoLibrary();
        teamPage.getVideoCountFromList().then(function(count) {
          assert.equal(count, 2);
        });
      });

      test.it('closing video modal', function() {
        teamPage.closeVideoLibrary();
      });
    });       

    test.describe("#filters", function() {
      test.it('adding filter: (Spin Angle: 0 - 180) from dropdown displays correct data', function() {
        filters.changeFilterGroupDropdown("Pitch");
        filters.changeValuesForRangeSidebarFilter("Spin Angle:", 0, 180);

        teamPage.getGameLogTableStat(1,3).then(function(date) {
          assert.equal(date, '10/2/2016');
        });

        teamPage.getGameLogTableStat(1,6).then(function(pitches) {
          assert.equal(pitches, 29);
        });          

        teamPage.getGameLogTableStat(1,9).then(function(ba) {
          assert.equal(ba, 0.167);
        });                  
      });

      test.it('adding filter: (Game Run Diff: 3-10) from sidebar displays correct data', function() {
        filters.changeFilterGroupDropdown('Game');
        filters.changeValuesForRangeSidebarFilter("Game Run Diff:", 3, 10);

        teamPage.getGameLogTableStat(1,3).then(function(stat) {
          assert.equal(stat, '9/21/2016', 'row 1 date');
        });                           
      });   

      test.it('adding filter: (Game Team Errors: 1-5) from sidebar displays correct data', function() {
        filters.changeValuesForRangeSidebarFilter("Game Team Errors:", 1, 5);

        teamPage.getGameLogTableStat(1,3).then(function(stat) {
          assert.equal(stat, '9/12/2016', 'row 1 date');
        });                           
      }); 

      test.it('adding filter: (Game Team Hits: 0-10) from sidebar displays correct data', function() {
        filters.changeValuesForRangeSidebarFilter("Game Team Hits:", 0, 10);

        teamPage.getGameLogTableStat(1,3).then(function(stat) {
          assert.equal(stat, '8/13/2016', 'row 1 date');
        });                           
      });       

      test.it('adding filter: (Game Team Runs Scored: 8-15) from sidebar displays correct data', function() {
        filters.changeValuesForRangeSidebarFilter("Game Team Runs Scored:", 8, 15);

        teamPage.getGameLogTableStat(1,3).then(function(stat) {
          assert.equal(stat, '7/6/2016', 'row 1 date');
        });                           
      });    

      test.it('clicking "default filters" returns filters back to default state', function() {
        filters.clickDefaultFiltersBtn();
      });          
    });
  });  

  // Splits Section
  test.describe("#Subsection: Splits", function() {
    test.it('test setup', function() {
      teamPage.goToSubSection("splits");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('should show the correct section titles', function() {
      teamPage.getSplitsTableHeaderText(1).then(function(title) {
        assert.equal(title, 'Totals');
      });

      teamPage.getSplitsTableHeaderText(2).then(function(title) {
        assert.equal(title, 'LHP/RHP');
      });

      teamPage.getSplitsTableHeaderText(3).then(function(title) {
        assert.equal(title, 'Seasons');
      });

      teamPage.getSplitsTableHeaderText(4).then(function(title) {
        assert.equal(title, 'Months');
      });
      
      teamPage.getSplitsTableHeaderText(5).then(function(title) {
        assert.equal(title, 'Pitch Type');
      });

      teamPage.getSplitsTableHeaderText(6).then(function(title) {
        assert.equal(title, 'Batted Ball Types');
      });             
    });

    test.it('should show the correct data in the totals subsection', function() {
      teamPage.getSplitsTableStat(1,1).then(function(rowTitle) {
        assert.equal(rowTitle, 'Totals', 'row 1 title should be labled "Totals"');
      });             

      teamPage.getSplitsTableStat(1,3).then(function(wins) {
        assert.equal(wins, 93, 'row 1 should have 93 wins');
      });             

      teamPage.getSplitsTableStat(2,1).then(function(rowTitle) {
        assert.equal(rowTitle, 'In Play', 'row 2 title should be labled "In Play"');
      });                   

      teamPage.getSplitsTableStat(2,7).then(function(pitches) {
        assert.equal(pitches, 4558, 'row 2 should have 4558 pitches');
      });                         

      teamPage.getSplitsTableStat(3,1).then(function(rowTitle) {
        assert.equal(rowTitle, 'Home', 'row 3 title should be labled "Home"');
      });                   

      teamPage.getSplitsTableStat(3,2).then(function(games) {
        assert.equal(games, 81, 'row 3 should have 81 games');
      });                               

      teamPage.getSplitsTableStat(4,1).then(function(rowTitle) {
        assert.equal(rowTitle, 'Away', 'row 4 title should be labled "Away"');
      });                   

      teamPage.getSplitsTableStat(4,11).then(function(slg) {
        assert.equal(slg, 0.430, 'row 4 should have .430 slg');
      });                                     
    });

    test.it('should show the correct data in the lhp/rhp subsection', function() {
      teamPage.getSplitsTableStat(6,1).then(function(rowTitle) {
        assert.equal(rowTitle, 'vs LHP', 'row 1 title should be labled "vs LHP"');
      });             

      teamPage.getSplitsTableStat(6,8).then(function(ab) {
        assert.equal(ab, 1347, 'row 1 should have 1347 ab');
      });             

      teamPage.getSplitsTableStat(7,1).then(function(rowTitle) {
        assert.equal(rowTitle, 'vs RHP', 'row 2 title should be labled "vs RHP"');
      });                   

      teamPage.getSplitsTableStat(7,9).then(function(ba) {
        assert.equal(ba, 0.283, 'row 2 should have 0.283 ba');
      });  
    });                          
  });      

  // Pitch Logs
  test.describe("#Subsection: Pitch Log", function() {
    test.it('test setup', function() {
      teamPage.goToSubSection("pitchLog");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.describe('when selecting filter (Pitch Result: Strike Looking)', function() {
      test.it('test setup', function() {
        this.timeout(120000);
        filters.changeFilterGroupDropdown('Pitch');
        filters.addSelectionToDropdownSidebarFilter('Pitch Result:', 'Strike Looking');
      });
      
      test.it('should show the correct at bat header text', function() {
        teamPage.getMatchupsAtBatHeaderText(1).then(function(text) {
          assert.equal(text, "Vs RHP A. Sanchez (TOR), Bot 1, 0 Out");
        });
      });

      test.it('should show the correct row data', function() {
        teamPage.getMatchupsPitchText(1,4).then(function(pitch) {
          assert.equal(pitch, 'Fastball');
        });
        teamPage.getMatchupsPitchText(1,7).then(function(pitch) {
          assert.equal(pitch, 'Strike Looking');
        });
      });
    });

    test.describe('when clicking flat view tab', function() {
      test.it('should show the correct stats', function() {
        teamPage.clickFlatViewTab();
        teamPage.getFlatViewPitchText(1,2).then(function(num) {
          assert.equal(num, '1', 'row 1 Num col equals 1');
        });

        teamPage.getFlatViewPitchText(1,3).then(function(count) {
          assert.equal(count, '0-0', 'row 1 count is 0-0');
        });
      });
    })

    // Video Library
    test.describe('#VideoLibrary - add video to existing playlist', function() {     
      test.it('should have correct # of videos', function() {
        teamPage.addVideoToList(1, 'Team Batting Tests');
        teamPage.closePlayByPlayModal();
        teamPage.openVideoLibrary();
        teamPage.openVideoList('Team Batting Tests');
        teamPage.getVideoCountFromList().then(function(count) {
          assert.equal(count, 3);
        });
      });

      test.it('should be able to play video', function() {
        teamPage.playVideoFromList(1);
        teamPage.isVideoModalDisplayed().then(function(displayed){
          assert.equal(displayed, true);
        });        
      });

      test.it('closing video modal', function() {
        teamPage.closeVideoPlaylistModal();
      });
    });    

    test.describe('#VideoLibrary - removing video thru pbp', function() {     
      test.it('should have correct # of videos', function() {
        teamPage.pbpRemoveVideoFromList(1, 'Team Batting Tests');
        teamPage.closePlayByPlayModal();
        teamPage.openVideoLibrary();
        teamPage.getVideoCountFromList().then(function(count) {
          assert.equal(count, 2);
        });
      });

      test.it('closing video modal', function() {
        teamPage.closeVideoLibrary();
      });
    });         

    test.after(function() {
      filters.closeDropdownFilter('Pitch Result:');
    });
  });

  // Occurences & Streaks
  test.describe('#SubSection: Occurrences & Streaks', function() {
    test.it('test setup', function() {
      teamPage.goToSubSection("occurrencesAndStreaks");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('changing the main constraint should show the correct section header', function() {
      teamPage.changeMainConstraint("Occurrences Of", "At Most", 3, "K (Batting)", "In a Game", "Within a Season");
      teamPage.getStreaksSectionHeaderText().then(function(text) {
        assert.equal(text, "11 Times");
      });

      teamPage.getStreaksTableStat(1,4).then(function(stat) {
        assert.equal(stat, 2);
      });
    });
  });

  // Multi-Filter
  test.describe('#SubSection: Multi-Filter', function() {
    test.it('test setup', function() {
      teamPage.goToSubSection("multiFilter");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
      teamPage.changeMultiFilterBottomSeason(2016);
    });

    test.it('should show the correct data initially', function() {
      teamPage.getMultiFilterStat(1,1).then(function(rowTitle) {
        assert.equal(rowTitle, 'top');
      });

      teamPage.getMultiFilterStat(2,1).then(function(rowTitle) {
        assert.equal(rowTitle, 'bottom');
      });      

      teamPage.getMultiFilterStat(1,8).then(function(ab) {
        assert.equal(ab, 5670, 'top AB equals 5670');
      });
    });

    // doing a notEqual because drawing the same box doesnt always lead to the exact same stats
    test.it('drawing a box on the heat map should update the stats table for both sections', function() {
      var originalAB;
      teamPage.getMultiFilterStat(1, 8).then(function(ab) {
        originalAB = ab;
      });

      teamPage.drawBoxOnMultiFilterHeatMap('top', 160,120,25,25);

      teamPage.getMultiFilterStat(1, 8).then(function(ab) {
        assert.notEqual(ab, originalAB, 'correct number of at bats for top row');
      });        

      teamPage.getMultiFilterStat(2, 8).then(function(ab) {
        assert.notEqual(ab, originalAB, 'correct number of at bats for bottom row');
      });        
    });

    // doing less than because of the same reason as above
    test.it('drawing a box on the heat map should update the hit chart for both sections', function() {
      teamPage.getMultiFilterHitChartHitCount('top').then(function(count) {
        assert.isAtMost(count, 60, 'correct number of hits for top hitChart');
      });      

      teamPage.getMultiFilterHitChartHitCount('bottom').then(function(count) {
        assert.isAtMost(count, 60, 'correct number of hits for bottom hitChart');
      });            
    }); 

   

    test.it('when sync is turned on, both heat maps should update ', function() {
      teamPage.changeMultiFilterVisualMode('top', 'ISO');

      teamPage.getMultiFilterHeatMapImageTitle('top').then(function(title) {
        assert.equal(title, 'ISO', "top heat map has title 'ISO'");
      });

      teamPage.getMultiFilterHeatMapImageTitle('bottom').then(function(title) {
        assert.equal(title, 'ISO', "bottom heat map has title 'ISO'");
      });
    });

    test.it('when sync is turned off, changing the top should not change the bottom', function() {
      teamPage.changeMultiFilterVisualMode('bottom', 'BA');
      teamPage.changeMultiFilterVisualMode('top', 'SLG');

      teamPage.getMultiFilterHeatMapImageTitle('top').then(function(title) {
        assert.equal(title, 'SLG', "top heat map has title 'SLG'");
      });

      teamPage.getMultiFilterHeatMapImageTitle('bottom').then(function(title) {
        assert.equal(title, 'BA', "bottom heat map has title 'BA'");
      });     
    });
  });

  // Comps
  test.describe('#SubSection: Comps', function() {
    test.it('test setup', function() {
      teamPage.goToSubSection("comps");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('selecting Mookie Betts on comp 2 search should add him to table', function() {
      teamPage.selectForCompSearch(2, 'Mookie Betts');
      teamPage.getCompTableStat(1,1).then(function(playerName) {
        assert.equal(playerName, 'Mookie Betts');
      });

      teamPage.getCompTableStat(1,2).then(function(games) {
        assert.equal(games, 158);
      });
    });
  });

  // Matchups
  test.describe('#SubSection: Matchups', function() {
    test.it('test setup', function() {
      teamPage.goToSubSection("matchups");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('should show the correct data in the table', function() {
      teamPage.getMatchupsAtBatHeaderText(1).then(function(sectionHeaderText) {
        assert.equal(sectionHeaderText, 'Vs RHP A. Sanchez (TOR), Bot 1, 0 Out', 'header for 1st at bat');
      });
    }); 

    test.it('selecting Chris Archer on comp 2 search should update the pitch log', function() {
      teamPage.selectForCompSearch(2, 'Chris Archer');
      teamPage.getMatchupsAtBatHeaderText(1).then(function(sectionHeaderText) {
        assert.equal(sectionHeaderText, 'Vs RHP C. Archer (TB), Top 1, 0 Out');
      });
    });

    test.it('video playlist displays correct side information', function() {
      teamPage.clickPitchVideoIcon(1);
      teamPage.getVideoPlaylistText(2,1).then(function(text) {
        assert.equal(text, 'Top 1, 0 out', '2nd video, top line');
      });

      teamPage.getVideoPlaylistText(2,2).then(function(text) {
        assert.equal(text, 'Vs RHP C. Archer (TB)', '2nd video, 2nd line');
      });      
    }); 

    // Video Library
    test.describe('#VideoLibrary - add video to existing playlist', function() {     
      test.it('should have correct # of videos', function() {
        teamPage.addVideoToList(1, 'Team Batting Tests');
        teamPage.closePlayByPlayModal();
        teamPage.openVideoLibrary();
        teamPage.openVideoList('Team Batting Tests');
        teamPage.getVideoCountFromList().then(function(count) {
          assert.equal(count, 3);
        });
      });

      test.it('should be able to play video', function() {
        teamPage.playVideoFromList(1);
        teamPage.isVideoModalDisplayed().then(function(displayed){
          assert.equal(displayed, true);
        });        
      });

      test.it('closing video modal', function() {
        teamPage.closeVideoPlaylistModal();
      });
    });    

    test.describe('#VideoLibrary - deleting playlist', function() {
      test.it('should remove playlist', function() {
        teamPage.openVideoLibrary();
        teamPage.navigateBackToListIndex();
        teamPage.deleteListFromLibrary('Team Batting Tests');
        
        teamPage.listExistsInVideoLibrary('Team Batting Tests').then(function(exists) {
          assert.equal(exists, false);
        })
      });

      test.it('close video library', function() {
        teamPage.closeVideoLibrary();
      });
    });     
  });  

  // Vs. Teams
  test.describe("#Subsection: Vs Teams", function() {
    test.it('test setup', function() {
      teamPage.goToSubSection("vsTeams");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('should show the correct data', function() {
      teamPage.getVsTableStat(1,5).then(function(winPer) {
        assert.equal(winPer, 0.833, 'win% against Oak should be .833');
      });                                   
    });

    // Sorting
    test.describe("#sorting", function() {
      var columns = [
        { colNum: 9, colName: 'Batting Average', sortType: 'ferpNumber', defaultSort: 'desc', initialCol: true },
        { colNum: 4, colName: 'L', sortType: 'ferpNumber', defaultSort: 'asc' },
        { colNum: 5, colName: 'Win%', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colNum: 12, colName: 'OPS', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colNum: 16, colName: 'K/BB', sortType: 'ferpNumber', defaultSort: 'asc' },
      ]

      columns.forEach(function(column) {
        test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
          if (!column.initialCol) teamPage.clickVsTableColumnHeader(column.colNum);
          teamPage.waitForTableToLoad();
          teamPage.getVsTableStatsForCol(column.colNum).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
            assert.deepEqual(stats, sortedArray);
          })
        });

        test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
          teamPage.clickVsTableColumnHeader(column.colNum);
          teamPage.waitForTableToLoad();
          teamPage.getVsTableStatsForCol(column.colNum).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
            var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
            assert.deepEqual(stats, sortedArray);
          })
        });
      });

      test.after(function() {
        teamPage.clickVsTableColumnHeader(9);
      });        
    });    

    test.describe("#filters", function() {
      test.it('adding filter: (Date Range: 2016 First Half) displays correct data', function() {
        filters.changeDropdownForDateSidebarFilter("Date Range:", "2016 First Half");

        teamPage.getVsTableStat(2,9).then(function(stat) {
          assert.equal(stat, 0.367, 'BA against LAA should be .367');
        });                                   
      });

      test.it('adding filter: (Men On: On 3B Only) displays correct data', function() {
        filters.toggleSidebarFilter('Men On:', 'On 3B Only', true);

        teamPage.getVsTableStat(1,7).then(function(stat) {
          assert.equal(stat, 3, 'CWS PA');
        });                                   
      });

      test.it('adding filter: (Men On: 2nd and 3rd) displays correct data', function() {
        filters.toggleSidebarFilter('Men On:', '2nd and 3rd', true);

        teamPage.getVsTableStat(1,7).then(function(stat) {
          assert.equal(stat, 18, 'TB PA');
        });                                   
      });

      test.it('adding filter: (PA Result: Hit) displays correct data', function() {
        filters.toggleSidebarFilter('PA Result:', 'Hit', true);

        teamPage.getVsTableStat(1,7).then(function(stat) {
          assert.equal(stat, 14, 'Tor PA');
        });                                   
      });      

      test.it('adding filter: (PA Result: Walk) displays correct data', function() {
        filters.toggleSidebarFilter('PA Result:', 'Walk', true);

        teamPage.getVsTableStat(1,7).then(function(stat) {
          assert.equal(stat, 16, 'Tor PA');
        });                                   
      });            

      test.it('adding filter: (PA Result: Sac Fly) displays correct data', function() {
        filters.toggleSidebarFilter('PA Result:', 'Sac Fly', true);

        teamPage.getVsTableStat(1,7).then(function(stat) {
          assert.equal(stat, 17, 'Tor PA');
        });                                   
      });            

      test.it('adding filter: (Outs: 1) displays correct data', function() {
        filters.toggleSidebarFilter('Outs:', 1, true);

        teamPage.getVsTableStat(1,7).then(function(stat) {
          assert.equal(stat, 9, 'Tor PA');
        });                                   
      });            

      test.it('clicking "default filters" returns filters back to default state', function() {
        filters.clickDefaultFiltersBtn();
      });                    
    });
  });   

  // Vs. Pitchers
  test.describe("#Subsection: Vs Pitchers", function() {
    test.it('test setup', function() {
      teamPage.goToSubSection("vsPitchers");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('should show the correct data', function() {
      teamPage.getVsTableStat(2,2).then(function(pitcher) {
        assert.equal(pitcher, 'Wade Miley', '2nd row pitcher should be Wade Miley');
      });         

      teamPage.getVsTableStat(2,13).then(function(ops) {
        assert.equal(ops, 1.650, '2nd row ops should be 1.650');
      });                                           
    });

    // Sorting
    test.describe("#sorting", function() {
      var columns = [
        { colNum: 10, colName: 'Batting Average', sortType: 'ferpNumber', defaultSort: 'desc', initialCol: true },
        { colNum: 3, colName: 'G', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colNum: 7, colName: 'P', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colNum: 11, colName: 'OBP', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colNum: 15, colName: 'K%', sortType: 'ferpNumber', defaultSort: 'asc' },
      ]

      columns.forEach(function(column) {
        test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
          if (!column.initialCol) teamPage.clickVsTableColumnHeader(column.colNum);
          teamPage.waitForTableToLoad();
          teamPage.getVsTableStatsForCol(column.colNum).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
            assert.deepEqual(stats, sortedArray);
          })
        });

        test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
          teamPage.clickVsTableColumnHeader(column.colNum);
          teamPage.waitForTableToLoad();
          teamPage.getVsTableStatsForCol(column.colNum).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
            var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
            assert.deepEqual(stats, sortedArray);
          })
        });
      });

      test.after(function() {
        teamPage.clickVsTableColumnHeader(10);
      });        
    });      

    test.describe("#filters", function() {
      test.it('adding filter: (Contact: Hard) displays correct data', function() {
        teamPage.clickVsTableColumnHeader(7);
        filters.changeFilterGroupDropdown("PA");
        filters.addSelectionToDropdownSidebarFilter("Contact:", "Hard");

        teamPage.getVsTableStat(1,2).then(function(pitcher) {
          assert.equal(pitcher, 'Kevin Gausman', '1st Row Pitcher');
        });                                   

        teamPage.getVsTableStat(1,12).then(function(slg) {
          assert.equal(slg, 0.727, 'Kevin Gausman slg%');
        });                                           
      });

      test.it('adding filter: (Contact: Medium) displays correct data', function() {
        filters.addSelectionToDropdownSidebarFilter("Contact:", "Medium");

        teamPage.getVsTableStat(1,7).then(function(stat) {
          assert.equal(stat, 84, '1st row Pitches');
        });                                   
      });     

      test.it('adding filter: (Pitch # in PA: 0 to 1) displays correct data', function() {
        filters.changeValuesForRangeSidebarFilter('Pitch # in PA:', 0, 1); 

        teamPage.getVsTableStat(1,7).then(function(stat) {
          assert.equal(stat, 12, '1st row Pitches');
        });                                   
      });     

      test.it('adding filter: (Infield Batted Ball: Yes) displays correct data', function() {
        filters.selectForBooleanDropdownSidebarFilter('Infield Batted Ball:', 'Yes'); 

        teamPage.getVsTableStat(1,7).then(function(stat) {
          assert.equal(stat, 6, '1st row Pitches');
        });                                   
      });           

      test.it('adding filter: (Batted Ball Location: Center) displays correct data', function() {
        filters.addSelectionToDropdownSidebarFilter('Batted Ball Location:', 'Center'); 

        teamPage.getVsTableStat(1,7).then(function(stat) {
          assert.equal(stat, 3, '1st row Pitches');
        });                                   
      });  

      test.it('adding filter: (Batted Ball Angle Range: 0 to 30) displays correct data', function() {
        filters.changeValuesForRangeSidebarFilter('Batted Ball Angle Range:', 0, 30); 

        teamPage.getVsTableStat(1,7).then(function(stat) {
          assert.equal(stat, 2, '1st row Pitches');
        });                                   
      }); 

      test.it('adding filter: (Batted Ball Distance: 0 to 90) displays correct data', function() {
        filters.changeValuesForRangeSidebarFilter('Batted Ball Distance:', 0, 90); 

        teamPage.getVsTableStat(1,7).then(function(stat) {
          assert.equal(stat, 1, '1st row Pitches');
        });                                   
      });       
    });                 
  });     
});