import test from 'tape';
import sinon from 'sinon';
import isSupportCors from '../src/isSupportCors';

test('test isSupportCors function', (t) => {
  global.window = {
    XMLHttpRequest: sinon.useFakeXMLHttpRequest()
  };

  sinon.stub(global.window, 'XMLHttpRequest').value(undefined);
  var val = isSupportCors();
  t.equal(
    val,
    false,
    'call isSupportCors() when window.XMLHttpRequest === "undefined", then it returns false'
  );
  sinon.restore();

  global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();

  // 'withCredentials' in new XMLHttpRequest()
  sinon.stub(global, 'XMLHttpRequest').callsFake(function fn() {
    this.withCredentials = true;
  });
  val = isSupportCors();
  t.equal(
    val,
    true,
    'call isSupportCors() when "withCredentials" in new XMLHttpRequest(), then it returns true'
  );

  sinon.restore();

  // typeof XDomainRequest !== 'undefined'
  global.XDomainRequest = function () {};
  val = isSupportCors();
  t.equal(
    val,
    true,
    'call isSupportCors() when typeof XDomainRequest !== "undefined", then it returns true'
  );

  delete global.XDomainRequest;
  val = isSupportCors();
  t.equal(val, false, 'when call isSupportCors(), then it returns false');

  delete global.XMLHttpRequest;
  delete global.window;
  t.end();
});
