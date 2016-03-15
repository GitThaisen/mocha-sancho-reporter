var extend = require('lodash').extend;
var compact = require('lodash').compact;
var template = require('lodash').template;
var fs = require('fs');
var util = require('util');
var ms = require('mocha/lib/ms');
var withPercent = require('../util/withPercent');
var elementTpl = template(fs.readFileSync(__dirname + '/templates/element.tpl.html'));
var reportTpl = template(fs.readFileSync(__dirname + '/templates/report.tpl.html'));
var normalizeCss = fs.readFileSync(__dirname + '/styles/normalize.css');
var stylesCss = fs.readFileSync(__dirname + '/styles/styles.css');

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
  var cssClasses = compact([
    element.type,
    element.isRoot() ? 'root' : null,
    element.fail ? 'fail' : null,
    element.pass ? 'pass' : null,
    element.pending ? 'pending' : null,
    element.containsFailures ? 'contains-failures' : null,
    (testOutput || hooksOutput || err) ? 'has-details' : null
  ]).join(' ');

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
  return extend(withPercent(stats), {duration: ms(stats.duration)});
}

module.exports = function (report, stats) {
  try {
    return reportTpl({
      report: mapElement(report.root(), 0, report.calculateDepth()),
      stats: mapStats(stats),
      styleSheets: [normalizeCss, stylesCss]
    });
  } catch (e) {
    console.error(e.stack);
  }
};
