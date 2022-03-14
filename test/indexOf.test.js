import test from 'tape';
import indexOf from '../src/indexOf';
import sinon from 'sinon';

test('test indexOf function', (t) => {
  var arr = [1, 2, 3];
  var spy = sinon.spy(Array.prototype, 'indexOf');
  let val = indexOf(arr, 1);
  t.ok(spy.calledOnce, 'when indexOf called, then Array.prototype.indexOf will be called once.');
  t.equal(val, 0, 'when call indexOf([1, 2, 3], 1), then it returns 0');

  sinon.restore();

  var stub = sinon.stub(Array.prototype, 'indexOf').value(undefined);

  val = indexOf(arr, 1);
  t.equal(val, 0, 'call indexOf([1, 2, 3], 1) when Array.prototype.indexOf == undefined, then it returns 0');

  val = indexOf(arr, 0);
  t.equal(val, -1, 'call indexOf([1, 2, 3], 0) when Array.prototype.indexOf == undefined, then it returns -1');

  stub.restore();

  t.end();
});