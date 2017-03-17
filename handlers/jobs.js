var CronJob = require('cron').CronJob;
var Job = require('./../models/job.js');

function testCronPattern(pattern) {
  try {
    new CronJob(pattern, function() {})
    return true
  } catch(ex) { 
    return false
  }
}

exports.jobIndex = function(req, res) {
  var data = {};

  Job.find()
    .sort({'name': 1})
    .exec(function(err, jobs) {
      res.render('jobs', {
        data: {
          jobs: jobs
        }
      });    
    });
}

exports.jobUpdate = function(req, res) {
  if (req.body.cronPattern && !testCronPattern(req.body.cronPattern)) {
    res.json({
      success: false,
      errorMessage: 'Invalid Cron Pattern'
    })
  } else {
    Job.findById(req.params.id, function(err, job) {
      job.update(req.body).exec(function(err, job) {
        console.log(job)
        if (err) {
          res.json({
            success: false,
            errorMessage: err.message
          })
        } else {
          var cmd = 'pm2 restart jobs/cron.js;'
          var exec = require('child_process').exec;

          exec(cmd, function(error, stdout, stderr) {
            console.log('** child_process callback START **');
            console.log(error);
            console.log(stderr);
            console.log(stdout);
            console.log('** child_process callback END **');
          })

          res.json({
            success: true
          })
        }
      })
    })
  }
}