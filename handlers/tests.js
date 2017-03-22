var scripts = require('./../lib/scripts').metadata;
var TestRun = require('./../models/test_run.js');
var TestRunQueue = require('./../models/test_run_queue.js');
var app = require('express')();
var util = require('./../lib/util.js');
var q = require('q');

exports.testNew = function(req, res) {
  res.render('new-test', {
    scripts: scripts
  });    
}

exports.testIndex = function(req, res) {
  var data = {};

  TestRun.find()
    .sort({'createdAt': -1})
    .limit(50)
    .exec()
    .then(function(testRuns) {
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
  TestRun.getJsonData(req.params.id)
    .then(function(jsonData) {
      res.render('test-results', {
        testRun: jsonData
      });  
    })
}

exports.killTest = function(req, res) {
  TestRun.findById(req.params.id).exec()
    .then(function(testRun) {
      return testRun.update({status: 'killed', endedAt: new Date().getTime()})
        .then(function() {
          var promises = testRun.testRunQueues.map(function(queueId) {
            return TestRunQueue.findById(queueId).update({status: 'killed', endedAt: new Date().getTime()});
          });

          return q.all(promises);
        })
    
    }).then(function() {
      if (app.get('env') != 'development') {
        util.killChromeInstances();
      }

      req.session.flash = {
        type: 'success',
        message: "Killed test #"+req.params.id
      };

      res.redirect(303, '/test-results/');
    });
}

exports.runTest = function(req, res) {
  if (req.body.testFiles == 'custom') {
    var fileWhitelist = req.body.fileWhitelist;
   } 

  var data = {
    testNumber: req.body.testNumber,
    portNumber: req.body.portNumber,
    createdAt: new Date().getTime(),
    fileWhitelist: fileWhitelist,
    status: 'queued',
    email: req.body.email
  }

  TestRun.createTestRun(data)
  .then(function(testRun) {
    TestRun.runNextTest(app.get('env'))
      .then(function(nextTestRun) {
        if (nextTestRun.id == testRun.id) {
          res.json({
            success: true,
            redirectUrl: '/test-results/'+testRun.id
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
  })
}

exports.testJson = function(req, res) {
  TestRun.getJsonData(req.params.id)
    .then(function(jsonData) {
      res.json({
        success: true,
        data: jsonData
      });    
    })
}

exports.runNextTest = function(req, res) {
  TestRun.runNextTest(app.get('env'), function() {
    res.json({
      success: true
    }); 
  })
}