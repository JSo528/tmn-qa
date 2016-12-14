var mongoose = require('mongoose');

var testRunSchema = mongoose.Schema({
  testNumber: Number,
  portNumber: Number,
  passedCount: {type: Number, default: 0},
  failedCount: {type: Number, default: 0},
  createdAt: Date,
  startedAt: Date,
  endedAt: Date,
  status: String,
  expectedValue: String,
  actualValue: String,
  errorObjects: {type: Array, default: []},
  fileWhitelist: {type: Array, default: null}
});

testRunSchema.statics.runNextTest = function(env, cb) {
  var currentTime = new Date().getTime();
  var oneHour = 1000*60*60;
  var timeThreshold = currentTime - (oneHour * 6);
  
  TestRun.findOne({status: 'ongoing', createdAt: {$gt: timeThreshold}}).sort('createdAt').exec(function(err, testRun) {
    if (testRun) {
      cb(testRun);
    } else {
      TestRun.findOne({status: 'queued', createdAt: {$gt: timeThreshold}}).sort('createdAt').exec(function(err, testRun) {
        if (testRun) {
          var runner = require('./../test/runner');
          runner(testRun, env);        
        }

        cb(testRun);
      });
    }
  });
};

var TestRun = mongoose.model('TestRun', testRunSchema);
module.exports = TestRun;