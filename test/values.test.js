import test from 'tape';
import values from '../src/values';

const testCases = [
  {
    input: {
      a: 1,
      b: 2,
      c: 'hello',
    },
    expect: [1, 2, 'hello'],
  },
  {
    input: {
      a: 1,
      b: 2,
      c: 'hello',
      d: {
        d_child: 'world',
      },
    },
    expect: [1, 2, 'hello', { d_child: 'world' }],
  },
  { input: null, expect: [] },
  { input: undefined, expect: [] },
];
test('test values function', (t) => {
  var val;
  testCases.forEach((testCase) => {
    val = values(testCase.input);
    t.deepEqual(
      val,
      testCase.expect,
      `when call values(${JSON.stringify(
        testCase.input
      )}), then it returns ${JSON.stringify(testCase.expect)}`
    );
  });
  t.end();
});
