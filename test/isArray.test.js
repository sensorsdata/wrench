import test from 'tape';
import isArray from '../src/isArray';

const testCases = [
  { input: [1, 2, 3], expect: true },
  { input: {}, expect: false },
  { input: undefined, expect: false },
  { input: null, expect: false },
  { input: 666, expect: false },
  { input: '666', expect: false },
];

test('test isArray function', (t) => {
  testCases.forEach((testCase) => {
    const val = isArray(testCase.input);
    t.equal(val, testCase.expect, `when call isArray(${JSON.stringify(testCase.input)}), then it returns ${testCase.expect}`);
  });

  t.end();
});
