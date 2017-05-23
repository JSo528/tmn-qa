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
// var PlayersPage = require('./pages/nfl/players/players_page.js');
// var PlayerPage = require('./pages/nfl/players/player_page.js');

// var StandingsPage = require('./pages/nfl/standings_page.js');

// var GroupsPage = require('./pages/nfl/groups/groups_page.js')
var PerformancePage = require('./pages/nfl/performance/performance_page.js')


// Instance Objects
loginPage = new LoginPage(driver);
browser = new Browser(driver);
navbar  = new Navbar(driver);
// standingsPage = new StandingsPage(driver);
// scoresPage = new ScoresPage(driver);
teamsPage = new TeamsPage(driver);
// teamPage = new TeamPage(driver);
// playersPage = new PlayersPage(driver);
filters = new Filters(driver);
// groupsPage = new GroupsPage(driver);
// performancePage = new PerformancePage(driver);
// playerPage = new PlayerPage(driver);
// gamePage = new GamePage(driver);

// Constants
// var url = "https://dodgers-staging.trumedianetworks.com:3005"
// var url = "https://angels.trumedianetworks.com:3005"
var url = 'https://opta.trumedianetworks.com/soccer/teams?pc=%7B%22sgbts%22%3A%22totals%22%2C%22ssvt%22%3A%22totals%22%7D&is=true&tp=%7B%22orderBy%22%3A%7B%22orderCols%22%3A%22Touches%22%2C%22sortOrder%22%3A%22DEFAULT%22%7D%2C%22pinnedIds%22%3A%5B%5D%7D&f=%7B%22sbp%22%3A%5B%22leftFoot%22%5D%2C%22sxg%22%3A%5B0.5%2C1%5D%2C%22sseas%22%3A%5B%225wh9ugb0hxaogfh3vu6wz7g89%22%5D%7D'

// Script
loginPage.visit(url);
loginPage.login(credentials.testUser.email, credentials.testUser.password);

teamsPage.clickSummaryTableHeaderFor('Touches');
filters.addSelectionToDropdownSidebarFilter('Body Part:', 'Left Foot');
filters.changeValuesForRangeSidebarFilter('Expected Goals:', 0.5, 1);
teamsPage.clickSummaryTableStatFor(2, 'Touches');
teamsPage.clickPlayVideoIcon(1);

browser.setTabHandles()
browser.switchToTab(1)
filters.getCurrentUrl().then(function(url) {
  console.log(url)
})

teamsPage.getVideoPlaylistFixtureInfo(1).then(function(stat) {
  console.log(stat)
})

teamsPage.getVideoPlaylistEventTimes(1).then(function(stat) {
  console.log(stat)
})

browser.driver.close();
browser.switchToTab(0)