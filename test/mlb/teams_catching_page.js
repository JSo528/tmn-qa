test.describe('#Teams Page', function() {
  test.before(function() {    
    var MlbTeamsPage = require('../../pages/mlb/teams_page.js');
    teamsPage = new MlbTeamsPage(driver);
    var StatsPage = require('../../pages/mlb/teams/stats_page.js');
    statsPage = new StatsPage(driver);

    navbar.goToTeamsPage();
    teamsPage.goToSection("Catching");
    
    slaaCol = 7;
  });

  test.describe('#Section: Catching', function() {
    test.describe('#SubSection: Stats', function() {
      // Sorting
      test.describe("#sorting", function() {
        test.it('should be sorted initially by SLAA descending', function() {
          var teamOneSLAA, teamTwoSLAA, teamTenSLAA;

          Promise.all([
            statsPage.getTeamTableStat(1,slaaCol).then(function(stat) {
              teamOneSLAA = stat;
            }),
            statsPage.getTeamTableStat(2,slaaCol).then(function(stat) {
              teamTwoSLAA = stat;
            }),
            statsPage.getTeamTableStat(10,slaaCol).then(function(stat) {
              teamTenSLAA = stat;
            })            
          ]).then(function() {
            assert.isAtLeast(teamOneSLAA, teamTwoSLAA, "team one's SLAA is >= team two's SLAA");
            assert.isAtLeast(teamTwoSLAA, teamTenSLAA, "team two's SLAA is >= team ten's SLAA");
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
          { type: 'Pitch Types', topStat: "60.0%", statType: "Fast%", colNum: 7 },  
          { type: 'Pitch Type Counts', topStat: 13657, statType: "Fast#", colNum: 7 },  
          { type: 'Catcher Defense', topStat: 10.27, statType: "FldRAA", colNum: 10 },  
          // { type: 'Catcher Opposing Batters', topStat: 1274, statType: "H", colNum: 9 },  // No Data
          { type: 'Catcher Pitch Rates', topStat: "49.2%", statType: "InZoneMdl%", colNum: 8 },  
          { type: 'Catcher Pitch Counts', topStat: 351, statType: "StrkFrmd", colNum: 12 }
        ]
        reports.forEach(function(report) {
          test.it("selecting " + report.type + " shows the correct stat value for " + report.statType, function() {
            statsPage.changeCatchingReport(report.type);  
            statsPage.getTeamTableStat(1,report.colNum).then(function(stat) {
              assert(stat, report.topStat);
            });
          });
        });        
      });
    });
  });
});