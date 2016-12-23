var webdriver = require('selenium-webdriver');
driver = new webdriver.Builder().withCapabilities({'browserName': 'chrome'}).build();
var credentials = require('../lib/credentials.js');
var By = webdriver.By;
var Until = webdriver.until;
var Key = require('selenium-webdriver').Key;

// Page Objects
var LoginPage = require('./pages/login_page.js');
var Browser = require('../pages/base/browser.js');
var Navbar = require('../pages/mlb/navbar.js');
var Filters = require('../pages/mlb/filters.js');

// Teams Pages
var TeamsPage = require('../pages/mlb/teams/teams_page.js');
var TeamPage = require('../pages/mlb/teams/team_page.js');

// Scores Pages
var ScoresPage = require('../pages/mlb/scores/scores_page.js');
var DetailedScorePage = require('../pages/mlb/scores/detailed_score_page.js');

// Players Pages
var PlayersPage = require('../pages/mlb/players/players_page.js');
var PlayerPage = require('../pages/mlb/players/player_page.js');

var StandingsPage = require('../pages/mlb/standings_page.js');
var UmpiresPage = require('../pages/mlb/umpires/umpires_page.js');
var UmpirePage = require('../pages/mlb/umpires/umpire_page.js');
var GroupsPage = require('../pages/mlb/groups_page.js')


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
var url = "https://dodgers.trumedianetworks.com/baseball/team-pitch-log-catching/TEX/140?pc=%7B%22bged%22%3A%22no%22%2C%22btbyto%22%3A%22team%22%7D&is=true&f=%7B%22bexitdir%22%3A%5B0%2C30%5D%2C%22bgt%22%3A%5B%22reg%22%5D%2C%22bseason%22%3A%5B%222016%22%5D%7D&reportActiveTabIdx=0"

// Script
loginPage.visit(url);
loginPage.login(credentials.testUser.email, credentials.testUser.password);
navbar.goToScoresPage()

loginPage.visit("https://dodgers-staging.trumedianetworks.com:3005/baseball/player-defensive-positioning-batting/Jose%20Altuve/514888?is=true&f=%7B%22bgt%22%3A%5B%22reg%22%5D%2C%22boorg%22%3A%5B%22OAK%22%5D%2C%22bseason%22%3A%5B%222016%22%5D%7D")

playerPage.changeBallparkDropdown('Fenway Park');
playerPage.getCurrentBallparkImageID().then(function(id) {
  console.log(id)
});


// loginPage.visit('https://dodgers-staging.trumedianetworks.com:3005/baseball/players-statcast?pc=%7B%22bpgb%22%3A%22totals%22%2C%22bqbfs%22%3A%22default%22%2C%22bsvp%22%3A%22stats%22%7D&is=true&f=%7B%22bgt%22%3A%5B%22reg%22%5D%2C%22bseasonlvl%22%3A%5B%22MLB%22%5D%2C%22bseason%22%3A%5B%222016%22%5D%7D&t=%7B%22so%22%3A%22ASC%22%2C%22oc%22%3A1%7D&tpin=%7B%22so%22%3A%22DEFAULT%22%2C%22oc%22%3A%22%5BOFWAirOut%25%5D%22%7D&reportActiveTabIdx=0&sim=%7B%22sameVenue%22%3Afalse%2C%22samePos%22%3Atrue%2C%22includeWall%22%3Afalse%7D')
navbar.search('Mookie Betts', 1);
playerPage.goToSection('statcastFielding');
playerPage.goToSubSection("gameLog");
playerPage.clickGameLogTableStat(1,6);
playerPage.clickSimiliarPlaysIcon(1);











playerPage.clickSimiliarPlaysPitchVideoIcon(1);
playerPage.getVideoPlaylistText(1,1).then(function(text) {
  console.log(text)
});

playerPage.getSimiliarPlaysTooltipPitchVideoHeader().then(function(text) {
          console.log(text)
        });






