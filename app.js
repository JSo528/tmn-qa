'use strict';

var express = require('express');
var app = express();
app.set('view engine', 'pug');

if (app.get('env') == 'development') {
  var port = 3001;
} else {
  var port = process.env.PORT || 3000;  
}


// Modules
var constants = require('./lib/constants.js');
var util = require('./lib/util');
var credentials = require('./lib/credentials.js');
var scripts = require('./lib/scripts');

// Database
var dbConnect = require('./models/db_connect.js');
dbConnect.connect(app.get('env'));
var TestRun = require('./models/test_run.js');

// Middleware
app.use(require('express-session')({
    resave: false,
    saveUninitialized: false,
    secret: credentials.cookieSecret,
}));

app.use(express.static(__dirname + '/public'));
app.use(require('body-parser').urlencoded({ extended: true }));

switch(app.get('env')) {
  case 'development':
    app.use(require('morgan')('dev'));
    break;
  case 'production':
    app.use(require('express-logger')({ path: __dirname + '/log/requests.log' }));
    break;
}

app.use(function(req, res, next) {
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});

// Routes
app.get('/', function(req, res) {  
  res.render('new-test', {
    scripts: scripts
  });    
});

app.get('/test-results/', function(req, res) {
  var data = {};

  TestRun.find()
    .sort({'createdAt': -1})
    .limit(200)
    .exec(function(err, testRuns) {
      data.testRuns = testRuns.map(function(testRun) {
        delete testRun.errorObjects;
        if (scripts[testRun.testNumber]) {
          testRun.testName = scripts[testRun.testNumber].name;  
        }
          
        return testRun;
      });

      res.render('test-results-index', {
        data: data
      });    
    });
});

app.get('/test-results/:id', function(req, res) {
  var jsdiff = require('diff');

  TestRun.findById(req.params.id, function(err, testRun) {
    if (err) {
      res.render('test-results', {
        errorMessage: "No test found"
      });    
    } else {
      testRun.testName = scripts[testRun.testNumber].name
      
      testRun.errorObjects.map(function(error, index) {
        if (error.expectedValue || error.actualValue) {
          error.diff = jsdiff.diffWordsWithSpace(String(error.expectedValue), String(error.actualValue));  
        }
        error.errorNumber = index+1;
      })

      res.render('test-results', {
        testRun: testRun
      });    
    }
  });
});

app.post('/run-tests', function(req, res) {
  if (req.body.testFiles == 'custom') {
    var fileWhitelist = req.body.fileWhitelist
  }

  var testRun = new TestRun({
    testNumber: req.body.testNumber,
    portNumber: req.body.portNumber,
    createdAt: new Date().getTime(),
    fileWhitelist: fileWhitelist,
    status: 'queued'
  });
  
  testRun.save(function(err, tr) {
    TestRun.runNextTest(app.get('env'), function(foundTestRun) {
      if (foundTestRun.id == tr.id) {
        res.redirect(303, '/test-results/'+tr.id);
      } else {
        req.session.flash = {
          type: 'success',
          message: "There's a test already running, this test will run when all tests preceding it finish"
        };

        res.redirect(303, '/test-results/');
      }
    })
  });
});

app.get('/util', function(req, res) {
    res.render('util');   
});

app.post('/remove-old-test-data', function(req, res) {
  util.removeOldTestRuns(7);
  req.session.flash = {
    type: 'success',
    message: 'Test Runs over 7 days old have been deleted'
  };

  res.redirect(303, '/util');
});

app.post('/run-next-test', function(req, res) {
  TestRun.runNextTest(app.get('env'), function() {
    res.json({
      success: true
    }); 
  })
});

app.post('/kill-test/:id', function(req, res) {
  TestRun.findById(req.params.id, function(err, testRun) {
    testRun.update({status: 'killed', endedAt: new Date().getTime()}).exec(function(err, testRun) {
      util.killChromeInstances();
      
      TestRun.runNextTest(app.get('env'), function() {
        req.session.flash = {
          type: 'success',
          message: "Killed test #"+req.params.id
        };

        res.redirect(303, '/test-results/');
      })     
    });
  });
});

app.post('/start-cron', function(req, res) {
  var cron = require('node-cron');
  var task = cron.schedule('20,50 * * * *', function() {
    console.log('** starting cron task')
    var request = require('request');
    var queueTestURL = constants.urls.host[app.get('env')]+'run-tests';
    request.post(queueTestURL, {form: { testNumber: 6 }})
  });

  task.start();

  res.redirect(303, '/test-results/');
});

// API
app.get('/api/test-runs/:id', function(req, res) {
  var jsdiff = require('diff');

  TestRun.findById(req.params.id, function(err, testRun) {
    if (err) {
      res.json({
        success: false,
        errorMessage: "No test found"
      });    
    } else {
      testRun.testName = scripts[testRun.testNumber].name
      
      testRun.errorObjects.map(function(error, index) {
        if (error.expectedValue || error.actualValue) {
          error.diff = jsdiff.diffWordsWithSpace(String(error.expectedValue), String(error.actualValue));  
        }
        error.errorNumber = index+1;
      })

      res.json({
        success: true,
        data: testRun
      });    
    }
  });
});

app.post('/api/run-test', function(req, res) {
  if (req.body.fileWhitelist) {
    var fileWhitelist = req.body.fileWhitelist
  }

  var testRun = new TestRun({
    testNumber: req.body.testNumber,
    portNumber: req.body.portNumber,
    createdAt: new Date().getTime(),
    fileWhitelist: fileWhitelist,
    status: 'queued',
    email: req.body.email
  });
  
  testRun.save(function(err, tr) {
    TestRun.runNextTest(app.get('env'), function(foundTestRun) {
      res.json({
        success: true,
        data: testRun
      });    
    });
  });
});

app.get('/api/email-test-results', function(req, res) {
  var emailService = require('./lib/email.js')(credentials);
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


