var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var extensions = require('../../../lib/extensions.js');

// Page Objects
var Navbar = require('../../../pages/nfl/navbar.js');
var Filters = require('../../../pages/nfl/filters.js');
var PlayersPage = require('../../../pages/nfl/players/players_page.js');
var navbar, filters, playersPage;

test.describe('#Page: Players', function() {
  test.it('navigating to players page', function() {
    navbar = new Navbar(driver);
    filters = new Filters(driver);
    playersPage = new PlayersPage(driver);
    navbar.goToPlayersPage();
  });

  test.describe('#Section: Stats', function() {
    // Sorting
    test.describe("#sorting", function() {
      var columns = [
        { colName: 'PsrRt', sortType: 'ferpNumber', defaultSort: 'desc', initialCol: true },
        { colName: 'Comp%', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colName: 'Int', sortType: 'ferpNumber', defaultSort: 'asc' },
      ]

      columns.forEach(function(column) {
        test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
          if (!column.initialCol) playersPage.clickStatsTableHeaderFor(column.colName);
          playersPage.waitForTableToLoad();
          playersPage.getStatsTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
            assert.deepEqual(stats, sortedArray);
          })
        });

        test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
          playersPage.clickStatsTableHeaderFor(column.colName);
          playersPage.waitForTableToLoad();
          playersPage.getStatsTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
            var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
            assert.deepEqual(stats, sortedArray);
          })
        });
      });  
      
      test.it('changing filter back to PsrRt', function() {
        playersPage.clickStatsTableHeaderFor('PsrRt');
      });
    });  

    test.describe("#filters", function() {
      test.it('changing filter - (Season/Week: 2015 W1 to 2015 W17), shows correct stats', function() {
        filters.changeValuesForSeasonWeekDropdownFilter(2015, 'W1', 2015, 'W17', true);

        playersPage.getStatsTableStatFor(1,'Player').then(function(stat) {
          assert.equal(stat, ' Russell Wilson (QB-SEA)', '1st row - Player');
        });

        playersPage.getStatsTableStatFor(1,'Cmp').then(function(stat) {
          assert.equal(stat, 329, '1st row - Cmp');
        });
      });

      test.it('adding filter - (Distance To Goal: 0 to 20), shows correct stats ', function() {
        filters.changeValuesForRangeSidebarFilter('Distance To Goal:', 0, 20);

        playersPage.getStatsTableStatFor(1,'PsYds').then(function(stat) {
          assert.equal(stat, 169, '1st row - PsYds');
        });

        playersPage.getStatsTableStatFor(1,'PsTD').then(function(stat) {
          assert.equal(stat, 8, '1st row - PsTD');
        });
      });

      test.it('adding filter - (Score Diff: -7 to 7), shows correct stats ', function() {
        filters.changeValuesForRangeSidebarFilter('Score Diff:', -7, 7);

        playersPage.getStatsTableStatFor(1,'Att').then(function(stat) {
          assert.equal(stat, 18, '1st row - Att');
        });
      });

      test.it('adding filter - (Play Goal To Go: Yes), shows correct stats ', function() {
        filters.toggleSidebarFilter('Play Goal to Go:', 'Yes', true);
        playersPage.getStatsTableStatFor(1,'Yd/Att').then(function(stat) {
          assert.equal(stat, 6.00, '1st row - Yd/Att');
        });
      });
    });

    test.describe("#videoPlaylist", function() {
      test.it('clicking a table stat should open Pop up Play by Play modal', function() {
        playersPage.clickStatsTableStat(1,9);
        playersPage.getPossessionHeaderText(1).then(function(text) {
          assert.equal(text, ' Colts Ball Starting At 3:21 At The IND 20');
        });
      });

      test.it('1st play in Play by Play modal should have the ball position info', function() {
        playersPage.getPossessionPlayText(1,2).then(function(text) {
          assert.equal(text, 'NE 12');
        });
      });

      test.it('Flat View tab should be visible', function() {
        playersPage.isFlatViewTabVisible().then(function(visible) {
          assert.equal(visible, true);
        });
      });

      test.it('clicking video icon should open up video modal', function() {
        playersPage.clickByPossessionPlayVideoIcon(2);
        playersPage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "3rd & 3 NE 3");
        });
      });

      test.it('closing modals', function() {
        playersPage.closeVideoPlaylistModal();
        playersPage.closePlayByPlayModal();
      });
    });
  
    test.describe("#pinning/isoMode", function() {
      test.it('clicking the pin icon for Andrew Luck should add him to the pinned table', function() {
        playersPage.clickTablePin(1);

        playersPage.getIsoTableStat(1,3).then(function(stat) {
          assert.equal(stat, ' Andrew Luck (QB-IND)');
        });
      });

      test.it('selecting Aaron Rodgers from search should add team to table', function() {
        playersPage.clickIsoBtn("on");
        playersPage.addToIsoTable('Aaron Rodgers', 1)

        playersPage.getStatsTableStat(2,3).then(function(stat) {
          assert.equal(stat, ' Aaron Rodgers (QB-GB)', '2nd row player name');
        })
      });

      test.it('pinned total should show the correct sum', function() {
        playersPage.getPinnedTotalTableStat(9).then(function(stat) {
          assert.equal(stat, 16, 'pinned total - Cmp');
        });
      });

      test.it('turning off isolation mode should show players in iso table', function() {
        playersPage.clickIsoBtn("off");
        playersPage.getIsoTableStat(1,3).then(function(stat) {
          assert.equal(stat, ' Andrew Luck (QB-IND)', '1st row player name');
        });
        playersPage.getIsoTableStat(2,3).then(function(stat) {
          assert.equal(stat, ' Aaron Rodgers (QB-GB)', '2nd row player name');
        });
      });
    });

    test.describe("#chart/edit columns", function() {
      // histograms
      test.it('clicking show histogram link should open histogram modal', function() {
        playersPage.clickChartColumnsBtn();
        playersPage.openHistogram(17); 
        playersPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, true);
        }); 
      });

      test.it('hovering over bar should show stats for players', function() {
        playersPage.hoverOverHistogramStack(1)
        playersPage.getTooltipText().then(function(text) {
          assert.equal(text, 'Sam Bradford: 51.6 (Eagles-QB)\nTeddy Bridgewater: 47.9 (Vikings-QB)\nAndy Dalton: 47.0 (Bengals-QB)\nNick Foles: 39.6 (Rams-QB)', 'tooltip for 1st bar');
        });
      });

      test.it('pinned players should be represented by circles', function() {
        playersPage.getHistogramCircleCount().then(function(count) {
          assert.equal(count, 2, '# of circles on histogram')
        })
      })

      test.it("selecting 'Display pins as bars' should add players to the histogram", function() {
        playersPage.toggleHistogramDisplayPinsAsBars();
        playersPage.getHistogramBarCount().then(function(count) {
          assert.equal(count, 14, '# of bars on histogram');
        });
      });

      test.it("changing Bin Count should update the histogram", function() {
        playersPage.changeHistogramBinCount(3);
        playersPage.getHistogramBarCount().then(function(count) {
          assert.equal(count, 6, '# of bars on histogram');
        });
      })     

      test.it('clicking close histogram button should close histogram modal', function() {
        playersPage.closeModal();
        playersPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, false);
        }); 
      })                 

      // scatter plots          
      test.it('clicking add scatter plot link for 2 different categories should open up scatter chart modal', function() {
        playersPage.openScatterChart(10,17);

        playersPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, true);
        }); 
      });

      test.it('clicking close button should close scatter chart modal', function() {
        playersPage.closeModal();
        playersPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, false);
        }); 
      });

      test.it('clearing pins', function() {
        playersPage.clearTablePins();
      });   
    });

    test.describe("#groupBy", function() {
      test.it('remove filters', function() {
        filters.closeDropdownFilter('Distance To Goal');
        filters.closeDropdownFilter('Score Diff');
        filters.closeDropdownFilter('Play Goal to Go');
      });

      test.it('selecting "By Season" shows the correct headers', function() {
        playersPage.changeGroupBy("By Season");
        playersPage.getStatsTableHeader(4).then(function(header) {
          assert.equal(header, "Season");
        });

        playersPage.getStatsTableStat(1,18).then(function(stat) {
          assert.equal(stat, 110.1, 'Player 1 - PsrRt');
        });
      });

      test.it('selecting "By Game" shows the correct headers', function() {
        playersPage.changeGroupBy("By Game");
        playersPage.getStatsTableHeader(4).then(function(header) {
          assert.equal(header, "Opponent");
        });          

        playersPage.getStatsTableStat(1,12).then(function(stat) {
          assert.equal(stat, 18, 'Game 1 - Cmp');
        });
      });        

      test.it('selecting "Total"', function() {
        playersPage.changeGroupBy("Totals");
      });      
    });

    test.describe("#statsView", function() {
      var topColor = "rgba(108, 223, 118, 1)";
      var statViews = [
        { type: 'Rank', topStat: 1, color: true, col: 16 },            
        { type: 'Percentile', topStat: "100.0%", color: true, col: 16 },
        { type: 'Z-Score', topStat: 1.933, col: 16 },
        { type: 'Stat Grade', topStat: 80, col: 16 },
        { type: 'Stat (Rank)', topStat: "110.1 (1)", color: true, col: 16 },
        { type: 'Stat (Percentile)', topStat: "110.1 (100%)", color: true, col: 16 },
        { type: 'Stat (Z-Score)', topStat: "110.1 (1.93)", col: 16 },
        { type: 'Stat (Stat Grade)', topStat: "110.1 (80)", col: 16 },
        { type: 'Per Game', topStat: 110.1, col: 17 },
        { type: 'Per Team Game', topStat: 110.1, col: 17 },
        { type: 'Pct of Team', topStat: 110.1, col: 17 },
        { type: 'Pct of Team on Field', topStat: 110.1, col: 17 },
        { type: 'Team Stats', topStat: 110.1, col: 17 },
        { type: 'Team Stats on Field', topStat: 110.1, col: 17 },
        { type: 'Stats', topStat: 110.1, col: 17 }
      ];
      statViews.forEach(function(statView) {
        test.it("selecting (stats view: " + statView.type + ") shows the correct stat value for PsrRt", function() {
          playersPage.changeStatsView(statView.type);  
          playersPage.getStatsTableStat(1,statView.col).then(function(stat) {
            assert.equal(stat, statView.topStat);
          });
        });

        if (statView.color) {
          test.it("selecting " + statView.type + " shows the top value the right color", function() {
            playersPage.getStatsTableBgColor(1,statView.col).then(function(color) {
              assert.equal(color, topColor);
            });
          });
        }
      });
    });

    test.describe("#reports", function() {
      var reports = [
        { type: 'Offensive Plays', topStat: 45, statType: "OffTD" },  
        { type: 'QB Stats (Adv)', topStat: 110.1, statType: "PsrRt" },  
        { type: 'Passing Rates', topStat: 110.1, statType: "PsrRt" },  
        { type: 'Passing Rates (Adv)', topStat: 8.70, statType: "Yd/Att" },  
        { type: 'Rushing', topStat: 1485, statType: "RnYds" },  
        { type: 'Receptions', topStat: 1871, statType: "RecYds" },  
        { type: 'From Scrimmage', topStat: 1871, statType: "ScrYds" },  
        { type: 'Rushing Receiving', topStat: 1871, statType: "ScrYds" },  
        { type: 'Touchdowns', topStat: 45, statType: "TD" },  
        { type: 'Defensive Stats', topStat: 154, statType: "DfTkl" },  
        { type: 'FG / XP / 2Pt', topStat: 34, statType: "FG" },  
        { type: 'Kickoffs', topStat: 89.0, statType: "OpKRSP" }, 
        { type: 'Punts', topStat: 96, statType: "P" }, 
        { type: 'Returns', topStat: 1077, statType: "K-RYd" }, 
        { type: 'Receptions (Adv)', topStat: 710, statType: "Routes" }, 
        { type: 'Defensive Stats (Adv)', topStat: 100, statType: "Prsrs" }, 
        { type: 'Blocking', topStat: 75, statType: "PrsrAllwd" }, 
        { type: 'Player Participation/Grades', topStat: 139, statType: "PffGrade" }, 
        { type: 'QB Stats', topStat: 110.1, statType: "PsrRt" },  
      ];

      reports.forEach(function(report) {
        test.it("selecting (report: " + report.type + ") shows the correct stat value for " + report.statType, function() {
          playersPage.changeReport(report.type);  
          playersPage.getStatsTableStatFor(1,report.statType).then(function(stat) {
            assert.equal(stat, report.topStat);
          });
        });
      });
    });
  });  

 test.describe('#Section: Occurrences & Streaks', function() {
    test.it('clicking Occurrences & Streaks link goes to correct page', function() {
      playersPage.goToSection('occurrencesAndStreaks');
      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /players\-streaks/);
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
        assert.equal(header, "TD");
      });        
    });    

    test.it('changing the main constraint should update the table headers', function() {
      playersPage.changeMainConstraint("Occurrences Of", "Exactly", 2, "Interceptions", "In a Game", "Within a Season");
      playersPage.getStreaksTableHeader(1).then(function(header) {
        assert.equal(header, "Count");
      });

      playersPage.getStreaksTableHeader(6).then(function(header) {
        assert.equal(header, "EndDate");
      });

      playersPage.getStreaksTableHeader(7).then(function(header) {
        assert.equal(header, "Int");
      });
    });

    test.it('changing the main constraint should update the table stats', function() {
      playersPage.getStreaksTableStat(1,1).then(function(count) {
        assert.equal(count, 4, ' Player 1 - Count');
      });

      playersPage.getStreaksTableStat(1,2).then(function(team) {
        assert.equal(team, "Ben Roethlisberger (QB-PIT)", 'Player 1');
      });

      playersPage.getStreaksTableStat(1,7).then(function(stat) {
        assert.equal(stat, 8, 'Player 1 - Int');
      });         
    });
  });

  test.describe('#Section: Scatter Plot', function() {
    test.it('clicking Scatter Plot link goes to correct page', function() {
      playersPage.goToSection('scatterPlot');
      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /players\-scatter\-plot\-z/);
      });
    });

    test.it('table should be populated on load', function() {
      playersPage.getScatterPlotTableStat(1,2).then(function(stat) {
        assert.isNotNull(stat);
      });
    });  

    test.it('scatter plot should show 35 players on load', function() {
      playersPage.getPlotLogoIconCount().then(function(count) {
        assert.equal(count, 35);
      });
    });  

    test.it('changing the x-axis stat should update the table', function() {
      playersPage.changeXStat('Pass Completions (Cmp)');
      playersPage.getScatterPlotTableHeader(3).then(function(header) {
        assert.equal(header, 'Cmp');
      });
    });  

    test.it('changing the y-axis stat should update the table', function() {
      playersPage.changeYStat('QB Sacks (Sack)');
      playersPage.getScatterPlotTableHeader(4).then(function(header) {
        assert.equal(header, 'Sack');
      });      
    });        

    test.it('adding a global filter should update the table', function() {
      var originalYdsPerGame;
      playersPage.getScatterPlotTableStat(1,4).then(function(ydsPerGame) {
        global = ydsPerGame;
      });
      
      playersPage.addGlobalFilter('2 Minute Offense');
      playersPage.getScatterPlotTableStat(1,4).then(function(newYdsPerGame) {
        assert.notEqual(newYdsPerGame, originalYdsPerGame);
      });            
    });        

    test.it('adding a x-axis filter should update the table', function() {
      playersPage.openXAxisFilterContainer();
      var originalAtt;
      playersPage.getScatterPlotTableStat(1,3).then(function(att) {
        originalAtt = att;
      });
      
      playersPage.addXFilter('Home/Road/Neutral: Road');
      playersPage.getScatterPlotTableStat(1,3).then(function(newAtt) {
        assert.notEqual(newAtt, originalAtt);
      });           
    });              

    test.it('adding a y-axis filter should update the table', function() {
      playersPage.openYAxisFilterContainer();
      var originalYdsPerGame;
      playersPage.getScatterPlotTableStat(1,4).then(function(ydsPerGame) {
        originalYdsPerGame = ydsPerGame;
      });
      
      playersPage.addYFilter('In Division Game');
      playersPage.getScatterPlotTableStat(1,4).then(function(newYdsPerGame) {
        assert.notEqual(newYdsPerGame, originalYdsPerGame);
      });       
    }); 

    test.it('clicking add a trend line should display a trendline on the chart', function() {
      playersPage.toggleDisplayTrendLine(true);
      playersPage.isTrendLineVisible().then(function(visible) {
        assert.equal(visible, true);
      });
    }); 
  });
});