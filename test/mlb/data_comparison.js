var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var constants = require('../../lib/constants.js');
var credentials = require('../../lib/credentials.js');
var By = require('selenium-webdriver').By;
  
// Page Objects
var Navbar = require('../../pages/mlb/navbar.js');
var Filters = require('../../pages/mlb/filters.js');
var Reports = require('../../pages/mlb/reports.js');
var LoginPage = require('../../pages/login_page.js');

var StandingsPage = require('../../pages/mlb/standings_page.js');
var ScoresPage = require('../../pages/mlb/scores/scores_page.js');
var DetailedScorePage = require('../../pages/mlb/scores/detailed_score_page.js');
var ScorePitchByPitch = require('../../pages/mlb/scores/pitch_by_pitch_page.js');
var ScorePitchingSplitsPage = require('../../pages/mlb/scores/pitching_splits_page.js');

var TeamsPage = require('../../pages/mlb/teams/teams_page.js');
var TeamsStatsPage = require('../../pages/mlb/teams/stats_page.js');
var TeamPage = require('../../pages/mlb/team/team_page.js');
var TeamRosterPage = require('../../pages/mlb/team/roster_page.js');

var PlayersPage = require('../../pages/mlb/players/players_page.js');
var PlayersStatsPage = require('../../pages/mlb/players/stats_page.js');
var PlayerPage = require('../../pages/mlb/player/player_page.js');

var UmpiresPage = require('../../pages/mlb/umpires_page.js');
var UmpirePage = require('../../pages/mlb/umpire_page.js');

var prodUrl = constants.urls.mlb.dodgers;
var navbar, filters, standingsPage, scoresPage, detailedScorePage, umpiresPage, 
  teamsStatsPage, teamPage, playersPage, playerPage, playersStatsPage, umpirePage;
var reports, report;


