var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var constants = require('../../lib/constants.js');

// Page Objects
var Navbar = require('../../pages/nfl/navbar.js');
var Filters = require('../../pages/nfl/filters.js');
var TeamsPage = require('../../pages/nfl/teams/teams_page.js');
var TeamPage = require('../../pages/nfl/teams/team_page.js');
var PlayersPage = require('../../pages/nfl/players/players_page.js');
var PlayerPage = require('../../pages/nfl/players/player_page.js');
var PerformancePage = require('../../pages/nfl/performance/performance_page.js');
var GamePage = require('../../pages/nfl/scores/game_page.js');
var GroupsPage = require('../../pages/nfl/groups/groups_page.js');
var teamsPage, teamsPage, playersPage, playerPage, performancePage, gamePage, groupsPage, navbar, filters;

test.describe('#Feature: CSV Exports', function() {
  test.before(function() {
    teamsPage = new TeamsPage(driver);
    teamPage = new TeamPage(driver);
    playersPage = new PlayersPage(driver);
    playerPage = new PlayerPage(driver);
    performancePage = new PerformancePage(driver);
    gamePage = new GamePage(driver);
    groupsPage = new GroupsPage(driver);
    navbar  = new Navbar(driver);
    filters = new Filters(driver);
    
  });

  test.describe('#Section: Teams', function() {
    test.describe('#Page: Stats', function() {
      test.it('test setup', function() {
        navbar.goToTeamsPage();
        teamsPage.waitForTableToLoad();
      });

      test.it('clicking export button', function() {
        teamsPage.clickStatsExportLink();
      });
      
      test.it('export csv file should have the correct data', function() {
        var exportFileContents = 'Rank,team,G,W,L,T,Win%,PS,PA,PM,Yds,OpYds,TO,OpTO,TOMgn,TOP,OpTOP,TopMgn/n1,Patriots,16,14,2,0,.875,441,250,191,6180,5223,11,23,12,31:13,28:46,2:26/n2,Cowboys,16,13,3,0,.813,421,306,115,6027,5503,15,20,5,31:54,28:32,3:22/n3,Chiefs,16,12,4,0,.750,389,311,78,5488,5896,17,33,16,30:36,30:39,-0:03/n3,Raiders,16,12,4,0,.750,416,385,31,5973,6001,14,30,16,31:44,29:05,2:38/n5,Falcons,16,11,5,0,.688,540,406,134,6653,5939,11,22,11,30:22,29:59,0:22/n5,Giants,16,11,5,0,.688,310,284,26,5291,5435,27,25,-2,28:18,31:41,-3:22/n5,Steelers,16,11,5,0,.688,399,327,72,5962,5482,18,23,5,30:45,30:00,0:45/n8,Seahawks,16,10,5,1,.656,354,292,62,5715,5099,18,19,1,30:03,30:52,-0:49/n9,Dolphins,16,10,6,0,.625,363,380,-17,5324,6122,23,25,2,28:59,32:18,-3:18/n9,Packers,16,10,6,0,.625,432,388,44,5900,5823,17,25,8,31:13,28:46,2:27/n11,Buccaneers,16,9,7,0,.563,354,369,-15,5542,5887,27,29,2,30:57,29:52,1:04/n11,Titans,16,9,7,0,.563,381,378,3,5728,5720,18,18,0,30:31,29:28,1:03/n11,Broncos,16,9,7,0,.563,333,297,36,5169,5057,25,27,2,29:03,31:53,-2:49/n11,Lions,16,9,7,0,.563,346,358,-12,5421,5676,15,14,-1,30:06,30:18,-0:11/n11,Texans,16,9,7,0,.563,279,328,-49,5035,4821,24,17,-7,31:33,28:52,2:41/n16,Redskins,16,8,7,1,.531,396,383,13,6454,6046,21,21,0,30:05,30:50,-0:45/n17,Ravens,16,8,8,0,.500,343,321,22,5563,5154,23,28,5,30:45,29:14,1:31/n17,Vikings,16,8,8,0,.500,327,307,20,5041,5038,16,27,11,30:36,29:48,0:48/n17,Colts,16,8,8,0,.500,411,392,19,5830,6126,22,17,-5,30:52,29:33,1:18/n20,Cardinals,16,7,8,1,.469,418,362,56,5868,4883,28,28,0,30:53,30:02,0:50/n21,Eagles,16,7,9,0,.438,367,331,36,5398,5484,20,26,6,32:31,27:56,4:35/n21,Saints,16,7,9,0,.438,469,454,15,6816,6006,24,21,-3,30:56,29:03,1:53/n21,Bills,16,7,9,0,.438,399,378,21,5666,5712,12,18,6,29:47,31:05,-1:18/n24,Bengals,16,6,9,1,.406,325,315,10,5711,5612,17,20,3,30:19,30:36,-0:16/n25,Panthers,16,6,10,0,.375,369,402,-33,5499,5756,29,27,-2,30:50,29:09,1:40/n26,Chargers,16,5,11,0,.313,410,423,-13,5708,5554,35,28,-7,30:33,30:08,0:25/n26,Jets,16,5,11,0,.313,275,409,-134,5268,5479,34,14,-20,30:41,29:42,0:58/n28,Rams,16,4,12,0,.250,224,394,-170,4203,5392,29,18,-11,29:20,30:39,-1:18/n29,Jaguars,16,3,13,0,.188,318,400,-82,5359,5147,29,13,-16,29:08,30:51,-1:42/n29,Bears,16,3,13,0,.188,279,399,-120,5704,5548,31,11,-20,28:06,31:53,-3:46/n31,49ers,16,2,14,0,.125,309,480,-171,4930,6502,25,20,-5,26:55,33:28,-6:33/n32,Browns,16,1,15,0,.063,264,452,-188,4976,6279,25,13,-12,28:16,32:53,-4:37/n';
        
        return teamsPage.readAndDeleteCSV().then(function(fileContents) {
          assert.equal(fileContents, exportFileContents);  
        })
      });

      test.it('clicking export all button', function() {
        teamsPage.clickStatsExportAllLink();
      });
      
      test.it('export all csv file should have the correct data', function() {
        return teamsPage.readAndDeleteCSV().then(function(fileContents) {
          assert.isNotNull(fileContents);  
        })
      });  
    });

    test.describe('#Page: Occurrences & Streaks', function() {
      test.it('test setup', function() {
        teamsPage.goToSection('occurrencesAndStreaks');
        teamsPage.waitForTableToLoad();
      });

      test.it('clicking export button', function() {        
        teamsPage.clickStreaksExportLink();
      });
      
      test.it('export csv file should have the correct data', function() {
        var exportFileContents = 'Count,team,W,startDate,endDate/n14,Patriots,14,2016-09-11 20:30:00,2017-01-01 13:00:00/n13,Cowboys,13,2016-09-18 13:00:00,2016-12-26 20:30:00/n12,Chiefs,12,2016-09-11 13:00:00,2017-01-01 16:25:00/n12,Raiders,12,2016-09-11 13:00:00,2016-12-24 16:05:00/n11,Falcons,11,2016-09-18 16:25:00,2017-01-01 16:25:00/n11,Giants,11,2016-09-11 16:25:00,2017-01-01 16:25:00/n11,Steelers,11,2016-09-12 19:10:00,2017-01-01 13:00:00/n10,Packers,10,2016-09-11 13:00:00,2017-01-01 20:30:00/n10,Seahawks,10,2016-09-11 16:05:00,2017-01-01 16:25:00/n10,Dolphins,10,2016-09-25 13:00:00,2016-12-24 13:00:00/n9,Broncos,9,2016-09-08 20:30:00,2017-01-01 16:25:00/n9,Buccaneers,9,2016-09-11 13:00:00,2017-01-01 13:00:00/n9,Titans,9,2016-09-18 13:00:00,2017-01-01 13:00:00/n9,Texans,9,2016-09-11 13:00:00,2016-12-24 20:25:00/n9,Lions,9,2016-09-11 16:25:00,2016-12-11 13:00:00/n8,Vikings,8,2016-09-11 13:00:00,2017-01-01 13:00:00/n8,Colts,8,2016-09-25 16:25:00,2017-01-01 13:00:00/n8,Redskins,8,2016-09-25 13:00:00,2016-12-24 13:00:00/n8,Ravens,8,2016-09-11 13:00:00,2016-12-18 13:00:00/n7,Cardinals,7,2016-09-18 16:05:00,2017-01-01 16:25:00/n7,Eagles,7,2016-09-11 13:00:00,2017-01-01 13:00:00/n7,Saints,7,2016-10-02 16:25:00,2016-12-24 16:25:00/n7,Bills,7,2016-09-25 13:00:00,2016-12-18 13:00:00/n6,Bengals,6,2016-09-11 13:00:00,2017-01-01 13:00:00/n6,Panthers,6,2016-09-18 13:00:00,2016-12-19 20:30:00/n5,Jets,5,2016-09-15 20:25:00,2017-01-01 13:00:00/n5,Chargers,5,2016-09-18 16:25:00,2016-11-27 13:00:00/n4,Rams,4,2016-09-18 16:05:00,2016-11-13 13:00:00/n3,Jaguars,3,2016-10-02 09:30:00,2016-12-24 13:00:00/n3,Bears,3,2016-10-02 13:00:00,2016-12-04 13:00:00/n2,49ers,2,2016-09-12 22:20:00,2016-12-24 16:25:00/n1,Browns,1,2016-12-24 13:00:00,2016-12-24 13:00:00/n';
        
        return teamsPage.readAndDeleteCSV().then(function(fileContents) {
          assert.equal(fileContents, exportFileContents);  
        })
      });
    });

    test.describe('#Page: Play By Play', function() {
      test.it('test setup', function() {
        teamsPage.goToSection('playByPlay');
        filters.changeFilterGroupDropdown('Game');
        filters.changeValuesForRangeSidebarFilter('Final Score Margin:', 0, 1);
      });

      test.it('clicking export summary button returns correct CSV', function() {
        teamsPage.clickPlayByPlaySummaryExportLink();
      });
      
      test.it('summary csv file should have the correct data', function() {
        var exportFileContents = 'League Summary,G,W,L,T,Win%,PS,PA,PM,Yds,OpYds,TO,OpTO,TOMgn,TOP,OpTOP,TopMgn/n2017010109,1,1,0,0,1.000,17,16,1,300,335,2,3,1,27:36,32:24,-4:48/n2016122409,1,1,0,0,1.000,22,21,1,323,177,2,2,0,31:03,28:57,2:06/n2016121800,1,1,0,0,1.000,27,26,1,340,328,2,1,-1,23:22,36:38,-13:16/n2016121804,1,1,0,0,1.000,21,20,1,387,150,2,1,-1,36:42,23:18,13:24/n2016120400,1,1,0,0,1.000,29,28,1,389,418,1,1,0,28:08,31:52,-3:44/n2016111400,1,1,0,0,1.000,21,20,1,351,264,2,1,-1,31:23,28:37,2:46/n2016103001,1,1,0,0,1.000,33,32,1,367,331,0,0,0,28:43,31:17,-2:34/n2016103000,2,0,0,2,.500,54,54,0,961,961,3,3,0,37:30,37:30,0:00/n2016102312,2,0,0,2,.500,12,12,0,700,700,0,0,0,37:30,37:30,0:00/n2016101601,1,1,0,0,1.000,17,16,1,317,389,2,0,-2,24:13,35:47,-11:34/n2016100902,1,1,0,0,1.000,24,23,1,244,346,1,2,1,30:24,29:36,0:48/n2016100210,1,1,0,0,1.000,35,34,1,275,346,2,3,1,32:39,27:21,5:18/n2016100202,1,1,0,0,1.000,28,27,1,261,412,1,1,0,25:16,34:44,-9:28/n2016091802,1,1,0,0,1.000,16,15,1,363,375,1,1,0,30:51,29:09,1:42/n2016091110,1,1,0,0,1.000,20,19,1,316,328,1,0,-1,23:17,36:43,-13:26/n2016091105,1,1,0,0,1.000,35,34,1,486,507,0,1,1,30:25,29:35,0:50/n2016091106,1,1,0,0,1.000,23,22,1,381,340,1,1,0,25:07,34:53,-9:46/n2016090800,1,1,0,0,1.000,21,20,1,307,333,3,1,-2,27:41,32:19,-4:38/n';
        
        return teamsPage.readAndDeleteCSV().then(function(fileContents) {
          assert.equal(fileContents, exportFileContents);  
        })
      });

      test.it('clicking export button returns correct CSV', function() {
        teamsPage.clickPlayByPlayExportLink();
      });
      
      test.it('export csv file should have the correct data', function() {
        return teamsPage.readAndDeleteCSV().then(function(fileContents) {
          assert.isNotNull(fileContents);  
        })
      });
    });

    test.describe('#Page: Scatter Plot', function() {
      test.it('test setup', function() {
        teamsPage.goToSection('scatterPlot');
        teamsPage.waitForTableToLoad();
      });

      test.it('clicking export button returns correct CSV', function() {
        teamsPage.clickScatterPlotExportLink();
      });
      
      test.it('csv file should have the correct data', function() {
        var exportFileContents = 'name,PsTD,Int/nArizona Cardinals,0,0/nAtlanta Falcons,3,0/nBaltimore Ravens,2,1/nCincinnati Bengals,2,2/nDenver Broncos,1,2/nDetroit Lions,3,0/nHouston Texans,0,2/nJacksonville Jaguars,1,1/nKansas City Chiefs,1,0/nNew Orleans Saints,2,2/nNew York Giants,6,3/nOakland Raiders,5,0/nSan Francisco 49ers,2,1/nSeattle Seahawks,0,0/nTampa Bay Buccaneers,1,1/nTennessee Titans,2,1/nWashington Redskins,2,1/n';
        
        return teamsPage.readAndDeleteCSV().then(function(fileContents) {
          assert.equal(fileContents, exportFileContents);  
        });
      });
    });
  });

  test.describe('#Section: Players', function() {
    test.describe('#Page: Overview', function() {
      test.it('test setup', function() {
        navbar.goToPlayersPage();
        filters.changeValuesForSeasonWeekDropdownFilter(2015, 'W1', 2015, 'W17', true);
        playersPage.waitForTableToLoad();
      });

       test.it('clicking export button', function() {
        playersPage.clickStatsExportLink();
      });

      test.it('csv file should have the correct data', function() {
        var exportFileContents = 'Rank,dateOfBirth,pos,player,teamAbbrev,G,QBWin,QBLoss,QBTie,QBWin%,Cmp,Att,Comp%,PsYds,Yd/Att,PsTD,Int,TD/Int,PsrRt,Sack,PsLg,Ps1st/n1,1988-11-29,QB,Russell Wilson,SEA,16,10,6,0,.625,329,483,68.1%,4024,8.33,34,8,4.25,110.1,45,80,187/n2,1987-10-29,QB,Andy Dalton,CIN,13,10,3,0,.769,255,386,66.1%,3250,8.42,25,7,3.57,106.3,20,80,147/n3,1979-12-27,QB,Carson Palmer,ARI,16,13,3,0,.813,342,537,63.7%,4671,8.70,35,11,3.18,104.6,25,68,231/n4,1977-08-03,QB,Tom Brady,NE,16,12,4,0,.750,402,624,64.4%,4770,7.64,36,7,5.14,102.2,38,76,228/n5,1988-08-19,QB,Kirk Cousins,WAS,16,9,7,0,.563,379,543,69.8%,4166,7.67,29,11,2.64,101.6,26,78,204/n6,1979-01-15,QB,Drew Brees,NO,15,7,8,0,.467,428,627,68.3%,4870,7.77,32,11,2.91,101.0,31,80,228/n7,1989-08-03,QB,Tyrod Taylor,BUF,14,7,6,0,.538,242,380,63.7%,3035,7.99,20,6,3.33,99.4,36,63,129/n8,1989-05-11,QB,Cam Newton,CAR,16,15,1,0,.938,296,495,59.8%,3837,7.75,35,10,3.50,99.4,33,74,195/n9,1988-02-07,QB,Matthew Stafford,DET,16,7,9,0,.438,398,592,67.2%,4262,7.20,32,13,2.46,97.0,44,57,223/n10,1984-05-07,QB,Alex Smith,KC,16,11,5,0,.688,307,470,65.3%,3486,7.42,20,7,2.86,95.4,45,80,154/n11,1982-03-02,QB,Ben Roethlisberger,PIT,12,7,4,0,.636,319,469,68.0%,3938,8.40,21,16,1.31,94.5,20,69,174/n12,1981-12-08,QB,Philip Rivers,SD,16,4,12,0,.250,437,661,66.1%,4792,7.25,29,13,2.23,93.8,40,80,226/n13,1981-01-03,QB,Eli Manning,NYG,16,6,10,0,.375,387,618,62.6%,4432,7.17,35,14,2.50,93.6,27,87,204/n14,1979-07-04,QB,Josh McCown,CLE,8,1,7,0,.125,186,292,63.7%,2109,7.22,12,4,3.00,93.3,23,56,96/n15,1983-12-02,QB,Aaron Rodgers,GB,16,10,6,0,.625,347,572,60.7%,3821,6.68,31,8,3.88,92.7,46,65,173/n16,1983-04-29,QB,Jay Cutler,CHI,15,6,9,0,.400,311,483,64.4%,3659,7.58,21,11,1.91,92.3,29,87,171/n17,1993-10-30,QB,Marcus Mariota,TEN,12,3,9,0,.250,230,370,62.2%,2818,7.62,19,10,1.90,91.5,38,61,142/n18,1985-10-13,QB,Brian Hoyer,HOU,11,5,4,0,.556,224,369,60.7%,2606,7.06,19,7,2.71,91.4,25,49,130/n19,1991-03-28,QB,Derek Carr,OAK,16,7,9,0,.438,350,573,61.1%,3987,6.96,32,13,2.46,91.1,31,68,183/n20,1985-05-17,QB,Matt Ryan,ATL,16,8,8,0,.500,407,614,66.3%,4591,7.48,21,16,1.31,89.0,30,70,229/n21,1988-07-27,QB,Ryan Tannehill,MIA,16,6,10,0,.375,363,586,61.9%,4208,7.18,24,12,2.00,88.7,45,54,193/n22,1992-11-10,QB,Teddy Bridgewater,MIN,16,11,5,0,.688,292,447,65.3%,3231,7.23,14,9,1.56,88.7,44,52,153/n23,1992-04-28,QB,Blake Bortles,JAC,16,5,11,0,.313,355,606,58.6%,4428,7.31,35,18,1.94,88.2,51,90,215/n24,1982-11-24,QB,Ryan Fitzpatrick,NYJ,16,10,6,0,.625,335,562,59.6%,3905,6.95,31,15,2.07,88.0,19,69,196/n25,1990-11-22,QB,Brock Osweiler,DEN,8,5,2,0,.714,170,275,61.8%,1967,7.15,10,6,1.67,86.4,23,72,91/n26,1987-11-08,QB,Sam Bradford,PHI,14,7,7,0,.500,346,532,65.0%,3725,7.00,19,14,1.36,86.4,28,78,164/n27,1989-10-15,QB,Blaine Gabbert,SF,8,3,5,0,.375,178,282,63.1%,2031,7.20,10,7,1.43,86.2,25,71,83/n28,1994-01-06,QB,Jameis Winston,TB,16,6,10,0,.375,312,535,58.3%,4042,7.56,22,15,1.47,84.2,27,68,201/n29,1975-09-25,QB,Matt Hasselbeck,IND,8,5,3,0,.625,156,256,60.9%,1690,6.60,9,5,1.80,84.0,16,57,85/n30,1985-01-16,QB,Joe Flacco,BAL,10,3,7,0,.300,266,413,64.4%,2791,6.76,14,12,1.17,83.1,16,50,123/n31,1987-11-03,QB,Colin Kaepernick,SF,9,2,6,0,.250,144,244,59.0%,1615,6.62,6,5,1.20,78.5,28,76,71/n32,1989-09-12,QB,Andrew Luck,IND,7,2,5,0,.286,162,293,55.3%,1881,6.42,15,12,1.25,74.9,15,87,90/n33,1989-01-20,QB,Nick Foles,STL,11,4,7,0,.364,190,337,56.4%,2052,6.09,7,10,0.70,69.0,14,68,82/n34,1988-06-05,QB,Ryan Mallett,BAL,8,2,4,0,.333,136,244,55.7%,1336,5.48,5,6,0.83,67.9,6,48,76/n35,1976-03-24,QB,Peyton Manning,DEN,10,7,2,0,.778,198,331,59.8%,2249,6.79,9,17,0.53,67.9,16,75,110/n';
        return playersPage.readAndDeleteCSV().then(function(data) {
          assert.equal(data, exportFileContents);
        });
      });

      test.it('clicking export all button', function() {
        playersPage.clickStatsExportAllLink();
      });
      
      test.it('export all csv file should have the correct data', function() {
        return playersPage.readAndDeleteCSV().then(function(fileContents) {
          assert.isNotNull(fileContents);  
        })
      });
    });

    test.describe('#Page: Occurrences & Streaks', function() {
      test.it('test setup', function() {
        playersPage.goToSection('occurrencesAndStreaks');
        playersPage.changeMainConstraint("Occurrences Of", "Exactly", 2, "Interceptions", "In a Game", "Within a Season");
        playersPage.waitForTableToLoad();
      });

      test.it('clicking export button', function() {
        playersPage.clickStreaksExportLink();
      });
      
      test.it('export csv file should have the correct data', function() {
        var exportFileContents = 'Count,dateOfBirth,pos,fullName,teamAbbrev,startTeam,endTeam,Int,startDate,endDate/n4,1982-03-02,QB,Ben Roethlisberger,PIT,PIT,PIT,8,2015-11-29 16:25:00,2016-01-03 13:00:00/n4,1992-04-28,QB,Blake Bortles,JAX,JAX,JAX,8,2015-09-13 13:00:00,2016-01-03 13:00:00/n4,1987-11-08,QB,Sam Bradford,PHI,PHI,PHI,8,2015-09-14 19:10:00,2015-12-20 20:30:00/n4,1985-05-17,QB,Matt Ryan,ATL,ATL,ATL,8,2015-09-14 19:10:00,2015-11-29 13:00:00/n4,1985-01-16,QB,Joe Flacco,BAL,BAL,BAL,8,2015-09-13 16:25:00,2015-11-22 13:00:00/n4,1988-08-19,QB,Kirk Cousins,WAS,WAS,WAS,8,2015-09-13 13:00:00,2015-10-18 13:00:00/n3,1994-01-06,QB,Jameis Winston,TB,TB,TB,6,2015-09-13 16:25:00,2016-01-03 16:25:00/n3,1981-12-08,QB,Philip Rivers,LAC,LAC,LAC,6,2015-09-13 16:05:00,2015-12-20 16:25:00/n3,1993-10-30,QB,Marcus Mariota,TEN,TEN,TEN,6,2015-09-27 13:00:00,2015-11-29 13:00:00/n3,1976-03-24,QB,Peyton Manning,DEN,DEN,DEN,6,2015-10-04 16:25:00,2015-11-08 16:25:00/n3,1988-02-07,QB,Matthew Stafford,DET,DET,DET,6,2015-09-13 16:05:00,2015-11-01 08:30:00/n3,1988-07-27,QB,Ryan Tannehill,MIA,MIA,MIA,6,2015-10-04 09:30:00,2015-10-29 20:25:00/n3,1989-09-12,QB,Andrew Luck,IND,IND,IND,6,2015-09-13 13:00:00,2015-10-25 13:00:00/n2,1984-05-07,QB,Alex Smith,KC,KC,KC,4,2015-09-17 20:25:00,2016-01-03 16:25:00/n2,1991-03-28,QB,Derek Carr,OAK,OAK,OAK,4,2015-11-15 16:05:00,2015-12-20 16:05:00/n2,1991-07-16,QB,Zach Mettenberger,TEN,TEN,TEN,4,2015-10-25 13:00:00,2015-12-20 13:00:00/n2,1975-09-25,QB,Matt Hasselbeck,IND,IND,IND,4,2015-11-22 13:00:00,2015-12-06 20:30:00/n2,1981-06-25,QB,Matt Schaub,BAL,BAL,BAL,4,2015-11-30 20:30:00,2015-12-06 13:00:00/n2,1989-04-04,QB,Landry Jones,PIT,PIT,PIT,4,2015-10-25 13:00:00,2015-11-29 16:25:00/n2,1979-12-27,QB,Carson Palmer,ARI,ARI,ARI,4,2015-10-18 13:00:00,2015-11-22 20:30:00/n2,1980-04-21,QB,Tony Romo,DAL,DAL,DAL,4,2015-09-13 20:30:00,2015-11-22 13:00:00/n2,1982-11-24,QB,Ryan Fitzpatrick,NYJ,NYJ,NYJ,4,2015-11-12 20:25:00,2015-11-22 13:00:00/n2,1979-01-15,QB,Drew Brees,NO,NO,NO,4,2015-11-01 12:00:00,2015-11-15 13:00:00/n2,1981-01-03,QB,Eli Manning,NYG,NYG,NYG,4,2015-10-19 20:30:00,2015-11-08 16:05:00/n1,1990-11-22,QB,Brock Osweiler,DEN,DEN,DEN,2,2016-01-03 16:25:00,2016-01-03 16:25:00/n1,1984-05-07,QB,Drew Stanton,ARI,ARI,ARI,2,2016-01-03 16:25:00,2016-01-03 16:25:00/n1,1989-06-02,QB,Austin Davis,CLE,CLE,CLE,2,2016-01-03 13:00:00,2016-01-03 13:00:00/n1,1989-07-12,QB,Kellen Moore,DAL,DAL,DAL,2,2016-01-03 13:00:00,2016-01-03 13:00:00/n1,1988-06-05,QB,Ryan Mallett,BAL,BAL,BAL,2,2016-01-03 13:00:00,2016-01-03 13:00:00/n1,1987-09-21,QB,Jimmy Clausen,BAL,BAL,BAL,2,2015-12-20 13:00:00,2015-12-20 13:00:00/n1,1990-09-13,QB,AJ McCarron,CIN,CIN,CIN,2,2015-12-13 13:00:00,2015-12-13 13:00:00/n1,1977-08-03,QB,Tom Brady,NE,NE,NE,2,2015-12-06 16:25:00,2015-12-06 16:25:00/n1,1989-10-15,QB,Blaine Gabbert,SF,SF,SF,2,2015-11-08 16:05:00,2015-11-08 16:05:00/n1,1987-10-29,QB,Andy Dalton,CIN,CIN,CIN,2,2015-11-01 12:00:00,2015-11-01 12:00:00/n1,1990-03-19,QB,EJ Manuel,BUF,BUF,BUF,2,2015-10-25 09:30:00,2015-10-25 09:30:00/n1,1988-11-29,QB,Russell Wilson,SEA,SEA,SEA,2,2015-10-22 20:25:00,2015-10-22 20:25:00/n1,1989-05-11,QB,Cam Newton,CAR,CAR,CAR,2,2015-10-18 16:05:00,2015-10-18 16:05:00/n1,1979-07-04,QB,Josh McCown,CLE,CLE,CLE,2,2015-10-18 13:00:00,2015-10-18 13:00:00/n1,1992-11-10,QB,Teddy Bridgewater,MIN,MIN,MIN,2,2015-10-18 13:00:00,2015-10-18 13:00:00/n1,1983-12-02,QB,Aaron Rodgers,GB,GB,GB,2,2015-10-11 13:00:00,2015-10-11 13:00:00/n';
        
        return playersPage.readAndDeleteCSV().then(function(fileContents) {
          assert.equal(fileContents, exportFileContents);  
        })
      });
    });

    test.describe('#Page: Scatter Plot', function() {
      test.it('test setup', function() {
        playersPage.goToSection('scatterPlot');
        playersPage.waitForTableToLoad();
      });

      test.it('clicking export button returns correct CSV', function() {
        playersPage.clickScatterPlotExportLink();
      });
      
      test.it('csv file should have the correct data', function() {
        var exportFileContents = 'dateOfBirth,teamAbbrev,pos,name,PsTD,Int/n1988-06-05,BAL,QB,Ryan Mallett,5,6/n1987-11-03,SF,QB,Colin Kaepernick,6,5/n1989-01-20,STL,QB,Nick Foles,7,10/n1976-03-24,DEN,QB,Peyton Manning,9,17/n1975-09-25,IND,QB,Matt Hasselbeck,9,5/n1990-11-22,DEN,QB,Brock Osweiler,10,6/n1989-10-15,SF,QB,Blaine Gabbert,10,7/n1979-07-04,CLE,QB,Josh McCown,12,4/n1985-01-16,BAL,QB,Joe Flacco,14,12/n1992-11-10,MIN,QB,Teddy Bridgewater,14,9/n1989-09-12,IND,QB,Andrew Luck,15,12/n1987-11-08,PHI,QB,Sam Bradford,19,14/n1985-10-13,HOU,QB,Brian Hoyer,19,7/n1993-10-30,TEN,QB,Marcus Mariota,19,10/n1989-08-03,BUF,QB,Tyrod Taylor,20,6/n1984-05-07,KC,QB,Alex Smith,20,7/n1985-05-17,ATL,QB,Matt Ryan,21,16/n1983-04-29,CHI,QB,Jay Cutler,21,11/n1982-03-02,PIT,QB,Ben Roethlisberger,21,16/n1994-01-06,TB,QB,Jameis Winston,22,15/n1988-07-27,MIA,QB,Ryan Tannehill,24,12/n1987-10-29,CIN,QB,Andy Dalton,25,7/n1988-08-19,WAS,QB,Kirk Cousins,29,11/n1981-12-08,SD,QB,Philip Rivers,29,13/n1982-11-24,NYJ,QB,Ryan Fitzpatrick,31,15/n1983-12-02,GB,QB,Aaron Rodgers,31,8/n1988-02-07,DET,QB,Matthew Stafford,32,13/n1979-01-15,NO,QB,Drew Brees,32,11/n1991-03-28,OAK,QB,Derek Carr,32,13/n1988-11-29,SEA,QB,Russell Wilson,34,8/n1989-05-11,CAR,QB,Cam Newton,35,10/n1979-12-27,ARI,QB,Carson Palmer,35,11/n1981-01-03,NYG,QB,Eli Manning,35,14/n1992-04-28,JAC,QB,Blake Bortles,35,18/n1977-08-03,NE,QB,Tom Brady,36,7/n';
        
        return playersPage.readAndDeleteCSV().then(function(fileContents) {
          assert.equal(fileContents, exportFileContents);  
        })
      });
    });
  });

  test.describe('#Section: Groups', function() {
    test.describe('#Page: Overview', function() {
      test.it('test setup', function() {
        navbar.goToGroupsPage();
        filters.changeValuesForSeasonWeekDropdownFilter(2016, 'W1', 2016, 'W17', true);
        groupsPage.waitForTableToLoad();
      });

      test.it('clicking export button', function() {
        groupsPage.clickExportLink();
      });
      
      test.it('export csv file should have the correct data', function() {
        var exportFileContents = 'division,G,W,L,T,Win%,PS,PA,PM,Yds,OpYds,TO,OpTO,TOMgn,TOP,OpTOP,TopMgn/nNFC East,64,39,24,1,.617,1494,1304,190,23170,22468,83,92,9,30:42,29:45,0:57/nAFC West,64,38,26,0,.594,1548,1416,132,22338,22508,91,118,27,30:29,30:26,0:02/nAFC East,64,36,28,0,.563,1478,1417,61,22438,22536,80,80,0,30:10,30:28,-0:18/nNFC South,64,33,31,0,.516,1732,1631,101,24510,23588,91,99,8,30:46,29:31,1:15/nNFC North,64,30,34,0,.469,1384,1452,-68,22066,22085,79,77,-2,30:00,30:11,-0:10/nAFC South,64,29,35,0,.453,1389,1498,-109,21952,21814,93,65,-28,30:31,29:41,0:50/nAFC North,64,26,37,1,.414,1331,1415,-84,22212,22527,83,84,1,30:01,30:41,-0:39/nNFC West,64,23,39,2,.375,1305,1528,-223,20716,21876,100,85,-15,29:18,31:15,-1:57/n';
        
        return groupsPage.readAndDeleteCSV().then(function(fileContents) {
          assert.equal(fileContents, exportFileContents);  
        })
      });
    });
  });

  test.describe('#Section: Performance', function() {
    test.describe('#Page: Practice and Games', function() {
      test.it('test setup', function() {
        navbar.goToPerformancePage();
        filters.removeSelectionFromDropdownFilter('Season', 2017, true);
        performancePage.waitForTableToLoad();
      });

      test.it('clicking export summary button returns correct CSV', function() {
        performancePage.clickPracticesAndGamesExportLink();
      });
      
      test.it('summary csv file should have the correct data', function() {
        var exportFileContents = 'startTime,seasonContents,year,Desc,date,week,trackedDuration,result/n11:50:00,Practice,2016,Intensity: medium,2017-04-20,17,1:55:00,Drills: 9/n11:50:00,Practice,2016,Intensity: low,2017-04-19,17,1:05:00,Drills: 9/n12:00:00,Practice,2016,Intensity: medium,2017-04-18,17,0:50:59,Drills: 8/n11:52:00,Practice,2016,Intensity: high,2017-04-13,17,0:49:00,Drills: 9/n12:00:00,Practice,2016,Intensity: medium,2017-04-12,17,0:46:03,Drills: 9/n11:15:00,Practice,2016,Intensity: medium,2017-03-24,17,0:47:10,Drills: 8/n10:59:21,Practice,2016,Intensity: medium,2017-03-23,17,0:35:01,Drills: 9/n10:37:23,Practice,2016,Intensity: medium,2017-03-21,17,0:43:48,Drills: 1/n14:06:05,Practice,2016,Intensity: low,2017-03-17,17,0:00:00,Drills: 0/n/n16:25:00,Game,2016,Seahawks,2017-01-01,17,2:47:19,L 23 - 25/n12:53:32,Practice,2016,Intensity: low,2016-12-31,17,1:00:45,Drills: 4/n13:42:25,Practice,2016,Intensity: medium,2016-12-29,17,1:58:07,Drills: 20/n13:43:40,Practice,2016,Intensity: medium,2016-12-28,17,1:49:13,Drills: 19/n13:48:07,Practice,2016,Intensity: low,2016-12-27,17,1:11:04,Drills: 14/n/n16:25:00,Game,2016,Rams,2016-12-24,16,2:52:42,W 22 - 21/n13:39:17,Practice,2016,Intensity: low,2016-12-23,16,1:04:10,Drills: 4/n13:42:56,Practice,2016,Intensity: medium,2016-12-21,16,1:55:25,Drills: 20/n13:42:22,Practice,2016,Intensity: medium,2016-12-20,16,1:45:52,Drills: 16/n/n16:05:00,Game,2016,Falcons,2016-12-18,15,2:36:37,L 13 - 41/n12:56:49,Practice,2016,Intensity: high,2016-12-15,15,2:06:18,Drills: 21/n13:42:48,Practice,2016,Intensity: low,2016-12-14,15,1:55:49,Drills: 21/n13:49:22,Practice,2016,Intensity: low,2016-12-13,15,1:10:04,Drills: 14/n/n16:05:00,Game,2016,Jets,2016-12-11,14,3:02:09,L 17 - 23/n12:53:42,Practice,2016,Intensity: low,2016-12-10,14,0:56:01,Drills: 4/n13:42:26,Practice,2016,Intensity: high,2016-12-08,14,2:02:54,Drills: 24/n13:42:52,Practice,2016,Intensity: medium,2016-12-07,14,1:56:58,Drills: 21/n13:52:38,Practice,2016,Intensity: low,2016-12-06,14,1:07:28,Drills: 14/n13:00:00,Game,2016,Bears,2016-12-04,13,2:50:23,L 6 - 26/n/n13:00:00,Game,2016,Dolphins,2016-11-27,12,3:03:34,L 24 - 31/n13:03:07,Practice,2016,Intensity: high,2016-11-24,12,2:18:38,Drills: 24/n13:43:42,Practice,2016,Intensity: medium,2016-11-23,12,1:53:26,Drills: 21/n13:51:31,Practice,2016,Intensity: low,2016-11-22,12,1:08:06,Drills: 14/n/n16:25:00,Game,2016,Patriots,2016-11-20,11,2:47:54,L 17 - 30/n12:56:22,Practice,2016,Intensity: low,2016-11-19,11,1:01:30,Drills: 4/n13:48:12,Practice,2016,Intensity: high,2016-11-17,11,2:17:15,Drills: 24/n13:42:48,Practice,2016,Intensity: medium,2016-11-16,11,1:59:20,Drills: 21/n13:51:07,Practice,2016,Intensity: low,2016-11-15,11,1:05:23,Drills: 14/n/n16:25:00,Game,2016,Cardinals,2016-11-13,10,3:06:20,L 20 - 23/n12:56:27,Practice,2016,Intensity: low,2016-11-12,10,1:04:44,Drills: 4/n13:43:51,Practice,2016,Intensity: high,2016-11-10,10,2:27:39,Drills: 24/n13:44:11,Practice,2016,Intensity: medium,2016-11-09,10,1:54:44,Drills: 21/n13:51:17,Practice,2016,Intensity: low,2016-11-08,10,1:07:19,Drills: 14/n/n15:05:00,Game,2016,Saints,2016-11-06,9,2:58:58,L 23 - 41/n12:56:57,Practice,2016,Intensity: low,2016-11-05,9,1:01:21,Drills: 4/n13:43:17,Practice,2016,Intensity: high,2016-11-03,9,2:16:37,Drills: 24/n13:45:13,Practice,2016,Intensity: medium,2016-11-02,9,1:53:27,Drills: 21/n13:48:32,Practice,2016,Intensity: low,2016-11-01,9,1:11:10,Drills: 14/n/n16:05:00,Game,2016,Buccaneers,2016-10-23,7,2:58:16,L 17 - 34/n12:57:03,Practice,2016,Intensity: low,2016-10-22,7,0:58:47,Drills: 4/n13:43:41,Practice,2016,Intensity: high,2016-10-20,7,2:16:32,Drills: 24/n13:43:26,Practice,2016,Intensity: medium,2016-10-19,7,1:54:45,Drills: 21/n13:51:40,Practice,2016,Intensity: low,2016-10-18,7,1:06:07,Drills: 14/n/n13:00:00,Game,2016,Bills,2016-10-16,6,3:06:26,L 16 - 45/n12:05:43,Practice,2016,Intensity: low,2016-10-14,6,0:48:46,Drills: 1/n13:44:10,Practice,2016,Intensity: high,2016-10-13,6,2:16:30,Drills: 24/n13:43:56,Practice,2016,Intensity: medium,2016-10-12,6,1:52:57,Drills: 21/n13:48:55,Practice,2016,Intensity: low,2016-10-11,6,1:09:37,Drills: 14/n12:59:05,Practice,2016,Intensity: low,2016-10-10,6,2:36:55,Drills: 1/n13:19:00,Practice,2016,Intensity: low,2016-10-08,6,0:32:57,Drills: 1/n12:27:42,Practice,2016,Intensity: low,2016-10-07,6,1:14:53,Drills: 1/n/n20:25:00,Game,2016,Cardinals,2016-10-06,5,2:47:14,L 21 - 33/n13:15:11,Practice,2016,Intensity: low,2016-10-05,5,1:01:45,Drills: 4/n/n16:25:00,Game,2016,Cowboys,2016-10-02,4,2:41:18,L 17 - 24/n12:44:42,Practice,2016,Intensity: low,2016-10-01,4,1:08:42,Drills: 4/n12:47:01,Practice,2016,Intensity: low,2016-09-30,4,0:44:09,Drills: 1/n13:44:51,Practice,2016,Intensity: high,2016-09-29,4,2:22:30,Drills: 24/n13:44:03,Practice,2016,Intensity: medium,2016-09-28,4,1:56:56,Drills: 21/n13:52:24,Practice,2016,Intensity: low,2016-09-27,4,1:12:19,Drills: 14/n/n16:05:00,Game,2016,Seahawks,2016-09-25,3,2:41:53,L 18 - 37/n12:44:08,Practice,2016,Intensity: low,2016-09-24,3,1:11:28,Drills: 4/n12:58:58,Practice,2016,Intensity: low,2016-09-23,3,0:57:35,Drills: 1/n13:34:17,Practice,2016,Intensity: high,2016-09-22,3,2:19:04,Drills: 24/n13:33:58,Practice,2016,Intensity: medium,2016-09-21,3,1:56:57,Drills: 21/n13:41:41,Practice,2016,Intensity: low,2016-09-20,3,1:05:04,Drills: 14/n/n13:00:00,Game,2016,Panthers,2016-09-18,2,3:37:50,L 27 - 46/n13:34:45,Practice,2016,Intensity: high,2016-09-15,2,2:22:15,Drills: 23/n13:36:51,Practice,2016,Intensity: medium,2016-09-14,2,1:45:44,Drills: 18/n/n22:20:00,Game,2016,Rams,2016-09-12,1,2:46:31,W 28 - 0/n12:58:45,Practice,2016,Intensity: low,2016-09-11,1,0:54:17,Drills: 4/n13:34:38,Practice,2016,Intensity: high,2016-09-09,1,2:09:03,Drills: 24/n13:34:13,Practice,2016,Intensity: medium,2016-09-08,1,1:47:23,Drills: 20/n13:36:26,Practice,2016,Intensity: low,2016-09-07,1,1:08:17,Drills: 14/n12:59:47,Practice,2016,Intensity: low,2016-09-05,1,1:04:50,Drills: 1/n14:09:16,Practice,2016,Intensity: low,2016-09-04,1,0:33:36,Drills: 1/n/n22:00:00,Game,2016,Chargers,2016-09-01,P5,2:42:57,W 31 - 21/n13:01:10,Practice,2016,Intensity: low,2016-08-31,P5,0:48:42,Drills: 10/n13:36:09,Practice,2016,Intensity: low,2016-08-30,P5,0:59:00,Drills: 13/n13:33:28,Practice,2016,Intensity: high,2016-08-29,P5,1:53:38,Drills: 20/n14:49:49,Practice,2016,Intensity: low,2016-08-28,P5,1:02:40,Drills: 13/n/n22:00:00,Game,2016,Packers,2016-08-26,P4,2:41:48,L 10 - 21/n12:53:56,Practice,2016,Intensity: low,2016-08-25,P4,1:00:54,Drills: 7/n13:33:21,Practice,2016,Intensity: low,2016-08-23,P4,2:07:04,Drills: 19/n13:35:20,Practice,2016,Intensity: low,2016-08-22,P4,0:59:32,Drills: 13/n/n21:00:00,Game,2016,Broncos,2016-08-20,P3,2:47:11,W 31 - 24/n13:34:50,Practice,2016,Intensity: low,2016-08-16,P3,1:14:18,Drills: 13/n/n19:00:00,Game,2016,Texans,2016-08-14,P2,0:00:00,L 13 - 24/n13:32:36,Practice,2016,Intensity: high,2016-08-12,P2,2:18:36,Drills: 13/n13:35:22,Practice,2016,Intensity: low,2016-08-11,P2,0:59:55,Drills: 13/n13:32:28,Practice,2016,Intensity: low,2016-08-09,P2,2:04:26,Drills: 19/n13:32:07,Practice,2016,Intensity: high,2016-08-07,P2,1:57:58,Drills: 19/n13:34:41,Practice,2016,Intensity: low,2016-08-06,P2,1:01:08,Drills: 13/n13:33:33,Practice,2016,Intensity: medium,2016-08-05,P2,1:36:15,Drills: 16/n13:32:41,Practice,2016,Intensity: high,2016-08-04,P2,2:00:39,Drills: 19/n13:33:31,Practice,2016,Intensity: high,2016-08-02,P2,2:03:14,Drills: 19/n13:35:34,Practice,2016,Intensity: medium,2016-08-01,P2,1:31:37,Drills: 16/n13:25:00,Practice,2016,Intensity: medium,2016-07-31,P2,1:41:00,Drills: 16/n12:30:18,Practice,2016,Intensity: low,2016-07-30,P2,0:35:16,Drills: 5/n11:36:27,Practice,2016,Intensity: low,2016-06-16,P2,0:58:18,Drills: 1/n13:31:29,Practice,2016,Intensity: low,2016-06-15,P2,0:34:40,Drills: 1/n13:45:07,Practice,2016,Intensity: low,2016-06-09,P2,1:49:11,Drills: 19/n13:45:51,Practice,2016,Intensity: high,2016-06-08,P2,1:53:14,Drills: 18/n13:45:38,Practice,2016,Intensity: low,2016-06-07,P2,1:52:05,Drills: 19/n13:46:06,Practice,2016,Intensity: low,2016-06-02,P2,1:47:46,Drills: 19/n13:45:28,Practice,2016,Intensity: low,2016-06-01,P2,1:05:42,Drills: 12/n13:45:11,Practice,2016,Intensity: low,2016-05-31,P2,1:51:53,Drills: 19/n13:44:22,Practice,2016,Intensity: low,2016-05-26,P2,1:52:06,Drills: 19/n13:44:27,Practice,2016,Intensity: low,2016-05-25,P2,1:53:31,Drills: 19/n13:43:44,Practice,2016,Intensity: low,2016-05-24,P2,1:52:45,Drills: 19/n13:18:57,Practice,2016,Intensity: low,2016-05-23,P2,0:53:10,Drills: 6/n12:38:50,Practice,2016,Intensity: low,2016-05-20,P2,0:55:01,Drills: 3/n13:45:06,Practice,2016,Intensity: low,2016-05-19,P2,1:52:39,Drills: 20/n13:44:50,Practice,2016,Intensity: low,2016-05-18,P2,1:52:33,Drills: 20/n13:43:12,Practice,2016,Intensity: ,2016-05-17,P2,2:07:44,Drills: 21/n13:16:10,Practice,2016,Intensity: ,2016-05-16,P2,1:02:37,Drills: 6/n12:38:44,Practice,2016,Intensity: ,2016-05-13,P2,0:56:57,Drills: 9/n13:17:14,Practice,2016,Intensity: ,2016-05-12,P2,1:14:00,Drills: 11/n13:17:52,Practice,2016,Intensity: ,2016-05-11,P2,1:07:49,Drills: 11/n13:17:05,Practice,2016,Intensity: ,2016-05-10,P2,1:21:18,Drills: 11/n13:15:59,Practice,2016,Intensity: ,2016-05-09,P2,1:08:33,Drills: 10/n13:18:50,Practice,2016,Intensity: ,2016-05-08,P2,1:26:20,Drills: 14/n13:18:56,Practice,2016,Intensity: ,2016-05-07,P2,1:28:29,Drills: 14/n13:39:46,Practice,2016,Intensity: ,2016-05-06,P2,0:37:33,Drills: 2/n13:16:40,Practice,2016,Intensity: ,2016-05-03,P2,1:25:30,Drills: 11/n13:16:08,Practice,2016,Intensity: ,2016-05-02,P2,1:12:53,Drills: 11/n13:15:39,Practice,2016,Intensity: ,2016-04-28,P2,1:50:50,Drills: 21/n13:17:35,Practice,2016,Intensity: ,2016-04-27,P2,1:50:52,Drills: 21/n13:16:05,Practice,2016,Intensity: ,2016-04-26,P2,1:51:06,Drills: 21/n13:14:09,Practice,2016,Intensity: ,2016-04-21,P2,1:44:11,Drills: 11/n13:14:19,Practice,2016,Intensity: ,2016-04-20,P2,1:25:33,Drills: 11/n13:15:12,Practice,2016,Intensity: ,2016-04-19,P2,1:06:03,Drills: 10/n13:10:48,Practice,2016,Intensity: ,2016-04-18,P2,1:07:46,Drills: 10/n13:47:03,Practice,2016,Intensity: ,2016-04-15,P2,1:04:01,Drills: 1/n13:42:10,Practice,2016,Intensity: ,2016-04-14,P2,0:12:56,Drills: 41/n13:26:02,Practice,2016,Intensity: ,2016-04-13,P2,0:42:40,Drills: 1/n13:25:53,Practice,2016,Intensity: ,2016-04-12,P2,0:20:27,Drills: 4/n13:21:40,Practice,2016,Intensity: ,2016-04-11,P2,0:30:09,Drills: 1/n12:52:56,Practice,2016,Intensity: ,2016-04-08,P2,0:50:57,Drills: 1/n13:22:10,Practice,2016,Intensity: ,2016-04-07,P2,1:00:30,Drills: 1/n13:20:39,Practice,2016,Intensity: ,2016-04-06,P2,0:31:49,Drills: 1/n13:18:41,Practice,2016,Intensity: ,2016-04-05,P2,1:01:29,Drills: 1/n13:22:38,Practice,2016,Intensity: ,2016-04-04,P2,0:52:17,Drills: 1/n19:29:37,Practice,2016,Intensity: ,2016-04-03,P2,0:00:00,Drills: 0/n';
        
        return performancePage.readAndDeleteCSV().then(function(fileContents) {
          assert.equal(fileContents, exportFileContents);  
        })
      });    
    });
    
    test.describe('#Page: Performance Stats', function() {
      test.it('test setup', function() {
        performancePage.goToSection('performanceStats');
        filters.changeValuesForSeasonWeekDropdownFilter(2016, 'W1', 2016, 'W16', true);
        performancePage.waitForTableToLoad();
      });

      test.it('clicking export button', function() {
        performancePage.clickStatsExportLink();
      });
      
      test.it('export csv file should have the correct data', function() {
        var exportFileContents = 'Rank,dateOfBirth,player,primaryPosition,teamAbbrev,Pract,G,TimeMoving,DistTotal,RelTargetMPH,RelWalkYds,RelJogYds,RelRunYds,RelSprintYds,RelMaxSprintYds,RelWalkTime,RelJogTime,RelRunTime,RelSprintTime,RelMaxSprintTime,RelHardEffortDist,RelSprintCount,RelMaxSprintCount/n1,1993-12-23,Aaron Burbridge,WR,SF,42,15,1d 07:46,232,207,21.8,63,588,144,688,19,795,3321,815,16:04:02,14:49:48,0:45:22,0:06:10,0:01:21,23,931,189,53/n2,1990-08-09,Quinton Patton,WR,SF,35,14,1d 09:20,229,482,21.4,65,758,141,350,18,827,2809,739,16:49:49,15:40:18,0:43:53,0:05:17,0:01:15,22,375,157,51/n3,1988-11-08,Jeremy Kerley,WR,SF,37,15,1d 08:37,218,709,22.1,69,554,135,678,13,218,252,6,17:34:44,14:31:40,0:30:31,0:00:28,0:00:00,13,476,21,1/n4,1988-05-29,Garrett Celek,TE,SF,44,15,1d 07:38,213,954,19.2,71,979,120,159,16,982,3938,896,17:58:31,12:46:24,0:43:33,0:08:21,0:01:40,21,816,247,57/n5,1988-02-09,Rod Streater,WR,SF,39,15,1d 06:44,212,318,22.4,71,052,119,703,18,103,2643,816,18:28:02,11:30:05,0:40:34,0:04:44,0:01:19,21,562,127,44/n6,1991-12-01,Dontae Johnson,DB,SF,37,14,1d 05:45,199,871,20.7,66,532,116,140,13,159,2941,1100,16:56:38,12:10:03,0:31:36,0:05:43,0:01:55,17,199,119,70/n7,1991-08-07,Blake Bell,TE,SF,35,13,1d 08:18,198,895,19.6,68,948,113,131,13,140,2574,1102,17:47:59,13:50:44,0:32:55,0:05:17,0:02:01,16,816,108,61/n8,1992-02-18,Jaquiski Tartt,DB,SF,37,14,1d 07:02,195,313,22.3,72,509,114,185,6967,1117,535,18:21:07,12:22:58,0:15:53,0:02:01,0:00:52,8619,48,32/n9,1986-12-07,Michael Wilhoite,LB,SF,37,15,1d 04:13,193,676,19.9,58,802,121,706,10,119,2519,530,14:51:15,12:50:55,0:25:10,0:05:05,0:00:58,13,168,111,40/n10,1989-05-12,Nick Bellore,LB,SF,43,14,1d 07:34,189,667,23.2,73,094,110,807,5660,95,10,18:48:49,12:32:44,0:12:14,0:00:10,0:00:00,5765,8,1/n11,1988-08-20,Tramaine Brock,DB,SF,37,15,1d 06:01,187,138,21.7,69,221,111,095,6037,579,205,17:32:49,12:13:18,0:14:03,0:01:04,0:00:20,6822,37,12/n12,1991-07-18,Jimmie Ward,DB,SF,34,11,1d 04:24,184,984,23.5,66,178,111,057,7189,540,20,16:53:21,11:14:12,0:15:34,0:00:56,0:00:01,7749,33,2/n13,1993-03-11,Prince Charles Iworah,DB,SF,43,1,1d 04:09,184,618,22.7,66,017,110,044,7589,768,199,16:49:28,11:01:05,0:16:53,0:01:21,0:00:19,8556,46,10/n14,1995-07-23,Rashard Robinson,DB,SF,32,13,1d 04:11,182,892,22.6,62,994,110,262,7842,1276,517,16:06:34,11:44:13,0:17:29,0:02:15,0:00:49,9635,72,28/n15,1993-12-07,Chris Harper,WR,SF,36,8,1d 02:22,181,199,19.5,57,450,102,669,16,815,3468,797,14:47:54,10:43:02,0:42:28,0:07:10,0:01:28,21,080,217,67/n16,1992-06-15,Je\'Ron Hamm,TE,SF,40,5,1d 02:17,177,520,21.2,54,311,110,480,11,279,1119,332,14:00:14,11:47:37,0:26:44,0:02:07,0:00:34,12,729,57,19/n17,1990-12-03,Marcus Cromartie,DB,SF,37,9,1d 05:33,175,553,22.8,74,803,94,499,5090,967,194,19:23:47,9:56:34,0:11:10,0:01:42,0:00:18,6252,47,12/n18,1991-01-17,Gerald Hodges,LB,SF,37,14,1d 04:25,172,726,20.0,68,361,97,383,5764,869,350,17:35:25,10:33:07,0:14:29,0:01:44,0:00:37,6983,37,25/n19,1991-07-31,Keith Reaser,DB,SF,36,14,1d 02:20,168,685,20.3,60,707,97,438,9178,980,382,15:26:40,10:28:47,0:22:30,0:01:57,0:00:40,10,540,55,31/n20,1984-07-27,Antoine Bethea,DB,SF,38,15,1d 04:47,168,531,20.8,70,262,92,166,5639,352,112,18:23:36,10:09:35,0:13:47,0:00:41,0:00:11,6103,29,5/n21,1987-12-07,Shaun Draughn,RB,SF,37,15,1d 01:13,167,016,21.3,63,847,85,717,14,284,1979,1188,16:18:45,8:15:45,0:33:26,0:03:43,0:02:00,17,452,78,74/n22,1990-06-13,Vance McDonald,TE,SF,31,11,1d 00:34,160,579,20.4,53,948,93,364,11,744,1231,292,13:18:54,10:44:09,0:28:29,0:02:28,0:00:30,13,267,79,16/n23,1994-01-20,Eli Harold,LB,SF,37,15,1d 03:11,157,727,19.5,67,933,83,775,4293,895,831,17:38:54,9:18:12,0:10:59,0:01:51,0:01:29,6018,42,36/n24,1989-01-26,Torrey Smith,WR,SF,29,12,22:01:49,156,035,21.0,45,373,94,765,13,581,1826,489,11:29:23,9:55:48,0:32:17,0:03:29,0:00:50,15,897,103,34/n25,1990-07-09,Shayne Skov,LB,SF,34,9,1d 01:05,155,457,19.0,58,434,86,188,7342,2184,1308,14:40:33,9:58:24,0:19:09,0:04:38,0:02:28,10,835,90,71/n26,1993-02-19,Mike Davis,RB,SF,37,8,22:00:09,146,187,18.6,47,984,81,998,12,973,2281,952,12:50:54,8:27:59,0:34:31,0:04:56,0:01:48,16,206,138,57/n27,1988-09-03,DuJuan Harris,RB,SF,37,9,21:38:40,145,304,20.6,50,242,82,418,11,783,729,131,13:00:35,8:07:43,0:28:41,0:01:26,0:00:13,12,644,46,8/n28,1991-12-10,Eric Reid,DB,SF,26,10,23:43:33,137,907,19.1,59,356,71,582,5762,880,326,15:13:42,8:12:14,0:15:07,0:01:52,0:00:35,6968,66,25/n29,1994-03-17,DeForest Buckner,DL,SF,39,14,23:12:05,136,896,16.0,52,491,78,340,5287,567,210,13:53:04,9:00:29,0:16:37,0:01:25,0:00:28,6065,47,16/n30,1993-01-21,Ronald Blair,DL,SF,37,14,21:13:09,136,619,17.2,44,309,84,883,6221,729,476,11:24:07,9:27:59,0:18:22,0:01:41,0:00:58,7426,49,27/n31,1989-02-18,Tank Carradine,LB,SF,37,13,1d 00:21,134,682,18.2,61,219,70,424,2674,315,49,16:03:09,8:09:51,0:07:21,0:00:42,0:00:05,3038,27,4/n32,1984-03-14,Ahmad Brooks,LB,SF,35,15,23:45:40,133,066,18.6,61,520,68,149,3037,310,50,15:52:56,7:43:42,0:08:16,0:00:40,0:00:05,3397,31,3/n33,1993-03-29,JaCorey Shepherd,DB,SF,26,9,20:03:50,131,858,21.4,42,839,81,248,7006,682,82,10:55:13,8:50:50,0:16:20,0:01:17,0:00:08,7770,41,8/n34,1990-09-20,Carlos Hyde,RB,SF,33,13,20:55:13,131,301,19.1,52,642,65,538,11,710,1155,255,13:20:09,7:01:27,0:30:39,0:02:27,0:00:28,13,121,73,19/n35,1991-12-03,DeAndre Smelter,WR,SF,22,1,18:29:02,120,031,20.1,44,032,63,716,10,348,1754,181,11:26:30,6:33:19,0:25:20,0:03:32,0:00:19,12,284,132,13/n36,1992-12-28,Curtis Grant,LB,SF,32,0,19:22:47,119,657,18.7,43,325,69,727,5496,1040,69,10:57:18,8:08:25,0:14:40,0:02:15,0:00:07,6605,73,6/n37,1991-06-19,Marcus Rush,LB,SF,37,0,20:25:44,115,007,23.2,52,016,62,350,629,12,0,13:16:50,7:07:26,0:01:26,0:00:01,0:00:00,641,1,0/n38,1987-11-03,Colin Kaepernick,QB,SF,37,11,19:29:22,114,339,20.3,48,604,59,824,4739,1001,171,12:54:02,6:21:13,0:11:47,0:01:59,0:00:18,5912,57,13/n39,1991-04-20,Mike Purcell,DL,SF,37,14,19:48:12,112,113,18.7,46,899,64,359,815,35,5,12:17:12,7:28:38,0:02:15,0:00:04,0:00:00,855,4,0/n40,1994-06-01,Bradley Pinion,P,SF,37,15,21:02:21,110,946,16.8,56,959,52,127,1629,134,97,14:23:39,6:33:11,0:04:57,0:00:19,0:00:12,1860,6,4/n41,1986-11-19,Zane Beadles,OL,SF,37,15,19:44:09,109,456,18.3,46,409,62,424,623,0,0,12:03:59,7:38:22,0:01:47,0:00:00,0:00:00,623,0,0/n42,1994-08-25,Norman Price,OL,SF,46,0,19:42:59,107,894,15.9,48,400,55,967,2579,528,420,12:51:46,6:40:56,0:08:01,0:01:19,0:00:56,3526,27,22/n43,1990-03-29,Tony Jerod-Eddie,DL,SF,37,9,19:50:20,107,445,15.8,48,980,56,725,1507,194,39,12:58:20,6:46:35,0:04:48,0:00:29,0:00:05,1739,21,3/n44,1994-02-21,Joshua Garnett,OL,SF,37,14,19:43:46,106,544,17.8,49,266,56,189,1074,14,0,12:58:03,6:42:34,0:03:06,0:00:01,0:00:00,1089,1,0/n45,1989-10-15,Blaine Gabbert,QB,SF,37,6,18:54:47,104,862,20.4,46,699,54,819,2921,318,105,12:27:43,6:18:57,0:07:17,0:00:38,0:00:11,3344,23,9/n46,1993-04-13,Trent Brown,OL,SF,37,15,20:24:31,103,703,15.5,53,534,48,672,1336,110,51,14:06:19,6:13:22,0:04:24,0:00:17,0:00:06,1497,16,5/n47,1991-10-25,Vinnie Sunseri,DB,SF,20,5,14:53:29,101,927,21.0,30,224,64,454,5818,1038,393,7:40:28,6:56:28,0:13:51,0:01:59,0:00:40,7249,47,24/n48,1987-12-18,Daniel Kilgore,OL,SF,32,13,18:48:37,100,989,17.9,48,922,51,109,922,35,0,12:42:02,6:03:53,0:02:36,0:00:04,0:00:00,957,4,0/n49,1994-03-01,Alex Balducci,OL,SF,41,1,18:48:32,100,433,19.2,49,335,49,134,1796,168,0,12:52:05,5:51:25,0:04:39,0:00:21,0:00:00,1964,13,0/n50,1994-01-19,John Theus,OL,SF,38,3,18:55:25,100,113,17.6,48,913,50,251,862,76,10,12:49:50,6:02:54,0:02:29,0:00:10,0:00:01,949,3,1/n51,1986-10-03,Kyle Nelson,SPEC,SF,37,15,17:19:34,99,993,19.4,45,904,45,715,4691,2214,1470,11:54:35,5:05:48,0:11:50,0:04:37,0:02:42,8374,84,74/n52,1993-09-28,Kelvin Taylor,RB,SF,33,0,15:32:21,97,297,18.4,36,078,52,934,7076,1065,143,9:21:02,5:49:35,0:19:06,0:02:20,0:00:16,8285,75,10/n53,1989-03-13,Andrew Tiller,OL,SF,37,15,17:54:18,93,975,19.4,44,614,49,280,77,1,3,11:41:06,6:12:59,0:00:12,0:00:00,0:00:00,80,0,0/n54,1985-08-01,Glenn Dorsey,DL,SF,38,11,16:48:13,92,723,15.6,42,320,47,254,2691,409,49,11:14:18,5:23:59,0:08:44,0:01:03,0:00:06,3150,44,6/n55,1990-07-21,Quinton Dial,DL,SF,33,13,16:44:38,90,789,16.0,42,411,46,061,2101,177,39,11:16:14,5:21:16,0:06:35,0:00:26,0:00:05,2317,18,4/n56,1984-08-30,Joe Staley,OL,SF,31,12,17:18:34,89,457,19.4,45,274,43,520,583,54,26,11:47:40,5:29:13,0:01:30,0:00:06,0:00:02,663,4,1/n57,1993-11-29,Marcus Martin,OL,SF,37,4,17:26:09,88,758,15.9,47,362,39,654,1670,68,5,12:34:55,4:45:44,0:05:18,0:00:10,0:00:00,1743,7,1/n58,1988-02-25,Christian Ponder,QB,SF,39,0,15:23:03,79,636,17.6,41,094,36,435,1785,231,91,11:14:07,4:03:05,0:05:07,0:00:31,0:00:11,2106,15,6/n59,1993-08-30,Mose Frazier,WR,SF,16,0,10:46:38,75,380,19.5,21,091,46,706,6332,1089,162,5:27:11,5:00:54,0:15:59,0:02:15,0:00:18,7583,61,13/n60,1975-01-23,Phil Dawson,K,SF,37,15,15:46:30,72,868,15.9,48,878,22,416,1532,17,25,12:51:47,2:49:45,0:04:51,0:00:02,0:00:03,1573,2,1/n61,1993-03-08,Aaron Lynch,LB,SF,28,6,12:58:56,71,569,21.5,34,846,35,373,1340,6,4,8:57:19,3:58:26,0:03:10,0:00:00,0:00:00,1350,1,1/n62,1992-07-20,Dres Anderson,WR,SF,15,0,10:59:27,69,394,21.4,25,945,38,928,4258,195,67,6:46:05,4:02:52,0:10:00,0:00:22,0:00:06,4520,12,3/n63,1993-11-15,Arik Armstead,DL,SF,21,8,11:10:30,64,519,17.2,27,130,35,066,2090,145,88,7:11:31,3:52:10,0:06:17,0:00:20,0:00:11,2323,6,8/n64,1990-07-12,Chris Jones,DL,SF,18,5,10:25:08,64,010,18.9,23,509,39,381,1106,13,0,6:13:37,4:08:28,0:03:00,0:00:01,0:00:00,1120,1,0/n65,1993-12-28,Will Redmond,DB,SF,24,0,8:36:47,58,468,20.5,21,549,28,514,6041,1533,831,5:25:14,2:52:26,0:14:40,0:03:01,0:01:24,8404,55,34/n66,1993-04-30,Fahn Cooper,OL,SF,22,0,10:09:17,55,763,15.8,24,896,28,832,1659,316,60,6:34:16,3:28:49,0:05:14,0:00:48,0:00:08,2034,24,4/n67,1990-11-04,Chris Davis,DB,SF,12,4,8:42:08,53,045,20.2,22,386,27,698,2555,319,87,5:42:13,2:52:45,0:06:22,0:00:37,0:00:09,2961,14,6/n68,1987-07-21,Marcus Ball,DB,SF,10,4,7:36:13,51,658,22.2,15,682,33,117,2240,487,133,3:59:31,3:30:29,0:05:06,0:00:52,0:00:13,2859,19,8/n69,1991-02-22,Taylor Hart,DL,SF,21,1,8:59:57,51,418,16.4,21,759,27,776,1640,196,46,5:45:12,3:09:06,0:05:03,0:00:29,0:00:05,1883,21,2/n70,1988-05-28,NaVorro Bowman,LB,SF,11,4,7:49:53,43,774,17.2,19,902,21,906,1597,290,80,5:12:57,2:31:27,0:04:37,0:00:40,0:00:10,1966,28,7/n71,1990-03-15,Keshawn Martin,WR,SF,12,1,7:05:18,43,729,19.7,18,006,21,623,3671,347,82,4:43:16,2:11:52,0:09:17,0:00:42,0:00:09,4100,25,7/n72,1989-12-29,Colin Kelly,OL,SF,14,0,6:28:02,33,903,13.6,17,459,14,266,1776,266,136,4:35:38,1:44:42,0:06:32,0:00:46,0:00:21,2178,23,12/n73,1992-04-09,Raheem Mostert,RB,SF,8,0,4:35:46,31,341,22.3,9757,19,767,1764,52,0,2:34:25,1:57:10,0:04:04,0:00:05,0:00:00,1816,4,0/n74,1994-09-20,Wynton McManis,LB,SF,8,1,4:48:11,30,092,19.8,10,928,17,893,1177,93,1,2:47:22,1:57:39,0:02:56,0:00:11,0:00:00,1271,10,0/n75,1991-03-05,Ray-Ray Armstrong,LB,SF,5,2,4:12:51,24,009,17.8,11,152,11,245,1232,245,134,2:53:14,1:15:24,0:03:24,0:00:33,0:00:15,1611,18,8/n76,1989-10-11,Anthony Davis,OL,SF,6,1,2:29:20,13,316,13.9,6213,6456,567,47,32,1:38:51,0:48:11,0:02:04,0:00:08,0:00:04,646,3,3/n77,1991-12-19,DiAndre Campbell,WR,SF,2,0,1:32:38,10,726,19.5,2902,6757,998,69,0,0:44:54,0:45:04,0:02:31,0:00:08,0:00:00,1067,7,0/n78,1991-01-02,Mitchell Van Dyk,OL,SF,4,0,1:51:22,10,368,19.3,4291,6045,28,1,3,1:08:23,0:42:54,0:00:04,0:00:00,0:00:00,32,0,0/n79,1986-12-31,Jim Dray,TE,SF,2,1,1:24:08,8973,16.8,2855,5385,498,205,29,0:44:24,0:37:42,0:01:28,0:00:29,0:00:03,733,13,3/n80,1991-12-30,Josh Allen,OL,SF,3,0,1:25:52,7306,11.3,3757,3045,440,44,20,0:59:05,0:24:37,0:01:56,0:00:09,0:00:03,504,11,3/n81,1992-08-15,Carl Bradford,LB,SF,1,1,0:52:05,6295,19.5,1672,3806,396,279,141,0:25:55,0:24:21,0:00:58,0:00:34,0:00:15,817,7,12/n82,1993-10-21,Brandon Chubb,LB,SF,2,0,0:56:41,6055,18.8,2077,3657,238,75,9,0:31:24,0:24:28,0:00:37,0:00:09,0:00:01,321,5,1/n83,1994-05-21,Duke Thomas,DB,SF,1,0,0:39:22,4330,18.6,1378,2562,305,76,9,0:21:18,0:17:04,0:00:48,0:00:09,0:00:01,390,7,0/n84,1986-04-04,Andrew Gardner,OL,SF,0,0,0:00:15,25,11.8,11,14,0,0,0,0:00:09,0:00:05,0:00:00,0:00:00,0:00:00,0,0,0/n';
        
        return performancePage.readAndDeleteCSV().then(function(fileContents) {
          assert.equal(fileContents, exportFileContents);  
        })
      });

      test.it('clicking export all button', function() {
        performancePage.clickStatsExportAllLink();
      });
      
      test.it('export all csv file should have the correct data', function() {
        return performancePage.readAndDeleteCSV().then(function(fileContents) {
          assert.isNotNull(fileContents);  
        })
      });    
    });

    test.describe('#Page: Ind Practice Performance Stats', function() {
      test.it('test setup', function() {
        performancePage.goToSection('practicesAndGames');
        filters.removeSelectionFromDropdownFilter('Season', 2017, true);
        performancePage.clickTableStatFor(2,'result');
        performancePage.setSection('practice');
        performancePage.waitForTableToLoad();
      });

      test.it('clicking export button', function() {
        performancePage.clickPracticeExportLink();
      });
      
      test.it('export csv file should have the correct data', function() {
        var exportFileContents = 'dateOfBirth,player,primaryPosition,teamAbbrev,Pract,G,TimeMoving,DistTotal,RelTargetMPH,RelWalkYds,RelJogYds,RelRunYds,RelSprintYds,RelMaxSprintYds,RelWalkTime,RelJogTime,RelRunTime,RelSprintTime,RelMaxSprintTime,RelHardEffortDist,RelSprintCount,RelMaxSprintCount/n1991-12-03,DeAndre Smelter,WR,SF,1,0,0:25:38,3163,20.1,1003,1722,439,0,0,0:15:31,0:09:01,0:01:06,0:00:00,0:00:00,439,0,0/n1990-06-13,Vance McDonald,TE,SF,1,0,0:24:22,3096,20.4,752,2143,201,0,0,0:11:07,0:12:44,0:00:29,0:00:00,0:00:00,201,0,0/n1988-09-24,Aldrick Robinson,WR,SF,1,0,0:22:17,3083,21.7,672,2149,262,0,0,0:10:26,0:11:13,0:00:37,0:00:00,0:00:00,262,0,0/n1991-08-07,Blake Bell,TE,SF,1,0,0:23:07,3002,19.6,660,2086,255,0,0,0:10:10,0:12:17,0:00:39,0:00:00,0:00:00,255,0,0/n1981-12-06,Robbie Gould,K,SF,1,0,0:25:52,2947,17.9,981,1513,416,37,0,0:15:03,0:09:31,0:01:11,0:00:05,0:00:00,453,4,0/n1993-04-10,DeAndre Carter,WR,SF,1,0,0:20:12,2865,20.2,604,1900,342,19,0,0:09:08,0:10:09,0:00:51,0:00:02,0:00:00,361,1,0/n1990-11-19,Marquise Goodwin,WR,SF,1,0,0:20:32,2840,22.0,637,1922,280,0,0,0:09:35,0:10:17,0:00:40,0:00:00,0:00:00,280,0,0/n1990-02-02,Rashad Ross,WR,SF,1,0,0:21:08,2806,20.8,713,1862,231,0,0,0:10:44,0:09:48,0:00:35,0:00:00,0:00:00,231,0,0/n1988-05-29,Garrett Celek,TE,SF,1,0,0:20:27,2797,19.2,646,1808,342,0,0,0:09:45,0:09:47,0:00:54,0:00:00,0:00:00,342,0,0/n1994-06-01,Bradley Pinion,P,SF,1,0,0:25:12,2782,16.8,1039,1285,431,27,0,0:15:50,0:07:59,0:01:18,0:00:03,0:00:00,458,4,0/n1993-12-23,Aaron Burbridge,WR,SF,1,0,0:20:57,2767,21.8,734,1859,173,0,0,0:11:13,0:09:19,0:00:24,0:00:00,0:00:00,173,0,0/n1987-02-26,Logan Paulsen,TE,SF,1,0,0:20:31,2738,17.6,667,1531,467,72,0,0:10:08,0:08:51,0:01:20,0:00:09,0:00:00,539,5,0/n1986-05-23,Tim Hightower,RB,SF,1,0,0:18:28,2737,20.6,542,1886,308,0,0,0:08:08,0:09:33,0:00:45,0:00:00,0:00:00,308,0,0/n1991-04-23,Kyle Juszczyk,RB,SF,1,0,0:18:57,2623,20.0,609,1748,264,1,0,0:09:18,0:08:57,0:00:40,0:00:00,0:00:00,266,0,0/n1986-08-08,Pierre Garcon,WR,SF,1,0,0:19:07,2588,23.4,644,1855,89,0,0,0:09:45,0:09:09,0:00:12,0:00:00,0:00:00,89,0,0/n1993-02-19,Mike Davis,RB,SF,1,0,0:16:55,2562,18.6,399,1742,409,11,0,0:06:20,0:09:27,0:01:07,0:00:01,0:00:00,420,2,0/n1995-07-23,Rashard Robinson,DB,SF,1,0,0:21:40,2524,22.6,720,1794,10,0,0,0:11:14,0:10:24,0:00:01,0:00:00,0:00:00,10,0,0/n1988-11-08,Jeremy Kerley,WR,SF,1,0,0:18:48,2478,22.1,589,1814,75,0,0,0:08:46,0:09:51,0:00:10,0:00:00,0:00:00,75,0,0/n1990-10-12,Brock Coyle,LB,SF,1,0,0:18:28,2420,22.4,597,1777,47,0,0,0:09:26,0:08:54,0:00:06,0:00:00,0:00:00,47,0,0/n1991-12-01,Dontae Johnson,DB,SF,1,0,0:20:04,2387,20.7,712,1595,80,0,0,0:11:12,0:08:39,0:00:12,0:00:00,0:00:00,80,0,0/n1991-12-10,Eric Reid,DB,SF,1,0,0:19:56,2328,19.1,792,1401,135,0,0,0:11:58,0:07:36,0:00:22,0:00:00,0:00:00,135,0,0/n1991-10-25,Vinnie Sunseri,DB,SF,1,0,0:18:30,2328,21.0,626,1614,88,0,0,0:09:40,0:08:36,0:00:13,0:00:00,0:00:00,88,0,0/n1993-03-29,JaCorey Shepherd,DB,SF,1,0,0:19:49,2324,21.4,700,1555,68,0,0,0:11:07,0:08:31,0:00:10,0:00:00,0:00:00,68,0,0/n1993-12-28,Will Redmond,DB,SF,1,0,0:18:35,2305,20.5,613,1497,195,0,0,0:09:50,0:08:15,0:00:29,0:00:00,0:00:00,195,0,0/n1993-03-11,Prince Charles Iworah,DB,SF,1,0,0:17:41,2287,22.7,599,1624,65,0,0,0:09:23,0:08:09,0:00:09,0:00:00,0:00:00,65,0,0/n1986-10-03,Kyle Nelson,SPEC,SF,1,0,0:17:59,2277,19.4,582,1531,164,0,0,0:09:22,0:08:11,0:00:25,0:00:00,0:00:00,164,0,0/n1990-05-14,Don Jones,DB,SF,1,0,0:19:03,2273,22.3,687,1538,48,0,0,0:10:41,0:08:15,0:00:06,0:00:00,0:00:00,48,0,0/n1987-07-21,Marcus Ball,DB,SF,1,0,0:19:41,2273,22.2,722,1518,28,3,1,0:11:19,0:08:17,0:00:04,0:00:00,0:00:00,32,0,0/n1991-07-12,K\'Waun Williams,DB,SF,1,0,0:18:15,2255,18.8,562,1498,195,1,0,0:08:45,0:08:57,0:00:32,0:00:00,0:00:00,195,0,0/n1989-07-05,Malcolm Smith,LB,SF,1,0,0:19:16,2249,21.1,697,1527,23,0,1,0:11:08,0:08:03,0:00:03,0:00:00,0:00:00,24,0,0/n1990-07-09,Shayne Skov,LB,SF,1,0,0:17:45,2243,19.0,606,1504,134,0,0,0:09:14,0:08:08,0:00:22,0:00:00,0:00:00,134,0,0/n1994-09-20,Wynton McManis,LB,SF,1,0,0:17:42,2212,19.8,581,1497,134,0,0,0:09:15,0:08:05,0:00:21,0:00:00,0:00:00,134,0,0/n1991-07-18,Jimmie Ward,DB,SF,1,0,0:18:15,2201,23.5,639,1546,14,0,1,0:09:59,0:08:13,0:00:01,0:00:00,0:00:00,16,0,0/n1990-09-20,Carlos Hyde,RB,SF,1,0,0:17:10,2184,19.1,667,1330,187,0,0,0:09:50,0:06:49,0:00:30,0:00:00,0:00:00,187,0,0/n1991-03-05,Ray-Ray Armstrong,LB,SF,1,0,0:18:28,2172,17.8,659,1313,197,3,1,0:10:43,0:07:11,0:00:33,0:00:00,0:00:00,200,0,0/n1990-09-22,Jayson DiManche,LB,SF,1,0,0:18:14,2171,21.6,627,1536,9,0,0,0:09:54,0:08:18,0:00:01,0:00:00,0:00:00,9,0,0/n1991-07-31,Keith Reaser,DB,SF,1,0,0:18:13,2148,20.3,687,1411,50,0,0,0:10:28,0:07:36,0:00:07,0:00:00,0:00:00,50,0,0/n1992-02-18,Jaquiski Tartt,DB,SF,1,0,0:17:41,2147,22.3,617,1525,5,0,0,0:09:13,0:08:27,0:00:00,0:00:00,0:00:00,5,0,0/n1988-09-03,DuJuan Harris,RB,SF,1,0,0:16:08,2145,20.6,545,1392,208,0,0,0:08:33,0:07:04,0:00:31,0:00:00,0:00:00,208,0,0/n1992-08-15,Carl Bradford,LB,SF,1,0,0:16:09,2062,19.5,480,1512,69,0,0,0:07:49,0:08:08,0:00:11,0:00:00,0:00:00,69,0,0/n1985-10-13,Brian Hoyer,QB,SF,1,0,0:18:16,1863,16.3,828,631,386,18,0,0:13:19,0:03:41,0:01:12,0:00:02,0:00:00,404,2,0/n1990-09-08,Matt Barkley,QB,SF,1,0,0:15:18,1741,17.8,593,923,215,9,0,0:09:29,0:05:11,0:00:37,0:00:01,0:00:00,224,1,0/n1991-02-12,Eric Rogers,WR,SF,1,0,0:16:20,1700,17.9,715,477,226,187,95,0:12:12,0:02:53,0:00:37,0:00:24,0:00:11,508,4,6/n1988-03-03,Dekoda Watson,LB,SF,1,0,0:12:53,1286,21.8,494,772,20,0,0,0:07:47,0:05:03,0:00:02,0:00:00,0:00:00,20,0,0/n1990-07-12,Chris Jones,DL,SF,1,0,0:11:42,1264,18.9,408,818,38,0,0,0:06:33,0:05:03,0:00:06,0:00:00,0:00:00,38,0,0/n1994-01-19,John Theus,OL,SF,1,0,0:13:20,1220,17.6,576,604,40,0,0,0:09:00,0:04:12,0:00:06,0:00:00,0:00:00,40,0,0/n1994-05-05,Nick Rose,K,SF,1,0,0:08:04,1207,19.8,247,846,114,0,0,0:03:32,0:04:14,0:00:17,0:00:00,0:00:00,114,0,0/n1993-01-21,Ronald Blair,DL,SF,1,0,0:11:19,1190,17.2,386,752,49,3,0,0:06:05,0:05:04,0:00:08,0:00:00,0:00:00,52,1,0/n1994-02-21,Joshua Garnett,OL,SF,1,0,0:12:30,1166,17.8,579,544,44,0,0,0:08:58,0:03:24,0:00:07,0:00:00,0:00:00,44,0,0/n1994-03-01,Alex Balducci,OL,SF,1,0,0:11:44,1132,19.2,494,589,49,0,0,0:07:48,0:03:48,0:00:07,0:00:00,0:00:00,49,0,0/n1990-11-26,Garry Gilliam,OL,SF,1,0,0:12:30,1125,16.0,555,477,76,17,0,0:08:43,0:03:29,0:00:14,0:00:02,0:00:00,93,3,0/n1993-11-15,Arik Armstead,DL,SF,1,0,0:10:38,1116,17.2,351,734,25,6,0,0:05:44,0:04:48,0:00:04,0:00:00,0:00:00,30,1,0/n1987-12-18,Daniel Kilgore,OL,SF,1,0,0:11:20,1112,17.9,455,599,51,6,0,0:07:07,0:04:03,0:00:08,0:00:00,0:00:00,58,1,0/n1994-08-25,Norman Price,OL,SF,1,0,0:12:11,1096,15.9,527,531,26,11,0,0:08:25,0:03:39,0:00:04,0:00:01,0:00:00,37,2,0/n1986-11-19,Zane Beadles,OL,SF,1,0,0:11:05,1090,18.3,400,652,37,1,0,0:06:22,0:04:36,0:00:06,0:00:00,0:00:00,38,0,0/n1990-09-05,Zach Moore,DL,SF,1,0,0:11:40,1085,17.9,439,631,15,0,0,0:07:08,0:04:28,0:00:02,0:00:00,0:00:00,15,0,0/n1984-08-30,Joe Staley,OL,SF,1,0,0:11:50,1062,19.4,511,511,39,0,0,0:08:10,0:03:33,0:00:06,0:00:00,0:00:00,39,0,0/n1993-03-08,Aaron Lynch,LB,SF,1,0,0:11:06,1046,21.5,417,630,0,0,0,0:06:41,0:04:24,0:00:00,0:00:00,0:00:00,0,0,0/n1991-04-20,Mike Purcell,DL,SF,1,0,0:10:52,1030,18.7,415,595,18,2,0,0:06:43,0:04:05,0:00:02,0:00:00,0:00:00,21,0,0/n1993-04-13,Trent Brown,OL,SF,1,0,0:11:55,1021,15.5,570,391,51,8,0,0:09:01,0:02:42,0:00:09,0:00:01,0:00:00,59,1,0/n1990-07-21,Quinton Dial,DL,SF,1,0,0:09:42,887,16.0,380,485,22,0,0,0:06:10,0:03:27,0:00:04,0:00:00,0:00:00,22,0,0/n1986-06-01,Jeremy Zuttah,OL,SF,1,0,0:10:08,887,18.2,432,408,45,2,0,0:07:09,0:02:50,0:00:07,0:00:00,0:00:00,47,1,0/n1987-09-25,Earl Mitchell,DL,SF,1,0,0:09:09,875,18.9,318,545,13,0,0,0:05:13,0:03:53,0:00:02,0:00:00,0:00:00,13,0,0/n';
        
        return performancePage.readAndDeleteCSV().then(function(fileContents) {
          assert.equal(fileContents, exportFileContents);  
        })
      });

      test.it('clicking export all button', function() {
        performancePage.clickPracticeExportAllLink();
      });
      
      test.it('export all csv file should have the correct data', function() {
        return performancePage.readAndDeleteCSV().then(function(fileContents) {
          assert.isNotNull(fileContents);  
        })
      });

      test.it('clicking export legacy button', function() {
        performancePage.clickPracticeExportLegacyLink();
      });
      
      test.it('export legacy csv file should have the correct data', function() {
        return performancePage.readAndDeleteCSV().then(function(fileContents) {
          assert.isNotNull(fileContents);  
        })
      });

      test.it('clicking zebra export button', function() {
        performancePage.clickPracticeZebraExportLink();
      });
      
      test.it('zebra export csv file should have the correct data', function() {
        return performancePage.readAndDeleteCSV().then(function(fileContents) {
          assert.isNotNull(fileContents);  
        })
      });          
    });
  });

  test.describe('#Section: Team', function() {
    test.describe('#Page: Overview', function() {
      test.it('navigating to team page', function() {
        navbar.goToTeamsPage();
        filters.changeValuesForSeasonWeekDropdownFilter(2016, 'W1', 2016, 'W17', true);
        teamsPage.clickStatsTableStat(1,3); // should click into NE Patriots Team Link
        teamPage.waitForTableToLoad();
      });

      test.it('clicking roster export button', function() {
        teamPage.clickOverviewRosterExportLink();
      });
      
      test.it('roster csv file should have the correct data', function() {
        return teamPage.readAndDeleteCSV().then(function(fileContents) {
          assert.isNotNull(fileContents);  
        })
      });

      test.it('clicking results export button', function() {
        teamPage.clickOverviewResultsExportLink();
      });
      
      test.it('results csv file should have the correct data', function() {
        var exportFileContents = 'startTime,week,opponent,date,result,stats/nPreseason/n19:30:00,2,Saints,2016-08-11,W 34 - 22,362 Yds, 369 OpYds, 0 TO, 4 OpTO, 26:00 TOP/n20:00:00,3,Bears,2016-08-18,W 23 - 22,373 Yds, 331 OpYds, 1 TO, 1 OpTO, 32:03 TOP/n19:30:00,4,Panthers,2016-08-26,W 19 - 17,291 Yds, 345 OpYds, 0 TO, 3 OpTO, 28:43 TOP/n19:00:00,5,Giants,2016-09-01,L 9 - 17,374 Yds, 359 OpYds, 3 TO, 2 OpTO, 29:40 TOP/nRegular Season/n20:30:00,1,Cardinals,2016-09-11,W 23 - 21,363 Yds, 344 OpYds, 2 TO, 0 OpTO, 33:59 TOP/n13:00:00,2,Dolphins,2016-09-18,W 31 - 24,463 Yds, 457 OpYds, 1 TO, 4 OpTO, 36:46 TOP/n20:25:00,3,Texans,2016-09-22,W 27 - 0,282 Yds, 284 OpYds, 0 TO, 3 OpTO, 28:38 TOP/n13:00:00,4,Bills,2016-10-02,L 0 - 16,277 Yds, 378 OpYds, 1 TO, 0 OpTO, 23:49 TOP/n13:00:00,5,Browns,2016-10-09,W 33 - 13,501 Yds, 262 OpYds, 0 TO, 1 OpTO, 34:39 TOP/n13:00:00,6,Bengals,2016-10-16,W 35 - 17,437 Yds, 357 OpYds, 0 TO, 0 OpTO, 27:57 TOP/n16:25:00,7,Steelers,2016-10-23,W 27 - 16,362 Yds, 375 OpYds, 2 TO, 1 OpTO, 27:31 TOP/n13:00:00,8,Bills,2016-10-30,W 41 - 25,357 Yds, 376 OpYds, 0 TO, 0 OpTO, 29:51 TOP/n20:30:00,10,Seahawks,2016-11-13,L 24 - 31,385 Yds, 420 OpYds, 2 TO, 0 OpTO, 29:35 TOP/n16:25:00,11,49ers,2016-11-20,W 30 - 17,444 Yds, 299 OpYds, 0 TO, 0 OpTO, 29:17 TOP/n16:25:00,12,Jets,2016-11-27,W 22 - 17,377 Yds, 333 OpYds, 0 TO, 2 OpTO, 30:36 TOP/n13:00:00,13,Rams,2016-12-04,W 26 - 10,402 Yds, 162 OpYds, 0 TO, 2 OpTO, 37:57 TOP/n20:30:00,14,Ravens,2016-12-12,W 30 - 23,496 Yds, 348 OpYds, 3 TO, 1 OpTO, 29:14 TOP/n16:25:00,15,Broncos,2016-12-18,W 16 - 3,313 Yds, 309 OpYds, 0 TO, 3 OpTO, 33:36 TOP/n13:00:00,16,Jets,2016-12-24,W 41 - 3,325 Yds, 239 OpYds, 0 TO, 4 OpTO, 34:43 TOP/n13:00:00,17,Dolphins,2017-01-01,W 35 - 14,396 Yds, 280 OpYds, 0 TO, 2 OpTO, 31:22 TOP/nPlayoffs/n20:15:00,DIV,Texans,2017-01-14,W 34 - 16,377 Yds, 285 OpYds, 3 TO, 3 OpTO, 27:30 TOP/n18:40:00,LC,Steelers,2017-01-22,W 36 - 17,431 Yds, 368 OpYds, 0 TO, 2 OpTO, 31:26 TOP/n18:30:00,SB,Falcons,2017-02-05,W 34 - 28,546 Yds, 344 OpYds, 2 TO, 1 OpTO, 40:31 TOP/n';
        
        return teamPage.readAndDeleteCSV().then(function(fileContents) {
          assert.equal(fileContents, exportFileContents);  
        })
      });

      test.it('clicking rank export button', function() {
        teamPage.clickOverviewRankExportLink();
      });
      
      test.it('rank csv file should have the correct data', function() {
        var exportFileContents = 'Stat,Number,NFL Rank,NFL Leader,Div Rank,Div Leader/nYards Per Game,396.5,4,NO,1,NE/nYards Per Play,5.85,6,ATL,1,NE/nRushing Yards Per Game,112.2,12,BUF,3,BUF/nRush Yards Per Rush Attempt,3.80,25,BUF,4,BUF/nPassing Yards Per Game,284.4,4,NO,1,NE/nNet Yards Per Pass Attempt,7.80,3,ATL,1,NE/nPass INT Rate,0.7%,1,NE,1,NE/nQB Sacks,33,T9,OAK,1,NE/nSacks Per Pass Attempt,4.8%,6,OAK,1,NE/nFirst Downs Per Game,22.8,4,NO,1,NE/nYards Per Punt Return,7.06,24,KC,3,BUF/nYards Per Kickoff Return,20.71,20,MIN,4,MIA/nField Goal Percentage,87.2%,8,BAL,1,NE/nThird Down Conversion Percentage,46.7%,2,NO,1,NE/nFourth Down Conversion Percentage,69.2%,6,DAL,1,NE/nYards Per Punt,44.29,23,IND,2,MIA/nNet Yards Per Punt,40.98,9,LA,1,NE/nRed Zone Efficiency,64.0%,10,TEN,2,BUF/nGoal to Go Efficiency,69.6%,21,TB,1,NE/nTime Of Possession,31:31,4,PHI,1,NE/nPoints Scored Per Game,28.68,3,ATL,1,NE/nOffensive Points Scored Per Game,28.00,3,ATL,1,NE/nPM (Per Game),12.32,1,NE,1,NE/nYard Margin Per Game,69,1,NE,1,NE/n';
        
        return teamPage.readAndDeleteCSV().then(function(fileContents) {
          assert.equal(fileContents, exportFileContents);  
        })
      });
    });

    test.describe('#Page: GameLog', function() {
      test.it('test setup', function() {
        teamPage.goToSection('gameLog');
        teamPage.waitForTableToLoad();
      });

      test.it('clicking export button', function() {
        teamPage.clickGameLogExportLink();
      });
      
      test.it('export csv file should have the correct data', function() {
        var exportFileContents = 'startTime,year,week,opponent,date,result,G,W,L,T,Win%,PS,PA,PM,Yds,OpYds,TO,OpTO,TOMgn,TOP,OpTOP,TopMgn/n20:30:00,2016,1,Cardinals,2016-09-11,W 23 - 21,1,1,0,0,1.000,23,21,2,363,344,2,0,-2,33:59,26:01,7:58/n13:00:00,2016,2,Dolphins,2016-09-18,W 31 - 24,1,1,0,0,1.000,31,24,7,463,457,1,4,3,36:46,23:14,13:32/n20:25:00,2016,3,Texans,2016-09-22,W 27 - 0,1,1,0,0,1.000,27,0,27,282,284,0,3,3,28:38,31:22,-2:44/n13:00:00,2016,4,Bills,2016-10-02,L 0 - 16,1,0,1,0,.000,0,16,-16,277,378,1,0,-1,23:49,36:11,-12:22/n13:00:00,2016,5,Browns,2016-10-09,W 33 - 13,1,1,0,0,1.000,33,13,20,501,262,0,1,1,34:39,25:21,9:18/n13:00:00,2016,6,Bengals,2016-10-16,W 35 - 17,1,1,0,0,1.000,35,17,18,437,357,0,0,0,27:57,32:03,-4:06/n16:25:00,2016,7,Steelers,2016-10-23,W 27 - 16,1,1,0,0,1.000,27,16,11,362,375,2,1,-1,27:31,32:29,-4:58/n13:00:00,2016,8,Bills,2016-10-30,W 41 - 25,1,1,0,0,1.000,41,25,16,357,376,0,0,0,29:51,30:09,-0:18/n20:30:00,2016,10,Seahawks,2016-11-13,L 24 - 31,1,0,1,0,.000,24,31,-7,385,420,2,0,-2,29:35,30:25,-0:50/n16:25:00,2016,11,49ers,2016-11-20,W 30 - 17,1,1,0,0,1.000,30,17,13,444,299,0,0,0,29:17,30:43,-1:26/n16:25:00,2016,12,Jets,2016-11-27,W 22 - 17,1,1,0,0,1.000,22,17,5,377,333,0,2,2,30:36,29:24,1:12/n13:00:00,2016,13,Rams,2016-12-04,W 26 - 10,1,1,0,0,1.000,26,10,16,402,162,0,2,2,37:57,22:03,15:54/n20:30:00,2016,14,Ravens,2016-12-12,W 30 - 23,1,1,0,0,1.000,30,23,7,496,348,3,1,-2,29:14,30:46,-1:32/n16:25:00,2016,15,Broncos,2016-12-18,W 16 - 3,1,1,0,0,1.000,16,3,13,313,309,0,3,3,33:36,26:24,7:12/n13:00:00,2016,16,Jets,2016-12-24,W 41 - 3,1,1,0,0,1.000,41,3,38,325,239,0,4,4,34:43,25:17,9:26/n13:00:00,2016,17,Dolphins,2017-01-01,W 35 - 14,1,1,0,0,1.000,35,14,21,396,280,0,2,2,31:22,28:38,2:44/n';
        
        return teamPage.readAndDeleteCSV().then(function(fileContents) {
          assert.equal(fileContents, exportFileContents);  
        })
      });

      test.it('clicking export all button', function() {
        teamPage.clickGameLogExportAllLink();
      });
      
      test.it('export all csv file should have the correct data', function() {
        return teamPage.readAndDeleteCSV().then(function(fileContents) {
          assert.isNotNull(fileContents);  
        })
      });
    });

    test.describe('#Page: PlayByPlay', function() {
      test.it('test setup', function() {
        teamPage.goToSection('playByPlay');
        teamPage.waitForTableToLoad();
      });

      test.it('clicking export button returns correct CSV', function() {
        filters.changeFilterGroupDropdown('Drive');
        filters.changeValuesForRangeSidebarFilter('Drive Off Penalties:', 2, 2);
        teamPage.clickPlayByPlayExportLink();
      });
      
      test.it('export csv file should have the correct data', function() {
        var exportFileContents = 'startTime,week,offense_team,defense_team,home_team,away_team,home_final_score,away_final_score,game_id,date,play_group_id,drive_index,down,first_down_dist,goal_dist,quarter,game_clock,offense_current_score,defense_current_score,offense_points_scored,defense_points_scored,play_type,play_result,pass_result,kick_result,yards_gained,fg_yards,kickoff_yards,punt_yards,kickoff_return_yards,punt_return_yards,offense_penalty_yards,defense_penalty_yards,post_kickoff_goal_dist,post_punt_goal_dist,pass_first_down,rush_first_down,penalty_first_downs,interception,fumble_lost,passer,rusher,target,kicker,returner,desc/n13:00:00,8,NE,BUF,BUF,NE,25,41,2016103002,,915,4,1,10,45,1,,7,3,,,PENALTY,,,,0,,,,,,10,,,,,,,,,,,,,,(3:41) 12-T.Brady pass short right to 28-J.White to BUF 19 for 26 yards (99-M.Dareus). Screen pass, caught at BUF 19. PENALTY on NE-80-D.Amendola, Offensive Pass Interference, 10 yards, enforced at BUF 45 - No Play./n13:00:00,8,NE,BUF,BUF,NE,25,41,2016103002,,950,4,1,20,55,1,,7,3,,,PENALTY,FIRST DOWN,,,0,,,,,,,5,,,,,1,,,,,,,,(3:05) (Shotgun) 12-T.Brady pass incomplete short middle [99-M.Dareus]. Thrown away under pressure. PENALTY on BUF-26-R.Blanton, Defensive Holding, 5 yards, enforced at NE 45 - No Play./n13:00:00,8,NE,BUF,BUF,NE,25,41,2016103002,,991,4,1,10,50,1,,7,3,,,RUSH,,,,2,,,,,,,,,,,,,,,,L. Blount,,,,(3:00) (Shotgun) 29-L.Blount up the middle to BUF 48 for 2 yards (57-L.Alexander, 91-L.Douzable)./n13:00:00,8,NE,BUF,BUF,NE,25,41,2016103002,,1014,4,2,8,48,1,,7,3,,,PASS,,INCOMPLETE,,0,,,,,,,,,,,,,,,T. Brady,,J. White,,,(2:23) (Shotgun) 12-T.Brady pass incomplete short right to 28-J.White (55-J.Hughes). Pass batted at NE 45 after QB rollout (receiver at 50)./n13:00:00,8,NE,BUF,BUF,NE,25,41,2016103002,,1040,4,3,8,48,1,,7,3,,,PENALTY,,,,0,,,,,,5,,,,,,,,,,,,,,(2:18) (Shotgun) 12-T.Brady pass deep right to 11-J.Edelman to BUF 1 for 47 yards (28-R.Darby) [53-Z.Brown]. Caught at BUF 15. PENALTY on NE-61-M.Cannon, Ineligible Downfield Pass, 5 yards, enforced at BUF 48 - No Play./n16:25:00,11,NE,SF,SF,NE,17,30,2016112009,,1064,6,1,10,71,2,,13,3,,,RUSH,,,,5,,,,,,,,,,,,,,,,D. Lewis,,,,(12:18) 33-D.Lewis left end to NE 34 for 5 yards (57-M.Wilhoite; 98-R.Blair)./n13:00:00,8,NE,BUF,BUF,NE,25,41,2016103002,,1079,4,3,13,53,1,,7,3,6,,PASS,TD,COMPLETE,,53,,,,,,,,,,1,,,,,T. Brady,,C. Hogan,,,(1:41) (Shotgun) 12-T.Brady pass deep left to 15-C.Hogan for 53 yards, TOUCHDOWN. Caught in flat at BUF 9./n16:25:00,11,NE,SF,SF,NE,17,30,2016112009,,1085,6,2,5,66,2,,13,3,,,PASS,FIRST DOWN,COMPLETE,,9,,,,,,,,,,1,,,,,T. Brady,,D. Lewis,,,(11:44) 12-T.Brady pass short right to 33-D.Lewis to NE 43 for 9 yards (99-D.Buckner). 11-yds YAC/n13:00:00,8,NE,BUF,BUF,NE,25,41,2016103002,,1103,4,0,0,15,1,,13,3,1,,XPA,,,MADE,,,,,,,,,,,,,,,,,,,,,3-S.Gostkowski extra point is GOOD, Center-49-J.Cardona, Holder-6-R.Allen./n16:25:00,11,NE,SF,SF,NE,17,30,2016112009,,1109,6,1,10,57,2,,13,3,,,PASS,FIRST DOWN,COMPLETE,,13,,,,,,,,,,1,,,,,T. Brady,,M. Mitchell,,,(11:01) 12-T.Brady pass short left to 19-M.Mitchell to SF 44 for 13 yards (25-J.Ward). 6-yds YAC/n16:25:00,11,NE,SF,SF,NE,17,30,2016112009,,1138,6,1,10,44,2,,13,3,,,RUSH,,,,4,,,,,,,,,,,,,,,,L. Blount,,,,(10:26) 29-L.Blount right guard to SF 40 for 4 yards (41-A.Bethea)./n16:25:00,11,NE,SF,SF,NE,17,30,2016112009,,1163,6,2,6,40,2,,13,3,,,PENALTY,,,,0,,,,,,,5,,,,,,,,,,,,,(9:48) (Shotgun) 12-T.Brady pass incomplete short right to 88-M.Bennett. PENALTY on SF-25-J.Ward, Defensive Offside, 5 yards, enforced at SF 40 - No Play./n16:25:00,11,NE,SF,SF,NE,17,30,2016112009,,1196,6,2,1,35,2,,13,3,,,PENALTY,,,,0,,,,,,10,,,,,,,,,,,,,,(9:38) 29-L.Blount up the middle for 35 yards, TOUCHDOWN NULLIFIED by Penalty. PENALTY on NE-77-N.Solder, Offensive Holding, 10 yards, enforced at SF 35 - No Play./n16:25:00,11,NE,SF,SF,NE,17,30,2016112009,,1224,6,2,11,45,2,,13,3,,,PASS,,INCOMPLETE,,0,,,,,,10,,,,,,,,,T. Brady,,,,,(9:31) (Shotgun) 12-T.Brady pass incomplete short right. PENALTY on NE-12-T.Brady, Intentional Grounding, 10 yards, enforced at SF 45./n16:25:00,11,NE,SF,SF,NE,17,30,2016112009,,1257,6,3,21,55,2,,13,3,,,PASS,,COMPLETE,,9,,,,,,,,,,,,,,,T. Brady,,J. Edelman,,,(9:27) (Shotgun) 12-T.Brady pass short left to 11-J.Edelman pushed ob at SF 46 for 9 yards (50-N.Bellore). 13-yds YAC/n16:25:00,11,NE,SF,SF,NE,17,30,2016112009,,1281,6,4,12,46,2,,13,3,,,PUNT,,,DOWNED,,,,38,,,,,,92,,,,,,,,,,,(9:21) 6-R.Allen punts 38 yards to SF 8, Center-49-J.Cardona, downed by NE-18-M.Slater./n20:30:00,1,NE,ARI,ARI,NE,21,23,2016091112,,1923,10,1,10,69,2,,10,7,,,RUSH,,,,1,,,,,,,,,,,,,,,,L. Blount,,,,(1:24) 29-L.Blount up the middle to NE 32 for 1 yard (22-T.Jefferson)./n20:30:00,1,NE,ARI,ARI,NE,21,23,2016091112,,1944,10,2,9,68,2,,10,7,,,RUSH,,,,3,,,,,,10,,,,,,,,,,L. Blount,,,,(:47) 29-L.Blount right end to NE 40 for 8 yards (21-P.Peterson). PENALTY on NE-60-D.Andrews, Tripping, 10 yards, enforced at NE 35./n20:30:00,1,NE,ARI,ARI,NE,21,23,2016091112,,1976,10,2,16,75,2,,10,7,,,PENALTY,,,,0,,,,,,10,,,,,,,,,,,,,,(:39) (Shotgun) 29-L.Blount up the middle to NE 33 for 8 yards (21-P.Peterson; 22-T.Jefferson). PENALTY on NE-69-S.Mason, Offensive Holding, 10 yards, enforced at NE 25 - No Play./n20:30:00,1,NE,ARI,ARI,NE,21,23,2016091112,,2008,10,2,26,85,2,,10,7,,,RUSH,,,,4,,,,,,,,,,,,,,,,L. Blount,,,,(:33) (Shotgun) 29-L.Blount up the middle to NE 19 for 4 yards (55-C.Jones; 51-K.Minter)./n20:30:00,1,NE,ARI,ARI,NE,21,23,2016091112,,2046,10,3,22,81,2,,10,7,,,RUSH,,,,4,,,,,,,,,,,,,,,,L. Blount,,,,(:27) 29-L.Blount right tackle to NE 23 for 4 yards (55-C.Jones)./n20:30:00,1,NE,ARI,ARI,NE,21,23,2016091112,,2084,10,4,18,77,2,,10,7,,,PUNT,,,FAIRCATCH,,,,45,,,,,,68,,,,,,,,,,,(:22) 6-R.Allen punts 45 yards to ARI 32, Center-49-J.Cardona, fair catch by 21-P.Peterson./n13:00:00,4,NE,BUF,NE,BUF,0,16,2016100205,,2601,13,1,10,63,3,,0,13,,,PASS,FIRST DOWN,COMPLETE,,16,,,,,,,,,,1,,,,,J. Brissett,,J. Edelman,,,(7:15) (Shotgun) 7-J.Brissett pass deep right to 11-J.Edelman to BUF 47 for 16 yards (28-R.Darby; 52-P.Brown)./n13:00:00,4,NE,BUF,NE,BUF,0,16,2016100205,,2625,13,1,10,47,3,,0,13,,,PENALTY,,,,0,,,,,,15,,,,,,,,,,,,,,(6:40) (Shotgun) 7-J.Brissett pass incomplete short left to 88-M.Bennett. PENALTY on NE-77-N.Solder, Chop Block, 15 yards, enforced at BUF 47 - No Play./n13:00:00,4,NE,BUF,NE,BUF,0,16,2016100205,,2658,13,1,25,62,3,,0,13,,,PASS,,COMPLETE,,-4,,,,,,,,,,,,,,,J. Brissett,,L. Blount,,,(6:32) (Shotgun) 7-J.Brissett pass short left to 29-L.Blount to NE 34 for -4 yards (53-Z.Brown; 52-P.Brown)./n13:00:00,4,NE,BUF,NE,BUF,0,16,2016100205,,2683,13,2,29,66,3,,0,13,,,RUSH,,,,10,,,,,,,,,,,,,,,,J. Brissett,,,,(5:52) (Shotgun) 7-J.Brissett scrambles left end pushed ob at NE 44 for 10 yards (53-Z.Brown)./n13:00:00,4,NE,BUF,NE,BUF,0,16,2016100205,,2704,13,3,19,56,3,,0,13,,,PASS,,INCOMPLETE,,0,,,,,,,,,,,,,,,J. Brissett,,D. Amendola,,,(5:15) (Shotgun) 7-J.Brissett pass incomplete deep left to 80-D.Amendola./n13:00:00,4,NE,BUF,NE,BUF,0,16,2016100205,,2726,13,4,19,56,3,,0,13,,,PENALTY,,,,,,,,,,5,,,,,,,,,,,,,,(5:06) (Punt formation) PENALTY on NE-36-B.King, False Start, 5 yards, enforced at NE 44 - No Play./n13:00:00,4,NE,BUF,NE,BUF,0,16,2016100205,,2753,13,4,24,61,3,,0,13,,,PUNT,,,RETURNED,,,,49,,18,,,,70,,,,,,,,,,,(5:06) 6-R.Allen punts 49 yards to BUF 12, Center-49-J.Cardona. 15-B.Tate to BUF 30 for 18 yards (51-B.Mingo)./n13:00:00,17,NE,MIA,MIA,NE,14,35,2017010104,,2899,15,1,10,84,3,,27,14,,,PASS,,INCOMPLETE,,0,,,,,,,,,,,,,,,T. Brady,,M. Bennett,,,(1:32) (Shotgun) 12-T.Brady pass incomplete short middle to 88-M.Bennett./n13:00:00,17,NE,MIA,MIA,NE,14,35,2017010104,,2921,15,2,10,84,3,,27,14,,,PASS,FIRST DOWN,COMPLETE,,13,,,,,,,,,,1,,,,,T. Brady,,M. Floyd,,,(1:28) 12-T.Brady pass short left to 14-M.Floyd to NE 29 for 13 yards (36-T.Lippett; 31-M.Thomas)./n20:30:00,10,NE,SEA,NE,SEA,24,31,2016111312,,2929,15,0,0,65,3,,21,22,,,KICKOFF,,,TOUCHBACK,,,68,,,,,,75,,,,,,,,,,,,4-S.Hauschka kicks 65 yards from SEA 35 to end zone, Touchback./n20:30:00,10,NE,SEA,NE,SEA,24,31,2016111312,,2944,15,1,10,75,3,,21,22,,,PASS,FIRST DOWN,COMPLETE,,36,,,,,,,,,,1,,,,,T. Brady,,M. Bennett,,,(2:52) 12-T.Brady pass short right to 88-M.Bennett pushed ob at SEA 39 for 36 yards (29-E.Thomas)./n13:00:00,17,NE,MIA,MIA,NE,14,35,2017010104,,2945,15,1,10,71,3,,27,14,,,PENALTY,,,,0,,,,,,5,,,,,,,,,,,,,,(:52) 71-C.Fleming reported in as eligible.  PENALTY on NE-71-C.Fleming, False Start, 5 yards, enforced at NE 29 - No Play./n20:30:00,10,NE,SEA,NE,SEA,24,31,2016111312,,2973,15,1,10,39,3,,21,22,,,RUSH,,,,9,,,,,,,,,,,,,,,,L. Blount,,,,(2:19) 29-L.Blount right end to SEA 30 for 9 yards (29-E.Thomas; 50-K.Wright)./n13:00:00,17,NE,MIA,MIA,NE,14,35,2017010104,,2974,15,1,15,76,3,,27,14,,,RUSH,,,,-1,,,,,,,,,,,,,,,,D. Lewis,,,,(:34) 33-D.Lewis left tackle to NE 23 for -1 yards (97-J.Phillips)./n20:30:00,10,NE,SEA,NE,SEA,24,31,2016111312,,2994,15,2,1,30,3,,21,22,,,RUSH,FIRST DOWN,,,3,,,,,,,,,,,1,,,,,L. Blount,,,,(1:34) 29-L.Blount left tackle to SEA 27 for 3 yards (56-C.Avril; 93-T.McDaniel)./n20:30:00,10,NE,SEA,NE,SEA,24,31,2016111312,,3015,15,1,10,27,3,,21,22,,,PASS,,INCOMPLETE,,0,,,,,,,,,,,,,,,T. Brady,,R. Gronkowski,,,(:56) 12-T.Brady pass incomplete short middle to 87-R.Gronkowski (77-A.Rubin)./n13:00:00,17,NE,MIA,MIA,NE,14,35,2017010104,,3023,15,2,16,77,4,,27,14,,,PENALTY,,,,0,,,,,,10,,,,,,,,,,,,,,(15:00) (Shotgun) 12-T.Brady pass short left to 15-C.Hogan ran ob at NE 37 for 14 yards. PENALTY on NE-62-J.Thuney, Offensive Holding, 10 yards, enforced at NE 23 - No Play./n13:00:00,6,NE,CIN,NE,CIN,35,17,2016101604,,3030,16,0,0,65,4,,25,17,,,KICKOFF,,,TOUCHBACK,,,75,,,,,,75,,,,,,,,,,,,2-M.Nugent kicks 65 yards from CIN 35 to end zone, Touchback./n20:30:00,10,NE,SEA,NE,SEA,24,31,2016111312,,3037,15,2,10,27,3,,21,22,,,PENALTY,,,,0,,,,,,10,,,,,,,,,,,,,,(:52) (Shotgun) 28-J.White left tackle to SEA 27 for no gain (90-J.Reed). PENALTY on NE-62-J.Thuney, Offensive Holding, 10 yards, enforced at SEA 27 - No Play./n13:00:00,6,NE,CIN,NE,CIN,35,17,2016101604,,3045,16,1,10,75,4,,25,17,,,PASS,,COMPLETE,,5,,,,,,,,,,,,,,,T. Brady,,M. Bennett,,,(12:34) (Shotgun) 12-T.Brady pass short middle to 88-M.Bennett to NE 30 for 5 yards (26-J.Shaw; 55-V.Burfict)./n13:00:00,17,NE,MIA,MIA,NE,14,35,2017010104,,3058,15,2,26,87,4,,27,14,,,PASS,,INCOMPLETE,,0,,,,,,,,,,,,,,,T. Brady,,J. Edelman,,,(14:44) (Shotgun) 12-T.Brady pass incomplete short left to 11-J.Edelman (93-N.Suh) [91-C.Wake]./n13:00:00,6,NE,CIN,NE,CIN,35,17,2016101604,,3069,16,2,5,70,4,,25,17,,,PASS,,COMPLETE,,3,,,,,,,,,,,,,,,T. Brady,,J. Edelman,,,(12:06) (Shotgun) 12-T.Brady pass short left to 11-J.Edelman to NE 33 for 3 yards (26-J.Shaw)./n20:30:00,10,NE,SEA,NE,SEA,24,31,2016111312,,3069,15,2,20,37,3,,21,22,,,PENALTY,,,,0,,,,,,5,,,,,,,,,,,,,,(:33) (Shotgun) PENALTY on NE-87-R.Gronkowski, False Start, 5 yards, enforced at SEA 37 - No Play./n13:00:00,17,NE,MIA,MIA,NE,14,35,2017010104,,3080,15,3,26,87,4,,27,14,,,RUSH,,,,7,,,,,,,,,,,,,,,,J. White,,,,(14:34) (Shotgun) 28-J.White up the middle to NE 20 for 7 yards (42-S.Paysinger)./n20:30:00,10,NE,SEA,NE,SEA,24,31,2016111312,,3092,15,2,25,42,3,,21,22,,,PASS,,INCOMPLETE,,0,,,,,,,,,,,,,,,T. Brady,,C. Hogan,,,(:15) (Shotgun) 12-T.Brady pass incomplete deep left to 15-C.Hogan./n13:00:00,6,NE,CIN,NE,CIN,35,17,2016101604,,3093,16,3,2,67,4,,25,17,,,PASS,FIRST DOWN,COMPLETE,,17,,,,,,,,,,1,,,,,T. Brady,,D. Amendola,,,(11:22) (Shotgun) 12-T.Brady pass short middle to 80-D.Amendola to 50 for 17 yards (36-S.Williams). NE 12-Brady 73rd career 300-yard game, 3rd most all-time./n13:00:00,17,NE,MIA,MIA,NE,14,35,2017010104,,3101,15,4,19,80,4,,27,14,,,PUNT,,,OUT OF BOUNDS,,,,48,,,,,,68,,,,,,,,,,,(14:00) (Punt formation) 6-R.Allen punts 48 yards to MIA 32, Center-49-J.Cardona, out of bounds./n20:30:00,10,NE,SEA,NE,SEA,24,31,2016111312,,3114,15,3,25,42,3,,21,22,,,PASS,FIRST DOWN,COMPLETE,,33,,,,,,,,,,1,,,,,T. Brady,,J. Edelman,,,(:10) (Shotgun) 12-T.Brady pass deep left to 11-J.Edelman pushed ob at SEA 9 for 33 yards (29-E.Thomas)./n13:00:00,6,NE,CIN,NE,CIN,35,17,2016101604,,3122,16,1,10,50,4,,25,17,,,RUSH,,,,2,,,,,,,,,,,,,,,,J. White,,,,(10:48) 28-J.White left end to CIN 48 for 2 yards (97-G.Atkins)./n13:00:00,6,NE,CIN,NE,CIN,35,17,2016101604,,3143,16,2,8,48,4,,25,17,,,RUSH,,,,1,,,,,,,,,,,,,,,,J. White,,,,(10:22) (Shotgun) 28-J.White left tackle to CIN 47 for 1 yard (24-A.Jones; 55-V.Burfict)./n20:30:00,10,NE,SEA,NE,SEA,24,31,2016111312,,3154,15,1,9,9,4,,21,22,,,RUSH,,,,0,,,,,,,,,,,,,,,,L. Blount,,,,(15:00) (Shotgun) 29-L.Blount left guard to SEA 9 for no gain (55-F.Clark; 90-J.Reed)./n13:00:00,6,NE,CIN,NE,CIN,35,17,2016101604,,3164,16,3,7,47,4,,25,17,,,PENALTY,,,,0,,,,,,5,,,,,,,,,,,,,,(9:45) (Shotgun) PENALTY on NE-87-R.Gronkowski, False Start, 5 yards, enforced at CIN 47 - No Play./n20:30:00,10,NE,SEA,NE,SEA,24,31,2016111312,,3175,15,2,9,9,4,,21,22,,,RUSH,,,,2,,,,,,,,,,,,,,,,T. Brady,,,,(14:22) (Shotgun) 12-T.Brady scrambles right end to SEA 7 for 2 yards. runner slid/n13:00:00,6,NE,CIN,NE,CIN,35,17,2016101604,,3187,16,3,12,52,4,,25,17,,,PENALTY,FIRST DOWN,,,0,,,,,,,5,,,,,1,,,,,,,,(9:23) (Shotgun) 12-T.Brady pass incomplete short middle to 15-C.Hogan. PENALTY on CIN-24-A.Jones, Defensive Holding, 5 yards, enforced at NE 48 - No Play./n20:30:00,10,NE,SEA,NE,SEA,24,31,2016111312,,3197,15,3,7,7,4,,21,22,,,PASS,SACK,SACK,,-5,,,,,,,,,,,,,,,T. Brady,,,,,(13:42) (Shotgun) 12-T.Brady sacked at SEA 12 for -5 yards (55-F.Clark)./n20:30:00,10,NE,SEA,NE,SEA,24,31,2016111312,,3216,15,4,12,12,4,,21,22,3,,FGA,,,MADE,,30,,,,,,,,,,,,,,,,,,,(13:05) 3-S.Gostkowski 30 yard field goal is GOOD, Center-49-J.Cardona, Holder-6-R.Allen./n13:00:00,6,NE,CIN,NE,CIN,35,17,2016101604,,3237,16,1,10,47,4,,25,17,,,RUSH,,,,-2,,,,,,,,,,,,,,,,L. Blount,,,,(9:15) 29-L.Blount right guard to CIN 49 for -2 yards (90-M.Johnson)./n13:00:00,6,NE,CIN,NE,CIN,35,17,2016101604,,3258,16,2,12,49,4,,25,17,,,PASS,FIRST DOWN,COMPLETE,,29,,,,,,,,,,1,,,,,T. Brady,,R. Gronkowski,,,(8:46) 12-T.Brady pass deep middle to 87-R.Gronkowski to CIN 20 for 29 yards (24-A.Jones). CIN-24-A.Jones was injured during the play./n13:00:00,6,NE,CIN,NE,CIN,35,17,2016101604,,3287,16,1,10,20,4,,25,17,,,PASS,,COMPLETE,,12,,,,,,15,,,,,,,,,T. Brady,,R. Gronkowski,,,(8:14) (Shotgun) 12-T.Brady pass short middle to 87-R.Gronkowski to CIN 8 for 12 yards (26-J.Shaw). PENALTY on NE-87-R.Gronkowski, Taunting, 15 yards, enforced at CIN 8. NE 87-Grinkowski 162 rec yds, new career high/n13:00:00,6,NE,CIN,NE,CIN,35,17,2016101604,,3323,16,1,23,23,4,,25,17,,,PASS,,COMPLETE,,5,,,,,,,,,,,,,,,T. Brady,,J. White,,,(7:41) (Shotgun) 12-T.Brady pass short left to 28-J.White to CIN 18 for 5 yards (31-D.Smith)./n13:00:00,6,NE,CIN,NE,CIN,35,17,2016101604,,3351,16,2,18,18,4,,25,17,,,PASS,,COMPLETE,,5,,,,,,,,,,,,,,,T. Brady,,M. Bennett,,,(6:56) 12-T.Brady pass short left to 88-M.Bennett to CIN 13 for 5 yards (56-K.Dansby; 36-S.Williams)./n13:00:00,6,NE,CIN,NE,CIN,35,17,2016101604,,3376,16,3,13,13,4,,25,17,,,PASS,,INCOMPLETE,,0,,,,,,,,,,,,,,,T. Brady,,R. Gronkowski,,,(6:13) (Shotgun) 12-T.Brady pass incomplete short left to 87-R.Gronkowski./n13:00:00,6,NE,CIN,NE,CIN,35,17,2016101604,,3399,16,4,13,13,4,,25,17,3,,FGA,,,MADE,,31,,,,,,,,,,,,,,,,,,,(6:08) 3-S.Gostkowski 31 yard field goal is GOOD, Center-49-J.Cardona, Holder-6-R.Allen./n';
        
        return teamPage.readAndDeleteCSV().then(function(fileContents) {
          assert.equal(fileContents, exportFileContents);  
        })
      });
    });

    test.describe('#Page: Occurrences & Streaks', function() {
      test.it('test setup', function() {
        teamPage.goToSection('occurrencesAndStreaks');
        teamPage.waitForTableToLoad();
      });

      test.it('clicking export button returns correct CSV', function() {
        teamPage.clickStreaksExportLink();
      });
      
      test.it('export csv file should have the correct data', function() {
        var exportFileContents = 'Count,W,startDate,endDate/n/n,1,2017-01-01 13:00:00,2017-01-01 13:00:00/n,1,2016-12-24 13:00:00,2016-12-24 13:00:00/n,1,2016-12-12 20:30:00,2016-12-12 20:30:00/n,1,2016-11-27 16:25:00,2016-11-27 16:25:00/n,1,2016-11-20 16:25:00,2016-11-20 16:25:00/n,1,2016-10-30 13:00:00,2016-10-30 13:00:00/n,1,2016-10-23 16:25:00,2016-10-23 16:25:00/n,1,2016-10-16 13:00:00,2016-10-16 13:00:00/n,1,2016-09-11 20:30:00,2016-09-11 20:30:00/n';
        
        return teamPage.readAndDeleteCSV().then(function(fileContents) {
          assert.equal(fileContents, exportFileContents);  
        })
      });     
    });

    test.describe('#Page: Splits', function() {
      test.it('test setup', function() {
        teamPage.goToSection('splits');
        teamPage.waitForTableToLoad();
      });

      test.it('clicking export button returns correct CSV', function() {
        teamPage.clickSplitsExportLink();
      });
      
      test.it('export csv file should have the correct data', function() {
        var exportFileContents = 'SplitBy,G,W,L,T,Win%,PS,PA,PM,Yds,OpYds,TO,OpTO,TOMgn,TOP,OpTOP,TopMgn/nTotals/nTotals,11,9,2,0,.818,13,6,7,303,488,0,1,1,1:24,2:55,-1:30/nOpponent,11,2,9,0,.182,6,13,-7,488,303,1,0,-1,3:53,1:53,2:00/nSeasons/n2016,11,9,2,0,.818,13,6,7,303,488,0,1,1,1:24,2:55,-1:30/nHome/Road/nHome,5,3,2,0,.600,130,90,40,177,294,0,1,1,9:04,9:40,-0:35/nRoad,6,6,0,0,1.000,178,110,68,126,194,0,0,0,11:24,11:05,0:19/nNeutral,0,0,0,0,-,0,0,0,0,0,0,0,0,0:00,0:00,0:00/nDivision/nAFC East,5,4,1,0,.800,139,75,64,96,137,0,1,1,9:23,9:21,0:02/nAFC North,3,3,0,0,1.000,92,56,36,77,278,0,0,0,5:17,5:57,-0:39/nAFC South,0,0,0,0,-,0,0,0,0,0,0,0,0,0:00,0:00,0:00/nAFC West,0,0,0,0,-,0,0,0,0,0,0,0,0,0:00,0:00,0:00/nNFC East,0,0,0,0,-,0,0,0,0,0,0,0,0,0:00,0:00,0:00/nNFC North,0,0,0,0,-,0,0,0,0,0,0,0,0,0:00,0:00,0:00/nNFC South,0,0,0,0,-,0,0,0,0,0,0,0,0,0:00,0:00,0:00/nNFC West,3,2,1,0,.667,77,69,8,130,73,0,0,0,5:48,5:26,0:21/nQuarter/nQ1,5,5,0,0,1.000,7,0,7,55,66,0,0,0,0:08,0:59,-0:51/nQ2,5,5,0,0,1.000,0,0,0,52,112,0,0,0,0:15,0:14,0:01/nQ3,5,3,2,0,.600,0,0,0,115,90,0,1,1,0:36,0:35,0:01/nQ4,8,6,2,0,.750,6,6,0,81,220,0,0,0,0:24,1:05,-0:41/nOT,0,0,0,0,-,0,0,0,0,0,0,0,0,0:00,0:00,0:00/nDowns/n1st Down,11,9,2,0,.818,0,0,0,103,197,0,1,1,0:00,0:00,0:00/n2nd Down,11,9,2,0,.818,0,0,0,82,143,0,0,0,0:00,0:00,0:00/n3rd Down,11,9,2,0,.818,6,0,6,118,148,0,0,0,0:00,0:00,0:00/n4th Down,10,8,2,0,.800,6,6,0,0,0,0,0,0,0:00,0:00,0:00/nGoalline Distance/nRed Zone,4,3,1,0,.750,7,0,7,2,3,0,0,0,0:00,0:00,0:00/n20-39,6,5,1,0,.833,0,6,-6,29,44,0,0,0,0:00,0:00,0:00/n40-59,9,7,2,0,.778,6,0,6,144,123,0,1,1,0:00,0:00,0:00/n60-79,11,9,2,0,.818,0,0,0,100,205,0,0,0,0:00,0:00,0:00/n80-100,7,6,1,0,.857,0,0,0,28,113,0,0,0,0:00,0:00,0:00/nFirst Down Distance/n0-1,10,9,1,0,.900,1,0,1,3,12,0,0,0,0:00,0:00,0:00/n2-5,8,7,1,0,.875,0,0,0,29,49,0,0,0,0:00,0:00,0:00/n6-10,11,9,2,0,.818,0,3,-3,117,289,0,1,1,0:00,0:00,0:00/n11-19,11,9,2,0,.818,12,3,9,86,37,0,0,0,0:00,0:00,0:00/n20+,8,6,2,0,.750,0,0,0,68,101,0,0,0,0:00,0:00,0:00/nGoal To Go Distance/n0-1,1,1,0,0,1.000,0,0,0,0,0,0,0,0,0:00,0:00,0:00/n2-5,0,0,0,0,-,0,0,0,0,0,0,0,0,0:00,0:00,0:00/n6-10,2,1,1,0,.500,0,0,0,-3,5,0,0,0,0:00,0:00,0:00/n11-15,2,1,1,0,.500,6,0,6,0,0,0,0,0,0:00,0:00,0:00/n16-20,1,1,0,0,1.000,0,0,0,5,0,0,0,0,0:00,0:00,0:00/n21+,1,1,0,0,1.000,0,0,0,5,0,0,0,0,0:00,0:00,0:00/nQB vs non QB/nQB Offense,7,5,2,0,.714,6,0,6,261,4,0,0,0,0:00,0:00,0:00/nAll,11,9,2,0,.818,13,6,7,303,488,0,1,1,1:24,2:55,-1:30/nAir Yards/nAir Yards Behind LOS,4,3,1,0,.750,0,0,0,24,0,0,0,0,0:00,0:00,0:00/nAir Yards 0-10,4,3,1,0,.750,0,0,0,46,0,0,0,0,0:00,0:00,0:00/nAir Yards 11-20,4,2,2,0,.500,0,0,0,69,0,0,0,0,0:00,0:00,0:00/nAir Yards 21-30,4,2,2,0,.500,6,0,6,115,0,0,0,0,0:00,0:00,0:00/n';
        
        return teamPage.readAndDeleteCSV().then(function(fileContents) {
          assert.equal(fileContents, exportFileContents);  
        })
      });
    });

    test.describe('#Page: Roster', function() {
      test.it('test setup', function() {
        teamPage.goToSection('roster');
        teamPage.waitForTableToLoad();
      });

      test.it('clicking export button returns correct CSV', function() {
        teamPage.clickRosterExportLink();
      });
      
      test.it('export csv file should have the correct data', function() {
        var exportFileContents = 'dateOfBirth,pos,player,teamAbbrev,Yds,OffTD,Cmp,Att,Comp%,Yd/Att,Rush,Yd/Rsh,Int,Sack,TO,LosTO,1stDn,Fmb,FL/n1977-08-03,QB,Tom Brady,NE,244,1,14,21,66.7%,11.52,1,2.00,0,1,0,0,8,0,0/n1988-10-24,WR,Chris Hogan,NE,0,1,0,0,-,-,0,-,0,0,0,0,1,0,0/n1986-05-22,WR,Julian Edelman,NE,0,0,0,0,-,-,0,-,0,0,0,0,2,0,0/n1985-11-02,WR,Danny Amendola,NE,0,0,0,0,-,-,0,-,0,0,0,0,1,1,0/n1986-12-05,RB,LeGarrette Blount,NE,28,0,0,0,-,-,10,2.80,0,0,0,0,1,0,0/n1989-05-14,TE,Rob Gronkowski,NE,0,0,0,0,-,-,0,-,0,0,0,0,1,0,0/n1987-03-10,TE,Martellus Bennett,NE,0,0,0,0,-,-,0,-,0,0,0,0,1,0,0/n1989-11-27,WR,Michael Floyd,NE,0,0,0,0,-,-,0,-,0,0,0,0,1,0,0/n1992-02-03,RB,James White,NE,10,0,0,0,-,-,3,3.33,0,0,0,0,0,0,0/n1991-11-02,QB,Jimmy Garoppolo,NE,0,0,0,0,-,-,0,-,0,0,0,0,0,0,0/n1990-12-27,TE,Matt Lengel,NE,0,0,0,0,-,-,0,-,0,0,0,0,0,0,0/n1992-07-20,WR,Malcolm Mitchell,NE,0,0,0,0,-,-,0,-,0,0,0,0,1,0,0/n1992-12-11,QB,Jacoby Brissett,NE,22,0,2,3,66.7%,4.00,1,10.00,0,0,0,0,1,0,0/n';
        
        return teamPage.readAndDeleteCSV().then(function(fileContents) {
          assert.equal(fileContents, exportFileContents);  
        })
      });
    });

    test.describe('#Page: Multi-Filter', function() {
      test.it('test setup', function() {
        teamPage.goToSection('multiFilter');
        teamPage.waitForTableToLoad();
      });

      test.it('clicking export button returns correct CSV', function() {
        teamPage.clickMultiFilterExportLink();
      });
      
      test.it('export csv file should have the correct data', function() {
        var exportFileContents = 'filter,G,W,L,T,Win%,PS,PA,PM,Yds,OpYds,TO,OpTO,TOMgn,TOP,OpTOP,TopMgn/ntop,11,9,2,0,.818,13,6,7,303,488,0,1,1,1:24,2:55,-1:30/nbottom,16,14,2,0,.875,441,250,191,6180,5223,11,23,12,31:13,28:46,2:26/n';
        
        return teamPage.readAndDeleteCSV().then(function(fileContents) {
          assert.equal(fileContents, exportFileContents);  
        })
      });
    });      
  });

  test.describe('#Section: Player', function() {
    test.describe('#Page: Overview', function() {
      test.it('test setup', function() {
        navbar.goToPlayersPage();
        filters.changeValuesForSeasonWeekDropdownFilter(2016, 'W1', 2016, 'W17', true);
        playersPage.clickStatsTableStat(1,3);
        playerPage.waitForTableToLoad();
      });

      test.it('clicking seasons export button returns correct CSV', function() {
        playerPage.clickOverviewSeasonsExportLink();
      });
      
      test.it('seasons csv file should have the correct data', function() {
        var exportFileContents = 'dateOfBirth,teamAbbrev,pos,year,type,team,dateOfBirth,G,GS,Comp%,PsYds,PsTD,Int/nATL,QB,2016,PLY,Falcons,1985-05-17,3,3,71.4%,1014,9,0/nATL,QB,2016,REG,Falcons,1985-05-17,16,16,69.9%,4944,38,7/nATL,QB,2015,REG,Falcons,1985-05-17,16,16,66.3%,4591,21,16/nATL,QB,2014,REG,Falcons,1985-05-17,16,16,66.1%,4694,28,14/nATL,QB,2013,REG,Falcons,1985-05-17,16,16,67.4%,4515,26,17/nATL,QB,2012,PLY,Falcons,1985-05-17,2,2,70.1%,646,6,3/nATL,QB,2012,REG,Falcons,1985-05-17,16,16,68.6%,4719,32,14/nATL,QB,2011,PLY,Falcons,1985-05-17,1,1,58.5%,199,0,0/nATL,QB,2011,REG,Falcons,1985-05-17,16,16,61.3%,4177,29,12/nATL,QB,2010,PLY,Falcons,1985-05-17,1,1,69.0%,186,1,2/nATL,QB,2010,REG,Falcons,1985-05-17,16,16,62.5%,3705,28,9/nATL,QB,2009,REG,Falcons,1985-05-17,14,14,58.3%,2916,22,14/nATL,QB,2008,PLY,Falcons,1985-05-17,1,1,65.0%,199,2,2/nATL,QB,2008,REG,Falcons,1985-05-17,16,16,61.1%,3440,16,11/n';
        
        return playerPage.readAndDeleteCSV().then(function(fileContents) {
          assert.equal(fileContents, exportFileContents);  
        })
      });

      test.it('clicking results export button returns correct CSV', function() {
        playerPage.clickOverviewResultsExportLink();
      });
      
      test.it('results csv file should have the correct data', function() {
        var exportFileContents = 'startTime,dateOfBirth,teamAbbrev,pos,week,opponent,date,result,stats/nRegular Season/n13:00:00,1985-05-17,ATL,QB,1,Buccaneers,2016-09-11,L 24 - 31,1985-05-17 dateOfBirth, 1 GS, 69.2% Comp%, 334 PsYds, 2 PsTD, 0 Int/n16:25:00,1985-05-17,ATL,QB,2,Raiders,2016-09-18,W 35 - 28,1985-05-17 dateOfBirth, 1 GS, 76.5% Comp%, 396 PsYds, 3 PsTD, 1 Int/n20:30:00,1985-05-17,ATL,QB,3,Saints,2016-09-26,W 45 - 32,1985-05-17 dateOfBirth, 1 GS, 66.7% Comp%, 240 PsYds, 2 PsTD, 0 Int/n13:00:00,1985-05-17,ATL,QB,4,Panthers,2016-10-02,W 48 - 33,1985-05-17 dateOfBirth, 1 GS, 75.7% Comp%, 503 PsYds, 4 PsTD, 1 Int/n16:05:00,1985-05-17,ATL,QB,5,Broncos,2016-10-09,W 23 - 16,1985-05-17 dateOfBirth, 1 GS, 53.6% Comp%, 267 PsYds, 1 PsTD, 0 Int/n16:25:00,1985-05-17,ATL,QB,6,Seahawks,2016-10-16,L 24 - 26,1985-05-17 dateOfBirth, 1 GS, 64.3% Comp%, 335 PsYds, 3 PsTD, 1 Int/n16:05:00,1985-05-17,ATL,QB,7,Chargers,2016-10-23,L 30 - 33,1985-05-17 dateOfBirth, 1 GS, 64.7% Comp%, 273 PsYds, 1 PsTD, 1 Int/n16:25:00,1985-05-17,ATL,QB,8,Packers,2016-10-30,W 33 - 32,1985-05-17 dateOfBirth, 1 GS, 80.0% Comp%, 288 PsYds, 3 PsTD, 0 Int/n20:25:00,1985-05-17,ATL,QB,9,Buccaneers,2016-11-03,W 43 - 28,1985-05-17 dateOfBirth, 1 GS, 73.5% Comp%, 344 PsYds, 4 PsTD, 0 Int/n13:00:00,1985-05-17,ATL,QB,10,Eagles,2016-11-13,L 15 - 24,1985-05-17 dateOfBirth, 1 GS, 54.5% Comp%, 267 PsYds, 1 PsTD, 1 Int/n13:00:00,1985-05-17,ATL,QB,12,Cardinals,2016-11-27,W 38 - 19,1985-05-17 dateOfBirth, 1 GS, 76.5% Comp%, 269 PsYds, 2 PsTD, 1 Int/n13:00:00,1985-05-17,ATL,QB,13,Chiefs,2016-12-04,L 28 - 29,1985-05-17 dateOfBirth, 1 GS, 64.7% Comp%, 297 PsYds, 1 PsTD, 1 Int/n16:25:00,1985-05-17,ATL,QB,14,Rams,2016-12-11,W 42 - 14,1985-05-17 dateOfBirth, 1 GS, 64.3% Comp%, 237 PsYds, 3 PsTD, 0 Int/n16:05:00,1985-05-17,ATL,QB,15,49ers,2016-12-18,W 41 - 13,1985-05-17 dateOfBirth, 1 GS, 73.9% Comp%, 286 PsYds, 2 PsTD, 0 Int/n13:00:00,1985-05-17,ATL,QB,16,Panthers,2016-12-24,W 33 - 16,1985-05-17 dateOfBirth, 1 GS, 81.8% Comp%, 277 PsYds, 2 PsTD, 0 Int/n16:25:00,1985-05-17,ATL,QB,17,Saints,2017-01-01,W 38 - 32,1985-05-17 dateOfBirth, 1 GS, 75.0% Comp%, 331 PsYds, 4 PsTD, 0 Int/nPlayoffs/n16:35:00,1985-05-17,ATL,QB,DIV,Seahawks,2017-01-14,W 36 - 20,1985-05-17 dateOfBirth, 1 GS, 70.3% Comp%, 338 PsYds, 3 PsTD, 0 Int/n15:05:00,1985-05-17,ATL,QB,LC,Packers,2017-01-22,W 44 - 21,1985-05-17 dateOfBirth, 1 GS, 71.1% Comp%, 392 PsYds, 4 PsTD, 0 Int/n18:30:00,1985-05-17,ATL,QB,SB,Patriots,2017-02-05,L 28 - 34,1985-05-17 dateOfBirth, 1 GS, 73.9% Comp%, 284 PsYds, 2 PsTD, 0 Int/n';
        
        return playerPage.readAndDeleteCSV().then(function(fileContents) {
          assert.equal(fileContents, exportFileContents);  
        })
      });

      test.it('clicking rank export button returns correct CSV', function() {
        playerPage.clickOverviewRankExportLink();
      });
      
      test.it('rank csv file should have the correct data', function() {
        var exportFileContents = 'Stat,Number,NFL Rank,NFL Leader,Div Rank,Div Leader/nundefined,1985-05-17,11,Tom Brady,2,Drew Brees/nQB Win,13,T2,Tom Brady,1,Matt Ryan/nQB Loss,6,T8,Tom Brady,1,Matt Ryan/nQBTie,0,T5,Carson Palmer,T1,Cam Newton/nQB Win Percentage,.684,6,Tom Brady,1,Matt Ryan/nPass Completions,443,3,Aaron Rodgers,2,Drew Brees/nPass Attempts,632,5,Aaron Rodgers,2,Drew Brees/nPass Completion Percentage,70.1%,2,Sam Bradford,1,Matt Ryan/nPassing Yards,5958,1,Matt Ryan,1,Matt Ryan/nPass Yards Per Pass Attempt,9.43,1,Matt Ryan,1,Matt Ryan/nPass Touchdowns,47,2,Aaron Rodgers,1,Matt Ryan/nPass Interceptions,7,7,Colin Kaepernick,1,Matt Ryan/nPass TD To Interception Ratio,6.71,2,Tom Brady,1,Matt Ryan/nNFL Passer Rating,119.9,1,Matt Ryan,1,Matt Ryan/nQB Sacks,45,T28,Derek Carr,4,Drew Brees/nPassing Long,76,T11,Drew Brees,3,Drew Brees/nPassing First Downs,292,1,Matt Ryan,1,Matt Ryan/n';
        
        return playerPage.readAndDeleteCSV().then(function(fileContents) {
          assert.equal(fileContents, exportFileContents);  
        })
      });
    }); 

    test.describe('#Page: Game Log', function() {
      test.it('test setup', function() {
        playerPage.goToSection("gameLog");
        playerPage.waitForTableToLoad();
      });   

      test.it('clicking export button', function() {
        playerPage.clickGameLogExportLink();
      });
      
      test.it('export csv file should have the correct data', function() {
        var exportFileContents = 'startTime,dateOfBirth,teamAbbrev,pos,year,team,week,opponent,date,result,G,QBWin,QBLoss,QBTie,QBWin%,Cmp,Att,Comp%,PsYds,Yd/Att,PsTD,Int,TD/Int,PsrRt,Sack,PsLg,Ps1st/n13:00:00,1985-05-17,ATL,QB,2016,Falcons,1,Buccaneers,2016-09-11,L 24 - 31,1,0,1,0,.000,27,39,69.2%,334,8.56,2,0,-,112.6,3,59,16/n16:25:00,1985-05-17,ATL,QB,2016,Falcons,2,Raiders,2016-09-18,W 35 - 28,1,1,0,0,1.000,26,34,76.5%,396,11.65,3,1,3.00,131.5,1,48,18/n20:30:00,1985-05-17,ATL,QB,2016,Falcons,3,Saints,2016-09-26,W 45 - 32,1,1,0,0,1.000,20,30,66.7%,240,8.00,2,0,-,113.2,2,34,13/n13:00:00,1985-05-17,ATL,QB,2016,Falcons,4,Panthers,2016-10-02,W 48 - 33,1,1,0,0,1.000,28,37,75.7%,503,13.59,4,1,4.00,142.0,3,75,18/n16:05:00,1985-05-17,ATL,QB,2016,Falcons,5,Broncos,2016-10-09,W 23 - 16,1,1,0,0,1.000,15,28,53.6%,267,9.54,1,0,-,98.4,2,49,10/n16:25:00,1985-05-17,ATL,QB,2016,Falcons,6,Seahawks,2016-10-16,L 24 - 26,1,0,1,0,.000,27,42,64.3%,335,7.98,3,1,3.00,102.8,4,46,17/n16:05:00,1985-05-17,ATL,QB,2016,Falcons,7,Chargers,2016-10-23,L 30 - 33,1,0,1,0,.000,22,34,64.7%,273,8.03,1,1,1.00,87.0,3,50,13/n16:25:00,1985-05-17,ATL,QB,2016,Falcons,8,Packers,2016-10-30,W 33 - 32,1,1,0,0,1.000,28,35,80.0%,288,8.23,3,0,-,129.5,2,47,16/n20:25:00,1985-05-17,ATL,QB,2016,Falcons,9,Buccaneers,2016-11-03,W 43 - 28,1,1,0,0,1.000,25,34,73.5%,344,10.12,4,0,-,144.7,2,32,20/n13:00:00,1985-05-17,ATL,QB,2016,Falcons,10,Eagles,2016-11-13,L 15 - 24,1,0,1,0,.000,18,33,54.5%,267,8.09,1,1,1.00,78.7,2,76,7/n13:00:00,1985-05-17,ATL,QB,2016,Falcons,12,Cardinals,2016-11-27,W 38 - 19,1,1,0,0,1.000,26,34,76.5%,269,7.91,2,1,2.00,106.1,3,35,15/n13:00:00,1985-05-17,ATL,QB,2016,Falcons,13,Chiefs,2016-12-04,L 28 - 29,1,0,1,0,.000,22,34,64.7%,297,8.74,1,1,1.00,90.0,2,42,15/n16:25:00,1985-05-17,ATL,QB,2016,Falcons,14,Rams,2016-12-11,W 42 - 14,1,1,0,0,1.000,18,28,64.3%,237,8.46,3,0,-,126.6,2,64,12/n16:05:00,1985-05-17,ATL,QB,2016,Falcons,15,49ers,2016-12-18,W 41 - 13,1,1,0,0,1.000,17,23,73.9%,286,12.43,2,0,-,144.5,1,59,16/n13:00:00,1985-05-17,ATL,QB,2016,Falcons,16,Panthers,2016-12-24,W 33 - 16,1,1,0,0,1.000,27,33,81.8%,277,8.39,2,0,-,121.8,4,31,13/n16:25:00,1985-05-17,ATL,QB,2016,Falcons,17,Saints,2017-01-01,W 38 - 32,1,1,0,0,1.000,27,36,75.0%,331,9.19,4,0,-,139.9,1,35,19/n';
        
        return playerPage.readAndDeleteCSV().then(function(fileContents) {
          assert.equal(fileContents, exportFileContents);  
        })
      });

      test.it('clicking export all button', function() {
        playerPage.clickGameLogExportAllLink();
      });
      
      test.it('export all csv file should have the correct data', function() {
        return playerPage.readAndDeleteCSV().then(function(fileContents) {
          assert.isNotNull(fileContents);  
        })
      });
    });

    test.describe('#Page: Play By Play', function() {
      test.it('test setup', function() {
        playerPage.goToSection("playByPlay");
        filters.changeFilterGroupDropdown('Drive');
        filters.changeValuesForRangeSidebarFilter('Drive Start Dist to Goal:', 50, 55);
        // playerPage.waitForTableToLoad();
      });   

      test.it('clicking export button returns correct CSV', function() {
        playerPage.clickPlayByPlayExportLink();
      });
      
      test.it('export csv file should have the correct data', function() {
        var exportFileContents = 'startTime,week,dateOfBirth,teamAbbrev,pos,offense_team,defense_team,home_team,away_team,home_final_score,away_final_score,game_id,date,play_group_id,drive_index,down,first_down_dist,goal_dist,quarter,game_clock,offense_current_score,defense_current_score,offense_points_scored,defense_points_scored,play_type,play_result,pass_result,kick_result,yards_gained,fg_yards,kickoff_yards,punt_yards,kickoff_return_yards,punt_return_yards,offense_penalty_yards,defense_penalty_yards,post_kickoff_goal_dist,post_punt_goal_dist,pass_first_down,rush_first_down,penalty_first_downs,interception,fumble_lost,passer,rusher,target,kicker,returner,desc/n16:05:00,15,1985-05-17,ATL,QB,ATL,SF,ATL,SF,41,13,2016121809,12/18/2016,396,4,2,10,50,1,9:03,7,0,,,PASS,FIRST DOWN,COMPLETE,,20,,,,,,,,,,1,,,,,M. Ryan,,T. Gabriel,,,(9:03) 2-M.Ryan pass short right to 18-T.Gabriel to SF 30 for 20 yards (41-A.Bethea)./n16:05:00,15,1985-05-17,ATL,QB,ATL,SF,ATL,SF,41,13,2016121809,12/18/2016,441,4,1,9,9,1,7:54,7,0,,,PASS,,INCOMPLETE,,0,,,,,,,,,,,,,,,M. Ryan,,J. Hardy,,,(7:54) 2-M.Ryan pass incomplete short left to 16-J.Hardy./n16:05:00,15,1985-05-17,ATL,QB,ATL,SF,ATL,SF,41,13,2016121809,12/18/2016,463,4,2,9,9,1,7:48,7,0,6,,PASS,TD,COMPLETE,,9,,,,,,,,,,1,,,,,M. Ryan,,T. Gabriel,,,(7:48) 2-M.Ryan pass short left to 18-T.Gabriel for 9 yards, TOUCHDOWN./n16:05:00,15,1985-05-17,ATL,QB,ATL,SF,ATL,SF,41,13,2016121809,12/18/2016,668,6,2,12,43,1,4:39,14,0,,,PASS,FIRST DOWN,COMPLETE,,16,,,,,,,,,,1,,,,,M. Ryan,,M. Sanu,,,(4:39) (Shotgun) 2-M.Ryan pass short middle to 12-M.Sanu to SF 27 for 16 yards (29-J.Tartt)./n16:05:00,15,1985-05-17,ATL,QB,ATL,SF,ATL,SF,41,13,2016121809,12/18/2016,692,6,1,10,27,1,4:09,14,0,,,PASS,FIRST DOWN,COMPLETE,,11,,,,,,,,,,1,,,,,M. Ryan,,A. Robinson,,,(4:09) 2-M.Ryan pass short right to 19-A.Robinson to SF 16 for 11 yards (26-T.Brock)./n16:05:00,15,1985-05-17,ATL,QB,ATL,SF,ATL,SF,41,13,2016121809,12/18/2016,737,6,2,7,13,1,3:08,14,0,,,PASS,,COMPLETE,,4,,,,,,,,,,,,,,,M. Ryan,,T. Coleman,,,(3:08) 2-M.Ryan pass short right to 26-T.Coleman to SF 9 for 4 yards (59-A.Lynch)./n16:05:00,15,1985-05-17,ATL,QB,ATL,SF,ATL,SF,41,13,2016121809,12/18/2016,778,6,3,3,9,1,2:21,14,0,,,PASS,FIRST DOWN,COMPLETE,,8,,,,,,,,,,1,,,,,M. Ryan,,D. Freeman,,,(2:21) (Shotgun) 2-M.Ryan pass short right to 24-D.Freeman pushed ob at SF 1 for 8 yards (40-V.Sunseri)./n16:05:00,15,1985-05-17,ATL,QB,ATL,SF,ATL,SF,41,13,2016121809,12/18/2016,846,6,2,9,9,1,0:54,14,0,,,PASS,,INCOMPLETE,,0,,,,,,,,,,,,,,,M. Ryan,,,,,(:54) (Shotgun) 2-M.Ryan pass incomplete short right [90-G.Dorsey]./n16:05:00,15,1985-05-17,ATL,QB,ATL,SF,ATL,SF,41,13,2016121809,12/18/2016,868,6,3,9,9,1,0:47,14,0,6,,PASS,TD,COMPLETE,,9,,,,,,,,,,1,,,,,M. Ryan,,A. Hooper,,,(:47) (Shotgun) 2-M.Ryan pass short right to 81-A.Hooper for 9 yards, TOUCHDOWN./n16:25:00,14,1985-05-17,ATL,QB,ATL,LA,LA,ATL,14,42,2016121112,12/11/2016,2797,19,3,5,39,3,6:39,28,0,,,PASS,FIRST DOWN,COMPLETE,,19,,,,,,,,,,1,,,,,M. Ryan,,N. Williams,,,(6:39) (Shotgun) 2-M.Ryan pass short right to 15-N.Williams to LA 20 for 19 yards (31-M.Alexander; 22-T.Johnson)./n16:25:00,14,1985-05-17,ATL,QB,ATL,LA,LA,ATL,14,42,2016121112,12/11/2016,2842,19,2,9,19,3,5:19,28,0,,,PASS,,COMPLETE,,3,,,,,,,,,,,,,,,M. Ryan,,D. Freeman,,,(5:19) 2-M.Ryan pass short middle to 24-D.Freeman to LA 16 for 3 yards (95-W.Hayes)./n16:25:00,14,1985-05-17,ATL,QB,ATL,LA,LA,ATL,14,42,2016121112,12/11/2016,2866,19,3,6,16,3,4:33,28,0,,,PASS,FIRST DOWN,COMPLETE,,10,,,,,,,,,,1,,,,,M. Ryan,,N. Williams,,,(4:33) (Shotgun) 2-M.Ryan pass short middle to 15-N.Williams to LA 6 for 10 yards (31-M.Alexander). LA-31-M.Alexander was injured during the play. His return is Doubtful./n13:00:00,10,1985-05-17,ATL,QB,ATL,PHI,PHI,ATL,24,15,2016111305,11/13/2016,1821,11,1,10,52,2,0:03,6,7,,,PASS,,INCOMPLETE,,0,,,,,,,,,,,,,,,M. Ryan,,,,,(:03) (Shotgun) 2-M.Ryan pass incomplete short left./n13:00:00,10,1985-05-17,ATL,QB,ATL,PHI,PHI,ATL,24,15,2016111305,11/13/2016,3018,17,1,10,55,4,10:46,15,13,,,PASS,,INCOMPLETE,,0,,,,,,,,,,,,,,,M. Ryan,,T. Gabriel,,,(10:46) (Shotgun) 2-M.Ryan pass incomplete short left to 18-T.Gabriel [91-F.Cox]./n13:00:00,10,1985-05-17,ATL,QB,ATL,PHI,PHI,ATL,24,15,2016111305,11/13/2016,3040,17,2,10,55,4,10:40,15,13,,,PASS,,INCOMPLETE,,0,,,,,,,,,,,,,,,M. Ryan,,J. Jones,,,(10:40) (Shotgun) 2-M.Ryan pass incomplete deep left to 11-J.Jones./n13:00:00,10,1985-05-17,ATL,QB,ATL,PHI,PHI,ATL,24,15,2016111305,11/13/2016,3062,17,3,10,55,4,10:35,15,13,,,PASS,,INCOMPLETE,,0,,,,,,,,,,,,,,,M. Ryan,,T. Gabriel,,,(10:35) (Shotgun) 2-M.Ryan pass incomplete short right to 18-T.Gabriel./n16:05:00,7,1985-05-17,ATL,QB,ATL,LAC,ATL,LAC,30,33,2016102309,10/23/2016,1404,8,2,12,52,2,7:12,13,10,,,PASS,FIRST DOWN,COMPLETE,,14,,,,,,,,,,1,,,,,M. Ryan,,J. Jones,,,(7:12) 2-M.Ryan pass short middle to 11-J.Jones to SD 38 for 14 yards (20-D.Lowery)./n13:00:00,4,1985-05-17,ATL,QB,ATL,CAR,ATL,CAR,48,33,2016100201,10/02/2016,3120,18,2,14,54,4,10:50,34,18,,,PASS,,COMPLETE,,4,,,,,,,,,,,,,,,M. Ryan,,M. Sanu,,,(10:50) (Shotgun) 2-M.Ryan pass short right to 12-M.Sanu to 50 for 4 yards (54-S.Thompson)./n13:00:00,4,1985-05-17,ATL,QB,ATL,CAR,ATL,CAR,48,33,2016100201,10/02/2016,3144,18,3,10,50,4,10:06,34,18,,,RUSH,,,,1,,,,,,,,,,,,,,,,M. Ryan,,,,(10:06) (Shotgun) 2-M.Ryan scrambles right end ran ob at CAR 49 for 1 yard (59-L.Kuechly)./n13:00:00,4,1985-05-17,ATL,QB,ATL,CAR,ATL,CAR,48,33,2016100201,10/02/2016,4277,25,1,10,50,4,0:37,48,33,,,RUSH,,,,-1,,,,,,,,,,,,,,,,M. Ryan,,,,(:37) 2-M.Ryan kneels to ATL 49 for -1 yards./n16:25:00,2,1985-05-17,ATL,QB,ATL,OAK,OAK,ATL,28,35,2016091811,09/18/2016,3729,18,3,3,43,4,6:12,28,21,,,PASS,FIRST DOWN,COMPLETE,,5,,,,,,,,,,1,,,,,M. Ryan,,L. Toilolo,,,(6:12) (No Huddle, Shotgun) 2-M.Ryan pass short middle to 80-L.Toilolo to OAK 38 for 5 yards (57-C.James)./n16:25:00,2,1985-05-17,ATL,QB,ATL,OAK,OAK,ATL,28,35,2016091811,09/18/2016,3753,18,1,10,38,4,5:34,28,21,,,PASS,FIRST DOWN,COMPLETE,,20,,,,,,,,,,1,,,,,M. Ryan,,J. Jones,,,(5:34) 2-M.Ryan pass short middle to 11-J.Jones to OAK 18 for 20 yards (21-S.Smith, 27-R.Nelson)./n';
        
        return playerPage.readAndDeleteCSV().then(function(fileContents) {
          assert.equal(fileContents, exportFileContents);  
        })
      });
    });      

    test.describe('#Page: Occurrences & Streaks', function() {
      test.it('test setup', function() {
        playerPage.goToSection("occurrencesAndStreaks");
        playerPage.waitForTableToLoad();
      });   

      test.it('clicking export button returns correct CSV', function() {
        playerPage.clickStreaksExportLink();
      });
      
      test.it('export csv file should have the correct data', function() {
        var exportFileContents = 'Count,dateOfBirth,teamAbbrev,pos,TD,startDate,endDate/n/n,1985-05-17,ATL,QB,2,2016-12-18 16:05:00,2016-12-18 16:05:00/n';
        
        return playerPage.readAndDeleteCSV().then(function(fileContents) {
          assert.equal(fileContents, exportFileContents);  
        })
      });
    });

    test.describe('#Page: Splits', function() {
      test.it('test setup', function() {
        playerPage.goToSection("splits");
        playerPage.waitForTableToLoad();
      });     

      test.it('clicking export button returns correct CSV', function() {
        playerPage.clickSplitsFilterExportLink();
      });
      
      test.it('export csv file should have the correct data', function() {
        var exportFileContents = 'SplitBy,dateOfBirth,teamAbbrev,pos,G,QBWin,QBLoss,QBTie,QBWin%,Cmp,Att,Comp%,PsYds,Yd/Att,PsTD,Int,TD/Int,PsrRt,Sack,PsLg,Ps1st/nTotals/nTotals,1985-05-17,ATL,QB,10,4,2,0,.400,14,20,70.0%,152,7.60,2,0,-,125.4,0,20,11/nSeasons/nREG,2016,10,4,2,0,.400,14,20,70.0%,152,7.60,2,0,-,125.4,0,20,11/nHome/Road/nHome,1985-05-17,ATL,QB,4,2,1,0,.500,9,11,81.8%,95,8.64,2,0,-,142.2,0,20,7/nRoad,1985-05-17,ATL,QB,6,2,1,0,.333,5,9,55.6%,57,6.33,0,0,-,74.8,0,20,4/nNeutral,,,,0,0,0,0,-,0,0,-,0,-,0,0,-,-,0,0,0/nDivision/nAFC East,,,,0,0,0,0,-,0,0,-,0,-,0,0,-,-,0,0,0/nAFC North,,,,0,0,0,0,-,0,0,-,0,-,0,0,-,-,0,0,0/nAFC South,,,,0,0,0,0,-,0,0,-,0,-,0,0,-,-,0,0,0/nAFC West,1985-05-17,ATL,QB,3,1,1,0,.333,3,3,100.0%,39,13.00,0,0,-,118.8,0,20,3/nNFC East,1985-05-17,ATL,QB,1,0,1,0,.000,0,4,0.0%,0,0.00,0,0,-,39.6,0,0,0/nNFC North,,,,0,0,0,0,-,0,0,-,0,-,0,0,-,-,0,0,0/nNFC South,1985-05-17,ATL,QB,3,1,0,0,.333,1,1,100.0%,4,4.00,0,0,-,83.3,0,4,0/nNFC West,1985-05-17,ATL,QB,3,2,0,0,.667,10,12,83.3%,109,9.08,2,0,-,144.1,0,20,8/nQuarter/nQ1,1985-05-17,ATL,QB,2,1,0,0,.500,7,9,77.8%,77,8.56,2,0,-,141.9,0,20,6/nQ2,1985-05-17,ATL,QB,3,0,2,0,.000,1,2,50.0%,14,7.00,0,0,-,72.9,0,14,1/nQ3,1985-05-17,ATL,QB,1,1,0,0,1.000,3,3,100.0%,32,10.67,0,0,-,111.1,0,19,2/nQ4,1985-05-17,ATL,QB,6,2,1,0,.333,3,6,50.0%,29,4.83,0,0,-,63.9,0,20,2/nOT,,,,0,0,0,0,-,0,0,-,0,-,0,0,-,-,0,0,0/nDowns/n1st Down,1985-05-17,ATL,QB,10,4,2,0,.400,2,5,40.0%,31,6.20,0,0,-,61.3,0,20,2/n2nd Down,1985-05-17,ATL,QB,9,4,2,0,.444,7,9,77.8%,70,7.78,1,0,-,136.1,0,20,4/n3rd Down,1985-05-17,ATL,QB,8,4,1,0,.500,5,6,83.3%,51,8.50,1,0,-,141.7,0,19,5/n4th Down,1985-05-17,ATL,QB,5,1,1,0,.200,0,0,-,0,-,0,0,-,-,0,0,0/nGoalline Distance/nRed Zone,1985-05-17,ATL,QB,5,3,1,0,.600,6,8,75.0%,43,5.38,2,0,-,126.6,0,10,4/n20-39,1985-05-17,ATL,QB,6,3,1,0,.500,3,3,100.0%,50,16.67,0,0,-,118.8,0,20,3/n40-59,1985-05-17,ATL,QB,10,4,2,0,.400,5,9,55.6%,59,6.56,0,0,-,75.7,0,20,4/n60-79,1985-05-17,ATL,QB,1,1,0,0,1.000,0,0,-,0,-,0,0,-,-,0,0,0/n80-100,1985-05-17,ATL,QB,1,0,0,0,.000,0,0,-,0,-,0,0,-,-,0,0,0/nFirst Down Distance/n0-1,1985-05-17,ATL,QB,6,3,1,0,.500,0,0,-,0,-,0,0,-,-,0,0,0/n2-5,1985-05-17,ATL,QB,7,3,1,0,.429,3,3,100.0%,32,10.67,0,0,-,111.1,0,19,3/n6-10,1985-05-17,ATL,QB,10,4,2,0,.400,8,14,57.1%,86,6.14,2,0,-,114.9,0,20,6/n11-19,1985-05-17,ATL,QB,6,2,1,0,.333,3,3,100.0%,34,11.33,0,0,-,113.9,0,16,2/n20+,1985-05-17,ATL,QB,1,0,0,0,.000,0,0,-,0,-,0,0,-,-,0,0,0/nGoal To Go Distance/n0-1,1985-05-17,ATL,QB,2,1,0,0,.500,0,0,-,0,-,0,0,-,-,0,0,0/n2-5,1985-05-17,ATL,QB,1,0,0,0,.000,0,0,-,0,-,0,0,-,-,0,0,0/n6-10,1985-05-17,ATL,QB,3,2,0,0,.667,2,4,50.0%,18,4.50,2,0,-,102.1,0,9,2/n11-15,,,,0,0,0,0,-,0,0,-,0,-,0,0,-,-,0,0,0/n16-20,,,,0,0,0,0,-,0,0,-,0,-,0,0,-,-,0,0,0/n21+,,,,0,0,0,0,-,0,0,-,0,-,0,0,-,-,0,0,0/nTargeted Receivers/n1985-05-17,Austin Hooper,1,1,0,0,1.000,1,1,100.0%,9,9.00,1,0,-,143.8,0,9,1/n1985-05-17,Nick Williams,2,2,0,0,1.000,2,2,100.0%,29,14.50,0,0,-,118.8,0,19,2/n1985-05-17,Taylor Gabriel,4,2,2,0,.500,2,4,50.0%,29,7.25,1,0,-,113.5,0,20,2/n1985-05-17,Aldrick Robinson,1,1,0,0,1.000,1,1,100.0%,11,11.00,0,0,-,112.5,0,11,1/n1985-05-17,Mohamed Sanu,2,2,0,0,1.000,2,2,100.0%,20,10.00,0,0,-,108.3,0,16,1/n1985-05-17,Julio Jones,3,1,2,0,.333,2,3,66.7%,34,11.33,0,0,-,104.9,0,20,2/n1985-05-17,Devonta Freeman,2,2,0,0,1.000,2,2,100.0%,11,5.50,0,0,-,89.6,0,8,1/n1985-05-17,Levine Toilolo,1,1,0,0,1.000,1,1,100.0%,5,5.00,0,0,-,87.5,0,5,1/n1985-05-17,Tevin Coleman,1,1,0,0,1.000,1,1,100.0%,4,4.00,0,0,-,83.3,0,4,0/n1985-05-17,Justin Hardy,1,1,0,0,1.000,0,1,0.0%,0,0.00,0,0,-,39.6,0,0,0/nAir Yards/nAir Yards Behind LOS,1985-05-17,1,1,0,0,1.000,1,1,100.0%,4,4.00,0,0,-,83.3,0,4,0/nAir Yards 0-10,1985-05-17,5,4,1,0,.800,8,11,72.7%,67,6.09,2,0,-,127.7,0,19,6/nAir Yards 11-20,1985-05-17,4,2,2,0,.500,5,7,71.4%,81,11.57,0,0,-,109.8,0,20,5/nAir Yards 21-30,1985-05-17,1,0,1,0,.000,0,1,0.0%,0,0.00,0,0,-,39.6,0,0,0/n';
        
        return playerPage.readAndDeleteCSV().then(function(fileContents) {
          assert.equal(fileContents, exportFileContents);  
        })
      });
    });

    test.describe('#Page: Multi-Filter', function() {
      test.it('test setup', function() {
        playerPage.goToSection("multiFilter");
        playerPage.waitForTableToLoad();
      });     

      test.it('clicking export button returns correct CSV', function() {
        playerPage.clickMultiFilterExportLink();
      });
      
      test.it('export csv file should have the correct data', function() {
        var exportFileContents = 'dateOfBirth,teamAbbrev,pos,filter,G,QBWin,QBLoss,QBTie,QBWin%,Cmp,Att,Comp%,PsYds,Yd/Att,PsTD,Int,TD/Int,PsrRt,Sack,PsLg,Ps1st/n1985-05-17,ATL,QB,top,10,4,2,0,.400,14,20,70.0%,152,7.60,2,0,-,125.4,0,20,11/n1985-05-17,bottom,Matt Ryan,310,5,0,.688,373,534,69.9%,4944,9.26,38,7,5.43,117.1,37,76,238/n';
        
        return playerPage.readAndDeleteCSV().then(function(fileContents) {
          assert.equal(fileContents, exportFileContents);  
        })
      });
    });      

    test.describe('#Page: Performance Log', function() {
      test.it('test setup', function() {
        playerPage.goToSection("performanceLog");
        var playerUrl = '/football/player-performance-log/Carlos%20Hyde/2543743/nfl?pc=%7B"fsv"%3A"stats"%7D';
        playerPage.visit(url+playerUrl);
        filters.addSelectionToDropdownSidebarFilter('Season:', 2016);
        playerPage.waitForTableToLoad();
      });  

      test.it('clicking export button', function() {
        playerPage.clickPerformanceLogExportLink();
      });
      
      test.it('export csv file should have the correct data', function() {
        var exportFileContents = 'startTime,dateOfBirth,year,team,week,event,date,result,pos,Pract,G,TimeMoving,DistTotal,RelTargetMPH,RelWalkYds,RelJogYds,RelRunYds,RelSprintYds,RelMaxSprintYds,RelWalkTime,RelJogTime,RelRunTime,RelSprintTime,RelMaxSprintTime,RelHardEffortDist,RelSprintCount,RelMaxSprintCount/n11:50:00,1990-09-20,2016,49ers,17,,2017-04-20,Drills: 7,RB,1,0,0:10:21,1041,19.1,431,585,25,0,0,0:06:37,0:03:39,0:00:04,0:00:00,0:00:00,25,0,0/n11:50:00,1990-09-20,2016,49ers,17,,2017-04-19,Drills: 9,RB,1,0,0:17:10,2184,19.1,667,1330,187,0,0,0:09:50,0:06:49,0:00:30,0:00:00,0:00:00,187,0,0/n11:52:00,1990-09-20,2016,49ers,17,,2017-04-13,Drills: 9,RB,1,0,0:12:43,1650,19.1,433,830,270,116,1,0:06:36,0:05:10,0:00:41,0:00:14,0:00:00,387,4,0/n12:00:00,1990-09-20,2016,49ers,17,,2017-04-12,Drills: 9,RB,1,0,0:12:49,1775,19.1,449,857,411,58,0,0:06:55,0:04:41,0:01:05,0:00:07,0:00:00,469,1,0/n16:25:00,1990-09-20,2016,49ers,16,Rams,2016-12-24,W 22 - 21,RB,0,1,0:15:42,1727,19.1,534,1080,91,21,0,0:08:02,0:07:22,0:00:14,0:00:02,0:00:00,113,1,0/n13:42:56,1990-09-20,2016,49ers,16,,2016-12-21,Drills: 20,RB,1,0,0:29:16,2757,19.1,1421,1152,184,0,0,0:21:34,0:07:12,0:00:29,0:00:00,0:00:00,184,0,0/n13:42:22,1990-09-20,2016,49ers,16,,2016-12-20,Drills: 16,RB,1,0,0:27:38,2608,19.1,1300,1120,188,0,0,0:20:03,0:07:04,0:00:30,0:00:00,0:00:00,188,0,0/n16:05:00,1990-09-20,2016,49ers,15,Falcons,2016-12-18,L 13 - 41,RB,0,1,0:17:02,1983,19.1,576,1132,229,46,0,0:08:35,0:07:45,0:00:35,0:00:05,0:00:00,275,5,0/n12:56:49,1990-09-20,2016,49ers,15,,2016-12-15,Drills: 20,RB,1,0,0:28:03,2830,19.1,1134,1521,175,0,0,0:17:09,0:10:26,0:00:27,0:00:00,0:00:00,175,0,0/n13:42:48,1990-09-20,2016,49ers,15,,2016-12-14,Drills: 21,RB,1,0,0:30:00,3001,19.1,1364,1302,302,33,1,0:20:52,0:08:15,0:00:47,0:00:04,0:00:00,336,2,0/n13:49:22,1990-09-20,2016,49ers,15,,2016-12-13,Drills: 14,RB,1,0,0:20:09,1924,19.1,928,896,100,0,0,0:14:08,0:05:46,0:00:15,0:00:00,0:00:00,100,0,0/n16:05:00,1990-09-20,2016,49ers,14,Jets,2016-12-11,L 17 - 23,RB,0,1,0:18:27,2119,19.1,643,1178,136,82,80,0:09:44,0:08:02,0:00:20,0:00:10,0:00:09,298,4,4/n13:42:26,1990-09-20,2016,49ers,14,,2016-12-08,Drills: 23,RB,1,0,0:35:08,3435,19.1,1638,1529,240,28,0,0:24:44,0:09:43,0:00:36,0:00:03,0:00:00,268,2,0/n13:42:52,1990-09-20,2016,49ers,14,,2016-12-07,Drills: 21,RB,1,0,0:32:30,3135,19.1,1527,1282,326,0,0,0:23:02,0:08:35,0:00:52,0:00:00,0:00:00,326,0,0/n13:52:38,1990-09-20,2016,49ers,14,,2016-12-06,Drills: 14,RB,1,0,0:23:12,2309,19.1,1054,1033,221,0,0,0:16:09,0:06:28,0:00:35,0:00:00,0:00:00,222,0,0/n13:00:00,1990-09-20,2016,49ers,13,Bears,2016-12-04,L 6 - 26,RB,0,1,0:18:58,2016,19.1,707,1203,92,12,2,0:10:39,0:08:02,0:00:14,0:00:01,0:00:00,106,1,0/n13:00:00,1990-09-20,2016,49ers,12,Dolphins,2016-11-27,L 24 - 31,RB,0,1,0:24:35,2748,19.1,853,1596,234,56,8,0:12:59,0:10:50,0:00:36,0:00:07,0:00:00,298,4,1/n13:03:07,1990-09-20,2016,49ers,12,,2016-11-24,Drills: 23,RB,1,0,0:32:46,2937,19.1,1622,1125,176,15,0,0:24:53,0:07:23,0:00:27,0:00:01,0:00:00,190,1,0/n13:43:42,1990-09-20,2016,49ers,12,,2016-11-23,Drills: 20,RB,1,0,0:33:40,3580,19.1,1417,1770,353,38,0,0:21:32,0:11:07,0:00:55,0:00:04,0:00:00,392,2,0/n13:51:31,1990-09-20,2016,49ers,12,,2016-11-22,Drills: 14,RB,1,0,0:23:25,2250,19.1,1081,963,184,21,1,0:16:33,0:06:19,0:00:28,0:00:02,0:00:00,206,1,0/n16:25:00,1990-09-20,2016,49ers,11,Patriots,2016-11-20,L 17 - 30,RB,0,1,0:21:09,2344,19.1,784,1301,205,41,13,0:11:49,0:08:41,0:00:32,0:00:05,0:00:01,259,3,1/n13:48:12,1990-09-20,2016,49ers,11,,2016-11-17,Drills: 23,RB,1,0,0:35:30,3706,19.1,1554,1680,419,53,0,0:23:40,0:10:37,0:01:05,0:00:06,0:00:00,472,4,0/n13:42:48,1990-09-20,2016,49ers,11,,2016-11-16,Drills: 20,RB,1,0,0:31:44,3668,19.1,1247,1814,568,28,11,0:18:59,0:11:10,0:01:28,0:00:03,0:00:01,607,2,1/n13:51:07,1990-09-20,2016,49ers,11,,2016-11-15,Drills: 14,RB,1,0,0:22:57,2343,19.1,1008,1128,207,0,0,0:15:37,0:06:47,0:00:32,0:00:00,0:00:00,207,0,0/n16:25:00,1990-09-20,2016,49ers,10,Cardinals,2016-11-13,L 20 - 23,RB,0,1,0:22:11,2471,19.1,748,1498,184,25,15,0:11:27,0:10:09,0:00:29,0:00:03,0:00:01,225,2,1/n13:43:51,1990-09-20,2016,49ers,10,,2016-11-10,Drills: 24,RB,1,0,0:40:45,4337,19.1,1745,1986,507,97,1,0:26:23,0:12:51,0:01:18,0:00:12,0:00:00,606,6,0/n13:44:11,1990-09-20,2016,49ers,10,,2016-11-09,Drills: 21,RB,1,0,0:33:39,3636,19.1,1433,1794,341,30,37,0:21:32,0:11:05,0:00:54,0:00:03,0:00:04,409,1,1/n13:51:17,1990-09-20,2016,49ers,10,,2016-11-08,Drills: 14,RB,1,0,0:24:27,2524,19.1,1069,1190,259,7,0,0:16:09,0:07:37,0:00:39,0:00:00,0:00:00,266,1,0/n13:43:17,1990-09-20,2016,49ers,9,,2016-11-03,Drills: 24,RB,1,0,0:29:40,2907,19.1,1287,1330,235,33,23,0:20:35,0:08:21,0:00:36,0:00:04,0:00:02,291,1,1/n13:45:13,1990-09-20,2016,49ers,9,,2016-11-02,Drills: 21,RB,1,0,0:31:38,3544,19.1,1265,1761,463,53,1,0:19:17,0:11:00,0:01:13,0:00:06,0:00:00,517,3,0/n13:48:32,1990-09-20,2016,49ers,9,,2016-11-01,Drills: 14,RB,1,0,0:24:43,2541,19.1,1137,1069,310,25,1,0:17:15,0:06:36,0:00:47,0:00:03,0:00:00,335,1,0/n13:00:00,1990-09-20,2016,49ers,6,Bills,2016-10-16,L 16 - 45,RB,0,1,0:15:49,1722,19.1,551,1015,118,22,16,0:08:09,0:07:17,0:00:18,0:00:02,0:00:01,156,2,1/n13:44:10,1990-09-20,2016,49ers,6,,2016-10-13,Drills: 24,RB,1,0,0:36:28,3699,19.1,1601,1716,358,24,0,0:24:45,0:10:43,0:00:56,0:00:03,0:00:00,382,2,0/n13:43:56,1990-09-20,2016,49ers,6,,2016-10-12,Drills: 20,RB,1,0,0:31:00,3300,19.1,1381,1664,255,1,0,0:20:31,0:09:48,0:00:40,0:00:00,0:00:00,256,0,0/n13:48:55,1990-09-20,2016,49ers,6,,2016-10-11,Drills: 14,RB,1,0,0:22:39,2298,19.1,1013,1082,164,38,0,0:15:37,0:06:31,0:00:25,0:00:04,0:00:00,203,2,0/n20:25:00,1990-09-20,2016,49ers,5,Cardinals,2016-10-06,L 21 - 33,RB,0,1,0:28:36,3093,19.1,1031,1833,212,9,7,0:15:21,0:12:38,0:00:33,0:00:01,0:00:00,228,0,1/n16:25:00,1990-09-20,2016,49ers,4,Cowboys,2016-10-02,L 17 - 24,RB,0,1,0:21:00,2336,19.1,745,1327,214,47,3,0:11:15,0:09:05,0:00:33,0:00:06,0:00:00,264,3,0/n13:44:51,1990-09-20,2016,49ers,4,,2016-09-29,Drills: 24,RB,1,0,0:37:17,3672,19.1,1658,1738,236,34,5,0:25:41,0:10:53,0:00:37,0:00:04,0:00:00,275,1,1/n13:44:03,1990-09-20,2016,49ers,4,,2016-09-28,Drills: 20,RB,1,0,0:27:22,2876,19.1,1204,1338,323,12,0,0:18:13,0:08:16,0:00:50,0:00:01,0:00:00,334,2,0/n13:52:24,1990-09-20,2016,49ers,4,,2016-09-27,Drills: 14,RB,1,0,0:21:10,2163,19.1,943,963,242,14,0,0:14:26,0:06:04,0:00:37,0:00:01,0:00:00,256,1,0/n16:05:00,1990-09-20,2016,49ers,3,Seahawks,2016-09-25,L 18 - 37,RB,0,1,0:19:51,2268,19.1,674,1383,184,12,15,0:10:05,0:09:13,0:00:28,0:00:01,0:00:01,211,1,1/n13:34:17,1990-09-20,2016,49ers,3,,2016-09-22,Drills: 23,RB,1,0,0:35:00,3746,19.1,1545,1788,348,65,0,0:23:04,0:10:52,0:00:54,0:00:08,0:00:00,413,4,0/n13:33:58,1990-09-20,2016,49ers,3,,2016-09-21,Drills: 20,RB,1,0,0:32:13,3438,19.1,1410,1662,358,8,0,0:20:52,0:10:23,0:00:56,0:00:01,0:00:00,366,1,0/n13:41:41,1990-09-20,2016,49ers,3,,2016-09-20,Drills: 14,RB,1,0,0:19:41,2062,19.1,853,976,211,21,0,0:12:52,0:06:13,0:00:32,0:00:02,0:00:00,233,2,0/n13:00:00,1990-09-20,2016,49ers,2,Panthers,2016-09-18,L 27 - 46,RB,0,1,0:21:15,2343,19.1,677,1488,160,10,9,0:10:01,0:10:45,0:00:25,0:00:01,0:00:00,179,0,1/n13:34:45,1990-09-20,2016,49ers,2,,2016-09-15,Drills: 23,RB,1,0,0:37:45,4026,19.1,1606,2054,362,3,0,0:24:08,0:12:38,0:00:57,0:00:00,0:00:00,366,0,0/n13:36:51,1990-09-20,2016,49ers,2,,2016-09-14,Drills: 18,RB,1,0,0:27:19,3086,19.1,1078,1690,286,32,0,0:16:24,0:10:05,0:00:44,0:00:04,0:00:00,318,1,0/n22:20:00,1990-09-20,2016,49ers,1,Rams,2016-09-12,W 28 - 0,RB,0,1,0:28:12,3098,19.1,959,1900,219,15,5,0:14:39,0:12:55,0:00:34,0:00:01,0:00:00,239,1,1/n13:34:38,1990-09-20,2016,49ers,1,,2016-09-09,Drills: 24,RB,1,0,0:35:14,3616,19.1,1536,1814,242,23,0,0:23:16,0:11:16,0:00:38,0:00:02,0:00:00,266,1,0/n13:34:13,1990-09-20,2016,49ers,1,,2016-09-08,Drills: 19,RB,1,0,0:28:08,3080,19.1,1103,1665,293,18,1,0:17:05,0:10:14,0:00:46,0:00:02,0:00:00,312,1,0/n22:00:00,1990-09-20,2016,49ers,P4,Packers,2016-08-26,L 10 - 21,RB,0,1,0:09:00,1032,19.1,278,611,122,7,13,0:04:16,0:04:22,0:00:19,0:00:00,0:00:01,143,0,1/n12:53:56,1990-09-20,2016,49ers,P4,,2016-08-25,Drills: 6,RB,1,0,0:18:53,2240,19.1,662,1442,125,11,0,0:10:03,0:08:28,0:00:20,0:00:01,0:00:00,136,1,0/n13:33:21,1990-09-20,2016,49ers,P4,,2016-08-23,Drills: 19,RB,1,0,0:39:57,3888,19.1,1734,1918,237,0,0,0:26:46,0:12:33,0:00:37,0:00:00,0:00:00,237,0,0/n13:35:20,1990-09-20,2016,49ers,P4,,2016-08-22,Drills: 13,RB,1,0,0:18:54,1930,19.1,779,1037,97,17,0,0:12:37,0:05:59,0:00:15,0:00:02,0:00:00,114,1,0/n21:00:00,1990-09-20,2016,49ers,P3,Broncos,2016-08-20,W 31 - 24,RB,0,1,0:05:21,683,19.1,144,486,46,6,0,0:02:13,0:03:00,0:00:07,0:00:00,0:00:00,52,1,0/n13:34:50,1990-09-20,2016,49ers,P3,,2016-08-16,Drills: 13,RB,1,0,0:22:17,2239,19.1,960,1134,141,4,0,0:14:55,0:06:58,0:00:22,0:00:00,0:00:00,145,0,0/n19:00:00,1990-09-20,2016,49ers,P2,Texans,2016-08-14,L 13 - 24,RB,0,1,0:00:00,0,19.1,0,0,0,0,0,0:00:00,0:00:00,0:00:00,0:00:00,0:00:00,0,0,0/n13:32:36,1990-09-20,2016,49ers,P2,,2016-08-12,Drills: 13,RB,1,0,0:30:32,3073,19.1,1302,1504,243,22,2,0:20:18,0:09:33,0:00:37,0:00:02,0:00:00,267,3,0/n13:35:22,1990-09-20,2016,49ers,P2,,2016-08-11,Drills: 13,RB,1,0,0:16:26,1617,19.1,717,796,97,7,0,0:11:16,0:04:53,0:00:15,0:00:00,0:00:00,104,1,0/n13:32:28,1990-09-20,2016,49ers,P2,,2016-08-09,Drills: 19,RB,1,0,0:35:15,3712,19.1,1422,2020,266,3,0,0:21:56,0:12:37,0:00:42,0:00:00,0:00:00,269,0,0/n13:32:07,1990-09-20,2016,49ers,P2,,2016-08-07,Drills: 19,RB,1,0,0:33:14,3221,19.1,1424,1584,174,29,10,0:22:22,0:10:20,0:00:27,0:00:03,0:00:01,212,2,1/n13:34:41,1990-09-20,2016,49ers,P2,,2016-08-06,Drills: 13,RB,1,0,0:18:43,1777,19.1,818,832,127,0,0,0:13:04,0:05:18,0:00:20,0:00:00,0:00:00,127,0,0/n13:33:33,1990-09-20,2016,49ers,P2,,2016-08-05,Drills: 16,RB,1,0,0:30:09,2843,19.1,1292,1427,116,8,0,0:20:29,0:09:19,0:00:18,0:00:00,0:00:00,124,1,0/n13:32:41,1990-09-20,2016,49ers,P2,,2016-08-04,Drills: 19,RB,1,0,0:34:01,3525,19.1,1368,1905,236,16,0,0:21:19,0:12:02,0:00:36,0:00:02,0:00:00,252,2,0/n13:33:31,1990-09-20,2016,49ers,P2,,2016-08-02,Drills: 19,RB,1,0,0:34:20,3358,19.1,1550,1578,229,0,0,0:23:56,0:09:47,0:00:36,0:00:00,0:00:00,229,0,0/n13:35:34,1990-09-20,2016,49ers,P2,,2016-08-01,Drills: 16,RB,1,0,0:24:56,2519,19.1,1103,1189,226,0,0,0:17:19,0:07:00,0:00:35,0:00:00,0:00:00,226,0,0/n13:25:00,1990-09-20,2016,49ers,P2,,2016-07-31,Drills: 16,RB,1,0,0:33:13,3206,19.1,1506,1461,239,0,0,0:23:19,0:09:16,0:00:37,0:00:00,0:00:00,239,0,0/n12:30:18,1990-09-20,2016,49ers,P2,,2016-07-30,Drills: 5,RB,1,0,0:10:57,1795,19.1,275,971,549,0,0,0:04:29,0:05:01,0:01:26,0:00:00,0:00:00,549,0,0/n13:45:07,1990-09-20,2016,49ers,P2,,2016-06-09,Drills: 19,RB,1,0,0:34:36,3659,19.1,1475,1766,371,47,0,0:22:49,0:10:42,0:00:58,0:00:06,0:00:00,418,3,0/n13:45:51,1990-09-20,2016,49ers,P2,,2016-06-08,Drills: 18,RB,1,0,0:35:40,3653,19.1,1519,1909,187,28,11,0:23:19,0:11:46,0:00:29,0:00:03,0:00:01,226,2,1/n13:45:38,1990-09-20,2016,49ers,P2,,2016-06-07,Drills: 19,RB,1,0,0:35:21,3455,19.1,1631,1519,272,28,5,0:24:56,0:09:38,0:00:42,0:00:03,0:00:00,305,3,0/n13:46:06,1990-09-20,2016,49ers,P2,,2016-06-02,Drills: 19,RB,1,0,0:41:00,4171,19.1,1894,1805,343,86,42,0:28:53,0:10:58,0:00:53,0:00:10,0:00:04,471,5,4/n13:45:28,1990-09-20,2016,49ers,P2,,2016-06-01,Drills: 12,RB,1,0,0:24:00,2485,19.1,940,1420,122,2,0,0:14:40,0:09:00,0:00:18,0:00:00,0:00:00,124,0,0/n13:45:11,1990-09-20,2016,49ers,P2,,2016-05-31,Drills: 19,RB,1,0,0:35:58,3598,19.1,1522,1900,152,23,1,0:23:41,0:11:48,0:00:24,0:00:02,0:00:00,176,2,0/n13:44:22,1990-09-20,2016,49ers,P2,,2016-05-26,Drills: 19,RB,1,0,0:36:03,3743,19.1,1620,1703,325,51,43,0:24:30,0:10:30,0:00:51,0:00:06,0:00:04,420,3,2/n13:44:27,1990-09-20,2016,49ers,P2,,2016-05-25,Drills: 19,RB,1,0,0:35:39,3732,19.1,1506,1875,317,20,14,0:23:22,0:11:23,0:00:50,0:00:02,0:00:01,351,2,1/n13:43:44,1990-09-20,2016,49ers,P2,,2016-05-24,Drills: 19,RB,1,0,0:41:20,4139,19.1,1828,2016,276,9,10,0:28:02,0:12:31,0:00:44,0:00:01,0:00:01,295,0,1/n13:18:57,1990-09-20,2016,49ers,P2,,2016-05-23,Drills: 6,RB,1,0,0:19:06,2073,19.1,753,1025,296,0,0,0:11:49,0:06:29,0:00:47,0:00:00,0:00:00,296,0,0/n13:16:40,1990-09-20,2016,49ers,P2,,2016-05-03,Drills: 11,RB,1,0,0:25:32,2472,19.1,1067,1264,126,10,6,0:16:58,0:08:11,0:00:19,0:00:01,0:00:00,142,1,1/n13:16:08,1990-09-20,2016,49ers,P2,,2016-05-02,Drills: 11,RB,1,0,0:26:37,2838,19.1,1027,1609,179,22,0,0:15:47,0:10:18,0:00:27,0:00:02,0:00:00,201,3,0/n13:15:39,1990-09-20,2016,49ers,P2,,2016-04-28,Drills: 20,RB,1,0,0:36:09,3492,19.1,1523,1785,175,8,0,0:23:58,0:11:41,0:00:27,0:00:01,0:00:00,183,1,0/n13:17:35,1990-09-20,2016,49ers,P2,,2016-04-27,Drills: 21,RB,1,0,0:40:15,4251,19.1,1542,2391,305,11,2,0:23:31,0:15:54,0:00:47,0:00:01,0:00:00,318,1,0/n13:16:05,1990-09-20,2016,49ers,P2,,2016-04-26,Drills: 21,RB,1,0,0:38:45,4261,19.1,1417,2491,344,10,0,0:22:08,0:15:40,0:00:54,0:00:01,0:00:00,354,1,0/n13:14:09,1990-09-20,2016,49ers,P2,,2016-04-21,Drills: 11,RB,1,0,0:21:41,2524,19.1,761,1475,252,24,13,0:11:48,0:09:09,0:00:38,0:00:03,0:00:01,289,2,1/n13:14:19,1990-09-20,2016,49ers,P2,,2016-04-20,Drills: 11,RB,1,0,0:17:46,1934,19.1,627,1128,148,10,22,0:10:03,0:07:15,0:00:23,0:00:01,0:00:02,180,0,1/n13:15:12,1990-09-20,2016,49ers,P2,,2016-04-19,Drills: 10,RB,1,0,0:22:06,2432,19.1,808,1416,183,24,0,0:12:37,0:08:58,0:00:28,0:00:03,0:00:00,207,3,0/n13:10:48,1990-09-20,2016,49ers,P2,,2016-04-18,Drills: 10,RB,1,0,0:24:29,2525,19.1,952,1390,172,12,0,0:14:50,0:09:11,0:00:25,0:00:01,0:00:00,184,1,0/n13:22:38,1990-09-20,2016,49ers,P2,,2016-04-04,Drills: 1,RB,1,0,0:13:01,1806,19.1,401,918,405,81,0,0:06:25,0:05:22,0:01:02,0:00:10,0:00:00,486,8,0/n';
        
        return playerPage.readAndDeleteCSV().then(function(fileContents) {
          assert.equal(fileContents, exportFileContents);  
        })
      });

      test.it('clicking export all button', function() {
        playerPage.clickPerformanceLogExportAllLink();
      });
      
      test.it('export all csv file should have the correct data', function() {
        return playerPage.readAndDeleteCSV().then(function(fileContents) {
          assert.isNotNull(fileContents);  
        })
      });
    });

    test.describe('#Page: Punting', function() {
      test.it('test setup', function() {
        playerPage.goToSection("punting");
        var playerUrl = '/football/player-punting/Andy%20Lee/2506017/nfl?f=%7B%22fgt%22%3A%5B%22regular%22%5D%2C%22fswr%22%3A%7B%22fromSeason%22%3A%222016%22%2C%22fromWeek%22%3A%221%22%2C%22toSeason%22%3A%222016%22%2C%22toWeek%22%3A%2217%22%7D%7D&is=true';
        playerPage.visit(url+playerUrl);
        filters.changeValuesForSeasonWeekDropdownFilter(2016, 'W1', 2016, 'W17', true);
        // playerPage.waitForTableToLoad();
      });  

      test.it('clicking export button returns correct CSV', function() {
        playerPage.clickPuntingExportLink();
      });
      
      test.it('export csv file should have the correct data', function() {
        var exportFileContents = 'startTime,week,dateOfBirth,opp,hash,gross,ret,dir,getOff,opTime,hang,res,week,pos,seq/n13:00:00,1982-08-11,KC,L,43,6,2L,1.30s,1.96s,3.97s,RETURNED,10,62,1/n15:05:00,1982-08-11,LA,C,52,2,6R,1.08s,1.69s,3.03s,RETURNED,9,53,2/n15:05:00,1982-08-11,LA,R,58,14,4,1.30s,1.94s,4.48s,RETURNED,9,62,3/n15:05:00,1982-08-11,LA,R,48,5,3L,1.30s,1.96s,4.07s,RETURNED,9,89,4/n15:05:00,1982-08-11,LA,R,46,19,5R,1.26s,1.88s,4.50s,RETURNED,9,72,5/n15:05:00,1982-08-11,LA,R,40,,3L,1.19s,1.83s,4.25s,TOUCHBACK,9,40,6/n15:05:00,1982-08-11,LA,L,38,,2L,1.27s,1.89s,4.61s,FAIR CATCH,9,50,7/n13:00:00,1982-08-11,ARI,L,56,4,2L,1.29s,2.03s,4.88s,RETURNED,8,74,8/n13:00:00,1982-08-11,ARI,R,41,,1L,1.25s,1.99s,3.92s,OUT OF BOUNDS,8,71,9/n13:00:00,1982-08-11,ARI,L,60,2,6R,1.32s,2.04s,4.50s,RETURNED,8,74,10/n13:00:00,1982-08-11,NO,R,39,,3L,1.48s,2.13s,4.49s,DOWNED,6,43,11/n13:00:00,1982-08-11,NO,R,48,,6R,1.12s,1.78s,4.42s,FAIR CATCH,6,55,12/n13:00:00,1982-08-11,NO,L,61,59,5R,1.24s,1.99s,4.78s,RETURNED,6,73,13/n13:00:00,1982-08-11,NO,L,54,4,2L,1.42s,2.12s,4.61s,RETURNED,6,62,14/n13:00:00,1982-08-11,NO,R,40,,6R,1.40s,2.11s,4.09s,FAIR CATCH,6,55,15/n20:30:00,1982-08-11,TB,L,38,,2L,1.19s,1.93s,4.60s,FAIR CATCH,5,66,16/n20:30:00,1982-08-11,TB,C,44,,3L,1.22s,1.90s,4.14s,TOUCHBACK,5,44,17/n20:30:00,1982-08-11,TB,L,52,12,2L,1.30s,1.98s,4.51s,RETURNED,5,71,18/n20:30:00,1982-08-11,TB,L,43,,2L,1.18s,1.87s,4.79s,DOWNED,5,57,19/n13:00:00,1982-08-11,ATL,R,53,18,5R,1.33s,1.95s,3.86s,RETURNED,4,74,20/n13:00:00,1982-08-11,ATL,L,50,,5R,1.28s,2.02s,4.20s,DOWNED,4,52,21/n13:00:00,1982-08-11,ATL,R,42,,3L,1.22s,1.95s,4.42s,DOWNED,4,43,22/n13:00:00,1982-08-11,ATL,R,54,,5R,1.28s,2.02s,4.43s,DOWNED,4,56,23/n13:00:00,1982-08-11,ATL,L,56,0,3L,1.31s,2.03s,4.57s,RETURNED,4,72,24/n13:00:00,1982-08-11,ATL,R,49,7,3L,1.19s,1.90s,3.87s,RETURNED,4,71,25/n13:00:00,1982-08-11,MIN,R,49,,4,1.16s,1.83s,4.62s,DOWNED,3,54,26/n13:00:00,1982-08-11,MIN,R,48,54,4,1.33s,1.93s,4.71s,RETURNED,3,94,27/n13:00:00,1982-08-11,MIN,L,34,,2L,1.16s,1.89s,4.65s,FAIR CATCH,3,44,28/n13:00:00,1982-08-11,MIN,R,58,4,6R,1.35s,2.03s,4.88s,RETURNED,3,92,29/n13:00:00,1982-08-11,SF,R,37,,5R,1.12s,1.67s,4.65s,FAIR CATCH,2,49,30/n13:00:00,1982-08-11,SF,R,37,,5R,1.22s,1.92s,4.74s,FAIR CATCH,2,49,31/n13:00:00,1982-08-11,SF,R,49,,3L,1.12s,1.82s,4.64s,DOWNED,2,51,32/n20:30:00,1982-08-11,DEN,R,59,,3L,1.22s,1.93s,5.09s,TOUCHBACK,1,59,33/n20:30:00,1982-08-11,DEN,L,56,,3L,1.14s,1.86s,4.84s,TOUCHBACK,1,56,34/n20:30:00,1982-08-11,DEN,R,76,11,5R,1.26s,1.92s,4.86s,RETURNED,1,89,35/n20:30:00,1982-08-11,DEN,R,61,15,3L,1.16s,1.86s,4.36s,RETURNED,1,68,36/n';
        
        return playerPage.readAndDeleteCSV().then(function(fileContents) {
          assert.equal(fileContents, exportFileContents);  
        })
      });
    });    

    test.describe('#Page: Kicking', function() {
      test.it('test setup', function() {
        playerPage.goToSection("kicking");
        var playerUrl = '/football/player-kicking/Phil%20Dawson/2500351/nfl?f=%7B"fgt"%3A%5B"regular"%5D%2C"fswr"%3A%7B"fromSeason"%3A"2016"%2C"fromWeek"%3A"1"%2C"toSeason"%3A"2016"%2C"toWeek"%3A"17"%7D%7D&is=true';
        playerPage.visit(url+playerUrl);
        filters.changeValuesForSeasonWeekDropdownFilter(2016, 'W1', 2016, 'W17', true);
        // playerPage.waitForTableToLoad();
      });  

      test.it('clicking export button returns correct CSV', function() {
        playerPage.clickKickingExportLink();
      });
      
      test.it('export csv file should have the correct data', function() {
        var exportFileContents = 'startTime,week,dateOfBirth,teamAbbrev,pos,opp,hash,gross,ret,kickType,dir,hang,res,week,seq/n16:25:00,1975-01-23,SF,K,SEA,R,64,22,D,5R,3.85s,RETURNED,17,1/n16:25:00,1975-01-23,SF,K,SEA,L,46,10,P,5R,3.53s,RETURNED,17,2/n16:25:00,1975-01-23,SF,K,LA,C,63,20,D,5R,4.21s,RETURNED,16,3/n16:25:00,1975-01-23,SF,K,LA,C,69,34,D,6R,4.19s,RETURNED,16,4/n16:25:00,1975-01-23,SF,K,LA,R,62,24,D,3L,4.07s,RETURNED,16,5/n16:05:00,1975-01-23,SF,K,NYJ,C,62,19,D,6R,4.09s,RETURNED,14,6/n16:05:00,1975-01-23,SF,K,NYJ,C,25,,P,6R,0.00s,OUT OF BOUNDS,14,7/n16:05:00,1975-01-23,SF,K,NYJ,C,58,17,D,3L,3.85s,RETURNED,14,8/n16:05:00,1975-01-23,SF,K,NYJ,C,64,24,D,6R,3.71s,RETURNED,14,9/n13:00:00,1975-01-23,SF,K,CHI,R,56,28,D,6R,3.70s,RETURNED,13,10/n13:00:00,1975-01-23,SF,K,CHI,R,51,5,P,5R,3.93s,RETURNED,13,11/n13:00:00,1975-01-23,SF,K,CHI,R,69,,D,2L,3.18s,TOUCHBACK,13,12/n13:00:00,1975-01-23,SF,K,MIA,C,63,21,D,3L,3.74s,RETURNED,12,13/n13:00:00,1975-01-23,SF,K,MIA,C,65,21,D,6R,3.81s,RETURNED,12,14/n13:00:00,1975-01-23,SF,K,MIA,C,67,78,D,6R,3.94s,RETURNED,12,15/n13:00:00,1975-01-23,SF,K,MIA,C,45,0,Q,6R,0.00s,RETURNED,12,16/n13:00:00,1975-01-23,SF,K,MIA,C,65,14,D,2L,4.07s,RETURNED,12,17/n16:25:00,1975-01-23,SF,K,NE,C,55,13,P,6R,3.93s,RETURNED,11,18/n16:25:00,1975-01-23,SF,K,NE,C,54,14,D,3L,3.89s,RETURNED,11,19/n16:25:00,1975-01-23,SF,K,NE,C,63,20,D,6R,3.18s,RETURNED,11,20/n16:25:00,1975-01-23,SF,K,NE,L,15,2,O,5R,0.00s,ONSIDE,11,21/n16:25:00,1975-01-23,SF,K,ARI,C,64,17,D,5R,4.25s,RETURNED,10,22/n16:25:00,1975-01-23,SF,K,ARI,C,60,18,D,5R,4.27s,RETURNED,10,23/n16:25:00,1975-01-23,SF,K,ARI,R,63,13,D,2L,4.19s,RETURNED,10,24/n16:05:00,1975-01-23,SF,K,TB,C,50,6,P,6R,3.91s,RETURNED,7,25/n16:05:00,1975-01-23,SF,K,TB,R,59,17,P,2L,4.18s,RETURNED,7,26/n20:25:00,1975-01-23,SF,K,ARI,C,61,39,D,5R,4.27s,RETURNED,5,27/n20:25:00,1975-01-23,SF,K,ARI,C,55,14,D,6R,4.04s,RETURNED,5,28/n20:25:00,1975-01-23,SF,K,ARI,C,71,,D,6R,4.02s,TOUCHBACK,5,29/n20:25:00,1975-01-23,SF,K,ARI,C,8,,O,4,0.00s,ONSIDE,5,30/n16:25:00,1975-01-23,SF,K,DAL,R,62,28,D,3L,3.95s,RETURNED,4,31/n16:05:00,1975-01-23,SF,K,SEA,C,73,,D,5R,4.38s,TOUCHBACK,3,32/n16:05:00,1975-01-23,SF,K,SEA,C,57,19,D,6R,4.14s,RETURNED,3,33/n16:05:00,1975-01-23,SF,K,SEA,C,75,,D,5R,4.03s,TOUCHBACK,3,34/n16:05:00,1975-01-23,SF,K,SEA,R,26,0,O,2L,0.00s,ONSIDE,3,35/n13:00:00,1975-01-23,SF,K,CAR,C,60,13,D,5R,4.12s,RETURNED,2,36/n13:00:00,1975-01-23,SF,K,CAR,C,62,17,D,6R,4.15s,RETURNED,2,37/n13:00:00,1975-01-23,SF,K,CAR,C,60,17,D,5R,4.13s,RETURNED,2,38/n13:00:00,1975-01-23,SF,K,CAR,C,63,0,D,6R,4.22s,RETURNED,2,39/n13:00:00,1975-01-23,SF,K,CAR,C,62,59,D,2L,4.40s,RETURNED,2,40/n13:00:00,1975-01-23,SF,K,CAR,C,60,24,D,5R,4.14s,RETURNED,2,41/n';
        
        return playerPage.readAndDeleteCSV().then(function(fileContents) {
          assert.equal(fileContents, exportFileContents);  
        })
      });
    });
  });

  test.describe('#Section: Game', function() {
    test.describe('#Page: Box Score', function() {
      test.it('test setup', function() {
        navbar.goToScoresPage();
        var gameUrl = '/football/game/Falcons-49ers/2016-12-18/2016121809/nfl?f=%7B%7D&is=true'
        gamePage.visit(url+gameUrl);
        gamePage.waitForTableToLoad();
      });

      test.it('clicking export button returns correct CSV', function() {
        gamePage.clickBoxScoreExportLink();
      });
      
      test.it('csv file should have the correct data', function() {
        var exportFileContents = 'startTime,week,roadPriorScore,homePriorScore,playDesc,week,eventDesc/nFirst Quarter/n16:05:00,0,6,(10:35) 24-D.Freeman right tackle for 5 yards, TOUCHDOWN.,15,TD - 10:31/n16:05:00,0,13,(7:48) 2-M.Ryan pass short left to 18-T.Gabriel for 9 yards, TOUCHDOWN.,15,TD - 7:40/n16:05:00,0,20,(:47) (Shotgun) 2-M.Ryan pass short right to 81-A.Hooper for 9 yards, TOUCHDOWN.,15,TD - 0:40/nSecond Quarter/n16:05:00,6,21,(12:50) (Shotgun) 7-C.Kaepernick pass short left to 88-G.Celek for 16 yards, TOUCHDOWN.,15,TD - 12:45/n16:05:00,7,27,(4:36) (No Huddle) 24-D.Freeman right guard for 9 yards, TOUCHDOWN.,15,TD - 4:28/n16:05:00,13,28,(:17) (Shotgun) 7-C.Kaepernick pass short left to 81-R.Streater for 5 yards, TOUCHDOWN.,15,TD - 0:13/nThird Quarter/n16:05:00,13,31,(6:34) 3-M.Bryant 50 yard field goal is GOOD, Center-47-J.Harris, Holder-5-M.Bosher.,15,FG - 6:29/n16:05:00,13,37,(1:49) 24-D.Freeman left end for 34 yards, TOUCHDOWN.,15,TD - 1:42/nFourth Quarter/n16:05:00,13,41,(1:13) 3-M.Bryant 41 yard field goal is GOOD, Center-47-J.Harris, Holder-5-M.Bosher.,15,FG - 1:09/n';
        
        return gamePage.readAndDeleteCSV().then(function(fileContents) {
          assert.equal(fileContents, exportFileContents);  
        })
      });
    });      
    
    test.describe('#Page: Performance Stats', function() {
      test.it('test setup', function() {
        gamePage.goToSection('performanceStats');
        filters.changeFilterGroupDropdown('Player');
        filters.addSelectionToDropdownSidebarFilter('Primary Position:', 'QB');
        gamePage.waitForTableToLoad();
      });

      test.describe("#export", function() {
        test.it('clicking export button returns correct CSV', function() {
          gamePage.clickPerformanceExportLink();
        });
        
        test.it('csv file should have the correct data', function() {
          var exportFileContents = 'dateOfBirth,player,primaryPosition,teamAbbrev,Pract,G,TimeMoving,DistTotal,RelTargetMPH,RelWalkYds,RelJogYds,RelRunYds,RelSprintYds,RelMaxSprintYds,RelWalkTime,RelJogTime,RelRunTime,RelSprintTime,RelMaxSprintTime,RelHardEffortDist,RelSprintCount,RelMaxSprintCount/n1987-11-03,Colin Kaepernick,QB,SF,0,64,0:18:38,1965,20.3,758,1081,93,33,1,0:11:17,0:07:03,0:00:13,0:00:03,0:00:00,126,2,0/n1988-02-25,Christian Ponder,QB,SF,0,0,0:00:05,6,17.6,5,1,0,0,0,0:00:05,0:00:00,0:00:00,0:00:00,0:00:00,0,0,0/n';
          
          return gamePage.readAndDeleteCSV().then(function(fileContents) {
            assert.equal(fileContents, exportFileContents);  
          })
        });
      })

      test.describe("#exportAll", function() {
        test.it('clicking export all button returns correct CSV', function() {
          gamePage.clickPerformanceExportAllLink();
        });
        
        test.it('export all csv file should have the correct data', function() {
          var exportFileContents = 'dateOfBirth,player,primaryPosition,primaryPositionPrecise,ncaaPrimaryPositionPrecise,teamLeague,teamAbbrev,playerId,eliasPlayerId,seasonContents,pos,Pract,G,TimeMoving,DistTotal,RelTargetMPH,RelWalkYds,RelJogYds,RelRunYds,RelSprintYds,RelMaxSprintYds,RelWalkTime,RelJogTime,RelRunTime,RelSprintTime,RelMaxSprintTime,RelHardEffortDist,RelSprintCount,RelMaxSprintCount,TeamTargetMPH,TeamWalkYds,TeamJogYds,TeamRunYds,TeamSprintYds,TeamMaxSprintYds,Yds10+,TeamWalkTime,TeamJogTime,TeamRunTime,TeamSprintTime,TeamMaxSprintTime,Time10+,TeamHardEffortDist,TeamSprintCount,TeamMaxSprintCount,DistM,TeamTargetMPS,TeamWalkM,TeamJogM,TeamRunM,TeamSprintM,TeamMaxSprintM,RelTargetMPS,RelWalkM,RelJogM,RelRunM,RelSprintM,RelMaxSprintM,TimeTrkd,Yds/Min,ActAvgYPS,ActAvgMPH,Accel/Min,Decel/Min,MaxYPS,MaxMPH,Explosive Effort,MaxStndYPS,MaxStndMPH,Mtr/Min,ActAvgMPS,MaxMPS,MaxStndMPS,TotalAccels,AccelSlow,AccelMed,AccelFast,AclDistSlow,AclDistMed,AclDistFast,TotalDecels,DecelSlow,DecelMed,DecelFast,DclDistSlow,DclDistMed,DclDistFast,CODMed,CODHigh,CODTotal,ExertionIndex/n1987-11-03,Colin Kaepernick,QB,QB,,nfl,SF,2495186,KAE371576,Game,QB,0,64,0:18:38,1965,20.3,758,1081,93,33,1,0:11:17,0:07:03,0:00:13,0:00:03,0:00:00,126,2,0,16.6,758,965,160,35,48,240,0:11:17,0:06:41,0:00:28,0:00:05,0:00:05,0:00:39,243,2,3,1797,7.4,693,882,146,32,44,9.1,693,989,85,30,1,2:36:37,12.5,1.8,3.6,0.23,0.22,9.0,18.3,11,8.8,18.1,11.5,1.6,8.2,8.1,36,8,21,7,67,72,21,35,11,21,3,60,56,10,2,1,3,116.23/n1988-02-25,Christian Ponder,QB,QB,,nfl,SF,2495215,PON404041,Game,QB,0,0,0:00:05,6,17.6,5,1,0,0,0,0:00:05,0:00:00,0:00:00,0:00:00,0:00:00,0,0,0,16.6,5,1,0,0,0,0,0:00:05,0:00:00,0:00:00,0:00:00,0:00:00,0:00:00,0,0,0,5,7.4,4,1,0,0,0,7.9,4,1,0,0,0,0:54:23,0.1,1.0,2.0,0.00,0.00,1.6,3.4,0,1.6,3.2,0.1,0.9,1.5,1.4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5.09/n';
          
          return gamePage.readAndDeleteCSV().then(function(fileContents) {
            assert.equal(fileContents, exportFileContents);  
          })
        });
      })

      test.describe("#exportLegacy", function() {
        test.it('clicking export legacy button returns correct CSV', function() {
          gamePage.clickPerformanceExportLegacyLink();
        });
        
        test.it('export legacy csv file should have the correct data', function() {
          var exportFileContents = 'Player Number,PlayerDisplayName,Status,Side of Ball,Date,Drill Title,Drill Number,Drill Duration,Intensity,Player Position,Active Time,Distance Total,Distance Per Minute,Skill Distance Zone 1 (Walk/Roam),Skill Distance Zone 2 (Jog),Skill Distance Zone 3 (Extensive),Skill Distance Zone 4 (Intensive),Skill Distance Zone 5 (High Speed Running),Time Spent in Skill Zone 1 (Walk/Roam),Time Spent in Skill Zone 2 (Jog),Time Spent in Skill Zone 3 (Extensive),Time Spent in Skill Zone 4 (Intensive),Time Spent in Skill Zone 5 (High Speed Running),Mid Distance Zone 1 (Walk/Roam),Mid Distance Zone 2 (Jog),Mid Distance Zone 3 (Extensive),Mid Distance Zone 4 (Intensive),Mid Distance Zone 5 (High Speed Running),Time Spent in Mid Zone 1 (Walk/Roam),Time Spent in Mid Zone 2 (Jog),Time Spent in Mid Zone 3 (Extensive),Time Spent in Mid Zone 4 (Intensive),Time Spent in Mid Zone 5 (High Speed Running),Linemen Distance Zone 1 (Walk/Roam),Linemen Distance Zone 2 (Jog),Linemen Distance Zone 3 (Extensive),Linemen Distance Zone 4 (Intensive),Linemen Distance Zone 5 (High Speed Running),Time Spent in Linemen Zone 1 (Walk/Roam),Time Spent in BLinemen g Zone 2 (Jog),Time Spent in Linemen Zone 3 (Extensive),Time Spent in Linemen Zone 4 (Intensive),Time Spent in Linemen Zone 5 (High Speed Running),QB Distance Zone 1 (Walk/Roam),QB Distance Zone 2 (Jog),QB Distance Zone 3 (Extensive),QB Distance Zone 4 (Intensive),QB Distance Zone 5 (High Speed Running),Time Spent in QB Zone 1 (Walk/Roam),Time Spent in QB Zone 2 (Jog),Time Spent in QB Zone 3 (Extensive),Time Spent in QB Zone 4 (Intensive),Time Spent in QB Zone 5 (High Speed Running),Team Distance Zone 1 (Walk/Roam),Team Distance Zone 2 (Jog),Team Distance Zone 3 (Extensive),Team Distance Zone 4 (Intensive),Team Distance Zone 5 (High Speed Running),Time Spent in Team Zone 1 (Walk/Roam),Time Spent in Team Zone 2 (Jog),Time Spent in Team Zone 3 (Extensive),Time Spent in Team Zone 4 (Intensive),Time Spent in Team Zone 5 (High Speed Running),Player Relative Distance Zone 1 (Walk/Roam) - Absolute,Player Relative Distance Zone 2 (Jog) - Absolute,Player Relative Distance Zone 3 (Extensive) - Absolute,Player Relative Distance Zone 4 (Intensive) - Absolute,Player Relative Distance Zone 5 (High Speed Running) - Absolute,Time Spent in Player Relative Zone 1 (Walk/Roam) - Absolute,Time Spent in Player Relative Zone 2 (Jog) - Absolute,Time Spent in Player Relative Zone 3 (Extensive) - Absolute,Time Spent in Player Relative Zone 4 (Intensive) - Absolute,Time Spent in Player Relative Zone 5 (High Speed Running) - Absolute,Average Active Speed (mph),Max Speed (mph),Hard Effort Distance,Explosive Effort,Total Accelerations,Accelerations Per Minute,Accelerations Zone 1 (1.5-2.5 yd/s/s),Accelerations Zone 2 (2.5-3.5 yd/s/s),Accelerations Zone 3 (3.5+ yd/s/s),Distance in Accelerations Zone 1 (yards),Distance in Accelerations Zone 2 (yards),Distance in Accelerations Zone 3 (yards),Total Decelerations,Decelerations Per Minute,Decelerations Zone 1 (1.5-2.5 yd/s/s),Decelerations Zone 2 (2.5-3.5 yd/s/s),Decelerations Zone 3 (3.5+ yd/s/s),Distance in Decelerations Zone 1 (yards),Distance in Decelerations Zone 2 (yards),Distance in Decelerations Zone 3 (yards),Change Of Direction Counts,Skill Sprint Counts Zone 5 (High Speed Running),Mid Sprint Counts Zone 5 (High Speed Running) ,Linemen Sprint Counts Zone 5 (High Speed Running) ,QB Sprint Counts Zone 5 (High Speed Running) ,Team Based Sprint Counts Zone 5 (High Speed Running),Player Relative Sprint Count Zone 5,Max Sustained Speed (mph),Target Sustained Max Speed (mph)/n07,Colin Kaepernick,UFA,O,2016-12-18,Full Game,0,156.63,Game,QB,18.65,1965,12.5,744,1088,95,26,12,11.10,7.22,0.24,0.05,0.02,744,1056,113,23,30,11.10,7.13,0.31,0.05,0.06,744,867,200,44,111,11.10,6.46,0.70,0.13,0.26,744,986,153,33,49,11.10,6.90,0.46,0.08,0.10,758,965,160,35,48,11.30,6.68,0.48,0.08,0.10,758,1081,93,33,1,11.30,7.05,0.23,0.06,0.00,3.6,18.3,126,11,36,0.23,8,21,7,67,72,21,35,0.22,11,21,3,60,56,10,1,1,2,8,3,3,0,18.1,20.3/n15,Christian Ponder,UFA,O,2016-12-18,Full Game,0,54.39,Game,QB,0.10,6,0.1,5,1,0,0,0,0.09,0.01,0.00,0.00,0.00,5,1,0,0,0,0.09,0.01,0.00,0.00,0.00,5,1,0,0,0,0.09,0.01,0.00,0.00,0.00,5,1,0,0,0,0.09,0.01,0.00,0.00,0.00,5,1,0,0,0,0.09,0.01,0.00,0.00,0.00,5,1,0,0,0,0.09,0.01,0.00,0.00,0.00,2.0,3.4,0,0,0,0.00,0,0,0,0,0,0,0,0.00,0,0,0,0,0,0,0,0,0,0,0,0,0,3.2,17.6/n07,Colin Kaepernick,UFA,O,2016-12-18,Out of Play - Q1,1,24.67,Game,QB,3.35,333,13.5,144,190,0,0,0,2.04,1.32,0.00,0.00,0.00,144,190,0,0,0,2.04,1.32,0.00,0.00,0.00,144,189,0,0,0,2.04,1.32,0.00,0.00,0.00,144,190,0,0,0,2.04,1.32,0.00,0.00,0.00,150,183,0,0,0,2.12,1.24,0.00,0.00,0.00,150,183,0,0,0,2.12,1.24,0.00,0.00,0.00,3.4,0.0,0,0,0,0.00,0,0,0,0,0,0,2,0.08,0,2,0,0,6,0,0,0,0,0,0,0,0,0.0,20.3/n07,Colin Kaepernick,UFA,O,2016-12-18,Out of Play - Q2,2,30.26,Game,QB,5.99,601,19.9,239,346,16,0,0,3.56,2.39,0.04,0.00,0.00,239,341,21,0,0,3.56,2.37,0.06,0.00,0.00,239,295,47,11,9,3.56,2.21,0.17,0.03,0.02,239,333,29,0,0,3.56,2.35,0.09,0.00,0.00,241,329,31,0,0,3.60,2.30,0.09,0.00,0.00,241,346,14,0,0,3.60,2.36,0.04,0.00,0.00,3.4,0.0,14,0,2,0.07,2,0,0,8,2,0,6,0.20,2,4,0,12,5,2,0,0,0,1,0,0,0,0.0,20.3/n15,Christian Ponder,UFA,O,2016-12-18,Out of Play - Q2,2,30.26,Game,QB,0.10,6,0.2,4,1,0,0,0,0.08,0.01,0.00,0.00,0.00,4,1,0,0,0,0.08,0.01,0.00,0.00,0.00,4,1,0,0,0,0.08,0.01,0.00,0.00,0.00,4,1,0,0,0,0.08,0.01,0.00,0.00,0.00,5,1,0,0,0,0.08,0.01,0.00,0.00,0.00,5,1,0,0,0,0.08,0.01,0.00,0.00,0.00,2.0,3.4,0,0,0,0.00,0,0,0,0,0,0,0,0.00,0,0,0,0,0,0,0,0,0,0,0,0,0,3.2,17.6/n07,Colin Kaepernick,UFA,O,2016-12-18,Out of Play - Q3,3,24.13,Game,QB,3.22,275,11.4,151,118,6,0,0,2.19,1.01,0.02,0.00,0.00,151,117,6,1,0,2.19,1.01,0.02,0.00,0.00,151,115,3,1,5,2.19,1.00,0.01,0.00,0.01,151,116,3,4,1,2.19,1.00,0.01,0.01,0.00,157,110,3,5,0,2.27,0.93,0.01,0.01,0.00,157,112,5,0,0,2.27,0.94,0.01,0.00,0.00,2.9,0.0,5,2,0,0.00,0,0,0,0,0,0,4,0.17,0,3,1,1,14,2,1,0,0,0,0,0,0,0.0,20.3/n15,Christian Ponder,UFA,O,2016-12-18,Out of Play - Q3,3,24.13,Game,QB,0.00,0,0.0,0,0,0,0,0,0.00,0.00,0.00,0.00,0.00,0,0,0,0,0,0.00,0.00,0.00,0.00,0.00,0,0,0,0,0,0.00,0.00,0.00,0.00,0.00,0,0,0,0,0,0.00,0.00,0.00,0.00,0.00,0,0,0,0,0,0.00,0.00,0.00,0.00,0.00,0,0,0,0,0,0.00,0.00,0.00,0.00,0.00,2.0,0.0,0,0,0,0.00,0,0,0,0,0,0,0,0.00,0,0,0,0,0,0,0,0,0,0,0,0,0,0.0,17.6/n07,Colin Kaepernick,UFA,O,2016-12-18,Out of Play - Q4,4,18.72,Game,QB,2.08,176,9.4,87,90,0,0,0,1.36,0.72,0.00,0.00,0.00,87,90,0,0,0,1.36,0.72,0.00,0.00,0.00,87,90,0,0,0,1.36,0.72,0.00,0.00,0.00,87,90,0,0,0,1.36,0.72,0.00,0.00,0.00,87,89,0,0,0,1.37,0.71,0.00,0.00,0.00,87,89,0,0,0,1.37,0.71,0.00,0.00,0.00,2.9,0.0,0,0,0,0.00,0,0,0,0,0,0,0,0.00,0,0,0,0,0,0,0,0,0,0,0,0,0,0.0,20.3/n07,Colin Kaepernick,UFA,O,2016-12-18,In Play - Q1,1,16.43,Game,QB,0.71,107,6.5,21,70,16,0,0,0.34,0.33,0.04,0.00,0.00,21,59,26,0,0,0.34,0.29,0.07,0.00,0.00,21,27,38,11,11,0.34,0.18,0.13,0.03,0.03,21,43,36,7,0,0.34,0.24,0.11,0.02,0.00,21,42,36,7,0,0.34,0.24,0.11,0.02,0.00,21,72,14,0,0,0.34,0.33,0.04,0.00,0.00,5.2,14.0,14,3,7,0.43,1,4,2,10,14,6,5,0.30,1,3,1,12,9,3,0,0,0,1,0,0,0,13.9,20.3/n07,Colin Kaepernick,UFA,O,2016-12-18,In Play - Q2,2,16.83,Game,QB,1.73,233,13.8,58,136,25,12,4,0.91,0.73,0.06,0.02,0.01,58,130,27,7,12,0.91,0.71,0.07,0.02,0.02,58,67,65,7,36,0.91,0.50,0.23,0.02,0.08,58,101,42,15,17,0.91,0.62,0.13,0.04,0.04,57,100,44,16,16,0.90,0.62,0.14,0.04,0.03,57,137,26,12,0,0.90,0.74,0.06,0.02,0.00,4.6,18.3,39,4,14,0.83,4,6,4,22,22,9,9,0.53,4,5,0,11,12,2,0,0,1,2,1,1,0,17.7,20.3/n07,Colin Kaepernick,UFA,O,2016-12-18,In Play - Q3,3,14.96,Game,QB,0.81,149,10.0,20,73,33,15,9,0.31,0.38,0.08,0.03,0.02,20,67,28,16,18,0.31,0.36,0.08,0.04,0.04,20,41,28,11,50,0.31,0.27,0.10,0.03,0.11,20,59,32,8,31,0.31,0.33,0.09,0.02,0.06,20,57,34,7,32,0.31,0.32,0.10,0.02,0.06,20,76,33,20,0,0.31,0.38,0.08,0.04,0.00,6.3,18.2,54,2,7,0.47,0,6,1,18,24,3,4,0.27,3,0,1,15,3,1,0,1,1,4,2,2,0,18.1,20.3/n07,Colin Kaepernick,UFA,O,2016-12-18,In Play - Q4,4,10.63,Game,QB,0.76,91,8.6,25,66,0,0,0,0.40,0.36,0.00,0.00,0.00,25,61,5,0,0,0.40,0.35,0.01,0.00,0.00,25,43,19,3,0,0.40,0.28,0.07,0.01,0.00,25,55,11,0,0,0.40,0.33,0.03,0.00,0.00,25,54,11,0,0,0.40,0.32,0.04,0.00,0.00,25,66,0,0,0,0.40,0.36,0.00,0.00,0.00,4.1,11.8,0,0,6,0.56,1,5,0,9,11,2,5,0.47,1,4,0,8,9,0,0,0,0,0,0,0,0,11.5,20.3/n';
          
          return gamePage.readAndDeleteCSV().then(function(fileContents) {
            assert.equal(fileContents, exportFileContents);  
          })
        });
      })

      test.describe("#zebraExport", function() {
        test.it('clicking zebra export button returns correct CSV', function() {
          gamePage.clickPerformanceZebraExportLink();
        });
        
        test.it('zebra export csv file should have the correct data', function() {
          var exportFileContents = 'Player Id,Player Number,PlayerDisplayName,First Name,Last Name,Position,Position Group,Status,Side of Ball,Date,Period Title,Period Number,PeriodType,Period Duration,Intensity,TimeTrkd,TimeMoving,Pract,G,DistTotal,TeamTargetMPH,TeamWalkYds,TeamJogYds,TeamRunYds,TeamSprintYds,TeamMaxSprintYds,Yds10+,TeamWalkTime,TeamJogTime,TeamRunTime,TeamSprintTime,TeamMaxSprintTime,Time10+,TeamHardEffortDist,TeamSprintCount,TeamMaxSprintCount,RelTargetMPH,RelWalkYds,RelJogYds,RelRunYds,RelSprintYds,RelMaxSprintYds,RelWalkTime,RelJogTime,RelRunTime,RelSprintTime,RelMaxSprintTime,RelHardEffortDist,RelSprintCount,RelMaxSprintCount,Yds/Min,ActAvgYPS,ActAvgMPH,Accel/Min,Decel/Min,MaxYPS,MaxMPH,Explosive Effort,MaxStndYPS,MaxStndMPH,TotalAccels,AccelSlow,AccelMed,AccelFast,AclDistSlow,AclDistMed,AclDistFast,TotalDecels,DecelSlow,DecelMed,DecelFast,DclDistSlow,DclDistMed,DclDistFast,CODMed,CODHigh,CODTotal,ExertionIndex/n2495186,7,Colin Kaepernick,Colin,Kaepernick,QB,QB,UFA,O,2016-12-18,Totals,,,156.63000000000002,Game,156.63,18.65,0,0,1965,16.6,758,965,160,35,48,240,11.30,6.68,0.48,0.08,0.10,0.65,243,2,3,20.3,758,1081,93,33,1,11.30,7.05,0.23,0.06,0.00,126,2,0,12.5,1.8,3.6,0.23,0.22,9.0,18.3,11,8.8,18.1,36,8,21,7,67,72,21,35,11,21,3,60,56,10,2,1,3,116.23/n2495215,15,Christian Ponder,Christian,Ponder,QB,QB,UFA,O,2016-12-18,Totals,,,54.39,Game,54.39,0.10,0,0,6,16.6,5,1,0,0,0,0,0.09,0.01,0.00,0.00,0.00,0.00,0,0,0,17.6,5,1,0,0,0,0.09,0.01,0.00,0.00,0.00,0,0,0,0.1,1.0,2.0,0.00,0.00,1.6,3.4,0,1.6,3.2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3.62/n2495186,7,Colin Kaepernick,Colin,Kaepernick,QB,QB,UFA,O,2016-12-18,Out of Play - Q1,1000001,,24.67,Game,24.67,3.35,0,0,333,16.6,150,183,0,0,0,0,2.12,1.24,0.00,0.00,0.00,0.00,0,0,0,20.3,150,183,0,0,0,2.12,1.24,0.00,0.00,0.00,0,0,0,13.5,1.7,3.4,0.00,0.08,-,0.0,0,-,0.0,0,0,0,0,0,0,0,2,0,2,0,0,6,0,0,0,0,24.54/n2495186,7,Colin Kaepernick,Colin,Kaepernick,QB,QB,UFA,O,2016-12-18,Out of Play - Q2,1000002,,30.26,Game,30.26,5.99,0,0,601,16.6,241,329,31,0,0,31,3.60,2.30,0.09,0.00,0.00,0.09,31,0,0,20.3,241,346,14,0,0,3.60,2.36,0.04,0.00,0.00,14,0,0,19.9,1.7,3.4,0.07,0.20,-,0.0,0,-,0.0,2,2,0,0,8,2,0,6,2,4,0,12,5,2,1,0,1,51.52/n2495215,15,Christian Ponder,Christian,Ponder,QB,QB,UFA,O,2016-12-18,Out of Play - Q2,1000002,,30.26,Game,30.26,0.10,0,0,6,16.6,5,1,0,0,0,0,0.08,0.01,0.00,0.00,0.00,0.00,0,0,0,17.6,5,1,0,0,0,0.08,0.01,0.00,0.00,0.00,0,0,0,0.2,1.0,2.0,0.00,0.00,1.6,3.4,0,1.6,3.2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3.06/n2495186,7,Colin Kaepernick,Colin,Kaepernick,QB,QB,UFA,O,2016-12-18,Out of Play - Q3,1000003,,24.13,Game,24.13,3.22,0,0,275,16.6,157,110,3,5,0,7,2.27,0.93,0.01,0.01,0.00,0.02,7,0,0,20.3,157,112,5,0,0,2.27,0.94,0.01,0.00,0.00,5,0,0,11.4,1.4,2.9,0.00,0.17,-,0.0,2,-,0.0,0,0,0,0,0,0,0,4,0,3,1,1,14,2,1,1,2,24.29/n2495215,15,Christian Ponder,Christian,Ponder,QB,QB,UFA,O,2016-12-18,Out of Play - Q3,1000003,,24.13,Game,24.13,0.00,0,0,0,16.6,0,0,0,0,0,0,0.00,0.00,0.00,0.00,0.00,0.00,0,0,0,17.6,0,0,0,0,0,0.00,0.00,0.00,0.00,0.00,0,0,0,0.0,1.0,2.0,0.00,0.00,-,0.0,0,-,0.0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.56/n2495186,7,Colin Kaepernick,Colin,Kaepernick,QB,QB,UFA,O,2016-12-18,Out of Play - Q4,1000004,,18.72,Game,18.72,2.08,0,0,176,16.6,87,89,0,0,0,0,1.37,0.71,0.00,0.00,0.00,0.00,0,0,0,20.3,87,89,0,0,0,1.37,0.71,0.00,0.00,0.00,0,0,0,9.4,1.4,2.9,0.00,0.00,-,0.0,0,-,0.0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,15.88/n2495186,7,Colin Kaepernick,Colin,Kaepernick,QB,QB,UFA,O,2016-12-18,In Play - Q1,1000101,,16.43,Game,16.43,0.71,0,0,107,16.6,21,42,36,7,0,43,0.34,0.24,0.11,0.02,0.00,0.13,43,1,0,20.3,21,72,14,0,0,0.34,0.33,0.04,0.00,0.00,14,0,0,6.5,2.5,5.2,0.43,0.30,6.9,14.0,3,6.8,13.9,7,1,4,2,10,14,6,5,1,3,1,12,9,3,0,0,0,0.00/n2495186,7,Colin Kaepernick,Colin,Kaepernick,QB,QB,UFA,O,2016-12-18,In Play - Q2,1000102,,16.83,Game,16.83,1.73,0,0,233,16.6,57,100,44,16,16,75,0.90,0.62,0.14,0.04,0.03,0.21,77,1,1,20.3,57,137,26,12,0,0.90,0.74,0.06,0.02,0.00,39,1,0,13.8,2.2,4.6,0.83,0.53,9.0,18.3,4,8.7,17.7,14,4,6,4,22,22,9,9,4,5,0,11,12,2,0,0,0,0.00/n2495186,7,Colin Kaepernick,Colin,Kaepernick,QB,QB,UFA,O,2016-12-18,In Play - Q3,1000103,,14.96,Game,14.96,0.81,0,0,149,16.6,20,57,34,7,32,72,0.31,0.32,0.10,0.02,0.06,0.18,73,0,2,20.3,20,76,33,20,0,0.31,0.38,0.08,0.04,0.00,54,1,0,10.0,3.1,6.3,0.47,0.27,8.9,18.2,2,8.8,18.1,7,0,6,1,18,24,3,4,3,0,1,15,3,1,0,0,0,0.00/n2495186,7,Colin Kaepernick,Colin,Kaepernick,QB,QB,UFA,O,2016-12-18,In Play - Q4,1000104,,10.63,Game,10.63,0.76,0,0,91,16.6,25,54,11,0,0,11,0.40,0.32,0.04,0.00,0.00,0.03,11,0,0,20.3,25,66,0,0,0,0.40,0.36,0.00,0.00,0.00,0,0,0,8.6,2.0,4.1,0.56,0.47,5.8,11.8,0,5.6,11.5,6,1,5,0,9,11,2,5,1,4,0,8,9,0,0,0,0,0.00/n';
          
          return gamePage.readAndDeleteCSV().then(function(fileContents) {
            assert.equal(fileContents, exportFileContents);  
          })
        });
      })

      test.describe("#sessionsExport", function() {
        test.it('clicking sessions export button returns correct CSV', function() {
          gamePage.clickTablePin(1);
          gamePage.toggleShowPinnedPlayerSessions();
          gamePage.clickPerformanceSessionsExportLink();
        });
        
        test.it('sessions export csv file should have the correct data', function() {
          var exportFileContents = 'dateOfBirth,player,session,primaryPosition,teamAbbrev,Pract,G,TimeMoving,DistTotal,RelTargetMPH,RelWalkYds,RelJogYds,RelRunYds,RelSprintYds,RelMaxSprintYds,RelWalkTime,RelJogTime,RelRunTime,RelSprintTime,RelMaxSprintTime,RelHardEffortDist,RelSprintCount,RelMaxSprintCount/n1987-11-03,Colin Kaepernick,Out of Play - Q2,QB,SF,0,0,0:05:59,601,20.3,241,346,14,0,0,0:03:35,0:02:21,0:00:02,0:00:00,0:00:00,14,0,0/n1987-11-03,Colin Kaepernick,Out of Play - Q1,QB,SF,0,0,0:03:21,333,20.3,150,183,0,0,0,0:02:07,0:01:14,0:00:00,0:00:00,0:00:00,0,0,0/n1987-11-03,Colin Kaepernick,Out of Play - Q3,QB,SF,0,0,0:03:12,275,20.3,157,112,5,0,0,0:02:15,0:00:56,0:00:00,0:00:00,0:00:00,5,0,0/n1987-11-03,Colin Kaepernick,In Play - Q2,QB,SF,0,0,0:01:43,233,20.3,57,137,26,12,0,0:00:53,0:00:44,0:00:03,0:00:01,0:00:00,39,1,0/n1987-11-03,Colin Kaepernick,Out of Play - Q4,QB,SF,0,0,0:02:04,176,20.3,87,89,0,0,0,0:01:22,0:00:42,0:00:00,0:00:00,0:00:00,0,0,0/n1987-11-03,Colin Kaepernick,In Play - Q3,QB,SF,0,0,0:00:48,149,20.3,20,76,33,20,0,0:00:18,0:00:23,0:00:04,0:00:02,0:00:00,54,1,0/n1987-11-03,Colin Kaepernick,In Play - Q1,QB,SF,0,0,0:00:42,107,20.3,21,72,14,0,0,0:00:20,0:00:19,0:00:02,0:00:00,0:00:00,14,0,0/n1987-11-03,Colin Kaepernick,In Play - Q4,QB,SF,0,0,0:00:45,91,20.3,25,66,0,0,0,0:00:24,0:00:21,0:00:00,0:00:00,0:00:00,0,0,0/n';
          
          return gamePage.readAndDeleteCSV().then(function(fileContents) {
            assert.equal(fileContents, exportFileContents);  
          })
        });
      })
    });          

    test.describe('#Page: Team Summary', function() {
      test.it('test setup', function() {
        gamePage.goToSection('teamSummary');
        gamePage.waitForTableToLoad();
      });

      test.it('clicking export button returns correct CSV', function() {
        gamePage.clickTeamSummaryExportLink();
      });
      
      test.it('csv file should have the correct data', function() {
        var exportFileContents = 'startTime,week,roadPriorScore,homePriorScore,playDesc,week,eventDesc/nFirst Quarter/n16:05:00,0,6,(10:35) 24-D.Freeman right tackle for 5 yards, TOUCHDOWN.,15,TD - 10:31/n16:05:00,0,13,(7:48) 2-M.Ryan pass short left to 18-T.Gabriel for 9 yards, TOUCHDOWN.,15,TD - 7:40/n16:05:00,0,20,(:47) (Shotgun) 2-M.Ryan pass short right to 81-A.Hooper for 9 yards, TOUCHDOWN.,15,TD - 0:40/nSecond Quarter/n16:05:00,6,21,(12:50) (Shotgun) 7-C.Kaepernick pass short left to 88-G.Celek for 16 yards, TOUCHDOWN.,15,TD - 12:45/n16:05:00,7,27,(4:36) (No Huddle) 24-D.Freeman right guard for 9 yards, TOUCHDOWN.,15,TD - 4:28/n16:05:00,13,28,(:17) (Shotgun) 7-C.Kaepernick pass short left to 81-R.Streater for 5 yards, TOUCHDOWN.,15,TD - 0:13/nThird Quarter/n16:05:00,13,31,(6:34) 3-M.Bryant 50 yard field goal is GOOD, Center-47-J.Harris, Holder-5-M.Bosher.,15,FG - 6:29/n16:05:00,13,37,(1:49) 24-D.Freeman left end for 34 yards, TOUCHDOWN.,15,TD - 1:42/nFourth Quarter/n16:05:00,13,41,(1:13) 3-M.Bryant 41 yard field goal is GOOD, Center-47-J.Harris, Holder-5-M.Bosher.,15,FG - 1:09/n';
        
        return gamePage.readAndDeleteCSV().then(function(fileContents) {
          assert.equal(fileContents, exportFileContents);  
        })
      });
    });      

    test.describe('#Page: Play By Play', function() {
      test.it('test setup', function() {
        gamePage.goToSection('playByPlay');
        gamePage.waitForTableToLoad();
      });

      test.it('clicking export button returns correct CSV', function() {
        gamePage.clickPlayByPlayExportLink();
      });
      
      test.it('csv file should have the correct data', function() {
        var exportFileContents = 'startTime,week,roadPriorScore,homePriorScore,playDesc,week,eventDesc/nFirst Quarter/n16:05:00,0,6,(10:35) 24-D.Freeman right tackle for 5 yards, TOUCHDOWN.,15,TD - 10:31/n16:05:00,0,13,(7:48) 2-M.Ryan pass short left to 18-T.Gabriel for 9 yards, TOUCHDOWN.,15,TD - 7:40/n16:05:00,0,20,(:47) (Shotgun) 2-M.Ryan pass short right to 81-A.Hooper for 9 yards, TOUCHDOWN.,15,TD - 0:40/nSecond Quarter/n16:05:00,6,21,(12:50) (Shotgun) 7-C.Kaepernick pass short left to 88-G.Celek for 16 yards, TOUCHDOWN.,15,TD - 12:45/n16:05:00,7,27,(4:36) (No Huddle) 24-D.Freeman right guard for 9 yards, TOUCHDOWN.,15,TD - 4:28/n16:05:00,13,28,(:17) (Shotgun) 7-C.Kaepernick pass short left to 81-R.Streater for 5 yards, TOUCHDOWN.,15,TD - 0:13/nThird Quarter/n16:05:00,13,31,(6:34) 3-M.Bryant 50 yard field goal is GOOD, Center-47-J.Harris, Holder-5-M.Bosher.,15,FG - 6:29/n16:05:00,13,37,(1:49) 24-D.Freeman left end for 34 yards, TOUCHDOWN.,15,TD - 1:42/nFourth Quarter/n16:05:00,13,41,(1:13) 3-M.Bryant 41 yard field goal is GOOD, Center-47-J.Harris, Holder-5-M.Bosher.,15,FG - 1:09/n';
        
        return gamePage.readAndDeleteCSV().then(function(fileContents) {
          assert.equal(fileContents, exportFileContents);  
        })
      });
    });      

    test.describe('#Page: Drives', function() {
      test.it('test setup', function() {
        gamePage.goToSection('drives');
        gamePage.waitForTableToLoad();
      });

      test.it('clicking export button returns correct CSV', function() {
        gamePage.clickDrivesExportLink();
      });
      
      test.it('export csv file should have the correct data', function() {
        var exportFileContents = 'driveStartDistance,drivePlays,driveHowEnded,roadEndScore,homeEndScore,startWp/n/n77,3,Punt,0,0,/n47,6,Touchdown,0,7,/n55,2,Fumble,0,7,/n50,5,Touchdown,0,14,/n87,3,Punt,0,14,/n55,11,Touchdown,0,21,/n75,6,Touchdown,7,21,/n/n75,4,Fumble,7,21,/n99,6,Punt,7,21,/n94,6,Touchdown,7,28,/n75,13,Touchdown,13,28,/n75,1,End of Half,13,28,/n/n75,9,Punt,13,28,/n93,3,Punt,13,28,/n57,6,Field Goal,13,31,/n75,6,Punt,13,31,/n77,4,Touchdown,13,38,/n76,3,Punt,13,38,/n78,8,Punt,13,38,/n/n87,8,Punt,13,38,/n91,8,Field Goal,13,41,/n78,2,End of Game,13,41,/n';
        
        return gamePage.readAndDeleteCSV().then(function(fileContents) {
          assert.equal(fileContents, exportFileContents);  
        })
      });

      test.it('clicking export summary button returns correct CSV', function() {
        gamePage.clickDrivesSummaryExportLink();
      });

      test.it('summary csv file should have the correct data', function() {
        var exportFileContents = 'startTime,week,roadPriorScore,homePriorScore,playDesc,week,eventDesc/nFirst Quarter/n16:05:00,0,6,(10:35) 24-D.Freeman right tackle for 5 yards, TOUCHDOWN.,15,TD - 10:31/n16:05:00,0,13,(7:48) 2-M.Ryan pass short left to 18-T.Gabriel for 9 yards, TOUCHDOWN.,15,TD - 7:40/n16:05:00,0,20,(:47) (Shotgun) 2-M.Ryan pass short right to 81-A.Hooper for 9 yards, TOUCHDOWN.,15,TD - 0:40/nSecond Quarter/n16:05:00,6,21,(12:50) (Shotgun) 7-C.Kaepernick pass short left to 88-G.Celek for 16 yards, TOUCHDOWN.,15,TD - 12:45/n16:05:00,7,27,(4:36) (No Huddle) 24-D.Freeman right guard for 9 yards, TOUCHDOWN.,15,TD - 4:28/n16:05:00,13,28,(:17) (Shotgun) 7-C.Kaepernick pass short left to 81-R.Streater for 5 yards, TOUCHDOWN.,15,TD - 0:13/nThird Quarter/n16:05:00,13,31,(6:34) 3-M.Bryant 50 yard field goal is GOOD, Center-47-J.Harris, Holder-5-M.Bosher.,15,FG - 6:29/n16:05:00,13,37,(1:49) 24-D.Freeman left end for 34 yards, TOUCHDOWN.,15,TD - 1:42/nFourth Quarter/n16:05:00,13,41,(1:13) 3-M.Bryant 41 yard field goal is GOOD, Center-47-J.Harris, Holder-5-M.Bosher.,15,FG - 1:09/n';
        
        return gamePage.readAndDeleteCSV().then(function(fileContents) {
          assert.equal(fileContents, exportFileContents);  
        })
      });
    });      
  });
});