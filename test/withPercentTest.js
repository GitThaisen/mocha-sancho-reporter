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
        passesPercent: .9,
        failuresPercent: .03,
        pendingPercent: .07,
        tests: 100
      })
  });

  it('rounds the percentage to three decimal points', function () {
    var result = withPercent({passes: 2, failures: 1, pending: 4, tests: 7});
    assert.equal(result.passesPercent, 0.286);
    assert.equal(result.failuresPercent, 0.143);
    assert.equal(result.pendingPercent, 0.571);
  });
});
