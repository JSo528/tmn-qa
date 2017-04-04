var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var constants = require('../../../lib/constants.js');
var extensions = require('../../../lib/extensions.js');

// Page Objects
var Navbar = require('../../../pages/mlb/navbar.js');
var Filters = require('../../../pages/mlb/filters.js');
var PlayersPage = require('../../../pages/mlb/players/players_page.js');
var navbar, playersPage;
var battingAverageCol, ksPerCol, eraCol, ksCol, slaaCol, statCol;

test.describe('#Players Page', function() {
  test.before(function() {  
    navbar  = new Navbar(driver);  
    filters = new Filters(driver);
    playersPage = new PlayersPage(driver);
  });

  test.it('clicking the players link goes to the correct page', function() {
    navbar.goToPlayersPage();

    driver.getTitle().then(function(title) {
      assert.equal( title, 'Players Batting', 'Correct title');
    });
  });    

  test.describe('#Section: Batting', function() {
    test.describe('#SubSection: Stats', function() {
      test.before(function() {
        battingAverageCol = 8;
        ksPerCol = 13;
        filters.removeSelectionFromDropdownFilter("Seasons:");
        filters.addSelectionToDropdownFilter("Seasons:", 2014);
      });

      // Sorting
      test.describe("#sorting", function() {
        var columns = [
          { colNum: 8, colName: 'Batting Average', sortType: 'ferpNumber', defaultSort: 'desc', initialCol: true },
          { colNum: 12, colName: 'ISO', sortType: 'ferpNumber', defaultSort: 'desc' },
          { colNum: 20, colName: 'OutRate', sortType: 'ferpNumber', defaultSort: 'asc' },
          { colNum: 21, colName: 'wOBA', sortType: 'ferpNumber', defaultSort: 'desc' },
          { colNum: 24, colName: 'SB%', sortType: 'ferpNumber', defaultSort: 'desc' },
        ]

        columns.forEach(function(column) {
          test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
            if (!column.initialCol) playersPage.clickTableColumnHeader(column.colNum);
            playersPage.waitForTableToLoad();
            playersPage.getTableStatsForCol(column.colNum).then(function(stats) {
              stats = extensions.normalizeArray(stats, column.sortType);
              var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
              assert.deepEqual(stats, sortedArray);
            })
          });

          test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
            playersPage.clickTableColumnHeader(column.colNum);
            playersPage.waitForTableToLoad();
            playersPage.getTableStatsForCol(column.colNum).then(function(stats) {
              stats = extensions.normalizeArray(stats, column.sortType);
              var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
              var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
              assert.deepEqual(stats, sortedArray);
            })
          });
        });

        test.after(function() {
          playersPage.clickTableColumnHeader(8);
        });        
      });

      // Video Playlist
      test.describe('#VideoPlaylist', function() {     
        test.it('clicking on a team stat opens the play by play modal', function() {
          playersPage.clickTableStat(1, 7);
          playersPage.getMatchupsAtBatHeaderText(1).then(function(text) {
            assert.equal(text, 'Vs RHP B. Colon (NYM), Top 1, 0 Out');
          });
        });

        test.it('selecting "Play Top 10" videos adds 10 videos to playlist', function() {
          playersPage.selectFromPlayVideosDropdown('Play Top 10');
          playersPage.getVideoPlaylistCount().then(function(videoCount) {
            assert.equal(videoCount, 10, '# videos on playlist');
          });
        });  

        test.after(function() {
          playersPage.closeVideoPlaylistModal();
          playersPage.closePlayByPlayModal();
        }); 
      });

      // Video Library
      test.describe('#VideoLibrary - selecting "Add All" to new playlist', function() {
        test.it('changing report to counting', function() {
          playersPage.changeReport('Counting');
          playersPage.clickTableStat(1, 15);
        });

        test.it('should create new playlist', function() {
          playersPage.addAllVideosToNewList("Players Tests");
          playersPage.closePlayByPlayModal();
          playersPage.openVideoLibrary();
          playersPage.listExistsInVideoLibrary('Players Tests').then(function(exists) {
            assert.equal(exists, true, 'Players Tests playlist exists in library');
          });
        });        

        test.it('should have correct # of videos', function() {
          playersPage.openVideoList('Players Tests');
          playersPage.getVideoCountFromList().then(function(count) {
            assert.equal(count, 7);
          });
        });

        test.it('should be able to play video', function() {
          playersPage.playVideoFromList(1);
          playersPage.isVideoModalDisplayed().then(function(displayed){
            assert.equal(displayed, true);
          });        

          playersPage.getVideoPlaylistText(1,1).then(function(text) {
            assert.equal(text, "Bot 3, 0 out");
          });

          playersPage.getVideoPlaylistText(1,3).then(function(text) {
            assert.equal(text, "2-0 Changeup 85.0 MPH");
          });  
        });

        test.it('closing video modal & changing report back to rate', function() {
          playersPage.closeVideoPlaylistModal();
          playersPage.changeReport('Rate');
        }); 
      });

      // Filters
      test.describe("#filters", function() {
        test.it('adding filter: (extra inning game) from dropdown displays correct data', function() {
          filters.addDropdownFilter('Extra Inning Game');

          playersPage.getTableStat(1,9).then(function(onBasePercentage) {
            assert.equal(onBasePercentage, 0.486);
          });
        });

        test.it('adding filter: (Batted ball: Fly ball) from sidebar displays correct data', function() {
          filters.toggleSidebarFilter('Batted Ball:', 'Fly Ball', true);

          playersPage.getTableStat(1,17).then(function(runsPerGame) {
            assert.equal(runsPerGame, 0.250);
          });
        });

        test.it('adding filter: (On Team: Colorado Rockies (mlb)) from sidebar displays correct data', function() {
          filters.changeFilterGroupDropdown('Game');
          filters.addSelectionToDropdownSidebarFilter('On Team:', 'Colorado Rockies (mlb)');

          playersPage.getTableStat(1,3).then(function(stat) {
            assert.equal(stat, ' C. Dickerson (DH-COL)', '1st row player');
          });
        });    

        test.it('adding filter: (Player Age: 20-30) from sidebar displays correct data', function() {
          filters.changeValuesForRangeSidebarFilter('Player Age:', 20, 30);

          playersPage.getTableStat(3,3).then(function(stat) {
            assert.equal(stat, ' D. LeMahieu (2B-COL)', '3rd row player');
          });
        });  

        test.it('adding filter: (Stadium: Coors Field) from top displays correct data', function() {
          filters.addSelectionToDropdownSidebarFilter('Stadium:', 'Coors Field');

          playersPage.getTableStat(1,7).then(function(stat) {
            assert.equal(stat, 1, '1st row AB');
          });
        }); 

        test.it('adding filter: (vs Division: NL West) from sidebar displays correct data', function() {
          filters.addDropdownFilter('vs Division');
          filters.addSelectionToDropdownFilter('vs Division:', 'NL West');

          playersPage.getTableStat(1,6).then(function(stat) {
            assert.equal(stat, 2, '1st row PA');
          });
        });  

        test.after(function() {
          filters.closeDropdownFilter('On Team:');
          filters.closeDropdownFilter('Player Age:');
          filters.closeDropdownFilter('Stadium:');
          filters.closeDropdownFilter('vs Division:');
          filters.closeDropdownFilter('Batted Ball:');
          filters.closeDropdownFilter('Extra Inning Game:');
        });
      }); 

      // Pinning
      test.describe("#pinning", function() {
        test.it('clicking the pin icon for Corey Dickerson should add him to the pinned table', function() {
          var playerName;
          playersPage.getTableStat(1,3).then(function(name) {
            playerName = name;
          });

          playersPage.clickTablePin(1);

          playersPage.getIsoTableStat(1,3).then(function(name) {
            assert.equal(name, playerName);
          });
        });
      });

      // Group By
      test.describe("#group by", function() {
        test.it('selecting "By Season" shows the correct headers', function() {
          playersPage.changeGroupBy("By Season");
          playersPage.getPlayerTableHeader(4).then(function(header) {
            assert.equal(header, "Season");
          });
        });

        test.it('selecting "By Game" shows the correct headers', function() {
          playersPage.changeGroupBy("By Game");
          playersPage.getPlayerTableHeader(4).then(function(header) {
            assert.equal(header, "Opponent");
          });          
        });        

        test.it('selecting "By Team Season" shows the correct headers', function() {
          playersPage.changeGroupBy("Team Season");
          playersPage.getPlayerTableHeader(4).then(function(header) {
            assert.equal(header, "Season");
          });                    

          playersPage.getPlayerTableHeader(5).then(function(header) {
            assert.equal(header, "Level");
          });                              
        });        
        test.after(function() {
          playersPage.changeGroupBy("Total"); // change back to group by total
        });
      });

      // Stats View
      test.describe("#stats view", function() {
        test.before(function() {
          filters.changeFilterGroupDropdown('Common');
          filters.toggleSidebarFilter('Zone Location:', 'Out of Strike Zone', true);
        });

        // Comparing top BA in 2014 for all the different stat views
        var topColor = "rgba(108, 223, 118, 1)";
        var statViews = [
          { type: 'Stat', topStat: 0.289 },  
          { type: 'Rank', topStat: 1, color: true },            
          { type: 'Percentile', topStat: "100.0%", color: true },
          { type: 'Z-Score', topStat: 2.428 },
          { type: 'Stat Grade', topStat: 80 },
          { type: 'Stat (Rank)', topStat: ".289 (1)", color: true },
          { type: 'Stat (Percentile)', topStat: ".289 (100%)", color: true },
          { type: 'Stat (Z-Score)', topStat: ".289 (2.43)"},
          { type: 'Stat (Stat Grade)', topStat: ".289 (80)"},
          { type: 'Pct of Team', topStat: ".289"},
        ];
        statViews.forEach(function(statView) {
          test.it("selecting '" + statView.type + "' shows the correct stat value", function() {
            playersPage.changeStatsView(statView.type);  
            playersPage.getTableStat(1,8).then(function(stat) {
              assert.equal(stat, statView.topStat);
            });
          });

          if (statView.color) {
            test.it("selecting " + statView.type + " shows the top value the right color", function() {
              playersPage.getPlayerTableBgColor(1,8).then(function(color) {
                assert.equal(color, topColor);
              });
            });
          }
        });
        test.after(function() {
          filters.changeFilterGroupDropdown('Common');
          filters.toggleSidebarFilter('Zone Location:', 'Out of Strike Zone', false);
          playersPage.changeStatsView('Stat'); // Remove Stats View
        });
      });      

      // Qualify By
      test.describe("#qualify by", function() {
        test.it("selecting All shows all players", function() {
          playersPage.changeQualifyBy("All");
          playersPage.getTableStat(1,4).then(function(games) {
            assert.equal(games, 27);
          });

          playersPage.getTableStat(1,8).then(function(battingAverage) {
            assert.equal(battingAverage, 1.000);
          });          
        });

        test.it("selecting Custom shows correct subset of players", function() {
          playersPage.changeQualifyBy("Custom", "Atbats", 50);
          playersPage.clickTableColumnHeader(7); // sort AB's descending
          playersPage.clickTableColumnHeader(7); // sort AB's ascending
          playersPage.getTableStat(1,7).then(function(atBats) {
            assert.equal(atBats, 50);
          });

          playersPage.getTableStat(1,8).then(function(battingAverage) {
            assert.equal(battingAverage, 0.060);
          });          
        });        

        test.after(function() {
          playersPage.changeQualifyBy("Default");
          playersPage.clickTableColumnHeader(8); // sort BA's descending
        });
      });

      // Batting Reports
      test.describe("#batting reports", function() {
        test.before(function() {
          filters.changeFilterGroupDropdown('Common');
          filters.toggleSidebarFilter('Horizontal Location:', 'Middle Third', true);
        });

        var reports = [
          { type: 'Counting', topStat: 86, statType: 'H'},  
          { type: 'Pitch Rates', topStat: '62.7%', statType: 'InZone%', colNum: 13},            
          { type: 'Pitch Count', topStat: '269', statType: 'InZone#'},            
          { type: 'Pitch Types', topStat: '60.8%', statType: 'Fast%', colNum: 7},                      
          { type: 'Pitch Type Counts', topStat: '401', statType: 'Fast#', colNum: 7},                      
          { type: 'Pitch Locations', topStat: '62.7%', statType: 'InZone%', colNum: 7},   
          { type: 'Pitch Calls', topStat: '-22.35', statType: 'SLAA', colNum: 7},   
          { type: 'Hit Types', topStat: '0.35', statType: 'GB/FB', colNum: 6},   
          { type: 'Hit Locations', topStat: '70.1%', statType: 'HPull%', colNum: 9},   
          { type: 'Home Runs', topStat: '20', statType: 'HR', colNum: 7},   
          { type: 'Exit Data', topStat: '.789', statType: 'ExSLG', colNum: 11},   
        ];
        reports.forEach(function(report) {
          test.it("selecting " + report.type + " shows the correct stat value", function() {
            var colNum = report.colNum || 12;
            var rowNum = report.rowNum || 1;
            playersPage.changeReport(report.type);  
            playersPage.getTableStat(rowNum, colNum).then(function(stat) {
              assert.equal(stat, report.topStat);
            });
          });
        });

        test.after(function() {
          filters.toggleSidebarFilter('Horizontal Location:', 'Middle Third', false);
        });
      });                      
    });

    test.describe('#SubSection: Occurences & Streaks', function() {
      test.it('clicking the occurences & streaks link goes to the correct URL', function() {
        playersPage.goToSubSection('occurrencesAndStreaks');
        filters.removeSelectionFromDropdownFilter("Seasons:");
        filters.addSelectionToDropdownFilter("Seasons:", 2013);

        driver.getCurrentUrl().then(function(url) {
          assert.match(url, /players\-streaks\-batting/);
        });
      });

      test.it('table should be populated on load', function() {
        playersPage.getStreaksTableStat(1,5).then(function(stat) {
          assert.isNotNull(stat);
        });
      });  

      test.it('table should have proper headers on load', function() {
        playersPage.getStreaksTableHeader(1).then(function(header) {
          assert.equal(header, "Count");
        });

        playersPage.getStreaksTableHeader(2).then(function(header) {
          assert.equal(header, "FullName");
        });        

        playersPage.getStreaksTableHeader(3).then(function(header) {
          assert.equal(header, "StartTeam");
        });        

        playersPage.getStreaksTableHeader(4).then(function(header) {
          assert.equal(header, "EndTeam");
        });        

        playersPage.getStreaksTableHeader(5).then(function(header) {
          assert.equal(header, "StartDate");
        });        

        playersPage.getStreaksTableHeader(6).then(function(header) {
          assert.equal(header, "EndDate");
        });        

        playersPage.getStreaksTableHeader(7).then(function(header) {
          assert.equal(header, "H");
        });        
      });    

      test.it('changing the main constraint should update the table headers', function() {
        playersPage.changeMainConstraint("Most Recent", "Exactly", 4, "SB (Batting)", "In a Game", "Within a Season");
        playersPage.getStreaksTableHeader(6).then(function(header) {
          assert.equal(header, "SB");
        });   
      });

      test.it('changing the main constraint should update the table stats', function() {
        playersPage.getStreaksTableStat(1,1).then(function(playerName) {
          assert.equal(playerName, "Billy Hamilton (CF-CIN)");
        });

        playersPage.getStreaksTableStat(1,6).then(function(statType) {
          assert.equal(statType, "4");
        });         
      });          
    });

    test.describe('#SubSection: Scatter Plot', function() {
      test.before(function() {
        filters.removeSelectionFromDropdownFilter("Seasons:");
        filters.addSelectionToDropdownFilter("Seasons:", 2013);
      });

      test.it('clicking the scatter_plot link goes to the correct URL', function() {
        playersPage.goToSubSection('scatterPlot');
        driver.getCurrentUrl().then(function(url) {
          assert.match(url, /players\-scatter\-plot\-batting/);
        });
      });

      test.it('table should be populated on load', function() {
        playersPage.getScatterPlotTableStat(1,2).then(function(stat) {
          assert.isNotNull(stat);
        });
      });  

      test.it('changing the x-axis stat should update the table', function() {
        playersPage.changeXStat('BABIP');
        playersPage.getScatterPlotTableHeader(3).then(function(header) {
          assert.equal(header, 'BABIP');
        });
      });  

      test.it('changing the y-axis stat should update the table', function() {
        playersPage.changeYStat('HR%');
        playersPage.getScatterPlotTableHeader(4).then(function(header) {
          assert.equal(header, 'HR%');
        });      
      });        

      test.it('adding a global filter should update the table', function() {
        var originalHomeRunsPer;
        playersPage.getScatterPlotTableStat(1,4).then(function(homeRunsPer) {
          originalHomeRunsPer = homeRunsPer;
        });
        
        playersPage.addGlobalFilter('Day of Week: Sunday');
        playersPage.getScatterPlotTableStat(1,4).then(function(newHomeRunsPer) {
          assert.notEqual(newHomeRunsPer, originalHomeRunsPer);
        });            
      }); 

      test.it('clicking add a trend line should display a trendline on the chart', function() {
        playersPage.toggleDisplayTrendLine();
        playersPage.isTrendLineVisible().then(function(displayed) {
          assert.equal(displayed, true)
        });
      });        
    });
  });

  test.describe('#Section: Pitching', function() {
    test.before(function() {    
      playersPage.goToSubSection("stats");
      playersPage.goToSection("pitching");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2012);
      eraCol = 21;
      ksCol = 19;
    });

    test.describe('#SubSection: Stats', function() {
      // Sorting
      test.describe("#sorting", function() {
        var columns = [
          { colNum: 21, colName: 'ERA', sortType: 'ferpNumber', defaultSort: 'asc', initialCol: true },
          { colNum: 5, colName: 'G', sortType: 'ferpNumber', defaultSort: 'desc' },
          { colNum: 9, colName: 'Win%', sortType: 'ferpNumber', defaultSort: 'desc' },
          { colNum: 11, colName: 'BS', sortType: 'ferpNumber', defaultSort: 'asc' },
          { colNum: 28, colName: 'WHAV', sortType: 'ferpNumber', defaultSort: 'asc' },
        ]

        columns.forEach(function(column) {
          test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
            if (!column.initialCol) playersPage.clickTableColumnHeader(column.colNum);
            playersPage.waitForTableToLoad();
            playersPage.getTableStatsForCol(column.colNum).then(function(stats) {
              stats = extensions.normalizeArray(stats, column.sortType);
              var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
              assert.deepEqual(stats, sortedArray);
            })
          });

          test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
            playersPage.clickTableColumnHeader(column.colNum);
            playersPage.waitForTableToLoad();
            playersPage.getTableStatsForCol(column.colNum).then(function(stats) {
              stats = extensions.normalizeArray(stats, column.sortType);
              var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
              var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
              assert.deepEqual(stats, sortedArray);
            })
          });
        });

        test.after(function() {
          playersPage.clickTableColumnHeader(19);
        });        
      });

      // Video Playlist
      test.describe('#VideoPlaylist', function() {     
        test.it('clicking on a player stat opens the play by play modal', function() {
          playersPage.clickTableStat(1, 20);
          playersPage.getMatchupsAtBatHeaderText(1).then(function(text) {
            assert.equal(text, 'Vs LHB A. Gordon (KC), Top 4, 0 Out');
          });
        });

        test.it('clicking into video opens correct video', function() {
          playersPage.clickPitchVideoIcon(1);
          playersPage.getVideoPlaylistText(1,1).then(function(text) {
            assert.equal(text, "Top 4, 0 out");
          });

          playersPage.getVideoPlaylistText(1,3).then(function(text) {
            assert.equal(text, "1-1 Four Seamer 94.0 MPH ,100.0% ProbSL");
          });          
        }); 

        test.after(function() {
          playersPage.closeVideoPlaylistModal();
        });
      });

      // Video Library
      test.describe('#VideoLibrary - add video to existing playlist', function() {     
        test.it('adding video to list', function() {
          playersPage.addVideoToList(1, 'Players Tests');
        });

        test.it('should have correct # of videos', function() {
          playersPage.closePlayByPlayModal();
          playersPage.openVideoLibrary();
          playersPage.openVideoList('Players Tests');
          playersPage.getVideoCountFromList().then(function(count) {
            assert.equal(count, 8);
          });
        });

        test.it('should be able to play video', function() {
          playersPage.playVideoFromList(1);
          playersPage.isVideoModalDisplayed().then(function(displayed){
            assert.equal(displayed, true);
          });        
        });

        test.it('closing video modal', function() {
          playersPage.closeVideoPlaylistModal();
        });
      });

      test.describe('#VideoLibrary - removing video thru pbp', function() {     
        test.it('should have correct # of videos', function() {
          playersPage.clickTableStat(1, 20);
          playersPage.pbpRemoveVideoFromList(1, 'Players Tests');
          playersPage.closePlayByPlayModal();
          playersPage.openVideoLibrary();
          playersPage.getVideoCountFromList().then(function(count) {
            assert.equal(count,7);
          });
        });

        test.it('closing video modal', function() {
          playersPage.closeVideoLibrary();
        });
      });  

      // Filters
      test.describe("#filters", function() {
        test.it('adding filter: (Men On: On 1B) from dropdown displays correct data', function() {
          filters.addDropdownFilter('Men On: On 1B');

          playersPage.getTableStat(1, ksCol).then(function(ks) {
            assert.equal(ks, 68);
          });
        });

        test.it('adding filter: (Horizontal Location: Outer Half) from sidebar displays correct data', function() {
          filters.toggleSidebarFilter('Horizontal Location:', 'Outer Half', true);

          playersPage.getTableStat(1,ksCol).then(function(ks) {
            assert.equal(ks, 43);
          });
        });

        test.it('changing filter: (Game Type: World Series) from sidebar displays correct data', function() {
          filters.toggleSidebarFilter('Game Type:', 'World Series', true);
          filters.toggleSidebarFilter('Game Type:', 'Reg', false);

          playersPage.getTableStat(1,ksCol).then(function(ks) {
            assert.equal(ks, 2);
          });
        });

        test.after(function() {
          filters.toggleSidebarFilter('Game Type:', 'Reg', true);
          filters.toggleSidebarFilter('Game Type:', 'World Series', false);
          filters.closeDropdownFilter('Men On');
          filters.closeDropdownFilter('Horizontal Location');
        });
      });  

       // Isolation Mode
      test.describe("#isolation mode", function() {
        test.it('selecting Jake Arrieta from search should add player to table', function() {
          playersPage.clickIsoBtn("on");
          playersPage.addToIsoTable('Jake Arrieta', 1)

          playersPage.getTableStat(1,3).then(function(stat) {
            assert.equal(stat, ' J. Arrieta (P-BAL)', '1st row player name');
          })
        });      

  
        test.it('selecting Madison Bumgarner from search should add player to table', function() {
          playersPage.addToIsoTable('Madison Bumgarner', 1)
          playersPage.getTableStat(1,3).then(function(stat) {
            assert.equal(stat, ' M. Bumgarner (P-SF)', '1st row player name');
          });

          playersPage.getTableStat(2,3).then(function(stat) {
            assert.equal(stat, ' J. Arrieta (P-BAL)', '2nd row player name');
          });
        });         

        test.it('pinned total should show the correct sum', function() {
          playersPage.getPinnedTotalTableStat(4).then(function(wins) {
            assert.equal(wins, 5225, 'pinned total - pitches');
          });
        });                                       

        test.it('turning off isolation mode should show players in iso table', function() {
          playersPage.clickIsoBtn("off");
          playersPage.getIsoTableStat(1,3).then(function(stat) {
            assert.equal(stat, ' M. Bumgarner (P-SF)', '1st row player name');
          });

        });                                               
      });

      // Chart/Edit Columns
      test.describe("#chart/edit columns", function() {
        // histograms
        test.it('clicking show histogram link should open histogram modal', function() {
          playersPage.clickChartColumnsBtn()
          
          playersPage.openHistogram(19);  
          playersPage.isModalDisplayed().then(function(isDisplayed) {
            assert.equal(isDisplayed, true);
          });
        });  

        test.it('hovering over bar should show stats for players', function() {
          playersPage.hoverOverHistogramStack(1)
          playersPage.getTooltipText().then(function(text) {
            assert.equal(text, 'J. Chamberlain: 22 (NYY-P)\nH. Ambriz: 22 (HOU-P)\nE. Ramirez: 22 (NYM-P)\nN. Adcock: 22 (KC-P)\nE. Escalona: 21 (COL-P)\nA. Varvaro: 21 (ATL-P)\nK. McPherson: 21 (PIT-P)\nC. Rusin: 21 (CHC-P)\nT. Skaggs: 21 (ARI-P)\nR. Hill: 21 (BOS-P)\n+ 192 more', 'tooltip for 1st bar');
          });
        });

        test.it('pinned players should be represented by circles', function() {
          playersPage.getHistogramCircleCount().then(function(count) {
            assert.equal(count, 2, '# of circles on histogram')
          })
        })

        test.it("selecting 'Display pins as bars' should add team to the histogram", function() {
          playersPage.toggleHistogramDisplayPinsAsBars();
          playersPage.getHistogramBarCount().then(function(count) {
            // 1 original bar and 4 new bars will have height=0 and will appear invisible
            assert.equal(count, 22, '# of bars on histogram');
          });
        });

        test.it("changing Bin Count should update the histogram", function() {
          playersPage.changeHistogramBinCount(3);
          playersPage.getHistogramBarCount().then(function(count) {
            // 1 original bar and 4 new bars will have height=0 and will appear invisible
            assert.equal(count, 6, '# of bars on histogram');
          });
        })        

        test.it('clicking close histogram button should close histogram modal', function() {
          playersPage.closeModal();
          playersPage.isModalDisplayed().then(function(isDisplayed) {
            assert.equal(isDisplayed, false);
          }); 
        })     
      });

      // Reports
      test.describe("#reports", function() {
        var reports = [
          { type: 'Rate', topStat: 0.206, statType: "BA", colNum: 9 },  
          { type: 'Counting', topStat: 147, statType: "H", colNum: 9 },  
          { type: 'Pitch Rates', topStat: "58.0%", statType: "InZone%", colNum: 13 },  
          { type: 'Pitch Counts', topStat: 1860, statType: "InZone#", colNum: 12 },  
          { type: 'Pitch Types', topStat: "65.2%", statType: "Fast%", colNum: 7 },  
          { type: 'Pitch Type Counts', topStat: 2123, statType: "Fast#", colNum: 7 },  
          { type: 'Pitch Locations', topStat: "58.0%", statType: "InZone%", colNum: 7 },  
          { type: 'Pitch Calls', topStat: 71.40, statType: "SLAA", colNum: 7 },  
          { type: 'Hit Types', topStat: 1.71, statType: "GB/FB", colNum: 6 },  
          { type: 'Hit Locations', topStat: "52.2%", statType: "HPull%", colNum: 10 },  
          { type: 'Home Runs', topStat: 9, statType: "HR", colNum: 7 },  
          { type: 'Movement', topStat: 91.3, statType: "Vel", colNum: 7 },  
          { type: 'Bids', topStat: 1, statType: "NH", colNum: 8 },  
          { type: 'Baserunning', topStat: "12.5%", statType: "SB%", colNum: 8 },  
          { type: 'Exit Data', topStat: 0.332, statType: "ExSLG%", colNum: 11 }
        ];
        reports.forEach(function(report) {
          test.it("selecting " + report.type + " shows the correct stat value for " + report.statType, function() {
            playersPage.changeReport(report.type);  
            playersPage.getTableStat(1,report.colNum).then(function(stat) {
              assert(stat, report.topStat);
            });
          });
        });        
      });
    });
  });

  test.describe('#Section: Catching', function() {
    test.before(function() {    
      playersPage.goToSubSection("stats");
      playersPage.goToSection("catching");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2012);
      slaaCol = 7;
    });

    test.describe('#SubSection: Stats', function() {
      // Sorting
      test.describe("#sorting", function() {
        var columns = [
          { colNum: 7, colName: 'SLAA', sortType: 'ferpNumber', defaultSort: 'desc', initialCol: true },
          { colNum: 8, colName: 'CallStrk#', sortType: 'ferpNumber', defaultSort: 'asc' },
          { colNum: 6, colName: 'P', sortType: 'ferpNumber', defaultSort: 'desc' },
          { colNum: 11, colName: 'FrmCntRAA', sortType: 'ferpNumber', defaultSort: 'desc' },
          { colNum: 14, colName: 'BallFrmd', sortType: 'ferpNumber', defaultSort: 'asc' },
        ]

        columns.forEach(function(column) {
          test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
            if (!column.initialCol) playersPage.clickTableColumnHeader(column.colNum);
            playersPage.waitForTableToLoad();
            playersPage.getTableStatsForCol(column.colNum).then(function(stats) {
              stats = extensions.normalizeArray(stats, column.sortType);
              var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
              assert.deepEqual(stats, sortedArray);
            })
          });

          test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
            playersPage.clickTableColumnHeader(column.colNum);
            playersPage.waitForTableToLoad();
            playersPage.getTableStatsForCol(column.colNum).then(function(stats) {
              stats = extensions.normalizeArray(stats, column.sortType);
              var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
              var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
              assert.deepEqual(stats, sortedArray);
            })
          });
        });

        test.after(function() {
          playersPage.clickTableColumnHeader(7);
        });        
      });

      // Filters
      test.describe("#filters", function() {
        test.it('adding filter: (Pitch Type: Knuckleball) from dropdown displays correct data', function() {
          playersPage.clickTableColumnHeader(5);
          filters.toggleSidebarFilter('Pitch Type:', 'Knuckleball', true);

          playersPage.getTableStat(1, 5).then(function(bf) {
            assert.equal(bf, 619, 'Josh Thole BF');
          });
        });

        test.it('adding filter: (Pitch Type: Screwball) from dropdown displays correct data', function() {
          filters.toggleSidebarFilter('Pitch Type:', 'Screwball', true);

          playersPage.getTableStat(3, 5).then(function(bf) {
            assert.equal(bf, 17, 'AJ Pierzynski BF');
          });
        });   

        test.it('adding filter: (Pitch Type: Intentional Ball) from dropdown displays correct data', function() {
          filters.toggleSidebarFilter('Pitch Type:', 'Intentional Ball', true);

          playersPage.getTableStat(1, 5).then(function(bf) {
            assert.equal(bf, 637, 'Josh Thole BF');
          });
        });  

        test.it('adding filter: (PA Result: Strikeout) from dropdown displays correct data', function() {
          filters.toggleSidebarFilter('PA Result:', 'Strikeout', true);

          playersPage.getTableStat(1, 5).then(function(bf) {
            assert.equal(bf, 152, 'Josh Thole BF');
          });
        }); 

        test.it('adding filter: (PA Result: Double Play) from dropdown displays correct data', function() {
          filters.toggleSidebarFilter('PA Result:', 'Double Play', true);

          playersPage.getTableStat(1, 5).then(function(bf) {
            assert.equal(bf, 173, 'Josh Thole BF');
          });
        });

        test.it('adding filter: (PA Result: ROE) from dropdown displays correct data', function() {
          filters.toggleSidebarFilter('PA Result:', 'ROE', true);

          playersPage.getTableStat(1, 5).then(function(bf) {
            assert.equal(bf, 179, 'Josh Thole BF');
          });
        });         

        test.after(function() {
          filters.closeDropdownFilter('Pitch Type');
          filters.closeDropdownFilter('PA Result');
        })
      });        

      // Video Playlist
      test.describe('#VideoPlaylist', function() {     
        test.it('clicking on a player stat opens the play by play modal (Matt Weiters - BallsFrmd)', function() {
          playersPage.clickTableStat(1, 14);
          playersPage.getMatchupsAtBatHeaderText(1).then(function(text) {
            assert.equal(text, 'Vs LHB B. Zobrist (TB), Bot 1, 1 Out');
          });
        });

        test.it('clicking into video opens correct video', function() {
          playersPage.clickPitchVideoIcon(1);
          playersPage.getVideoPlaylistText(1,1).then(function(text) {
            assert.equal(text, "Bot 1, 1 out");
          });

          playersPage.getVideoPlaylistText(1,3).then(function(text) {
            assert.equal(text, "1-2 Knuckle Curve 79.0 MPH ,76.5% ProbSL");
          });          
        }); 

        test.after(function() {
          playersPage.closeVideoPlaylistModal();
        });
      });

      // Video Library
      test.describe('#VideoLibrary - add video to existing playlist', function() {     
        test.it('should have correct # of videos', function() {
          playersPage.addVideoToList(1, 'Players Tests');
          playersPage.closePlayByPlayModal();
          playersPage.openVideoLibrary();
          playersPage.openVideoList('Players Tests');
          playersPage.getVideoCountFromList().then(function(count) {
            assert.equal(count, 8);
          });
        });

        test.it('should be able to play video', function() {
          playersPage.playVideoFromList(1);
          playersPage.isVideoModalDisplayed().then(function(displayed){
            assert.equal(displayed, true);
          });        
        });

        test.it('closing video modal', function() {
          playersPage.closeVideoPlaylistModal();
        });
      });

      test.describe('#VideoLibrary - removing video thru sidebar', function() {     
        test.it('should have correct # of videos', function() {
          playersPage.openVideoLibrary();
          playersPage.removeVideoFromList(1);
          playersPage.getVideoCountFromList().then(function(count) {
            assert.equal(count, 7);
          });
        });

        test.it('closing video modal', function() {
          playersPage.closeVideoLibrary();
        });
      });  

      // Reports
      test.describe("#reports", function() {
        var reports = [
          { type: 'Catcher Framing', topStat: -36.6, statType: "SLAA", colNum: 7 },  
          { type: 'Catcher Defense', topStat: 9.17, statType: "FldRAA", colNum: 10 },  
          { type: 'Catcher Opposing Batters', topStat: 4882, statType: "BF", colNum: 5 },  // Not sorted
          { type: 'Catcher Pitch Rates', topStat: "49.5%", statType: "InZoneMdl%", colNum: 8 },  
          { type: 'Catcher Pitch Counts', topStat: 209, statType: "StrkFrmd", colNum: 12 },
          { type: 'Pitching Counting', topStat: 19317, statType: "P", colNum: 6 },
          { type: 'Catcher Pitch Types', topStat: "47.4%", statType: "Fast%", colNum: 7 },
          { type: 'Catcher Pitch Type Rates', topStat: 6987, statType: "Fast#", colNum: 7 },
        ];
        reports.forEach(function(report) {
          test.it("selecting " + report.type + " shows the correct stat value for " + report.statType, function() {
            playersPage.changeReport(report.type);  
            playersPage.getTableStat(1,report.colNum).then(function(stat) {
              assert.equal(stat, report.topStat);
            });
          });
        });        
      });
    });
  });

  test.describe('#Section: Statcast Fielding', function() {
    test.before(function() {    
      playersPage.goToSubSection("stats");
      playersPage.goToSection("statcastFielding");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
      statCol = 10;
    });    

    test.describe('#SubSection: Stats', function() {
      // Sorting
      test.describe("#sorting", function() {
        var columns = [
          { colNum: 10, colName: 'OFWAirOut%', sortType: 'ferpNumber', defaultSort: 'desc', initialCol: true },
          { colNum: 9, colName: 'OFBadCatch', sortType: 'ferpNumber', defaultSort: 'asc' },
          { colNum: 7, colName: 'OFAirHit', sortType: 'ferpNumber', defaultSort: 'desc' },
          { colNum: 12, colName: 'OFLWRnPM', sortType: 'ferpNumber', defaultSort: 'desc' },
          { colNum: 14, colName: 'OFNIHit', sortType: 'ferpNumber', defaultSort: 'asc' },
        ]

        columns.forEach(function(column) {
          test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
            if (!column.initialCol) playersPage.clickTableColumnHeader(column.colNum);
            playersPage.waitForTableToLoad();
            playersPage.getTableStatsForCol(column.colNum).then(function(stats) {
              stats = extensions.normalizeArray(stats, column.sortType);
              var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
              assert.deepEqual(stats, sortedArray);
            })
          });

          test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
            playersPage.clickTableColumnHeader(column.colNum);
            playersPage.waitForTableToLoad();
            playersPage.getTableStatsForCol(column.colNum).then(function(stats) {
              stats = extensions.normalizeArray(stats, column.sortType);
              var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
              var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
              assert.deepEqual(stats, sortedArray);
            })
          });
        });

        test.after(function() {
          playersPage.clickTableColumnHeader(10);
        });        
      });     

      // Video Playlist
      test.describe('#VideoPlaylist', function() {     
        test.it('clicking on a player stat opens the play by play modal', function() {
          playersPage.clickTableStat(1, 4);
          playersPage.getMatchupsAtBatHeaderText(1).then(function(text) {
            assert.equal(text, 'RHP T. Adleman (CIN) Vs LHB M. Carpenter (STL), Top 1, 0 Out');
          });
        });

        test.it('clicking into video opens correct video', function() {
          playersPage.clickPitchVideoIcon(1);
          playersPage.getVideoPlaylistText(1,1).then(function(text) {
            assert.equal(text, "Top 1, 0 out");
          });

          playersPage.getVideoPlaylistText(1,3).then(function(text) {
            assert.equal(text, "5.70s HT | 63.2ft | 0.8s RT | 1.84s Jmp | 97.2% Eff | 13.3mph | 27.3ft to Wall | 100.0% outProb |");
          });          
        }); 

        test.it('clicking similar plays icon opens modal', function() {
          playersPage.closeVideoPlaylistModal();
          playersPage.clickSimiliarPlaysIcon(1);
          playersPage.getSimiliarPlaysHeader().then(function(title) {
            assert.match(title, /50 most similar fielding plays to out recorded by Billy Hamilton in CF at Great American Ball Park \(9\/4\/2016\)/, 'modal title');
          })
        });

        test.after(function() {
          playersPage.closeSimiliarPlaysModal();
        });
      });    

      // Video Library
      test.describe('#VideoLibrary - add video to existing playlist', function() {     
        test.it('adding video to list', function() {
          playersPage.addVideoToList(1, 'Players Tests');
        });

        test.it('should have correct # of videos', function() {
          playersPage.closePlayByPlayModal();
          playersPage.openVideoLibrary();
          playersPage.openVideoList('Players Tests');
          playersPage.getVideoCountFromList().then(function(count) {
            assert.equal(count, 8);
          });
        });

        test.it('should be able to play video', function() {
          playersPage.playVideoFromList(1);
          playersPage.isVideoModalDisplayed().then(function(displayed){
            assert.equal(displayed, true);
          });        
        });

        test.it('closing video modal', function() {
          playersPage.closeVideoPlaylistModal();
        });
      });

      test.describe('#VideoLibrary - changing name of playlist', function() {     
        test.it('should rename playlist', function() {
          playersPage.openVideoLibrary();
          playersPage.navigateBackToListIndex();

          playersPage.changeNameOfList('Players Tests', 'Players Tests 2');
          playersPage.listExistsInVideoLibrary('Players Tests 2').then(function(exists) {
            assert.equal(exists, true)
          });
        });
      }); 

      test.describe('#VideoLibrary - deleting playlist', function() {
        test.it('should remove playlist', function() {
          playersPage.deleteListFromLibrary('Players Tests 2');
          
          playersPage.listExistsInVideoLibrary('Players Tests 2').then(function(exists) {
            assert.equal(exists, false);
          })
        });

        test.it('close video library', function() {
          playersPage.closeVideoLibrary();
        });
      });    

      test.describe("#filters", function() {
        test.it('adding filter: (Height: 60 to 72) from sidebar displays correct data', function() {
          filters.changeFilterGroupDropdown('Player')
          filters.changeValuesForRangeSidebarFilter('Height:', 60, 72);

          playersPage.getTableStat(1, 4).then(function(stat) {
            assert.equal(stat, 351, '# of OFAirBall - Billy Hamilton');
          });
        });
 
        test.it('adding filter: (Weight: 180 to 250) from sidebar displays correct data', function() {
          filters.changeValuesForRangeSidebarFilter('Weight:', 180, 250);

          playersPage.getTableStat(1, 4).then(function(stat) {
            assert.equal(stat, 485, '# of OFAirBall - E Inciarte');
          });
        });

        test.it('adding filter: (Team Org: ATL) from sidebar displays correct data', function() {
          filters.changeFilterGroupDropdown('Season')
          filters.addSelectionToDropdownSidebarFilter('Team Org:', 'ATL');

          playersPage.getTableStat(1, 4).then(function(stat) {
            assert.equal(stat, 485, '# of OFAirBall - E. Inciarte');
          });
        });

        test.it('adding filter: (Initial Fielder Result: Outfield Fly Ball Hit) from sidebar displays correct data', function() {
          filters.changeFilterGroupDropdown('Pitch')
          filters.addSelectionToDropdownSidebarFilter('Initial Fielder Result:', 'Outfield Fly Ball Hit');

          playersPage.getTableStat(1, 4).then(function(stat) {
            assert.equal(stat, 38, '# of OFAirBall - E. Inciarte');
          });
        });
         
        test.after(function() {
          filters.closeDropdownFilter('Height:');
          filters.closeDropdownFilter('Weight:');
          filters.closeDropdownFilter('Team Org:');
          filters.closeDropdownFilter('Initial Fielder Result:');
        });
      });  

      // Reports
      test.describe("#reports", function() {
        var reports = [
          { type: 'Outfielder Air Defense Positioning', topStat: '106.9%', statType: "OFWPosAirOut%", colNum: 7 },  
          { type: 'Outfielder Air Defense Skills', topStat: "71.0%", statType: "OFAirOut%", colNum: 7 },  
          { type: 'Outfield Batter Positioning', topStat: "97.0%", statType: "OFWPosAirOut%", colNum: 7 } 
        ];
        reports.forEach(function(report) {
          test.it("selecting " + report.type + " shows the correct stat value for " + report.statType, function() {
            playersPage.changeReport(report.type);  
            playersPage.getTableStat(1,report.colNum).then(function(stat) {
              assert.equal(stat, report.topStat);
            });
          });
        });        
      });
    });
  }); 
});