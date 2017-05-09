var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var extensions = require('../../../lib/extensions.js');

// Page Objects
var Navbar = require('../../../pages/nfl/navbar.js');
var Filters = require('../../../pages/nfl/filters.js');
var PlayersPage = require('../../../pages/nfl/players/players_page.js');
var PlayerPage = require('../../../pages/nfl/players/player_page.js');
var navbar, filters, playersPage, playerPage;

test.describe('#Page: Player', function() {
  test.it('navigating to player page', function() {
    navbar = new Navbar(driver);
    filters = new Filters(driver);
    playersPage = new PlayersPage(driver);
    playerPage = new PlayerPage(driver);
    
    navbar.goToPlayersPage();
    filters.changeValuesForSeasonWeekDropdownFilter(2016, 'W1', 2016, 'W17', true);

    playersPage.clickStatsTableStat(1,3); // should click into Matt Ryan Link
  });

  // Overview Section
  test.describe("#Subsection: Overview", function() {
    test.describe('#seasonsSection', function() {
      test.it('table shows correct information', function() {
        playerPage.getOverviewSeasonTableStat(1, 'type').then(function(stat) {
          assert.equal(stat, 'PLY');
        });

        playerPage.getOverviewSeasonTableStat(1, 'PsYds').then(function(stat) {
          assert.equal(stat, '1014');
        });
      });  

      // Video Playlist
      test.describe("#videoPlaylist", function() {
        test.it('clicking a table stat should open Pop up Play by Play modal', function() {
          playerPage.clickOverviewSeasonTableStat(1,'PsYds');
          playerPage.getPossessionHeaderText(1).then(function(text) {
            assert.equal(text, ' Falcons Ball Starting At 12:16 At The ATL 8');
          });
        });

        test.it('1st play in Play by Play modal should have the correct ballposition info', function() {
          playerPage.getPossessionPlayText(1,2).then(function(text) {
            assert.equal(text, 'ATL 48');
          });
        });

        test.it('1st play in Flat View section should have the correct PlayYardsGain stat', function() {
          playerPage.clickFlatViewTab();
          playerPage.getFlatViewPlayText(1,6).then(function(stat) {
            assert.equal(stat, 37);
          });
        });

        test.it('clicking video icon should open up video modal', function() {
          playerPage.clickByPossessionTab();
          playerPage.clickByPossessionPlayVideoIcon(3);
          playerPage.getVideoPlaylistText(1,1).then(function(text) {
            assert.equal(text, "1st & 10 ATL 29");
          });
        });

        test.it('closing modals', function() {
          playerPage.closeVideoPlaylistModal();
          playerPage.closePlayByPlayModal();
        });
      });      
    });

    test.describe('#resultSection', function() {
      test.it('table shows correct information', function() {
        playerPage.getOverviewResultTableStat(1, 'Stats').then(function(stat) {
          assert.equal(stat, '1 GS, 69.2% Comp%, 334 PsYds, 2 PsTD, 0 Int');
        });
      });
    });

    test.describe('#rankSection', function() {
      test.it('table shows correct information', function() {
        playerPage.getOverviewRankTableStat(1, 'Number').then(function(stat) {
          assert.equal(stat, 13);
        });

        playerPage.getOverviewRankTableStat(1, 'Div Rank').then(function(stat) {
          assert.equal(stat, 1);
        });
      });
    });
  });

  // Game Log Section
  test.describe("#Subsection: Game Log", function() {
    test.it('test setup', function() {
      playerPage.goToSection("gameLog");
    });

    // Sorting
    test.describe("#sorting", function() {
      var columns = [
        { colName: 'Date', sortType: 'dates', defaultSort: 'asc', initialCol: true },
        { colName: 'Att', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colName: 'Yd/Att', sortType: 'ferpNumber', defaultSort: 'desc' },
      ]

      columns.forEach(function(column) {
        test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
          if (!column.initialCol) playerPage.clickGameLogTableHeaderFor(column.colName);
          playerPage.waitForTableToLoad();
          playerPage.getGameLogTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
            assert.deepEqual(stats, sortedArray);
          })
        });

        test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
          playerPage.clickGameLogTableHeaderFor(column.colName);
          playerPage.waitForTableToLoad();
          playerPage.getGameLogTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
            var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
            assert.deepEqual(stats, sortedArray);
          })
        });
      });  
    });

    test.describe("#filters", function() {
      test.it('changing filter - (Yards Gained (LOS): 10 to 50), shows correct stats', function() {
        playerPage.clickGameLogTableHeaderFor('Date');
        filters.changeValuesForRangeSidebarFilter('Yards Gained (LOS):', 10, 50);

        playerPage.getGameLogTableStatFor(1,'PsYds').then(function(stat) {
          assert.equal(stat, 224, '1st row - PsYds');
        });

        playerPage.getGameLogTableStatFor(2,'Cmp').then(function(stat) {
          assert.equal(stat, 16, '2nd row - Cmp');
        });
      });

      test.it('adding filter - (Final Team Rush Yards: 0 to 100), shows correct stats ', function() {
        filters.changeFilterGroupDropdown('Game');
        filters.changeValuesForRangeSidebarFilter('Final Team Rush Yards:', 0, 100);

        playerPage.getGameLogTableStatFor(1,'PsTD').then(function(stat) {
          assert.equal(stat, 1, '1st row - PsTD');
        });

        playerPage.getGameLogTableStatFor(2,'PsrRt').then(function(stat) {
          assert.equal(stat, 158.3, '2nd row - PsrRt');
        });
      });
    });

    test.describe("#videoPlaylist", function() {
      test.it('clicking a table stat should open Pop up Play by Play modal', function() {
        playerPage.clickGameLogTableStatFor(1,'Ps1st');
        playerPage.getPossessionHeaderText(1).then(function(text) {
          assert.equal(text, ' Falcons Ball Starting At 9:47 At The ATL 25');
        });
      });

      test.it('1st play in Play by Play modal should have the correct ballposition info', function() {
        playerPage.getPossessionPlayText(1,2).then(function(text) {
          assert.equal(text, 'ATL 25');
        });
      });

      test.it('1st play in Flat View section should have the correct PlayYardsGain stat', function() {
        playerPage.clickFlatViewTab();
        playerPage.getFlatViewPlayText(1,6).then(function(stat) {
          assert.equal(stat, 14);
        });
      });

      test.it('clicking video icon should open up video modal', function() {
        playerPage.clickByPossessionTab();
        playerPage.clickByPossessionPlayVideoIcon(4);
        playerPage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "1st & 10 ATL 21");
        });
      });

      test.it('closing modals', function() {
        playerPage.closeVideoPlaylistModal();
        playerPage.closePlayByPlayModal();
      });
    });

    test.describe("#reports", function() {
      test.it('closing filters', function() {
        this.timeout(120000);
        filters.changeValuesForRangeSidebarFilter('Final Team Rush Yards:', '', '');
        filters.changeFilterGroupDropdown('Scoreboard');
        filters.changeValuesForRangeSidebarFilter('Yards Gained (LOS):', '', '');
      });

      var reports = [
        { type: 'Offensive Plays', topStat: 2, statType: "OffTD" },  
        { type: 'QB Stats (Adv)', topStat: 112.6, statType: "PsrRt" },  
        { type: 'Passing Rates', topStat: 112.6, statType: "PsrRt" },  
        { type: 'Passing Rates (Adv)', topStat: 8.56, statType: "Yd/Att" },  
        { type: 'Rushing', topStat: 10, statType: "RnYds" },  
        { type: 'Receptions', topStat: 0, statType: "RecYds" },  
        { type: 'From Scrimmage', topStat: 10, statType: "ScrYds" },  
        { type: 'Rushing Receiving', topStat: 10, statType: "ScrYds" },  
        { type: 'Touchdowns', topStat: 2, statType: "TD" },  
        { type: 'Defensive Stats', topStat: 0, statType: "DfTkl" },  
        { type: 'FG / XP / 2Pt', topStat: 0, statType: "FG" },  
        { type: 'Kickoffs', topStat: '-', statType: "OpKRSP" }, 
        { type: 'Punts', topStat: 0, statType: "P" }, 
        { type: 'Returns', topStat: 0, statType: "K-RYd" }, 
        { type: 'Receptions (Adv)', topStat: 0, statType: "Routes" }, 
        { type: 'Defensive Stats (Adv)', topStat: 0, statType: "Prsrs" }, 
        { type: 'Blocking', topStat: 1, statType: "PrsrAllwd" }, 
        { type: 'Player Participation/Grades', topStat: 1.5, statType: "PffGrade" }, 
        { type: 'QB Stats', topStat: 112.6, statType: "PsrRt" },  
      ];

      reports.forEach(function(report) {
        test.it("selecting (report: " + report.type + ") shows the correct stat value for " + report.statType, function() {
          playerPage.changeReport(report.type);  
          playerPage.getGameLogTableStatFor(1,report.statType).then(function(stat) {
            assert.equal(stat, report.topStat);
          });
        });
      });

      test.describe("#statsView", function() {
        var topColor = "rgba(108, 223, 118, 1)";
        var statViews = [
          { type: 'Rank', topStat: 1, color: true },            
          { type: 'Percentile', topStat: "100.0%", color: true },
          { type: 'Z-Score', topStat: 2.909 },
          { type: 'Stat Grade', topStat: 80 },
          { type: 'Stat (Rank)', topStat: "503 (1)", color: true },
          { type: 'Stat (Percentile)', topStat: "503 (100%)", color: true },
          { type: 'Stat (Z-Score)', topStat: "503 (2.91)" },
          { type: 'Stat (Stat Grade)', topStat: "503 (80)" },
          { type: 'Per Game', topStat: 503 },
          { type: 'Per Team Game', topStat: 503 },
          { type: 'Stats', topStat: 503 }
        ];

        test.it('sort by psYds', function() {
          playerPage.clickGameLogTableHeaderFor('PsYds');
        });
    
        statViews.forEach(function(statView) {
          test.it("selecting (stats view: " + statView.type + ") shows the correct stat value", function() {
            playerPage.changeStatsView(statView.type);  
            playerPage.getGameLogTableStatFor(1,'PsYds').then(function(stat) {
              assert.equal(stat, statView.topStat);
            });
          });

          if (statView.color) {
            test.it("selecting " + statView.type + " shows the top value the right color", function() {
              playerPage.getGameLogTableBgColorFor(1,'PsYds').then(function(color) {
                assert.equal(color, topColor);
              });
            });
          }
        });
      });      
    });
  });

  // Play By Play Section
  test.describe("#Subsection: Play By Play", function() {
    test.it('test setup', function() {
      playerPage.goToSection("playByPlay");
    });

    test.describe('when selecting filter (Drive Start Dist to Goal: 50 to 80)', function() {
      test.it('test setup', function() {
        filters.changeFilterGroupDropdown('Drive');
        filters.changeValuesForRangeSidebarFilter('Drive Start Dist to Goal:', 50, 80);
      });
      
      test.it('should show the correct drive header text', function() {
        playerPage.getPossessionHeaderText(1).then(function(text) {
          assert.equal(text, " Falcons Ball Starting At 14:06 At The ATL 32");
        });
      });

      test.it('should show the correct row data', function() {
        playerPage.getPlayByPlayTableStat(1,2).then(function(pitch) {
          assert.equal(pitch, 'ATL 32');
        });
        playerPage.getPlayByPlayTableStat(1,4).then(function(pitch) {
          assert.equal(pitch, '(14:06) (Shotgun) 2-M.Ryan pass short right to 24-D.Freeman to ATL 45 for 13 yards (59-D.Ellerbe).');
        });
      });
    });

    test.describe('when selecting filter (Drive Sacks: 1 to 2)', function() {
      test.it('test setup', function() {
        filters.changeValuesForRangeSidebarFilter('Drive Sacks:', 1, 2);
      });
      
      test.it('should show the correct drive header text', function() {
        playerPage.getPossessionHeaderText(1).then(function(text) {
          assert.equal(text, " Falcons Ball Starting At 14:25 At The ATL 25");
        });
      });

      test.it('should show the correct row data', function() {
        playerPage.getPlayByPlayTableStat(1,2).then(function(pitch) {
          assert.equal(pitch, 'ATL 27');
        });
        playerPage.getPlayByPlayTableStat(1,4).then(function(pitch) {
          assert.equal(pitch, '(14:25) 2-M.Ryan pass short left to 16-J.Hardy to ATL 33 for 6 yards (28-B.Webb).');
        });
      });
    });

    test.describe("#videoPlaylist", function() {
      test.it('clicking video icon should open up video modal', function() {
        playerPage.clickPlayByPlayVideoIcon(2);
        playerPage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "3rd & 2 ATL 33");
        });
      });

      test.it('closing modals & filters', function() {
        this.timeout(120000);
        playerPage.closeVideoPlaylistModal();
        playerPage.closePlayByPlayModal();
        filters.changeValuesForRangeSidebarFilter('Drive Start Dist to Goal:', '', '');
        filters.changeValuesForRangeSidebarFilter('Drive Sacks:', '', '');
      });
    });  

    test.describe("#defensiveTab", function() {
      test.it('should be on Richard Shermans page', function() {
        var playerUrl = '/football/player-play-by-play/Richard%20Sherman/2495507/nfl?f=%7B%22fgt%22%3A%5B%22regular%22%5D%2C%22fswr%22%3A%7B%22fromSeason%22%3A%222016%22%2C%22fromWeek%22%3A%221%22%2C%22toSeason%22%3A%222016%22%2C%22toWeek%22%3A%2217%22%7D%7D&is=true&t=%7B%22radioId%22%3A%22defense%22%7D'
        playerPage.visit(url+playerUrl);
        filters.changeValuesForSeasonWeekDropdownFilter(2016, 'W1', 2016, 'W17', true);
        playerPage.clickPlayByPlayPossessionTab('Defense')
        playerPage.getPlayerNameTitle().then(function(stat) {
          assert.equal(stat, 'Richard Sherman');
        });
      });

      test.it('should show the correct drive header text', function() {
        playerPage.getPossessionHeaderText(1).then(function(text) {
          assert.equal(text, " 49ers Ball Starting At 4:45 At The SF 21");
        });
      });

      test.it('should show the correct row data', function() {
        playerPage.getPlayByPlayTableStat(1,2).then(function(pitch) {
          assert.equal(pitch, 'SF 30');
        });
        playerPage.getPlayByPlayTableStat(1,4).then(function(pitch) {
          assert.equal(pitch, '(4:45) (No Huddle, Shotgun) 7-C.Kaepernick pass short left to 17-J.Kerley to SEA 24 for 6 yards (25-R.Sherman). Officials to measure for 1st down - Short. Caught at SEA 27. 3-yds YAC');
        });
      });
    })
  });

  // Occurrences & Streaks Section
  test.describe("#Subsection: Occurrences & Streaks", function() {
    test.it('test setup', function() {
      playerPage.goToSection("occurrencesAndStreaks");
    });

    test.it('table should have proper headers on load', function() {
      playerPage.getStreaksTableHeader(1).then(function(header) {
        assert.equal(header, "Count");
      });

      playerPage.getStreaksTableHeader(2).then(function(header) {
        assert.equal(header, "StartDate");
      });        

      playerPage.getStreaksTableHeader(3).then(function(header) {
        assert.equal(header, "EndDate");
      });        

      playerPage.getStreaksTableHeader(4).then(function(header) {
        assert.equal(header, "TD");
      });        
    });        

    test.it('changing the main constraint should update the table headers', function() {
      playerPage.changeMainConstraint("Streaks Of", "At Least", 5, "Tackles", "In a Game", "Within a Season");
      playerPage.getStreaksTableHeader(2).then(function(header) {
        assert.equal(header, "StartDate");
      });

      playerPage.getStreaksTableHeader(3).then(function(header) {
        assert.equal(header, "EndDate");
      });

      playerPage.getStreaksTableHeader(4).then(function(header) {
        assert.equal(header, "Tkl");
      });
    });

    test.it('changing the main constraint should update the table stats', function() {
      playerPage.getStreaksTableStat(1,4).then(function(yards) {
        assert.equal(yards, 7, 'W14 Tkl');
      });

      playerPage.getStreaksTableStat(1,2).then(function(team) {
        assert.equal(team, "2016 W10 - SEA@NE\n ", 'Row1 Game');
      });
    }); 
  });

  // Splits Section
  test.describe("#Subsection: Splits", function() {
    test.it('test setup', function() {
      playerPage.goToSection("splits");
    });

    test.it('should show the correct section titles', function() {
      playerPage.getSplitsTableHeaderText(1).then(function(title) {
        assert.equal(title, 'Totals');
      });

      playerPage.getSplitsTableHeaderText(2).then(function(title) {
        assert.equal(title, 'Seasons');
      });

      playerPage.getSplitsTableHeaderText(3).then(function(title) {
        assert.equal(title, 'Home/Road');
      });

      playerPage.getSplitsTableHeaderText(4).then(function(title) {
        assert.equal(title, 'Division');
      });
      
      playerPage.getSplitsTableHeaderText(5).then(function(title) {
        assert.equal(title, 'Quarter');
      });

      playerPage.getSplitsTableHeaderText(6).then(function(title) {
        assert.equal(title, 'Downs');
      });             

      playerPage.getSplitsTableHeaderText(7).then(function(title) {
        assert.equal(title, 'Goalline Distance');
      });             

      playerPage.getSplitsTableHeaderText(8).then(function(title) {
        assert.equal(title, 'First Down Distance');
      });             

      playerPage.getSplitsTableHeaderText(9).then(function(title) {
        assert.equal(title, 'Goal To Go Distance');
      });                    
    });  

    test.it('should show the correct data in the totals & seasons subsections', function() {
      playerPage.getSplitsTableStat(1,1).then(function(rowTitle) {
        assert.equal(rowTitle, 'Totals', 'row 1 title should be labled "Totals"');
      });             

      playerPage.getSplitsTableStat(1,3).then(function(stat) {
        assert.equal(stat, 58, 'row 1 defTkl');
      });             

      playerPage.getSplitsTableStat(2,1).then(function(rowTitle) {
        assert.equal(rowTitle, '2016', 'row 2 title should be labled "2016"');
      });                   

      playerPage.getSplitsTableStat(2,5).then(function(stat) {
        assert.equal(stat, 20, 'row 2 should have 20 Ast');
      });                         
    });

    test.it('should show the correct data in the home/road subsection', function() {
      playerPage.getSplitsTableStat(3,1).then(function(rowTitle) {
        assert.equal(rowTitle, 'Home', 'row 1 title');
      });             

      playerPage.getSplitsTableStat(3,2).then(function(stat) {
        assert.equal(stat, 8, 'row 2 should g');
      });             

      playerPage.getSplitsTableStat(4,10).then(function(stat) {
        assert.equal(stat, 6, 'row 1 IRYd');
      });                   

      playerPage.getSplitsTableStat(4,9).then(function(stat) {
        assert.equal(stat, 2, 'row 2 DInt');
      });  
    });                              

    test.describe("#reports", function() {
      var reports = [
        { type: 'Offensive Plays', totalsStat: 0, roadStat: 0, statType: "OffTD" },  
        { type: 'QB Stats', totalsStat: '-', roadStat: '-', statType: "PsrRt" },  
        { type: 'QB Stats (Adv)', totalsStat: '-', roadStat: '-', statType: "PsrRt" },  
        { type: 'Passing Rates', totalsStat: '-', roadStat: '-', statType: "PsrRt" },  
        { type: 'Passing Rates (Adv)', totalsStat: '-', roadStat: '-', statType: "AttAYNeg0%" },  
        { type: 'Rushing', totalsStat: 0, roadStat: 0, statType: "RnYds" },  
        { type: 'Receptions', totalsStat: 0, roadStat: 0, statType: "RecYds" },  
        { type: 'From Scrimmage', totalsStat: 0, roadStat: 0, statType: "Touches" },  
        { type: 'Rushing Receiving', totalsStat: 0, roadStat: 0, statType: "Touches" },  
        { type: 'Touchdowns', totalsStat: 0, roadStat: 0, statType: "TD" },  
        { type: 'FG / XP / 2Pt', totalsStat: 0, roadStat: 0, statType: "FG" },  
        { type: 'Kickoffs', totalsStat: '-', roadStat: '-', statType: "OpKRSP" }, 
        { type: 'Punts', totalsStat: 0, roadStat: 0, statType: "P" }, 
        { type: 'Returns', totalsStat: 63, roadStat: 63, statType: "PRSP" }, 
        { type: 'Receptions (Adv)', totalsStat: 0, roadStat: 0, statType: "Routes" }, 
        { type: 'Defensive Stats (Adv)', totalsStat: 43, roadStat: 25, statType: "BoxLOS" }, 
        { type: 'Blocking', totalsStat: 0, roadStat: 0, statType: "BlkrBeat" },  
        { type: 'Player Participation/Grades', totalsStat: 1140, roadStat: 588, statType: "pffTotSnap" },  
        { type: 'Defensive Stats', totalsStat: 58, roadStat: 32, statType: "DfTkl" },  
      ];

      reports.forEach(function(report) {
        test.it("selecting (report: " + report.type + ") shows the correct stat value for totals: " + report.statType, function() {
          playerPage.changeReport(report.type);  
          playerPage.getSplitsTableStatFor(1,report.statType).then(function(stat) {
            assert.equal(stat, report.totalsStat);
          });
        });

        test.it("selecting (report: " + report.type + ") shows the correct stat value for road: " + report.statType, function() {
          playerPage.getSplitsTableStatFor(4,report.statType).then(function(stat) {
            assert.equal(stat, report.roadStat);
          });
        });
      });
    });
  });

  // Multi-Filter Section
  test.describe("#Subsection: Multi-Filter", function() {
    test.it('test setup', function() {
      playerPage.goToSection("multiFilter");
    });

    test.it('should show the correct data initially', function() {
      playerPage.getMultiFilterTableStatFor(1,'Filter').then(function(stat) {
        assert.equal(stat, 'top');
      });

      playerPage.getMultiFilterTableStatFor(2,'Filter').then(function(stat) {
        assert.equal(stat, 'bottom');
      });      

      playerPage.getMultiFilterTableStatFor(1,'DfTkl').then(function(stat) {
        assert.equal(stat, 58);
      });
    });  

    test.describe('#filters', function() {
      test.it('adding filter (Pass Or Rush: Pass or Sack) updates data for top row', function() {
        filters.changeFilterGroupDropdown('Play');
        filters.selectForBooleanDropdownSidebarFilter('Pass Or Rush:', 'Pass or Sack');
        playerPage.getMultiFilterTableStatFor(1,'DfTkl').then(function(stat) {
          assert.equal(stat, 40);
        });
      });
    });

    test.describe('#videoPlaylist', function() {
      test.it('clicking a table stat should open Pop up Play by Play modal', function() {
        playerPage.clickMultiFilterTableStatFor(1,'Solo');
        playerPage.getPossessionHeaderText(1).then(function(text) {
          assert.equal(text, ' 49ers Ball Starting At 4:45 At The SF 21');
        });
      });

      test.it('1st play in Play by Play modal should have the correct ballposition info', function() {
        playerPage.getPossessionPlayText(1,2).then(function(text) {
          assert.equal(text, 'SF 30');
        });
      });

      test.it('1st play in Flat View section should have the correct PlayYardsGain stat', function() {
        playerPage.clickFlatViewTab();
        playerPage.getFlatViewPlayText(1,6).then(function(stat) {
          assert.equal(stat, 2);
        });
      });

      test.it('clicking video icon should open up video modal', function() {
        playerPage.clickByPossessionTab();
        playerPage.clickByPossessionPlayVideoIcon(5);
        playerPage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "1st & 10 ARI 42");
        });
      });

      test.it('closing modals', function() {
        playerPage.closeVideoPlaylistModal();
        playerPage.closePlayByPlayModal();
      });
    });  

    test.describe('#groupBy', function() {
      test.it('selecting "By Season" shows the correct stats', function() {
        playerPage.changeGroupBy("By Season");
        playerPage.getMultiFilterTableStatFor(1, 'Season').then(function(stat) {
          assert.equal(stat, 2016);
        });

        playerPage.getMultiFilterTableStatFor(2,'DInt').then(function(stat) {
          assert.equal(stat, 4);
        });
      });

      test.it('selecting "By Game" shows the correct stats', function() {
        playerPage.changeGroupBy("By Game");
        playerPage.getMultiFilterTableStatFor(1, 'opponent').then(function(stat) {
          assert.equal(stat, " @ NO");
        });          

        playerPage.getMultiFilterTableStatFor(2,'Ast').then(function(stat) {
          assert.equal(stat, 3, 'Game 2 - Ast');
        });
      });

      test.it('selecting "Total"', function() {
        playerPage.changeGroupBy("Totals");
      });     
    });  

    test.describe("#reports", function() {
      var reports = [
        { type: 'Offensive Plays', topStat: 0, bottomStat: 0, statType: "OffTD" },  
        { type: 'QB Stats', topStat: '-', bottomStat: '-', statType: "PsrRt" },  
        { type: 'QB Stats (Adv)', topStat: '-', bottomStat: '-', statType: "PsrRt" },  
        { type: 'Passing Rates', topStat: '-', bottomStat: '-', statType: "PsrRt" },  
        { type: 'Passing Rates (Adv)', topStat: '-', bottomStat: '-', statType: "AttAYNeg0%" },          
        { type: 'Rushing', topStat: 0, bottomStat: 0, statType: "RnYds" },  
        { type: 'Receptions', topStat: 0, bottomStat: 0, statType: "RecYds" },  
        { type: 'From Scrimmage', topStat: 0, bottomStat: 0, statType: "Touches" },  
        { type: 'Rushing Receiving', topStat: 0, bottomStat: 0, statType: "Touches" },  
        { type: 'Touchdowns', topStat: 0, bottomStat: 0, statType: "TD" },  
        { type: 'FG / XP / 2Pt', topStat: 0, bottomStat: 0, statType: "FG" },  
        { type: 'Kickoffs', topStat: '-', bottomStat: '-', statType: "OpKRSP" }, 
        { type: 'Punts', topStat: 0, bottomStat: 0, statType: "P" }, 
        { type: 'Returns', topStat: '-', bottomStat: 63.0, statType: "PRSP" }, 
        { type: 'Receptions (Adv)', topStat: 0, bottomStat: 0, statType: "Routes" }, 
        { type: 'Defensive Stats (Adv)', topStat: 14, bottomStat: 43, statType: "BoxLOS" },
        { type: 'Blocking', topStat: 0, bottomStat: 0, statType: "BlkrBeat" },  
        { type: 'Player Participation/Grades', topStat: 570, bottomStat: 1140, statType: "pffTotSnap" },  
        { type: 'Defensive Stats', topStat: 40, bottomStat: 58, statType: "DfTkl" },         
      ];

      reports.forEach(function(report) {
        test.it("selecting (report: " + report.type + ") shows the correct top stat value for " + report.statType, function() {
          playerPage.changeReport(report.type);  
          playerPage.getMultiFilterTableStatFor(1,report.statType).then(function(stat) {
            assert.equal(stat, report.topStat);
          });
        });

        test.it("selecting (report: " + report.type + ") shows the correct bottom stat value for " + report.statType, function() {
          playerPage.changeReport(report.type);  
          playerPage.getMultiFilterTableStatFor(2,report.statType).then(function(stat) {
            assert.equal(stat, report.bottomStat);
          });
        });
      });
    });
  });

  // Performance Log Section
  test.describe("#Subsection: Performance Log", function() {
    test.it('should be on Carlos Hydes page', function() {
      playerPage.goToSection("performanceLog");
      var playerUrl = '/football/player-performance-log/Carlos%20Hyde/2543743/nfl?pc=%7B"fsv"%3A"stats"%7D';
      playerPage.visit(url+playerUrl);
      filters.addSelectionToDropdownSidebarFilter('Season:', 2016);
      playerPage.getPlayerNameTitle().then(function(stat) {
        assert.equal(stat, 'Carlos Hyde');
      });
    });

    test.describe("#sorting", function() {
      var columns = [
        { colName: 'Date', sortType: 'dates', defaultSort: 'desc', initialCol: true },
        { colName: 'RelWalkYds', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colName: 'RelSprintTime', sortType: 'ferpTime', defaultSort: 'desc' },
      ];

      columns.forEach(function(column) {
        test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
          if (!column.initialCol) playerPage.clickPerformanceLogTableHeaderFor(column.colName);
          playerPage.waitForTableToLoad();
          playerPage.getPerformanceLogTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
            assert.deepEqual(stats, sortedArray);
          });
        });

        test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
          playerPage.clickPerformanceLogTableHeaderFor(column.colName);
          playerPage.waitForTableToLoad();
          playerPage.getPerformanceLogTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
            var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
            assert.deepEqual(stats, sortedArray);
          });
        });
      });  
    });    

    test.describe("#filters", function() {
      test.it('adding filter - (Practice / Game: Practice), shows correct stats ', function() {
        playerPage.clickPerformanceLogTableHeaderFor('Date');
        playerPage.clickPerformanceLogTableHeaderFor('Date');
        filters.changeFilterGroupDropdown('Practice');
        filters.addSelectionToDropdownSidebarFilter('Practice / Game:', 'Practice');

        playerPage.getPerformanceLogTableStatFor(1,'event').then(function(stat) {
          assert.equal(stat, 'Practice medium', '1st row - Event');
        });

        playerPage.getPerformanceLogTableStatFor(2,'DistTotal').then(function(stat) {
          assert.equal(stat, 2184, '2nd row - DistTotal');
        });
      });

      test.it('adding filter - (Practice Intensity: Low), shows correct stats ', function() {
        filters.addSelectionToDropdownSidebarFilter('Practice Intensity:', 'Low');

        playerPage.getPerformanceLogTableStatFor(1,'event').then(function(stat) {
          assert.equal(stat, 'Practice low', '1st row - Event');
        });

        playerPage.getPerformanceLogTableStatFor(2,'DistTotal').then(function(stat) {
          assert.equal(stat, 3001, '2nd row - DistTotal');
        });
      });
    });

    test.describe("#pinning/isoMode", function() {
      test.it('clicking the pin icon for the 1st practice should add it to the pinned table', function() {
        playerPage.clickTablePin(1);
        playerPage.getIsoTableStat(1,3).then(function(stat) {
          assert.equal(stat, 17, '1st pinned row week');
        });
      });              

      test.it('session data should show in the session table', function() {
        playerPage.toggleShowPinnedPlayerSessions();
        playerPage.getPerformanceLogSessionTableStatFor(1,'drillName').then(function(stat) {
          assert.equal(stat, 'Warm Up');
        });

        playerPage.getPerformanceLogSessionTableStatFor(2,'TimeMoving').then(function(stat) {
          assert.equal(stat, '0:00:41');
        });

        playerPage.getPerformanceLogSessionTableStatFor(3,'DistTotal').then(function(stat) {
          assert.equal(stat, 41);
        });
      });
    });

    test.describe("#chart/edit columns", function() {
      // // histograms
      test.it('clicking show histogram link should open histogram modal', function() {
        playerPage.clickChartColumnsBtn();
        playerPage.openPerformanceLogSessionsHistogram(12); 
        playerPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, true);
        }); 
      });

      test.it('hovering over bar should show stats for teams', function() {
        playerPage.hoverOverHistogramStack(5)
        playerPage.getTooltipText().then(function(text) {
          assert.equal(text, 'Carlos Hyde: 248.02141707449692 (RB)', 'tooltip for 5th bar');
        });
      });

      test.it("changing Bin Count should update the histogram", function() {
        playerPage.changeHistogramBinCount(3);
        playerPage.getHistogramBarCount().then(function(count) {
          assert.equal(count, 3, '# of bars on histogram');
        });
      })     

      test.it('clicking close histogram button should close histogram modal', function() {
        playerPage.closeModal();
        playerPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, false);
        }); 
      })                 

      // scatter plots          
      test.it('clicking add scatter plot link for 2 different categories should open up scatter chart modal', function() {
        playerPage.openPerformanceLogSessionsScatterPlot(14,15);

        playerPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, true);
        }); 
      });

      test.it('clicking close button should close scatter chart modal', function() {
        playerPage.closeModal();
        playerPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, false);
        }); 
      });

      test.it('sort by time moving', function() {
        playerPage.clickChartColumnsBtn();
        playerPage.clickPerformanceLogSessionTableHeaderFor('TimeMoving')
      });
    });

    test.describe("#statsView", function() {
      var topColor = "rgba(115, 225, 124, 1)";
      var statViews = [
        { type: 'Rank', topStat: 1, color: true },            
        { type: 'Percentile', topStat: "100.0%" },
        { type: 'Z-Score', topStat: 2.199 },
        { type: 'Stat Grade', topStat: 80 },
        { type: 'Stat (Rank)', topStat: "0:05:16 (1)", color: true },
        { type: 'Stat (Percentile)', topStat: "0:05:16 (100%)" },
        { type: 'Stat (Z-Score)', topStat: "0:05:16 (2.20)" },
        { type: 'Stat (Stat Grade)', topStat: "0:05:16 (80)" },
        { type: 'Per Game', topStat: "0:05:16" },
        { type: 'Per Team Game', topStat: "0:05:16" },
        { type: 'Stats', topStat: '0:05:16' }
      ];
  
      statViews.forEach(function(statView) {
        test.it("selecting (stats view: " + statView.type + ") shows the correct stat value", function() {
          playerPage.changeStatsView(statView.type);  
          playerPage.getPerformanceLogSessionTableStatFor(1,'TimeMoving').then(function(stat) {
            assert.equal(stat, statView.topStat);
          });
        });

        if (statView.color) {
          test.it("selecting " + statView.type + " shows the top value the right color", function() {
            playerPage.getPerformanceLogSessionTableBgColorFor(1,'TimeMoving').then(function(color) {
              assert.equal(color, topColor);
            });
          });
        }
      });
    });

    test.describe("#reports", function() {
      var reports = [
        { type: 'Zebra Team Summary', topStat: 553, statType: "DistTotal" },  
        { type: 'Zebra Relative Summary', topStat: 41, statType: "RelRunYds" },  
        { type: 'Rates and Peaks', topStat: 6.5, statType: "MaxStndYPS" },  
        { type: 'Accel/Decel/CoD', topStat: 14, statType: "TotalAccels" },  
        { type: 'Dist/Time/Sprints By Team Zone', topStat: '0:01:30', statType: "TeamJogTime" },   
        { type: 'Dist/Time/Sprints By Player Relative Zone', topStat: '0:03:39', statType: "RelWalkTime" },   
      ];

      reports.forEach(function(report) {
        test.it("selecting (report: " + report.type + ") shows the correct stat value for " + report.statType, function() {
          playerPage.changeReport(report.type);  
          playerPage.toggleShowPinnedPlayerSessions();
          playerPage.getPerformanceLogSessionTableStatFor(1,report.statType).then(function(stat) {
            assert.equal(stat, report.topStat);
          });
        });
      });
    });

    test.describe("#playerPracticeSessionsBarChart", function() {
      test.it('hovering over bar chart should show correct stats', function() {
        playerPage.hoverOverPracticeSessionBarChartStack(1,'walk')
        playerPage.getPracticeSessionBarChartTooltipText().then(function(text) {
          assert.equal(text, '04/19/2017 low\n1 - Warm Up\nRelWalkYds: 248');
        });

        playerPage.hoverOverPracticeSessionBarChartStack(1,'jog')
        playerPage.getPracticeSessionBarChartTooltipText().then(function(text) {
          assert.equal(text, '04/19/2017 low\n1 - Warm Up\nRelJogYds: 264');
        });
      });

      test.it('toggling show time instead of distance', function() {
        playerPage.togglePracticeSessionBarChartType('Time');
      });

      test.it('hovering over time bars should show correct stats', function() {
        playerPage.hoverOverPracticeSessionBarChartStack(1,'walk')
        playerPage.getPracticeSessionBarChartTooltipText().then(function(text) {
          assert.equal(text, '04/19/2017 low\n1 - Warm Up\nRelWalkTime: 0:03:39');
        });

        playerPage.hoverOverPracticeSessionBarChartStack(1,'jog')
        playerPage.getPracticeSessionBarChartTooltipText().then(function(text) {
          assert.equal(text, '04/19/2017 low\n1 - Warm Up\nRelJogTime: 0:01:29');
        });
      });      
    });

    test.describe("#playerPerformanceLogBarChart", function() {
      test.it('hovering over bar chart should show correct stats', function() {
        playerPage.hoverOverPerformanceLogBarChartStack(1,'walk')
        playerPage.getPerformanceLogBarChartTooltipText().then(function(text) {
          assert.equal(text, '2016 W17 (04/19/2017)\nPractice - Drills: 9\nRelWalkYds: 667');
        });

        playerPage.hoverOverPerformanceLogBarChartStack(1,'jog')
        playerPage.getPerformanceLogBarChartTooltipText().then(function(text) {
          assert.equal(text, '2016 W17 (04/19/2017)\nPractice - Drills: 9\nRelJogYds: 1383');
        });
      });

      test.it('toggling show time instead of distance', function() {
        playerPage.togglePerformanceLogrChartType('Time');
      });

      test.it('hovering over time bars should show correct stats', function() {
        playerPage.hoverOverPerformanceLogBarChartStack(1,'walk')
        playerPage.getPerformanceLogBarChartTooltipText().then(function(text) {
          assert.equal(text, '2016 W17 (04/19/2017)\nPractice - Drills: 9\nRelWalkTime: 0:09:50');
        });

        playerPage.hoverOverPerformanceLogBarChartStack(1,'jog')
        playerPage.getPerformanceLogBarChartTooltipText().then(function(text) {
          assert.equal(text, '2016 W17 (04/19/2017)\nPractice - Drills: 9\nRelJogTime: 0:06:58');
        });
      });  
    });
  });

  // Alignment Section
  test.describe("#Subsection: Alignment", function() {
    test.it('should be on Carlos Hydes page', function() {
      filters.closeDropdownFilter('Practice Intensity');
      filters.closeDropdownFilter('Practice / Game');
      playerPage.goToSection("alignment");
      playerPage.getPlayerNameTitle().then(function(stat) {
        assert.equal(stat, 'Carlos Hyde');
      });
    });


    test.describe('#filters', function() {
      test.it('changing filter - (Opp Pregame Losses: 0 to 1), shows correct stats', function() {
        filters.changeFilterGroupDropdown('Season');
        filters.changeValuesForRangeSidebarFilter('Opp Pregame Losses:', 0, 1);

        playerPage.getAlignmentPlaylistCount().then(function(stat) {
          assert.equal(stat, 214);
        });
      });

      test.it('adding filter - (Opp Pregame Wins: 0 to 1), shows correct stats ', function() {
        filters.changeValuesForRangeSidebarFilter('Opp Pregame Wins:', 0, 1);

        playerPage.getAlignmentPlaylistCount().then(function(stat) {
          assert.equal(stat, 149);
        });
      });      
    }); 

    test.describe('#viewMode & playMode', function() {
      test.it('choosing rushing + rushes should show correct plays', function() {
        playerPage.changeAlignmentPlayMode('Rush');
        playerPage.getAlignmentPlaylistCount().then(function(stat) {
          assert.equal(stat, 63);
        });

        playerPage.getAlignmentVisualLocationCount().then(function(stat) {
          assert.equal(stat, 63);
        });
      }); 

      test.it('choosing rushing + rushes TDs should show correct plays', function() {
        playerPage.changeAlignmentPlayMode('Rush TDs');
        playerPage.getAlignmentPlaylistCount().then(function(stat) {
          assert.equal(stat, 5);
        });

        playerPage.getAlignmentVisualLocationCount().then(function(stat) {
          assert.equal(stat, 5);
        });
      });    

      test.it('choosing receiving + targets should show correct plays', function() {
        playerPage.changeAlignmentViewMode('Receiving');
        playerPage.changeAlignmentPlayMode('Tgts');
        playerPage.getAlignmentPlaylistCount().then(function(stat) {
          assert.equal(stat, 9);
        });

        playerPage.getAlignmentVisualLocationCount().then(function(stat) {
          assert.equal(stat, 9);
        });
      });

      test.it('choosing receiving + receptions should show correct plays', function() {
        playerPage.changeAlignmentPlayMode('Rec');
        playerPage.getAlignmentPlaylistCount().then(function(stat) {
          assert.equal(stat, 6);
        });

        playerPage.getAlignmentVisualLocationCount().then(function(stat) {
          assert.equal(stat, 6);
        });
      }); 
    });

    test.describe('#playlist', function() {
      test.it('clicking play in playlist should remove play from list', function() {
        playerPage.clickAlignmentPlaylistPlay(1);
        playerPage.getAlignmentPlaylistCount().then(function(stat) {
          assert.equal(stat, 6, 'Playlist Header - Total Plays');
        });

        playerPage.getAlignmentPlaylistShownCount().then(function(stat) {
          assert.equal(stat, 5, 'Playlist Header - Shown Plays');
        });

        playerPage.getAlignmentVisualLocationCount().then(function(stat) {
          assert.equal(stat, 5, 'Visual - Play Count');
        });
      });       

      test.it('unchecking select all should remove all plays from list', function() {
        playerPage.toggleAlignmentPlaylistSelectAll();
        playerPage.getAlignmentPlaylistCount().then(function(stat) {
          assert.equal(stat, 6, 'Playlist Header - Total Plays');
        });

        playerPage.getAlignmentPlaylistShownCount().then(function(stat) {
          assert.equal(stat, 0, 'Playlist Header - Shown Plays');
        });

        playerPage.getAlignmentVisualLocationCount().then(function(stat) {
          assert.equal(stat, 0, 'Visual - Play Count');
        });
      });  

      test.it('checking select all should remove all plays from list', function() {
        playerPage.toggleAlignmentPlaylistSelectAll();
        playerPage.getAlignmentPlaylistCount().then(function(stat) {
          assert.equal(stat, 6, 'Playlist Header - Total Plays');
        });

        playerPage.getAlignmentPlaylistShownCount().then(function(stat) {
          assert.equal(stat, 6, 'Playlist Header - Shown Plays');
        });

        playerPage.getAlignmentVisualLocationCount().then(function(stat) {
          assert.equal(stat, 6, 'Visual - Play Count');
        });
      });        

    });

    test.describe('#visual', function() {
      test.it('hovering over player should show correct information on tooltip', function() {
        playerPage.hoverOverAlignmentVisualPlay(1);
        playerPage.getAlignmentTooltip().then(function(text) {
          assert.equal(text, '(4:54) (No Huddle, Shotgun) 2-B.Gabbert pass short right to 28-C.Hyde to SF 37 for 1 yard (22-T.Johnson). Caught SF33 4-yrds. YAC.', 'tooltip text');
        });
      });

      test.it('unchecking Offset R should remove update playlist and visual', function() {
        playerPage.toggleAlignmentSectionDisplay('Offset L');
        playerPage.getAlignmentPlaylistCount().then(function(stat) {
          assert.equal(stat, 3, 'Playlist Header - Total Plays');
        });

        playerPage.getAlignmentPlaylistShownCount().then(function(stat) {
          assert.equal(stat, 3, 'Playlist Header - Shown Plays');
        });

        playerPage.getAlignmentVisualLocationCount().then(function(stat) {
          assert.equal(stat, 3, 'Visual - Play Count');
        });        
      })

      test.it('checking show path should show paths on visual', function() {
        playerPage.toggleAlignmentShowPath();
        playerPage.getAlignmentVisualPathCount().then(function(stat) {
          assert.equal(stat, 3);
        });
      });

      test.it('unchecking show player locations should remove initial positions from visual', function() {
        playerPage.toggleAlignmentShowPlayerLocations();
        playerPage.getAlignmentVisualLocationCount().then(function(stat) {
          assert.equal(stat, 0);
        });
      });

      test.it('adjusting time meter should update visual', function() {
        console.log("&& HERE")
        playerPage.toggleAlignmentShowPlayerLocations();
        playerPage.clickAlignmentTimeSlider(50);
        playerPage.getAlignmentPlayerLocation(1).then(function(stat) {
          console.log("*****")
          console.log(stat)
          assert.equal(stat, '780.4569555471697,454.82199648', 'location for play 1');
        })
      });
    });
  });

  // Punting Section
  test.describe("#Subsection: Punting", function() {
    test.it('should be on Andy Lees page', function() {
      playerPage.goToSection("punting");
      var playerUrl = '/football/player-punting/Andy%20Lee/2506017/nfl?f=%7B%22fgt%22%3A%5B%22regular%22%5D%2C%22fswr%22%3A%7B%22fromSeason%22%3A%222016%22%2C%22fromWeek%22%3A%221%22%2C%22toSeason%22%3A%222016%22%2C%22toWeek%22%3A%2217%22%7D%7D&is=true';
      playerPage.visit(url+playerUrl);
      filters.changeValuesForSeasonWeekDropdownFilter(2016, 'W1', 2016, 'W17', true);
      playerPage.getPlayerNameTitle().then(function(stat) {
        assert.equal(stat, 'Andy Lee');
      });
    });

    test.describe('#filters', function() {
      test.it('adding filter - (Kick Direction (Since 2015): Center), shows correct stats', function() {
        filters.changeFilterGroupDropdown('PFF');
        filters.addSelectionToDropdownSidebarFilter('Kick Direction (Since 2015):', 'Center');

        playerPage.getPuntingTableStatFor(1, 'dir').then(function(stat) {
          assert.equal(stat, 'Middle');
        });

        playerPage.getPuntingTableStatFor(2, 'opTime').then(function(stat) {
          assert.equal(stat, '1.96s');
        });
      });

      test.it('adding filter - (Kick Contact Type (Since 2013): Clean Catch From Air), shows correct stats', function() {
        filters.addSelectionToDropdownSidebarFilter('Kick Contact Type (Since 2013):', 'Clean Catch From Air');

        playerPage.getPuntingTableStatFor(3, 'getOff').then(function(stat) {
          assert.equal(stat, '1.33s');
        });

        playerPage.getPuntingTableStatFor(4, 'ret').then(function(stat) {
          assert.equal(stat, 0);
        });
      });
    });

    test.describe('#videoPlaylist', function() {
      test.it('clicking video icon should open up video modal', function() {
        playerPage.clickPuntingTablePlayVideoIcon(6);
        playerPage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "4th & 6 CAR 6");
        });
      });

      test.it('closing modals', function() {
        playerPage.closeVideoPlaylistModal();
      });
    });

    test.describe('#own40+', function() {
      test.it('should have X punts displayed', function() {
        playerPage.getFortyPlusPuntCount().then(function(stat) {
          assert.equal(stat, 2);
        });
      });

      test.it('toggling sequence numbers should switch the displays from dots to #s', function() {
        playerPage.toggleFortyPlusSequenceNumbers();
        playerPage.getFortyPlusPuntMarkerText(1).then(function(stat) {
          assert.equal(stat, '7');
        });
      });

      test.it('hovering over punt should highlight row in list', function() {
        playerPage.hoverOverFortyPlusPunt(1);
        playerPage.getPuntingTableStatBgColorFor(7).then(function(color) {
          assert.equal(color, 'rgba(255, 195, 195, 1)');
        });
      });
    });

    test.describe('#own40-', function() {
      test.it('should have X punts displayed', function() {
        playerPage.getFortyMinusPuntCount().then(function(stat) {
          assert.equal(stat, 8);
        });
      });

      test.it('toggling sequence numbers should switch the displays from dots to #s', function() {
        playerPage.toggleFortyMinusSequenceNumbers();
        playerPage.getFortyMinusPuntMarkerText(1).then(function(stat) {
          assert.equal(stat, '1');
        });
      });

      test.it('hovering over punt should highlight row in list', function() {
        playerPage.hoverOverFortyMinusPunt(1);
        playerPage.getPuntingTableStatBgColorFor(1).then(function(color) {
          assert.equal(color, 'rgba(255, 195, 195, 1)');
        });
      });
    });
  });

  // Kicking Section
  test.describe("#Subsection: Kicking", function() {
    test.it('should be on Phil Dawsons page', function() {
      playerPage.goToSection("kicking");
      var playerUrl = '/football/player-kicking/Phil%20Dawson/2500351/nfl?f=%7B"fgt"%3A%5B"regular"%5D%2C"fswr"%3A%7B"fromSeason"%3A"2016"%2C"fromWeek"%3A"1"%2C"toSeason"%3A"2016"%2C"toWeek"%3A"17"%7D%7D&is=true';
      playerPage.visit(url+playerUrl);
      filters.changeValuesForSeasonWeekDropdownFilter(2016, 'W1', 2016, 'W17', true);
      playerPage.getPlayerNameTitle().then(function(stat) {
        assert.equal(stat, 'Phil Dawson');
      });
    });

    test.describe('#filters', function() {
      test.it('adding filter - (Kickoff Return Direction (Since 2013): Left), shows correct stats', function() {
        filters.changeFilterGroupDropdown('PFF');
        filters.addSelectionToDropdownSidebarFilter('Kickoff Return Direction (Since 2013):', 'Left');

        playerPage.getKickingTableStatFor(3, 'ret').then(function(stat) {
          assert.equal(stat, 20, 'row 3 Ret');
        });

        playerPage.getKickingTableStatFor(4, 'kickType').then(function(stat) {
          assert.equal(stat, 'D', 'row 4 KickType');
        });
      });

      test.it('adding filter - (Kick Yards: 40 to 60), shows correct stats', function() {
        filters.changeFilterGroupDropdown('Play');
        filters.changeValuesForRangeSidebarFilter('Kick Yards:', 40, 60);

        playerPage.getKickingTableStatFor(1, 'dir').then(function(stat) {
          assert.equal(stat, 'Mid Right', 'row 1 Dir');
        });

        playerPage.getKickingTableStatFor(2, 'gross').then(function(stat) {
          assert.equal(stat, 56), 'row 2 Gross';
        });
      });
    });

    test.describe('#videoPlaylist', function() {
      test.it('clicking video icon should open up video modal', function() {
        playerPage.clickKickingTablePlayVideoIcon(2);
        playerPage.getVideoPlaylistText(1,2).then(function(text) {
          assert.equal(text, "KICKOFF");
        });
      });

      test.it('closing modals', function() {
        playerPage.closeVideoPlaylistModal();
      });
    });

    test.describe('#kickChart', function() {
      test.it('should have X kicks displayed', function() {
        playerPage.getKickingKickoffCount().then(function(stat) {
          assert.equal(stat, 5);
        });
      });

      test.it('toggling sequence numbers should switch the displays from dots to #s', function() {
        playerPage.toggleKickingSequenceNumbers();
        playerPage.getKickingMarkerText(1).then(function(stat) {
          assert.equal(stat, '1');
        });
      });

      test.it('hovering over kickoff should highlight row in list', function() {
        playerPage.hoverOverKickingKickoff(1);
        playerPage.getKickingTableStatBgColorFor(1).then(function(color) {
          assert.equal(color, 'rgba(255, 195, 195, 1)');
        });
      });
    });
  });
});