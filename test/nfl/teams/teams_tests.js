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

    test.describe("#exports", function() {
      test.it('clicking export button', function() {
        teamsPage.clickStatsExportLink();
      });
      
      test.it('csv file should have the correct data', function() {
        var exportFileContents = 'Rank,team,G,W,L,T,Win%,PS,PA,PM,Yds,OpYds,TO,OpTO,TOMgn,TOP,OpTOP,TopMgn/n1,Cowboys,8,7,1,0,.875,223,140,83,3292,2663,6,10,4,34:03,26:50,7:13/n1,Patriots,8,7,1,0,.875,217,132,85,3042,2833,6,9,3,30:23,29:36,0:47/n3,Raiders,9,7,2,0,.778,245,223,22,3610,3582,6,15,9,32:54,28:34,4:20/n4,Chiefs,8,6,2,0,.750,185,151,34,2739,2954,7,20,13,30:59,29:39,1:19/n5,Seahawks,8,5,2,1,.688,162,134,28,2657,2661,6,8,2,29:12,32:40,-3:28/n6,Falcons,9,6,3,0,.667,305,259,46,3863,3430,7,10,3,30:15,30:24,-0:09/n6,Broncos,9,6,3,0,.667,214,166,48,2910,2807,13,16,3,27:55,32:04,-4:08/n8,Texans,8,5,3,0,.625,137,167,-30,2506,2530,13,6,-7,30:45,30:05,0:40/n8,Vikings,8,5,3,0,.625,155,126,29,2390,2391,5,17,12,31:19,29:30,1:49/n8,Giants,8,5,3,0,.625,161,164,-3,2719,2970,16,9,-7,26:07,33:52,-7:44/n11,Redskins,8,4,3,1,.563,186,189,-3,3282,2958,11,11,0,32:06,29:46,2:19/n12,Lions,9,5,4,0,.556,205,206,-1,3040,3297,6,7,1,29:52,30:52,-1:00/n13,Dolphins,8,4,4,0,.500,173,182,-9,2721,2900,11,8,-3,28:22,32:26,-4:03/n13,Ravens,8,4,4,0,.500,154,153,1,2601,2390,12,14,2,31:20,28:39,2:41/n13,Eagles,8,4,4,0,.500,202,145,57,2667,2604,9,15,6,32:26,28:27,3:58/n13,Saints,8,4,4,0,.500,242,238,4,3476,3268,9,13,4,32:09,27:50,4:19/n13,Packers,8,4,4,0,.500,198,187,11,2801,2606,11,10,-1,31:21,28:38,2:42/n13,Steelers,8,4,4,0,.500,184,171,13,2883,3005,10,9,-1,29:32,30:27,-0:55/n19,Titans,9,4,5,0,.444,217,226,-9,3415,3212,13,7,-6,30:47,29:12,1:34/n19,Chargers,9,4,5,0,.444,268,247,21,3402,3282,18,18,0,31:45,29:28,2:16/n19,Bills,9,4,5,0,.444,237,203,34,3093,3160,5,12,7,29:14,30:45,-1:31/n19,Colts,9,4,5,0,.444,239,256,-17,3239,3625,10,8,-2,31:03,29:42,1:21/n23,Bengals,8,3,4,1,.438,167,189,-22,3163,3028,8,10,2,31:16,30:36,0:40/n23,Cardinals,8,3,4,1,.438,179,140,39,2995,2376,12,15,3,33:04,28:48,4:15/n25,Buccaneers,8,3,5,0,.375,180,232,-52,2858,3191,14,11,-3,30:32,31:07,-0:34/n25,Rams,8,3,5,0,.375,130,167,-37,2492,2647,14,10,-4,29:31,30:28,-0:56/n25,Panthers,8,3,5,0,.375,204,206,-2,2959,2908,17,11,-6,31:24,28:36,2:48/n28,Jets,9,3,6,0,.333,173,235,-62,3057,3179,19,9,-10,31:28,28:31,2:57/n29,Jaguars,8,2,6,0,.250,153,215,-62,2763,2676,17,5,-12,27:20,32:39,-5:18/n29,Bears,8,2,6,0,.250,131,179,-48,2843,2711,9,7,-2,28:03,31:56,-3:53/n31,49ers,8,1,7,0,.125,167,260,-93,2516,3424,17,11,-6,25:31,34:28,-8:56/n32,Browns,9,0,9,0,.000,168,273,-105,3069,3795,12,8,-4,27:38,33:05,-5:26/n';
        
        return teamsPage.readAndDeleteExportCSV().then(function(fileContents) {
          assert.equal(fileContents, exportFileContents);  
        })
      });
    });
  });

  test.describe('#Section: Comps', function() {
    test.it('clicking Comps link goes to correct page', function() {
      teamsPage.goToSection('Comps');
      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /teams\-comps/);
      });
    });

    test.it('adding team 1, adds team to comp container', function() {
      teamsPage.selectForCompSearch(1, 'Atlanta Falcons');
      teamsPage.getCompTableStat(1,1,1).then(function(stat) { 
        assert.equal(stat, 'Matt Ryan');
      });
    });

    test.it('adding team 2, adds team to comp container', function() {
      teamsPage.selectForCompSearch(2, 'Miami Dolphins');
      teamsPage.getCompTableStat(2,1,1).then(function(stat) { 
        assert.equal(stat, 'Ryan Tannehill');
      });
    });

    test.it('adding team 3, adds team to comp container', function() {
      teamsPage.selectForCompSearch(3, 'Seattle Seahawks');
      teamsPage.getCompTableStat(3,1,1).then(function(stat) { 
        assert.equal(stat, 'Russell Wilson');
      });
    });

    // TODO - not sure what this page is actually supposed to look like since its broken
    test.it('changing comp type to Team Summary updates the page', function() {
      teamsPage.changeCompType('Team Summary');
      teamsPage.getCompTableStat(1,1,1).then(function(stat) { 
        assert.equal(stat, 'Matt Ryan');
      });
    });
  });

  test.describe('#Section: Occurrences & Streaks', function() {
    test.it('clicking Occurrences & Streaks link goes to correct page', function() {
      teamsPage.goToSection('Occurrences & Streaks');
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
      teamsPage.goToSection('Play By Play');
      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /teams\-play\-by\-play/);
      });
    });

    // reports
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
    
    // play by play
    test.it('shows the correct possession header', function() {
      teamsPage.getPossessionHeaderText(1).then(function(stat) {
        assert.equal(stat, ' Seahawks Ball Starting At 15:00 At The SEA 25');
      });
    });

    test.it('switching to flat view shows the correct play', function() {
      teamsPage.clickFlatViewTab();
      teamsPage.getPlayByPlayFlatViewTableStat(2,2).then(function(stat) {
        assert.equal(stat, '(15:00) 3-R.Wilson pass short left to 89-D.Baldwin pushed ob at SEA 34 for 9 yards (29-K.Seymour).');
      });

    });

    test.it('opening the video modal shows the correct video', function() {
      teamsPage.clickPlayByPlayFlatViewPlayVideoIcon(5);
      teamsPage.getVideoPlaylistText(1,2).then(function(stat) {
        assert.equal(stat, 'PUNT');
      });
    });

    test.it('closing video modal', function() {
      teamsPage.closeVideoPlaylistModal();
    });
  });

  test.describe('#Section: Scatter Plot', function() {
    test.it('clicking Scatter Plot link goes to correct page', function() {
      teamsPage.goToSection('Scatter Plot');
      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /teams\-scatter\-plot\-z/);
      });
    });

    test.it('table should be populated on load', function() {
      teamsPage.getScatterPlotTableStat(1,2).then(function(stat) {
        assert.isNotNull(stat);
      });
    });  

    test.it('scatter plot should show 30 teams on load', function() {
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