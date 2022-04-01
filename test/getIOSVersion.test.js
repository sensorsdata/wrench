import sinon from 'sinon';
import test from 'tape';
import getIOSVersion from '../src/getIOSVersion';

test('test getIOSVersion function', (t) => {
  const testCases = [
    {
      appVersion:
        '5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36',
      expect: ''
    },
    {
      appVersion:
        'Mozilla/5.0 (iPad; CPU OS 13_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Mobile/15E148 Safari/604.1 IMO',
      expect: 13
    }
  ];

  global.navigator = {
    appVersion: ''
  };
  
  // start test
  var val;
  testCases.forEach((testCase) => {
    navigator.appVersion = testCase.appVersion;
    val = getIOSVersion();
    t.equal(
      val,
      testCase.expect,
      'when call getIOSVersion(), then it returns as expected'
    );
  });

  sinon.stub(Number, 'parseInt').throws('some exception');
  val = getIOSVersion();
  t.equal(
    val,
    '',
    'call getIOSVersion() when some exceptions happened, then it returns ""'
  );

  sinon.restore();
  delete global.navigator;
  t.end();
});
