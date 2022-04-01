import test from 'tape';
import sinon from 'sinon';
import map from '../src/map';

test('test map function', (t) => {
  const obj = [1, 2, 3];
  const iterator = function (value, index, arr) {
    console.log(value, index, arr);
    return value + 10;
  };
  const target = [11, 12, 13];

  const testCases = [
    // obj == null 的情况
    { input: null, expect: [] },
    { input: undefined, expect: [] },
    // obj !== null
    { input: obj, expect: target }
  ];

  var val;
  testCases.forEach((testCase) => {
    val = map(testCase.input, iterator);
    t.deepEqual(val, testCase.expect, `when call map(${JSON.stringify(testCase.input)}), then it returns []`);
  });

  // Array.prototype.map 不兼容的情况
  var stub = sinon.stub(Array.prototype, 'map').value(undefined);
  val = map(obj, iterator);
  t.deepEqual(val, target, `when call map(${JSON.stringify(obj)}), then it returns ${JSON.stringify(target)}`);

  stub.restore();
  t.end();
});
