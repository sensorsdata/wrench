import test from 'tape';
import getUA from '../src/getUA';

test('test getUA function', (t) => {
  const testCases = [
    {
      ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.109 Safari/537.36',
      browser: 'chrome',
      expect: {
        chrome: 98,
      },
    },
    {
      ua: 'Mozilla/5.0 (iPad; CPU OS 13_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Mobile/15E148 Safari/604.1',
      browser: 'safari',
      expect: {
        safari: 13,
      },
    },
    {
      ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:97.0) Gecko/20100101 Firefox/97.0',
      browser: 'firefox',
      expect: {
        firefox: 97,
      },
    },
    {
      ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Edge/97.0.1072.55',
      browser: 'edge',
      expect: {
        edge: 97,
      },
    },
    {
      ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Opera/83.0.4254.62 (Edition B2)',
      browser: 'opera',
      expect: {
        opera: 83,
      },
    },
    {
      ua: 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; rv:11.0) like Gecko',
      browser: 'ie',
      expect: {
        ie: 11,
      },
    },
    {
      ua: 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; QQDownload 691; .NET CLR 2.0.50727; InfoPath.2; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; .NET4.0C)',
      browser: 'ie',
      expect: {
        ie: 8,
      },
    },
  ];

  global.navigator = {
    userAgent: '',
  };
  var val;
  val = getUA();
  t.deepEqual(
    val,
    {},
    'call getUA() when navigator.userAgent == "" and then it returns {}'
  );

  testCases.forEach((testCase) => {
    global.navigator.userAgent = testCase.ua;
    val = getUA();
    t.deepEqual(
      val,
      testCase.expect,
      `when current browser is ${
        testCase.browser
      } call getUA() and it returns ${JSON.stringify(testCase.expect)}`
    );
  });
  t.end();
});
