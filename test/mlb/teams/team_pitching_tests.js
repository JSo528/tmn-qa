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

var navbar, filters, teamsPage, teamPage, teamPage;

test.describe('#Team Pitching Section', function() {
  test.it('test setup', function() {  
    navbar  = new Navbar(driver);  
    filters  = new Filters(driver);  
    teamsPage = new TeamsPage(driver);
    teamPage = new TeamPage(driver);

    navbar.goToTeamsPage();
    filters.removeSelectionFromDropdownFilter("Seasons:");
    filters.addSelectionToDropdownFilter("Seasons:", 2016);
    filters.removeSelectionFromDropdownFilter("Season Level:");
    filters.addSelectionToDropdownFilter("Season Level:", 'AAA');
    teamsPage.clickTeamTableCell(1,3); // should click into AAA - El Paso Chihuahua's team link
    teamPage.goToSection("pitching");
  });  

  test.it('should be on AAA - El Paso Chihuahuas 2016 team page', function() {
    filters.removeSelectionFromDropdownFilter("Seasons:");
    filters.addSelectionToDropdownFilter("Seasons:", 2016);
    teamPage.getTeamName().then(function(text) {
      assert.equal( text, 'El Paso Chihuahuas (SD)');
    });
  });

  // Overview Section
  test.describe("#Subsection: Overview", function() {
    // Heat Map & Hit Charts
    test.describe("#Heat Maps & Hit Charts", function() {
      test.it('has the correct number of plot points (hits) initially', function() {
        teamPage.getHitChartHitCount().then(function(hitCount) {
          assert.equal(hitCount, 1515);
        });
      });

      test.it('selecting a heat map rectangle updates the hit chart', function() {
        teamPage.drawBoxOnOverviewHeatMap(150,150,25,25);

        teamPage.getHitChartHitCount('single').then(function(count) {
          assert.equal(count, 18, 'correct number of singles');
        });
        
        teamPage.getHitChartHitCount('double').then(function(count) {
          assert.equal(count, 4, 'correct number of doubles');
        });        

        teamPage.getHitChartHitCount('triple').then(function(count) {
          assert.equal(count, 0, 'correct number of triples');
        });        

        teamPage.getHitChartHitCount('homeRun').then(function(count) {
          assert.equal(count, 4, 'correct number of home runs');
        });        
      });      

      test.it('selecting a heat map rectangle updates the data table', function() {
        teamPage.getOverviewTableStat(12).then(function(count) {
          assert.equal(count, 26, 'correct number of hits');
        });        
      });            

      test.it('clicking a hit chart hit shows pitches on the heat map', function() {
        teamPage.clickHitChartPlotPoint();
        teamPage.getOverviewHeatMapPitchCount().then(function(pitches) {
          assert.equal(pitches, 5);
        });
      });

      test.it('clicking a hit chart hit shows pitches on the team grid', function() {
        teamPage.getOverviewHeatMapPitchCount().then(function(pitches) {
          assert.equal(pitches, 5);
        });
      });     

      test.it('clearing the heat maps resets the hit chart', function() {
        teamPage.clearOverviewHeatMap();
        teamPage.getHitChartHitCount().then(function(hitCount) {
          assert.equal(hitCount, 1515);
        });
      });                 

      test.it('clearing the heat maps resets the data table', function() {
        teamPage.getOverviewTableStat(12).then(function(hitCount) {
          assert.equal(hitCount, 1450, 'correct number of hits');
        });        
      }); 
    });

    test.describe("#filters", function() {
      test.it('adding filter: (Batted Ball: Bunt) from sidebar displays correct data', function() {
        filters.toggleSidebarFilter('Batted Ball:', 'Bunt', true);

        teamPage.getOverviewTableStat(3).then(function(pitches) {
          assert.equal(pitches, 101, 'Pitches');
        });
      });

      test.it('adding filter: (Batted Ball: IF Line Drive) from sidebar displays correct data', function() {
        filters.toggleSidebarFilter('Batted Ball:', 'IF Line Drive', true);

        teamPage.getOverviewTableStat(3).then(function(pitches) {
          assert.equal(pitches, 184, 'Pitches');
        });
      });           

      test.it('adding filter: (Batted Ball: Soft Ground Ball) from sidebar displays correct data', function() {
        filters.toggleSidebarFilter('Batted Ball:', 'Soft Ground Ball', true);

        teamPage.getOverviewTableStat(3).then(function(pitches) {
          assert.equal(pitches, 191, 'Pitches');
        });
      });

      test.it('adding filter: (PA Result: Sac Bunt) from sidebar displays correct data', function() {
        filters.toggleSidebarFilter('PA Result:', 'Sac Bunt', true);

        teamPage.getOverviewTableStat(3).then(function(pitches) {
          assert.equal(pitches, 46, 'Pitches');
        });
      });   

      test.it('adding filter: (PA Result: IP Out + FC) from sidebar displays correct data', function() {
        filters.toggleSidebarFilter('PA Result:', 'IP Out + FC', true);

        teamPage.getOverviewTableStat(3).then(function(pitches) {
          assert.equal(pitches, 157, 'Pitches');
        });
      });   

      test.it('adding filter: (Zone Location: Non-Competitive) from sidebar displays correct data', function() {
        filters.toggleSidebarFilter('Zone Location:', 'Non-Competitive', true);

        teamPage.getOverviewTableStat(3).then(function(pitches) {
          assert.equal(pitches, 10, 'Pitches');
        });
      });   

      test.it('adding filter: (Count: 1 Strike) from sidebar displays correct data', function() {
        filters.addSelectionToDropdownSidebarFilter('count:', '1 Strike', true);

        teamPage.getOverviewTableStat(3).then(function(pitches) {
          assert.equal(pitches, 3, 'Pitches');
        });
      });   

      test.it('adding filter: (Count: 0 Strikes) from sidebar displays correct data', function() {
        filters.addSelectionToDropdownSidebarFilter('count:', '0 Strikes', true);

        teamPage.getOverviewTableStat(3).then(function(pitches) {
          assert.equal(pitches, 6, 'Pitches');
        });
      });         

      test.it('adding filter: (Count: 1 Ball) from sidebar displays correct data', function() {
        filters.addSelectionToDropdownSidebarFilter('count:', '1 Ball', true);

        teamPage.getOverviewTableStat(3).then(function(pitches) {
          assert.equal(pitches, 8, 'Pitches');
        });
      });         

      test.it('adding filter: (Count: 2 Balls) from sidebar displays correct data', function() {
        filters.addSelectionToDropdownSidebarFilter('count:', '2 Balls', true);

        teamPage.getOverviewTableStat(3).then(function(pitches) {
          assert.equal(pitches, 9, 'Pitches');
        });
      });                     

      test.it('adding filter: (Forward Velocity: _ to 90) from sidebar displays correct data', function() {
        filters.changeValuesForRangeSidebarFilter('Forward Velocity:', '', 90);

        teamPage.getOverviewTableStat(3).then(function(pitches) {
          assert.equal(pitches, 1, 'Pitches');
        });
      });            

      test.it('clicking "default filters" returns filters back to default state', function() {
        filters.clickDefaultFiltersBtn();
        filters.removeSelectionFromDropdownFilter("Seasons:");
        filters.addSelectionToDropdownFilter("Seasons:", 2016);
      });      
    });

    // Video Playlist
    test.describe('#VideoPlaylist', function() {    
      test.it('clicking on a stat opens the play by play modal', function() {
        teamPage.clickOverviewTableStat(19);
        teamPage.getMatchupsAtBatHeaderText(1).then(function(text) {
          assert.equal(text, 'Vs RHB D. Garneau (ABQ), Top 4, 0 Out');
        });
      });

      test.it('clicking into video opens correct video', function() {
        teamPage.clickPitchVideoIcon(1);
        teamPage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "Top 4, 0 out");
        });

        teamPage.getVideoPlaylistText(1,3).then(function(text) {
          assert.equal(text, "0-0 Fastball 88.8 MPH ,98.8% ProbSL");
        });          
      }); 

      test.after(function() {
        teamPage.closeVideoPlaylistModal();
      });
    });

    // Video Library
    test.describe('#VideoLibrary - add video to new playlist', function() {     
      test.it('should create new playlist', function() {
        teamPage.addVideoToNewList(1, 'Team Pitching Tests');
      });

      test.it('playlist should exist in library', function() {
        teamPage.closePlayByPlayModal();
        teamPage.openVideoLibrary();
        teamPage.listExistsInVideoLibrary('Team Pitching Tests').then(function(exists) {
          assert.equal(exists, true, 'Team Pitching Tests playlist exists in library');
        });
      });

      test.it('should have correct # of videos', function() {
        teamPage.openVideoList('Team Pitching Tests');
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

    test.describe("#Reports", function() {
      var reports = [
        { type: 'Rate', topStat: 0.293, statType: "BA" },  
        { type: 'Counting', topStat: 1450, statType: "H" },  
        { type: 'Pitch Rates', topStat: "78.0%", statType: "Contact%" },  
        { type: 'Pitch Count', topStat: 13145, statType: "Strike#" },  
        { type: 'Pitch Types', topStat: '5.7%', statType: "Curve%" },  
        { type: 'Pitch Type Counts', topStat: 1036, statType: "Curve#" },  
        { type: 'Pitch Locations', topStat: "31.6%", statType: "VMid%" },  
        { type: 'Pitch Calls', topStat: "103.8%", statType: "SL+" },  
        { type: 'Hit Types', topStat: "20.2%", statType: "Line%" },  
        { type: 'Hit Locations', topStat: "38.3%", statType: "HPull%" },  
        { type: 'Home Runs', topStat: 394.2, statType: "HRDst" },  
        { type: 'Movement', topStat: 100.0, statType: "MxVel" },  
        { type: 'Bids', topStat: 0, statType: "NH7+" },  
        { type: 'Baserunning', topStat: 94, statType: "SB", colNum: 5 },  
        { type: 'Exit Data', topStat: 0.446, statType: "SLG" },  
        
      ];
      reports.forEach(function(report) {
        test.it("selecting " + report.type + " shows the correct stat value for " + report.statType, function() {
          teamPage.changeReport(report.type);  
          var col = report.colNum || 8;
          teamPage.getOverviewTableStat(col).then(function(stat) {
            assert.equal(stat, report.topStat);
          });
        });
      });     
      test.after(function() {
        teamPage.changeReport('Traditional');
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
        { colNum: 21, colName: 'ERA', sortType: 'ferpNumber', defaultSort: 'asc', initialCol: true },
        { colNum: 16, colName: 'ER/G', sortType: 'ferpNumber', defaultSort: 'asc' },
        { colNum: 10, colName: 'S', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colNum: 13, colName: 'H', sortType: 'ferpNumber', defaultSort: 'asc' },
        { colNum: 22, colName: 'WHIP', sortType: 'ferpNumber', defaultSort: 'asc' },
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
        teamPage.clickRosterTableColumnHeader(21);
      });        
    });    

    // Video Playlist
    test.describe('#VideoPlaylist', function() {    
      test.it('clicking on a stat opens the play by play modal', function() {
        teamPage.clickRosterTableStat(1,4);
        teamPage.getMatchupsAtBatHeaderText(1).then(function(text) {
          assert.equal(text, 'Vs RHB S. Romero (TAC), Bot 7, 0 Out');
        });
      });

      test.it('clicking into video opens correct video', function() {
        teamPage.clickPitchVideoIcon(2);
        teamPage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "Bot 7, 0 out");
        });

        teamPage.getVideoPlaylistText(1,3).then(function(text) {
          assert.equal(text, "0-0 Slider - MPH ,98.4% ProbSL");
        });          
      }); 

      test.after(function() {
        teamPage.closeVideoPlaylistModal();
      });
    });  

    // Video Library
    test.describe('#VideoLibrary - add video to existing playlist', function() {     
      test.it('should have correct # of videos', function() {
        teamPage.addVideoToList(1, 'Team Pitching Tests');
        teamPage.closePlayByPlayModal();
        teamPage.openVideoLibrary();
        teamPage.openVideoList('Team Pitching Tests');
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
      test.it('adding filter: (Batter Hand: Righty) from dropdown displays correct data', function() {
        filters.toggleSidebarFilter('Batter Hand:', 'Righty', true);

        teamPage.getRosterTableStat(1,1).then(function(player) {
          assert.equal(player, 'Jeremy Guthrie');
        });

        teamPage.getRosterTableStat(1,13).then(function(hits) {
          assert.equal(hits, 41, 'Jeremey Guthrie alowed 41 hits');
        });          
      });

      test.it('adding filter: (Men On: On 2B) from dropdown displays correct data', function() {
        filters.toggleSidebarFilter('Men On:', 'On 2B', true);

        teamPage.getRosterTableStat(1,13).then(function(hits) {
          assert.equal(hits, 10, 'Jeremey Guthrie Hits');
        });
      });      

      test.it('adding filter: (Men On: On 3B) from dropdown displays correct data', function() {
        filters.toggleSidebarFilter('Men On:', 'On 3B', true);

        teamPage.getRosterTableStat(1,13).then(function(hits) {
          assert.equal(hits, 15, 'Jeremey Guthrie Hits');
        });
      });   

      test.it('adding filter: (Batted Ball: OF Line Drive) from dropdown displays correct data', function() {
        filters.toggleSidebarFilter('Batted Ball:', 'OF Line Drive', true);

        teamPage.getRosterTableStat(1,13).then(function(hits) {
          assert.equal(hits, 8, 'Jeremey Guthrie Hits');
        });
      });      
    });

    test.after(function() {
      filters.closeDropdownFilter('Batter Hand:');
      filters.closeDropdownFilter('Men On:');
      filters.closeDropdownFilter('Batted Ball:');
    });
  });

  // Game Logs Section
  test.describe("#Subsection: Game Log", function() {
    test.it('test setup', function() {
      teamPage.goToSubSection("gameLog");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('should show the correct game data for 9/5/2016', function() {
      teamPage.getGameLogTableStat(1,3).then(function(date) {
        assert.equal(date, '9/5/2016');
      });

      teamPage.getGameLogTableStat(1,4).then(function(score) {
        assert.equal(score, 'L 2-4');
      });      

      teamPage.getGameLogTableStat(1,19).then(function(bb) {
        assert.equal(bb, 1, 'row 1 bb column');
      });            
    });

    // Sorting
    test.describe("#sorting", function() {
      var columns = [
        { colNum: 3, colName: 'Date', sortType: 'dates', defaultSort: 'desc', initialCol: true },
        { colNum: 4, colName: 'Score', sortType: 'string', defaultSort: 'asc' },
        { colNum: 11, colName: 'S', sortType: 'ferpNumber', defaultSort: 'asc' },
        { colNum: 19, colName: 'BB', sortType: 'ferpNumber', defaultSort: 'asc' },
        { colNum: 27, colName: 'HR/9', sortType: 'ferpNumber', defaultSort: 'asc' },
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
        teamPage.clickGameLogTableStat(1,5);
        teamPage.getMatchupsAtBatHeaderText(1).then(function(text) {
          assert.equal(text, 'Vs LHB M. Tauchman (ABQ), Top 1, 0 Out');
        });
      });

      test.it('clicking into video opens correct video', function() {
        teamPage.clickPitchVideoIcon(2);
        teamPage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "Top 1, 0 out");
        });

        teamPage.getVideoPlaylistText(1,3).then(function(text) {
          assert.equal(text, "0-0 Fastball 88.0 MPH ,85.9% ProbSL");
        });          
      }); 

      test.after(function() {
        teamPage.closeVideoPlaylistModal();
      });
    });    

    // Video Library
    test.describe('#VideoLibrary - add video to existing playlist', function() {     
      test.it('should have correct # of videos', function() {
        teamPage.addVideoToList(1, 'Team Pitching Tests');
        teamPage.closePlayByPlayModal();
        teamPage.openVideoLibrary();
        teamPage.openVideoList('Team Pitching Tests');
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
        teamPage.clickGameLogTableStat(1,5);
        teamPage.pbpRemoveVideoFromList(1, 'Team Pitching Tests');
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
      test.it('adding filter: (Batted Ball: Ground Ball) from sidebar displays correct data', function() {
        filters.toggleSidebarFilter("Batted Ball:", "Ground Ball", true);

        teamPage.getGameLogTableStat(1,3).then(function(date) {
          assert.equal(date, '9/5/2016');
        });

        teamPage.getGameLogTableStat(1,5).then(function(pitches) {
          assert.equal(pitches, 9);
        });          

        teamPage.getGameLogTableStat(1,14).then(function(hits) {
          assert.equal(hits, 1, 'row 1 hits column');
        });                  
      });

      test.it('adding filter: (Team Game # In Season: 0-120) from sidebar displays correct data', function() {
        filters.changeFilterGroupDropdown('Game');
        filters.changeValuesForRangeSidebarFilter("Team Game # In Season:", 0, 120);

        teamPage.getGameLogTableStat(1,3).then(function(stat) {
          assert.equal(stat, '8/12/2016', 'row 1 date');
        });                           
      });   

      test.it('adding filter: (Pitcher Age: 30-40) from sidebar displays correct data', function() {
        filters.changeValuesForRangeSidebarFilter("Pitcher Age:", 30, 40);

        teamPage.getGameLogTableStat(1,5).then(function(stat) {
          assert.equal(stat, 7, 'row 1 pitches');
        });                           
      });   

      test.it('adding filter: (Game Number: 2) from sidebar displays correct data', function() {
        filters.selectForBooleanDropdownSidebarFilter("Game Number:", 2);

        teamPage.getGameLogTableStat(1,3).then(function(stat) {
          assert.equal(stat, '7/28/2016', 'row 1 date');
        });                           
      });    

      test.it('adding filter: (Game: ELP @ SAC (07/24/2016)) from sidebar displays correct data', function() {
        filters.addSelectionToDropdownSidebarFilter("Game:", 'ELP @ SAC (07/24/2016)'); // filters for game 1
        filters.addSelectionToDropdownSidebarFilter("Game:", 'ELP @ SAC (07/24/2016)'); // filters for game 2

        teamPage.getGameLogTableStat(1,3).then(function(stat) {
          assert.equal(stat, '7/24/2016', 'row 1 date');
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

      teamPage.getSplitsTableStat(1,2).then(function(pitches) {
        assert.equal(pitches, 20866, 'row 1 should have 20866 pitches');
      });             

      teamPage.getSplitsTableStat(2,1).then(function(rowTitle) {
        assert.equal(rowTitle, 'In Play', 'row 2 title should be labled "In Play"');
      });                   

      teamPage.getSplitsTableStat(2,11).then(function(hits) {
        assert.equal(hits, 1450, 'row 2 should have 1450 hits');
      });                         

      teamPage.getSplitsTableStat(3,1).then(function(rowTitle) {
        assert.equal(rowTitle, 'Home', 'row 3 title should be labled "Home"');
      });                   

      teamPage.getSplitsTableStat(3,10).then(function(ip) {
        assert.equal(ip, 660.0, 'row 3 should have 660.0 ip');
      });                               

      teamPage.getSplitsTableStat(4,1).then(function(rowTitle) {
        assert.equal(rowTitle, 'Away', 'row 4 title should be labled "Away"');
      });                   

      teamPage.getSplitsTableStat(4,12).then(function(er) {
        assert.equal(er, 316, 'row 4 should have 316 er');
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

    test.describe('when selecting filter (Pitch Result: In Play)', function() {
      test.it('test setup', function() {
        this.timeout(120000);
        filters.changeFilterGroupDropdown('Pitch');
        filters.addSelectionToDropdownSidebarFilter('Pitch Result:', 'In Play');
      });
      
      test.it('should show the correct at bat header text', function() {
        teamPage.getMatchupsAtBatHeaderText(1).then(function(text) {
          assert.equal(text, "Vs RHB C. Nelson (ABQ), Top 1, 1 Out");
        });
      });

      test.it('should show the correct row data', function() {
        teamPage.getMatchupsPitchText(1,4).then(function(pitch) {
          assert.equal(pitch, 'Fastball');
        });
        teamPage.getMatchupsPitchText(1,7).then(function(pitch) {
          assert.equal(pitch, 'Fly Out');
        });
      });

      test.it('when clicking flat view tab it should show the correct stats', function() {
        teamPage.clickFlatViewTab();
        teamPage.getFlatViewPitchText(1,2).then(function(num) {
          assert.equal(num, '3', 'row 1 Num col equals 3');
        });

        teamPage.getFlatViewPitchText(1,3).then(function(count) {
          assert.equal(count, '1-1', 'row 1 count is 1-1');
        });
      });

      test.after(function() {
        filters.closeDropdownFilter('Pitch Result:');
      });
    });

    // Video Library
    test.describe('#VideoLibrary - add video to existing playlist', function() {     
      test.it('should have correct # of videos', function() {
        teamPage.addVideoToList(1, 'Team Pitching Tests');
        teamPage.closePlayByPlayModal();
        teamPage.openVideoLibrary();
        teamPage.openVideoList('Team Pitching Tests');
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
        teamPage.pbpRemoveVideoFromList(1, 'Team Pitching Tests');
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
  });

  // Occurences & Streaks
  test.describe('#SubSection: Occurrences & Streaks', function() {
    test.it('test setup', function() {
      teamPage.goToSubSection("occurrencesAndStreaks");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('changing the main constraint should show the correct section header', function() {
      teamPage.changeMainConstraint("Occurrences Of", "At Least", 10, "K (Pitching)", "In a Game", "Within a Season");
      teamPage.getStreaksSectionHeaderText().then(function(text) {
        assert.equal(text, "29 Times");
      });

      teamPage.getStreaksTableStat(1,4).then(function(stat) {
        assert.equal(stat, 10);
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

      teamPage.getMultiFilterStat(1,2).then(function(pitches) {
        assert.equal(pitches, 20866, 'top pitches equals 20866');
      });
    });

    // doing a notEqual because drawing the same box doesnt always lead to the exact same stats
    test.it('drawing a box on the heat map should update the stats table for both sections', function() {
      var originalHits;
      teamPage.getMultiFilterStat(1, 11).then(function(hits) {
        originalHits = hits;
      });

      teamPage.drawBoxOnMultiFilterHeatMap('top', 160,120,25,25);

      teamPage.getMultiFilterStat(1, 11).then(function(hits) {
        assert.notEqual(hits, originalHits, 'correct number of hits for top row');
      });        

      teamPage.getMultiFilterStat(2,1).then(function(hits) {
        assert.notEqual(hits, originalHits, 'correct number of hits for bottom row');
      });        
    });

    // doing less than because of the same reason as above
    test.it('drawing a box on the heat map should update the hit chart for both sections', function() {
      teamPage.getMultiFilterHitChartHitCount('top').then(function(count) {
        assert.isAtMost(count, 76, 'correct number of hits for top hitChart');
      });      

      teamPage.getMultiFilterHitChartHitCount('bottom').then(function(count) {
        assert.isAtMost(count, 76, 'correct number of hits for bottom hitChart');
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

    test.it('selecting Matt Strahm on comp 2 search should add him to table', function() {
      teamPage.selectForCompSearch(2, 'Matt Strahm');
      teamPage.getCompTableStat(1,1).then(function(playerName) {
        assert.equal(playerName, 'Matt Strahm');
      });

      teamPage.getCompTableStat(1,2).then(function(games) {
        assert.equal(games, 2066);
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
        assert.equal(sectionHeaderText, 'Vs LHB M. Tauchman (ABQ), Top 1, 0 Out', 'header for 1st at bat');
      });
    }); 

    test.it('selecting Yasiel Puig on comp 2 search should update the pitch log', function() {
      teamPage.selectForCompSearch(2, 'Yasiel Puig');
      teamPage.getMatchupsAtBatHeaderText(1).then(function(sectionHeaderText) {
        assert.equal(sectionHeaderText, 'Vs RHB Y. Puig (OKC), Bot 1, 1 Out', '1st pitch log');
      });
    });

    // Video Library
    test.describe('#VideoLibrary - add video to existing playlist', function() {     
      test.it('should have correct # of videos', function() {
        teamPage.addVideoToList(1, 'Team Pitching Tests');
        teamPage.closePlayByPlayModal();
        teamPage.openVideoLibrary();
        teamPage.openVideoList('Team Pitching Tests');
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
        teamPage.deleteListFromLibrary('Team Pitching Tests');
        
        teamPage.listExistsInVideoLibrary('Team Pitching Tests').then(function(exists) {
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
      teamPage.getVsTableStat(1,2).then(function(pitches) {
        assert.equal(pitches, 512, 'pitches against Omaha');
      });                                   
    });

    // Sorting
    test.describe("#sorting", function() {
      var columns = [
        { colNum: 19, colName: 'ERA', sortType: 'ferpNumber', defaultSort: 'asc', initialCol: true },
        { colNum: 22, colName: 'BB/9', sortType: 'ferpNumber', defaultSort: 'asc' },
        { colNum: 25, colName: 'IP/G', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colNum: 17, colName: 'K', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colNum: 15, colName: 'R/G', sortType: 'ferpNumber', defaultSort: 'asc' },
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
        teamPage.clickVsTableColumnHeader(19);
      });        
    });    

    test.describe("#filters", function() {
      test.it('adding filter: (Date Range: 2016 Second Half) displays correct data', function() {
        filters.changeDropdownForDateSidebarFilter("Date Range:", "2016 Second Half");

        teamPage.getVsTableStat(2,12).then(function(er) {
          assert.equal(er, 13, 'ER against Fresno');
        });                                   
      });

      test.it('adding filter: (Pitch Result: Ball In Dirt) displays correct data', function() {
        filters.toggleSidebarFilter("Pitch Result:", "Ball In Dirt", true);

        teamPage.getVsTableStat(1,2).then(function(er) {
          assert.equal(er, 15, 'Nashville Pitches');
        });                                   
      });      

      test.it('adding filter: (Pitch Result: Swing) displays correct data', function() {
        filters.toggleSidebarFilter("Pitch Result:", "Swing", true);

        teamPage.getVsTableStat(1,2).then(function(er) {
          assert.equal(er, 249, 'Nashville Pitches');
        });                                   
      });        

      test.it('adding filter: (Pitch Result: Hit By Pitch) displays correct data', function() {
        filters.toggleSidebarFilter("Pitch Result:", "Hit By Pitch", true);

        teamPage.getVsTableStat(1,2).then(function(er) {
          assert.equal(er, 252, 'Nashville Pitches');
        });                                   
      });    

      test.it('adding filter: (Pitch Result: Take) displays correct data', function() {
        filters.toggleSidebarFilter("Pitch Result:", "Take", true);

        teamPage.getVsTableStat(1,2).then(function(er) {
          assert.equal(er, 535, 'Nashville Pitches');
        });                                   
      });   

      test.it('adding filter: (Horizontal Location: Inner Half) displays correct data', function() {
        filters.toggleSidebarFilter("Horizontal Location:", "Inner Half", true);

        teamPage.getVsTableStat(1,2).then(function(er) {
          assert.equal(er, 179, 'Nashville Pitches');
        });                                   
      });   

      test.it('adding filter: (Zone Location: On the Black) displays correct data', function() {
        filters.toggleSidebarFilter("Zone Location:", "On the Black", true);

        teamPage.getVsTableStat(1,2).then(function(er) {
          assert.equal(er, 9, 'Nashville Pitches');
        });                                   
      });         

      test.it('adding filter: (Launch Angle: _ to 60) from sidebar displays correct data', function() {
        filters.changeValuesForRangeSidebarFilter('Launch Angle:', "", 60);

        teamPage.getVsTableStat(1,2).then(function(pitches) {
          assert.equal(pitches, 2, 'Nashville Pitches');
        });
      });    

      test.it('clicking "default filters" returns filters back to default state', function() {
        filters.clickDefaultFiltersBtn();
      }); 
    });                 
  });   

  // Vs. Hitters
  test.describe("#Subsection: Vs Hitters", function() {
    test.it('test setup', function() {
      teamPage.goToSubSection("vsHitters");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('should show the correct data', function() {
      teamPage.getVsTableStat(1,2).then(function(pitcher) {
        assert.equal(pitcher, 'Evan Marzilli', 'hitter on 1st row');
      });         

      teamPage.getVsTableStat(1,12).then(function(hits) {
        assert.equal(hits, 7, 'hits against Evan Marzilli');
      });                                           
    });

    // Sorting
    test.describe("#sorting", function() {
      var columns = [
        { colNum: 20, colName: 'ERA', sortType: 'ferpNumber', defaultSort: 'desc', initialCol: true },
        { colNum: 3, colName: 'P', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colNum: 12, colName: 'H', sortType: 'ferpNumber', defaultSort: 'asc' },
        { colNum: 18, colName: 'K', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colNum: 19, colName: 'HR', sortType: 'ferpNumber', defaultSort: 'asc' },
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
        teamPage.clickVsTableColumnHeader(20);
      });        
    });       

    test.describe("#filters", function() {
      test.it('adding filter: (Men On: RISP) displays correct data', function() {
        filters.toggleSidebarFilter("Men On:", "RISP", true);

        teamPage.getVsTableStat(4,2).then(function(pitcher) {
          assert.equal(pitcher, 'Evan Marzilli', 'hitter on 4th row');
        });                                   

        teamPage.getVsTableStat(4,18).then(function(strikeouts) {
          assert.equal(strikeouts, 1, 'strikeouts against Evan Marzilli');
        });                                           
      });

      test.it('adding filter: (PA Result: Single) displays correct data', function() {
        filters.toggleSidebarFilter("PA Result:", "Single", true);

        teamPage.getVsTableStat(1,12).then(function(hits) {
          assert.equal(hits, 4, 'Peter OBrien Hits');
        });                                   
      });   

      test.it('adding filter: (PA Result: Double) displays correct data', function() {
        filters.toggleSidebarFilter("PA Result:", "Double", true);

        teamPage.getVsTableStat(1,12).then(function(hits) {
          assert.equal(hits, 5, 'Peter OBrien Hits');
        });                                   
      });  

      test.it('adding filter: (Zone Location: On the Corners) displays correct data', function() {
        filters.toggleSidebarFilter("Zone Location:", "On the Corners", true);

        teamPage.getVsTableStat(1,12).then(function(hits) {
          assert.equal(hits, 1, 'Tuffy Gosewisch Hits');
        });                                   
      });  
    });                 
  });     
});