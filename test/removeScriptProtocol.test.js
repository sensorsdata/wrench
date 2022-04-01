import test from 'tape';
import removeScriptProtocol from '../src/removeScriptProtocol';

test('test removeScriptProtocol function', (t) => {
  const testCases = [
    { input: 'javascript:alert(123)', expect: ':alert(123)' },
    { input: '', expect: '' },
    { input: 666, expect: '' },
    { input: null, expect: '' },
    { input: undefined, expect: '' },
    { input: {}, expect: '' }
  ];
  
  var val;
  testCases.forEach((testCase) => {
    val = removeScriptProtocol(testCase.input);
    t.equal(
      val,
      testCase.expect,
      `when call removeScriptProtocol(${JSON.stringify(
        testCase.input
      )}), then it returns ${JSON.stringify(testCase.expect)}`
    );
  });
  t.end();
});
