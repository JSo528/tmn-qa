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
var TeamsStatsPage = require('../pages/mlb/teams/stats_page.js');
var TeamPage = require('../pages/mlb/team/team_page.js');
var OverviewPage = require('../pages/mlb/team/overview_page.js');

// Scores Pages
var ScoresPage = require('../pages/mlb/scores/scores_page.js');
var DetailedScorePage = require('../pages/mlb/scores/detailed_score_page.js');
var PitchByPitchPage = require('../pages/mlb/scores/pitch_by_pitch_page.js');

// Players Pages
var PlayersPage = require('../pages/mlb/players/players_page.js');
var PlayersStatsPage = require('../pages/mlb/players/stats_page.js');

var StandingsPage = require('../pages/mlb/standings_page.js');
var UmpiresPage = require('../pages/mlb/umpires_page.js');
var UmpirePage = require('../pages/mlb/umpire_page.js');
var GroupsPage = require('../pages/mlb/groups_page.js')
var RosterPage = require('../pages/mlb/team/roster_page.js');
var PlayerPage = require('../pages/mlb/player/player_page.js');

// Instance Objects
loginPage = new LoginPage(driver);
browser = new Browser(driver);
navbar  = new Navbar(driver);
standingsPage = new StandingsPage(driver);
scoresPage = new ScoresPage(driver);
detailedScorePage = new DetailedScorePage(driver);
teamsPage = new TeamsPage(driver);
teamsStatsPage = new TeamsStatsPage(driver);
pitchByPitchPage = new PitchByPitchPage(driver);
playersPage = new PlayersPage(driver);
playersStatsPage = new PlayersStatsPage(driver, 'batting');
filters = new Filters(driver);
umpiresPage = new UmpiresPage(driver);
groupsPage = new GroupsPage(driver);
teamPage = new TeamPage(driver);
overviewPage = new OverviewPage(driver);
rosterPage = new RosterPage(driver, 'batting')
playerPage = new PlayerPage(driver)
umpirePage = new UmpirePage(driver)

// Constants
var url = "https://tigers.trumedianetworks.com"
// var url = "https://dodgers-staging.trumedianetworks.com:3005"

// Script
loginPage.visit(url);
loginPage.login(credentials.testUser.email, credentials.testUser.password);

// Custom Report
var Tigers = require('../pages/mlb/custom_reports/tigers.js');
tigers = new Tigers(driver);

navbar.goToTeamsPage();
teamsStatsPage.clickTeamTableCell(25,3);

marlins.goToSubSection('Hitting Matchups');


var locator = By.xpath(`.//div[@id='filterSet']/div/div/div/div[div[contains(text()[1], "Pitch Type:")]]/div/ul/li/div`)
var array = []
driver.findElements(locator).then(function(elements) {
  elements.forEach(function(element) {
    element.getText().then(function(text) {
      array.push(text)
    })
  })
})




// FIND LAST LOCATOR
driver.get('https://dodgers.trumedianetworks.com/baseball/game-batting/CHC-LAD/2016-10-22/487629?f=%7B%7D&is=true').then(function() {
    // browser.waitForEnabled(By.id('s2id_reportNavBaseballTeamsStatBatting')).then(function() {
    //   console.log("*****")
      
    //   browser.getFullContent(By.id('tableBaseballTeamsStatsSection')).then(function(content) {
    //     console.log('s2id_reportNavBaseballTeamsStatBatting')  
    //     console.log(content)
    //   })
    // })

    browser.waitForEnabled(By.xpath(".//div[@id='tableBaseballGamePlayerBattingStatsAwayContainer']/table"), 60000).then(function() {
      console.log("*****")
      
      browser.getFullContent(By.id('tableBaseballGamePlayerBattingStatsAwayContainer')).then(function(content) {
        console.log('tableBaseballGamePlayerBattingStatsAwayContainer')  
        console.log(content)
      })
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