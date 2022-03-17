import test from 'tape';
import each from '../src/each';

const testCases = [
  // isArray(obj)
  {
    input: [1, 2, 3],
    expect: [11, 12, 13],
    iterator: function (v, i, arr) {
      arr[i] = v + 10;
    },
  },
  // isObject(obj)
  {
    input: {
      a: 1,
      b: 2,
      c: 3,
    },
    expect: {
      a: 11,
      b: 12,
      c: 13,
    },
    iterator: function (value, key, obj) {
      obj[key] = value + 10;
    },
  },
];

test('test each function', (t) => {
  // obj == null
  [null, undefined].forEach((item) => {
    var val = each(item);
    t.equal(
      val,
      false,
      `when call ${JSON.stringify(item)}, and then it returns false`
    );
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

  t.end();
});
