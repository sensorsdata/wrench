import test from 'tape';
import _decodeURI from '../src/decodeURI';
import getURL from '../src/getURL';

test('test getURL function', (t) => {
  global.location = { href: 'https://www.example.com' };
  var testCases = [
    {
      url: ' https://www.test.com',
      expect: 'https://www.test.com'
    },
    {
      url: 'https://developer.mozilla.org/ru/docs/JavaScript_%D1%88%D0%B5%D0%BB%D0%BB%D1%8B',
      expect: 'https://developer.mozilla.org/ru/docs/JavaScript_шеллы'
    },
    {
      url: 'https://mozilla.org/?x=%D1%88%D0%B5%D0%BB%D0%BB%D1%8B',
      expect: 'https://mozilla.org/?x=шеллы'
    },
    {
      url: null,
      expect: _decodeURI(location.href)
    },
    {
      url: undefined,
      expect: _decodeURI(location.href)
    }
  ];

  var val;
  testCases.forEach((testCase) => {
    val = getURL(testCase.url);
    t.equal(
      val,
      testCase.expect,
      `call getURL(${JSON.stringify(
        testCase.url
      )}), then it returns ${JSON.stringify(testCase.expect)}`
    );
  });

  // 未传入 url 时
  val = getURL();
  t.equal(
    val,
    _decodeURI(location.href),
    'call getURL() then it returns location.pathname'
  );

  delete global.location;
  t.end();
});