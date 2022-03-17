import test from 'tape';
import isHttpUrl from '../src/isHttpUrl';

const testCases = [
  {
    input: 'https://www.example.com',
    expect: true,
  },
  {
    input: 'www.example.com',
    expect: false,
  },
  { input: null, expect: false },
  { input: undefined, expect: false },
  { input: 666, expect: false },
  { input: {}, expect: false },
  { input: true, expect: false },
];

test('test isHttpUrl function', (t) => {
  var val;
  testCases.forEach((testCase) => {
    val = isHttpUrl(testCase.input);
    t.equal(
      val,
      testCase.expect,
      `when call isHttpUrl(${JSON.stringify(
        testCase.input
      )}), then it returns ${JSON.stringify(testCase.expect)}`
    );
  });
  t.end();
});
