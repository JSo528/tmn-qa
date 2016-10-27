var webdriver = require('selenium-webdriver');
driver = new webdriver.Builder().withCapabilities({'browserName': 'chrome'}).build();
var credentials = require('../lib/credentials.js');
var By = webdriver.By;
// Page Objects
var LoginPage = require('./pages/login_page.js');
var StandingsPage = require('../pages/mlb/standings_page.js');
var TeamsPage = require('../pages/mlb/teams_page.js');
var StatsPage = require('../pages/mlb/teams/stats_page.js');
var Browser = require('../pages/base/browser.js');
var Navbar = require('../pages/mlb/navbar.js');
var ScoresPage = require('../pages/mlb/scores_page.js');
var DetailedScorePage = require('../pages/mlb/detailed_score_page.js');
var TeamsPage = require('../pages/mlb/teams_page.js');

// Log In
loginPage = new LoginPage(driver);
var url = "https://dodgers.trumedianetworks.com"
loginPage.visit(url);
loginPage.login(credentials.testUser.email, credentials.testUser.password);
standingsPage = new StandingsPage(driver);
browser = new Browser(driver);
navbar  = new Navbar(driver);
scoresPage = new ScoresPage(driver);
detailedScorePage = new DetailedScorePage(driver);
teamsPage = new TeamsPage(driver);

navbar.goToTeamsPage();
teamsPage.goToSubSection("Occurences & Streaks");

browser.getFullContent(teamsPage.streaksTable).then(function(text) {
  console.log(text)
})

var locator = By.css("table")
var element = driver.findElement(locator)
element.isEnabled().then(function(enabled) {
  console.log(enabled)
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

driver.getExecutor().then(function(url) {
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