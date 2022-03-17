import test from 'tape';
import isBoolean from '../src/isBoolean';

const testCases = [
  { input: true, expect: true },
  { input: 0, expect: false },
  { input: 'test', expect: false },
  { input: undefined, expect: false },
  { input: null, expect: false },
  { input: {}, expect: false },
  { input: [], expect: false },
];

test('test isBoolean function', (t) => {
  testCases.forEach((testCase) => {
    const val = isBoolean(testCase.input);
    t.deepEqual(
      val,
      testCase.expect,
      `when call isBoolean(${JSON.stringify(testCase.input)}), then it returns ${testCase.expect}`
    );
  });
  t.end();
});
