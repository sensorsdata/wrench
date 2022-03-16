import test from 'tape';
import isString from '../src/isString';

const testCases = [
  { input: '1234', expect: true },
  { input: 123, expect: false },
  { input: null, expect: false },
  { input: undefined, expect: false },
  { input: function(){}, expect: false },
  { input: new Date('2020-2-2 8:0:12'), expect: false },
  { input: new RegExp('\\w+'), expect: false },
];

test('test isString function', (t) => {
  testCases.forEach((testCase) => {
    const val = isString(testCase.input);
    t.equal(val, testCase.expect, `when call isString(${testCase.input}), then it returns ${testCase.expect}`);
  });
  t.end();
});
