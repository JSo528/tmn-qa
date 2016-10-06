var webdriver = require('selenium-webdriver');
var By = webdriver.By;

function MlbTeamsPage(driver) {
  this.driver = driver;
  this.navbar = By.className('navbar-tmn');
};


MlbTeamsPage.prototype.getTeamTableStat = function(teamNum, col) {
  var d = webdriver.promise.defer();
  // First 4 rows are for the headers
  var row = 4 + teamNum;
  var element = By.xpath(`.//div[@id='tableBaseballTeamsStatsContainer']/table/tbody/tr[${row}]/td[${col}]`);

  this.driver.wait(webdriver.until.elementLocated(element));
  this.driver.findElement(element).getText().then(function(stat) {
    d.fulfill(stat);
  })
  return d.promise;  
}

MlbTeamsPage.prototype.clickTeamTableColumnHeader = function(col) {
var column = By.xpath(`.//div[@id='tableBaseballTeamsStatsContainer']/table/thead/tr/th[${col}]`);
this.driver.wait(webdriver.until.elementLocated(column));
var element = this.driver.findElement(column)
return element.click(); 
}




module.exports = MlbTeamsPage;