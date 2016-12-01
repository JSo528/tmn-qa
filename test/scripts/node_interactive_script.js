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
var OverviewPage = require('../pages/mlb/teams/team_overview_page.js');

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
overviewPage = new OverviewPage(driver);
playerPage = new PlayerPage(driver)
umpirePage = new UmpirePage(driver)

// Constants
var url = "https://dodgers-staging.trumedianetworks.com:3005"
// var url = "https://angels.trumedianetworks.com:3005"

// Script
loginPage.visit(url);
loginPage.login(credentials.testUser.email, credentials.testUser.password);


var gameURL = '/baseball/game-batting/NYY-BAL/2016-10-02/449283';
detailedScorePage.visit(url+gameURL);

detailedScorePage.clickTeamBattingStat('home', 5);
detailedScorePage.clickPitchVideoIcon(2);
detailedScorePage.closeVideoPlaylistModal();
detailedScorePage.closePlayByPlaytModal();

// Custom Report
var Angels = require('../pages/mlb/custom_reports/angels.js');
angels = new Angels(driver);

https://angels-staging.trumedianetworks.com:3005/baseball/batting-angels-team-spray-chart/BOS/111?pc=%7B%22brbip%22%3A150%7D&is=true&f=%7B%22bgt%22%3A%5B%22reg%22%5D%2C%22bseasonlvl%22%3A%5B%22MLB%22%5D%2C%22bseason%22%3A%5B%222016%22%5D%7D

navbar.goToTeamsPage();

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