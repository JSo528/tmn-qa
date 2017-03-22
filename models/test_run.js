var mongoose = require('mongoose');
var runner = require('./../test/runner');
var scripts = require('./../lib/scripts.js');
var TestRunQueue = require('./test_run_queue.js');
var jsdiff = require('diff');
var q = require('q');

mongoose.Promise = q.Promise;

var testRunSchema = mongoose.Schema({
  testNumber: Number,
  portNumber: Number,
  passedCount: {type: Number, default: 0},
  failedCount: {type: Number, default: 0},
  createdAt: Date,
  startedAt: Date,
  endedAt: Date,
  status: String,
  errorObjects: {type: Array, default: []},
  fileWhitelist: {type: Array, default: null},
  email: String,
  testRunQueues: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TestRunQueue' }]
});

testRunSchema.statics.createTestRun = function(data) {
  var testRun = new TestRun(data);
  testRun.createQueues();
  return testRun.save();
}

testRunSchema.statics.runNextTest = function(env, cb) {
  var currentTime = new Date().getTime();
  var oneHour = 1000*60*60;
  var timeThreshold = currentTime - (oneHour * 6);
  var d = q.defer();

  TestRun.findOne({status: 'ongoing', createdAt: {$gt: timeThreshold}}).sort('createdAt').exec(function(err, testRun) {
    if (testRun) {
      d.fulfill(testRun);
    } else {
      TestRun.findOne({status: 'queued', createdAt: {$gt: timeThreshold}}).sort('createdAt').exec(function(err, testRun) {
        if (testRun) {
          runner(testRun, env);        
        }
        d.fulfill(testRun);
      });
    }
  });

  return d.promise;
};

testRunSchema.statics.getJsonData = function(id) {
  var d = q.defer();
  var testJson;
  
  TestRun.findById(id).exec()
    .then(function(testRun) {
      testJson = testRun;
      testJson.testName = scripts.metadata[testRun.testNumber].name;

      var promises = testRun.testRunQueues.map(function(queueId) {
        return TestRunQueue.findById(queueId).exec();
      })
      return q.all(promises);
    })
    .then(function(testRunQueues) {
      var passedCount = 0;
      var failedCount = 0;
      var errorObjects = [];
      var errorNum = 1;
      
      testRunQueues.forEach(function(queue) {
        passedCount += queue.passedCount;
        failedCount += queue.failedCount;
        errorObjects = errorObjects.concat(queue.errorObjects)
      })

      testJson.passedCount = passedCount;
      testJson.failedCount = failedCount;
      testJson.errorObjects = errorObjects;
      
      testJson.errorObjects.map(function(error) {
        if (error.expectedValue || error.actualValue) {
          error.diff = jsdiff.diffWordsWithSpace(String(error.expectedValue), String(error.actualValue));  
        }
        error.errorNumber = errorNum;
        errorNum += 1;
      })

      d.fulfill(testJson);
    })  

  return d.promise;
}

testRunSchema.methods.createQueues = function() {
  var queueNums = scripts.getQueueNums(this.fileWhitelist, this.testNumber);
  queueNums.map(function(queueNum) {

    // save object
    var testRunQueue = new TestRunQueue({
      queue: queueNum,
      files: scripts.getFiles(this.fileWhitelist, this.testNumber, queueNum)
    })

    testRunQueue.save(function(err, queue) {
      if (err) {
        console.log(err)
      }
    })

    this.testRunQueues.push(testRunQueue);
  }.bind(this))
};

testRunSchema.methods.runCompletionTasks = function() {
  var promises = this.testRunQueues.map(function(queueId) {
    return TestRunQueue.findById(queueId).exec();
  })
  
  return q.all(promises)
    .then(function(testRunQueues) {
      var passedCount = 0;
      var failedCount = 0;
      
      testRunQueues.forEach(function(queue) {
        passedCount += queue.passedCount;
        failedCount += queue.failedCount;
      })

      return this.update({passedCount: passedCount, failedCount: failedCount});
    }.bind(this))  
};

var TestRun = mongoose.model('TestRun', testRunSchema);
module.exports = TestRun;