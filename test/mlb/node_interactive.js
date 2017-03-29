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
var Navbar = require('./pages/mlb/navbar.js');
var Filters = require('./pages/mlb/filters.js');

// Teams Pages
var TeamsPage = require('./pages/mlb/teams/teams_page.js');
var TeamPage = require('./pages/mlb/teams/team_page.js');

// Scores Pages
var ScoresPage = require('./pages/mlb/scores/scores_page.js');
var DetailedScorePage = require('./pages/mlb/scores/detailed_score_page.js');

// Players Pages
var PlayersPage = require('./pages/mlb/players/players_page.js');
var PlayerPage = require('./pages/mlb/players/player_page.js');

var StandingsPage = require('./pages/mlb/standings_page.js');
var UmpiresPage = require('./pages/mlb/umpires/umpires_page.js');
var UmpirePage = require('./pages/mlb/umpires/umpire_page.js');
var GroupsPage = require('./pages/mlb/groups_page.js')


// Instance Objects
loginPage = new LoginPage(driver);
browser = new Browser(driver);
navbar  = new Navbar(driver);
standingsPage = new StandingsPage(driver);
scoresPage = new ScoresPage(driver);
detailedScorePage = new DetailedScorePage(driver);
teamsPage = new TeamsPage(driver);
playersPage = new PlayersPage(driver);
filters = new Filters(driver);
umpiresPage = new UmpiresPage(driver);
groupsPage = new GroupsPage(driver);
teamPage = new TeamPage(driver);
playerPage = new PlayerPage(driver)
umpirePage = new UmpirePage(driver)

// Constants
// var url = "https://dodgers-staging.trumedianetworks.com:3005"
// var url = "https://angels.trumedianetworks.com:3005"
var url = "https://dodgers.trumedianetworks.com/baseball/team-statcast/San%20Francisco%20Giants/137/overview/StatcastFieldingModel?is=true&f=%7B%22bgt%22%3A%5B%22reg%22%5D%2C%22bseason%22%3A%5B%222016%22%5D%7D"

// Script
loginPage.visit(url);
loginPage.login(credentials.testUser.email, credentials.testUser.password);

filters.changeValuesForDateSidebarFilter('Date Range:', '2016-4-4', '2016-4-4')

teamPage.getStatcastFieldingBallCount().then(function(count) {
  console.log(count)
})



var TeamPage = require('./pages/mlb/teams/team_page.js');
teamPage = new TeamPage(driver);
teamPage.clickStatcastFieldingPlay(1)