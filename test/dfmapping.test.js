import test from 'tape';
import dfmapping from '../src/dfmapping';

test('test dfmapping function', (t) => {
  const testCases = [
    { input: 'hello world', expect: 'zrkkm MmekV' },
    { input: 'zrkkm MmekV', expect: 'hello world' }
  ];

  var val;
  testCases.forEach((testCase) => {
    val = dfmapping(testCase.input);
    t.equal(
      val,
      testCase.expect,
      `when call dfmapping(${JSON.stringify(
        testCase.input
      )}), then it returns ${testCase.expect}`
    );
  });
  t.end();
});
