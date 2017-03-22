var scripts = require('./../lib/scripts');
var util = require('./../lib/util');
var credentials = require('./../lib/credentials.js');
var emailService = require('./../lib/email.js')(credentials);
var TestRun = require('./../models/test_run.js');

exports.toolIndex = function(req, res) {
  res.render('tools');   
}

exports.removeOldTestData = function(req, res) {
  util.removeOldTestRuns(7);
  req.session.flash = {
    type: 'success',
    message: 'Test Runs over 7 days old have been deleted'
  };

  res.redirect(303, '/tools');
}


exports.emailTestResults = function(req, res) {
  var html = "<p>Test</p>"
  TestRun.findById(req.body.testRunID, function(err, testRun) {
    testRun.testName = scripts[testRun.testNumber].name
    
    res.render('emails/test-results', { layout: null, testRun: testRun }, function(err, html) {
      if (err) console.log('error in email template: ' + err);
      emailService.send(testRun.email,
        'QA Test Results',
        html);
    });
  }); 

  res.json({
    success: true
  })
}