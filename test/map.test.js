import test from 'tape';
import sinon from 'sinon';
import map from '../src/map';

const obj = [1, 2, 3];
const iterator = function (value, index, arr) {
  console.log(value, index, arr);
  return value + 10;
};
const target = [11, 12, 13];

test('test map function', (t) => {
  let val;

  // obj == null 的情况
  [null, undefined].forEach((item) => {
    val = map(item, iterator);
    t.deepEqual(val, [], `when call map(${JSON.stringify(item)}), then it returns []`);
  });

  val = map(obj, iterator);
  t.deepEqual(
    val,
    target,
    `when call map(${JSON.stringify(obj)}), then it returns ${JSON.stringify(target)}`
  );

  // Array.prototype.map 不兼容
  var stub = sinon.stub(Array.prototype, 'map').value(undefined);
  val = map(obj, iterator);
  t.deepEqual(
    val,
    target,
    `when call map(${JSON.stringify(obj)}), then it returns ${JSON.stringify(target)}`
  );

  stub.restore();
  t.end();
});
