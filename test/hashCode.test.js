import test from 'tape';
import hashCode from '../src/hashCode';

const testCases = [
  { input: 'hello world', expect: 1794106052 },
  { input: '', expect: 0 },
  { input: undefined, expect: 0 },
  { input: null, expect: 0 },
  { input: 666, expect: 0 },
  { input: {}, expect: 0 }
];

test('test hashCode function', (t) => {
  var val;
  testCases.forEach((testCase) => {
    val = hashCode(testCase.input);
    t.equal(
      val,
      testCase.expect,
      `when call isString(${JSON.stringify(testCase.input)}), then it returns ${
        testCase.expect
      }`
    );
  });

  val = hashCode(function () {});
  t.equal(val, 0, 'when call isString(function () {}), then it returns 0');
  t.end();
});
