import test from 'tape';
import isObject from '../src/isObject';

const testCases = [
  { input: null, expect: false },
  { input: {test: 2}, expect: true },
];

test('test isObject function', (t) => {
  testCases.forEach((testCase) => {
    const val = isObject(testCase.input);
    t.deepEqual(
      val,
      testCase.expect,
      `when call isObject(${testCase.input}), then it returns ${testCase.expect}`
    );
  });
  t.end();
});
