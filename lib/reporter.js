var fs = require('fs');
var path = require('path');
var inherits = require('util').inherits;
var mkdirp = require('mkdirp');
var Dot = require('mocha/lib/reporters/dot');
var Report = require('./Report');
var renderHtmlReport = require('./html/render');

function Reporter(runner, mochaOptions) {
  Dot.call(this, runner);

  mochaOptions = mochaOptions || {};
  var reporterOptions = Object.assign({
    reportPath: './test-report.html',
    suppressConsole: true
  }, mochaOptions.reporterOptions);

  var self = this;
  var report = Report.create();
  report.captureLog(reporterOptions.suppressConsole);


  runner.on('end', function () {
    report.uncaptureLog();
    self.epilogue();

    try {
      console.log('  Writing html report to:', reporterOptions.reportPath);
      console.log();
      mkdirp.sync(path.dirname(reporterOptions.reportPath));
      fs.writeFileSync(reporterOptions.reportPath, renderHtmlReport(report, this.stats));
    } catch (e) {
      console.error(e.stack);
    }
  });

  runner.on('suite', function (suite) {
    report.push(suite);
  });

  runner.on('suite end', function () {
    report.pop();
  });

  runner.on('test', function (test) {
    report.push(test);
  });

  runner.on('pending', function (test) {
    report.push(test);
  });

  runner.on('test end', function () {
    report.pop();
  });

  runner.on('hook', function (hook) {
    report.push(hook);
  });

  runner.on('hook end', function () {
    report.pop();
  });

  runner.on('fail', function (test, err) {
    report.setCurrentFailed(err);
  });

  runner.on('pass', function () {
    report.setCurrentPassed();
  });
}

inherits(Reporter, Dot);

module.exports = Reporter;
