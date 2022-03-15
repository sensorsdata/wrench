import test from 'tape';
import isBoolean from '../src/isBoolean';

const testCases = [
  { input: true, expect: true },
  { input: 0, expect: false },
];

test('test isBoolean function', (t) => {
  testCases.forEach((testCase) => {
    const val = isBoolean(testCase.input);
    t.deepEqual(
      val,
      testCase.expect,
      `when call isBoolean(${testCase.input}), then it returns ${testCase.expect}`
    );
  });
  t.end();
});
