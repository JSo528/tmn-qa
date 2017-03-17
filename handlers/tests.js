var scripts = require('./../lib/scripts');
var TestRun = require('./../models/test_run.js');
var app = require('express')();

exports.testNew = function(req, res) {
  res.render('new-test', {
    scripts: scripts
  });    
}

exports.testIndex = function(req, res) {
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
}

exports.testShow = function(req, res) {
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
}

exports.killTest = function(req, res) {
  TestRun.findById(req.params.id, function(err, testRun) {
    testRun.update({status: 'killed', endedAt: new Date().getTime()}).exec(function(err, testRun) {
      if (app.get('env') != 'development') {
        util.killChromeInstances();
      }
      
      TestRun.runNextTest(app.get('env'), function() {
        req.session.flash = {
          type: 'success',
          message: "Killed test #"+req.params.id
        };

        res.redirect(303, '/test-results/');
      })     
    });
  });
}

exports.runTest = function(req, res) {
  console.log("** runTest")
  if (req.body.testFiles == 'custom') {
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
    if (err) {
      console.log("** ERROR")
      console.log(err)
    }
    TestRun.runNextTest(app.get('env'), function(foundTestRun) {
      if (foundTestRun.id == tr.id) {
        res.json({
          success: true,
          redirectUrl: '/test-results/'+tr.id
        });    

      } else {
        req.session.flash = {
          type: 'success',
          message: "There's a test already running, this test will run when all tests preceding it finish"
        };

        res.json({
          success: true,
          redirectUrl: '/test-results/'
        });    
      }
    });
  });
}

exports.testJson = function(req, res) {
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
}

exports.runNextTest = function(req, res) {
  TestRun.runNextTest(app.get('env'), function() {
    res.json({
      success: true
    }); 
  })
}