test.describe('#DataComparison', function() {
  this.timeout(120000);
  test.before(function() {
    navbar  = new Navbar(driver);
    filters = new Filters(driver);
    standingsPage = new StandingsPage(driver);
    scoresPage = new ScoresPage(driver);
    teamsStatsPage = new TeamsStatsPage(driver);
    umpiresPage = new UmpiresPage(driver);
    reports = new Reports(driver);

    browser.openNewTab(prodUrl).then(function() {
      browser.switchToTab(1);  
    })
    
    loginPage = new LoginPage(driver);
    loginPage.login(credentials.testUser.email, credentials.testUser.password);
  });

  // test.describe('@Standings Page', function() {
  //   test.it('standings page shows the same data', function() {
  //     browser.executeForEachTab(function() {
  //       navbar.goToStandingsPage();
  //     });
      
  //     browser.getFullContentForEachTab(standingsPage.comparisonLocator, standingsPage.lastLocator).then(function(contentArray) {
  //       var stagData = contentArray[0];
  //       var prodData = contentArray[1];
  //       assert.equal( stagData, prodData, 'main data should be the same');
  //     })  
  //   });

  //   test.it('standings page shows the same data for 2015', function() {
  //     browser.executeForEachTab(function() {
  //       standingsPage.changeYear(2015);
  //     });

  //     browser.getFullContentForEachTab(standingsPage.comparisonLocator, standingsPage.lastLocator).then(function(contentArray) {
  //       assert.equal( contentArray[0], contentArray[1], '2015 data should be the same' );
  //     })  
  //   })

  //   test.it('standings page shows the same data for AAA', function() {
  //     browser.executeForEachTab(function() {
  //       standingsPage.changeSeasonLevel("AAA");
  //     });

  //     browser.getFullContentForEachTab(standingsPage.comparisonLocator, standingsPage.lastLocator).then(function(contentArray) {
  //       assert.equal( contentArray[0], contentArray[1], 'AAA data should be the same' );
  //     })  
  //   })  
  // })

  // test.describe('@Scores Page', function() {
  //   test.before(function() {
  //     browser.executeForEachTab(function() {
  //       navbar.goToScoresPage();
  //     })
  //   });

  //   test.it('scores page shows the same data', function() {
  //     browser.getFullContentForEachTab(scoresPage.comparisonLocator, scoresPage.lastLocator).then(function(contentArray) {
  //       assert.equal( contentArray[0], contentArray[1], 'main data should be the same' );
  //     })  
  //   });

  //   test.it('scores page shows the same data for 2016-5-1', function() {
  //     browser.executeForEachTab(function() {
  //       scoresPage.changeDate('2016-5-1');
  //     })
        
  //     browser.getFullContentForEachTab(scoresPage.comparisonLocator, scoresPage.lastLocator).then(function(contentArray) {
  //       assert.equal( contentArray[0], contentArray[1], '2016-5-1 data should be the same' );
  //     })  
  //   });    

  //   test.it('scores page shows the same data for AAA', function() {
  //     browser.executeForEachTab(function() {
  //       scoresPage.changeSeasonLevel('AAA');
  //     })
  //     browser.getFullContentForEachTab(scoresPage.comparisonLocator, scoresPage.lastLocator).then(function(contentArray) {
  //       assert.equal( contentArray[0], contentArray[1], 'AAA data should be the same' );
  //     })  
  //   });        
  // })

  // test.describe('@Detailed Scores Page', function() {
  //   test.before(function() {
  //     detailedScorePage = new DetailedScorePage(driver);
  //     browser.executeForEachTab(function() {
  //       scoresPage.clickBoxScore(1);
  //     })
  //   })

  //   test.it('detailed scores page shows the same data', function() {
  //     browser.getFullContentForEachTab(detailedScorePage.comparsionLocator, detailedScorePage.lastLocator).then(function(contentArray) {
  //       assert.equal( contentArray[0], contentArray[1], 'main data should be the same' );
  //     })        
  //   });

  //   test.describe("#batting reports", function() {
  //     DetailedScorePage.prototype.battingReports.forEach(function(report) {
  //       test.it('Report: '+report+' shows the same data', function() {
  //         browser.executeForEachTab(function() {
  //           detailedScorePage.changeBattingReport(report);
  //         })

  //         browser.getFullContentForEachTab(detailedScorePage.comparsionLocator, detailedScorePage.battingLastLocator).then(function(contentArray) {
  //           assert.equal( contentArray[0], contentArray[1], 'data for report: '+report+' should be the same' );
  //         }) 
  //       });
  //     });
  //   })

  //   test.describe("#pitching reports", function() {
  //     test.before(function() {
  //       browser.executeForEachTab(function() {
  //         detailedScorePage.goToSection("Pitching");
  //       })
  //     })

  //     DetailedScorePage.prototype.pitchingReports.forEach(function(report) {
  //       test.it('Report: '+report+' shows the same data', function() {
  //         browser.executeForEachTab(function() {
  //           detailedScorePage.changePitchingReport(report);
  //         })

  //         browser.getFullContentForEachTab(detailedScorePage.comparsionLocator, detailedScorePage.pitchingLastLocator).then(function(contentArray) {
  //           assert.equal( contentArray[0], contentArray[1], 'data for report: '+report+' should be the same' );
  //         }) 
  //       });
  //     });
  //   })    

  //   test.describe("#pitch by pitch subsection", function() {
  //     test.before(function() {
  //       scorePitchByPitchPage = new ScorePitchByPitch(driver);
  //       browser.executeForEachTab(function() {
  //         detailedScorePage.goToSection("Pitch By Pitch");
  //       })
  //     })

  //     test.it('Main page shows the same data', function() {
  //       browser.getFullContentForEachTab(scorePitchByPitchPage.comparisonDataContainer, scorePitchByPitchPage.lastLocator)
  //         .then(function(contentArray) {
  //         assert.equal( contentArray[0], contentArray[1] );
  //       }) 
  //     });

  //     // TODO - this test keeps breaking in production for some reason
  //     // test.it('When decisive event is turned on, it should shows the same data', function() {
  //     //   browser.executeForEachTab(function() {
  //     //     scorePitchByPitchPage.addDecisiveEventFilter("yes");
  //     //   })

  //     //   browser.getFullContentForEachTab(null, scorePitchByPitchPage.lastLocator).then(function(contentArray) {
  //     //     assert.equal( contentArray[0], contentArray[1] );
  //     //   }) 
  //     // });       
  //   })    

  //   test.describe("#pitching splits subsection", function() {
  //     test.before(function() {
  //       scorePitchingSplitsPage = new ScorePitchingSplitsPage(driver);
  //       browser.executeForEachTab(function() {
  //         detailedScorePage.goToSection("Pitching Splits");
  //       })

  //     })

  //     test.it('Main page shows the same data', function() {
  //       browser.getFullContentForEachTab(scorePitchingSplitsPage.comparisonLocator).then(function(contentArray) {
  //         assert.equal( contentArray[0], contentArray[1] );
  //       }) 
  //     });    
  //   })        
  // });

  // test.describe('@Teams Page', function() {
  //   test.before(function() {
  //     teamsPage = new TeamsPage(driver);
  //     browser.executeForEachTab(function() {
  //       navbar.goToTeamsPage();
  //     })   
  //   });

  //   test.describe('#Batting Section', function() {
  //     test.it('main page shows the same data', function() {
  //       browser.getFullContentForEachTab(teamsPage.statsTable).then(function(contentArray) {
  //         assert.equal( contentArray[0], contentArray[1] );
  //       })  
  //     });

  //     test.it('occurrences & streaks shows the same data', function() {
  //       browser.executeForEachTab(function() {
  //         teamsPage.goToSubSection("Occurrences & Streaks");
  //       })

  //       browser.getFullContentForEachTab(teamsPage.streaksTable).then(function(contentArray) {
  //         assert.equal( contentArray[0], contentArray[1] );
  //       })  
  //     });    
  //   })

  //   test.describe('#Pitching Section', function() {
  //     test.before(function() {
  //       browser.executeForEachTab(function() {
  //         teamsPage.goToSection("Pitching");
  //       })   
  //     });

  //     test.it('main page shows the same data', function() {
  //       browser.getFullContentForEachTab(teamsPage.statsTable).then(function(contentArray) {
  //         assert.equal( contentArray[0], contentArray[1] );
  //       })  
  //     });

  //     test.it('occurrences & streaks shows the same data', function() {
  //       browser.executeForEachTab(function() {
  //         teamsPage.goToSubSection("Occurrences & Streaks");
  //       })

  //       browser.getFullContentForEachTab(teamsPage.streaksTable).then(function(contentArray) {
  //         assert.equal( contentArray[0], contentArray[1] );
  //       })  
  //     });    
  //   }) 

  //   test.describe('#Catching Section', function() {
  //     test.before(function() {
  //       browser.executeForEachTab(function() {
  //         teamsPage.goToSection("Catching");
  //       })   
  //     });

  //     test.it('main page shows the same data', function() {
  //       browser.getFullContentForEachTab(teamsPage.statsTable).then(function(contentArray) {
  //         assert.equal( contentArray[0], contentArray[1] );
  //       })  
  //     });

  //     test.it('occurrences & streaks shows the same data', function() {
  //       browser.executeForEachTab(function() {
  //         teamsPage.goToSubSection("Occurrences & Streaks");
  //       })

  //       browser.getFullContentForEachTab(teamsPage.streaksTable, teamsPage.streaksTable).then(function(contentArray) {
  //         assert.equal( contentArray[0], contentArray[1] );
  //       })  
  //     });    
  //   }) 

  //   test.describe('#Statcast Fielding Section', function() {
  //     test.before(function() {
  //       browser.executeForEachTab(function() {
  //         teamsPage.goToSection("Statcast Fielding");
  //       })   
  //     });

  //     test.it('main page shows the same data', function() {
  //       browser.getFullContentForEachTab(teamsPage.statsTable).then(function(contentArray) {
  //         assert.equal( contentArray[0], contentArray[1] );
  //       })  
  //     });

  //     test.it('occurrences & streaks shows the same data', function() {
  //       browser.executeForEachTab(function() {
  //         teamsPage.goToSubSection("Occurrences & Streaks");
  //       })

  //       browser.getFullContentForEachTab(teamsPage.streaksTable, teamsPage.streaksTable).then(function(contentArray) {
  //         assert.equal( contentArray[0], contentArray[1] );
  //       })  
  //     });    
  //   })     
  // })

  // test.describe('@Umpires Page', function() {
  //   test.before(function() {
  //     browser.executeForEachTab(function() {
  //       navbar.goToUmpiresPage();
  //     })   
  //   });

  //   test.describe('#Stats Section', function() {
  //     test.it('main page shows the same data', function() {
  //       browser.getFullContentForEachTab(umpiresPage.statsTable).then(function(contentArray) {
  //         assert.equal( contentArray[0], contentArray[1] );
  //       });
  //     });
  //   });

  //   test.describe("#umpire reports", function() {
  //     UmpiresPage.prototype.reports.forEach(function(report) {
  //       test.it('Report: '+report+' shows the same data', function() {
  //         browser.executeForEachTab(function() {
  //           umpiresPage.changeReport(report);
  //         });

  //         browser.getFullContentForEachTab(umpiresPage.statsTable).then(function(contentArray) {
  //           assert.equal( contentArray[0], contentArray[1], 'data for report: '+report+' should be the same' );
  //         }); 
  //       });
  //     });
  //   }); 
  // }); 

  // test.describe('@Individual Team Page', function() {
  //   test.before(function() {
  //     teamPage = new TeamPage(driver);
  //     browser.executeForEachTab(function() {
  //       navbar.goToTeamsPage();
  //       teamsStatsPage.clickTeamTableCell(1,3);
  //     });   
  //   });

  //   test.describe('#BattingSection', function() {
  //     test.describe('#OverviewSubSection', function() {
  //       test.before(function() {
  //         report = reports.selectRandomReport('batting');
  //       })
        
  //       test.it('Report: '+report+' shows the same data', function() {
  //         browser.executeForEachTab(function() {
  //           teamPage.changeReport(report);
  //         })

  //         browser.getFullContentForEachTab(teamPage.overviewStatsTable).then(function(contentArray) {
  //           assert.equal( contentArray[0], contentArray[1], 'data for report: '+report+' should be the same' );
  //         }); 
  //       });
  //     });

  //     test.describe('#RosterSubSection', function() {
  //       test.before(function() {
  //         report = reports.selectRandomReport('batting');
  //         browser.executeForEachTab(function() {
  //           teamPage.goToSubSection('Roster');
  //         });   
  //       });

  //       test.it('Report: '+report+' shows the same data', function() {
  //         browser.executeForEachTab(function() {
  //           teamPage.changeReport(report);
  //         })
  //         browser.getFullContentForEachTab(teamPage.rosterBattingStatsTable).then(function(contentArray) {
  //           assert.equal( contentArray[0], contentArray[1], 'data for report: '+report+' should be the same' );
  //         }); 
  //       });

  //       test.describe('#Currently On Team', function() {
  //         test.before(function() {
  //           var teamRosterPage = new TeamRosterPage(driver);
  //           browser.executeForEachTab(function() {
  //             teamRosterPage.changeOnTeamDropdown('Currently On Team');
  //           });   
  //         });

  //         test.it('table data should be the same', function() {
  //           browser.getFullContentForEachTab(teamPage.rosterStatsTable).then(function(contentArray) {
  //             assert.equal( contentArray[0], contentArray[1] );
  //           }); 
  //         });
  //       });
  //     });

  //     test.describe('#GameLogSubSection', function() {
  //       test.before(function() {
  //         report = reports.selectRandomReport('batting');
  //         browser.executeForEachTab(function() {
  //           teamPage.goToSubSection('Game Log');
  //         });   
  //       });
        
  //       test.it('Report: '+report+' shows the same data', function() {
  //         browser.executeForEachTab(function() {
  //           teamPage.changeReport(report);
  //         })
  //         browser.getFullContentForEachTab(teamPage.gameLogStatsTable).then(function(contentArray) {
  //           assert.equal( contentArray[0], contentArray[1], 'data for report: '+report+' should be the same' );
  //         }); 
  //       });
  //     });

  //     test.describe('#SplitsSubSection', function() {
  //       test.before(function() {
  //         report = reports.selectRandomReport('batting');
  //         browser.executeForEachTab(function() {
  //           teamPage.goToSubSection('Splits');
  //         });   
  //       });
        
  //       test.it('Report: '+report+' shows the same data', function() {
  //         browser.executeForEachTab(function() {
  //           teamPage.changeReport(report);
  //         })
  //         browser.getFullContentForEachTab(teamPage.splitsStatsTable).then(function(contentArray) {
  //           assert.equal( contentArray[0], contentArray[1], 'data for report: '+report+' should be the same' );
  //         }); 
  //       });
  //     });

  //     test.describe('#PitchLogSubSection', function() {
  //       test.before(function() {
  //         browser.executeForEachTab(function() {
  //           teamPage.goToSubSection('Pitch Log');
  //         });   
  //       });
        
  //       test.it('table shows the same data', function() {
  //         browser.getFullContentForEachTab(teamPage.pitchLogBattingStatsTable).then(function(contentArray) {
  //           assert.equal( contentArray[0], contentArray[1], 'data for report: '+report+' should be the same' );
  //         }); 
  //       });
  //     });

  //     test.describe('#MatchupsSubSection', function() {
  //       test.before(function() {
  //         browser.executeForEachTab(function() {
  //           teamPage.goToSubSection('Matchups');
  //         });   
  //       });
  //       test.it('shows the same table data', function() {
  //         browser.getFullContentForEachTab(teamPage.matchupsBattingStatsTable).then(function(contentArray) {
  //           assert.equal( contentArray[0], contentArray[1]);
  //         }); 
  //       });
  //     });

  //     test.describe('#VsTeamsSubSection', function() {
  //       test.before(function() {
  //         report = reports.selectRandomReport('batting');
  //         browser.executeForEachTab(function() {
  //           teamPage.goToSubSection('Vs Teams');
  //         });   
  //       });
        
  //       test.it('Report: '+report+' shows the same data', function() {
  //         browser.executeForEachTab(function() {
  //           teamPage.changeReport(report);
  //         })
  //         browser.getFullContentForEachTab(teamPage.vsStatsTable).then(function(contentArray) {
  //           assert.equal( contentArray[0], contentArray[1], 'data for report: '+report+' should be the same' );
  //         }); 
  //       });
  //     });     

  //     test.describe('#VsHittersSubSection', function() {
  //       test.before(function() {
  //         report = reports.selectRandomReport('batting');
  //         browser.executeForEachTab(function() {
  //           teamPage.goToSubSection('Vs Hitters');
  //         });   
  //       });
        
  //       test.it('Report: '+report+' shows the same data', function() {
  //         browser.executeForEachTab(function() {
  //           teamPage.changeReport(report);
  //         })
  //         browser.getFullContentForEachTab(teamPage.vsStatsTable).then(function(contentArray) {
  //           assert.equal( contentArray[0], contentArray[1], 'data for report: '+report+' should be the same' );
  //         }); 
  //       });
  //     });     
  //   });

  //   test.describe('#Pitching', function() {
  //     test.before(function() {
  //       browser.executeForEachTab(function() {
  //         teamPage.goToSection('pitching');
  //       });   
  //     });

  //     test.describe('#OverviewSubSection', function() {
  //       test.before(function() {
  //         report = reports.selectRandomReport('pitching');
  //       });
        
  //       test.it('Report: '+report+' shows the same data', function() {
  //         browser.executeForEachTab(function() {
  //           teamPage.changeReport(report);
  //         })
  //         browser.getFullContentForEachTab(teamPage.overviewStatsTable).then(function(contentArray) {
  //           assert.equal( contentArray[0], contentArray[1], 'data for report: '+report+' should be the same' );
  //         }); 
  //       });
  //     });

  //     test.describe('#RosterSubSection', function() {
  //       test.before(function() {
  //         report = reports.selectRandomReport('pitching');
  //         browser.executeForEachTab(function() {
  //           teamPage.goToSubSection('Roster');
  //         });   
  //       });

  //       test.it('Report: '+report+' shows the same data', function() {
  //         browser.executeForEachTab(function() {
  //           teamPage.changeReport(report);
  //         })
  //         browser.getFullContentForEachTab(teamPage.rosterPitchingStatsTable).then(function(contentArray) {
  //           assert.equal( contentArray[0], contentArray[1], 'data for report: '+report+' should be the same' );
  //         }); 
  //       });

  //       test.describe('#Currently On Team', function() {
  //         test.before(function() {
  //           var teamRosterPage = new TeamRosterPage(driver);
  //           browser.executeForEachTab(function() {
  //             teamRosterPage.changeOnTeamDropdown('Currently On Team');
  //           });   
  //         });

  //         test.it('table data should be the same', function() {
  //           browser.getFullContentForEachTab(teamPage.rosterStatsTable).then(function(contentArray) {
  //             assert.equal( contentArray[0], contentArray[1] );
  //           }); 
  //         });
  //       });
  //     });

  //     test.describe('#GameLogSubSection', function() {
  //       test.before(function() {
  //         report = reports.selectRandomReport('pitching');
  //         browser.executeForEachTab(function() {
  //           teamPage.goToSubSection('Game Log');
  //         });   
          
  //       });
        
  //       test.it('Report: '+report+' shows the same data', function() {
  //         browser.executeForEachTab(function() {
  //           teamPage.changeReport(report);
  //         })
  //         browser.getFullContentForEachTab(teamPage.gameLogStatsTable).then(function(contentArray) {
  //           assert.equal( contentArray[0], contentArray[1], 'data for report: '+report+' should be the same' );
  //         }); 
  //       });
  //     });

  //     test.describe('#SplitsSubSection', function() {
  //       test.before(function() {
  //         report = reports.selectRandomReport('pitching');
  //         browser.executeForEachTab(function() {
  //           teamPage.goToSubSection('Splits');
  //         });   
  //       });
  //       test.it('Report: '+report+' shows the same data', function() {
  //         browser.executeForEachTab(function() {
  //           teamPage.changeReport(report);
  //         })
  //         browser.getFullContentForEachTab(teamPage.splitsStatsTable).then(function(contentArray) {
  //           assert.equal( contentArray[0], contentArray[1], 'data for report: '+report+' should be the same' );
  //         }); 
  //       });
  //     });

  //     test.describe('#PitchLogSubSection', function() {
  //       test.before(function() {
  //         browser.executeForEachTab(function() {
  //           teamPage.goToSubSection('Pitch Log');
  //         });   
  //       });
  //       test.it('table shows the same data', function() {
  //         browser.getFullContentForEachTab(teamPage.pitchLogPitchingStatsTable).then(function(contentArray) {
  //           assert.equal( contentArray[0], contentArray[1], 'data for report: '+report+' should be the same' );
  //         }); 
  //       });
  //     });

  //     test.describe('#MatchupsSubSection', function() {
  //       test.before(function() {
  //         browser.executeForEachTab(function() {
  //           teamPage.goToSubSection('Matchups');
  //         });   
  //       });
  //       test.it('ableshows the same data', function() {
  //         browser.getFullContentForEachTab(teamPage.matchupsPitchingStatsTable).then(function(contentArray) {
  //           assert.equal( contentArray[0], contentArray[1]);
  //         }); 
  //       });
  //     });

  //     test.describe('#VsTeamsSubSection', function() {
  //       test.before(function() {
  //         report = reports.selectRandomReport('pitching');
  //         browser.executeForEachTab(function() {
  //           teamPage.goToSubSection('Vs Teams');
  //         });   
  //       });
        
  //       test.it('Report: '+report+' shows the same data', function() {
  //         browser.executeForEachTab(function() {
  //           teamPage.changeReport(report);
  //         })
  //         browser.getFullContentForEachTab(teamPage.vsStatsTable).then(function(contentArray) {
  //           assert.equal( contentArray[0], contentArray[1], 'data for report: '+report+' should be the same' );
  //         }); 
  //       });
  //     });     

  //     test.describe('#VsHittersSubSection', function() {
  //       test.before(function() {
  //         report = reports.selectRandomReport('pitching');
  //         browser.executeForEachTab(function() {
  //           teamPage.goToSubSection('Vs Hitters');
  //         });   
  //       });
  //       test.it('Report: '+report+' shows the same data', function() {
  //         browser.executeForEachTab(function() {
  //           teamPage.changeReport(report);
  //         })
  //         browser.getFullContentForEachTab(teamPage.vsStatsTable).then(function(contentArray) {
  //           assert.equal( contentArray[0], contentArray[1], 'data for report: '+report+' should be the same' );
  //         }); 
  //       });
  //     });    
  //   });    

  //   test.describe('#Catching', function() {
  //     test.before(function() {
  //       browser.executeForEachTab(function() {
  //         teamPage.goToSection('catching');
  //       });   
  //     });

  //     test.describe('#OverviewSubSection', function() {
  //       test.before(function() {
  //         report = reports.selectRandomReport('catching');
  //       });
        
  //       test.it('Report: '+report+' shows the same data', function() {
  //         browser.executeForEachTab(function() {
  //           teamPage.changeReport(report);
  //         })
  //         browser.getFullContentForEachTab(teamPage.overviewStatsTable).then(function(contentArray) {
  //           assert.equal( contentArray[0], contentArray[1], 'data for report: '+report+' should be the same' );
  //         }); 
  //       });
  //     });

  //     test.describe('#RosterSubSection', function() {
  //       test.before(function() {
  //         report = reports.selectRandomReport('catching');
  //         browser.executeForEachTab(function() {
  //           teamPage.goToSubSection('Roster');
  //         });   
  //       });

  //       test.it('Report: '+report+' shows the same data', function() {
  //         browser.executeForEachTab(function() {
  //           teamPage.changeReport(report);
  //         })
  //         browser.getFullContentForEachTab(teamPage.rosterCatchingStatsTable).then(function(contentArray) {
  //           assert.equal( contentArray[0], contentArray[1], 'data for report: '+report+' should be the same' );
  //         }); 
  //       });

  //       test.describe('#Currently On Team', function() {
  //         test.before(function() {
  //           var teamRosterPage = new TeamRosterPage(driver);
  //           browser.executeForEachTab(function() {
  //             teamRosterPage.changeOnTeamDropdown('Currently On Team');
  //           });   
  //         });

  //         test.it('table data should be the same', function() {
  //           browser.getFullContentForEachTab(teamPage.rosterStatsTable).then(function(contentArray) {
  //             assert.equal( contentArray[0], contentArray[1] );
  //           }); 
  //         });
  //       });
  //     });

  //     test.describe('#GameLogSubSection', function() {
  //       test.before(function() {
  //         report = reports.selectRandomReport('catching');
  //         browser.executeForEachTab(function() {
  //           teamPage.goToSubSection('Game Log');
  //         });   
          
  //       });
        
  //       test.it('Report: '+report+' shows the same data', function() {
  //         browser.executeForEachTab(function() {
  //           teamPage.changeReport(report);
  //         })
  //         browser.getFullContentForEachTab(teamPage.gameLogStatsTable).then(function(contentArray) {
  //           assert.equal( contentArray[0], contentArray[1], 'data for report: '+report+' should be the same' );
  //         }); 
  //       });
  //     });

  //     test.describe('#PitchLogSubSection', function() {
  //       test.before(function() {
  //         browser.executeForEachTab(function() {
  //           teamPage.goToSubSection('Pitch Log');
  //         });   
  //       });
  //       test.it('table shows the same data', function() {
  //         browser.getFullContentForEachTab(teamPage.pitchLogPitchingStatsTable).then(function(contentArray) {
  //           assert.equal( contentArray[0], contentArray[1], 'data for report: '+report+' should be the same' );
  //         }); 
  //       });
  //     });
  //   });    

  //   test.describe('#StatcastFielding', function() {
  //     test.before(function() {
  //       browser.executeForEachTab(function() {
  //         teamPage.goToSection('statcastFielding');
  //       });   
  //     });

  //     test.describe('#OverviewSubSection', function() {
  //       test.before(function() {
  //         report = reports.selectRandomReport('statcastFielding');
  //       });
        
  //       test.it('Report: '+report+' shows the same data', function() {
  //         browser.executeForEachTab(function() {
  //           teamPage.changeReport(report);
  //         })
  //         browser.getFullContentForEachTab(teamPage.overviewStatsTable).then(function(contentArray) {
  //           assert.equal( contentArray[0], contentArray[1], 'data for report: '+report+' should be the same' );
  //         }); 
  //       });
  //     });

  //     test.describe('#RosterSubSection', function() {
  //       test.before(function() {
  //         report = reports.selectRandomReport('statcastFielding');
  //         browser.executeForEachTab(function() {
  //           teamPage.goToSubSection('Roster');
  //         });   
  //       });

  //       test.it('Report: '+report+' shows the same data', function() {
  //         browser.executeForEachTab(function() {
  //           teamPage.changeReport(report);
  //         })
  //         browser.getFullContentForEachTab(teamPage.rosterCatchingStatsTable).then(function(contentArray) {
  //           assert.equal( contentArray[0], contentArray[1], 'data for report: '+report+' should be the same' );
  //         }); 
  //       });

  //       test.describe('#Currently On Team', function() {
  //         test.before(function() {
  //           var teamRosterPage = new TeamRosterPage(driver);
  //           browser.executeForEachTab(function() {
  //             teamRosterPage.changeOnTeamDropdown('Currently On Team');
  //           });   
  //         });

  //         test.it('table data should be the same', function() {
  //           browser.getFullContentForEachTab(teamPage.rosterStatsTable).then(function(contentArray) {
  //             assert.equal( contentArray[0], contentArray[1] );
  //           }); 
  //         });
  //       });
  //     });

  //     test.describe('#GameLogSubSection', function() {
  //       test.before(function() {
  //         report = reports.selectRandomReport('statcastFielding');
  //         browser.executeForEachTab(function() {
  //           teamPage.goToSubSection('Game Log');
  //         });   
          
  //       });
        
  //       test.it('Report: '+report+' shows the same data', function() {
  //         browser.executeForEachTab(function() {
  //           teamPage.changeReport(report);
  //         })
  //         browser.getFullContentForEachTab(teamPage.gameLogStatsTable).then(function(contentArray) {
  //           assert.equal( contentArray[0], contentArray[1], 'data for report: '+report+' should be the same' );
  //         }); 
  //       });
  //     });

  //     test.describe('#PitchLogSubSection', function() {
  //       test.before(function() {
  //         browser.executeForEachTab(function() {
  //           teamPage.goToSubSection('Pitch Log');
  //         });   
  //       });
  //       test.it('table shows the same data', function() {
  //         browser.getFullContentForEachTab(teamPage.pitchLogPitchingStatsTable).then(function(contentArray) {
  //           assert.equal( contentArray[0], contentArray[1], 'data for report: '+report+' should be the same' );
  //         }); 
  //       });
  //     });
  //   });    
  // });

  test.describe('@Individual Player Page', function() {
    test.before(function() { 
      playerPage = new PlayerPage(driver);
      playersPage = new PlayersPage(driver);
      playersStatsPage = new PlayersStatsPage(driver, 'batting');
      
      browser.executeForEachTab(function() {
        navbar.goToPlayersPage();
        playersStatsPage.clickTableStat(1,3);
      });   
    });  

    test.describe('#BattingSection', function() {
      var subSectionsWithReport = [
        "overview",
        "gameLog",
        "splits",
        "vsTeams",
        "vsPitchers"
      ];

      var subSectionsWithoutReport = [
        "pitchLog",
        "matchups",
        "defensivePositioning"
      ];

      subSectionsWithReport.forEach(function(subSection) {
        test.describe('#subSection: '+subSection, function() {
          test.before(function() {
            report = reports.selectRandomReport('batting');
            browser.executeForEachTab(function() {
              playerPage.goToSubSection(subSection);
              playerPage.changeReport(report);
            });
          });
          test.it('pages show the same table data', function() {
            browser.getFullContentForEachTab(playerPage.statsTable()).then(function(contentArray) {
              assert.equal( contentArray[0], contentArray[1], 'table data for Report: '+report);
            }); 
          });
        });
      });

      subSectionsWithoutReport.forEach(function(subSection) {
        test.describe('#subSection: '+subSection, function() {          
          test.before(function() {
            browser.executeForEachTab(function() {
              playerPage.goToSubSection(subSection);
            });   
          })
          test.it('pages show the same table data', function() {
            browser.getFullContentForEachTab(playerPage.statsTable()).then(function(contentArray) {
              assert.equal( contentArray[0], contentArray[1]);
            }); 
          });
        });
      });
    }); 

    test.describe('#StatcastFieldingSection', function() {
      test.before(function() {
        browser.executeForEachTab(function() {
          playerPage.goToSection('statcastFielding');
        });   
      });

      var subSectionsWithReport = [
        "overview",
        "gameLog"
      ];

      var subSectionsWithoutReport = [
        "pitchLog"
      ];

      subSectionsWithReport.forEach(function(subSection) {
        test.describe('#subSection: '+subSection, function() {
          test.before(function() {
            report = reports.selectRandomReport('playerStatcastFielding');
            browser.executeForEachTab(function() {
              playerPage.goToSubSection(subSection);
              playerPage.changeReport(report);
            });            
          })
          test.it('pages show the same table data', function() {
            browser.getFullContentForEachTab(playerPage.statsTable()).then(function(contentArray) {
              assert.equal( contentArray[0], contentArray[1], 'table data for Report: '+report);
            }); 
          });
        });
      });

      subSectionsWithoutReport.forEach(function(subSection) {
        test.describe('#subSection: '+subSection, function() {          
          test.before(function() {
            browser.executeForEachTab(function() {
              playerPage.goToSubSection(subSection);
            });   
          });

          test.it('pages show the same table data', function() { 
            browser.getFullContentForEachTab(playerPage.statsTable()).then(function(contentArray) {
              assert.equal( contentArray[0], contentArray[1]);
            }); 
          });
        });
      });
    }); 

    test.describe('#PitchingSection', function() {
      test.before(function() {
        browser.executeForEachTab(function() {
          navbar.goToPlayersPage();
          playersPage.goToSection('Pitching');
          playersStatsPage.section = 'pitching';
          playersStatsPage.clickTableStat(1,3);
          playerPage.section = 'pitching';
        });   
      });

      var subSectionsWithReport = [
        "overview",
        "gameLog",
        "splits",
        "vsTeams",
        "vsHitters"
      ];

      var subSectionsWithoutReport = [
        "pitchLog",
        "matchups"
      ];

      subSectionsWithReport.forEach(function(subSection) {
        test.describe('#subSection: '+subSection, function() {
          test.before(function() {
            report = reports.selectRandomReport('pitching');
            browser.executeForEachTab(function() {
              playerPage.goToSubSection(subSection);
              playerPage.changeReport(report);
            });            
          })
          test.it('pages show the same table data', function() {
            browser.getFullContentForEachTab(playerPage.statsTable()).then(function(contentArray) {
              assert.equal( contentArray[0], contentArray[1], 'table data for Report: '+report);
            }); 
          });
        });
      });

      subSectionsWithoutReport.forEach(function(subSection) {
        test.describe('#subSection: '+subSection, function() {          
          test.before(function() {
            browser.executeForEachTab(function() {
              playerPage.goToSubSection(subSection);
            });   
          });
          test.it('pages show the same table data', function() {
            browser.getFullContentForEachTab(playerPage.statsTable()).then(function(contentArray) {
              assert.equal( contentArray[0], contentArray[1]);
            }); 
          });
        });
      });
    }); 

    test.describe('#CatchingSection', function() {
      test.before(function() {
        browser.executeForEachTab(function() {
          navbar.goToPlayersPage();
          playersPage.goToSection('Catching');
          playersStatsPage.section = 'catching';
          playersStatsPage.clickTableStat(1,3);
          playerPage.goToSection('catching');
        });   
      });

      var subSectionsWithReport = [
        "overview",
        "gameLog"
      ];

      var subSectionsWithoutReport = [
        "pitchLog"
      ];

      subSectionsWithReport.forEach(function(subSection) {
        test.describe('#subSection: '+subSection, function() {
          test.before(function() {
            report = reports.selectRandomReport('catching');
            browser.executeForEachTab(function() {
              playerPage.goToSubSection(subSection);
              playerPage.changeReport(report);
            });            
          });
          test.it('pages show the same table data ', function() {
            browser.getFullContentForEachTab(playerPage.statsTable()).then(function(contentArray) {
              assert.equal( contentArray[0], contentArray[1], 'table data for Report: '+report);
            }); 
          });
        });
      });

      subSectionsWithoutReport.forEach(function(subSection) {
        test.describe('#subSection: '+subSection, function() {          
          test.before(function() {
            browser.executeForEachTab(function() {
              playerPage.goToSubSection(subSection);
            });   
          });
          test.it('pages show the same table data', function() {
            browser.getFullContentForEachTab(playerPage.statsTable()).then(function(contentArray) {
              assert.equal( contentArray[0], contentArray[1]);
            }); 
          });
        });
      });
    }); 
  });  

  test.describe('@Individual Umpire Page', function() {
    test.before(function() { 
      umpirePage = new UmpirePage(driver);
      browser.executeForEachTab(function() {
        navbar.goToUmpiresPage();
        umpiresPage.goToUmpirePage(1);
      });   
    }); 

    var subSectionsWithReport = [
      "overview",
      "gameLog"
    ];

    var subSectionsWithoutReport = [
      "pitchLog"
    ];

    subSectionsWithReport.forEach(function(subSection) {
      test.describe('#subSection: '+subSection, function() {
        test.before(function() {
          report = reports.selectRandomReport('umpire');
          browser.executeForEachTab(function() {
            umpirePage.goToSubSection(subSection);
            umpirePage.changeReport(report);
          });            
        });
        test.it('pages show the same table data ', function() {
          browser.getFullContentForEachTab(umpirePage.statsTable()).then(function(contentArray) {
            assert.equal( contentArray[0], contentArray[1], 'table data for Report: '+report);
          }); 
        });
      });
    });

    subSectionsWithoutReport.forEach(function(subSection) {
      test.describe('#subSection: '+subSection, function() {          
        test.before(function() {
          browser.executeForEachTab(function() {
            umpirePage.goToSubSection(subSection);
          });   
        });
        test.it('pages show the same table data', function() {
          browser.getFullContentForEachTab(umpirePage.statsTable()).then(function(contentArray) {
            assert.equal( contentArray[0], contentArray[1]);
          }); 
        });
      });
    });
  });  
});