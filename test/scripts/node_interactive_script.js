var webdriver = require('selenium-webdriver');
driver = new webdriver.Builder().withCapabilities({'browserName': 'chrome'}).build();
var credentials = require('../lib/credentials.js');

// Page Objects
var LoginPage = require('./pages/login_page.js');
var StandingsPage = require('../pages/mlb/standings_page.js');
var TeamsPage = require('../pages/mlb/teams_page.js');
var StatsPage = require('../pages/mlb/teams/stats_page.js');

// Log In
loginPage = new LoginPage(driver);
var url = "https://dodgers.trumedianetworks.com"
loginPage.visit(url);
loginPage.login(credentials.testUser.email, credentials.testUser.password);

