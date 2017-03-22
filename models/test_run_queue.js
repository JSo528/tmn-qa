var mongoose = require('mongoose');

var testRunQueueSchema = mongoose.Schema({
  queue: Number,
  passedCount: {type: Number, default: 0},
  failedCount: {type: Number, default: 0},
  createdAt: Date,
  startedAt: Date,
  endedAt: Date,
  status: String,
  errorObjects: {type: Array, default: []},
  files: {type: Array, default: []}
});

var TestRunQueue = mongoose.model('TestRunQueue', testRunQueueSchema);
module.exports = TestRunQueue;