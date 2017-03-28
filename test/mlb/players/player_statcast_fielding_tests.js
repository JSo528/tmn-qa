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

test.describe('#Player StatcastFielding Section', function() {
  test.before(function() {  
    navbar  = new Navbar(driver);  
    filters  = new Filters(driver);  
    playerPage = new PlayerPage(driver);

    navbar.search('Mookie Betts', 1);
  });  

  test.it('should be on Mookie Betts 2016 player page', function() {
    playerPage.goToSection('statcastFielding');
    playerPage.getPlayerName().then(function(text) {
      assert.equal( text, 'Mookie Betts');
    });
  });

  // Overview Section
  test.describe("#Subsection: Overview", function() {
    test.before(function() {
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    // TODO - feature has changed
    // test.describe('clicking into OF Area w/ Filter (men on: loaded)', function() {
    //   test.before(function() {
    //     filters.toggleSidebarFilter('Men On:', 'Loaded', true);
    //   });

    //   // can't consistently click on the same fielding event, so just check if modal exists with data in it
    //   test.it('clicking a statcast fielding event should show data in modal', function() {
    //     playerPage.clickStatcastFieldingChartEvent(1);
    //     playerPage.getStatcastFieldingModalTitle().then(function(title) {
    //       assert.equal(title, 'Pop up Play by Play', 'modal title');
    //     });

    //     playerPage.getStatcastFieldingModalTableHeader(1).then(function(header) {
    //       assert.equal(header, 'Inn', '1st col header');
    //     });

    //     playerPage.getStatcastFieldingModalTableHeader(3).then(function(header) {
    //       assert.equal(header, 'Opp', '3rd col header');
    //     });

    //     playerPage.getStatcastFieldingModalTableHeader(8).then(function(header) {
    //       assert.equal(header, 'OutProb', '8th col header');
    //     });

    //     playerPage.getStatcastFieldingModalTableHeader(9).then(function(header) {
    //       assert.equal(header, 'PosIndOutProb', '9th col header');
    //     });
    //   });
    //   test.after(function() {
    //     playerPage.closeStatcastFieldingModal();
    //   });
    // });

    test.describe('changing ballpark', function() {
      test.before(function() {
        filters.toggleSidebarFilter('Men On:', 'Loaded', false);
      });

      test.it('should change background image for fielding widget', function() {
        playerPage.changeBallparkDropdown('Fenway Park');
        playerPage.getCurrentBallparkImageID().then(function(id) {
          assert.equal(id, 'BOS_3', 'image id');
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
          assert.equal(text, "5.90s HT | 127.6ft | 0.9s RT | 1.87s Jmp | 99.0% Eff | 19.9mph | 13.8ft to Wall | 25.3% outProb |");
        });          
      }); 

      test.after(function() {
        playerPage.closeVideoPlaylistModal();
        playerPage.closePlayByPlaytModal();
      });
    });

    test.describe("#Reports", function() {
      var reports = [
        { type: 'Outfielder Air Defense Skills', topStat: "65.5%", statType: "OFAirOut%" },  
        { type: 'Outfield Batter Positioning', topStat: "104.6%", statType: "OFWPosAirWOut%" },    
        { type: 'Outfielder Air Defense Positioning', topStat: "103.8%", statType: "OFWPosAirWOut%" },
        { type: 'Outfielder Air Defense Range', topStat: "115.0%", statType: "ExRange%" },  
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
    test.before(function() {
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
          assert.equal(text, "3.67s HT | 42.8ft | 0.9s RT | 2.07s Jmp | 92.6% Eff | 11.6mph | 89.3ft to Wall | 99.6% outProb |", '3rd line of 1st video description');
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
        playerPage.closePlayByPlaytModal();
      });
    });    

    test.describe("#filters", function() {
      test.it('adding filter: (Exit Velocity: 90-120) from sidebar displays correct data', function() {
        filters.changeValuesForRangeSidebarFilter("Exit Velocity:", 90, 120);

        playerPage.getGameLogTableStat(3,4).then(function(date) {
          assert.equal(date, '9/30/2016', '3rd row game date');
        });

        playerPage.getGameLogTableStat(3,7).then(function(outs) {
          assert.equal(outs, 1, '# of OFAirOut');
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
    test.before(function() {
      playerPage.goToSubSection("pitchLog");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.describe('when selecting filter (Launch Angle: 0 - 30)', function() {
      test.before(function() {
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
          assert.equal(pathEff, '88.6%', 'row 1 pathEff');
        });
      });
    })

    test.after(function() {
      filters.closeDropdownFilter('Launch Angle:');
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