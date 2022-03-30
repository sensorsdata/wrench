import test from 'tape';
import isString from '../src/isString';

test('test isString function', (t) => {
  const testCases = [
    { input: '1234', expect: true },
    { input: 123, expect: false },
    { input: null, expect: false },
    { input: undefined, expect: false },
    { input: new Date('2020-2-2 8:0:12'), expect: false },
    { input: new RegExp('\\w+'), expect: false },
  ];

  var val;
  testCases.forEach((testCase) => {
    val = isString(testCase.input);
    t.equal(
      val,
      testCase.expect,
      `when call isString(${JSON.stringify(testCase.input)}), then it returns ${
        testCase.expect
      }`
    );
  });

  val = isString(function () {});
  t.equal(val, false, 'when call isString(function () {}), then it returns false');

  t.end();
});
