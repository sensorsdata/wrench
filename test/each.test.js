import Sinon from 'sinon';
import test from 'tape';
import each from '../src/each';

test('test each function', (t) => {
  // 模拟测试用例
  // 对象继承：原型式继承
  function Parent() {
    this.father = 52;
  }
  Parent.prototype.getParentValue = function () {
    return this.value;
  };
  function Child(first, second) {
    this.first = first;
    this.second = second;
  }
  Child.prototype = new Parent();
  var instance = new Child(10, 10);
  var target = new Child(20, 20);

  const testCases = [
    // isArray(obj)
    {
      input: [1, 2, 3],
      expect: [11, 12, 13],
      iterator: function (v, i, arr) {
        arr[i] = v + 10;
      }
    },
    // isObject(obj)
    {
      input: { a: 1, b: 2, c: 3 },
      expect: { a: 11, b: 12, c: 13 },
      iterator: function (value, key, obj) {
        obj[key] = value + 10;
      }
    },
    // instance 中有继承父对象的属性
    {
      input: instance,
      expect: target,
      iterator: function (value, key, obj) {
        obj[key] = value + 10;
      }
    },
    // input 为 0 / ''
    {
      input: 0,
      expect: 0,
      iterator: function (value, key, obj) {
        obj[key] = value + 10;
      }
    },
    {
      input: '',
      expect: '',
      iterator: function (value, key, obj) {
        obj[key] = value + 10;
      }
    }
  ];

  // start test
  // obj == null
  [null, undefined].forEach((item) => {
    var val = each(item);
    t.equal(val, false, `when call each(${item}), and then it returns false`);
  });

  // obj !== null
  testCases.forEach((testCase) => {
    each(testCase.input, testCase.iterator);
    t.deepEqual(
      testCase.input,
      testCase.expect,
      `when call each(${JSON.stringify(
        testCase.input
      )}), then it returns as expected`
    );
  });

  // arr.forEach !== nativeForEach
  Sinon.stub(Array.prototype, 'forEach').value(undefined);
  var arr = new Array(3).fill(10);
  each(arr, testCases[0].iterator);
  t.deepEqual(arr, [20, 20, 20], 'call each([10, 10, 10]) when arr.forEach !== nativeForEach, then it returns as expected');

  Sinon.restore();
  t.end();
});
