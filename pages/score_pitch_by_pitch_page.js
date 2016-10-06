var webdriver = require('selenium-webdriver');
var By = webdriver.By;

function ScorePitchByPitch(driver) {
  this.driver = driver;

  this.decisiveEventFilterSelect = By.id('s2id_pageControlBaseballGameEventDecisive');
  this.decisiveEventFilterInput = By.id('s2id_autogen1_search');
  
  this.filterSelect = By.id('s2id_addFilter');
  this.filterInput = By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input");

  this.updateButton = By.className('update');

  this.videoPlaylistModal = By.xpath(".//div[@id='videoModal']/div[@class='modal-dialog modal-lg']/div[@class='modal-content']");
  this.videoPlaylistCloseBtn = By.xpath(".//div[@id='videoModal']/div/div/div/button");

  this.pitchVisualsModal = By.xpath(".//div[@id='tableBaseballGamePitchByPitchModal']/div/div[@class='modal-content']");
  this.pitchVisualsCloseBtn = By.xpath(".//div[@id='tableBaseballGamePitchByPitchModal']/div/div/div/button[@class='btn btn-primary']");
  this.pitchVisualsBgImage = By.id("heatmapBg");
  this.pitchVisualsPitchCircle = By.css('circle.heat-map-ball');
};

// Filters
ScorePitchByPitch.prototype.addDropdownFilter = function(filter) {
  this.driver.wait(webdriver.until.elementLocated(this.filterSelect));
  var selectElement = this.driver.findElement(this.filterSelect);
  selectElement.click();

  this.driver.wait(webdriver.until.elementLocated(this.filterInput));
  var inputElement = this.driver.findElement(this.filterInput);
  inputElement.sendKeys(filter);
  inputElement.sendKeys(webdriver.Key.ENTER);  
  return this.waitForDataToFinishLoading();

};

ScorePitchByPitch.prototype.toggleSidebarFilter = function(filterName, selection) {
  var selector = By.xpath(`.//div[@id='common']/div/div/div[@class='row'][div[@class='col-md-4 filter-modal-entry-label']/h5[contains(text()[1], '${filterName}')]]/div[@class='col-md-8']/div/div/label[${selection}]`)
  this.driver.wait(webdriver.until.elementLocated(selector));
  var element = this.driver.findElement(selector);
  element.click();
  return this.waitForDataToFinishLoading();
};

ScorePitchByPitch.prototype.closeDropdownFilter = function(filterNum) {
  var dropdownFilter = By.xpath(`.//div[@class='col-md-8 activated']/div[${filterNum}]/div[@class='filter-header text-left']/span[@class='closer fa fa-2x fa-times-circle pull-right']`);
  var element = this.driver.findElement(dropdownFilter);
  element.click();
  var updateElement = this.driver.findElement(this.updateButton);
  updateElement.click();
  return this.waitForDataToFinishLoading();
};

ScorePitchByPitch.prototype.addDecisiveEventFilter = function(filter) {
  this.driver.wait(webdriver.until.elementLocated(this.decisiveEventFilterSelect));
  var selectElement = this.driver.findElement(this.decisiveEventFilterSelect);
  selectElement.click();

  this.driver.wait(webdriver.until.elementLocated(this.decisiveEventFilterInput));
  var inputElement = this.driver.findElement(this.decisiveEventFilterInput);
  inputElement.sendKeys(filter);

  return inputElement.sendKeys(webdriver.Key.ENTER);  
  // return this.waitForTablesToFinishLoading();
};

// text getters
ScorePitchByPitch.prototype.getInningHeaderText = function(topOrBottom, inning) {
  var d = webdriver.promise.defer();

  var addRow = (topOrBottom == "bottom") ? 2 : 1;
  var row = inning * 2 - 2 + addRow;
  
  var selector = By.xpath(`.//div[@id='tableBaseballGamePitchByPitchContainer']/table/tbody/tr[@class='sectionHeader sectionInning'][${row}]/td`)
  this.driver.wait(webdriver.until.elementLocated(selector));
  var element = this.driver.findElement(selector)
  element.getText().then(function(text) {
    d.fulfill(text);
  });

  return d.promise;  
};

ScorePitchByPitch.prototype.getAtBatHeaderText = function(atBatNum) {
  var d = webdriver.promise.defer();
 
  var selector = By.xpath(`.//div[@id='tableBaseballGamePitchByPitchContainer']/table/tbody/tr[@class='sectionHeaderAlt sectionStartOfBat'][${atBatNum}]/td`)
  this.driver.wait(webdriver.until.elementLocated(selector));
  var element = this.driver.findElement(selector)
  element.getText().then(function(text) {
    d.fulfill(text);
  });

  return d.promise;  
}

ScorePitchByPitch.prototype.getAtBatFooterText = function(atBatNum) {
  var d = webdriver.promise.defer();
 
  var selector = By.xpath(`.//div[@id='tableBaseballGamePitchByPitchContainer']/table/tbody/tr[@class='sectionHeaderAlt sectionEndOfBat'][${atBatNum}]/td`)
  this.driver.wait(webdriver.until.elementLocated(selector));
  var element = this.driver.findElement(selector)
  element.getText().then(function(text) {
    d.fulfill(text);
  });

  return d.promise;  
}


