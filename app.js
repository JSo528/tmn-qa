'use strict'

var express = require('express');
var app = express();

app.set('view engine', 'pug');

var port = process.env.PORT || 8080;

// Middleware
app.use(express.static(__dirname + '/public'));
app.use(require('body-parser').urlencoded({ extended: true }));

// Routes
app.get('/', function(req, res) {
  res.render('index', {
    csrf: 'dummyValue'
  });    
});

app.get('/test-results', function(req, res) {
  var testId = req.query.test

  var jsonfile = require('jsonfile')
  var file = "data/"+testId+".json"
  jsonfile.readFile(file, function(err, obj) {
    if (err) {
      res.render('test-results', {
        errorMessage: "No test found",
        csrf: 'dummyValue'
      });    
    } else {
      res.render('test-results', {
        data: obj,
        csrf: 'dummyValue'
      });    
    }
  });
});

app.post('/run-tests', function(req, res) {
  var Mocha = require('mocha');
  var mocha = new Mocha();

  mocha.addFile('./test/runner');

  var jsonfile = require('jsonfile')
  var date = new Date();
  var timestamp = date.getTime()
  var file = 'data/'+timestamp+'.json'
  
  var fileData = {
    passed: 0,
    failed: 0,
    ongoing: true,
    errors: [] 
  }

  jsonfile.writeFile(file, fileData, function (err) {
    console.error(err)
  });

  mocha.run()
    .on('pass', function(test) {
      fileData.passed += 1;
      jsonfile.writeFile(file, fileData, function (err) {
        console.error(err);
      });
    })
    .on('fail', function(test, err) {    
      fileData.failed += 1;
      fileData.errors.push({
        title: test.title,
        fullTitle: test["parent"].fullTitle(),
        errorType: test.err.name,
        errorMessage: test.err.message,
        stack: test.err.stack
      });
      jsonfile.writeFile(file, fileData, function (err) {
        console.error(err)
      });
    })
    .on('end', function() {
      fileData.ongoing = false;
      jsonfile.writeFile(file, fileData, function (err) {
        console.error(err)
      });
    });  

  res.redirect(303, '/test-results?test='+timestamp);
});

app.use(function(req, res) {
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found');
});

app.listen(port);
console.log("App listening on port " + port);


