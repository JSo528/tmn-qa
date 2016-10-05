var webdriver = require('selenium-webdriver');
var By = webdriver.By;

function LoginPage(driver, url) {
  this.driver = driver;
  this.url = url;
  this.usernameField = By.id('username');
  this.passwordField = By.id('password');
  this.loginButton = By.id('login');
  this.bodyTag = By.tagName('body');
};

LoginPage.prototype.visit = function() {
  return this.driver.get(this.url);
};

// TODO - fix bugginess
// seems like it needs to wait a bit before values are inputted
LoginPage.prototype.login = function(email, password) {
  var thiz = this;
  this.driver.wait(webdriver.until.elementLocated(this.usernameField)).then(function() {
    thiz.driver.findElement(thiz.usernameField).sendKeys(email);
    thiz.driver.findElement(thiz.passwordField).sendKeys(password);
    thiz.driver.findElement(thiz.loginButton).click();  
    thiz.driver.wait(webdriver.until.stalenessOf(thiz.driver.findElement(thiz.bodyTag)), 10000);

    return webdriver.promise.fulfilled(true);
  });
};

module.exports = LoginPage;