// TODO - try to add a paramter for the atBat#
// the way the table is set up makes it incredibly difficult to do since you need to traverse paths with lots of conditions using XPath
// explanation -> http://stackoverflow.com/questions/3428104/selecting-siblings-between-two-nodes-using-xpath
ScorePitchByPitch.prototype.getPitchText = function(pitchNum, col) {
  var d = webdriver.promise.defer();
 
  var selector = By.xpath(`.//div[@id='tableBaseballGamePitchByPitchContainer']/table/tbody/tr[contains(@data-tmn-row-type,'row')][${pitchNum}]/td[${col}]`)
  this.driver.wait(webdriver.until.elementLocated(selector));
  var element = this.driver.findElement(selector)
  element.getText().then(function(text) {
    d.fulfill(text);
  });

  return d.promise;  
}

// Video Playlist
ScorePitchByPitch.prototype.clickPitchVideoIcon = function(pitchNum) {
  var selector = By.xpath(`.//div[@id='tableBaseballGamePitchByPitchContainer']/table/tbody/tr[contains(@data-tmn-row-type,'row')][${pitchNum}]/td[1]/i[@class='fa fa-film pull-left film-icon']`);
  this.driver.wait(webdriver.until.elementLocated(selector));
  var el = this.driver.findElement(selector)
  el.click();

  var element = this.driver.findElement(this.videoPlaylistModal);
  return this.driver.wait(webdriver.until.elementIsVisible(element));
}

ScorePitchByPitch.prototype.closeVideoPlaylistModal = function() {
  var element = this.driver.findElement(this.videoPlaylistCloseBtn)
  element.click();
  return this.driver.wait(webdriver.until.elementLocated(By.xpath(".//body[not(@class='modal-open')]")), 10000);
}

ScorePitchByPitch.prototype.getVideoPlaylistText = function(videoNum, lineNum) {
  var d = webdriver.promise.defer();
 
  var selector = By.xpath(`.//div[@class='col-md-3 playlistContainer']/div/div/a[${videoNum}]/div[${lineNum}]`)
  this.driver.wait(webdriver.until.elementLocated(selector));
  var element = this.driver.findElement(selector)
  element.getText().then(function(text) {
    d.fulfill(text);
  });

  return d.promise;  
}

ScorePitchByPitch.prototype.isVideoModalDisplayed = function() {
  var d = webdriver.promise.defer();
  this.driver.findElement(this.videoPlaylistModal).then(function(element) {
    element.isDisplayed().then(function(displayed) {
      d.fulfill(displayed);
    })
  }, function(err) {
    d.fulfill(false);
  });

  return d.promise;  
};

// Pitch Visuals Modal
ScorePitchByPitch.prototype.clickPitchVisualsIcon = function(atBatNum) {
  var selector = By.xpath(`.//div[@id='tableBaseballGamePitchByPitchContainer']/table/tbody/tr[@class='sectionHeaderAlt sectionStartOfBat'][${atBatNum}]/td/span[@class='table-action-visual fa fa-lg fa-external-link-square']`);
  this.driver.wait(webdriver.until.elementLocated(selector));
  var el = this.driver.findElement(selector);
  el.click();

  var element = this.driver.findElement(this.pitchVisualsModal);
  return this.driver.wait(webdriver.until.elementIsVisible(element));  
};

ScorePitchByPitch.prototype.closePitchVisualsIcon = function(atBatNum) {
  var element = this.driver.findElement(this.pitchVisualsCloseBtn);
  element.click();
  return this.driver.wait(webdriver.until.elementLocated(By.xpath(".//body[not(@class='modal-open')]")), 10000);
};

ScorePitchByPitch.prototype.isPitchVisualsModalDisplayed = function() {
  var d = webdriver.promise.defer();
  this.driver.findElement(this.pitchVisualsModal).then(function(element) {
    element.isDisplayed().then(function(displayed) {
      d.fulfill(displayed);
    })
  }, function(err) {
    d.fulfill(false);
  });

  return d.promise;  
}  ;

ScorePitchByPitch.prototype.getPitchVisualsBgImageHref = function() {
  var d = webdriver.promise.defer();
  var element = this.driver.findElement(this.pitchVisualsBgImage);

  element.getAttribute("href").then(function(href) {
    d.fulfill(href);
  });

  return d.promise; 
}

ScorePitchByPitch.prototype.getPitchVisualsPitchCount = function() {
  var d = webdriver.promise.defer();

  this.driver.findElements(this.pitchVisualsPitchCircle).then(function(pitchCount) {
      d.fulfill(pitchCount.length);
  })

  return d.promise; 
}

// Helper
ScorePitchByPitch.prototype.waitForDataToFinishLoading = function() {
  // this table is getting removed and created again on load
  var dataContainer = By.xpath(".//div[@id='tableBaseballGamePitchByPitchContainer']/table");
  return this.driver.wait(webdriver.until.elementsLocated(dataContainer), 10000);
};


module.exports = ScorePitchByPitch;