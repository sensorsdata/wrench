import test from 'tape';
import sinon from 'sinon';
import filter from '../src/filter';


test('test filter function', (t) => {
  // !arr.filter
  sinon.stub(Array.prototype, 'filter').value(undefined);
  var arr = [1, 2, 3, 4, 5, 6];
  var fn = function (v) {
    return v >= 4;
  };
  var val = filter(arr, fn);
  t.deepEqual(val, [4, 5, 6], 'success');

  sinon.restore();

  // arr.filter
  arr = [1, 2, 3, 4, 5, 6, 7];
  val = filter(arr, fn);
  t.deepEqual(val, [4, 5, 6, 7], 'success');

  sinon.stub(Array.prototype, 'filter').value(undefined);
  sinon.stub(Object.prototype, 'hasOwnProperty').callsFake(function fn() {
    return false;
  });
  arr = [3, 7, 8, 9];

  val = filter(arr, fn);
  t.deepEqual(val, [], 'success');

  sinon.restore();
  t.end();
});