// FIND LAST LOCATOR
driver.get('https://dodgers.trumedianetworks.com/baseball/player-defensive-positioning-batting/J.%20Altuve/514888?pc=%7B%7D&is=true&tpin=%7B%7D&f=%7B%22bgt%22%3A%5B%22reg%22%5D%2C%22boorg%22%3A%5B%22OAK%22%5D%2C%22bseasonlvl%22%3A%5B%22MLB%22%5D%2C%22bseason%22%3A%5B%222016%22%5D%7D').then(function() {
    // browser.waitForEnabled(By.id('s2id_reportNavBaseballTeamsStatBatting')).then(function() {
    //   console.log("*****")
      
    //   browser.getFullContent(By.id('tableBaseballTeamsStatsSection')).then(function(content) {
    //     console.log('s2id_reportNavBaseballTeamsStatBatting')  
    //     console.log(content)
    //   })
    // })

    browser.waitForEnabled(By.xpath(".//div[@id='tableBaseballPlayerStatsOverviewStatcastBatterPositioningContainer']/table"), 60000).then(function() {
      console.log("*****")
      
     playerPage.clickStatcastFieldingChartEvent(1);
    })        
  // })  
})



//
browser.openNewTab("https://dodgers-staging.trumedianetworks.com:3001").then(function() {
  browser.switchToTab(1);  
})

loginPage.login(credentials.testUser.email, credentials.testUser.password);

//
browser.executeForEachTab(function() {
  navbar.goToScoresPage();
})


browser.executeForEachTab(function() {
  scoresPage.changeDate('2016-5-1');
}).then(function() {
  browser.getFullContentForEachTab(null, scoresPage.lastLocator).then(function(contentArray) {
    content = contentArray;
  })  
})

driver.getCurrentUrl().then(function(url) {
  console.log(url)
})

browser.executeForEachTab(function() {
  driver.takeScreenshot().then(function(data) { 
    driver.manage().window().maximize();
    var screenshotPath = 'public/data/';
    var fileName = new Date().getTime() + '.png';

    fs.writeFileSync(screenshotPath + fileName, data, 'base64');
  });
})

var locator = By.id('content')
var element = driver.findElement(locator)
element.getSize().then(function(size) {
  console.log(size)
})
// element.takeScreenshot(true).then(function(data) {
//   var screenshotPath = 'public/data/';
//   var fileName = new Date().getTime() + '.png';
//   fs.writeFileSync(screenshotPath + fileName, data, 'base64');
// })

// driver.manage().window().getSize().then(function(size) {
//   console.log(size)
// })

scoresPage.visit("https://dodgers-staging.trumedianetworks.com:3001/baseball/game-pitch-by-pitch/NYY-BAL/2016-10-02/449283?pc=%7B%22bged%22%3A%22no%22%7D&is=true&f=%7B%7D")

var scorePitchByPitch = new ScorePitchByPitch(driver)
scorePitchByPitch.clickPitchVideoIcon(1)
scorePitchByPitch.isVideoModalDisplayed().then(function(displayed) {
  console.log(displayed)
})

scorePitchByPitch.getVideoPlaylistText(1,1).then(function(text) {
          console.log(text)
        });



/****************************************************************************
** NFL Scouting
*****************************************************************************/
var webdriver = require('selenium-webdriver');
driver = new webdriver.Builder().withCapabilities({'browserName': 'chrome'}).build();
var credentials = require('../lib/credentials.js');
var By = webdriver.By;
var Until = webdriver.until;
var Key = require('selenium-webdriver').Key;
var extensions = require('../lib/extensions.js');

// Page Objects
var Browser = require('../pages/base/browser.js');
var LoginPage = require('./pages/login_page.js');
var Navbar = require('../pages/nfl_scouting/navbar.js');
var TeamsPage = require('../pages/nfl_scouting/teams/teams_page.js');
var TeamPage = require('../pages/nfl_scouting/teams/team_page.js');
var PlayerPage = require('../pages/nfl_scouting/players/player_page.js');
var ScoutPage = require('../pages/nfl_scouting/scout/scout_page.js');
var EvaluationReportsPage = require('../pages/nfl_scouting/reports/evaluation_reports_page.js');
var ScoutingReportsPage = require('../pages/nfl_scouting/reports/scouting_reports_page.js');

// Instance Objects
loginPage = new LoginPage(driver);
browser = new Browser(driver);
navbar  = new Navbar(driver);
teamsPage = new TeamsPage(driver);
teamPage = new TeamPage(driver);
playerPage = new PlayerPage(driver);
evaluationReportPage = new EvaluationReportsPage(driver);
scoutingReportPage = new ScoutingReportsPage(driver);
scoutPage = new ScoutPage(driver)

// Constants
var url = "https://staging.jags.scouting.trumedianetworks.com/"

// Script
loginPage.visit(url);
loginPage.login(credentials.testUser.email, credentials.testUser.password);

loginPage.visit("https://staging.jags.scouting.trumedianetworks.com/scoutingReport/2224?tenant=jaguars")

scoutingReportPage.changeProfileDropdown('position', 'QB');