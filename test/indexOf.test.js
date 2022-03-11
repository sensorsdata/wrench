import test from 'tape';
import indexOf from '../src/indexOf';
import sinon from 'sinon';

test('test indexOf function', (t) => {
  var spy = sinon.spy(Array.prototype, 'indexOf');
  let val = indexOf([1, 2, 3], 1);
  t.ok(spy.calledOnce, 'when indexOf called, then Array.prototype.indexOf will be called once.');
  t.equal(val, 0, 'when call indexOf([1, 2, 3], 1), then it returns 0');

  sinon.restore();

  sinon.stub(Array.prototype).indexOf = undefined;
  val = indexOf([1, 2, 3], 1);
  t.equal(val, 0, 'Array.prototype.indexOf == undefined, when call indexOf([1, 2, 3], 1), then it returns 0');

  val = indexOf([1, 2, 3], 0);
  t.equal(val, -1, 'Array.prototype.indexOf == undefined, when call indexOf([1, 2, 3], 0), then it returns -1');
  
  sinon.restore();

  t.end();
});
