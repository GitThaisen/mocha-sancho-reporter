var template = require('lodash').template;
var fs = require('fs');
var util = require('util');
var ms = require('mocha/lib/ms');
var elementTpl = template(fs.readFileSync(__dirname + '/element.tpl.html'));
var reportTpl = template(fs.readFileSync(__dirname + '/report.tpl.html'));

function mapLogEntries(element) {
  return element.logEntries.map(function (entry) {
    return util.format.apply(util, entry);
  }).join('\n');
}

function mapHooks(hooks) {
  return hooks.map(mapLogEntries).join('\n');
}

function mapErr(err) {
  var result = '';
  if (err && err.stack) {
    result += err.stack;
  } else if (err) {
    result += String(err);
  }
  return result;
}

function mapElement(element, depth, maxDepth) {
  depth = depth || 0;
  var testOutput = mapLogEntries(element);
  var hooksOutput = mapHooks(element.hooks());
  var err = mapErr(element.err);
  var cssClasses = [
    element.type,
    element.isRoot() ? 'root' : '',
    element.fail ? 'fail' : '',
    element.pass ? 'pass' : '',
    element.pending ? 'pending' : '',
    (testOutput || hooksOutput || err) ? 'has-details' : ''
  ].join(' ');

  return elementTpl({
    id: element.id,
    cssClasses: cssClasses,
    depth: element.type == 'test' ? maxDepth : depth,
    title: element.title,
    testOutput: testOutput,
    hooksOutput: hooksOutput,
    err: err,
    children: element.children().map(function (child) {
      return mapElement(child, depth + 1, maxDepth);
    })
  });
}

function mapStats(stats) {
  return Object.assign(stats, {
    duration: ms(stats.duration)
  });
}

module.exports = function (report, stats) {
  try {
    return reportTpl({
      report: mapElement(report.root(), 0, report.calculateDepth()),
      stats: mapStats(stats)
    });
  } catch (e) {
    console.error(e.stack);
  }
};
