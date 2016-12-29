var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var constants = require('../../lib/constants.js');

// Page Objects
var Navbar = require('../../pages/nfl/navbar.js');
var StandingsPage = require('../../pages/nfl/standings_page.js');
var TeamsPage = require('../../pages/nfl/teams/teams_page.js');
var TeamPage = require('../../pages/nfl/teams/team_page.js');
var PlayersPage = require('../../pages/nfl/players/players_page.js');
var PlayerPage = require('../../pages/nfl/players/player_page.js');
var ScorePage = require('../../pages/nfl/scores/score_page.js');
var standingsPage, teamsPage, teamPage, playersPage, playerPage, scorePage, navbar;

test.describe('#Page: All Pages Tests', function() {
  test.before(function() {
    navbar  = new Navbar(driver);
    standingsPage = new StandingsPage(driver);
    teamsPage = new TeamsPage(driver);
    teamPage = new TeamPage(driver);
    playersPage = new PlayersPage(driver);
    playerPage = new PlayerPage(driver);
    scorePage = new ScorePage(driver);
  });

  test.it('Standings Page', function() {
    navbar.goToStandingsPage();

    driver.getTitle().then(function(title) {
      assert.equal(title, 'Standings', 'Page Title');
    });
  });

  test.describe('#Teams Section', function() {
    test.it('navigating to teams section', function() {
      navbar.goToTeamsPage();
    });

    var sections = [
      { name: 'Stats', title: 'Team Sortables - Stats' },
      { name: 'Comps', title: 'Team Sortables - Comps' },
      { name: 'Occurrences & Streaks', title: 'Team Sortables - Streaks' },
      { name: 'Play By Play', title: 'Team Sortables - Play By Play' },
      { name: 'Pass Grid', title: '' },
      { name: 'Scatter Plot', title: '' },
      { name: 'Draft', title: 'Team Draft' },
      { name: 'Transactions', title: 'Teams Transactions' },
      { name: 'Salaries', title: 'Teams Salaries' },
      { name: 'Practice Squad', title: 'Practice Squad' },
      { name: 'NCAAF FPI', title: 'Team Sortables - NCAAF FPI' },
      { name: 'NCAAF Projections', title: 'Team Sortables - NCAAF Projections' },
      { name: 'NCAAF Resume', title: 'Team Sortables - NCAAF Resume' },
      { name: 'NCAAF Tale of Tape', title: 'Team Sortables - Tale of the Tape' },
    ];

    sections.forEach(function(section) {
      test.it(section.name + ' page', function() {
        teamsPage.goToSection(section.name)
        driver.sleep(100);
        driver.getTitle().then(function(title) {
          assert.equal(title, section.title, 'Page Title');
        });
      });  
    });
  });

  test.describe('#Team Section', function() {
    test.it('navigating to team section', function() {
      browser.visit(url+"/football/team/South%20Florida/7376/ncaa");
    });

    var sections = [
      { name: 'Overview', title: 'Team' },
      { name: 'Summary', title: 'Team Summary' },
      { name: 'Game Log', title: 'Team Game Log' },
      { name: 'Play By Play', title: 'Team Play By Play' },
      { name: 'Occurrences & Streaks', title: 'Team Streaks' },
      { name: 'Splits', title: 'Team Splits' },
      { name: 'Roster', title: 'Team Roster' },
      { name: 'Pass Plot', title: '' },
      { name: 'Pass Grid', title: '' },
      { name: 'Salaries', title: 'Team Salaries' },
      { name: 'FPI', title: 'FPI' },
      { name: 'Projections', title: 'Team Sortables - NCAAF Projections' },
      { name: 'Resume', title: 'Team Sortables - NCAAF Resume' },
      { name: 'Multi-Filter', title: 'Team Multi-Filter' },
      
    ];

    sections.forEach(function(section) {
      test.it(section.name + ' page', function() {
        teamPage.goToSection(section.name)
        driver.sleep(100);
        driver.getTitle().then(function(title) {
          assert.equal(title, section.title, 'Page Title');
        });
      });  
    });
  });
  
  test.describe('#Players Section', function() {
    test.it('navigating to players section', function() {
      navbar.goToPlayersPage();
    });

    var sections = [
      { name: 'Stats', title: 'Player Sortables - Stats' },
      { name: 'Occurrences & Streaks', title: 'Player Sortables - Streaks' },
      { name: 'Scatter Plot', title: '' },
      { name: 'Free Agents', title: 'Free Agents' },
      { name: 'Salaries', title: 'Players Salaries' },
    ];

    sections.forEach(function(section) {
      test.it(section.name + ' page', function() {
        playersPage.goToSection(section.name)
        driver.sleep(100);
        driver.getTitle().then(function(title) {
          assert.equal(title, section.title, 'Page Title');
        });
      });  
    });
  });
  
  test.describe('#Player Section', function() {
    test.it('navigating to player section', function() {
      browser.visit(url+"/football/player/Baker%20Mayfield/3052587/ncaa");
    });

    var sections = [
      { name: 'Overview', title: 'Player' },
      { name: 'Game Log', title: 'Player Game Log' },
      { name: 'Play By Play', title: 'Player Play By Play' },
      { name: 'Occurrences & Streaks', title: 'Player Streaks' },
      { name: 'Splits', title: 'Player Splits' },
      { name: 'Pass Plot', title: '' },
      { name: 'Pass Grid', title: '' },
      { name: 'Multi-Filter', title: 'Player Multi-Filter' },
      { name: 'Salary', title: 'Player Salary' },
      
    ];

    sections.forEach(function(section) {
      test.it(section.name + ' page', function() {
        playerPage.goToSection(section.name)
        driver.sleep(100);
        driver.getTitle().then(function(title) {
          assert.equal(title, section.title, 'Page Title');
        });
      });  
    });
  }); 

  test.describe('#Scores Section', function() {
    test.it('navigating to scores section', function() {
      this.timeout(120000)
      navbar.goToScoresPage();
      driver.sleep(100);
      driver.getTitle().then(function(title) {
        assert.equal(title, 'Scores', 'Page Title');
      });
    });
  });
  
  test.describe('#Score Section', function() {
    test.it('navigating to player section', function() {
      browser.visit(url+"/football/game/Vanderbilt-Tennessee/2016-11-26/4131302/ncaa");
    });

    var sections = [
      { name: 'Box Score', title: 'Game - Box Score' },
      { name: 'Team Summary', title: 'Game - Team Summary' },
      { name: 'Play By Play', title: 'Game - Play By Play' },
      { name: 'Drives', title: 'Game - Drives' },
      { name: 'Charts', title: 'Game - Charts' },
      { name: 'AP Season Tonight', title: 'Game - AP Season Tonight' },
    ];

    sections.forEach(function(section) {
      test.it(section.name + ' page', function() {
        scorePage.goToSection(section.name)
        driver.sleep(100);
        driver.getTitle().then(function(title) {
          assert.equal(title, section.title, 'Page Title');
        });
      });  
    });
  }); 

  test.describe('#Groups Section', function() {
    test.it('navigating to groups section', function() {
      navbar.goToGroupsPage();
      driver.sleep(100);
      driver.getTitle().then(function(title) {
        assert.equal(title, 'Group Stats', 'Page Title');
      });
    });
  });
});