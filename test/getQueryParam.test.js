import test from 'tape';
import getQueryParam from '../src/getQueryParam';

const testCases = [
  {
    url: 'https://a.b.com?a=1&b=2',
    key: 'b',
    expect: '2',
  },
  {
    url: 'https://a.b.com?a=1&b=2',
    key: 'c',
    expect: '',
  },
  {
    url: 'https://a.b.com',
    key: 'a',
    expect: '',
  },
  {
    url: 'https://a.b.com?a=1&b=2&c=3',
    key: 'c=',
    expect: '',
  },
];

test('test getQueryParam function', (t) => {
  var val;
  testCases.forEach((testCase) => {
    val = getQueryParam(testCase.url, testCase.key);
    t.equal(
      val,
      testCase.expect,
      `when call getQueryParam(${JSON.stringify(
        testCase.url
      )}, ${JSON.stringify(testCase.key)}), then it returns ${JSON.stringify(
        testCase.expect
      )}`
    );
  });
  t.end();
});
