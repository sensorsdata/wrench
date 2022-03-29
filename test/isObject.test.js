import test from 'tape';
import isObject from '../src/isObject';

test('test isObject function', (t) => {
  const testCases = [
    { input: { test: 2 }, expect: true },
    { input: null, expect: false },
    { input: undefined, expect: false },
    { input: [], expect: false },
    { input: 123, expect: false },
    { input: new Date(), expect: false },
    { input: new RegExp(/^[0-9]*$/), expect: false },
  ];

  var val;
  testCases.forEach((testCase) => {
    val = isObject(testCase.input);
    t.deepEqual(
      val,
      testCase.expect,
      `when call isObject(${JSON.stringify(testCase.input)}), then it returns ${
        testCase.expect
      }`
    );
  });
  t.end();
});
