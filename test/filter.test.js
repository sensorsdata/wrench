import test from 'tape';
import sinon from 'sinon';
import filter from '../src/filter';

test('test filter function', (t) => {
  // !arr.filter
  var stub = sinon.stub(Array.prototype, 'filter');
  stub.value(undefined);
  var arr = [1, 2, 3, 4, 5, 6];
  var fn = function (v) {
    return v >= 4;
  };
  var val = filter(arr, fn);
  t.deepEqual(val, [4, 5, 6], 'success');

  // arr.filter
  stub.restore();
  arr = [1, 2, 3, 4, 5, 6, 7];
  val = filter(arr, fn);
  t.deepEqual(val, [4, 5, 6, 7], 'success');

  stub.value(undefined);
  sinon.stub(Object.prototype, 'hasOwnProperty').callsFake(function fn() {
    return false;
  });
  arr = [3, 7, 8, 9];

  val = filter(arr, fn);
  t.deepEqual(val, [], 'success');

  sinon.restore();
  t.end();
});
