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
var TeamsPage = require('./pages/nfl/teams/teams_page.js');
var TeamPage = require('./pages/nfl/teams/team_page.js');

// Scores Pages
var ScoresPage = require('./pages/nfl/scores/scores_page.js');

// Players Pages
var PlayersPage = require('./pages/nfl/players/players_page.js');

var StandingsPage = require('./pages/nfl/standings_page.js');

var GroupsPage = require('./pages/nfl/groups/groups_page.js')
var PerformancePage = require('./pages/nfl/performance/performance_page.js')


// Instance Objects
loginPage = new LoginPage(driver);
browser = new Browser(driver);
navbar  = new Navbar(driver);
standingsPage = new StandingsPage(driver);
scoresPage = new ScoresPage(driver);
teamsPage = new TeamsPage(driver);
teamPage = new TeamPage(driver);
playersPage = new PlayersPage(driver);
filters = new Filters(driver);
groupsPage = new GroupsPage(driver);
performancePage = new PerformancePage(driver);


// Constants
// var url = "https://dodgers-staging.trumedianetworks.com:3005"
// var url = "https://angels.trumedianetworks.com:3005"
var url = "https://49ers.analytics.trumedianetworks.com/football/team-presnap-premium/49ers/4500/nfl?is=true&f=%7B%22fgt%22%3A%5B%22regular%22%5D%2C%22fswr%22%3A%7B%22fromSeason%22%3A%222016%22%2C%22fromWeek%22%3A%221%22%2C%22toSeason%22%3A%222016%22%2C%22toWeek%22%3A%2217%22%7D%7D"

// Script
loginPage.visit(url);
loginPage.login(credentials.testUser.email, credentials.testUser.password);

var locator = By.css('#sliderBar');

filters.clickOffset(locator, 0, -100)