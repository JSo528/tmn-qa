test.describe('#Teams Page', function() {
  test.before(function() {    
    var MlbTeamsPage = require('../../pages/mlb/teams_page.js');
    teamsPage = new MlbTeamsPage(driver);
    var StatsPage = require('../../pages/mlb/teams/stats_page.js');
    statsPage = new StatsPage(driver);

    navbar.goToTeamsPage();
    teamsPage.goToSection("Statcast Fielding");
    
    statCol = 10;
  });

  test.describe('#Section: Statcast Fielding', function() {
    test.describe('#SubSection: Stats', function() {
      // Sorting
      test.describe("#sorting", function() {
        test.it('should be sorted initially by OFWAirOut% descending', function() {
          var teamOne, teamTwo, teamTen;

          Promise.all([
            statsPage.getTeamTableStat(1,statCol).then(function(stat) {
              teamOne = stat;
            }),
            statsPage.getTeamTableStat(2,statCol).then(function(stat) {
              teamTwo = stat;
            }),
            statsPage.getTeamTableStat(10,statCol).then(function(stat) {
              teamTen = stat;
            })            
          ]).then(function() {
            assert.isAtLeast(teamOne, teamTwo, "team one's OFWAirOut% is >= team two's OFWAirOut%");
            assert.isAtLeast(teamTwo, teamTen, "team two's OFWAirOut% is >= team ten's OFWAirOut%");
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
          { type: 'Outfielder Air Defense Positioning', topStat: 104.2, statType: "OFWPosAirOut%", colNum: 7 },  
          { type: 'Outfielder Air Defense Skills', topStat: "65.1%", statType: "OFAirOut%", colNum: 7 },  
          { type: 'Outfield Batter Positioning', topStat: ">99.9%", statType: "OFWPosAirOut%", colNum: 7 } 
        ]
        reports.forEach(function(report) {
          test.it("selecting " + report.type + " shows the correct stat value for " + report.statType, function() {
            statsPage.changeStatcastFieldingReport(report.type);  
            statsPage.getTeamTableStat(1,report.colNum).then(function(stat) {
              assert(stat, report.topStat);
            });
          });
        });        
      });
    });
  });
});