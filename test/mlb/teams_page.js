test.describe('#Teams Page', function() {
  test.before(function() {    
    var MlbTeamsPage = require('../../pages/mlb/teams_page.js');
    teamsPage = new MlbTeamsPage(driver);
  });

  test.it('clicking the teams link goes to the correct page', function() {
    navbar.goToTeamsPage();

    driver.getTitle().then(function(title) {
      assert.equal( title, 'Teams Batting', 'Correct title');
    });
  });    

  test.describe('#Section: Batting', function() {
    // Sorting
    test.describe("#sorting", function() {
      test.before(function() {
        battingAverageCol = 11;
        winsCol = 5;
      });

      test.it('should be sorted initially by BA descending', function() {
        var teamOneBA, teamTwoBA, teamTenBA;

        Promise.all([
          teamsPage.getTeamTableStat(1,battingAverageCol).then(function(stat) {
            teamOneBA = stat;
          }),
          teamsPage.getTeamTableStat(2,battingAverageCol).then(function(stat) {
            teamTwoBA = stat;
          }),
          teamsPage.getTeamTableStat(10,battingAverageCol).then(function(stat) {
            teamTenBA = stat;
          })            
        ]).then(function() {
          assert.isAtLeast(teamOneBA, teamTwoBA, "team one's BA is >= team two's BA");
          assert.isAtLeast(teamTwoBA, teamTenBA, "team two's BA is >= team ten's BA");
        });
      });

      test.it('clicking on the BA column header should reverse the sort', function() {
        var teamOneBA, teamTwoBA, teamTenBA;
        teamsPage.clickTeamTableColumnHeader(battingAverageCol);

        Promise.all([
          teamsPage.getTeamTableStat(1,battingAverageCol).then(function(stat) {
            teamOneBA = stat;
          }),
          teamsPage.getTeamTableStat(2,battingAverageCol).then(function(stat) {
            teamTwoBA = stat;
          }),
          teamsPage.getTeamTableStat(10,battingAverageCol).then(function(stat) {
            teamTenBA = stat;
          })            
        ]).then(function() {
          assert.isAtMost(teamOneBA, teamTwoBA, "team one's BA is <= team two's BA");
          assert.isAtMost(teamTwoBA, teamTenBA, "team two's BA is <= team ten's BA");
        });          
      });

      test.it('clicking on the W column header should sort the table by Wins', function() {
        var teamOneBA, teamTwoBA, teamTenBA;
        teamsPage.clickTeamTableColumnHeader(winsCol);

        Promise.all([
          teamsPage.getTeamTableStat(1,winsCol).then(function(stat) {
            teamOneWs = stat;
          }),
          teamsPage.getTeamTableStat(2,winsCol).then(function(stat) {
            teamTwoWs = stat;
          }),
          teamsPage.getTeamTableStat(10,winsCol).then(function(stat) {
            teamTenWs = stat;
          })            
        ]).then(function() {
          assert.isAtMost(teamOneWs, teamTwoWs, "team one's Wins is >= team two's Wins");
          assert.isAtMost(teamTwoWs, teamTenWs, "team two's Wins is >= team ten's Wins");
        });          
      });  

      test.after(function() {
        teamsPage.clickTeamTableColumnHeader(battingAverageCol);
      });        
    });

    // Filters
    test.describe("#filters", function() {
      // TODO - make sure to use a previous year
      test.it('adding filter: (pitch type - fastball) from dropdown displays correct data', function() {
        teamsPage.addDropdownFilter('Pitch Type: Fastball');

        teamsPage.getTeamTableStat(1,11).then(function(battingAverage) {
          assert.equal(battingAverage, 0.306);
        });
      });

      test.it('adding filter: (2 outs) from sidebar displays correct data', function() {
        teamsPage.toggleSidebarFilter('Outs:', 3);

        teamsPage.getTeamTableStat(1,11).then(function(battingAverage) {
          assert.equal(battingAverage, 0.296);
        });
      });

      test.it('removing filter: (2 outs) from top section displays correct data', function() {
        teamsPage.closeDropdownFilter(5);
        teamsPage.getTeamTableStat(1,11).then(function(battingAverage) {
          assert.equal(battingAverage, 0.306);
        });
      }); 

      test.it('removing filter: (pitch type-fastball) from sidebar displays correct data', function() {
        teamsPage.toggleSidebarFilter("Pitch Type:", 8);
        teamsPage.getTeamTableStat(1,11).then(function(battingAverage) {
          assert.equal(battingAverage, 0.282);
        });
      });         
    });  

    // Pinning
    test.describe("#pinning", function() {
      test.it('clicking the pin icon for the Red Sox should add them to the pinned table', function() {
        var teamName;
        teamsPage.getTeamTableStat(1,3).then(function(team) {
          teamName = team;
        });

        teamsPage.clickTeamTablePin(1);

        teamsPage.getIsoTableStat(1,3).then(function(team) {
          assert.equal(team, teamName);
        })
      });
    });

    // Isolation Mode
    // TODO - look into this, its populating the main table and hiding the iso table
    test.describe("#isolation mode", function() {
      test.it('turning on isolation mode should hide teams table', function() {
        teamsPage.clickIsoBtn("on");
      });      

      // BUG - trying to add minor league team doesn't work
      test.it('adding Giants should add team to table', function() {

      });         

      test.it('adding Cubs should add team to table', function() {

      });                   

      test.it('pinned total should show the correct sum', function() {

      });
      
      test.it('removing the Giants should update the table', function() {

      });                                         

      test.it('turning off isolation mode should show full table', function() {
        teamsPage.clickIsoBtn("off");
      });                                                   
    });

    // Chart/Edit Columns
    test.describe("#chart/edit columns", function() {
      // histograms
      test.it('clicking show histogram link should open histogram modal', function() {
        teamsPage.clickChartColumnsBtn();
        teamsPage.clickTeamTableColumnHeader(14);
        teamsPage.clickHistogramLink();

        teamsPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, true);
        }); 
      });  

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
      })   
    });

    // Group By
    test.describe("#group by", function() {
      test.it('selecting "By Season" shows the correct headers', function() {
        teamsPage.changeGroupBy("By Season");
        teamsPage.getTeamTableHeader(4).then(function(header) {
          assert(header, "Season");
        });
      });

      test.it('selecting "By Game" shows the correct headers', function() {
        teamsPage.changeGroupBy("By Game");
        teamsPage.getTeamTableHeader(4).then(function(header) {
          assert(header, "Opponent");
        });          
      });        

      test.it('selecting "By Year" shows the correct headers', function() {
        teamsPage.changeGroupBy("By Org");
        teamsPage.getTeamTableHeader(4).then(function(header) {
          assert(header, "G");
        });                    
      });        
    });

    // Stats View
    test.describe("#stats view", function() {
      test.before(function() {
        // TODO - use filters instead, but go directly to 2015 stats
        driver.get("https://dodgers.trumedianetworks.com/baseball/teams-batting/stats?pc=%7B%22bgb%22%3A%22totals%22%2C%22bsvt%22%3A%22stats%22%7D&is=true&t=%7B%22so%22%3A%22DEFAULT%22%2C%22oc%22%3A%22%5BBA%5D%22%7D&tpin=%7B%22so%22%3A%22DEFAULT%22%2C%22oc%22%3A%22%5BBA%5D%22%7D&f=%7B%22bgt%22%3A%5B%22reg%22%5D%2C%22bseasonlvl%22%3A%5B%22MLB%22%5D%2C%22bseason%22%3A%5B%222015%22%5D%7D");
      })

      // Comparing top BA in 2015 for all the different stat views
      var topColor = "rgba(108, 223, 118, 1)"
      var statViews = [
        { type: 'Stat', topStat: .270 },  
        { type: 'Rank', topStat: 1, color: true },            
        { type: 'Percentile', topStat: "100.0%", color: true },
        { type: 'Z-Score', topStat: 1.941 },
        { type: 'Stat Grade', topStat: 80 },
        { type: 'Stat (Rank)', topStat: ".270 (1)", color: true },
        { type: 'Stat (Percentile)', topStat: ".270 (100%)", color: true },
        { type: 'Stat (Z-Score)', topStat: ".270 (1.94)"},
        { type: 'Stat (Stat Grade)', topStat: ".270 (80)"},
        { type: 'Pct of Team', topStat: ".270"},
      ]
      statViews.forEach(function(statView) {
        test.it("selecting " + statView.type + " shows the correct stat value", function() {
          teamsPage.changeStatsView(statView.type);  
          teamsPage.getTeamTableStat(1,11).then(function(stat) {
            assert(stat, statView.topStat);
          });
        });

        if (statView.color) {
          test.it("selecting " + statView.type + " shows the top value the right color", function() {
            teamsPage.getTeamTableBgColor(1,11).then(function(color) {
              assert(color, topColor);
            });
          });
        }
      });
    });                      

    // Reports
    test.describe("#reports", function() {
      test.before(function() {
        // TODO - use filters instead, but go directly to 2015 stats
        driver.get("https://dodgers.trumedianetworks.com/baseball/teams-batting/stats?pc=%7B%22bgb%22%3A%22totals%22%2C%22bsvt%22%3A%22stats%22%7D&is=true&t=%7B%22so%22%3A%22DEFAULT%22%2C%22oc%22%3A%22%5BBA%5D%22%7D&tpin=%7B%22so%22%3A%22DEFAULT%22%2C%22oc%22%3A%22%5BBA%5D%22%7D&f=%7B%22bgt%22%3A%5B%22reg%22%5D%2C%22bseasonlvl%22%3A%5B%22MLB%22%5D%2C%22bseason%22%3A%5B%222015%22%5D%7D");
      })

      var reports = [
        { type: 'Counting', topStat: 1598, statType: "H", colNum: 12 },  
        { type: 'Pitch Rates', topStat: "47.8%", statType: "InZone%", colNum: 13 },  
        { type: 'Pitch Counts', topStat: 11057, statType: "InZone#", colNum: 12 },  
        { type: 'Pitch Types', topStat: "56.0%", statType: "Fast%", colNum: 7 },  
        { type: 'Pitch Type Counts', topStat: 13415, statType: "Fast#", colNum: 7 },  
        { type: 'Pitch Locations', topStat: "47.8%", statType: "InZone%", colNum: 7 },  
        { type: 'Pitch Calls', topStat: -341.65, statType: "SLAA", colNum: 7 },  
        { type: 'Hit Types', topStat: 0.71, statType: "GB/FB", colNum: 6 },  
        { type: 'Hit Locations', topStat: 0.71, statType: "GB/FB", colNum: 6 },  
        { type: 'Hit Types', topStat: 0.71, statType: "GB/FB", colNum: 6 },  
        { type: 'Hit Locations', topStat: "46.0%", statType: "HPull%", colNum: 9 },  
        { type: 'Home Runs', topStat: 253, statType: "HR", colNum: 7 },  
        { type: 'Exit Data', topStat: .463, statType: "ExSLG%", colNum: 11 }
      ]
      reports.forEach(function(report) {
        test.it("selecting " + report.type + " shows the correct stat value for " + report.statType, function() {
          teamsPage.changeReport(report.type);  
          teamsPage.getTeamTableStat(1,report.colNum).then(function(stat) {
            assert(stat, report.topStat);
          });
        });
      });        
    });
  });
});