var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var constants = require('../../../lib/constants.js');
var extensions = require('../../../lib/extensions.js');

// Page Objects
var Navbar = require('../../../pages/mlb/navbar.js');
var Filters = require('../../../pages/mlb/filters.js');
var PlayerPage = require('../../../pages/mlb/players/player_page.js');

var navbar, filters, playerPage;
var playerURL = '/baseball/player-statcast/Mookie%20Betts/605141/overview';

test.describe('#Player StatcastFielding Section', function() {
  test.it('test setup', function() {  
    this.timeout(120000);
    navbar  = new Navbar(driver);  
    filters  = new Filters(driver);  
    playerPage = new PlayerPage(driver);

    playerPage.visit(url+playerURL);
  });  

  test.it('should be on Mookie Betts 2016 player page', function() {
    playerPage.goToSection('statcastFielding');
    filters.removeSelectionFromDropdownFilter("Seasons:");
    filters.addSelectionToDropdownFilter("Seasons:", 2016);
    playerPage.getPlayerName().then(function(text) {
      assert.equal( text, 'Mookie Betts');
    });
  });

  // Overview Section
  test.describe("#Subsection: Overview", function() {
    test.it('test setup', function() {
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });
    
    // Outfield Positioning
    test.describe('#OutfieldPositioning', function() {  
      test.it('should show correct # of plays on chart', function() {
        playerPage.getStatcastFieldingBallCount().then(function(count) {
          assert.equal(count, 435);
        })
      });

      test.it('clicking CF button should zoom into the CF portion of the chart', function() {
        playerPage.clickStatcastFieldingZoomBtn('CF');
        playerPage.getStatcastFieldingChartTranslation().then(function(attr) {
          assert.equal(attr, "translate(-505,-150)scale(3,3)");
        })
      });

      test.it('clicking All button should zoom out the chart', function() {
        playerPage.clickStatcastFieldingZoomBtn('');
        playerPage.getStatcastFieldingChartTranslation().then(function(attr) {
          assert.equal(attr, "translate(0,0)scale(1,1)");
        })
      });

      test.it('should change background image for fielding widget', function() {
        playerPage.changeBallparkDropdown('Fenway Park');
        playerPage.getCurrentBallparkImageID().then(function(id) {
          assert.equal(id, 'BOS_3', 'image id');
        });
      });   
    });

    test.describe('#Range', function() {  
      test.it('hitChart should have correct # of balls in play', function() {
        playerPage.getHitChartHitCount('single').then(function(count) {
          assert.equal(count, 103, 'correct number of singles');
        });
        
        playerPage.getHitChartHitCount('double').then(function(count) {
          assert.equal(count, 44, 'correct number of doubles');
        });        

        playerPage.getHitChartHitCount('triple').then(function(count) {
          assert.equal(count, 4, 'correct number of triples');
        });        

        playerPage.getHitChartHitCount('homeRun').then(function(count) {
          assert.equal(count, 0, 'correct number of home runs');
        });   

        playerPage.getHitChartHitCount('out').then(function(count) {
          assert.equal(count, 307, 'correct number of outs');
        });         
      })
    })

    test.describe('#OutfieldRange', function() {    
      test.it('should show correct # of points on chart', function() {
        playerPage.getBinnedBoxesRectCount().then(function(count) {
          assert.equal(count, 431);
        })
      });

      test.it('should display correct count of plays by out prob', function() {
        playerPage.getBinnedBoxesPlayCountForOutProb(0.01).then(function(count) {
          assert.equal(count, 117, '<0.01 outProb play count');
        })

        playerPage.getBinnedBoxesPlayCountForOutProb(0.1).then(function(count) {
          assert.equal(count, 23, '<0.1 outProb play count');
        })

        playerPage.getBinnedBoxesPlayCountForOutProb(0.2).then(function(count) {
          assert.equal(count, 3, '<0.2 outProb play count');
        })

        playerPage.getBinnedBoxesPlayCountForOutProb(0.8).then(function(count) {
          assert.equal(count, 6, '<0.8 outProb play count');
        })

        playerPage.getBinnedBoxesPlayCountForOutProb(0.9).then(function(count) {
          assert.equal(count, 15, '<0.9 outProb play count');
        })

        playerPage.getBinnedBoxesPlayCountForOutProb(0.99).then(function(count) {
          assert.equal(count, 53, '<0.99 outProb play count');
        })

        playerPage.getBinnedBoxesPlayCountForOutProb(1).then(function(count) {
          assert.equal(count, 183, '<1 outProb play count');
        })
      });

      test.it('should display correct outs added text', function() {
        playerPage.getBinnedBoxesOutsAddedText().then(function(text) {
          assert.equal(text, '13.64 Outs Added');
        });
      });
    });

    // eBIS Modal
    test.describe("#eBIS Modal", function() {
      test.it('modal shows the correct data', function() {
        playerPage.clickEbisModalBtn();
        playerPage.getEbisModalText(1, 3).then(function(data) {
          assert.equal(data, 'Draft: 2011 Round 5, Pick 172, BOS', 'Mookie Betts draft information');
        });
      });

      test.after(function() {
        playerPage.clickCloseEbisModalBtn();
      })
    })    

    // Video Playlist
    test.describe('#VideoPlaylist', function() {    
      test.it('clicking on a stat opens the play by play modal', function() {
        playerPage.clickOverviewTableStat(1,8);
        playerPage.getMatchupsAtBatHeaderText(1).then(function(text) {
          assert.equal(text, 'RHP M. Barnes (BOS) Vs LHB C. Beltran (NYY), Bot 6, 2 Out');
        });
      });

      test.it('clicking into video opens correct video', function() {
        playerPage.clickPitchVideoIcon(1);
        playerPage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "Bot 6, 2 out");
        });

        playerPage.getVideoPlaylistText(1,3).then(function(text) {
          assert.equal(text, "5.90s HT | 127.6ft | 0.8s RT | 1.84s Jmp | 99.1% Eff | 19.9mph | 13.8ft to Wall | 25.3% outProb |");
        });          
      }); 

      test.after(function() {
        playerPage.closeVideoPlaylistModal();
      });
    });

    // Video Library
    test.describe('#VideoLibrary - add video to new playlist', function() {     
      test.it('should create new playlist', function() {
        playerPage.addVideoToNewList(1, 'Player StatcastFielding Tests');
      })

      test.it('playlist should exist in library', function() {
        playerPage.closePlayByPlayModal();
        playerPage.openVideoLibrary();
        playerPage.listExistsInVideoLibrary('Player StatcastFielding Tests').then(function(exists) {
          assert.equal(exists, true, 'Player StatcastFielding Tests playlist exists in library');
        });
      });

      test.it('should have correct # of videos', function() {
        playerPage.openVideoList('Player StatcastFielding Tests');
        playerPage.getVideoCountFromList().then(function(count) {
          assert.equal(count, 1);
        });
      });

      test.it('should be able to play video', function() {
        playerPage.playVideoFromList(1);
        playerPage.isVideoModalDisplayed().then(function(displayed){
          assert.equal(displayed, true);
        });        
      });

      test.it('closing video modal', function() {
        playerPage.closeVideoPlaylistModal();
      });
    });     

    test.describe("#Reports", function() {
      var reports = [
        { type: 'Outfielder Air Defense Skills', topStat: "65.4%", statType: "OFAirOut%" },  
        { type: 'Outfield Batter Positioning', topStat: "104.9%", statType: "OFWPosAirWOut%" },    
        { type: 'Outfielder Air Defense Positioning', topStat: "104.0%", statType: "OFWPosAirWOut%" },
        { type: 'Outfielder Air Defense Range', topStat: "115.9%", statType: "ExRange%" },  
      ];
      reports.forEach(function(report) {
        test.it("selecting " + report.type + " shows the correct stat value for " + report.statType, function() {
          playerPage.changeReport(report.type);  
          // 2016 Season, 12th Col
          playerPage.getOverviewTableStat(2,7).then(function(stat) {
            assert.equal(stat, report.topStat, '2016 Season: ' + report.statType);
          });
        });
      });
    });
  });

  // Game Logs Section
  test.describe("#Subsection: Game Log", function() {
    test.it('test setup', function() {
      playerPage.goToSubSection("gameLog");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('should show the correct game data for 10/2/2016', function() {
      playerPage.getGameLogTableStat(1,4).then(function(date) {
        assert.equal(date, '10/2/2016', '1st row game date');
      });

      playerPage.getGameLogTableStat(1,5).then(function(score) {
        assert.equal(score, 'L 1-2', 'Score of game');
      });      

      playerPage.getGameLogTableStat(1,6).then(function(ball) {
        assert.equal(ball, 1, '# of OFAirBall');
      });            
      
      playerPage.getGameLogTableStat(1,13).then(function(outs) {
        assert.equal(outs, 0, '# of OFOutsPM');
      });                  
    });

    // Sorting
    test.describe("#sorting", function() {
      var columns = [
        { colNum: 4, colName: 'Date', sortType: 'dates', defaultSort: 'desc', initialCol: true },
        { colNum: 6, colName: 'OFAirBall', sortType: 'ferpNumber', defaultSort: 'asc' },
        { colNum: 8, colName: 'OFAirHit', sortType: 'ferpNumber', defaultSort: 'asc' },
        { colNum: 9, colName: 'ExRange%', sortType: 'ferpNumber', defaultSort: 'asc' },
        { colNum: 11, colName: 'OFBadCtch', sortType: 'ferpNumber', defaultSort: 'asc' },
      ]

      columns.forEach(function(column) {
        test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
          if (!column.initialCol) playerPage.clickGameLogTableColumnHeader(column.colNum);
          playerPage.waitForTableToLoad();
          playerPage.getGameLogTableStatsForCol(column.colNum).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
            assert.deepEqual(stats, sortedArray);
          })
        });

        test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
          playerPage.clickGameLogTableColumnHeader(column.colNum);
          playerPage.waitForTableToLoad();
          playerPage.getGameLogTableStatsForCol(column.colNum).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
            var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
            assert.deepEqual(stats, sortedArray);
          })
        });
      });

      test.after(function() {
        playerPage.clickGameLogTableColumnHeader(4);
        playerPage.clickGameLogTableColumnHeader(4);
      });        
    });      

    // Video Playlist
    test.describe('#VideoPlaylist', function() {    
      test.it('clicking on a stat opens the play by play modal', function() {
        playerPage.clickGameLogTableStat(1,6);
        playerPage.getMatchupsAtBatHeaderText(1).then(function(text) {
          assert.equal(text, 'LHP D. Pomeranz (BOS) Vs RHB D. Travis (TOR), Top 9, 1 Out');
        });
      });

      test.it('clicking into video opens correct video', function() {
        playerPage.clickPitchVideoIcon(1);
        playerPage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "Top 9, 1 out");
        });

        playerPage.getVideoPlaylistText(1,3).then(function(text) {
          assert.equal(text, "3.67s HT | 42.8ft | 0.8s RT | 2.04s Jmp | 92.8% Eff | 11.6mph | 89.3ft to Wall | 99.6% outProb |", '3rd line of 1st video description');
        });          
      }); 

      test.it('clicking similar plays icon opens modal', function() {
        playerPage.closeVideoPlaylistModal();
        playerPage.clickSimiliarPlaysIcon(1);
        playerPage.getSimiliarPlaysHeader().then(function(title) {
          assert.match(title, /50 most similar fielding plays to out recorded by Mookie Betts in RF at Fenway Park \(10\/2\/2016\)/, 'modal title');   
        })
      });

     test.it('unchecking dist to wall, updates the table', function() {
        var originalWall;
        playerPage.getSimiliarPlaysAvgTableStat(7).then(function(stat) {
          originalWall = stat;
        });

        playerPage.toggleDistToWallCheckbox(false);
        playerPage.getSimiliarPlaysAvgTableStat(7).then(function(stat) {
          assert.notEqual(stat, originalWall, 'Avg Wall Value changes');
        });
      });      

      test.it('unchecking same position only, updates the table', function() {
        playerPage.toggleSamePositionCheckbox(false);
        playerPage.getSimiliarPlaysTableStat(3,5).then(function(pos) {
          assert.equal(pos, 'CF', 'Pos for 3rd row is CF');
        });
      });

      test.it('checking same stadium, updates the table', function() {
        playerPage.toggleSameStadiumCheckbox(true);
        playerPage.getSimiliarPlaysTableStat(2,6).then(function(stadium) {
          assert.equal(stadium, 'Fenway Park', 'All parks should be Fenway Park');
        });
      });

      test.it('able to play video from similar plays table', function() {
        playerPage.clickSimiliarPlaysPitchVideoIcon(1);
        playerPage.getSimiliarPlaysPitchVideoHeader().then(function(text) {
          assert.equal(text, "10/2/2016, 3:05 PM ET TOR 2 @ BOS 1 Vs LHP D. Pomeranz (TOR) , Top 9, 1 out");
        });
      });

      test.it('able to play video from clicking into hit chart', function() {
        playerPage.closeSimilarPlaysPitchVideoModal();
        playerPage.clickSimiliarPlaysHitChartPlotPoint();
        playerPage.clickSimiliarPlaysTooltipPitchVideoIcon();
        playerPage.getSimiliarPlaysTooltipPitchVideoHeader().then(function(text) {
          assert.equal(text, '(Away - 9/18/2016) Vs RHB C. Young (BOS)');
        });
      });     

      test.after(function() {
        playerPage.closeSimiliarPlaysTooltipPitchVideoModal();
        playerPage.closeSimiliarPlaysModal();
      });
    });    

    // Video Library
    test.describe('#VideoLibrary - add video to existing playlist', function() {     
      test.it('should have correct # of videos', function() {
        playerPage.addVideoToList(1, 'Player StatcastFielding Tests');
        playerPage.closePlayByPlayModal();
        playerPage.openVideoLibrary();
        playerPage.openVideoList('Player StatcastFielding Tests');
        playerPage.getVideoCountFromList().then(function(count) {
          assert.equal(count, 2);
        });
      });

      test.it('should be able to play video', function() {
        playerPage.playVideoFromList(2);
        playerPage.isVideoModalDisplayed().then(function(displayed){
          assert.equal(displayed, true);
        });        
      });

      test.it('closing video modal', function() {
        playerPage.closeVideoPlaylistModal();
      });
    });  

    test.describe("#filters", function() {
      test.it('adding filter: (Exit Velocity: 90-120) from sidebar displays correct data', function() {
        filters.changeValuesForRangeSidebarFilter("Exit Velocity:", 90, 120);

        playerPage.getGameLogTableStat(3,4).then(function(date) {
          assert.equal(date, '9/30/2016', '3rd row game date');
        });

        playerPage.getGameLogTableStat(3,7).then(function(outs) {
          assert.equal(outs, 2, '# of OFAirOut');
        });          

        playerPage.getGameLogTableStat(3,12).then(function(outPer) {
          assert.equal(outPer, '102.9%', 'OFWAirOut%');
        });                  
      });

      test.after(function() {
        filters.closeDropdownFilter("Exit Velocity:");
      });
    });
  });  

  // Pitch  Logs
  test.describe("#Subsection: Pitch Log", function() {
    test.it('test setup', function() {
      playerPage.goToSubSection("pitchLog");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.describe('when selecting filter (Launch Angle: 0 - 30)', function() {
      test.it('test setup', function() {
        filters.changeValuesForRangeSidebarFilter('Launch Angle:', 0, 30);
      });
      
      test.it('should show the correct at bat footer text', function() {
        playerPage.getMatchupsAtBatFooterText(1).then(function(text) {
          assert.equal(text, "Devon Travis Flies Out To Right Fielder Mookie Betts.");
        });
      });

      test.it('should show the correct row data', function() {
        playerPage.getMatchupsPitchText(1,2).then(function(hang) {
          assert.equal(hang, '3.67s', 'row 1 hang');
        });
        playerPage.getMatchupsPitchText(1,3).then(function(distance) {
          assert.equal(distance, '42.8ft', 'row 1 dist');
        });
      });
    });

    test.describe('when clicking flat view tab', function() {
      test.it('should show the correct stats', function() {
        playerPage.clickFlatViewTab();
        playerPage.getFlatViewPitchText(1,4).then(function(react) {
          assert.equal(react, '0.8s', 'row 1 react');
        });

        playerPage.getFlatViewPitchText(1,6).then(function(pathEff) {
          assert.equal(pathEff, '88.7%', 'row 1 pathEff');
        });
      });
    })

    // Video Library
    test.describe('#VideoLibrary - add video to existing playlist', function() {     
      test.it('should have correct # of videos', function() {
        playerPage.addVideoToList(1, 'Player StatcastFielding Tests');
        playerPage.openVideoLibrary();
        playerPage.openVideoList('Player StatcastFielding Tests');
        playerPage.getVideoCountFromList().then(function(count) {
          assert.equal(count, 3);
        });
      });

      test.it('should be able to play video', function() {
        playerPage.playVideoFromList(1);
        playerPage.isVideoModalDisplayed().then(function(displayed){
          assert.equal(displayed, true);
        });        
      });

      test.it('closing video modal', function() {
        playerPage.closeVideoPlaylistModal();
      });
    });    

    test.describe('#VideoLibrary - removing video thru pbp', function() {     
      test.it('should have correct # of videos', function() {
        playerPage.pbpRemoveVideoFromList(1, 'Player StatcastFielding Tests');
        playerPage.openVideoLibrary();
        playerPage.getVideoCountFromList().then(function(count) {
          assert.equal(count, 2);
        });
      });
    }); 

    test.describe('#VideoLibrary - deleting playlist', function() {
      test.it('should remove playlist', function() {
        playerPage.navigateBackToListIndex();
        playerPage.deleteListFromLibrary('Player StatcastFielding Tests');
        
        playerPage.listExistsInVideoLibrary('Player StatcastFielding Tests').then(function(exists) {
          assert.equal(exists, false);
        })
      });

      test.it('close video library', function() {
        playerPage.closeVideoLibrary();
      });
    });              

    test.after(function() {
      filters.closeDropdownFilter('Launch Angle:');
    });
  });

  // Occurences & Streaks
  test.describe('#SubSection: Occurrences & Streaks', function() {
    test.it('test setup', function() {
      playerPage.goToSubSection("occurrencesAndStreaks");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('changing the main constraint should show the correct section header', function() {
      playerPage.changeMainConstraint("Occurrences Of", "At Least", 2, "OFNROut (Statcast)", "In a Game", "Within a Season");
      playerPage.getStreaksSectionHeaderText().then(function(text) {
        assert.equal(text, "4 Times", '# of occurences');
      });

      playerPage.getStreaksTableStat(1,4).then(function(stat) {
        assert.equal(stat, 2, 'OFRNOut on 9/27/2016');
      });
    });
  });
});