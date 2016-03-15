var extend = require('lodash').extend;
var round = require('lodash').round;

function percent(val, total) {
  return round(val / total * 100, 1);
}

module.exports = function (stats) {
  return extend(stats, {
    passesPercent: percent(stats.passes, stats.tests),
    failuresPercent: percent(stats.failures, stats.tests),
    pendingPercent: percent(stats.pending, stats.tests)
  });
};
