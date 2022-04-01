import test from 'tape';
import sinon from 'sinon';
import isSupportBeaconSend from '../src/isSupportBeaconSend';

test('test isSupportBeaconSend function', (t) => {
  const testCases = [
    // blackberry safari > 12
    {
      ua: 'User-Agent, Mozilla/5.0 (BlackBerry; U; BlackBerry 9800; en) AppleWebKit/534.1+ (KHTML, like Gecko) Version/13.0.0.337 Mobile Safari/534.1+',
      expect: true,
      msg: 'the device is blacberry and safari version is 13.0.0.337'
    },
    // blackberry safari < 12
    {
      ua: 'User-Agent, Mozilla/5.0 (BlackBerry; U; BlackBerry 9800; en) AppleWebKit/534.1+ (KHTML, like Gecko) Version/11.0.0.337 Mobile Safari/534.1+',
      expect: false,
      msg: 'the device is blacberry and safari version is 11.0.0.337'
    },
    // iphone safari:13.0.0.337
    {
      ua: 'User-Agent,Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_3 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/13.0.0.337 Mobile/8J2 Safari/6533.18.5',
      expect: true,
      msg: 'the device is iphone and safari version is 13.0.0.337'
    },
    // typeof Sys.safari === 'undefined'
    // ver[0] && ver[0] < 13, chrome > 41
    {
      ua: 'User-Agent: Mozilla/5.0 (Linux; U; CPU iPhone OS 4_3_3 like Mac OS X; zh-cn; HTC_Wildfire_A3333 Build/FRG83D) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Chrome/99.0.4844.74',
      expect: true,
      msg: 'the device is iPhone and Chrome version is 99.0.4844.74'
    },
    // ver[0] && ver[0] < 13, chrome < 41
    {
      ua: 'User-Agent: Mozilla/5.0 (Linux; U; CPU iPhone OS 4_3_3 like Mac OS X; zh-cn; HTC_Wildfire_A3333 Build/FRG83D) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Chrome/39.0.4844.74',
      expect: false,
      msg: 'the device is iPhone and Chrome version is 39.0.4844.74'
    },
    // ver[0] && ver[0] > 13, chrome > 41
    {
      ua: 'User-Agent: Mozilla/5.0 (Linux; U; CPU iPhone OS 14_3_3 like Mac OS X; zh-cn; HTC_Wildfire_A3333 Build/FRG83D) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Chrome/99.0.4844.74',
      expect: true,
      msg: 'the device is iPhone and Chrome version is 99.0.4844.74'
    },
    // 非移动端
    // Mac OS X, Chrome/99.0.4844.74 Safari/537.36
    {
      ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36',
      expect: true,
      msg: 'the device is Mac OS X and Chrome version is 99.0.4844.74'
    },
    // Mac OS X, Chrome/29.0.4844.74 Safari/537.36
    {
      ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.4844.74 Safari/537.36',
      expect: false,
      msg: 'the device is Mac OS X and Chrome version is 29.0.4844.74'
    }
  ];

  global.navigator = {
    sendBeacon: function () {},
    userAgent: ''
  };

  // navigator == "object" && typeof navigator.sendBeacon == 'function'
  testCases.forEach((testCase) => {
    sinon.stub(global.navigator, 'userAgent').value(testCase.ua);
    const val = isSupportBeaconSend();
    t.equal(
      val,
      testCase.expect,
      `call isSupportBeaconSend() when ${JSON.stringify(
        testCase.msg
      )}, then it returns ${testCase.expect}`
    );
    sinon.restore();
  });

  // navigator !== "object"
  sinon.stub(global, 'navigator').value(undefined);
  var val = isSupportBeaconSend();
  t.equal(
    val,
    false,
    'call isSupportBeaconSend() when navigator !== "object", then it returns false'
  );

  sinon.restore();
  delete global.navigator;
  t.end();
});
