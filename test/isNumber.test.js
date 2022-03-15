import test from 'tape';
import isNumber from '../src/isNumber';

const testCases = [
  { input: 1, expect: true },
  { input: true, expect: false },
];

test('test isNumber function', (t) => {
  testCases.forEach((testCase) => {
    const val = isNumber(testCase.input);
    t.deepEqual(
      val,
      testCase.expect,
      `when call isNumber(${testCase.input}), then it returns ${testCase.expect}`
    );
  });
  t.end();
});
