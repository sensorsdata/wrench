import test from 'tape';
import isArray from '../src/isArray';

const arr = [];
const obj = {};

test('test isArray function', (t) => {
  // 支持 Array.isArray 的情况
  var val = isArray(arr);
  t.equal(val, true, 'when call isArray([]), then it returns true');

  val = isArray(obj);
  t.equal(val, false, 'when call isArray({}), then it returns false');

  t.end();
});
