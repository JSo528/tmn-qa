var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var extensions = require('../../../lib/extensions.js');

// Page Objects
var Navbar = require('../../../pages/nfl/navbar.js');
var Filters = require('../../../pages/nfl/filters.js');
var TeamsPage = require('../../../pages/nfl/teams/teams_page.js');
var navbar, filters, teamsPage;

test.describe('#Page: Teams', function() {
  test.it('navigating to teams page', function() {
    navbar = new Navbar(driver);
    filters = new Filters(driver);
    teamsPage = new TeamsPage(driver);
    navbar.goToTeamsPage();
  });

  test.describe('#Section: Stats', function() {
    // Sorting
    test.describe("#sorting", function() {
      var columns = [
        { colName: 'Win%', sortType: 'ferpNumber', defaultSort: 'desc', initialCol: true },
        { colName: 'Yds', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colName: 'TO', sortType: 'ferpNumber', defaultSort: 'asc' },
      ]

      columns.forEach(function(column) {
        test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
          if (!column.initialCol) teamsPage.clickStatsTableHeaderFor(column.colName);
          teamsPage.waitForTableToLoad();
          teamsPage.getStatsTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
            assert.deepEqual(stats, sortedArray);
          })
        });

        test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
          teamsPage.clickStatsTableHeaderFor(column.colName);
          teamsPage.waitForTableToLoad();
          teamsPage.getStatsTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
            var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
            assert.deepEqual(stats, sortedArray);
          })
        });
      });  
    });  

    test.describe("#filters", function() {
      test.it('changing filter - (Season/Week: 2016 W1 to 2016 W9), shows correct stats', function() {
        filters.changeValuesForSeasonWeekDropdownFilter(2016, 'W1', 2016, 'W9', true);

        teamsPage.getStatsTableStatFor(1,'Team').then(function(stat) {
          assert.equal(stat, ' Jets (3-6)', '1st row - Team');
        });

        teamsPage.getStatsTableStatFor(1,'TO').then(function(stat) {
          assert.equal(stat, 19, '1st row - TO');
        });
      });

      test.it('adding filter - (Distance To First: 1 to 5), shows correct stats ', function() {
        filters.changeValuesForRangeSidebarFilter('Distance To First:', 1, 5);

        teamsPage.getStatsTableStatFor(1,'Yds').then(function(stat) {
          assert.equal(stat, 427, '1st row - Yds');
        });

        teamsPage.getStatsTableStatFor(1,'TO').then(function(stat) {
          assert.equal(stat, 6, '1st row - TO');
        });
      });

      test.it('adding filter - (Down: Third), shows correct stats ', function() {
        filters.toggleSidebarFilter('Down:', 'Third', true);

        teamsPage.getStatsTableStatFor(1,'PA').then(function(stat) {
          assert.equal(stat, 24, '1st row - PA');
        });
      });

      test.it('adding filter - (Timeouts Left: 0 to 1), shows correct stats ', function() {
        filters.changeValuesForRangeSidebarFilter('Timeouts Left:', 0, 1);
        teamsPage.getStatsTableStatFor(1,'OpYds').then(function(stat) {
          assert.equal(stat, 6, '1st row - OpYds');
        });
      });
    });

    test.describe("#videoPlaylist", function() {
      test.it('clicking a table stat should open Pop up Play by Play modal', function() {
        teamsPage.clickStatsTableStat(1,12);
        teamsPage.getPossessionHeaderText(1).then(function(text) {
          assert.equal(text, ' Buccaneers Ball Starting At 3:34 At The DEN 50');
        });
      });

      test.it('1st play in Play by Play modal should have the correct ballposition info', function() {
        teamsPage.getPossessionPlayText(1,2).then(function(text) {
          assert.equal(text, 'DEN 26');
        });
      });

      test.it('1st play in Flat View section should have the correct PlayYardsGain stat', function() {
        teamsPage.clickFlatViewTab();
        teamsPage.getFlatViewPlayText(1,6).then(function(stat) {
          assert.equal(stat, -4);
        });
      });

      test.it('clicking video icon should open up video modal', function() {
        teamsPage.clickByPossessionTab();
        teamsPage.clickByPossessionPlayVideoIcon(1);
        teamsPage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "3rd & 1 DEN 26");
        });
      });

      test.it('closing modals', function() {
        teamsPage.closeVideoPlaylistModal();
        teamsPage.closePlayByPlayModal();
      });
    });
  
    test.describe("#pinning/isoMode", function() {
      test.it('clicking the pin icon for the Bucaneers should add them to the pinned table', function() {
        teamsPage.clickTablePin(1);

        teamsPage.getIsoTableStat(1,3).then(function(stat) {
          assert.equal(stat, ' Buccaneers (1-3)');
        });
      });

      test.it('selecting Eagles from search should add team to table', function() {
        teamsPage.clickIsoBtn("on");
        teamsPage.addToIsoTable('Philadelphia Eagles', 1)

        teamsPage.getStatsTableStatFor(2,'Team').then(function(stat) {
          assert.equal(stat, ' Eagles (0-3)', '2nd row team name');
        })
      });

      test.it('pinned total should show the correct sum', function() {
        teamsPage.getPinnedTotalTableStat(9).then(function(stat) {
          assert.equal(stat, 3, 'pinned total - PS');
        });
      });

      test.it('turning off isolation mode should show teams in iso table', function() {
        teamsPage.clickIsoBtn("off");
        teamsPage.getIsoTableStat(1,3).then(function(stat) {
          assert.equal(stat, ' Buccaneers (1-3)', '1st row team name');
        });
      });
    });

    test.describe("#chart/edit columns", function() {
      // histograms
      test.it('clicking show histogram link should open histogram modal', function() {
        teamsPage.clickChartColumnsBtn();
        teamsPage.openHistogram(16); 
        teamsPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, true);
        }); 
      });

      test.it('hovering over bar should show stats for teams', function() {
        teamsPage.hoverOverHistogramStack(1)
        teamsPage.getTooltipText().then(function(text) {
          assert.equal(text, 'Buccaneers: -1\nRedskins: -1\nBengals: -1\nPanthers: -1\nPackers: -1', 'tooltip for 1st bar');
        });
      });

      test.it('pinned teams should be represented by circles', function() {
        teamsPage.getHistogramCircleCount().then(function(count) {
          assert.equal(count, 2, '# of circles on histogram')
        })
      })

      test.it("selecting 'Display pins as bars' should add team to the histogram", function() {
        teamsPage.toggleHistogramDisplayPinsAsBars();
        teamsPage.getHistogramBarCount().then(function(count) {
          assert.equal(count, 6, '# of bars on histogram');
        });
      });

      test.it("changing Bin Count should update the histogram", function() {
        teamsPage.changeHistogramBinCount(3);
        teamsPage.getHistogramBarCount().then(function(count) {
          assert.equal(count, 6, '# of bars on histogram');
        });
      })     

      test.it('clicking close histogram button should close histogram modal', function() {
        teamsPage.closeModal();
        teamsPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, false);
        }); 
      })                 

      // scatter plots          
      test.it('clicking add scatter plot link for 2 different categories should open up scatter chart modal', function() {
        teamsPage.openScatterChart(10,11);

        teamsPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, true);
        }); 
      });

      test.it('clicking close button should close scatter chart modal', function() {
        teamsPage.closeModal();
        teamsPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, false);
        }); 
      });

      test.it('clearing pins', function() {
        teamsPage.clearTablePins();
      });   
    });

    test.describe("#groupBy", function() {
      test.it('remove filters', function() {
        filters.closeDropdownFilter('Distance To First');
        filters.closeDropdownFilter('Down');
        filters.closeDropdownFilter('Timeouts Left');
      });

      test.it('selecting "By Season" shows the correct headers', function() {
        teamsPage.changeGroupBy("By Season");
        teamsPage.getStatsTableHeader(4).then(function(header) {
          assert.equal(header, "Season");
        });

        teamsPage.getStatsTableStatFor(1,'PS').then(function(stat) {
          assert.equal(stat, 173, 'Team 1 - PS');
        });
      });

      test.it('selecting "By Game" shows the correct headers', function() {
        teamsPage.changeGroupBy("By Game");
        teamsPage.getStatsTableHeader(4).then(function(header) {
          assert.equal(header, "Opponent");
        });          

        teamsPage.getStatsTableStatFor(1,'PS').then(function(stat) {
          assert.equal(stat, 3, 'Game 1 - PS');
        });
      });        

      test.it('selecting "By Game Result" shows the correct headers', function() {
        teamsPage.changeGroupBy("By Game Result");
        teamsPage.getStatsTableHeader(4).then(function(header) {
          assert.equal(header, "GameResult");
        });    

        teamsPage.getStatsTableStatFor(1,'PS').then(function(stat) {
          assert.equal(stat, 139, 'Game 1 - PS');
        });                
      });  

      test.it('selecting "Total"', function() {
        teamsPage.changeGroupBy("Totals");
      });      
    });

    test.describe("#statsView", function() {
      var topColor = "rgba(255, 76, 76, 1)";
      var statViews = [
        { type: 'Rank', topStat: 32, color: true, col: 11 },            
        { type: 'Percentile', topStat: "0.0%", color: true, col: 11 },
        { type: 'Z-Score', topStat: -1.658, col: 11 },
        { type: 'Stat Grade', topStat: 20, col: 11 },
        { type: 'Stat (Rank)', topStat: "2390 (32)", color: true, col: 11 },
        { type: 'Stat (Percentile)', topStat: "2390 (0%)", color: true, col: 11 },
        { type: 'Stat (Z-Score)', topStat: "2390 (-1.66)", col: 11 },
        { type: 'Stat (Stat Grade)', topStat: "2390 (20)", col: 11 },
        { type: 'Per Game', topStat: 298.75, col: 12 },
        { type: 'Per Team Game', topStat: 298.75, col: 12 },
        { type: 'Opponent Stats', topStat: 3795, col: 12 },
        { type: 'Opponent Rank', topStat: 32, col: 12, color: true },
        { type: 'Opponent Stats (Rank)', topStat: "3795 (32)", col: 12, color: true },
        { type: 'Opponent Per Game', topStat: 428.00, col: 12 },
        { type: 'Stats', topStat: 2390, col: 12 }
      ];
      
      test.it('sorting by yds asc', function() {
        teamsPage.clickStatsTableHeaderFor('Yds');  
        teamsPage.clickStatsTableHeaderFor('Yds');  
      })

      statViews.forEach(function(statView) {
        test.it("selecting (stats view: " + statView.type + ") shows the correct stat value", function() {
          teamsPage.changeStatsView(statView.type);  
          teamsPage.getStatsTableStatFor(1,'Yds').then(function(stat) {
            assert.equal(stat, statView.topStat);
          });
        });

        if (statView.color) {
          test.it("selecting " + statView.type + " shows the top value the right color", function() {
            teamsPage.getStatsTableBgColorFor(1,'Yds').then(function(color) {
              assert.equal(color, topColor);
            });
          });
        }
      });
    });

    test.describe("#reports", function() {
      var reports = [
        { type: 'Team Offense', topStat: 374.4, statType: "Yd/G" },  
        { type: 'Team Defense', topStat: 297.0, statType: "Yd/G" },  
        { type: 'Team Turnovers', topStat: 13, statType: "TOMgn" },  
        { type: 'Team Drives', topStat: 32, statType: "OffTD" },  
        { type: 'Team Drive Rates', topStat: 2.90, statType: "Pts/D" },  
        { type: 'Opponent Drive Rates', topStat: 1.29, statType: "Pts/D" },  
        { type: 'Team Offensive Rates', topStat: 6.77, statType: "Yd/Ply" },  
        { type: 'Defensive Rates', topStat: 4.63, statType: "Yd/Ply" },  
        { type: 'Team Offensive Conversions', topStat: '53.0%', statType: "3rdCv%" },  
        { type: 'Defensive Conversions', topStat: '31.1%', statType: "3rdCv%" },  
        { type: 'Team Special Teams Summary', topStat: '100.0%', statType: "FG%" },  
        { type: 'Team Penalties', topStat: 40, statType: "Pen" },  
        { type: 'Offensive Plays', topStat: 32, statType: "OffTD" },  
        { type: 'Defensive Plays', topStat: 12, statType: "OffTD" },  
        { type: 'QB Stats', topStat: 119.0, statType: "PsrRt" },  
        { type: 'Opponent QB Stats', topStat: 67.2, statType: "PsrRt" },  
        { type: 'Passing Rates', topStat: 119.0, statType: "PsrRt" },  
        { type: 'Opponent Passing Rates', topStat: 67.2, statType: "PsrRt" },  
        { type: 'Rushing', topStat: 1395, statType: "RnYds" },  
        { type: 'Opponent Rushing', topStat: 606, statType: "RnYds" },  
        { type: 'Receptions', topStat: 2980, statType: "RecYds" },  
        { type: 'Opponent Receptions', topStat: 1627, statType: "RecYds" },  
        { type: 'From Scrimmage', topStat: 3863, statType: "Yds" },  
        { type: 'Rushing Receiving', topStat: 3863, statType: "Yds" },  
        { type: 'Opponent Rushing Receiving', topStat: 2376, statType: "Yds" },  
        { type: 'Touchdowns', topStat: 35, statType: "TD" },  
        { type: 'Opponent Touchdowns', topStat: 13, statType: "TD" },  
        { type: 'Defensive Stats', topStat: 544, statType: "DfTkl" },  
        { type: 'FG / XP / 2Pt', topStat: 20, statType: "FG" },  
        { type: 'Two Point Conversions', topStat: '100.0%', statType: "2PtCv%" }, 
        { type: 'Third Down Conversions', topStat: '53.0%', statType: "3rdCv%" }, 
        { type: 'Red Zone Drives', topStat: '76.7%', statType: "RZTD%" }, 
        { type: 'Team Differentials', topStat: 85, statType: "PtsMgn" }, 
        { type: 'Kickoffs', topStat: 77.3, statType: "OpKRSP" }, 
        { type: 'Punts', topStat: 48, statType: "P" }, 
        { type: 'Returns', topStat: 545, statType: "K-RYd" }, 
        { type: 'Opponent Returns', topStat: 118, statType: "K-RYd" }, 
        { type: 'Team Offense Rank', topStat: 374.4, statType: "Yd/G" }, 
        { type: 'Receptions (Adv)', topStat: 672, statType: "Routes" }, 
        { type: 'Defensive Stats (Adv)', topStat: 220, statType: "Prsrs" }, 
        { type: 'Team Record', topStat: 0.875, statType: "Win%" },  
      ];

      reports.forEach(function(report) {
        test.it("selecting (report: " + report.type + ") shows the correct stat value for " + report.statType, function() {
          teamsPage.changeReport(report.type);  
          teamsPage.getStatsTableStatFor(1,report.statType).then(function(stat) {
            assert.equal(stat, report.topStat);
          });
        });
      });
    });
  });

  test.describe('#Section: Comps', function() {
    test.it('clicking Comps link goes to correct page', function() {
      teamsPage.goToSection('comps');
      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /teams\-comps/);
      });
    });

    test.it('adding team 1, adds team to comp container', function() {
      teamsPage.selectForCompSearch(1, 'Atlanta Falcons');
      teamsPage.getBoxScoreCompTableStat(1,1,1).then(function(stat) { 
        assert.equal(stat, 'Matt Ryan');
      });
    });

    test.it('adding team 2, adds team to comp container', function() {
      teamsPage.selectForCompSearch(2, 'Miami Dolphins');
      teamsPage.getBoxScoreCompTableStat(2,1,1).then(function(stat) { 
        assert.equal(stat, 'Ryan Tannehill');
      });
    });

    test.it('adding team 3, adds team to comp container', function() {
      teamsPage.selectForCompSearch(3, 'Seattle Seahawks');
      teamsPage.getBoxScoreCompTableStat(3,1,1).then(function(stat) { 
        assert.equal(stat, 'Russell Wilson');
      });
    });

    // TODO - not sure what this page is actually supposed to look like since its broken
    test.it('changing comp type to Team Summary updates the page', function() {
      teamsPage.changeCompType('Team Summary');
      teamsPage.getTeamSummaryCompTableStat(1,1,1).then(function(stat) { 
        assert.equal(stat, 'Record');
      });
    });
  });

  test.describe('#Section: Occurrences & Streaks', function() {
    test.it('clicking Occurrences & Streaks link goes to correct page', function() {
      teamsPage.goToSection('occurrencesAndStreaks');
      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /teams\-streaks/);
      });
    });

    test.it('table should be populated on load', function() {
      teamsPage.getStreaksTableStat(1,5).then(function(stat) {
        assert.isNotNull(stat);
      });
    });  

    test.it('table should have proper headers on load', function() {
      teamsPage.getStreaksTableHeader(1).then(function(header) {
        assert.equal(header, "Count");
      });

      teamsPage.getStreaksTableHeader(2).then(function(header) {
        assert.equal(header, "Team");
      });        

      teamsPage.getStreaksTableHeader(3).then(function(header) {
        assert.equal(header, "StartDate");
      });        

      teamsPage.getStreaksTableHeader(4).then(function(header) {
        assert.equal(header, "EndDate");
      });        

      teamsPage.getStreaksTableHeader(5).then(function(header) {
        assert.equal(header, "W");
      });        
    });    

    test.it('changing the main constraint should update the table headers', function() {
      teamsPage.changeMainConstraint("Streaks Of", "At Least", 1, "Rushing TD", "In a Game", "Within a Season");
      teamsPage.getStreaksTableHeader(3).then(function(header) {
        assert.equal(header, "StartDate");
      });

      teamsPage.getStreaksTableHeader(4).then(function(header) {
        assert.equal(header, "EndDate");
      });

      teamsPage.getStreaksTableHeader(5).then(function(header) {
        assert.equal(header, "RnTD");
      });
    });

    test.it('changing the main constraint should update the table stats', function() {
      teamsPage.getStreaksTableStat(1,1).then(function(count) {
        assert.equal(count, 7, ' Team 1 - Count');
      });

      teamsPage.getStreaksTableStat(1,2).then(function(team) {
        assert.equal(team, " TEN*", 'Team 1');
      });

      teamsPage.getStreaksTableStat(1,5).then(function(stat) {
        assert.equal(stat, 10, 'Team 1 - RnTD');
      });         
    });
  });

  test.describe('#Section: Play By Play', function() {
    test.it('clicking Play By Play link goes to correct page', function() {
      teamsPage.goToSection('playByPlay');
      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /teams\-play\-by\-play/);
      });
    });

    // reports
    test.describe('#reports', function() {
      var reports = [
        { type: 'Team Offense', stat: 357.4, statType: "Yd/G", colNum: 2 },  
        { type: 'Team Defense', stat: 357.4, statType: "Yd/G", colNum: 2 },  
        { type: 'Team Turnovers', stat: 349, statType: "TO", colNum: 3 },  
        { type: 'Team Drives', stat: 17121, statType: "OpPly", colNum: 3 },  
        { type: 'Team Drive Rates', stat: 1.92, statType: "Pts/D", colNum: 4 },  
        { type: 'Opponent Drive Rates', stat: 1.92, statType: "Pts/D", colNum: 4 },  
        { type: 'Team Offensive Rates', stat: 5.55, statType: "Yd/Ply", colNum: 2 },  
        { type: 'Defensive Rates', stat: 5.55, statType: "Yd/Ply", colNum: 2 },
        { type: 'Team Offensive Conversions', stat: '39.8%', statType: "3rdCv%", colNum: 9 },  
        { type: 'Defensive Conversions', stat: '39.8%', statType: "3rdCv%", colNum: 9 },  
        { type: 'Team Special Teams Summary', stat: '83.3%', statType: "FG%", colNum: 5 },  
        { type: 'Team Penalties', stat: 1887, statType: "Pen", colNum: 3 },  
        { type: 'Offensive Plays', stat: 644, statType: "OffTD", colNum: 3 },  
        { type: 'Defensive Plays', stat: 644, statType: "OffTD", colNum: 3 },  
        { type: 'QB Stats', stat: '63.4%', statType: "Comp%", colNum: 8 },  
        { type: 'Opponent QB Stats', stat: '63.4%', statType: "Comp%", colNum: 8 },  
        { type: 'Passing Rates', stat: 90.8, statType: "PsrRt", colNum: 4 },  
        { type: 'Opponent Passing Rates', stat: 90.8, statType: "PsrRt", colNum: 4 },  
        { type: 'Rushing', stat: 28666, statType: "RnYds", colNum: 3 },  
        { type: 'Opponent Rushing', stat: 28666, statType: "RnYds", colNum: 3 },  
        { type: 'Receptions', stat: 70082, statType: "RecYds", colNum: 4 },  
        { type: 'Opponent Receptions', stat: 70082, statType: "RecYds", colNum: 4 },  
        { type: 'From Scrimmage', stat: 643, statType: "ScrTD", colNum: 3 },  
        { type: 'Rushing Receiving', stat: 95063, statType: "Yds", colNum: 4 },  
        { type: 'Opponent Rushing Receiving', stat: 95063, statType: "Yds", colNum: 4 },  
        { type: 'Touchdowns', stat: 688, statType: "TD", colNum: 3 },  
        { type: 'Opponent Touchdowns', stat: 688, statType: "TD", colNum: 3 },  
        { type: 'Defensive Stats', stat: 15018, statType: "DfTkl", colNum: 3 },  
        { type: 'FG / XP / 2Pt', stat: 450, statType: "FG", colNum: 3 },  
        { type: 'Two Point Conversions', stat: '7.2%', statType: "2Pta/Td%", colNum: 3 }, 
        { type: 'Third Down Conversions', stat: 1399, statType: "3rdCv", colNum: 3 }, 
        { type: 'Red Zone Drives', stat: 869, statType: "RZZ", colNum: 4 }, 
        { type: 'Team Differentials', stat: 0, statType: "PtsMgn", colNum: 3 }, 
        { type: 'Kickoffs', stat: 1387, statType: "KO", colNum: 3 }, 
        { type: 'Punts', stat: 1206, statType: "P", colNum: 3 }, 
        { type: 'Returns', stat: 11120, statType: "K-Ryd", colNum: 4 }, 
        { type: 'Opponent Returns', stat: 11120, statType: "K-Ryd", colNum: 4 }, 
        { type: 'Team Offense Rank', stat: 357.4, statType: "Yd/G", colNum: 2 }, 
        { type: 'Team Record', stat: 131, statType: "W", colNum: 3 },  
      ];    

      reports.forEach(function(report) {
        test.it("selecting (report: " + report.type + ") shows the correct stat value for " + report.statType, function() {
          teamsPage.changeReport(report.type);  
          teamsPage.getPlayByPlayTableStat(report.colNum).then(function(stat) {
            assert.equal(stat, report.stat);
          });
        });
      });
    });

    test.describe('#filters', function() {  
       test.it('adding filter - (Final Pass Yards Margin: 0 to 100), shows correct stats ', function() {
        filters.changeFilterGroupDropdown('Game');
        filters.changeValuesForRangeSidebarFilter('Final Pass Yards Margin:', 0, 100);

        teamsPage.getPlayByPlayTableStat(10).then(function(stat) {
          assert.equal(stat, 36900, 'League Total Yds');
        });
      });

       test.it('adding filter - (Final Rush Yards Margin: 90 to 100), shows correct stats ', function() {
        filters.changeValuesForRangeSidebarFilter('Final Rush Yards Margin:', 90, 100);

        teamsPage.getPlayByPlayTableStat(10).then(function(stat) {
          assert.equal(stat, 1360, 'League Total Yds');
        });
      });
    });

    test.describe('#videoPlaylist', function() {  
      // play by play
      test.it('shows the correct possession header', function() {
        teamsPage.getPossessionHeaderText(1).then(function(stat) {
          assert.equal(stat, ' Cowboys Ball Starting At 15:00 At The DAL 10');
        });
      });

      test.it('switching to flat view shows the correct play', function() {
        teamsPage.clickFlatViewTab();
        teamsPage.getPlayByPlayFlatViewTableStat(2,2).then(function(stat) {
          assert.equal(stat, '(14:55) 21-E.Elliott left tackle to DAL 11 for 1 yard (55-B.Graham).');
        });

      });

      test.it('opening the video modal shows the correct video', function() {
        teamsPage.clickPlayByPlayFlatViewPlayVideoIcon(4);
        teamsPage.getVideoPlaylistText(1,2).then(function(stat) {
          assert.equal(stat, 'PASS');
        });
      });

      test.it('closing video modal', function() {
        teamsPage.closeVideoPlaylistModal();
      });

      test.it('removing filters', function() {
        this.timeout(120000);
        filters.changeFilterGroupDropdown('Game');
        filters.changeValuesForRangeSidebarFilter('Final Pass Yards Margin:', '', '');
        filters.changeValuesForRangeSidebarFilter('Final Rush Yards Margin:', '', '');
      });
    });    
  });

  test.describe('#Section: Scatter Plot', function() {
    test.it('clicking Scatter Plot link goes to correct page', function() {
      teamsPage.goToSection('scatterPlot');
      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /teams\-scatter\-plot\-z/);
      });
    });

    test.it('table should be populated on load', function() {
      teamsPage.getScatterPlotTableStat(1,2).then(function(stat) {
        assert.isNotNull(stat);
      });
    });  

    test.it('scatter plot should show 32 teams on load', function() {
      teamsPage.getPlotLogoIconCount().then(function(count) {
        assert.equal(count, 32);
      });
    });  

    test.it('changing the x-axis stat should update the table', function() {
      teamsPage.changeXStat('Pass Attempts (Att)');
      teamsPage.getScatterPlotTableHeader(3).then(function(header) {
        assert.equal(header, 'Att');
      });
    });  

    test.it('changing the y-axis stat should update the table', function() {
      teamsPage.changeYStat('Yards Per Game (Yd/G)');
      teamsPage.getScatterPlotTableHeader(4).then(function(header) {
        assert.equal(header, 'Yd/G');
      });      
    });        

    test.it('adding a global filter should update the table', function() {
      var originalYdsPerGame;
      teamsPage.getScatterPlotTableStat(1,4).then(function(ydsPerGame) {
        global = ydsPerGame;
      });
      
      teamsPage.addGlobalFilter('Down: First');
      teamsPage.getScatterPlotTableStat(1,4).then(function(newYdsPerGame) {
        assert.notEqual(newYdsPerGame, originalYdsPerGame);
      });            
    });        

    test.it('adding a x-axis filter should update the table', function() {
      teamsPage.openXAxisFilterContainer();
      var originalAtt;
      teamsPage.getScatterPlotTableStat(1,3).then(function(att) {
        originalAtt = att;
      });
      
      teamsPage.addXFilter('Home/Road/Neutral: Home');
      teamsPage.getScatterPlotTableStat(1,3).then(function(newAtt) {
        assert.notEqual(newAtt, originalAtt);
      });           
    });              

    test.it('adding a y-axis filter should update the table', function() {
      teamsPage.openYAxisFilterContainer();
      var originalYdsPerGame;
      teamsPage.getScatterPlotTableStat(1,4).then(function(ydsPerGame) {
        originalYdsPerGame = ydsPerGame;
      });
      
      teamsPage.addYFilter('In Division Game');
      teamsPage.getScatterPlotTableStat(1,4).then(function(newYdsPerGame) {
        assert.notEqual(newYdsPerGame, originalYdsPerGame);
      });       
    }); 

    test.it('clicking add a trend line should display a trendline on the chart', function() {
      teamsPage.toggleDisplayTrendLine(true);
      teamsPage.isTrendLineVisible().then(function(visible) {
        assert.equal(visible, true);
      });
    }); 
  });
});