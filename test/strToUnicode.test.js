import test from 'tape';
import strToUnicode from '../src/strToUnicode';

test('test strToUnicode function', (t) => {
  const testCases = [
    { input: 'hello 世界', expect: '\\68\\65\\6c\\6c\\6f\\20\\4e16\\754c' },
    { input: null, expect: null },
    { input: undefined, expect: undefined },
    { input: 666, expect: 666 },
    { input: {}, expect: {} },
    { input: true, expect: true },
  ];

  var val;
  testCases.forEach((testCase) => {
    val = strToUnicode(testCase.input);
    t.deepEqual(
      val,
      testCase.expect,
      `when call strToUnicode(${JSON.stringify(
        testCase.input
      )}), then it returns ${JSON.stringify(testCase.expect)}`
    );
  });

  t.end();
});
