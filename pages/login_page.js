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
  this.driver.wait(webdriver.until.elementLocated(this.usernameField));

  var emailInput = this.driver.findElement(this.usernameField)
  var passwordInput = this.driver.findElement(this.passwordField)
  var loginButton = this.driver.findElement(this.loginButton)

  emailInput.sendKeys(email),
  passwordInput.sendKeys(password)
  loginButton.click();      
    
  return this.driver.wait(webdriver.until.stalenessOf(this.driver.findElement(this.bodyTag)), 10000);
  // return webdriver.promise.fulfilled(true);
};

module.exports = LoginPage;