import test from 'tape';
import _decodeURI from '../src/_decodeURI';
import sinon from 'sinon';

test('test _decodeURI function', (t) => {
  var spy = sinon.spy(global, 'decodeURI');
  let val = _decodeURI('hello%20world');
  t.ok(spy.calledOnce, 'when _decodeURI called, then decodeURI will be called once.');
  t.equal(val, 'hello world', 'when call  _decodeURI("hello%20world"), then it returns "hello world"');

  sinon.restore();

  sinon.stub(global, 'decodeURI').throws('some exception');
  val = _decodeURI('hello%20world');
  t.equal(val, 'hello%20world', 'when call _decodeURI("hello%20world") exception happens,then return original input "hello%20world"');
  t.end();
});