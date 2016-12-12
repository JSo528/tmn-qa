var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var extensions = require('../../../lib/extensions.js');

// Page Objects
var Navbar = require('../../../pages/mlb/navbar.js');
var Filters = require('../../../pages/mlb/filters.js');
var TeamsPage = require('../../../pages/mlb/teams/teams_page.js');
var navbar, filters, teamsPage, teamsPage, extensions;
var battingAverageCol, winsCol, eraCol, ksCol, slaaCol, statCol;

test.describe('#Teams Page', function() {
  test.before(function() {  
    navbar  = new Navbar(driver);  
    filters  = new Filters(driver);  
    teamsPage = new TeamsPage(driver);
    navbar.toggleLockFiltersCheckbox(false);
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
          teamsPage.getTeamTableStat(1,battingAverageCol).then(function(stat) {
            teamOneBA = stat;
          });

          teamsPage.getTeamTableStat(2,battingAverageCol).then(function(stat) {
            teamTwoBA = stat;
          });

          teamsPage.getTeamTableStat(10,battingAverageCol).then(function(stat) {
            teamTenBA = stat;

            assert.isAtLeast(teamOneBA, teamTwoBA, "team 1's BA is >= team 2's BA");
            assert.isAtLeast(teamTwoBA, teamTenBA, "team 2's BA is >= team 10's BA");
          });            
        });

        test.it('clicking on the BA column header should reverse the sort', function() {
          var teamOneBA, teamTwoBA, teamTenBA;
          teamsPage.clickTeamTableColumnHeader(battingAverageCol);
          teamsPage.getTeamTableStat(1,battingAverageCol).then(function(stat) {
            teamOneBA = stat;
          });

          teamsPage.getTeamTableStat(2,battingAverageCol).then(function(stat) {
            teamTwoBA = stat;
          });

          teamsPage.getTeamTableStat(10,battingAverageCol).then(function(stat) {
            teamTenBA = stat;
            assert.isAtMost(teamOneBA, teamTwoBA, "team 1's BA is <= team 2's BA");
            assert.isAtMost(teamTwoBA, teamTenBA, "team 2's BA is <= team 10's BA");
          });
        });

        test.it('clicking on the W column header should sort the table by Wins', function() {
          var teamOneWs, teamTwoWs, teamTenWs;
          teamsPage.clickTeamTableColumnHeader(winsCol);
          teamsPage.getTeamTableStat(1,winsCol).then(function(stat) {
            teamOneWs = stat;
          });

          teamsPage.getTeamTableStat(2,winsCol).then(function(stat) {
            teamTwoWs = stat;
          });

          teamsPage.getTeamTableStat(10,winsCol).then(function(stat) {
            teamTenWs = stat;
            assert.isAtLeast(teamOneWs, teamTwoWs, "team 1's Wins is >= team 2's Wins");
            assert.isAtLeast(teamTwoWs, teamTenWs, "team 2's Wins is >= team 10's Wins");
          });
        });  

        test.after(function() {
          teamsPage.clickTeamTableColumnHeader(battingAverageCol);
        });        
      });

      // Video Playlist
      test.describe('#VideoPlaylist', function() {     
        test.it('clicking on a team stat opens the play by play modal', function() {
          teamsPage.clickTeamTableStat(1, 10);
          teamsPage.getMatchupsAtBatHeaderText(1).then(function(text) {
            assert.equal(text, 'Vs RHP F. Montas (CWS), Top 1, 0 Out');
          });
        });

        test.it('clicking into video opens correct video', function() {
          teamsPage.clickPitchVideoIcon(2);
          teamsPage.getVideoPlaylistText(1,1).then(function(text) {
            assert.equal(text, "Top 1, 0 out");
          });

          teamsPage.getVideoPlaylistText(1,3).then(function(text) {
            assert.equal(text, "0-2 Fastball 99.9587 MPH - Single on a Line Drive");
          });          
        }); 

        test.after(function() {
          teamsPage.closeVideoPlaylistModal();
          teamsPage.closePlayByPlaytModal();
        });
      });

      // Filters
      test.describe("#filters", function() {
        test.it('adding filter: (pitch type - fastball) from dropdown displays correct data', function() {
          filters.addDropdownFilter('Pitch Type: Fastball');

          teamsPage.getTeamTableStat(1,11).then(function(battingAverage) {
            assert.equal(battingAverage, 0.316);
          });
        });

        test.it('adding filter: (2 outs) from sidebar displays correct data', function() {
          filters.toggleSidebarFilter('Outs:', 2, true);

          teamsPage.getTeamTableStat(1,11).then(function(battingAverage) {
            assert.equal(battingAverage, 0.338);
          });
        });

        test.after(function() {
          filters.closeDropdownFilter('Outs:');
          filters.toggleSidebarFilter("Pitch Type:", 'Fastball', false);
        });
      });  

      // Pinning
      test.describe("#pinning", function() {
        test.it('clicking the pin icon for the Red Sox should add them to the pinned table', function() {
          var teamName;
          teamsPage.getTeamTableStat(1,3).then(function(team) {
            teamName = team;
          });

          teamsPage.clickTablePin(1);

          teamsPage.getIsoTableStat(1,3).then(function(team) {
            assert.equal(team, teamName);
          });
        });

        test.after(function() {
          teamsPage.clearTablePins();
        });
      });

      // (temporary)
      // TODO - remove after push
      test.describe('#ISO Mode', function() {
        test.it('selecting LA from search should add team to table', function() {
          teamsPage.clickIsoBtn("on");
          teamsPage.addToIsoTable('LA', 2);
          teamsPage.getTeamTableStat(1,3).then(function(stat) {
            assert.equal(stat, ' LAD', '1st row team name');
          });
        });

        test.after(function() {
          teamsPage.clickIsoBtn("off");
          teamsPage.clearTablePins();
        });
      });
      
      // Isolation Mode
      test.describe("#isolation mode", function() {
        test.it('selecting LA Dodgers from search should add team to table', function() {
          teamsPage.clickIsoBtn("on");
          teamsPage.addToIsoTable('LA Dodgers', 1)
          // the ISO table doesn't actually show when ISO mode is on
          // instead what's happening is that the main table's data is replaced
          // when ISO mode is off, both tables show
          teamsPage.getTeamTableStat(1,3).then(function(stat) {
            assert.equal(stat, ' LAD', '1st row team name');
          })
        });      

  
        test.it('selecting SF Giants from search should add team to table', function() {
          teamsPage.addToIsoTable('Giants', 1)
          teamsPage.getTeamTableStat(1,3).then(function(stat) {
            assert.equal(stat, ' SF', '1st row team name');
          });

          teamsPage.getTeamTableStat(2,3).then(function(stat) {
            assert.equal(stat, ' LAD', '2n row team name');
          });
        });         

        test.it('pinned total should show the correct sum', function() {
          teamsPage.getPinnedTotalTableStat(5).then(function(wins) {
            assert.equal(wins, 176, 'pinned total - wins');
          });

          teamsPage.getPinnedTotalTableStat(11).then(function(ba) {
            assert.equal(ba, 0.259, 'pinned total - ba');
          });
        });                                       

        test.it('turning off isolation mode should show teams in iso table', function() {
          teamsPage.clickIsoBtn("off");
          teamsPage.getIsoTableStat(1,3).then(function(stat) {
            assert.equal(stat, ' SF', '1st row team name');
          });

          teamsPage.getIsoTableStat(2,3).then(function(stat) {
            assert.equal(stat, ' LAD', '2n row team name');
          });
        });                                               
      });

      // Chart/Edit Columns
      test.describe("#chart/edit columns", function() {
        // histograms
        test.it('clicking show histogram link should open histogram modal', function() {
          teamsPage.clickChartColumnsBtn()
          
          teamsPage.openHistogram(14);  
          teamsPage.isModalDisplayed().then(function(isDisplayed) {
            assert.equal(isDisplayed, true);
          });
        });  

        test.it('hovering over bar should show stats for teams', function() {
          teamsPage.hoverOverHistogramStack(1)
          teamsPage.getTooltipText().then(function(text) {
            assert.equal(text, 'MIA: .694\nCWS: .686\nSD: .686\nPHI: .684\nATL: .674', 'tooltip for 1st bar');
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
            // 1 original bar and 4 new bars will have height=0 and will appear invisible
            assert.equal(count, 12, '# of bars on histogram');
          });
        });

        test.it("changing Bin Count should update the histogram", function() {
          teamsPage.changeHistogramBinCount(3);
          teamsPage.getHistogramBarCount().then(function(count) {
            // 1 original bar and 4 new bars will have height=0 and will appear invisible
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

        test.after(function() {
          teamsPage.clearTablePins();
        });   
      });

      // Group By
      test.describe("#group by", function() {
        test.it('selecting "By Season" shows the correct headers', function() {
          teamsPage.changeGroupBy("By Season");
          teamsPage.getTeamTableHeader(4).then(function(header) {
            assert.equal(header, "Season");
          });
        });

        test.it('selecting "By Game" shows the correct headers', function() {
          teamsPage.changeGroupBy("By Game");
          teamsPage.getTeamTableHeader(4).then(function(header) {
            assert.equal(header, "Opponent");
          });          
        });        

        test.it('selecting "By Year" shows the correct headers', function() {
          teamsPage.changeGroupBy("By Org");
          teamsPage.getTeamTableHeader(4).then(function(header) {
            assert.equal(header, "G");
          });                    
        });  

        test.after(function() {
          teamsPage.changeGroupBy("Totals");
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
            teamsPage.changeStatsView(statView.type);  
            teamsPage.getTeamTableStat(1,11).then(function(stat) {
              assert.equal(stat, statView.topStat);
            });
          });

          if (statView.color) {
            test.it("selecting " + statView.type + " shows the top value the right color", function() {
              teamsPage.getTeamTableBgColor(1,11).then(function(color) {
                assert.equal(color, topColor);
              });
            });
          }
        });

        test.after(function() {
          teamsPage.changeStatsView('Stats');
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
            teamsPage.changeReport(report.type);  
            teamsPage.getTeamTableStat(1,report.colNum).then(function(stat) {
              assert.equal(stat, report.topStat);
            });
          });
        });

        test.after(function() {
          teamsPage.changeReport('Rate');  
        });        
      });
    });

    test.describe('#SubSection: Occurrences & Streaks', function() {
      test.it('clicking the occurences & streaks link goes to the correct URL', function() {
        teamsPage.goToSubSection('occurrencesAndStreaks');
        filters.removeSelectionFromDropdownFilter("Seasons:");
        filters.addSelectionToDropdownFilter("Seasons:", 2015);
        
        driver.getCurrentUrl().then(function(url) {
          assert.match(url, /teams\-streaks\-batting/);
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
          assert.equal(header, "StartSeason");
        });        

        teamsPage.getStreaksTableHeader(4).then(function(header) {
          assert.equal(header, "EndSeason");
        });        

        teamsPage.getStreaksTableHeader(5).then(function(header) {
          assert.equal(header, "H");
        });        
      });    

      test.it('changing the main constraint should update the table headers', function() {
        teamsPage.changeMainConstraint("Streaks Of", "At Least", 1, "2B (Batting)", "In a Inning", "Within a Season");
        teamsPage.getStreaksTableHeader(3).then(function(header) {
          assert.equal(header, "StartDate");
        });

        teamsPage.getStreaksTableHeader(4).then(function(header) {
          assert.equal(header, "EndDate");
        });

        teamsPage.getStreaksTableHeader(5).then(function(header) {
          assert.equal(header, "2B");
        });
      });

      test.it('changing the main constraint should update the table stats', function() {
        teamsPage.getStreaksTableStat(1,1).then(function(count) {
          assert.equal(count, 6);
        });

        teamsPage.getStreaksTableStat(1,2).then(function(team) {
          assert.equal(team, " BOS");
        });

        teamsPage.getStreaksTableStat(1,5).then(function(statType) {
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

      test.it('clicking the scatter_plot link goes to the correct URL', function() {
        teamsPage.goToSubSection('scatterPlot');
        driver.getCurrentUrl().then(function(url) {
          assert.match(url, /teams\-scatter\-plot\-batting/);
        });
      });

      test.it('table should be populated on load', function() {
        teamsPage.getScatterPlotTableStat(1,2).then(function(stat) {
          assert.isNotNull(stat);
        });
      });  

      test.it('scatter plot should show 30 teams on load', function() {
        teamsPage.getPlotLogoIconCount().then(function(count) {
          assert.equal(count, 30);
        });
      });  

      test.it('changing the x-axis stat should update the table', function() {
        teamsPage.changeXStat('AVG');
        teamsPage.getScatterPlotTableHeader(3).then(function(header) {
          assert.equal(header, 'AVG');
        });
      });  

      test.it('changing the y-axis stat should update the table', function() {
        teamsPage.changeYStat('R/G');
        teamsPage.getScatterPlotTableHeader(4).then(function(header) {
          assert.equal(header, 'R/G');
        });      
      });        

      test.it('adding a global filter should update the table', function() {
        var originalAdjRuns;
        teamsPage.getScatterPlotTableStat(1,4).then(function(runs) {
          originalAdjRuns = runs;
        });
        
        teamsPage.addGlobalFilter('Pitch Type: Fastball');
        teamsPage.getScatterPlotTableStat(1,4).then(function(newAdjRuns) {
          assert.notEqual(newAdjRuns, originalAdjRuns);
        });            
      });        

      test.it('adding a x-axis filter should update the table', function() {
        teamsPage.openXAxisFilterContainer();
        var originalOBP;
        teamsPage.getScatterPlotTableStat(1,3).then(function(obp) {
          originalOBP = obp;
        });
        
        teamsPage.addXFilter('count: 3-0');
        teamsPage.getScatterPlotTableStat(1,3).then(function(newOBP) {
          assert.notEqual(newOBP, originalOBP);
        });           
      });              

      test.it('adding a y-axis filter should update the table', function() {
        teamsPage.openYAxisFilterContainer();
        var originalAdjRuns;
        teamsPage.getScatterPlotTableStat(1,4).then(function(runs) {
          originalAdjRuns = runs;
        });
        
        teamsPage.addYFilter('Venue: Home');
        teamsPage.getScatterPlotTableStat(1,4).then(function(newAdjRuns) {
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
      teamsPage.goToSubSection('stats');
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

          teamsPage.getTeamTableStat(1,eraCol).then(function(stat) {
            teamOneERA = stat;
          });

          teamsPage.getTeamTableStat(2,eraCol).then(function(stat) {
            teamTwoERA = stat;
          });

          teamsPage.getTeamTableStat(10,eraCol).then(function(stat) {
            teamTenERA = stat;
            assert.isAtMost(teamOneERA, teamTwoERA, "team one's ERA is <= team two's ERA");
            assert.isAtMost(teamTwoERA, teamTenERA, "team two's ERA is <= team ten's ERA");
          });                        
        });

        test.it('clicking on the ERA column header should reverse the sort', function() {
          var teamOneERA, teamTwoERA, teamTenERA;
          teamsPage.clickTeamTableColumnHeader(eraCol);

          
          teamsPage.getTeamTableStat(1,eraCol).then(function(stat) {
            teamOneERA = stat;
          });

          teamsPage.getTeamTableStat(2,eraCol).then(function(stat) {
            teamTwoERA = stat;
          });
          
          teamsPage.getTeamTableStat(10,eraCol).then(function(stat) {
            teamTenERA = stat;
            assert.isAtLeast(teamOneERA, teamTwoERA, "team one's ERA is >= team two's ERA");
            assert.isAtLeast(teamTwoERA, teamTenERA, "team two's ERA is >= team ten's ERA");
          });            
        });

        test.it('clicking on the K column header should sort the table by Ks', function() {
          var teamOneKs, teamTwoKs, teamTenKs;
          teamsPage.clickTeamTableColumnHeader(ksCol);

          teamsPage.getTeamTableStat(1,ksCol).then(function(stat) {
            teamOneKs = stat;
          });

          teamsPage.getTeamTableStat(2,ksCol).then(function(stat) {
            teamTwoKs = stat;
          });

          teamsPage.getTeamTableStat(10,ksCol).then(function(stat) {
            teamTenKs = stat;
            assert.isAtLeast(teamOneKs, teamTwoKs, "team one's Ks is >= team two's Ks");
            assert.isAtLeast(teamTwoKs, teamTenKs, "team two's Ks is >= team ten's Ks");
          });            
        });  

        test.after(function() {
          teamsPage.clickTeamTableColumnHeader(eraCol);
        });        
      });

      // Video Playlist
      test.describe('#VideoPlaylist', function() {     
        test.it('clicking on a team stat opens the play by play modal', function() {
          teamsPage.clickTeamTableStat(1, 20);
          teamsPage.getMatchupsAtBatHeaderText(1).then(function(text) {
            assert.equal(text, 'Vs RHB A. Garcia (ATL), Bot 4, 0 Out');
          });
        });

        test.it('selecting "Play All" videos adds 5 videos to playlist', function() {
          teamsPage.selectFromPlayVideosDropdown("Play Top 5");
          teamsPage.getVideoPlaylistCount().then(function(videoCount) {
            assert.equal(videoCount, 5, '# videos on playlist');
          });
        }); 

        test.after(function() {
          teamsPage.closeVideoPlaylistModal();
          teamsPage.closePlayByPlaytModal();
        });
      });

      // Filters
      test.describe("#filters", function() {
        test.before(function() {
          teamsPage.clickTeamTableColumnHeader(ksCol);
        });

        test.it('adding filter: (venue - home) from dropdown displays correct data', function() {
          filters.addDropdownFilter('Venue: Home');

          teamsPage.getTeamTableStat(1,ksCol).then(function(ks) {
            assert.equal(ks, 748);
          });
        });

        test.it('adding filter: (Pitch Type: Splitter) from sidebar displays correct data', function() {
          filters.toggleSidebarFilter('Pitch Type:', 'Splitter', true);

          teamsPage.getTeamTableStat(1,ksCol).then(function(ks) {
            assert.equal(ks, 59);
          });
        });

        test.it('adding filter: (Pitch Type: Changeup) from top section displays correct data', function() {
          filters.toggleSidebarFilter('Pitcher Hand:', 'Lefty', true);
          teamsPage.getTeamTableStat(1,ksCol).then(function(ks) {
            assert.equal(ks, 17);
          });
        }); 

        test.it('adding filter: (Men On: Men On) from sidebar displays correct data', function() {
          filters.toggleSidebarFilter("Men On:", 'Men On', true);
          teamsPage.getTeamTableStat(1,ksCol).then(function(ks) {
            assert.equal(ks, 6);
          });
        });

        test.after(function() {
          filters.closeDropdownFilter('Pitch Type:');
          filters.closeDropdownFilter('Venue:');
          filters.closeDropdownFilter('Pitcher Hand:');
          filters.closeDropdownFilter('Men On:');
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
            teamsPage.changeReport(report.type);  
            teamsPage.getTeamTableStat(1,report.colNum).then(function(stat) {
              assert.equal(stat, report.topStat);
            });
          });
        });        
      });
    });
  });

  test.describe('#Section: Catching', function() {
    test.before(function() {    
      teamsPage.goToSubSection('stats');
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

          teamsPage.getTeamTableStat(1,slaaCol).then(function(stat) {
            teamOneSLAA = stat;
          });

          teamsPage.getTeamTableStat(2,slaaCol).then(function(stat) {
            teamTwoSLAA = stat;
          });
          
          teamsPage.getTeamTableStat(10,slaaCol).then(function(stat) {
            teamTenSLAA = stat;
            assert.isAtLeast(teamOneSLAA, teamTwoSLAA, "team one's SLAA is >= team two's SLAA");
            assert.isAtLeast(teamTwoSLAA, teamTenSLAA, "team two's SLAA is >= team ten's SLAA");
          });            
        });
      });

      // Filters
      test.describe("#filters", function() {
        test.it('adding filter: (Men On: 1 On) from sidebar displays correct data', function() {
          filters.toggleSidebarFilter('Men On:', '1 On', true);

          teamsPage.getTeamTableStat(1,7).then(function(slaa) {
            assert.equal(slaa, 49.73, 'SD SLAA');
          });
        });

        test.it('adding filter: (Men On: 2 On) from sidebar displays correct data', function() {
          filters.toggleSidebarFilter('Men On:', '2 On', true);

          teamsPage.getTeamTableStat(1,7).then(function(slaa) {
            assert.equal(slaa, 92.30, 'PIT SLAA');
          });
        });        

        test.it('adding filter: (Pitch Type: Slider) from sidebar displays correct data', function() {
          filters.toggleSidebarFilter('Pitch Type:', 'Slider', true);

          teamsPage.getTeamTableStat(1,7).then(function(slaa) {
            assert.equal(slaa, 13.74, 'SD SLAA');
          });
        });        

        test.it('adding filter: (Pitch Type: Sinker) from sidebar displays correct data', function() {
          filters.toggleSidebarFilter('Pitch Type:', 'Sinker', true);

          teamsPage.getTeamTableStat(1,7).then(function(slaa) {
            assert.equal(slaa, 26.17, 'SD SLAA');
          });
        }); 

        test.it('adding filter: (Vertical Location: Upper Third) from sidebar displays correct data', function() {
          filters.toggleSidebarFilter('Vertical Location:', 'Upper Third', true);

          teamsPage.getTeamTableStat(1,7).then(function(slaa) {
            assert.equal(slaa, 12.53, 'SD SLAA');
          });
        }); 

        test.it('adding filter: (Vertical Location: Middle Third) from sidebar displays correct data', function() {
          filters.toggleSidebarFilter('Vertical Location:', 'Middle Third', true);

          teamsPage.getTeamTableStat(1,7).then(function(slaa) {
            assert.equal(slaa, 20.64, 'SD SLAA');
          });
        }); 

        test.it('clicking "default filters" returns filters back to default state', function() {
          filters.clickDefaultFiltersBtn();

          teamsPage.getTeamTableStat(1,7).then(function(slaa) {
            assert.equal(slaa, 373.42, 'LA Dodgers SLAA');
          });
        });

        // TODO - remove once above bug is fixed
        test.after(function() {
          filters.toggleSidebarFilter('Season Level:', 'MLB', true);
        });
      });

      // Reports
      test.describe("#reports", function() {
        var reports = [
          { type: 'Pitch Types', topStat: "58.2%", statType: "Fast%", colNum: 7 },  
          { type: 'Pitch Type Counts', topStat: 13841, statType: "Fast#", colNum: 7 },  
          { type: 'Catcher Defense', topStat: 7.21, statType: "FldRAA", colNum: 10 },  
          // { type: 'Catcher Opposing Batters', topStat: 1274, statType: "H", colNum: 9 },  // No Data
          { type: 'Catcher Pitch Rates', topStat: "48.2%", statType: "InZoneMdl%", colNum: 8 },  
          { type: 'Catcher Pitch Counts', topStat: 326, statType: "StrkFrmd", colNum: 12 }
        ];
        reports.forEach(function(report) {
          test.it("selecting " + report.type + " shows the correct stat value for " + report.statType, function() {
            teamsPage.changeReport(report.type);  
            teamsPage.getTeamTableStat(1,report.colNum).then(function(stat) {
              assert.equal(stat, report.topStat);
            });
          });
        });        
      });
    });
  });

  test.describe('#Section: Statcast Fielding', function() {
    test.before(function() {    
      teamsPage.goToSubSection('stats');
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
 
          teamsPage.getTeamTableStat(1,statCol).then(function(stat) {
            teamOne = extensions.perToNum(stat);
          });

          teamsPage.getTeamTableStat(2,statCol).then(function(stat) {
            teamTwo = extensions.perToNum(stat);
          });

          teamsPage.getTeamTableStat(10,statCol).then(function(stat) {
            teamTen = extensions.perToNum(stat);
            assert.isAtLeast(teamOne, teamTwo, "team one's OFWAirOut% is >= team two's OFWAirOut%");
            assert.isAtLeast(teamTwo, teamTen, "team two's OFWAirOut% is >= team ten's OFWAirOut%");
          });            
        });
      });

      test.describe("#filters", function() {
        test.it('adding filter: (Men On: 1st and 2nd) from sidebar displays correct data', function() {
          filters.toggleSidebarFilter('Men On:', '1st and 2nd', true);

          teamsPage.getTeamTableStat(1,10).then(function(slaa) {
            assert.equal(slaa, "104.9%", 'HOU OFWAirOut%');
          });
        });

        test.it('adding filter: (Men On: 1st and 3rd) from sidebar displays correct data', function() {
          filters.toggleSidebarFilter('Men On:', '1st and 3rd', true);

          teamsPage.getTeamTableStat(1,10).then(function(slaa) {
            assert.equal(slaa, "104.3%", 'ARI OFWAirOut%');
          });
        });    

        test.it('adding filter: (Zone Location: In Strike Zone) from sidebar displays correct data', function() {
          filters.toggleSidebarFilter('Zone Location:', 'In Strike Zone', true);

          teamsPage.getTeamTableStat(1,10).then(function(slaa) {
            assert.equal(slaa, "104.7%", 'ARI OFWAirOut%');
          });
        });   

        test.it('adding filter: (Horizontal Location: Outer Third) from sidebar displays correct data', function() {
          filters.toggleSidebarFilter('Horizontal Location:', 'Outer Third', true);

          teamsPage.getTeamTableStat(1,10).then(function(slaa) {
            assert.equal(slaa, "112.1%", 'HOU OFWAirOut%');
          });
        });

        test.it('adding filter: (Exit Direction: _ to - 10) from sidebar displays correct data', function() {
          filters.changeValuesForRangeSidebarFilter('Exit Direction:', "", -10);

          teamsPage.getTeamTableStat(1,10).then(function(slaa) {
            assert.equal(slaa, "128.1%", 'ARI OFWAirOut%');
          });
        });   

        test.it('adding filter: (Exit Velocity: 90 to _) from sidebar displays correct data', function() {
          filters.changeValuesForRangeSidebarFilter('Exit Velocity:', 90, "");

          teamsPage.getTeamTableStat(1,10).then(function(slaa) {
            assert.equal(slaa, "159.2%", 'ARI OFWAirOut%');
          });
        });           

        test.it('clicking "default filters" returns filters back to default state', function() {
          filters.clickDefaultFiltersBtn();

          teamsPage.getTeamTableStat(1,7).then(function(slaa) {
            assert.equal(slaa, '111.2%', 'KC OFWAirOut%');
          });
        });

        test.after(function() {
          filters.removeSelectionFromDropdownFilter("Seasons:", 2016);
          filters.addSelectionToDropdownFilter("Seasons:", 2015);
          filters.toggleSidebarFilter('Season Level:', 'MLB', true); // TODO - remove this once default btn is fixed
        });
      });

      // Reports
      test.describe("#reports", function() {
        var reports = [
          { type: 'Outfielder Air Defense Positioning', topStat: 556, statType: "OFAirHit%", colNum: 6 },  
          { type: 'Outfielder Air Defense Skills', topStat: 17.25, statType: "OFPkSpd", colNum: 8 },  
          { type: 'Outfield Batter Positioning', topStat: -3.39, statType: "OFPosOutsPM", colNum: 10 },
          { type: 'Infield Ground Ball Defense Range', topStat: '101.7%', statType: "IFGBWOut%", colNum: 11 } 
        ];
        reports.forEach(function(report) {
          test.it("selecting " + report.type + " shows the correct stat value for " + report.statType, function() {
            teamsPage.changeReport(report.type);  
            teamsPage.getTeamTableStat(1,report.colNum).then(function(stat) {
              assert.equal(stat, report.topStat);
            });
          });
        });        
      });
    });
  });
});