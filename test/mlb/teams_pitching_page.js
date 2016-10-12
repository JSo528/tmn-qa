test.describe('#Teams Page', function() {
  test.before(function() {    
    var MlbTeamsPage = require('../../pages/mlb/teams_page.js');
    teamsPage = new MlbTeamsPage(driver);
    var StatsPage = require('../../pages/mlb/teams/stats_page.js');
    statsPage = new StatsPage(driver);

    navbar.goToTeamsPage();
    teamsPage.goToSection("Pitching");
    
    eraCol = 21;
    ksCol = 19;
  });

  test.describe('#Section: Pitching', function() {
    test.describe('#SubSection: Stats', function() {
      // Sorting
      test.describe.skip("#sorting", function() {
        test.it('should be sorted initially by ERA descending', function() {
          var teamOneERA, teamTwoERA, teamTenERA;

          Promise.all([
            statsPage.getTeamTableStat(1,eraCol).then(function(stat) {
              teamOneERA = stat;
            }),
            statsPage.getTeamTableStat(2,eraCol).then(function(stat) {
              teamTwoERA = stat;
            }),
            statsPage.getTeamTableStat(10,eraCol).then(function(stat) {
              teamTenERA = stat;
            })            
          ]).then(function() {
            assert.isAtLeast(teamOneERA, teamTwoERA, "team one's ERA is <= team two's ERA");
            assert.isAtLeast(teamTwoERA, teamTenERA, "team two's ERA is <= team ten's ERA");
          });
        });

        test.it('clicking on the ERA column header should reverse the sort', function() {
          var teamOneERA, teamTwoERA, teamTenERA;
          statsPage.clickTeamTableColumnHeader(eraCol);

          Promise.all([
            statsPage.getTeamTableStat(1,eraCol).then(function(stat) {
              teamOneERA = stat;
            }),
            statsPage.getTeamTableStat(2,eraCol).then(function(stat) {
              teamTwoERA = stat;
            }),
            statsPage.getTeamTableStat(10,eraCol).then(function(stat) {
              teamTenERA = stat;
            })            
          ]).then(function() {
            assert.isAtMost(teamOneERA, teamTwoERA, "team one's ERA is >= team two's ERA");
            assert.isAtMost(teamTwoERA, teamTenERA, "team two's ERA is >= team ten's ERA");
          });          
        });

        test.it('clicking on the W column header should sort the table by Wins', function() {
          var teamOneKs, teamTwoKs, teamTenKs;
          statsPage.clickTeamTableColumnHeader(ksCol);

          Promise.all([
            statsPage.getTeamTableStat(1,ksCol).then(function(stat) {
              teamOneKs = stat;
            }),
            statsPage.getTeamTableStat(2,ksCol).then(function(stat) {
              teamTwoKs = stat;
            }),
            statsPage.getTeamTableStat(10,ksCol).then(function(stat) {
              teamTenKs = stat;
            })            
          ]).then(function() {
            assert.isAtMost(teamOneKs, teamTwoKs, "team one's Ks is >= team two's Ks");
            assert.isAtMost(teamTwoKs, teamTenKs, "team two's Ks is >= team ten's Ks");
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

        // TODO - make sure to use a previous year
        test.it('adding filter: (venue - home) from dropdown displays correct data', function() {
          statsPage.addDropdownFilter('Venue: Home');

          statsPage.getTeamTableStat(1,ksCol).then(function(ks) {
            assert.equal(ks, 786);
          });
        });

        test.it('adding filter: (Pitch Type: Changeup) from sidebar displays correct data', function() {
          statsPage.toggleSidebarFilter('Pitch Type:', 3);

          statsPage.getTeamTableStat(1,ksCol).then(function(ks) {
            assert.equal(ks, 118);
          });
        });

        test.it('removing filter: (Pitch Type: Changeup) from top section displays correct data', function() {
          statsPage.closeDropdownFilter(5);
          statsPage.getTeamTableStat(1,ksCol).then(function(ks) {
            assert.equal(ks, 786);
          });
        }); 

        test.it('removing filter: (venue - home) from sidebar displays correct data', function() {
          statsPage.toggleSidebarFilter("Venue:", 1);
          statsPage.getTeamTableStat(1,ksCol).then(function(ks) {
            assert.equal(ks, 1510);
          });
        });         
      });  

      // Reports
      test.describe("#reports", function() {
        test.before(function() {
          // Changes the season to 2015
          // TODO - more robust solution since thise will break in future years
          statsPage.toggleSidebarFilter("Seasons:", 7);
          statsPage.toggleSidebarFilter("Seasons:", 8);
        })

        var reports = [
          { type: 'Rate', topStat: .233, statType: "BA", colNum: 9 },  
          { type: 'Counting', topStat: 1274, statType: "H", colNum: 9 },  
          { type: 'Pitch Rates', topStat: "52.5%", statType: "InZone%", colNum: 13 },  
          { type: 'Pitch Counts', topStat: 12393, statType: "InZone#", colNum: 12 },  
          { type: 'Pitch Types', topStat: "60.0%", statType: "Fast%", colNum: 7 },  
          { type: 'Pitch Type Counts', topStat: 13657, statType: "Fast#", colNum: 7 },  
          { type: 'Pitch Locations', topStat: "52.5%", statType: "InZone%", colNum: 7 },  
          { type: 'Pitch Calls', topStat: 336.90, statType: "SLAA", colNum: 7 },  
          { type: 'Hit Types', topStat: 1.10, statType: "GB/FB", colNum: 6 },  
          { type: 'Hit Locations', topStat: "43.4%", statType: "HPull%", colNum: 10 },  
          { type: 'Home Runs', topStat: 110, statType: "HR", colNum: 7 },  
          { type: 'Movement', topStat: 90.3, statType: "Vel", colNum: 7 },  
          { type: 'Bids', topStat: 2, statType: "NH", colNum: 8 },  
          { type: 'Baserunning', topStat: "60.4%", statType: "SB%", colNum: 8 },  
          { type: 'Exit Data', topStat: .367, statType: "ExSLG%", colNum: 11 }
        ]
        reports.forEach(function(report) {
          test.it("selecting " + report.type + " shows the correct stat value for " + report.statType, function() {
            statsPage.changePitchingReport(report.type);  
            statsPage.getTeamTableStat(1,report.colNum).then(function(stat) {
              assert(stat, report.topStat);
            });
          });
        });        
      });
    });
  });
});