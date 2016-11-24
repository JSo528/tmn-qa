var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var constants = require('../../../lib/constants.js');
var credentials = require('../../../lib/credentials.js');

// Page Objects
var Navbar = require('../../../pages/mlb/navbar.js');
var Filters = require('../../../pages/mlb/filters.js');
var LoginPage = require('../../../pages/login_page.js');
var TeamPage = require('../../../pages/mlb/team/team_page.js');
var TeamsPage = require('../../../pages/mlb/teams/teams_page.js');
var TeamsStatsPage = require('../../../pages/mlb/teams/stats_page.js');
var PlayersPage = require('../../../pages/mlb/players/players_page.js');
var PlayerPage = require('../../../pages/mlb/player/player_page.js');
var Rockies = require('../../../pages/mlb/custom_reports/rockies.js');
var PlayersStatsPage = require('../../../pages/mlb/players/stats_page.js');
var navbar, filters, loginPage, playersPage, rockies, playersStatsPage;

test.describe('#CustomReports: Rockies', function() {
  test.before(function() {  
    navbar  = new Navbar(driver);  
    filters  = new Filters(driver);  
    loginPage = new LoginPage(driver);
    rockies = new Rockies(driver);
    playersPage = new PlayersPage(driver);
    playersStatsPage = new PlayersStatsPage(driver, 'batting');
    playerPage = new PlayerPage(driver, 'batting');
    teamsPage = new TeamsPage(driver);
    teamsStatsPage = new TeamsStatsPage(driver);
    teamPage = new TeamPage(driver);
    
    var newURL = url.replace(/\/\b\w+\b/, 'rockies');
    loginPage.visit(newURL);
    loginPage.login(credentials.testUser.email, credentials.testUser.password);
  });

  test.it('should be on the Rockies page', function() {
    driver.getCurrentUrl().then(function(url) {
      assert.match(url, /rockies/, 'Correct URL');
    });
  });

  test.describe('#Report: Players - CustomBatting', function() {
    test.before(function() {
      navbar.goToPlayersPage();  
      rockies.goToSubSection('Custom Batting');
      rockies.currentPage = 'playersCustomBatting';
    });

    test.it('has the correct title', function() {
      rockies.getReportTitle().then(function(title) {
        assert.equal(title, 'Players Batting Custom');
      });
    });

    test.describe('#data table', function() {
      test.before(function() {
        filters.removeSelectionFromDropdownFilter("Seasons:");
        filters.addSelectionToDropdownFilter("Seasons:", 2016);
      });

      test.it('has the correct table headers', function() {
        rockies.getTableHeader(9).then(function(header) {
          assert.equal(header, 'TPA', 'correct header for col 9');
        });

        rockies.getTableHeader(11).then(function(header) {
          assert.equal(header, 'OFFwTPA', 'correct header for col 11');
        });

        rockies.getTableHeader(14).then(function(header) {
          assert.equal(header, 'WTPA%', 'correct header for col 14');
        });

        rockies.getTableHeader(16).then(function(header) {
          assert.equal(header, 'RunValue', 'correct header for col 16');
        });

        rockies.getTableHeader(18).then(function(header) {
          assert.equal(header, 'RockWAR', 'correct header for col 18');
        });
      });

      test.it('has the correct table data', function() {
        rockies.getTableStat(1,9).then(function(stat) {
          assert.equal(stat, 319, 'TPA for M Trout');
        });

        rockies.getTableStat(2,11).then(function(stat) {
          assert.equal(stat, 89.26, 'OFFwTPA for D Ortiz');
        });

        rockies.getTableStat(3,14).then(function(stat) {
          assert.equal(stat, '11.0%', 'WTPA% for N Arenado');
        });

        rockies.getTableStat(4,16).then(function(stat) {
          assert.equal(stat, 126.33, 'RunValue for M Betts');
        });

        rockies.getTableStat(5,18).then(function(stat) {
          assert.equal(stat, 5.90, 'RockWAR for D Murphy');
        });
      });        

      test.it('should be sorted initially by RockWAR descending', function() {
        var playerOne, playerTwo, playerTen;
        rockies.getTableStat(1,18).then(function(stat) {
          playerOne = stat;
        });

        rockies.getTableStat(2,18).then(function(stat) {
          playerTwo = stat;
        });

        rockies.getTableStat(10,18).then(function(stat) {
          playerTen = stat;

          assert.isAtLeast(playerOne, playerTwo, "team 1's RockWAR is >= team 2's RockWAR");
          assert.isAtLeast(playerTwo, playerTen, "team 2's RockWAR is >= team 10's RockWAR");
        });            
      });
    });

    test.describe("#filters", function() {
      test.it('adding filter: (Team Division: NL West) from sidebar displays correct data', function() {
        filters.changeFilterGroupDropdown('Game');
        filters.addSelectionToDropdownSidebarFilter("Team Division:", 'NL West');

        rockies.getTableStat(1,4).then(function(stat) {
          assert.equal(stat, '3B', 'Position for N Arenado');
        });             

        rockies.getTableStat(1,8).then(function(stat) {
          assert.equal(stat, 696, 'PA for N Arenado');
        });             
      });

      test.after(function() {
        filters.removeSelectionFromDropdownSidebarFilter("Team Division:", 'NL West');
      })
    });

    test.describe("#stats view", function() {
      var statViews = [
        { type: 'Rank', topStat: 1 },            
        { type: 'Percentile', topStat: "100.0%" },
        { type: 'Z-Score', topStat: 2.686 }
      ];
      statViews.forEach(function(statView) {
        test.it("selecting (stats view: " + statView.type + ") shows the correct stat value", function() {
          rockies.changeStatsView(statView.type);  
          rockies.getTableStat(1,18).then(function(stat) {
            assert.equal(stat, statView.topStat);
          });
        });
      });
    });      
  });

  test.describe('#Report: Players - RockWAR', function() {
    test.before(function() {
      rockies.goToSubSection('RockWAR');
      rockies.currentPage = 'playersRockWAR';
    });

    test.describe('#data table', function() {
      test.before(function() {
        filters.removeSelectionFromDropdownFilter("Seasons:");
        filters.addSelectionToDropdownFilter("Seasons:", 2016);
      });

      test.it('has the correct table headers', function() {
        rockies.getTableHeader(7).then(function(header) {
          assert.equal(header, 'RVPA', 'correct header for col 7');
        });

        rockies.getTableHeader(10).then(function(header) {
          assert.equal(header, 'PitRockWAR', 'correct header for col 10');
        });

        rockies.getTableHeader(11).then(function(header) {
          assert.equal(header, 'UZRWAR', 'correct header for col 11');
        });

        rockies.getTableHeader(15).then(function(header) {
          assert.equal(header, 'TotRockWAR', 'correct header for col 15');
        });
      });

      test.it('has the correct table data', function() {
        rockies.getTableStat(1,1).then(function(stat) {
          assert.equal(stat, 'Mookie Betts', '1st row should be Mookie Betts');
        });

        rockies.getTableStat(2,7).then(function(stat) {
          assert.equal(stat, 0.17, 'RVPA for Kris Bryant');
        });

        rockies.getTableStat(3,8).then(function(stat) {
          assert.equal(stat, 2.56, 'RVR for Jon Lester');
        });

        rockies.getTableStat(4,10).then(function(stat) {
          assert.equal(stat, 6.86, 'PitRockWAR for Kyle Hendricks');
        });

        rockies.getTableStat(5,15).then(function(stat) {
          assert.equal(stat, 6.64, 'TotRockWAR for Mike Trout');
        });
      });        

      test.it('should be sorted initially by TotRockWAR descending', function() {
        var playerOne, playerTwo, playerTen;
        rockies.getTableStat(1,15).then(function(stat) {
          playerOne = stat;
        });

        rockies.getTableStat(2,15).then(function(stat) {
          playerTwo = stat;
        });

        rockies.getTableStat(10,15).then(function(stat) {
          playerTen = stat;

          assert.isAtLeast(playerOne, playerTwo, "team 1's RockWAR is >= team 2's RockWAR");
          assert.isAtLeast(playerTwo, playerTen, "team 2's RockWAR is >= team 10's RockWAR");
        });            
      });
    });
    
    test.describe("#filters", function() {
      test.it('adding filter: (Batter Primary Position: C) from sidebar displays correct data', function() {
        filters.addDropdownFilter('Batter Primary Position: C');

        rockies.getTableStat(1,1).then(function(stat) {
          assert.equal(stat, 'Buster Posey', '1st Row should be Buster Posey');
        });             

        rockies.getTableStat(3,1).then(function(stat) {
          assert.equal(stat, 'Jonathan Lucroy', '3rd Row should be Jonathan Lucroy');
        });             
      });
    });
    
    test.describe("#qualify by", function() {
      test.it("selecting (qualify by: Show All) shows the correct data", function() {
        rockies.changeRockWARQualifyBy('Show All');  
        rockies.getTableStat(6,1).then(function(stat) {
          assert.equal(stat, 'Tony Wolters', '3rd Row should be Jonathan Lucroy');
        });
      });

      test.after(function() {
        filters.closeDropdownFilter("Batter Primary Position:");
      });
    });   
  });    

  test.describe('#Report: Players - Custom Pitching', function() {
    test.before(function() {
      playersPage.goToSection('Pitching');
      rockies.goToSubSection('Custom Pitching');
      rockies.currentPage = 'playersCustomPitching';
    });

    test.it('has the correct title', function() {
      rockies.getReportTitle().then(function(title) {
        assert.equal(title, 'Players Pitching Custom');
      });
    });

    test.describe('#data table', function() {
      test.before(function() {
        filters.removeSelectionFromDropdownFilter("Seasons:");
        filters.addSelectionToDropdownFilter("Seasons:", 2016);
      });

      test.it('has the correct table headers', function() {
        rockies.getTableHeader(10).then(function(header) {
          assert.equal(header, 'TPA', 'correct header for col 10');
        });

        rockies.getTableHeader(12).then(function(header) {
          assert.equal(header, 'BRwTPA', 'correct header for col 12');
        });

        rockies.getTableHeader(15).then(function(header) {
          assert.equal(header, 'RVR', 'correct header for col 15');
        });

        rockies.getTableHeader(17).then(function(header) {
          assert.equal(header, 'SPScore', 'correct header for col 17');
        });

        rockies.getTableHeader(21).then(function(header) {
          assert.equal(header, 'RockWAR', 'correct header for col 21');
        });
      });

      test.it('has the correct table data', function() {
        rockies.getTableStat(1,11).then(function(stat) {
          assert.equal(stat, -9.09, 'OFFwTPA for J Lester');
        });

        rockies.getTableStat(2,15).then(function(stat) {
          assert.equal(stat, 2.37, 'RVR for K Hendricks');
        });

        rockies.getTableStat(3,17).then(function(stat) {
          assert.equal(stat, 107.4, 'SPScore for J Verlander');
        });
      });        

      test.it('should be sorted initially by RockWAR descending', function() {
        var playerOne, playerTwo, playerTen;
        rockies.getTableStat(1,18).then(function(stat) {
          playerOne = stat;
        });

        rockies.getTableStat(2,18).then(function(stat) {
          playerTwo = stat;
        });

        rockies.getTableStat(10,18).then(function(stat) {
          playerTen = stat;

          assert.isAtLeast(playerOne, playerTwo, "team 1's RockWAR is >= team 2's RockWAR");
          assert.isAtLeast(playerTwo, playerTen, "team 2's RockWAR is >= team 10's RockWAR");
        });            
      });
    });

    test.describe("#stats view", function() {
      var statViews = [
        { type: 'Stat Grade', topStat: 80 },            
        { type: 'Stat (Rank)', topStat: "6.89 (1)" }
      ];
      statViews.forEach(function(statView) {
        test.it("selecting (stats view: " + statView.type + ") shows the correct stat value", function() {
          rockies.changeStatsView(statView.type);  
          rockies.getTableStat(1,21).then(function(stat) {
            assert.equal(stat, statView.topStat);
          });
        });
      });
    });      
  });

  test.describe('#Report: Player - Custom Batting', function() {
    test.before(function() {
      navbar.goToPlayersPage();
      playersPage.goToSection('Batting');
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
      playersStatsPage.clickTableStat(2,3);
      rockies.goToSubSection('Custom Batting');
      rockies.currentPage = 'playerCustomBatting';
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('should be on Nolan Arenado page', function() {
      playerPage.getPlayerName().then(function(name) {
        assert.equal(name, 'Nolan Arenado');
      });
    });

    test.it('table should have correct headers', function() {
      rockies.getTableHeader(9).then(function(header) {
        assert.equal(header, 'TPA%', 'correct header for col 9');
      });

      rockies.getTableHeader(14).then(function(header) {
        assert.equal(header, 'AAVG', 'correct header for col 14');
      });
    });

    test.it('table should have correct data', function() {
     rockies.getTableStat(1,11).then(function(stat) {
        assert.equal(stat, 12.72, 'BRwTPA');
      });

      rockies.getTableStat(1,13).then(function(stat) {
        assert.equal(stat, '11.0%', 'WTPA%');
      });
    });
  });

  test.describe('#Report: Player - Batter Card (MLB)', function() {
    test.before(function() {
      rockies.goToSubSection('Batter Card (MLB)');
      rockies.currentPage = 'playerBattingCard';
    });

    test.it('table should have the correct headers', function() {
      rockies.getPlayerCardTableHeader(1,1).then(function(header) {
        assert.equal(header, 'Overall', 'correct header for table 1 col 1');
      });

      rockies.getPlayerCardTableHeader(1, 3).then(function(header) {
        assert.equal(header, 'RockWAR', 'correct header for table 1 col 3');
      });

      rockies.getPlayerCardTableHeader(2,4).then(function(header) {
        assert.equal(header, 'RunValue', 'correct header for table 2 col 4');
      });

      rockies.getPlayerCardTableHeader(3,7).then(function(header) {
        assert.equal(header, 'TOTwTPA', 'correct header for table 3 col 7');
      });

      rockies.getPlayerCardTableHeader(4, 1).then(function(header) {
        assert.equal(header, 'RISP', 'correct header for table 4 col 1');
      });
    });

    test.it('table should have the correct data', function() {
      rockies.getPlayerCardTableStat(1, 2016, 3).then(function(stat) {
        assert.equal(stat, 6.03, '2016 RockWAR');
      });

      rockies.getPlayerCardTableStat(2, 2016, 8).then(function(stat) {
        assert.equal(stat, 10.79, '2016 vs LHP OFFwTPA');
      });
    });

    test.it('table should have the correct colors', function() {
      rockies.getPlayerCardTableStatColor(1, 2016, 2).then(function(color) {
        assert.equal(color, 'rgba(252, 255, 0, 1)', '2016 PA color');
      });

      rockies.getPlayerCardTableStatColor(3, 2016, 9).then(function(color) {
        assert.equal(color, 'rgba(166, 225, 0, 1)', '2016 vs RHP BRwTPA color');
      });
    });
  });

  test.describe('#Report: Player - Batter Card (MiLB)', function() {
    test.before(function() {
      rockies.goToSubSection('Batter Card (MiLB)');
      rockies.currentPage = 'playerBattingCard';
    });

    test.it('table should have the correct headers', function() {
      rockies.getPlayerCardTableHeader(1,1).then(function(header) {
        assert.equal(header, 'Overall', 'correct header for table 1 col 1');
      });

      rockies.getPlayerCardTableHeader(1, 3).then(function(header) {
        assert.equal(header, 'PA', 'correct header for table 1 col 3');
      });

      rockies.getPlayerCardTableHeader(2,4).then(function(header) {
        assert.equal(header, 'RockWAR', 'correct header for table 2 col 4');
      });

      rockies.getPlayerCardTableHeader(3,7).then(function(header) {
        assert.equal(header, 'wTPA%', 'correct header for table 3 col 7');
      });

      rockies.getPlayerCardTableHeader(4, 1).then(function(header) {
        assert.equal(header, 'RISP', 'correct header for table 4 col 1');
      });
    });

    test.it('table should have the correct data', function() {
      rockies.getPlayerCardTableStat(1, 2014, 2).then(function(stat) {
        assert.equal(stat, 'AAA - PCL', '2014 League');
      });

      rockies.getPlayerCardTableStat(3, 2014, 7).then(function(stat) {
        assert.equal(stat, '2.2%', '2014 vs RHP wTPA%');
      });
    });

    test.it('table should have the correct colors', function() {
      rockies.getPlayerCardTableStatColor(1, 2014, 7).then(function(color) {
        assert.equal(color, 'rgba(121, 147, 233, 1)', '2014 wTPA color');
      });

      rockies.getPlayerCardTableStatColor(2, 2014, 17).then(function(color) {
        assert.equal(color, 'rgba(4, 145, 0, 1)', '2014 vs LHP XBH% color');
      });
    });
  });

  test.describe('#Report: Player - Custom Pitching', function() {
    test.before(function() {
      navbar.goToPlayersPage();
      playersPage.goToSection('Pitching');
      playersStatsPage.section = 'pitching';
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
      playersStatsPage.clickTableStat(3,3);
      rockies.goToSubSection('Custom Pitching');
      rockies.currentPage = 'playerCustomPitching';
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('should be on Noah Syndergaard page', function() {
      playerPage.getPlayerName().then(function(name) {
        assert.equal(name, 'Noah Syndergaard');
      });
    });

    test.it('table should have correct headers', function() {
      rockies.getTableHeader(10).then(function(header) {
        assert.equal(header, 'TPA', 'correct header for col 10');
      });

      rockies.getTableHeader(16).then(function(header) {
        assert.equal(header, 'AERA', 'correct header for col 16');
      });
    });

    test.it('table should have correct data', function() {
     rockies.getTableStat(1,11).then(function(stat) {
        assert.equal(stat, -3.17, 'OFFwTPA');
      });

      rockies.getTableStat(1,13).then(function(stat) {
        assert.equal(stat, '-0.4%', 'WTPA%');
      });
    });
  });

  test.describe('#Report: Player - Pitcher Card (MLB)', function() {
    test.before(function() {
      rockies.goToSubSection('Pitcher Card (MLB)');
      rockies.currentPage = 'playerPitchingCard';
    });

    test.it('table should have the correct headers', function() {
      rockies.getPlayerCardTableHeader(1,1).then(function(header) {
        assert.equal(header, 'Overall', 'correct header for table 1 col 1');
      });

      rockies.getPlayerCardTableHeader(1,3).then(function(header) {
        assert.equal(header, 'RockWAR', 'correct header for table 1 col 3');
      });

      rockies.getPlayerCardTableHeader(2,5).then(function(header) {
        assert.equal(header, 'SPScore', 'correct header for table 2 col 5');
      });

      rockies.getPlayerCardTableHeader(3,19).then(function(header) {
        assert.equal(header, 'XBH%', 'correct header for table 3 col 19');
      });

      rockies.getPlayerCardTableHeader(4,4).then(function(header) {
        assert.equal(header, 'RVR', 'correct header for table 4 col 4');
      });

      rockies.getPlayerCardTableHeader(5,6).then(function(header) {
        assert.equal(header, 'RPScore', 'correct header for table 5 col 6');
      });
    });

    test.it('table should have the correct data', function() {
      rockies.getPlayerCardTableStat(1, 2016, 3).then(function(stat) {
        assert.equal(stat, 5.72, '2016 RockWAR');
      });

      rockies.getPlayerCardTableStat(2, 2016, 5).then(function(stat) {
        assert.equal(stat, 108.2, '2016 vs LHH SPScore');
      });
    });

    test.it('table should have the correct colors', function() {
      rockies.getPlayerCardTableStatColor(1, 2016, 12).then(function(color) {
        assert.equal(color, 'rgba(255, 2, 0, 1)', '2016 SV color');
      });

      rockies.getPlayerCardTableStatColor(2, 2016, 5).then(function(color) {
        assert.equal(color, 'rgba(121, 147, 233, 1)', '2016 vs LHH SPScore color');
      });
    });
  });

  test.describe('#Report: Player - Pitcher Card (MiLB)', function() {
    test.before(function() {
      rockies.goToSubSection('Pitcher Card (MiLB)');
      rockies.currentPage = 'playerPitchingCard';
    });

    test.it('table should have the correct headers', function() {
      rockies.getPlayerCardTableHeader(1,1).then(function(header) {
        assert.equal(header, 'Overall', 'correct header for table 1 col 1');
      });

      rockies.getPlayerCardTableHeader(1,3).then(function(header) {
        assert.equal(header, 'IP', 'correct header for table 1 col 3');
      });

      rockies.getPlayerCardTableHeader(2,4).then(function(header) {
        assert.equal(header, 'RockWAR', 'correct header for table 2 col 4');
      });

      rockies.getPlayerCardTableHeader(3,7).then(function(header) {
        assert.equal(header, 'MiLBRPScore', 'correct header for table 3 col 7');
      });
    });

    test.it('table should have the correct data', function() {
      rockies.getPlayerCardTableStat(1, 2014, 2).then(function(stat) {
        assert.equal(stat, 'AAA - PCL', '2014 League');
      });

      rockies.getPlayerCardTableStat(3, 2014, 7).then(function(stat) {
        assert.equal(stat, 108.4, '2014 vs RHH MiLBRPScore');
      });
    });

    test.it('table should have the correct colors', function() {
      rockies.getPlayerCardTableStatColor(1, 2014, 4).then(function(color) {
        assert.equal(color, 'rgba(166, 225, 0, 1)', '2014 RockWAR color');
      });

      rockies.getPlayerCardTableStatColor(1, 2014, 6).then(function(color) {
        assert.equal(color, 'rgba(252, 255, 0, 1)', '2014 vs LHP XBH% color');
      });
    });
  })  

  test.describe('#Report: Teams - Rockies Report', function() {
    test.describe('#Teams Batting Page', function() {
      test.before(function() {
        navbar.goToTeamsPage();
        filters.removeSelectionFromDropdownFilter("Seasons:");
        filters.addSelectionToDropdownFilter("Seasons:", 2016);
      });

      test.it('table shows the correct data', function() {
        teamsStatsPage.getTeamTableStat(1,10).then(function(stat) {
          assert.equal(stat, 402.36, '2016 BOS OFFwTPA');
        });
      });
    });
  });

  test.describe('#Report: Team - Custom Batting', function() {
    test.before(function() {
      teamsStatsPage.clickTeamTableCell(2,3);
      rockies.goToSubSection('Custom Batting');
      rockies.currentPage = 'teamCustomBatting';
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('table shows the correct data', function() {
      rockies.getTableStat(1, 15).then(function(stat) {
        assert.equal(stat, 6.03, '2016 Nolan Arenado RockWAR');
      });
    });
  });    

  test.describe('#Report: Team - Batting TPA +/-', function() {
    test.before(function() {
      rockies.goToSubSection('TPA +/-');
      rockies.changeTPADropdown(2016);
    });

    test.it('table shows the correct data', function() {
      rockies.getTPATableStat(1,3,2).then(function(stat) {
        assert.equal(stat, 46, '2016 Plus Wins');
      });
    });
  });   

  test.describe('#Report: Team - Batting TPA 12+', function() {
    test.before(function() {
      rockies.goToSubSection('TPA 12+');
      rockies.changeTPADropdown(2016);
    });

    test.it('table shows the correct data', function() {
      rockies.getTPATableStat(1,3,7).then(function(stat) {
        assert.equal(stat, 21, '2016 LA Angels Rank');
      });
    });
  });      

  test.describe('#Report: Team - Batting Rock War', function() {
    test.before(function() {
      rockies.goToSubSection('RockWAR');
      rockies.currentPage = 'teamRockWAR';
    });

    test.it('table shows the correct data', function() {
      rockies.getTableHeader(12).then(function(header) {
        assert.equal(header, 'TotRockWAR', '12th column header');
      });
    });
  });        

  test.describe('#Report: Team - Custom Pitching', function() {
    test.before(function() {
      teamPage.goToSection('pitching');
      rockies.goToSubSection('Custom Pitching');
      rockies.currentPage = 'teamCustomPitching';
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('table shows the correct data', function() {
      this.timeout(120000);
      rockies.getTableStat(1,16).then(function(stat) {
        assert.equal(stat, 1.72, '2016 Tyler Anderson RockWAR');
      });
    });
  });    

  test.describe('#Report: Team - Pitching TPA +/-', function() {
    test.before(function() {
      rockies.goToSubSection('TPA +/-');
      rockies.changeTPADropdown(2016);
    });

    test.it('table shows the correct data', function() {
      rockies.getTPATableStat(1,3,2).then(function(stat) {
        assert.equal(stat, 46, '2016 Plus Wins');
      });
    });
  });    

  test.describe('#Report: Team - Pitching TPA 12+', function() {
    test.before(function() {
      rockies.goToSubSection('TPA 12+');
      rockies.changeTPADropdown(2016);
    });

    test.it('table shows the correct data', function() {
      rockies.getTPATableStat(1,3,6).then(function(stat) {
        assert.equal(stat, '0.725', '2016 LA Angels Win%');
      });
    });
  });                
});