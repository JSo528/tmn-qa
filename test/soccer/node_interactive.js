var webdriver = require('selenium-webdriver');
driver = new webdriver.Builder().withCapabilities({'browserName': 'chrome'}).build();
var credentials = require('./lib/credentials.js');
var By = webdriver.By;
var Until = webdriver.until;
var Key = require('selenium-webdriver').Key;
var extensions = require('./lib/extensions.js')

// Page Objects
var LoginPage = require('./pages/login_page.js');
var Browser = require('./pages/base/browser.js');
var Navbar = require('./pages/soccer/navbar.js');
var Filters = require('./pages/soccer/filters.js');

// Teams Pages
var TablePage = require('./pages/soccer/tables/table_page.js');
var TeamsPage = require('./pages/soccer/teams/teams_page.js');
var TeamPage = require('./pages/soccer/teams/team_page.js');

// Scores Pages
// var ScoresPage = require('./pages/nfl/scores/scores_page.js');
// var GamePage = require('./pages/nfl/scores/game_page.js');
// Players Pages
var PlayersPage = require('./pages/soccer/players/players_page.js');
// var PlayerPage = require('./pages/nfl/players/player_page.js');

// var StandingsPage = require('./pages/nfl/standings_page.js');


// Instance Objects
loginPage = new LoginPage(driver);
browser = new Browser(driver);
navbar  = new Navbar(driver);
// standingsPage = new StandingsPage(driver);
// scoresPage = new ScoresPage(driver);
tablePage = new TablePage(driver);
teamsPage = new TeamsPage(driver);
teamPage = new TeamPage(driver);
playersPage = new PlayersPage(driver);
filters = new Filters(driver);
// groupsPage = new GroupsPage(driver);
// performancePage = new PerformancePage(driver);
// playerPage = new PlayerPage(driver);
// gamePage = new GamePage(driver);

// Constants
// var url = "https://dodgers-staging.trumedianetworks.com:3005"
// var url = "https://angels.trumedianetworks.com:3005"
var url = 'https://opta.trumedianetworks.com/soccer/team-bins/Barcelona/agh9ifb2mw3ivjusgedj7c3fe/comps?f=%7B%22fsocgc%22%3A%5B75%2C90%5D%2C%22sseas%22%3A%5B%22cwvi5sjj1g45lgguatu0vjrhl%22%5D%7D&is=true'

// Script
loginPage.visit(url);
loginPage.login(credentials.testUser.email, credentials.testUser.password);

teamPage.clickPassZoneMainBlock(1);

teamPage.clickDrillDownBlock(3);