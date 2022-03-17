import test from 'tape';
import toArray from '../src/toArray';

const testCases = [
  { input: undefined, expect: [] },
  { input: [1, 2, 3], expect: [1, 2, 3] },
  { input: { a: 1, b: 2 }, expect: [1, 2] },
  { input: { a: 1, b: [1, 2, 3] }, expect: [1, [1, 2, 3]] },
];

test('test toArray function', (t) => {
  var val;
  testCases.forEach((testCase) => {
    val = toArray(testCase.input);
    t.deepEqual(
      val,
      testCase.expect,
      `when call toArray(${JSON.stringify(
        testCase.input
      )}), then it returns ${JSON.stringify(testCase.expect)}`
    );
  });

  t.end();
});
