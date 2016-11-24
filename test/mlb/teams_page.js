var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var constants = require('../../lib/constants.js');

// Page Objects
var Navbar = require('../../pages/mlb/navbar.js');
var Filters = require('../../pages/mlb/filters.js');
var TeamsPage = require('../../pages/mlb/teams/teams_page.js');
var StatsPage = require('../../pages/mlb/teams/stats_page.js');
var ScatterPlotPage = require('../../pages/mlb/teams/scatter_plot_page');
var StreaksPage = require('../../pages/mlb/teams/streaks_page');
var navbar, filters, teamsPage, statsPage, scatterPlotPage, streaksPage;
var battingAverageCol, winsCol, eraCol, ksCol, slaaCol, statCol;

test.describe('#Teams Page', function() {
  test.before(function() {  
    navbar  = new Navbar(driver);  
    filters  = new Filters(driver);  
    teamsPage = new TeamsPage(driver);
    statsPage = new StatsPage(driver);
  });

  test.it('clicking the teams link goes to the correct page', function() {
    navbar.goToTeamsPage();

    driver.getTitle().then(function(title) {
      assert.equal( title, 'Teams Batting', 'Correct title');
    });
  });    

  test.describe('#Section: Batting', function() {
    test.describe('#SubSection: Stats', function() {
      test.before(function() {
        battingAverageCol = 11;
        winsCol = 5;
        filters.removeSelectionFromDropdownFilter("Seasons:");
        filters.addSelectionToDropdownFilter("Seasons:", 2015);
      });

      // Sorting
      test.describe("#sorting", function() {
        test.it('should be sorted initially by BA descending', function() {
          var teamOneBA, teamTwoBA, teamTenBA;
          statsPage.getTeamTableStat(1,battingAverageCol).then(function(stat) {
            teamOneBA = stat;
          });

          statsPage.getTeamTableStat(2,battingAverageCol).then(function(stat) {
            teamTwoBA = stat;
          });

          statsPage.getTeamTableStat(10,battingAverageCol).then(function(stat) {
            teamTenBA = stat;

            assert.isAtLeast(teamOneBA, teamTwoBA, "team 1's BA is >= team 2's BA");
            assert.isAtLeast(teamTwoBA, teamTenBA, "team 2's BA is >= team 10's BA");
          });            
        });

        test.it('clicking on the BA column header should reverse the sort', function() {
          var teamOneBA, teamTwoBA, teamTenBA;
          statsPage.clickTeamTableColumnHeader(battingAverageCol);
          statsPage.getTeamTableStat(1,battingAverageCol).then(function(stat) {
            teamOneBA = stat;
          });

          statsPage.getTeamTableStat(2,battingAverageCol).then(function(stat) {
            teamTwoBA = stat;
          });

          statsPage.getTeamTableStat(10,battingAverageCol).then(function(stat) {
            teamTenBA = stat;
            assert.isAtMost(teamOneBA, teamTwoBA, "team 1's BA is <= team 2's BA");
            assert.isAtMost(teamTwoBA, teamTenBA, "team 2's BA is <= team 10's BA");
          });
        });

        test.it('clicking on the W column header should sort the table by Wins', function() {
          var teamOneWs, teamTwoWs, teamTenWs;
          statsPage.clickTeamTableColumnHeader(winsCol);
          statsPage.getTeamTableStat(1,winsCol).then(function(stat) {
            teamOneWs = stat;
          });

          statsPage.getTeamTableStat(2,winsCol).then(function(stat) {
            teamTwoWs = stat;
          });

          statsPage.getTeamTableStat(10,winsCol).then(function(stat) {
            teamTenWs = stat;
            assert.isAtLeast(teamOneWs, teamTwoWs, "team 1's Wins is >= team 2's Wins");
            assert.isAtLeast(teamTwoWs, teamTenWs, "team 2's Wins is >= team 10's Wins");
          });
        });  

        test.after(function() {
          statsPage.clickTeamTableColumnHeader(battingAverageCol);
        });        
      });

      // Filters
      test.describe("#filters", function() {
        test.it('adding filter: (pitch type - fastball) from dropdown displays correct data', function() {
          filters.addDropdownFilter('Pitch Type: Fastball');

          statsPage.getTeamTableStat(1,11).then(function(battingAverage) {
            assert.equal(battingAverage, 0.316);
          });
        });

        test.it('adding filter: (2 outs) from sidebar displays correct data', function() {
          filters.toggleSidebarFilter('Outs:', 2, true);

          statsPage.getTeamTableStat(1,11).then(function(battingAverage) {
            assert.equal(battingAverage, 0.338);
          });
        });

        test.it('removing filter: (2 outs) from top section displays correct data', function() {
          filters.closeDropdownFilter('Outs:');
          statsPage.getTeamTableStat(1,11).then(function(battingAverage) {
            assert.equal(battingAverage, 0.316);
          });
        }); 

        test.it('removing filter: (pitch type-fastball) from sidebar displays correct data', function() {
          filters.toggleSidebarFilter("Pitch Type:", 'Fastball', false);
          statsPage.getTeamTableStat(1,11).then(function(battingAverage) {
            assert.equal(battingAverage, 0.270);
          });
        });         
      });  

      // Pinning
      test.describe("#pinning", function() {
        test.it('clicking the pin icon for the Red Sox should add them to the pinned table', function() {
          var teamName;
          statsPage.getTeamTableStat(1,3).then(function(team) {
            teamName = team;
          });

          statsPage.clickTeamTablePin(1);

          statsPage.getIsoTableStat(1,3).then(function(team) {
            assert.equal(team, teamName);
          });
        });

        test.after(function() {
          statsPage.clearTeamTablePin();
        });
      });

      // (temporary)
      // TODO - remove after push
      test.describe('#ISO Mode', function() {
        test.it('selecting LA from search should add team to table', function() {
          statsPage.clickIsoBtn("on");
          statsPage.addTeamToIsoTable('LA', 2);
          statsPage.getTeamTableStat(1,3).then(function(stat) {
            assert.equal(stat, ' LAD', '1st row team name');
          });
        });

        test.after(function() {
          statsPage.clickIsoBtn("off");
          statsPage.clearTeamTablePin();
        });
      });
      
      // Isolation Mode
      test.describe("#isolation mode", function() {
        test.it('selecting LA Dodgers from search should add team to table', function() {
          statsPage.clickIsoBtn("on");
          statsPage.addTeamToIsoTable('LA Dodgers', 1)
          // the ISO table doesn't actually show when ISO mode is on
          // instead what's happening is that the main table's data is replaced
          // when ISO mode is off, both tables show
          statsPage.getTeamTableStat(1,3).then(function(stat) {
            assert.equal(stat, ' LAD', '1st row team name');
          })
        });      

  
        test.it('selecting SF Giants from search should add team to table', function() {
          statsPage.addTeamToIsoTable('Giants', 1)
          statsPage.getTeamTableStat(1,3).then(function(stat) {
            assert.equal(stat, ' SF', '1st row team name');
          });

          statsPage.getTeamTableStat(2,3).then(function(stat) {
            assert.equal(stat, ' LAD', '2n row team name');
          });
        });         

        test.it('pinned total should show the correct sum', function() {
          statsPage.getPinnedTotalTableStat(5).then(function(wins) {
            assert.equal(wins, 176, 'pinned total - wins');
          });

          statsPage.getPinnedTotalTableStat(11).then(function(ba) {
            assert.equal(ba, 0.259, 'pinned total - ba');
          });
        });                                       

        test.it('turning off isolation mode should show teams in iso table', function() {
          statsPage.clickIsoBtn("off");
          statsPage.getIsoTableStat(1,3).then(function(stat) {
            assert.equal(stat, ' SF', '1st row team name');
          });

          statsPage.getIsoTableStat(2,3).then(function(stat) {
            assert.equal(stat, ' LAD', '2n row team name');
          });
        });                                               
      });

      // Chart/Edit Columns
      // TODO - these tests are too unreliable
      test.describe("#chart/edit columns", function() {
        // histograms
        
        test.it('clicking show histogram link should open histogram modal', function() {
          statsPage.clickChartColumnsBtn()
          
          statsPage.openHistogram(14);  
          statsPage.isModalDisplayed().then(function(isDisplayed) {
            assert.equal(isDisplayed, true);
          });
        });  

        test.it('hovering over bar should show stats for teams', function() {
          statsPage.hoverOverHistogramStack(1)
          statsPage.getTooltipText().then(function(text) {
            assert.equal(text, 'MIA: .694\nCWS: .686\nSD: .686\nPHI: .684\nATL: .674', 'tooltip for 1st bar');
          });
        });

        test.it('pinned teams should be represented by circles', function() {
          statsPage.getHistogramCircleCount().then(function(count) {
            assert.equal(count, 2, '# of circles on histogram')
          })
        })

        test.it("selecting 'Display pins as bars' should add team to the histogram", function() {
          statsPage.toggleHistogramDisplayPinsAsBars();
          statsPage.getHistogramBarCount().then(function(count) {
            // 1 original bar and 4 new bars will have height=0 and will appear invisible
            assert.equal(count, 12, '# of bars on histogram');
          });
        });

        test.it("changing Bin Count should update the histogram", function() {
          statsPage.changeHistogramBinCount(3);
          statsPage.getHistogramBarCount().then(function(count) {
            // 1 original bar and 4 new bars will have height=0 and will appear invisible
            assert.equal(count, 6, '# of bars on histogram');
          });
        })        

        test.it('clicking close histogram button should close histogram modal', function() {
          statsPage.closeModal();
          statsPage.isModalDisplayed().then(function(isDisplayed) {
            assert.equal(isDisplayed, false);
          }); 
        })                 

        // scatter plots          
        test.it('clicking add scatter plot link for 2 different categories should open up scatter chart modal', function() {
          statsPage.openScatterChart(10,11);

          statsPage.isModalDisplayed().then(function(isDisplayed) {
            assert.equal(isDisplayed, true);
          }); 
        });

        test.it('clicking close button should close scatter chart modal', function() {
          statsPage.closeModal();
          statsPage.isModalDisplayed().then(function(isDisplayed) {
            assert.equal(isDisplayed, false);
          }); 
        });

        test.after(function() {
          statsPage.clearTeamTablePin();
        });   
      });

      // Group By
      test.describe("#group by", function() {
        test.it('selecting "By Season" shows the correct headers', function() {
          statsPage.changeGroupBy("By Season");
          statsPage.getTeamTableHeader(4).then(function(header) {
            assert.equal(header, "Season");
          });
        });

        test.it('selecting "By Game" shows the correct headers', function() {
          statsPage.changeGroupBy("By Game");
          statsPage.getTeamTableHeader(4).then(function(header) {
            assert.equal(header, "Opponent");
          });          
        });        

        test.it('selecting "By Year" shows the correct headers', function() {
          statsPage.changeGroupBy("By Org");
          statsPage.getTeamTableHeader(4).then(function(header) {
            assert.equal(header, "G");
          });                    
        });  

        test.after(function() {
          statsPage.changeGroupBy("Totals");
        });      
      });

      // Stats View
      test.describe("#stats view", function() {
        var topColor = "rgba(108, 223, 118, 1)";
        var statViews = [
          { type: 'Stats', topStat: 0.270 },  
          { type: 'Rank', topStat: 1, color: true },            
          { type: 'Percentile', topStat: "100.0%", color: true },
          { type: 'Z-Score', topStat: 1.941 },
          { type: 'Stat Grade', topStat: 80 },
          { type: 'Stat (Rank)', topStat: ".270 (1)", color: true },
          { type: 'Stat (Percentile)', topStat: ".270 (100%)", color: true },
          { type: 'Stat (Z-Score)', topStat: ".270 (1.94)"},
          { type: 'Stat (Stat Grade)', topStat: ".270 (80)"},
          { type: 'Pct of Team', topStat: 0.270},
        ];
        statViews.forEach(function(statView) {
          test.it("selecting (stats view: " + statView.type + ") shows the correct stat value", function() {
            statsPage.changeStatsView(statView.type);  
            statsPage.getTeamTableStat(1,11).then(function(stat) {
              assert.equal(stat, statView.topStat);
            });
          });

          if (statView.color) {
            test.it("selecting " + statView.type + " shows the top value the right color", function() {
              statsPage.getTeamTableBgColor(1,11).then(function(color) {
                assert.equal(color, topColor);
              });
            });
          }
        });

        test.after(function() {
          statsPage.changeStatsView('Stats');
        });
      });                      

      // Batting Reports
      test.describe("#reports", function() {
        var reports = [
          { type: 'Counting', topStat: 1515, statType: "H", colNum: 12 },  
          { type: 'Pitch Rates', topStat: "47.8%", statType: "InZone%", colNum: 13 },  
          { type: 'Pitch Counts', topStat: 11024, statType: "InZone#", colNum: 12 },  
          { type: 'Pitch Types', topStat: "54.8%", statType: "Fast%", colNum: 7 },  
          { type: 'Pitch Type Counts', topStat: 13263, statType: "Fast#", colNum: 7 },  
          { type: 'Pitch Locations', topStat: "47.8%", statType: "InZone%", colNum: 7 },  
          { type: 'Pitch Calls', topStat: -213.19, statType: "SLAA", colNum: 7 },  
          { type: 'Hit Types', topStat: 0.75, statType: "GB/FB", colNum: 6 },  
          { type: 'Hit Locations', topStat: "46.8%", statType: "HPull%", colNum: 9 },  
          { type: 'Home Runs', topStat: 232, statType: "HR", colNum: 7 },  
          { type: 'Exit Data', topStat: 0.444, statType: "ExSLG%", colNum: 11 }
        ];

        reports.forEach(function(report) {
          test.it("selecting (report: " + report.type + ") shows the correct stat value for " + report.statType, function() {
            statsPage.changeBattingReport(report.type);  
            statsPage.getTeamTableStat(1,report.colNum).then(function(stat) {
              assert.equal(stat, report.topStat);
            });
          });
        });        
      });
    });

    test.describe('#SubSection: Occurrences & Streaks', function() {
      test.before(function() {
        streaksPage = new StreaksPage(driver);
      });

      test.it('clicking the occurences & streaks link goes to the correct URL', function() {
        teamsPage.goToSubSection('occurrencesAndStreaks');
        filters.removeSelectionFromDropdownFilter("Seasons:");
        filters.addSelectionToDropdownFilter("Seasons:", 2015);
        
        driver.getCurrentUrl().then(function(url) {
          assert.match(url, /teams\-streaks\-batting/);
        });
      });

      test.it('table should be populated on load', function() {
        streaksPage.getTableStat(1,5).then(function(stat) {
          assert.isNotNull(stat);
        });
      });  

      test.it('table should have proper headers on load', function() {
        streaksPage.getTableHeader(1).then(function(header) {
          assert.equal(header, "Count");
        });

        streaksPage.getTableHeader(2).then(function(header) {
          assert.equal(header, "Team");
        });        

        streaksPage.getTableHeader(3).then(function(header) {
          assert.equal(header, "StartSeason");
        });        

        streaksPage.getTableHeader(4).then(function(header) {
          assert.equal(header, "EndSeason");
        });        

        streaksPage.getTableHeader(5).then(function(header) {
          assert.equal(header, "H");
        });        
      });    

      test.it('changing the main constraint should update the table headers', function() {
        streaksPage.changeMainConstraint("Streaks Of", "At Least", 1, "2B (Batting)", "In a Inning", "Within a Season");
        streaksPage.getTableHeader(3).then(function(header) {
          assert.equal(header, "StartDate");
        });

        streaksPage.getTableHeader(4).then(function(header) {
          assert.equal(header, "EndDate");
        });

        streaksPage.getTableHeader(5).then(function(header) {
          assert.equal(header, "2B");
        });
      });

      test.it('changing the main constraint should update the table stats', function() {
        streaksPage.getTableStat(1,1).then(function(count) {
          assert.equal(count, 6);
        });

        streaksPage.getTableStat(1,2).then(function(team) {
          assert.equal(team, " BOS");
        });

        streaksPage.getTableStat(1,5).then(function(statType) {
          assert.equal(statType, "7");
        });         
      });      

      // TODO - need to figure out a good way to get the new constraint XPATH's
      // test.it('adding a constraint should update the table', function() {
      // });      

      // test.it('removing a constraint should update the table', function() {
      // });      
    });

    test.describe('#SubSection: Scatter Plot', function() {
      test.before(function() {
        scatterPlotPage = new ScatterPlotPage(driver);
      });

      test.it('clicking the scatter_plot link goes to the correct URL', function() {
        teamsPage.goToSubSection('scatterPlot');
        driver.getCurrentUrl().then(function(url) {
          assert.match(url, /teams\-scatter\-plot\-batting/);
        });
      });

      test.it('table should be populated on load', function() {
        scatterPlotPage.getTableStat(1,2).then(function(stat) {
          assert.isNotNull(stat);
        });
      });  

      test.it('scatter plot should show 30 teams on load', function() {
        scatterPlotPage.getPlotLogoIconCount().then(function(count) {
          assert.equal(count, 30);
        });
      });  

      test.it('changing the x-axis stat should update the table', function() {
        scatterPlotPage.changeXStat('AVG');
        scatterPlotPage.getTableHeader(3).then(function(header) {
          assert.equal(header, 'AVG');
        });
      });  

      test.it('changing the y-axis stat should update the table', function() {
        scatterPlotPage.changeYStat('R/G');
        scatterPlotPage.getTableHeader(4).then(function(header) {
          assert.equal(header, 'R/G');
        });      
      });        

      test.it('adding a global filter should update the table', function() {
        var originalAdjRuns;
        scatterPlotPage.getTableStat(1,4).then(function(runs) {
          originalAdjRuns = runs;
        });
        
        scatterPlotPage.addGlobalFilter('Pitch Type: Fastball');
        scatterPlotPage.getTableStat(1,4).then(function(newAdjRuns) {
          assert.notEqual(newAdjRuns, originalAdjRuns);
        });            
      });        

      test.it('adding a x-axis filter should update the table', function() {
        scatterPlotPage.openXAxisFilterContainer();
        var originalOBP;
        scatterPlotPage.getTableStat(1,3).then(function(obp) {
          originalOBP = obp;
        });
        
        scatterPlotPage.addXFilter('count: 3-0');
        scatterPlotPage.getTableStat(1,3).then(function(newOBP) {
          assert.notEqual(newOBP, originalOBP);
        });           
      });              

      test.it('adding a y-axis filter should update the table', function() {
        scatterPlotPage.openYAxisFilterContainer();
        var originalAdjRuns;
        scatterPlotPage.getTableStat(1,4).then(function(runs) {
          originalAdjRuns = runs;
        });
        
        scatterPlotPage.addYFilter('Venue: Home');
        scatterPlotPage.getTableStat(1,4).then(function(newAdjRuns) {
          assert.notEqual(newAdjRuns, originalAdjRuns);
        });       
      }); 

      test.it('clicking add a trend line should display a trendline on the chart', function() {
        // TODO - looks like its broken right now?
      }); 
    });
  });

  test.describe('#Section: Pitching', function() {
    test.before(function() {    
      teamsPage.goToSection("pitching");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2015);

      eraCol = 21;
      ksCol = 19;
    });

    test.describe('#SubSection: Stats', function() {
      // Sorting
      test.describe("#sorting", function() {
        test.it('should be sorted initially by ERA ascending', function() {
          var teamOneERA, teamTwoERA, teamTenERA;

          statsPage.getTeamTableStat(1,eraCol).then(function(stat) {
            teamOneERA = stat;
          });

          statsPage.getTeamTableStat(2,eraCol).then(function(stat) {
            teamTwoERA = stat;
          });

          statsPage.getTeamTableStat(10,eraCol).then(function(stat) {
            teamTenERA = stat;
            assert.isAtMost(teamOneERA, teamTwoERA, "team one's ERA is <= team two's ERA");
            assert.isAtMost(teamTwoERA, teamTenERA, "team two's ERA is <= team ten's ERA");
          });                        
        });

        test.it('clicking on the ERA column header should reverse the sort', function() {
          var teamOneERA, teamTwoERA, teamTenERA;
          statsPage.clickTeamTableColumnHeader(eraCol);

          
          statsPage.getTeamTableStat(1,eraCol).then(function(stat) {
            teamOneERA = stat;
          });

          statsPage.getTeamTableStat(2,eraCol).then(function(stat) {
            teamTwoERA = stat;
          });
          
          statsPage.getTeamTableStat(10,eraCol).then(function(stat) {
            teamTenERA = stat;
            assert.isAtLeast(teamOneERA, teamTwoERA, "team one's ERA is >= team two's ERA");
            assert.isAtLeast(teamTwoERA, teamTenERA, "team two's ERA is >= team ten's ERA");
          });            
        });

        test.it('clicking on the K column header should sort the table by Ks', function() {
          var teamOneKs, teamTwoKs, teamTenKs;
          statsPage.clickTeamTableColumnHeader(ksCol);

          statsPage.getTeamTableStat(1,ksCol).then(function(stat) {
            teamOneKs = stat;
          });

          statsPage.getTeamTableStat(2,ksCol).then(function(stat) {
            teamTwoKs = stat;
          });

          statsPage.getTeamTableStat(10,ksCol).then(function(stat) {
            teamTenKs = stat;
            assert.isAtLeast(teamOneKs, teamTwoKs, "team one's Ks is >= team two's Ks");
            assert.isAtLeast(teamTwoKs, teamTenKs, "team two's Ks is >= team ten's Ks");
          });            
        });  

        test.after(function() {
          statsPage.clickTeamTableColumnHeader(eraCol);
        });        
      });

      // Filters
      test.describe("#filters", function() {
        test.before(function() {
          statsPage.clickTeamTableColumnHeader(ksCol);
        });

        test.it('adding filter: (venue - home) from dropdown displays correct data', function() {
          filters.addDropdownFilter('Venue: Home');

          statsPage.getTeamTableStat(1,ksCol).then(function(ks) {
            assert.equal(ks, 748);
          });
        });

        test.it('adding filter: (Pitch Type: Changeup) from sidebar displays correct data', function() {
          filters.toggleSidebarFilter('Pitch Type:', 'Changeup', true);

          statsPage.getTeamTableStat(1,ksCol).then(function(ks) {
            assert.equal(ks, 118);
          });
        });

        test.it('removing filter: (Pitch Type: Changeup) from top section displays correct data', function() {
          filters.closeDropdownFilter('Pitch Type:');
          statsPage.getTeamTableStat(1,ksCol).then(function(ks) {
            assert.equal(ks, 748);
          });
        }); 

        test.it('removing filter: (venue - home) from sidebar displays correct data', function() {
          filters.toggleSidebarFilter("Venue:", 'Home', false);
          statsPage.getTeamTableStat(1,ksCol).then(function(ks) {
            assert.equal(ks, 1430);
          });
        });         
      });  

      // Reports
      test.describe("#reports", function() {
        var reports = [
          { type: 'Rate', topStat: 0.233, statType: "BA", colNum: 9 },  
          { type: 'Counting', topStat: 1274, statType: "H", colNum: 9 },  
          { type: 'Pitch Rates', topStat: "52.5%", statType: "InZone%", colNum: 13 },  
          { type: 'Pitch Counts', topStat: 12392, statType: "InZone#", colNum: 12 },  
          { type: 'Pitch Types', topStat: "60.0%", statType: "Fast%", colNum: 7 },  
          { type: 'Pitch Type Counts', topStat: 13658, statType: "Fast#", colNum: 7 },  
          { type: 'Pitch Locations', topStat: "52.5%", statType: "InZone%", colNum: 7 },  
          { type: 'Pitch Calls', topStat: 336.90, statType: "SLAA", colNum: 8 },  
          { type: 'Hit Types', topStat: 1.10, statType: "GB/FB", colNum: 6 },  
          { type: 'Hit Locations', topStat: "43.4%", statType: "HPull%", colNum: 9 },  
          { type: 'Home Runs', topStat: 110, statType: "HR", colNum: 6 },  
          { type: 'Movement', topStat: 90.3, statType: "Vel", colNum: 6 },  
          { type: 'Bids', topStat: 2, statType: "NH", colNum: 7 },  
          { type: 'Baserunning', topStat: "60.4%", statType: "SB%", colNum: 8 },  
          { type: 'Exit Data', topStat: 0.367, statType: "ExSLG%", colNum: 11 }
        ];
        reports.forEach(function(report) {
          test.it("selecting " + report.type + " shows the correct stat value for " + report.statType, function() {
            statsPage.changePitchingReport(report.type);  
            statsPage.getTeamTableStat(1,report.colNum).then(function(stat) {
              assert.equal(stat, report.topStat);
            });
          });
        });        
      });
    });
  });

  test.describe('#Section: Catching', function() {
    test.before(function() {    
      teamsPage.goToSection("catching");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2015);
      slaaCol = 7;
    });

    test.describe('#SubSection: Stats', function() {
      // Sorting
      test.describe("#sorting", function() {
        test.it('should be sorted initially by SLAA descending', function() {
          var teamOneSLAA, teamTwoSLAA, teamTenSLAA;

          statsPage.getTeamTableStat(1,slaaCol).then(function(stat) {
            teamOneSLAA = stat;
          });

          statsPage.getTeamTableStat(2,slaaCol).then(function(stat) {
            teamTwoSLAA = stat;
          });
          
          statsPage.getTeamTableStat(10,slaaCol).then(function(stat) {
            teamTenSLAA = stat;
            assert.isAtLeast(teamOneSLAA, teamTwoSLAA, "team one's SLAA is >= team two's SLAA");
            assert.isAtLeast(teamTwoSLAA, teamTenSLAA, "team two's SLAA is >= team ten's SLAA");
          });            
        });
      });

      // Reports
      test.describe("#reports", function() {
        var reports = [
          { type: 'Pitch Types', topStat: "60.0%", statType: "Fast%", colNum: 7 },  
          { type: 'Pitch Type Counts', topStat: 13658, statType: "Fast#", colNum: 7 },  
          { type: 'Catcher Defense', topStat: 10.27, statType: "FldRAA", colNum: 10 },  
          // { type: 'Catcher Opposing Batters', topStat: 1274, statType: "H", colNum: 9 },  // No Data
          { type: 'Catcher Pitch Rates', topStat: "49.2%", statType: "InZoneMdl%", colNum: 8 },  
          { type: 'Catcher Pitch Counts', topStat: 351, statType: "StrkFrmd", colNum: 12 }
        ];
        reports.forEach(function(report) {
          test.it("selecting " + report.type + " shows the correct stat value for " + report.statType, function() {
            statsPage.changeCatchingReport(report.type);  
            statsPage.getTeamTableStat(1,report.colNum).then(function(stat) {
              assert.equal(stat, report.topStat);
            });
          });
        });        
      });
    });
  });

  test.describe('#Section: Statcast Fielding', function() {
    test.before(function() {    
      teamsPage.goToSection("statcastFielding");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2015);
      statCol = 10;
    });    

    test.describe('#SubSection: Stats', function() {
      // Sorting
      test.describe("#sorting", function() {
        test.it('should be sorted initially by OFWAirOut% descending', function() {
          var teamOne, teamTwo, teamTen;
 
          statsPage.getTeamTableStat(1,statCol).then(function(stat) {
            teamOne = stat;
          });

          statsPage.getTeamTableStat(2,statCol).then(function(stat) {
            teamTwo = stat;
          });

          statsPage.getTeamTableStat(10,statCol).then(function(stat) {
            teamTen = stat;
            assert.isAtLeast(teamOne, teamTwo, "team one's OFWAirOut% is >= team two's OFWAirOut%");
            assert.isAtLeast(teamTwo, teamTen, "team two's OFWAirOut% is >= team ten's OFWAirOut%");
          });            
        });
      });

      // Reports
      test.describe("#reports", function() {
        var reports = [
          { type: 'Outfielder Air Defense Positioning', topStat: '104.2%', statType: "OFWPosAirOut%", colNum: 7 },  
          { type: 'Outfielder Air Defense Skills', topStat: "65.1%", statType: "OFAirOut%", colNum: 7 },  
          { type: 'Outfield Batter Positioning', topStat: ">99.9%", statType: "OFWPosAirOut%", colNum: 7 } 
        ];
        reports.forEach(function(report) {
          test.it("selecting " + report.type + " shows the correct stat value for " + report.statType, function() {
            statsPage.changeStatcastFieldingReport(report.type);  
            statsPage.getTeamTableStat(1,report.colNum).then(function(stat) {
              assert.equal(stat, report.topStat);
            });
          });
        });        
      });
    });
  });
});