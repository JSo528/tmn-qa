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
var Navbar = require('./pages/nfl/navbar.js');
var Filters = require('./pages/nfl/filters.js');

// Teams Pages
var TeamsPage = require('./pages/soccer/teams/teams_page.js');
// var TeamPage = require('./pages/nfl/teams/team_page.js');

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
teamsPage = new TeamsPage(driver);
// teamPage = new TeamPage(driver);
playersPage = new PlayersPage(driver);
filters = new Filters(driver);
// groupsPage = new GroupsPage(driver);
// performancePage = new PerformancePage(driver);
// playerPage = new PlayerPage(driver);
// gamePage = new GamePage(driver);

// Constants
// var url = "https://dodgers-staging.trumedianetworks.com:3005"
// var url = "https://angels.trumedianetworks.com:3005"
var url = 'https://opta.trumedianetworks.com/soccer/players/discipline?pc=%7B%22sgbps%22%3A%22totals%22%2C%22ssvp%22%3A%22totals%22%7D&is=true&tp=%7B%22orderBy%22%3A%7B%22orderCols%22%3A%22FoulSuf%22%2C%22sortOrder%22%3A%22DEFAULT%22%7D%2C%22pinnedIds%22%3A%5B%229ikkppq7uewf36gahgz0kzaol%22%2C%22exiribcpg9vnuq9ekhlk74dlh%22%5D%7D&f=%7B%22sdr%22%3A%5B%222016-01-01%22%2C%222016-10-01%22%5D%2C%22sseas%22%3A%5B%225wh9ugb0hxaogfh3vu6wz7g89%22%5D%2C%22sven%22%3A%5B%22home%22%5D%7D'

// Script
loginPage.visit(url);
loginPage.login(credentials.testUser.email, credentials.testUser.password);

playersPage.clickChartColumnsBtn();
playersPage.openScatterChart(9,12);