var withPercent = require('../lib/util/withPercent');
var assert = require('assert');

describe('withPercent(stats)', function () {
  it('adds percentage values for "passes", "failures" and "pending"', function () {
    assert.deepEqual(
      withPercent({
        passes: 90,
        failures: 3,
        pending: 7,
        tests: 100
      }),
      {
        passes: 90,
        failures: 3,
        pending: 7,
        passesPercent: 90,
        failuresPercent: 3,
        pendingPercent: 7,
        tests: 100
      })
  });

  it('rounds the percentage to three decimal points', function () {
    var result = withPercent({passes: 2, failures: 1, pending: 4, tests: 7});
    assert.equal(result.passesPercent, 28.6);
    assert.equal(result.failuresPercent, 14.3);
    assert.equal(result.pendingPercent, 57.1);
  });
});
