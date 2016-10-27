var mongoose = require('mongoose');

var testRunSchema = mongoose.Schema({
  testNumber: Number,
  portNumber: Number,
  passedCount: {type: Number, default: 0},
  failedCount: {type: Number, default: 0},
  startedAt: Date,
  endedAt: Date,
  status: String,
  expectedValue: String,
  actualValue: String,
  errorObjects: {type: Array, default: []}
});

var TestRun = mongoose.model('TestRun', testRunSchema);
module.exports = TestRun;