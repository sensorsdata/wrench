import Sinon from 'sinon';
import test from 'tape';
// import sinon from 'sinon';
import UUID from '../src/UUID';

test('test UUID function', (t) => {
  global.screen = {
    height: 960,
    width: 1080,
  };
  global.navigator = {
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36',
  };

  var val = UUID();
  console.log(val);
  t.ok(val, 'UUID function as expected');

  // 浏览器屏幕宽度取值为 0
  Sinon.stub(global.screen, 'width').value(0);
  val = UUID();
  console.log(val);
  t.ok(val, 'UUID function as expected');
  Sinon.restore();

  // buffer.length > 0
  Sinon.stub(global.navigator, 'userAgent').value(
    'User-Agent, Openwave/ UCWEB7.0.2.37/28/999'
  );
  val = UUID();
  console.log(val);
  t.ok(val, 'UUID function as expected');
  
  Sinon.restore();
  delete global.navigator;
  delete global.screen;
  t.end();
});
