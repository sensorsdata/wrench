import test from 'tape';
import isUndefined from '../src/isUndefined';

test('test isUndefined function', (t) => {
  const testCases = [
    { input: undefined, expect: true },
    { input: null, expect: false },
    { input: 0, expect: false },
    { input: 'test', expect: false },
    { input: {}, expect: false },
    { input: [1, 2, 3], expect: false },
  ];
  
  testCases.forEach((testCase) => {
    const val = isUndefined(testCase.input);
    t.equal(
      val,
      testCase.expect,
      `when call isUndefined(${JSON.stringify(
        testCase.input
      )}), then it returns ${testCase.expect}`
    );
  });

  t.end();
});
