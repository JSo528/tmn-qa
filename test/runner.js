'use strict';

var rp = require('request-promise');
var fs = require('fs');
var TestRun = require('../models/test_run.js');
var TestRunQueue = require('../models/test_run_queue.js');
var constants = require('../lib/constants.js');
var scripts = require('../lib/scripts.js');
var cmd;
var mongoose = require('mongoose');
var q = require('q');

mongoose.Promise = q.Promise;

module.exports = function(testRun, env) {
  // create directory to store screenshots
  fs.mkdirSync('public/data/'+testRun.id);

  // enable Xvfb for production
  if (env == 'production') {
    cmd = 'Xvfb :99 -screen 0 1920x3000x8 -ac 2>&1 >/dev/null & export DISPLAY=:99;';
    var exec = require('child_process').exec;

    exec(cmd, function(error, stdout, stderr) {
      console.log('** child_process callback START **');
      console.log(error);
      console.log(stderr);
      console.log(stdout);
      console.log('** child_process callback END **');
    })
  }

  // update testRun Objectct
  testRun.update({status: 'ongoing', startedAt: new Date().getTime()}).exec();

  // spawn child process to run mocha
  var spawn = require('child_process').spawn;
  var args = [
    "-gc",
    'test/generate_tests'
  ]
  var envVars = Object.create( process.env );
  envVars.TEST_NUMBER = testRun.testNumber;
  envVars.PORT_NUMBER = testRun.portNumber;
  envVars.TEST_RUN_ID = testRun.id;
  envVars.START_URL = scripts.metadata[testRun.testNumber].startUrl;
  envVars.TITLE = "["+scripts.metadata[testRun.testNumber].name+"]";

  testRun.testRunQueues.map(function(testRunQueueId) {
    TestRunQueue.findById(testRunQueueId, function(err, testRunQueue) {
      envVars.TEST_RUN_QUEUE_ID = testRunQueue.id;
      envVars.FILES = testRunQueue.files;
      
      testRunQueue.update({status: 'ongoing', startedAt: new Date().getTime()}).exec();

      var cp = spawn('mocha', args, {env: envVars})    

      // child process callbacks
      cp.stdout.on('data', (data) => {
        console.log(`${data}`)
      });

      cp.stderr.on('data', (data) => {
        console.log("*******")
        console.log("** STDERR **")
        console.log("*******")
        console.log(`*** stderr: ${data}`);
      });

      cp.on('close', (code) => {
        console.log(`child process closed with code ${code}`);
        
        var promise = TestRunQueue.findById(testRunQueueId).exec();
        promise.then(function(testRunQueue) {
          if (testRunQueue.endedAt == undefined && testRunQueue.status == "ongoing") {
            return testRunQueue.update({endedAt: new Date().getTime(), status: "error"});
          }
        })
        .then(function(testRunQueue) {
          var promises = testRun.testRunQueues.map(function(testRunQueueId) {
            return TestRunQueue.findById(testRunQueueId).exec();
          })

          return q.all(promises);
        })
        .then(function(queues) {
          var statuses = queues.map(function(queue) {
            return queue.status;
          });

          if (statuses.indexOf('killed') != -1) {
            return testRun.update({endedAt: new Date().getTime(), status: 'killed'});
          } else if (statuses.indexOf('error') != -1) {
            return testRun.update({endedAt: new Date().getTime(), status: "error"});
          } else if (statuses.indexOf('ongoing') == -1) {
            return testRun.update({endedAt: new Date().getTime(), status: "finished"});
          }
        }).then(function(val) {
          if (val != undefined) {
            testRun.runCompletionTasks()
              .then(function() {
                // TODO - SEND EMAIL 
                var options = {
                  method: 'POST',
                  url: constants.urls.host[env]+'api/run-next-test'
                }
                rp(options).then(function(response) {
                  console.log("** rp success")
                  console.log(response)
                })
                .catch(function(err) {
                    console.log("** rp error")
                    console.log(err)
                });
              })
          }
        });

          // if (testRun.email) {
          //   var emailTestResults = constants.urls.host[app.get('env')]+'api/email-test-results';
          //   var data = {
          //     form: {
          //       testRunID: testRun.id
          //     }
          //   }
          //   request.get(emailTestResults, data, function() {
          //     console.log('** SENT EMAIL');
          //   });
          // }
        // });
      });

      cp.on('exit', (code, signal) => {
        console.log(`child process exited with code ${code} & signal ${signal}`);
      })

    })
  })
};