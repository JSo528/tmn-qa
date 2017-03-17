var tests = require('./handlers/tests.js');
var jobs = require('./handlers/jobs.js');
var tools = require('./handlers/tools.js');

module.exports = function(app) {
  // tests
  app.get('/', tests.testNew);
  app.get('/test-results', tests.testIndex);
  app.get('/test-results/:id', tests.testShow);
  app.post('/kill-test/:id', tests.killTest);

  app.post('/api/run-test', tests.runTest);
  app.get('/api/test-runs/:id', tests.testJson);
  app.post('/api/run-next-test', tests.runNextTest);

  // tools
  app.get('/tools', tools.toolIndex);
  app.post('/remove-old-test-data', tools.removeOldTestData);
  app.post('/api/email-test-results', tools.emailTestResults);

  // jobs
  app.get('/jobs', jobs.jobIndex);
  app.post('/api/jobs/:id', jobs.jobUpdate);
}