var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var extensions = require('../../../lib/extensions.js');

// Page Objects
var Navbar = require('../../../pages/nfl/navbar.js');
var Filters = require('../../../pages/nfl/filters.js');
var PlayersPage = require('../../../pages/nfl/teams/players_page.js');
var PlayerPage = require('../../../pages/nfl/teams/player_page.js');
var navbar, filters, playersPage, playerPage;

test.describe('#Page: Player', function() {
  test.it('navigating to teams page', function() {
    navbar = new Navbar(driver);
    filters = new Filters(driver);
    playersPage = new PlayersPage(driver);
    playerPage = new PlayerPage(driver);
    
    navbar.goToPlayersPage();
    filters.changeValuesForSeasonWeekDropdownFilter(2016, 'W1', 2016, 'W17', true);

    playersPage.clickStatsTableStat(1,1); // should click into Matt Ryan Link
  });

  // Overview Section
  test.describe("#Subsection: Overview", function() {
    test.describe('#seasonsSection', function() {
      test.it('table shows correct information', function() {
        playerPage.getOverviewSeasonTableStat(1, 'type').then(function(stat) {
          assert.equal(stat, 'PLY');
        });

        playerPage.getOverviewSeasonTableStat(1, 'psYds').then(function(stat) {
          assert.equal(stat, '1014');
        });
      });  

      // Video Playlist
      test.describe("#videoPlaylist", function() {
        test.it('clicking a table stat should open Pop up Play by Play modal', function() {
          playerPage.clickOverviewTableStatFor(1,'PsYds');
          playerPage.getPossessionHeaderText(1).then(function(text) {
            assert.equal(text, '  Falcons Ball Starting At 12:16 At The ATL 8');
          });
        });

        test.it('1st play in Play by Play modal should have the correct ballposition info', function() {
          playerPage.getPossessionPlayText(1,2).then(function(text) {
            assert.equal(text, 'ATL 48');
          });
        });

        test.it('1st play in Flat View section should have the correct PlayYardsGain stat', function() {
          playerPage.clickFlatViewTab();
          playerPage.getFlatViewPlayText(1,6).then(function(stat) {
            assert.equal(stat, 37);
          });
        });

        test.it('clicking video icon should open up video modal', function() {
          playerPage.clickByPossessionTab();
          playerPage.clickByPossessionPlayVideoIcon(1);
          playerPage.getVideoPlaylistText(1,1).then(function(text) {
            assert.equal(text, "1st & 10 ATL 43");
          });
        });

        test.it('closing modals', function() {
          playerPage.closeVideoPlaylistModal();
          playerPage.closePlayByPlayModal();
        });
      });      
    });

    test.describe('#resultSection', function() {
      test.it('table shows correct information', function() {
        playerPage.getOverviewResultTableStat(1, 'stats').then(function(stat) {
          assert.equal(stat, '1 GS, 69.2% Comp%, 334 PsYds, 2 PsTD, 0 Int');
        });
      });
    });

    test.describe('#rankSection', function() {
      test.it('table shows correct information', function() {
        playerPage.getOverviewRankTableStat(1, 'number').then(function(stat) {
          assert.equal(stat, 13);
        });

        playerPage.getOverviewRankTableStat(1, 'Div Rank').then(function(stat) {
          assert.equal(stat, 1);
        });
      });
    });
  });

  // Game Log Section
  test.describe("#Subsection: Game Log", function() {

  });

  // Performane Log Section
  test.describe("#Subsection: Performance Log", function() {

  });

  // Play By Play Section
  test.describe("#Subsection: Play By Play", function() {

  });

  // Occurrences & Streaks Section
  test.describe("#Subsection: Occurrences & Streaks", function() {

  });

  // Splits Section
  test.describe("#Subsection: Splits", function() {

  });

  // Multi-Filter Section
  test.describe("#Subsection: Multi-Filter", function() {

  });

  // Punting Section
  test.describe("#Subsection: Punting", function() {

  });

  // Kicking Section
  test.describe("#Subsection: Kicking", function() {

  });

  // Alignment Section
  test.describe("#Subsection: Alignment", function() {

  });
});