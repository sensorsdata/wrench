import test from 'tape';
import isUndefined from '../src/isUndefined';

const testCases = [
  { input: undefined, expect: true },
  { input: null, expect: false },
];

test('test isUndefined function', (t) => {
  testCases.forEach((testCase) => {
    const val = isUndefined(testCase.input);
    t.equal(val, testCase.expect, `when call isUndefined("${testCase.input}"), then it returns "${testCase.expect}"`);
  });
  
  t.end();
});
