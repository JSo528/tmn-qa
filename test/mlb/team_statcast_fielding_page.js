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
var TeamPage = require('../../pages/mlb/team/team_page.js');
var OverviewPage = require('../../pages/mlb/team/overview_page.js');
var RosterPage = require('../../pages/mlb/team/roster_page.js');
var PitchLogPage = require('../../pages/mlb/team/pitch_log_page.js');

var navbar, filters, teamsPage, statsPage, teamPage, overviewPage, rosterPage, pitchLogPage;

test.describe('#Team StatcastFielding Section', function() {
  test.before(function() {  
    navbar  = new Navbar(driver);  
    filters  = new Filters(driver);  
    teamsPage = new TeamsPage(driver);
    statsPage = new StatsPage(driver);
    teamPage = new TeamPage(driver);
    overviewPage = new OverviewPage(driver);
    rosterPage = new RosterPage(driver, 'statcastFielding');
    pitchLogPage = new PitchLogPage(driver, 'statcastFielding');

    navbar.goToTeamsPage();
    filters.removeSelectionFromDropdownFilter("Seasons:");
    filters.addSelectionToDropdownFilter("Seasons:", 2016);
    statsPage.clickTeamTableCell(11,3); // should click into San Francisco Giants
    teamPage.goToSection("statcastFielding");
  });  

  test.it('should be on San Francisco Giants 2016 team page', function() {
    teamPage.getTeamName().then(function(text) {
      assert.equal( text, 'San Francisco Giants');
    });
  });

  // Overview Section
  test.describe("#Subsection: Overview", function() {
    test.it('should initially have the correct data', function() {
      overviewPage.getTeamTableStat(3).then(function(ofAirBall) {
        assert.equal(ofAirBall, 1428, 'OFAirBall');
      });        
    });            

    test.it('hitChart should have correct # of balls in play', function() {
      overviewPage.getHitChartHitCount('single').then(function(count) {
        assert.equal(count, 736, 'correct number of singles');
      });
      
      overviewPage.getHitChartHitCount('double').then(function(count) {
        assert.equal(count, 225, 'correct number of doubles');
      });        

      overviewPage.getHitChartHitCount('triple').then(function(count) {
        assert.equal(count, 40, 'correct number of triples');
      });        

      overviewPage.getHitChartHitCount('homeRun').then(function(count) {
        assert.equal(count, 0, 'correct number of home runs');
      });   

      overviewPage.getHitChartHitCount('out').then(function(count) {
        assert.equal(count, 2214, 'correct number of outs');
      });         
    })

    test.describe('clicking into OF Area', function() {
      test.it('clicking a statcast fielding event shoud show correct data in modal', function() {
        overviewPage.clickStatcastFieldingChartEvent(40);
        overviewPage.getStatcastFieldingModalTableStat(1,2).then(function(date) {
          assert.equal(date, '4/20/2016', '1st row date');
        });

        overviewPage.getStatcastFieldingModalTableStat(1,7).then(function(result) {
          assert.equal(result, 'Outfield Fly Ball Out', '1st row result');
        });      

        overviewPage.getStatcastFieldingModalTableStat(1,8).then(function(outProb) {
          assert.equal(outProb, '100.0%', '1st row OutProb');
        });            

        overviewPage.getStatcastFieldingModalTableStat(1,9).then(function(posIndOutProb) {
          assert.equal(posIndOutProb, '100.0%', '1st row PosIndOutProb');
        });                  
      });

      test.after(function() {
        overviewPage.closeStatcastFieldingModal();
      });
    });

    test.it('changing ballpark should change background image for fielding widget', function() {
      overviewPage.changeBallparkDropdown('AT&T Park');
      overviewPage.getCurrentBallparkImageID().then(function(id) {
        assert.equal(id, 'SF_-_2395', 'image id');
      });
    });
    


    test.describe("#Reports", function() {
      var reports = [
        { type: 'Outfielder Air Defense Team Model', topStat: '105.0%', statType: "ExRange%" },  
        { type: 'Outfielder Air Defense Team Skills', topStat: '58.4%', statType: "OFAirOut%" },  
        { type: 'Outfield Batter Positioning', topStat: '102.2%', statType: "OFWPosAirOut%" },  
      ];
      reports.forEach(function(report) {
        test.it("selecting " + report.type + " shows the correct stat value for " + report.statType, function() {
          teamPage.changeReport(report.type);  
          overviewPage.getTeamTableStat(6).then(function(stat) {
            assert.equal(stat, report.topStat);
          });
        });
      });        
    });
  });

  // Roster Section
  test.describe("#Subsection: Roster", function() {
    test.before(function() {
      teamPage.goToSubSection("Roster");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.describe("#filters", function() {
      test.it('adding filter: (Batted Ball: Line Drive) from sidebar displays correct data', function() {
        filters.toggleSidebarFilter('Batted Ball:', 'Line Drive', true);

        rosterPage.getTableStat(1,1).then(function(player) {
          assert.equal(player, 'Kelby Tomlinson');
        });

        rosterPage.getTableStat(1,10).then(function(ofWAirOutPer) {
          assert.equal(ofWAirOutPer,  '137.0%', 'row 1 OFWAirOut%');
        });          
      });
    });

    test.after(function() {
      filters.closeDropdownFilter('Batted Ball:');
    });
  });

  // Game Logs Section
  test.describe("#Subsection: Game Log", function() {
    test.before(function() {
      teamPage.goToSubSection("Game Log");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('should show the correct game data for 10/2/2016', function() {
      teamPage.getGameLogTableStat(1,3).then(function(date) {
        assert.equal(date, '10/2/2016');
      });

      teamPage.getGameLogTableStat(1,4).then(function(score) {
        assert.equal(score, 'W 7-1');
      });      

      teamPage.getGameLogTableStat(1,5).then(function(ofAirBall) {
        assert.equal(ofAirBall, 10, 'row OF Air Ball');
      });            
    });

    test.describe("#filters", function() {
      test.it('adding filter: (Forward Velocity: 80-120) from sidebar displays correct data', function() {
        filters.changeValuesForRangeSidebarFilter("Forward Velocity:", 80, 120);

        teamPage.getGameLogTableStat(1,5).then(function(bf) {
          assert.equal(bf, 5, 'row 1 OFAirBall');
        });          

        teamPage.getGameLogTableStat(1,8).then(function(exRange) {
          assert.equal(exRange, '100.6%', 'row 1 ExRange%');
        });                  
      });

      test.after(function() {
        filters.closeDropdownFilter('Forward Velocity:');
      });
    });
  });     

  // Pitch Logs
  test.describe("#Subsection: Pitch Log", function() {
    test.before(function() {
      teamPage.goToSubSection("Pitch Log");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.describe('when selecting filter (Launch Angle: 0-30)', function() {
      test.before(function() {
        pitchLogPage.clickByInningTab();
        filters.changeValuesForRangeSidebarFilter('Launch Angle:', 0, 30);
      });
      
      test.it('should show the correct at bat footer text', function() {
        pitchLogPage.getByInningAtBatFooterText(1).then(function(text) {
          assert.equal(text, "Adrian Gonzalez Lines Out Softly To Left Fielder Angel Pagan.");
        });
      });

      test.it('should show the correct row data', function() {
        pitchLogPage.getByInningTableStat(1,2).then(function(hang) {
          assert.equal(hang, '3.78s', 'row 1 hang');
        });
        pitchLogPage.getByInningTableStat(1,3).then(function(dist) {
          assert.equal(dist, '33.4ft', 'row 1 dist');
        });
        pitchLogPage.getByInningTableStat(1,4).then(function(react) {
          assert.equal(react, '1.5s', 'row 1 react');
        });
        pitchLogPage.getByInningTableStat(1,5).then(function(jump) {
          assert.equal(jump, '2.64s', 'row 1 jump');
        });
        pitchLogPage.getByInningTableStat(1,6).then(function(pathEff) {
          assert.equal(pathEff, '90.5%', 'row 1 PathEff');
        });        
      });

      test.describe('clicking similar plays icon', function() {
        test.it('clicking similiar icon opens up similiar plays modal and shows correct stats', function() {
          pitchLogPage.clickStatcastFieldingSimiliarIcon(1);
          pitchLogPage.getSimiliarPlaysTableStat(1,10).then(function(pathEff) {
            assert.equal(pathEff, '90.5%', '1st row PathEff')
          });

          pitchLogPage.getSimiliarPlaysTableStat(1,14).then(function(simScore) {
            assert.equal(simScore, 1.000, '1st row SimScore')
          });        
        });

        test.after(function() {
          pitchLogPage.closeSimiliarPlaysModal();  
        });
      });

      test.describe('clicking flat view tab', function() {
        test.it('should show the correct stats', function() {
          pitchLogPage.clickFlatViewTab();
          pitchLogPage.getFlatViewTableStat(1,9).then(function(speed) {
            assert.equal(speed, '9.7mph', 'row 1 speed');
          });

          pitchLogPage.getFlatViewTableStat(2,8).then(function(accel) {
            assert.equal(accel, '0.33s', 'row 2 accel');
          });
        });
      });
    });

    test.after(function() {
      filters.closeDropdownFilter('Launch Angle:');
    });
  });
});