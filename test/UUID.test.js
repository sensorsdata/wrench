import Sinon from 'sinon';
import test from 'tape';
import UUID from '../src/UUID';

test('test UUID function', (t) => {
  global.screen = { height: 960, width: 1080 };
  global.navigator = {
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36',
  };

  var val = UUID();
  t.ok(val, `call UUID() then it returns "${val}"`);

  // 浏览器屏幕宽度取值为 0
  Sinon.stub(global.screen, 'width').value(0);
  val = UUID();
  t.ok(val, `call UUID() then it returns "${val}"`);
  Sinon.restore();

  // 当 buffer.length > 0
  Sinon.stub(global.navigator, 'userAgent').value(
    'User-Agent, Openwave/ UCWEB7.0.2.37/28/999'
  );
  val = UUID();
  t.ok(val, `call UUID() then it returns "${val}"`);

  Sinon.restore();
  delete global.navigator;
  delete global.screen;
  t.end();
});
