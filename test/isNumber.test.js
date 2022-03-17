import test from 'tape';
import isNumber from '../src/isNumber';

const testCases = [
  { input: 1, expect: true },
  { input: true, expect: false },
  { input: null, expect: false },
  { input: undefined, expect: false },
  { input: [], expect: false },
  { input: {}, expect: false },
];

test('test isNumber function', (t) => {
  testCases.forEach((testCase) => {
    const val = isNumber(testCase.input);
    t.deepEqual(
      val,
      testCase.expect,
      `when call isNumber(${JSON.stringify(testCase.input)}), then it returns ${
        testCase.expect
      }`
    );
  });
  t.end();
});
