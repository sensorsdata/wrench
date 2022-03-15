import test from 'tape';
import isString from '../src/isString';

const testCases = [
  { input: '1234', expect: true },
  { input: 123, expect: false },
];

test('test isString function', (t) => {
  testCases.forEach((testCase) => {
    const val = isString(testCase.input);
    t.equal(val, testCase.expect, `when call isString("${testCase.input}"), then it returns "${testCase.expect}"`);
  });
  t.end();
});
