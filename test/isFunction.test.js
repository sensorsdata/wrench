import test from 'tape';
import isFunction from '../src/isFunction';

const testCases = [
  { input: 666, expect: false },
  { input: 'test', expect: false },
  { input: true, expect: false },
  { input: null, expect: false },
  { input: undefined, expect: false },
  { input: new Object(), expect: false },
  { input: new Date(), expect: false },
];

test('test isFunction function', (t) => {
  var val = isFunction(function () {});
  t.equal(val, true, 'when call isFunction(function () {}), then it returns true');

  testCases.forEach((testCase) => {
    val = isFunction(testCase.input);
    t.equal(
      val,
      testCase.expect,
      `when call isFunction(${JSON.stringify(testCase.input)}), then it returns ${
        testCase.expect
      }`
    );
  });
  t.end();
});
