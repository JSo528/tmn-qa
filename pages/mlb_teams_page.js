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

  this.groupBySelect = By.id("s2id_pageControlBaseballGroupBy");
  this.groupByInput = By.id("s2id_autogen1_search");

  this.statsViewSelect = By.id("s2id_pageControlBaseballStatsViewTeams");
  this.statsViewInput = By.id("s2id_autogen2_search");

  this.reportSelect = By.id("s2id_reportNavBaseballTeamsStatBatting");
  this.reportInput = By.id("s2id_autogen60_search");  

  this.filterSelect = By.id('s2id_addFilter');
  this.filterInput = By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input");
  this.updateButton = By.className('update');  
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

MlbTeamsPage.prototype.getTeamTableBgColor = function(teamNum, col) {
  var d = webdriver.promise.defer();
  // First 4 rows are for the headers
  var row = 4 + teamNum;
  var element = By.xpath(`.//div[@id='tableBaseballTeamsStatsContainer']/table/tbody/tr[${row}]/td[${col}]`);

  this.driver.wait(webdriver.until.elementLocated(element));
  this.driver.findElement(element).getCssValue("background-color").then(function(color) {
    d.fulfill(color);
  })
  return d.promise;  
}

MlbTeamsPage.prototype.getTeamTableHeader = function(col) {
  var d = webdriver.promise.defer();  
  var element = By.xpath(`.//div[@id='tableBaseballTeamsStatsContainer']/table/thead/tr/th[${col}]`);

  this.driver.wait(webdriver.until.elementLocated(element));
  this.driver.findElement(element).getText().then(function(header) {
    d.fulfill(header);
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

MlbTeamsPage.prototype.changeGroupBy = function(filter) {
  this.driver.wait(webdriver.until.elementLocated(this.groupBySelect));
  var selectElement = this.driver.findElement(this.groupBySelect);
  selectElement.click();

  this.driver.wait(webdriver.until.elementLocated(this.groupByInput));
  var inputElement = this.driver.findElement(this.groupByInput);
  inputElement.sendKeys(filter);
  inputElement.sendKeys(webdriver.Key.ENTER);  
  return this.waitForDataToFinishLoading();
};

MlbTeamsPage.prototype.changeStatsView = function(filter) {
  this.driver.wait(webdriver.until.elementLocated(this.statsViewSelect));
  var selectElement = this.driver.findElement(this.statsViewSelect);
  selectElement.click();

  this.driver.wait(webdriver.until.elementLocated(this.statsViewInput));
  var inputElement = this.driver.findElement(this.statsViewInput);
  inputElement.sendKeys(filter);
  inputElement.sendKeys(webdriver.Key.ENTER);  
  return this.waitForDataToFinishLoading();
};


MlbTeamsPage.prototype.changeReport = function(filter) {
  this.driver.wait(webdriver.until.elementLocated(this.reportSelect));
  var selectElement = this.driver.findElement(this.reportSelect);
  selectElement.click();

  this.driver.wait(webdriver.until.elementLocated(this.reportInput));
  var inputElement = this.driver.findElement(this.reportInput);
  inputElement.sendKeys(filter);
  inputElement.sendKeys(webdriver.Key.ENTER);  
  return this.waitForDataToFinishLoading();
};

// Filters
MlbTeamsPage.prototype.addDropdownFilter = function(filter) {
  this.driver.wait(webdriver.until.elementLocated(this.filterSelect));
  var selectElement = this.driver.findElement(this.filterSelect);
  selectElement.click();

  this.driver.wait(webdriver.until.elementLocated(this.filterInput));
  var inputElement = this.driver.findElement(this.filterInput);
  inputElement.sendKeys(filter);
  inputElement.sendKeys(webdriver.Key.ENTER);  
  return this.waitForDataToFinishLoading();
};

MlbTeamsPage.prototype.toggleSidebarFilter = function(filterName, selection) {
  var selector = By.xpath(`.//div[@id='common']/div/div/div[@class='row'][div[@class='col-md-4 filter-modal-entry-label']/h5[contains(text()[1], '${filterName}')]]/div[@class='col-md-8']/div/div/label[${selection}]`)
  this.driver.wait(webdriver.until.elementLocated(selector));
  var element = this.driver.findElement(selector);
  element.click();
  return this.waitForDataToFinishLoading();
};

MlbTeamsPage.prototype.closeDropdownFilter = function(filterNum) {
  var dropdownFilter = By.xpath(`.//div[@class='col-md-8 activated']/div[${filterNum}]/div[@class='filter-header text-left']/span[@class='closer fa fa-2x fa-times-circle pull-right']`);
  var element = this.driver.findElement(dropdownFilter);
  element.click();
  var updateElement = this.driver.findElement(this.updateButton);
  updateElement.click();
  return this.waitForDataToFinishLoading();
};


// Helper
MlbTeamsPage.prototype.waitForDataToFinishLoading = function() {
  var loadingElement = this.driver.findElement(By.id('loadingContainer'));
  return this.driver.wait(webdriver.until.stalenessOf(loadingElement), 20000)
};


module.exports = MlbTeamsPage;