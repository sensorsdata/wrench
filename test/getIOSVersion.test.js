import test from 'tape';
// import Sinon from 'sinon';
import getIOSVersion from '../src/getIOSVersion';

test('test getIOSVersion function', (t) => {
  global.navigator = {
    appVersion:
      '5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36',
  };
  var val = getIOSVersion();
  console.log(val);
  t.end();
});
