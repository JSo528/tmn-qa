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

test.describe('#Team StatcastFielding Section', function() {
  test.it('navigating to SF Giants 2016 team Page', function() {  
    navbar  = new Navbar(driver);  
    filters  = new Filters(driver);  
    teamsPage = new TeamsPage(driver);
    teamPage = new TeamPage(driver);

    navbar.goToTeamsPage();
    filters.removeSelectionFromDropdownFilter("Seasons:");
    filters.addSelectionToDropdownFilter("Seasons:", 2016);
    teamsPage.clickTeamTableCell(11,3); // should click into San Francisco Giants
    teamPage.goToSection("statcastFielding");
  });  

  test.it('should be on San Francisco Giants 2016 team page', function() {
    filters.removeSelectionFromDropdownFilter("Seasons:");
    filters.addSelectionToDropdownFilter("Seasons:", 2016);

    teamPage.getTeamName().then(function(text) {
      assert.equal( text, 'San Francisco Giants');
    });
  });

  // Overview Section
  test.describe("#Subsection: Overview", function() {
    test.it('should initially have the correct data', function() {
      teamPage.getOverviewTableStat(3).then(function(ofAirBall) {
        assert.equal(ofAirBall, 1460, 'OFAirBall');
      });        
    });          

    test.it('hitChart should have correct # of balls in play initially', function() {
      teamPage.getHitChartHitCount('single').then(function(count) {
        assert.equal(count, 758, 'correct number of singles');
      });
      
      teamPage.getHitChartHitCount('double').then(function(count) {
        assert.equal(count, 228, 'correct number of doubles');
      });        

      teamPage.getHitChartHitCount('triple').then(function(count) {
        assert.equal(count, 40, 'correct number of triples');
      });        

      teamPage.getHitChartHitCount('homeRun').then(function(count) {
        assert.equal(count, 0, 'correct number of home runs');
      });   

      teamPage.getHitChartHitCount('out').then(function(count) {
        assert.equal(count, 2214, 'correct number of outs');
      });         
    })  

    // Outfield Positioning
    test.describe('#OutfieldPositioning (filter: 4/4/2016)', function() {  
      test.it('should show correct # of plays on chart', function() {
        filters.changeValuesForDateSidebarFilter('Date Range:', '2016-4-4', '2016-4-4');
        teamPage.getStatcastFieldingBallCount().then(function(count) {
          assert.equal(count, 3);
        })
      });

      test.it('clicking LF button should zoom into the LF portion of the chart', function() {
        teamPage.clickStatcastFieldingZoomBtn('LF');
        teamPage.getStatcastFieldingChartTranslation().then(function(attr) {
          assert.equal(attr, "translate(-200,-300)scale(3,3)");
        })
      });

      test.it('clicking All button should zoom out the chart', function() {
        teamPage.clickStatcastFieldingZoomBtn('');
        teamPage.getStatcastFieldingChartTranslation().then(function(attr) {
          assert.equal(attr, "translate(0,0)scale(1,1)");
        })
      });

      test.it('changing ballpark should change background image for fielding widget', function() {
        teamPage.changeBallparkDropdown('AT&T Park');
        teamPage.getCurrentBallparkImageID().then(function(id) {
          assert.equal(id, 'SF_-_2395', 'image id');
        });
      });
    });

    test.describe('#Range (filter: 4/4/2016)', function() {  
      test.it('hitChart should have correct # of balls in play', function() {
        teamPage.getHitChartHitCount('single').then(function(count) {
          assert.equal(count, 2, 'correct number of singles');
        });
        
        teamPage.getHitChartHitCount('double').then(function(count) {
          assert.equal(count, 0, 'correct number of doubles');
        });        

        teamPage.getHitChartHitCount('triple').then(function(count) {
          assert.equal(count, 0, 'correct number of triples');
        });        

        teamPage.getHitChartHitCount('homeRun').then(function(count) {
          assert.equal(count, 0, 'correct number of home runs');
        });   

        teamPage.getHitChartHitCount('out').then(function(count) {
          assert.equal(count, 5, 'correct number of outs');
        });         
      })
    })

    test.describe('#OutfieldRange (filter: 4/4/2016)', function() {    
      test.it('should show correct # of points on chart', function() {
        teamPage.getBinnedBoxesRectCount().then(function(count) {
          assert.equal(count, 3);
        })
      });

      test.it('should display correct count of plays by out prob', function() {
        teamPage.getBinnedBoxesPlayCountForOutProb(0.01).then(function(count) {
          assert.equal(count, 1, '<0.01 outProb play count');
        })

        teamPage.getBinnedBoxesPlayCountForOutProb(0.1).then(function(count) {
          assert.equal(count, 0, '<0.1 outProb play count');
        })

        teamPage.getBinnedBoxesPlayCountForOutProb(0.2).then(function(count) {
          assert.equal(count, 0, '<0.2 outProb play count');
        })

        teamPage.getBinnedBoxesPlayCountForOutProb(0.8).then(function(count) {
          assert.equal(count, 0, '<0.8 outProb play count');
        })

        teamPage.getBinnedBoxesPlayCountForOutProb(0.9).then(function(count) {
          assert.equal(count, 0, '<0.9 outProb play count');
        })

        teamPage.getBinnedBoxesPlayCountForOutProb(0.99).then(function(count) {
          assert.equal(count, 0, '<0.99 outProb play count');
        })

        teamPage.getBinnedBoxesPlayCountForOutProb(1).then(function(count) {
          assert.equal(count, 2, '<1 outProb play count');
        })
      });

      test.it('should display correct outs added text', function() {
        teamPage.getBinnedBoxesOutsAddedText().then(function(text) {
          assert.equal(text, '0.01 Outs Added');
        });
      });

      test.it('removing date filter', function() {
        filters.closeDropdownFilter('Date Range:');
      });
    });

    
    // Video Playlist
    test.describe('#VideoPlaylist', function() {    
      test.it('clicking on a stat opens the play by play modal', function() {
        teamPage.clickOverviewTableStat(8);
        teamPage.getMatchupsAtBatHeaderText(1).then(function(text) {
          assert.equal(text, 'RHP J. Nathan (SF) Vs RHB N. Hundley (COL), Bot 9, 1 Out');
        });
      });

      test.it('clicking into video opens correct video', function() {
        teamPage.clickPitchVideoIcon(1);
        teamPage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "Bot 9, 1 out");
        });

        teamPage.getVideoPlaylistText(1,3).then(function(text) {
          assert.equal(text, "5.09s HT | 93.2ft | 1.3s RT | 2.34s Jmp | 0.966776 Eff | 19.6mph | 146.6ft to Wall | 97.1% outProb |");
        });          
      }); 

      test.it('clicking similar plays icon opens modal', function() {
        teamPage.closeVideoPlaylistModal();
        teamPage.clickSimiliarPlaysIcon(1);
        teamPage.getSimiliarPlaysHeader().then(function(title) {
          // need to use match since this is dynamic
          assert.match(title, /most similar fielding plays to failed out by Angel Pagan in LF at Coors Field \(9\/7\/2016\)/, 'modal title');
        })
      });

      test.after(function() {
        teamPage.closeSimiliarPlaysModal();
      });
    });

    // Video Library
    test.describe('#VideoLibrary - add video to new playlist from flat view', function() {     
      test.it('should create new playlist', function() {
        teamPage.addVideoToNewList(1, 'Team StatcastFielding Tests');
      });

      test.it('playlist should exist', function() {
        teamPage.closePlayByPlayModal();
        teamPage.openVideoLibrary();
        teamPage.listExistsInVideoLibrary('Team StatcastFielding Tests').then(function(exists) {
          assert.equal(exists, true, 'Team StatcastFielding Tests playlist exists in library');
        });
      });

      // TODO - turn these tests back on once feature is fixed

      // test.it('should have correct # of videos', function() {
      //   teamPage.openVideoList('Team StatcastFielding Tests');
      //   teamPage.getVideoCountFromList().then(function(count) {
      //     assert.equal(count, 1);
      //   });
      // });

      // test.it('should be able to play video', function() {
      //   teamPage.playVideoFromList(1);
      //   teamPage.isVideoModalDisplayed().then(function(displayed){
      //     assert.equal(displayed, true);
      //   });        
      // });

      // test.it('closing video modal', function() {
      //   teamPage.closeVideoPlaylistModal();
      // });

      test.it('closing video library', function() {
        teamPage.closeVideoLibrary();
      });
    });     

    test.describe("#filters", function() {
      test.it('adding filter: (Run Diff After Inning: 1 to 3) from sidebar displays correct data', function() {
        filters.changeFilterGroupDropdown('Situation')
        filters.changeValuesForRangeSidebarFilter('Run Diff After Inning:', 1, 3);

        teamPage.getOverviewTableStat(3).then(function(stat) {
          assert.equal(stat, 144, 'OFAirBall');
        });
      });

      test.it('adding filter: (Runs After Inning: 2 to 4) from sidebar displays correct data', function() {
        filters.changeValuesForRangeSidebarFilter('Runs After Inning:', 2, 4);

        teamPage.getOverviewTableStat(3).then(function(stat) {
          assert.equal(stat, 45, 'OFAirBall');
        });
      });      

      test.it('adding filter: (Time Faced In Game: 0 to 1) from sidebar displays correct data', function() {
        filters.changeValuesForRangeSidebarFilter('Time Faced In Game:', 0, 1);

        teamPage.getOverviewTableStat(3).then(function(stat) {
          assert.equal(stat, 25, 'OFAirBall');
        });
      });  

      test.it('adding filter: (PA # In Side: 1) from sidebar displays correct data', function() {
        filters.changeFilterGroupDropdown('PA')
        filters.addSelectionToDropdownSidebarFilter('PA # In Side:', 1);

        teamPage.getOverviewTableStat(3).then(function(stat) {
          assert.equal(stat, 6, 'OFAirBall');
        });
      });  

      test.it('clicking "default filters" returns filters back to default state', function() {
        filters.clickDefaultFiltersBtn();
        filters.removeSelectionFromDropdownFilter("Seasons:");
        filters.addSelectionToDropdownFilter("Seasons:", 2016);
      }); 
    });


    test.describe("#Reports", function() {
      var reports = [
        { type: 'Outfielder Air Defense Team Model', topStat: '107.0%', statType: "ExRange%" },  
        { type: 'Outfielder Air Defense Team Skills', topStat: '58.2%', statType: "OFAirOut%" },  
        { type: 'Outfield Batter Positioning', topStat: '102.8%', statType: "OFWPosAirOut%" },  
      ];
      reports.forEach(function(report) {
        test.it("selecting " + report.type + " shows the correct stat value for " + report.statType, function() {
          teamPage.changeReport(report.type);  
          teamPage.getOverviewTableStat(6).then(function(stat) {
            assert.equal(stat, report.topStat);
          });
        });
      });

      test.after(function() {
        teamPage.changeReport('Outfielder Air Defense Positioning');
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
        { colNum: 10, colName: 'OFWAirOut%', sortType: 'ferpNumber', defaultSort: 'desc', initialCol: true },
        { colNum: 8, colName: 'OFGoodCtch', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colNum: 9, colName: 'OFBadCtch', sortType: 'ferpNumber', defaultSort: 'asc' },
        { colNum: 12, colName: 'OFLWRnPM', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colNum: 13, colName: 'OFNROut', sortType: 'ferpNumber', defaultSort: 'desc' },
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
        teamPage.clickRosterTableColumnHeader(10);
      });        
    });    

    // Video Playlist
    test.describe('#VideoPlaylist', function() {    
      test.it('clicking on a stat opens the play by play modal', function() {
        teamPage.clickRosterTableStat(1,4);
        teamPage.getMatchupsAtBatHeaderText(1).then(function(text) {
          assert.equal(text, 'RHP J. Peavy (SF) Vs LHB A. Amarista (SD), Top 5, 1 Out');
        });
      });

      test.it('clicking into video opens correct video', function() {
        teamPage.clickPitchVideoIcon(1);
        teamPage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "Top 5, 1 out");
        });

        teamPage.getVideoPlaylistText(1,3).then(function(text) {
          assert.equal(text, "3.64s HT | 66.8ft | 0.7s RT | 1.70s Jmp | 98.2% Eff | 18.2mph | 48.5ft to Wall | 46.0% outProb |");
        });          
      }); 

      test.after(function() {
        teamPage.closeVideoPlaylistModal();
      });
    });

    // Video Library
    test.describe('#VideoLibrary - add video to new playlist', function() {     
      test.it('should create new playlist', function() {
        teamPage.addVideoToNewList(1, 'Team StatcastFielding Tests');
      });

      test.it('playlist should exist in library', function() {
        teamPage.closePlayByPlayModal();
        teamPage.openVideoLibrary();
        teamPage.listExistsInVideoLibrary('Team StatcastFielding Tests').then(function(exists) {
          assert.equal(exists, true, 'Team StatcastFielding Tests playlist exists in library');
        });
      });

      test.it('should have correct # of videos', function() {
        teamPage.openVideoList('Team StatcastFielding Tests');
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
      test.it('adding filter: (Batted Ball: Line Drive) from sidebar displays correct data', function() {
        filters.toggleSidebarFilter('Batted Ball:', 'Line Drive', true);

        teamPage.getRosterTableStat(1,1).then(function(player) {
          assert.equal(player, 'Kelby Tomlinson');
        });

        teamPage.getRosterTableStat(1,10).then(function(stat) {
          assert.equal(stat,  '217.4%', 'Kebly Tomlinson OFWAirOut%');
        });          
      });
    });

    test.after(function() {
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

    test.it('should show the correct game data for 10/2/2016', function() {
      teamPage.getGameLogTableStat(1,3).then(function(date) {
        assert.equal(date, '10/2/2016');
      });

      teamPage.getGameLogTableStat(1,4).then(function(score) {
        assert.equal(score, 'W 7-1');
      });      

      teamPage.getGameLogTableStat(1,5).then(function(ofAirBall) {
        assert.equal(ofAirBall, 10, 'row OF Air Ball');
      });            
    });

    // Sorting
    test.describe("#sorting", function() {
      var columns = [
        { colNum: 3, colName: 'Date', sortType: 'dates', defaultSort: 'desc', initialCol: true },
        { colNum: 5, colName: 'OFAirBall', sortType: 'ferpNumber', defaultSort: 'asc' },
        { colNum: 8, colName: 'ExRange%', sortType: 'ferpNumber', defaultSort: 'asc' },
        { colNum: 14, colName: 'OFNROut', sortType: 'ferpNumber', defaultSort: 'asc' },
        { colNum: 15, colName: 'OFNIHit', sortType: 'ferpNumber', defaultSort: 'asc' },
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
        teamPage.clickGameLogTableStat(1,7);
        teamPage.getMatchupsAtBatHeaderText(1).then(function(text) {
          assert.equal(text, 'LHP M. Moore (SF) Vs LHB A. Gonzalez (LAD), Top 4, 2 Out');
        });
      });

      test.it('clicking into video opens correct video', function() {
        teamPage.clickPitchVideoIcon(2);
        teamPage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "Top 4, 2 out");
        });

        teamPage.getVideoPlaylistText(1,3).then(function(text) {
          assert.equal(text, "2.15s HT | 90.4ft | 1.4s RT | 0 Jmp | 0.9343 Eff | 9.0mph | 175.9ft to Wall | 0.0% outProb |");
        });          
      }); 

      test.after(function() {
        teamPage.closeVideoPlaylistModal();
      });
    });

    // Video Library
    test.describe('#VideoLibrary - add video to existing playlist', function() {     
      test.it('should add video', function() {
        teamPage.addVideoToList(1, 'Team StatcastFielding Tests');
      });

      test.it('should have correct # of videos', function() {
        teamPage.closePlayByPlayModal();
        teamPage.openVideoLibrary();
        teamPage.openVideoList('Team StatcastFielding Tests');
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

    test.describe("#filters", function() {
      test.it('adding filter: (Forward Velocity: 80-120) from sidebar displays correct data', function() {
        filters.changeValuesForRangeSidebarFilter("Forward Velocity:", 80, 120);

        teamPage.getGameLogTableStat(1,5).then(function(stat) {
          assert.equal(stat, 5, 'row 1 OFAirBall');
        });          

        teamPage.getGameLogTableStat(1,8).then(function(exRange) {
          assert.equal(exRange, '101.4%', 'row 1 OFWPosAirOut%');
        });                  
      });

      test.it('adding filter: (Batter Age: 20-30) from sidebar displays correct data', function() {
        filters.changeFilterGroupDropdown('Game');
        filters.changeValuesForRangeSidebarFilter("Batter Age:", 20, 30);

        teamPage.getGameLogTableStat(1,5).then(function(stat) {
          assert.equal(stat, 3, 'row 1 OFAirBall');
        });                           
      });

      test.it('adding filter: (Game Error Diff: 0-1) from sidebar displays correct data', function() {
        filters.changeValuesForRangeSidebarFilter("Game Error Diff:", 0, 1);

        teamPage.getGameLogTableStat(1,3).then(function(stat) {
          assert.equal(stat, '9/30/2016', 'row 1 date');
        });                           
      });

      test.it('adding filter: (Game Hit Diff: 0-3) from sidebar displays correct data', function() {
        filters.changeValuesForRangeSidebarFilter("Game Hit Diff:", 0, 3);

        teamPage.getGameLogTableStat(1,3).then(function(stat) {
          assert.equal(stat, '9/22/2016', 'row 1 date');
        });                           
      });
      
      test.it('adding filter: (Game Opp Errors: 1-2) from sidebar displays correct data', function() {
        filters.changeValuesForRangeSidebarFilter("Game Opp Errors:", 1, 2);

        teamPage.getGameLogTableStat(1,3).then(function(stat) {
          assert.equal(stat, '9/17/2016', 'row 1 date');
        });                           
      });      

      test.it('adding filter: (Game Opp Hits: 10-20) from sidebar displays correct data', function() {
        filters.changeValuesForRangeSidebarFilter("Game Opp Hits:", 10, 20);

        teamPage.getGameLogTableStat(1,3).then(function(stat) {
          assert.equal(stat, '5/11/2016', 'row 1 date');
        });                           
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

    test.describe('when selecting filter (Launch Angle: 0-30)', function() {
      test.it('test setup', function() {
        filters.changeValuesForRangeSidebarFilter('Launch Angle:', 0, 30);
      });
      
      test.it('should show the correct at bat footer text', function() {
        teamPage.getMatchupsAtBatFooterText(1).then(function(text) {
          assert.equal(text, "Josh Donaldson Singles On A Line Drive To Left Fielder Gregor Blanco.");
        });
      });

      test.it('should show the correct row data', function() {
        teamPage.getMatchupsPitchText(1,2).then(function(hang) {
          assert.equal(hang, '1.62s', 'row 1 hang');
        });
        teamPage.getMatchupsPitchText(1,3).then(function(dist) {
          assert.equal(dist, '41.8ft', 'row 1 dist');
        });
      });

      test.describe('clicking similar plays icon', function() {
        test.it('clicking similiar icon opens up similiar plays modal and shows correct stats', function() {
          teamPage.clickSimiliarPlaysIcon(1);
          teamPage.getSimiliarPlaysTableStat(1,11).then(function(pathEff) {
            assert.equal(pathEff, '90.5%', '1st row PathEff')
          });

          teamPage.getSimiliarPlaysTableStat(1,15).then(function(simScore) {
            assert.equal(simScore, 1.000, '1st row SimScore')
          });        
        });

        test.after(function() {
          teamPage.closeSimiliarPlaysModal();  
        });
      });

      test.describe('clicking flat view tab', function() {
        test.it('should show the correct stats', function() {
          teamPage.clickFlatViewTab();
          teamPage.getFlatViewPitchText(1,9).then(function(speed) {
            assert.equal(speed, '11.0mph', 'row 1 speed');
          });

          teamPage.getFlatViewPitchText(2,8).then(function(accel) {
            assert.equal(accel, '0.30s', 'row 2 accel');
          });
        });
      });

      test.after(function() {
        filters.closeDropdownFilter('Launch Angle:');
      });
    });

    // Video Library
    test.describe('#VideoLibrary - add video to existing playlist', function() {     
      test.it('should be able to add video', function() {
        teamPage.addVideoToList(1, 'Team StatcastFielding Tests');
      })

      test.it('should have correct # of videos', function() {
        teamPage.openVideoLibrary();
        teamPage.openVideoList('Team StatcastFielding Tests');
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
        teamPage.pbpRemoveVideoFromList(1, 'Team StatcastFielding Tests');
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

    test.describe('#VideoLibrary - deleting playlist', function() {
      test.it('should remove playlist', function() {
        teamPage.openVideoLibrary();
        teamPage.navigateBackToListIndex();
        teamPage.deleteListFromLibrary('Team StatcastFielding Tests');
        
        teamPage.listExistsInVideoLibrary('Team StatcastFielding Tests').then(function(exists) {
          assert.equal(exists, false);
        })
      });

      test.it('close video library', function() {
        teamPage.closeVideoLibrary();
      });
    });     
  });
});