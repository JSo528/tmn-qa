var webdriver = require('selenium-webdriver');
var By = webdriver.By;

function MlbTeamsPage(driver) {
  this.driver = driver;
  this.navbar = By.className('navbar-tmn');

  this.isoBtnOn = By.id('isoOnBtn');
  this.isoBtnOff = By.id('isoOffBtn');

  this.chartColumnsBtn = By.id('tableActive');
  this.histogramLink = By.xpath(".//div[@class='chart-popover']/div[@class='chart'][1]/a");
  this.scatterChartLink = By.xpath(".//div[@class='chart-popover']/div[@class='chart'][2]/a");

  this.modal = By.xpath(".//div[@class='modal modal-chart in']/div/div[@class='modal-content']");
  this.modalCloseBtn = By.xpath(".//div[@class='modal modal-chart in']/div/div/div/button[@class='close']");
  this.teamTable = By.xpath(".//div[@id='tableBaseballTeamsStatsContainer']/table");
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

MlbTeamsPage.prototype.getIsoTableStat = function(teamNum, col) {
  var d = webdriver.promise.defer();
  // First 4 rows are for the headers
  var row = 4 + teamNum;
  var element = By.xpath(`.//div[@id='tableBaseballTeamsStatsISOContainer']/table/tbody/tr[${row}]/td[${col}]`);

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


MlbTeamsPage.prototype.clickTeamTablePin = function(teamNum) {
  var row = 4 + teamNum;
  var pin = By.xpath(`.//div[@id='tableBaseballTeamsStatsContainer']/table/tbody/tr[${row}]/td/span[@class='table-pin fa fa-lg fa-thumb-tack']`);
  this.driver.wait(webdriver.until.elementLocated(pin));
  var element = this.driver.findElement(pin)
  return element.click(); 
}

MlbTeamsPage.prototype.clickIsoBtn = function(onOrOff) {
  var btn = (onOrOff == "on") ? this.isoBtnOn : this.isoBtnOff
  this.driver.wait(webdriver.until.elementLocated(btn));
  var element = this.driver.findElement(btn)
  return element.click(); 
}

MlbTeamsPage.prototype.clickChartColumnsBtn = function() {
  // clicking button doesnt do anything if the team table isnt' visible
  this.driver.wait(webdriver.until.elementLocated(this.teamTable));
  this.driver.wait(webdriver.until.elementLocated(this.chartColumnsBtn));
  var element = this.driver.findElement(this.chartColumnsBtn)
  return element.click(); 
}

MlbTeamsPage.prototype.clickHistogramLink = function() {
  this.driver.wait(webdriver.until.elementLocated(this.histogramLink));
  var element = this.driver.findElement(this.histogramLink)
  return element.click(); 
}

MlbTeamsPage.prototype.clickScatterChartLink = function() {
  this.driver.wait(webdriver.until.elementLocated(this.scatterChartLink));
  var element = this.driver.findElement(this.scatterChartLink)
  return element.click(); 
}

MlbTeamsPage.prototype.openScatterChart = function(selectionOne, selectionTwo) {
  this.clickTeamTableColumnHeader(selectionOne);
  var elementOne = this.driver.findElement(this.scatterChartLink);
  elementOne.click(); 

  this.clickTeamTableColumnHeader(selectionTwo);
  var elementTwo = this.driver.findElement(this.scatterChartLink);
  return elementTwo.click(); 
}


MlbTeamsPage.prototype.isModalDisplayed = function() {
  var d = webdriver.promise.defer();
  this.driver.findElement(this.modal).then(function(element) {
    element.isDisplayed().then(function(displayed) {
      d.fulfill(displayed);
    })
  }, function(err) {
    d.fulfill(false);
  });

  return d.promise;  
}

MlbTeamsPage.prototype.closeModal = function() {
  this.driver.wait(webdriver.until.elementLocated(this.modalCloseBtn));
  var element = this.driver.findElement(this.modalCloseBtn)
  return element.click(); 
}




module.exports = MlbTeamsPage;