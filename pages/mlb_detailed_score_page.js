var webdriver = require('selenium-webdriver');
var By = webdriver.By;

function MlbDetailedScorePage(driver) {
  this.driver = driver;

  this.boxScoreHeader = By.xpath(`.//h4[@class='report-title']`)
};

MlbDetailedScorePage.prototype.getBoxScoreTotalHits = function(homeOrAway) {
  var d = webdriver.promise.defer();
  var team = homeOrAway == "home" ? 1 : 2
  
  var element = By.xpath(`.//table[@class='table table-box-scores']/tbody/tr[${team}]/td[13]`)
  this.driver.findElement(element).getText().then(function(hits) {
    d.fulfill(hits);
  });
  return d.promise;
}

MlbDetailedScorePage.prototype.getTeamBattingStat = function(homeOrAway, col) {
  var d = webdriver.promise.defer();
  var team = homeOrAway == "home" ? 1 : 2
  var element = By.xpath(`.//div[@id='tableBaseballGameTeamBattingStatsContainer']/table/tbody/tr[${team}]/td[${col}]`);

  this.driver.wait(webdriver.until.elementLocated(element));
  this.driver.findElement(element).getText().then(function(stat) {
    d.fulfill(stat);
  });
  return d.promise;
}

MlbDetailedScorePage.prototype.getPlayerBattingStat = function(homeOrAway, row, col) {
  var d = webdriver.promise.defer();
  var tableID = (homeOrAway == "home") ? 'tableBaseballGamePlayerBattingStatsHomeContainer' : 'tableBaseballGamePlayerBattingStatsAwayContainer';     
  var element = By.xpath(`.//div[@id='${tableID}']/table/tbody/tr[${row}]/td[${col}]`);

  this.driver.wait(webdriver.until.elementLocated(element));
  this.driver.findElement(element).getText().then(function(stat) {
    d.fulfill(stat);
  });
  return d.promise;
};

module.exports = MlbDetailedScorePage;