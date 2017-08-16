var webdriver = require('selenium-webdriver');
driver = new webdriver.Builder().withCapabilities({'browserName': 'chrome'}).build();
var credentials = require('./lib/credentials.js');
var By = webdriver.By;
var Until = webdriver.until;
var Key = require('selenium-webdriver').Key;
var extensions = require('./lib/extensions.js');

// Page Objects
var Browser = require('./pages/base/browser.js');
var LoginPage = require('./pages/login_page.js');
var Navbar = require('./pages/nfl_scouting/navbar.js');
var TeamsPage = require('./pages/nfl_scouting/teams/teams_page.js');
var TeamPage = require('./pages/nfl_scouting/teams/team_page.js');
var PlayerPage = require('./pages/nfl_scouting/players/player_page.js');
var PlayerSearchPage = require('./pages/nfl_scouting/players/search_page.js');
var ReportSearchPage = require('./pages/nfl_scouting/reports/search_page.js');
var ScoutPage = require('./pages/nfl_scouting/scout/scout_page.js');
var EvaluationReportPage = require('./pages/nfl_scouting/reports/evaluation_report_page.js');
var ScoutingReportPage = require('./pages/nfl_scouting/reports/scouting_report_page.js');
var InterviewReportPage = require('./pages/nfl_scouting/reports/interview_report_page.js');
var MedicalReportPage = require('./pages/nfl_scouting/reports/medical_report_page.js');
var HrtTestingReportPage = require('./pages/nfl_scouting/reports/hrt_testing_report_page.js');
var ListPage = require('./pages/nfl_scouting/lists/list_page.js');
var ManageDraftPage = require('./pages/nfl_scouting/draft/manage_draft_page.js');
var Filters = require('./pages/nfl_scouting/filters.js');
var MeasurablesPage = require('./pages/nfl_scouting/players/measurables_page.js');

// Instance Objects
loginPage = new LoginPage(driver);
browser = new Browser(driver);
navbar  = new Navbar(driver);
teamsPage = new TeamsPage(driver);
teamPage = new TeamPage(driver);
playerPage = new PlayerPage(driver);
evaluationReportPage = new EvaluationReportPage(driver);
scoutingReportPage = new ScoutingReportPage(driver);
interviewReportPage = new InterviewReportPage(driver);
medicalReportPage = new MedicalReportPage(driver);
hrtTestingReportPage = new HrtTestingReportPage(driver);
scoutPage = new ScoutPage(driver);
listPage = new ListPage(driver);
manageDraftPage = new ManageDraftPage(driver);
searchPage = new PlayerSearchPage(driver);
filters = new Filters(driver);
measurablesPage = new MeasurablesPage(driver)
reportSearchPage = new ReportSearchPage(driver)

// Constants
var url = "https://staging.jags.scouting.trumedianetworks.com/"
var url = "http://localhost:3000/"

// Script
loginPage.visit(url);
loginPage.login(credentials.testUser.email, credentials.testUser.password);

navbar.goToPlayersSearchPage();

element3 = By.xpath(".//div[contains(@class,  '-content-container')]/.//table/thead/tr/th[4]")
element4 = By.xpath(".//div[contains(@class,  '-content-container')]/.//table/thead/tr/th[7]")
var el3 = driver.findElement(element3)
var el4 = driver.findElement(element4)

driver.actions().dragAndDrop(el3, {x:1000, y:100}).perform();

driver.actions().mouseMove(el3).mouseDown().mouseMove({x: 1000, y: 100}).mouseUp().perform()