'use strict';

var express = require('express');
var app = express();
app.set('view engine', 'pug');
var port = process.env.PORT || 3000;

// Database
var dbConnect = require('./models/db_connect.js');
dbConnect.connect(app.get('env'));
var TestRun = require('./models/test_run.js');

// Middleware
app.use(express.static(__dirname + '/public'));
app.use(require('body-parser').urlencoded({ extended: true }));

// Routes
var constants = require('./lib/constants.js')

app.get('/', function(req, res) {  
  res.render('new-test', {
    tests: constants.tests
  });    
});

app.get('/test-results/', function(req, res) {
  var data = {};

  TestRun.find()
    .sort({'startedAt': -1})
    .limit(20)
    .exec(function(err, testRuns) {
      data.testRuns = testRuns.map(function(testRun) {
        delete testRun.errorObjects;
        testRun.testName = constants.tests[testRun.testNumber].name
        return testRun;
      });

      res.render('test-results-index', {
        data: data
      });    
    });
});

app.get('/test-results/:id', function(req, res) {
  TestRun.findById(req.params.id, function(err, testRun) {
    if (err) {
      res.render('test-results', {
        errorMessage: "No test found"
      });    
    } else {
      testRun.testName = constants.tests[testRun.testNumber].name
      res.render('test-results', {
        testRun: testRun
      });    
    }
  });
});

app.post('/run-tests', function(req, res) {
  var testRun = new TestRun({
    testNumber: req.body.testType,
    portNumber: req.body.portNumber,
    startedAt: new Date().getTime(),
    status: 'ongoing'
  });
  testRun.save();
  
  var runner = require('./test/runner');
  runner(testRun, app.get('env'));

  res.redirect(303, '/test-results/'+testRun.id);
});

app.use(function(req, res) {
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found');
});

app.use(function(req, res) {
  res.type('text/plain');
  res.status(500);
  res.send('500 - Server Error');
});

app.listen(port);
console.log("App listening on port " + port);


