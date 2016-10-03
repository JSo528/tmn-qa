var webdriver = require('selenium-webdriver');
var By = webdriver.By;

function MlbScoresPage(driver) {
  this.driver = driver;
};

module.exports = MlbScoresPage;