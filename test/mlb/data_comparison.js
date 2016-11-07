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
var LoginPage = require('../../pages/login_page.js');
var StandingsPage = require('../../pages/mlb/standings_page.js');
var ScoresPage = require('../../pages/mlb/scores_page.js');
var DetailedScorePage = require('../../pages/mlb/detailed_score_page.js');
var ScorePitchByPitch = require('../../pages/mlb/score_pitch_by_pitch_page.js');
var ScorePitchingSplitsPage = require('../../pages/mlb/score_pitching_splits_page.js');
var TeamsPage = require('../../pages/mlb/teams_page.js');
var prodUrl = constants.urls.mlb.dodgers;
var navbar, filters, standingsPage, scoresPage, detailedScorePage;

test.describe('#Data Comparison', function() {
  test.before(function() {
    navbar  = new Navbar(driver);
    filters = new Filters(driver);
    standingsPage = new StandingsPage(driver);
    scoresPage = new ScoresPage(driver);

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
      DetailedScorePage.prototype.battingReports.forEach(function(report) {
        test.it('Report: '+report+' shows the same data', function() {
          browser.executeForEachTab(function() {
            detailedScorePage.changeBattingReport(report);
          })

          browser.getFullContentForEachTab(detailedScorePage.comparsionLocator, detailedScorePage.battingLastLocator).then(function(contentArray) {
            assert.equal( contentArray[0], contentArray[1], 'data for report: '+report+' should be the same' );
          }) 
        });
      });
    })

    test.describe("#pitching reports", function() {
      test.before(function() {
        browser.executeForEachTab(function() {
          detailedScorePage.goToSection("Pitching");
        })
      })

      DetailedScorePage.prototype.pitchingReports.forEach(function(report) {
        test.it('Report: '+report+' shows the same data', function() {
          browser.executeForEachTab(function() {
            detailedScorePage.changePitchingReport(report);
          })

          browser.getFullContentForEachTab(detailedScorePage.comparsionLocator, detailedScorePage.pitchingLastLocator).then(function(contentArray) {
            assert.equal( contentArray[0], contentArray[1], 'data for report: '+report+' should be the same' );
          }) 
        });
      });
    })    

    test.describe("#pitch by pitch subsection", function() {
      test.before(function() {
        scorePitchByPitchPage = new ScorePitchByPitch(driver);
        browser.executeForEachTab(function() {
          detailedScorePage.goToSection("Pitch By Pitch");
        })
      })

      test.it('Main page shows the same data', function() {
        browser.getFullContentForEachTab(scorePitchByPitchPage.comparisonDataContainer, scorePitchByPitchPage.lastLocator)
          .then(function(contentArray) {
          assert.equal( contentArray[0], contentArray[1] );
        }) 
      });

      // TODO - this test keeps breaking in production for some reason
      // test.it('When decisive event is turned on, it should shows the same data', function() {
      //   browser.executeForEachTab(function() {
      //     scorePitchByPitchPage.addDecisiveEventFilter("yes");
      //   })

      //   browser.getFullContentForEachTab(null, scorePitchByPitchPage.lastLocator).then(function(contentArray) {
      //     assert.equal( contentArray[0], contentArray[1] );
      //   }) 
      // });       
    })    

    test.describe("#pitching splits subsection", function() {
      test.before(function() {
        scorePitchingSplitsPage = new ScorePitchingSplitsPage(driver);
        browser.executeForEachTab(function() {
          detailedScorePage.goToSection("Pitching Splits");
        })

      })

      test.it('Main page shows the same data', function() {
        browser.getFullContentForEachTab(scorePitchingSplitsPage.comparisonLocator).then(function(contentArray) {
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

      test.it('occurences & streaks shows the same data', function() {
        browser.executeForEachTab(function() {
          teamsPage.goToSubSection("Occurences & Streaks");
        })

        browser.getFullContentForEachTab(teamsPage.streaksTable).then(function(contentArray) {
          assert.equal( contentArray[0], contentArray[1] );
        })  
      });    
    })

    test.describe('#Pitching Section', function() {
      test.before(function() {
        browser.executeForEachTab(function() {
          teamsPage.goToSection("Pitching");
        })   
      });

      test.it('main page shows the same data', function() {
        browser.getFullContentForEachTab(teamsPage.statsTable).then(function(contentArray) {
          assert.equal( contentArray[0], contentArray[1] );
        })  
      });

      test.it('occurences & streaks shows the same data', function() {
        browser.executeForEachTab(function() {
          teamsPage.goToSubSection("Occurences & Streaks");
        })

        browser.getFullContentForEachTab(teamsPage.streaksTable).then(function(contentArray) {
          assert.equal( contentArray[0], contentArray[1] );
        })  
      });    
    }) 

    test.describe('#Catching Section', function() {
      test.before(function() {
        browser.executeForEachTab(function() {
          teamsPage.goToSection("Catching");
        })   
      });

      test.it('main page shows the same data', function() {
        browser.getFullContentForEachTab(teamsPage.statsTable).then(function(contentArray) {
          assert.equal( contentArray[0], contentArray[1] );
        })  
      });

      test.it('occurences & streaks shows the same data', function() {
        browser.executeForEachTab(function() {
          teamsPage.goToSubSection("Occurences & Streaks");
        })

        browser.getFullContentForEachTab(teamsPage.streaksTable, teamsPage.streaksTable).then(function(contentArray) {
          assert.equal( contentArray[0], contentArray[1] );
        })  
      });    
    }) 

    test.describe('#Statcast Fielding Section', function() {
      test.before(function() {
        browser.executeForEachTab(function() {
          teamsPage.goToSection("Statcast Fielding");
        })   
      });

      test.it('main page shows the same data', function() {
        browser.getFullContentForEachTab(teamsPage.statsTable).then(function(contentArray) {
          assert.equal( contentArray[0], contentArray[1] );
        })  
      });

      test.it('occurences & streaks shows the same data', function() {
        browser.executeForEachTab(function() {
          teamsPage.goToSubSection("Occurences & Streaks");
        })

        browser.getFullContentForEachTab(teamsPage.streaksTable, teamsPage.streaksTable).then(function(contentArray) {
          assert.equal( contentArray[0], contentArray[1] );
        })  
      });    
    })     
  })
});