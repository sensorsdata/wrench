import test from 'tape';
import _decodeURIComponent from '../src/decodeURIComponent';
import sinon from 'sinon';

test('test _decodeURIComponent function', (t) => {
  var str = 'JavaScript_%D1%88%D0%B5%D0%BB%D0%BB%D1%8B';
  var spy = sinon.spy(global, 'decodeURIComponent');
  let val = _decodeURIComponent(str);

  t.ok(spy.calledOnce,'when _decodeURIComponent called, then decodeURIComponent will be called once.');
  t.equal(
    val,
    'JavaScript_шеллы',
    `when call  _decodeURIComponent(${str}), then it returns "JavaScript_шеллы"`
  );

  sinon.restore();

  sinon.stub(global, 'decodeURIComponent').throws('some exception');
  val = _decodeURIComponent(str);
  t.equal(
    val,
    str,
    `when call  _decodeURIComponent(${str}) exception happens,then return original input ${str}`
  );
  t.end();
});
