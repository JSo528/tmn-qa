var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var constants = require('../../../lib/constants.js');

// Page Objects
var Navbar = require('../../../pages/mlb/navbar.js');
var Filters = require('../../../pages/mlb/filters.js');
var TeamsPage = require('../../../pages/mlb/teams/teams_page.js');
var TeamPage = require('../../../pages/mlb/teams/team_page.js');
var OverviewPage = require('../../../pages/mlb/teams/team_overview_page.js');

var navbar, filters, teamsPage, teamPage, overviewPage, teamPage;

test.describe('#Team StatcastFielding Section', function() {
  test.before(function() {  
    navbar  = new Navbar(driver);  
    filters  = new Filters(driver);  
    teamsPage = new TeamsPage(driver);
    teamPage = new TeamPage(driver);
    overviewPage = new OverviewPage(driver);

    navbar.goToTeamsPage();
    filters.removeSelectionFromDropdownFilter("Seasons:");
    filters.addSelectionToDropdownFilter("Seasons:", 2016);
    teamsPage.clickTeamTableCell(11,3); // should click into San Francisco Giants
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
        assert.equal(ofAirBall, 1425, 'OFAirBall');
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
      test.it('clicking a statcast fielding event should show correct data in modal', function() {
        overviewPage.clickStatcastFieldingChartEvent(40);
        overviewPage.getStatcastFieldingModalTableStat(1,2).then(function(date) {
          assert.equal(date, '4/20/2016', '1st row date');
        });

        overviewPage.getStatcastFieldingModalTableStat(1,7).then(function(result) {
          assert.equal(result, 'Outfield Fly Ball Out', '1st row result');
        });      

        overviewPage.getStatcastFieldingModalTableStat(1,8).then(function(outProb) {
          assert.equal(outProb, '99.9%', '1st row OutProb');
        });            

        overviewPage.getStatcastFieldingModalTableStat(1,9).then(function(posIndOutProb) {
          assert.equal(posIndOutProb, '99.9%', '1st row PosIndOutProb');
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
    
    // Video Playlist
    test.describe('#VideoPlaylist', function() {    
      test.it('clicking on a stat opens the play by play modal', function() {
        teamPage.clickOverviewTableStat(8);
        teamPage.getMatchupsAtBatHeaderText(1).then(function(text) {
          assert.equal(text, 'Vs RHP S. Casilla (BAL) , Top 9, 1 Out');
        });
      });

      test.it('clicking into video opens correct video', function() {
        teamPage.clickPitchVideoIcon(1);
        teamPage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "Top 9, 1 out");
        });

        teamPage.getVideoPlaylistText(1,3).then(function(text) {
          assert.equal(text, "2.54s HT, 24.5ft, 1.0s RT, 0 Jmp, 0.779821 Eff, 12.1mph 97.0% outProb - Single on a Line Drive");
        });          
      }); 

      test.it('clicking similar plays icon opens modal', function() {
        teamPage.closeVideoPlaylistModal();
        teamPage.clickSimiliarPlaysIcon(1);
        teamPage.getSimiliarPlaysHeader().then(function(title) {
          assert.equal(title, '23 most similar fielding plays to unsuccessful catch by Angel Pagan in LF at AT&T Park (8/14/2016). 21 of 23 balls caught', 'modal title');
        })
      });

      test.after(function() {
        teamPage.closeSimiliarPlaysModal();
        teamPage.closePlayByPlaytModal();
      });
    });


    test.describe("#Reports", function() {
      var reports = [
        { type: 'Outfielder Air Defense Team Model', topStat: '107.0%', statType: "ExRange%" },  
        { type: 'Outfielder Air Defense Team Skills', topStat: '58.4%', statType: "OFAirOut%" },  
        { type: 'Outfield Batter Positioning', topStat: '102.6%', statType: "OFWPosAirOut%" },  
      ];
      reports.forEach(function(report) {
        test.it("selecting " + report.type + " shows the correct stat value for " + report.statType, function() {
          teamPage.changeReport(report.type);  
          overviewPage.getTeamTableStat(6).then(function(stat) {
            assert.equal(stat, report.topStat);
          });
        });
      });

      test.after(function() {
        teamPage.changeReport('Outfielder Air Defense Positioning');
      });        
    });
  });

  // Roster Section
  test.describe("#Subsection: Roster", function() {
    test.before(function() {
      teamPage.goToSubSection("roster");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    // Video Playlist
    test.describe('#VideoPlaylist', function() {    
      test.it('clicking on a stat opens the play by play modal', function() {
        teamPage.clickRosterTableStat(1,4);
        teamPage.getMatchupsAtBatHeaderText(1).then(function(text) {
          assert.equal(text, 'Vs RHP S. Romo (LAD) , Top 9, 0 Out');
        });
      });

      test.it('clicking into video opens correct video', function() {
        teamPage.clickPitchVideoIcon(1);
        teamPage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "Top 9, 0 out");
        });

        teamPage.getVideoPlaylistText(1,3).then(function(text) {
          assert.equal(text, "2.10s HT, 79.9ft, 0.8s RT, 0 Jmp, 98.2% Eff, 14.9mph 0.0% outProb - Single on a Line Drive");
        });          
      }); 

      test.after(function() {
        teamPage.closeVideoPlaylistModal();
        teamPage.closePlayByPlaytModal();
      });
    });

    test.describe("#filters", function() {
      test.it('adding filter: (Batted Ball: Line Drive) from sidebar displays correct data', function() {
        filters.toggleSidebarFilter('Batted Ball:', 'Line Drive', true);

        teamPage.getRosterTableStat(1,1).then(function(player) {
          assert.equal(player, 'Mike Broadway');
        });

        teamPage.getRosterTableStat(1,10).then(function(ofWAirOutPer) {
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
      teamPage.goToSubSection("gameLog");
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

    // Video Playlist
    test.describe('#VideoPlaylist', function() {    
      test.it('clicking on a stat opens the play by play modal', function() {
        teamPage.clickGameLogTableStat(1,7);
        teamPage.getMatchupsAtBatHeaderText(1).then(function(text) {
          assert.equal(text, 'Vs LHP M. Moore (LAD) , Top 4, 2 Out');
        });
      });

      test.it('clicking into video opens correct video', function() {
        teamPage.clickPitchVideoIcon(2);
        teamPage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "Top 4, 2 out");
        });

        teamPage.getVideoPlaylistText(1,3).then(function(text) {
          assert.equal(text, "2.15s HT, 90.4ft, 1.4s RT, 0 Jmp, 0.9343 Eff, 9.0mph 0.0% outProb - Single on a Line Drive");
        });          
      }); 

      test.after(function() {
        teamPage.closeVideoPlaylistModal();
        teamPage.closePlayByPlaytModal();
      });
    });

    test.describe("#filters", function() {
      test.it('adding filter: (Forward Velocity: 80-120) from sidebar displays correct data', function() {
        filters.changeValuesForRangeSidebarFilter("Forward Velocity:", 80, 120);

        teamPage.getGameLogTableStat(1,5).then(function(bf) {
          assert.equal(bf, 5, 'row 1 OFAirBall');
        });          

        teamPage.getGameLogTableStat(1,8).then(function(exRange) {
          assert.equal(exRange, '83.0%', 'row 1 OFWPosAirOut%');
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
      teamPage.goToSubSection("pitchLog");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.describe('when selecting filter (Launch Angle: 0-30)', function() {
      test.before(function() {
        filters.changeValuesForRangeSidebarFilter('Launch Angle:', 0, 30);
      });
      
      test.it('should show the correct at bat footer text', function() {
        teamPage.getMatchupsAtBatFooterText(1).then(function(text) {
          assert.equal(text, "Adrian Gonzalez Lines Out Softly To Left Fielder Angel Pagan.");
        });
      });

      test.it('should show the correct row data', function() {
        teamPage.getMatchupsPitchText(1,2).then(function(hang) {
          assert.equal(hang, '3.78s', 'row 1 hang');
        });
        teamPage.getMatchupsPitchText(1,3).then(function(dist) {
          assert.equal(dist, '33.4ft', 'row 1 dist');
        });
        teamPage.getMatchupsPitchText(1,4).then(function(react) {
          assert.equal(react, '1.5s', 'row 1 react');
        });
        teamPage.getMatchupsPitchText(1,5).then(function(jump) {
          assert.equal(jump, '2.64s', 'row 1 jump');
        });
        teamPage.getMatchupsPitchText(1,6).then(function(pathEff) {
          assert.equal(pathEff, '90.5%', 'row 1 PathEff');
        });        
      });

      test.describe('clicking similar plays icon', function() {
        test.it('clicking similiar icon opens up similiar plays modal and shows correct stats', function() {
          teamPage.clickSimiliarPlaysIcon(1);
          teamPage.getSimiliarPlaysTableStat(1,10).then(function(pathEff) {
            assert.equal(pathEff, '90.5%', '1st row PathEff')
          });

          teamPage.getSimiliarPlaysTableStat(1,14).then(function(simScore) {
            assert.equal(simScore, 1.000, '1st row SimScore')
          });        
        });

        test.after(function() {
          teamPage.closeSimiliarPlaysModal();  
        });
      });

      test.describe('clicking flat view tab', function() {
        test.it('should show the correct stats', function() {
          teamPage.clickFlatViewTab();
          teamPage.getFlatViewPitchText(1,9).then(function(speed) {
            assert.equal(speed, '9.7mph', 'row 1 speed');
          });

          teamPage.getFlatViewPitchText(2,8).then(function(accel) {
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