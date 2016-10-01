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

LoginPage.prototype.login = function(email, password) {
  this.driver.findElement(this.usernameField).sendKeys(email);
  this.driver.findElement(this.passwordField).sendKeys(password);
  this.driver.findElement(this.loginButton).click();
  this.driver.wait(webdriver.until.stalenessOf(this.driver.findElement(this.bodyTag)), 60000);

  return webdriver.promise.fulfilled(true);
};

module.exports = LoginPage;