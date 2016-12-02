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

var TeamsPage = require('../../pages/mlb/teams/teams_page.js');
var TeamPage = require('../../pages/mlb/teams/team_page.js');

var PlayerPage = require('../../pages/mlb/players/player_page.js');

var UmpiresPage = require('../../pages/mlb/umpires/umpires_page.js');
var UmpirePage = require('../../pages/mlb/umpires/umpire_page.js');

var prodUrl = constants.urls.mlb.dodgers;
var navbar, filters, standingsPage, scoresPage, detailedScorePage, umpiresPage, 
  teamPage, playersPage, playerPage, umpirePage;
var reports, report;


test.describe('#DataComparison', function() {
  this.timeout(120000);
  test.before(function() {
    navbar  = new Navbar(driver);
    filters = new Filters(driver);
    standingsPage = new StandingsPage(driver);
    scoresPage = new ScoresPage(driver);
    umpiresPage = new UmpiresPage(driver);
    reports = new Reports(driver);

    browser.visit(url);
    browser.openNewTab(prodUrl).then(function() {
      browser.switchToTab(1);  
    })
    
    loginPage = new LoginPage(driver);
    loginPage.login(credentials.testUser.email, credentials.testUser.password);
  });

  test.describe('@Standings Page', function() {
    test.it('standings page shows the same data', function() {
      browser.executeForEachTab(function() {
        navbar.goToStandingsPage();
      });
      
      browser.getFullContentForEachTab(standingsPage.comparisonLocator, standingsPage.lastLocator).then(function(contentArray) {
        var stagData = contentArray[0];
        var prodData = contentArray[1];
        assert.equal( stagData, prodData, 'main data should be the same');
      })  
    });

    test.it('standings page shows the same data for 2015', function() {
      browser.executeForEachTab(function() {
        standingsPage.changeYear(2015);
      });

      browser.getFullContentForEachTab(standingsPage.comparisonLocator, standingsPage.lastLocator).then(function(contentArray) {
        assert.equal( contentArray[0], contentArray[1], '2015 data should be the same' );
      })  
    })

    test.it('standings page shows the same data for AAA', function() {
      browser.executeForEachTab(function() {
        standingsPage.changeSeasonLevel("AAA");
      });

      browser.getFullContentForEachTab(standingsPage.comparisonLocator, standingsPage.lastLocator).then(function(contentArray) {
        assert.equal( contentArray[0], contentArray[1], 'AAA data should be the same' );
      })  
    })  
  })

  test.describe('@Scores Page', function() {
    test.before(function() {
      browser.executeForEachTab(function() {
        navbar.goToScoresPage();
      })
    });

    test.it('scores page shows the same data', function() {
      browser.getFullContentForEachTab(scoresPage.comparisonLocator, scoresPage.lastLocator).then(function(contentArray) {
        assert.equal( contentArray[0], contentArray[1], 'main data should be the same' );
      })  
    });

    test.it('scores page shows the same data for 2016-5-1', function() {
      browser.executeForEachTab(function() {
        scoresPage.changeDate('2016-5-1');
      })
        
      browser.getFullContentForEachTab(scoresPage.comparisonLocator, scoresPage.lastLocator).then(function(contentArray) {
        assert.equal( contentArray[0], contentArray[1], '2016-5-1 data should be the same' );
      })  
    });    

    test.it('scores page shows the same data for AAA', function() {
      browser.executeForEachTab(function() {
        scoresPage.changeSeasonLevel('AAA');
      })
      browser.getFullContentForEachTab(scoresPage.comparisonLocator, scoresPage.lastLocator).then(function(contentArray) {
        assert.equal( contentArray[0], contentArray[1], 'AAA data should be the same' );
      })  
    });        
  })

  test.describe('@Detailed Scores Page', function() {
    test.before(function() {
      detailedScorePage = new DetailedScorePage(driver);
      browser.executeForEachTab(function() {
        scoresPage.clickBoxScore(1);
      })
    })

    test.it('detailed scores page shows the same data', function() {
      browser.getFullContentForEachTab(detailedScorePage.comparsionLocator, detailedScorePage.lastLocator).then(function(contentArray) {
        assert.equal( contentArray[0], contentArray[1], 'main data should be the same' );
      })        
    });

    test.describe("#batting reports", function() {
      test.before(function() {
        report = reports.selectRandomReport('batting');
      });

      test.it('pages shows the same data', function() {
        browser.executeForEachTab(function() {
          detailedScorePage.changeBattingReport(report);
        })

        browser.getFullContentForEachTab(detailedScorePage.comparsionLocator, detailedScorePage.battingLastLocator).then(function(contentArray) {
          assert.equal( contentArray[0], contentArray[1], 'data for report: '+report );
        }) 
      });
    })

    test.describe("#pitching reports", function() {
      test.before(function() {
        report = reports.selectRandomReport('pitching');
        browser.executeForEachTab(function() {
          detailedScorePage.goToSection("pitching");
        })
      })

      test.it('pages shows the same data', function() {
        browser.executeForEachTab(function() {
          detailedScorePage.changePitchingReport(report);
        })

        browser.getFullContentForEachTab(detailedScorePage.comparsionLocator, detailedScorePage.pitchingLastLocator).then(function(contentArray) {
          assert.equal( contentArray[0], contentArray[1], 'data for report: '+report+' should be the same' );
        }) 
      });
    });    

    test.describe("#pitch by pitch subsection", function() {
      test.before(function() {
        browser.executeForEachTab(function() {
          detailedScorePage.goToSection("pitchByPitch");
        })
      })

      test.it('Main page shows the same data', function() {
        browser.getFullContentForEachTab(detailedScorePage.comparisonDataContainer, detailedScorePage.lastLocator)
          .then(function(contentArray) {
          assert.equal( contentArray[0], contentArray[1] );
        }) 
      });

      // TODO - this test keeps breaking in production for some reason
      // test.it('When decisive event is turned on, it should shows the same data', function() {
      //   browser.executeForEachTab(function() {
      //     detailedScorePage.addDecisiveEventFilter("yes");
      //   })

      //   browser.getFullContentForEachTab(null, detailedScorePage.lastLocator).then(function(contentArray) {
      //     assert.equal( contentArray[0], contentArray[1] );
      //   }) 
      // });       
    })    

    test.describe("#pitching splits subsection", function() {
      test.before(function() {
        browser.executeForEachTab(function() {
          detailedScorePage.goToSection("pitchingSplits");
        })

      })

      test.it('Main page shows the same data', function() {
        browser.getFullContentForEachTab(detailedScorePage.comparisonLocator).then(function(contentArray) {
          assert.equal( contentArray[0], contentArray[1] );
        }) 
      });    
    })        
  });

  test.describe('@Teams Page', function() {
    test.before(function() {
      teamsPage = new TeamsPage(driver);
      browser.executeForEachTab(function() {
        navbar.goToTeamsPage();
      })   
    });

    test.describe('#Batting Section', function() {
      test.it('main page shows the same data', function() {
        browser.getFullContentForEachTab(teamsPage.statsTable).then(function(contentArray) {
          assert.equal( contentArray[0], contentArray[1] );
        })  
      });  
    });

    test.describe('#Pitching Section', function() {
      test.before(function() {
        browser.executeForEachTab(function() {
          teamsPage.goToSection("pitching");
        });
      });

      test.it('main page shows the same data', function() {
        browser.getFullContentForEachTab(teamsPage.statsTable).then(function(contentArray) {
          assert.equal( contentArray[0], contentArray[1] );
        })  
      });
    });

    test.describe('#Catching Section', function() {
      test.before(function() {
        browser.executeForEachTab(function() {
          teamsPage.goToSection("catching");
        })   
      });

      test.it('main page shows the same data', function() {
        browser.getFullContentForEachTab(teamsPage.statsTable).then(function(contentArray) {
          assert.equal( contentArray[0], contentArray[1] );
        })  
      });  
    }); 

    test.describe('#Statcast Fielding Section', function() {
      test.before(function() {
        browser.executeForEachTab(function() {
          teamsPage.goToSection("statcastFielding");
        })   
      });

      test.it('main page shows the same data', function() {
        browser.getFullContentForEachTab(teamsPage.statsTable).then(function(contentArray) {
          assert.equal( contentArray[0], contentArray[1] );
        })  
      });   
    });     
  });

  test.describe('@Umpires Page', function() {
    test.before(function() {
      browser.executeForEachTab(function() {
        navbar.goToUmpiresPage();
      })   
    });

    test.describe('#Stats Section', function() {
      test.it('main page shows the same data', function() {
        browser.getFullContentForEachTab(umpiresPage.statsTable).then(function(contentArray) {
          assert.equal( contentArray[0], contentArray[1] );
        });
      });
    });

    test.describe("#umpire reports", function() {
      test.before(function() {
        report = reports.selectRandomReport('umpire');
        browser.executeForEachTab(function() {
          umpiresPage.changeReport(report);
        });
      });
      test.it('pages show the same table data', function() {
        browser.getFullContentForEachTab(umpiresPage.statsTable).then(function(contentArray) {
          assert.equal( contentArray[0], contentArray[1], 'table data for Report: '+report);
        }); 
      });
    }); 
  }); 

  test.describe('@Individual Team Page', function() {
    test.before(function() {
      teamPage = new TeamPage(driver);
      browser.executeForEachTab(function() {
        navbar.goToTeamsPage();
        teamsPage.clickTeamTableCell(1,3);
      });   
    });

    test.describe('#BattingSection', function() {
      var subSectionsWithReport = [
        "gameLog",
        "splits",
        "vsTeams",
        "vsPitchers",
        "overview"
      ];

      var subSectionsWithoutReport = [
        "pitchLog",
        "matchups"
      ];

      subSectionsWithoutReport.forEach(function(subSection) {
        test.describe('#subSection: '+subSection, function() {          
          test.before(function() {
            browser.executeForEachTab(function() {
              teamPage.goToSubSection(subSection);
            });   
          })
          test.it('pages show the same table data', function() {
            browser.getFullContentForEachTab(teamPage.statsTable()).then(function(contentArray) {
              assert.equal( contentArray[0], contentArray[1]);
            }); 
          });
        });

        subSectionsWithReport.forEach(function(subSection) {
          test.describe('#subSection: '+subSection, function() {
            test.before(function() {
              report = reports.selectRandomReport('batting');
              browser.executeForEachTab(function() {
                teamPage.goToSubSection(subSection);
                teamPage.changeReport(report);
              });
            });
            test.it('pages show the same table data', function() {
              browser.getFullContentForEachTab(teamPage.statsTable()).then(function(contentArray) {
                assert.equal( contentArray[0], contentArray[1], 'table data for Report: '+report);
              }); 
            });
          });
        });        
      });

      test.describe('#subSection: roster', function() {
        test.before(function() {
          report = reports.selectRandomReport('batting');
          browser.executeForEachTab(function() {
            teamPage.goToSubSection('roster');
            teamPage.changeReport(report);
          });   
        });

        test.it('pages show the same table data', function() {
          browser.getFullContentForEachTab(teamPage.statsTable()).then(function(contentArray) {
            assert.equal( contentArray[0], contentArray[1], 'table data for Report: '+report);
          }); 
        });

        test.describe('#Currently On Team', function() {
          test.before(function() {
            browser.executeForEachTab(function() {
              teamPage.changeOnTeamDropdown('Currently On Team');
            });   
          });

          test.it('pages show the same table data', function() {
            browser.getFullContentForEachTab(teamPage.statsTable()).then(function(contentArray) {
              assert.equal( contentArray[0], contentArray[1] );
            }); 
          });
        });
      });
    }); 

    test.describe('#PitchingSection', function() {
      test.before(function() {
        browser.executeForEachTab(function() {
          teamPage.goToSection('pitching');
        });
      });

      var subSectionsWithReport = [
        "roster",
        "gameLog",
        "splits",
        "vsTeams",
        "vsHitters",
        "overview"
      ];

      var subSectionsWithoutReport = [
        "pitchLog",
        "matchups",
      ];
      
      subSectionsWithoutReport.forEach(function(subSection) {
        test.describe('#subSection: '+subSection, function() {          
          test.before(function() {
            browser.executeForEachTab(function() {
              teamPage.goToSubSection(subSection);
            });   
          })
          test.it('pages show the same table data', function() {
            browser.getFullContentForEachTab(teamPage.statsTable()).then(function(contentArray) {
              assert.equal( contentArray[0], contentArray[1]);
            }); 
          });
        });
      });      
      subSectionsWithReport.forEach(function(subSection) {
        test.describe('#subSection: '+subSection, function() {
          test.before(function() {
            report = reports.selectRandomReport('pitching');
            browser.executeForEachTab(function() {
              teamPage.goToSubSection(subSection);
              teamPage.changeReport(report);
            });
          });
          test.it('pages show the same table data', function() {
            browser.getFullContentForEachTab(teamPage.statsTable()).then(function(contentArray) {
              assert.equal( contentArray[0], contentArray[1], 'table data for Report: '+report);
            }); 
          });
        });
      });
    }); 

    test.describe('#CatchingSection', function() {
      test.before(function() {
        browser.executeForEachTab(function() {
          teamPage.goToSection('catching');
        });
      });

      var subSectionsWithReport = [
        "roster",
        "gameLog",
        "overview",
      ];

      var subSectionsWithoutReport = [
        "pitchLog",
      ];

      subSectionsWithoutReport.forEach(function(subSection) {
        test.describe('#subSection: '+subSection, function() {          
          test.before(function() {
            browser.executeForEachTab(function() {
              teamPage.goToSubSection(subSection);
            });   
          })
          test.it('pages show the same table data', function() {
            browser.getFullContentForEachTab(teamPage.statsTable()).then(function(contentArray) {
              assert.equal( contentArray[0], contentArray[1]);
            }); 
          });
        });
      });

      subSectionsWithReport.forEach(function(subSection) {
        test.describe('#subSection: '+subSection, function() {
          test.before(function() {
            report = reports.selectRandomReport('catching');
            browser.executeForEachTab(function() {
              teamPage.goToSubSection(subSection);
              teamPage.changeReport(report);
            });
          });
          test.it('pages show the same table data', function() {
            browser.getFullContentForEachTab(teamPage.statsTable()).then(function(contentArray) {
              assert.equal( contentArray[0], contentArray[1], 'table data for Report: '+report);
            }); 
          });
        });
      });      
    }); 
   
    test.describe('#StatcastFieldingSection', function() {
      test.before(function() {
        browser.executeForEachTab(function() {
          teamPage.goToSection('statcastFielding');
        });
      });

      var subSectionsWithReport = [
        "roster",
        "gameLog",
        "overview"
      ];

      var subSectionsWithoutReport = [
        "pitchLog"
      ];
      
      subSectionsWithoutReport.forEach(function(subSection) {
        test.describe('#subSection: '+subSection, function() {          
          test.before(function() {
            browser.executeForEachTab(function() {
              teamPage.goToSubSection(subSection);
            });   
          })
          test.it('pages show the same table data', function() {
            browser.getFullContentForEachTab(teamPage.statsTable()).then(function(contentArray) {
              assert.equal( contentArray[0], contentArray[1]);
            }); 
          });
        });
      });

      subSectionsWithReport.forEach(function(subSection) {
        test.describe('#subSection: '+subSection, function() {
          test.before(function() {
            report = reports.selectRandomReport('teamStatcastFielding');
            browser.executeForEachTab(function() {
              teamPage.goToSubSection(subSection);
              teamPage.changeReport(report);
            });
          });
          test.it('pages show the same table data', function() {
            browser.getFullContentForEachTab(teamPage.statsTable()).then(function(contentArray) {
              assert.equal( contentArray[0], contentArray[1], 'table data for Report: '+report);
            }); 
          });
        });
      });
    });    
  });

  test.describe('@Individual Player Page', function() {
    test.before(function() { 
      playerPage = new PlayerPage(driver);
      
      browser.executeForEachTab(function() {
        navbar.search('Mookie Betts', 1);
      });   
    });  

    test.describe('#BattingSection', function() {
      var subSectionsWithReport = [
        "gameLog",
        "splits",
        "vsTeams",
        "vsPitchers",
        "overview",
      ];

      var subSectionsWithoutReport = [
        "pitchLog",
        "matchups",
        "defensivePositioning"
      ];

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

  
    }); 

    test.describe('#StatcastFieldingSection', function() {
      test.before(function() {
        browser.executeForEachTab(function() {
          playerPage.goToSection('playerStatcastFielding');
        });   
      });

      var subSectionsWithReport = [
        "gameLog",
        "overview"
      ];

      var subSectionsWithoutReport = [
        "pitchLog"
      ];

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
    }); 

    test.describe('#PitchingSection', function() {
      test.before(function() {
        browser.executeForEachTab(function() {
          navbar.search('Corey Kluber', 1);
          playerPage.section = 'pitching';
        });   
      });

      var subSectionsWithReport = [
        "gameLog",
        "splits",
        "vsTeams",
        "vsHitters",
        "overview"
      ];

      var subSectionsWithoutReport = [
        "pitchLog",
        "matchups"
      ];

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
    }); 

    test.describe('#CatchingSection', function() {
      test.before(function() {
        browser.executeForEachTab(function() {
          navbar.search('Buster Posey', 1);
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