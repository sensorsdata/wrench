import test from 'tape';
import toArray from '../src/toArray';

test('test toArray function', (t) => {
  const testCases = [
    { input: null, expect: [] },
    { input: undefined, expect: [] },
    { input: [1, 2, 3], expect: [1, 2, 3] },
    { input: { a: 1, b: 2 }, expect: [1, 2] },
    { input: { a: 1, b: [1, 2, 3] }, expect: [1, [1, 2, 3]] },
  ];

  var val;
  testCases.forEach((testCase) => {
    val = toArray(testCase.input);
    t.deepEqual(
      val,
      testCase.expect,
      `when call toArray(${JSON.stringify(
        testCase.input
      )}), then it returns ${JSON.stringify(testCase.expect)}`
    );
  });

  // if iterable.toArray
  var Parent = function () {
    this.a = 1;
    this.b = 2;
  };
  Parent.prototype.toArray = function () {
    var result = [this.a, this.b];
    return result;
  };
  var iterable = new Parent();
  val = toArray(iterable);
  t.deepEqual(
    val,
    [1, 2],
    'call toArray(iterable) when iterable.toArray exists, then it returns as expected'
  );

  t.end();
});
