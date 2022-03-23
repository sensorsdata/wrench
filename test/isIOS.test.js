import test from 'tape';
import isIOS from '../src/isIOS';

test('test isIOS function', (t) => {
  const testCases = [
    {
      ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.109 Safari/537.36',
      expect: false,
      msg: 'call isIOS() when the current operating system is not IOS, and it returns false',
    },
    {
      ua: 'Mozilla/5.0 (iPad; CPU OS 13_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Mobile/15E148 Safari/604.1',
      expect: true,
      msg: 'call isIOS() when the current operating system is IOS, and it returns true',
    },
  ];
  
  global.navigator = {
    userAgent: '',
  };

  var val;
  testCases.forEach((testCase) => {
    global.navigator.userAgent = testCase.ua;
    val = isIOS();
    t.equal(val, testCase.expect, testCase.msg);
  });

  delete global.navigator;
  t.end();
});
