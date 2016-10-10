var webdriver = require('selenium-webdriver');
var By = webdriver.By
var constants = require('../lib/constants.js');
var MlbNavbar = require('../pages/mlb/navbar.js');
var LoginPage = require('../pages/login_page.js');
var MlbStandingsPage = require('../pages/mlb/standings_page.js');
var ScoresPage = require('../pages/mlb/scores_page.js');
var MlbDetailedScorePage = require('../pages/mlb/detailed_score_page.js');
var driver, url, loginPage, standingsPage, navbar;

driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
url = constants.urls.mlb.dodgers;
navbar = new MlbNavbar(driver);
loginPage = new LoginPage(driver);
loginPage.visit(url);
loginPage.login(constants.testUser.email, constants.testUser.password);
scoresPage = new ScoresPage(driver);


standingsPage = new MlbStandingsPage(driver)
standingsPage.changeYear(2015)



navbar.goToTeamsPage();
var MlbTeamsPage = require('../pages/mlb_teams_page.js');
var page = new MlbTeamsPage(driver)





var webdriver = require('selenium-webdriver');
var LoginPage = require('../pages/login_page.js');
driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
url = constants.urls.mlb.dodgers;
loginPage = new LoginPage(driver, url);
loginPage.test()
// var BasePage = require('../pages/base/base_page.js');
// basePage = new BasePage(driver)
