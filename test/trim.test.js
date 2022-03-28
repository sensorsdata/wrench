import test from 'tape';
import trim from '../src/trim';

test('test trim function', (t) => {
  const testCases = [
    {
      input: ' hello world begins with whitespace',
      expect: 'hello world begins with whitespace',
    },
    {
      input: 'hello wolrd ends with whitespace ',
      expect: 'hello wolrd ends with whitespace',
    },
    {
      input: ' hello wolrd begins and ends with whitespace ',
      expect: 'hello wolrd begins and ends with whitespace',
    },
    {
      input:
        '       hello wolrd begins and ends with multiple whitespace         ',
      expect: 'hello wolrd begins and ends with multiple whitespace',
    },
  ];

  testCases.forEach((testCase) => {
    const val = trim(testCase.input);
    t.equal(
      val,
      testCase.expect,
      `when call trim("${testCase.input}"), then it returns "${testCase.expect}"`
    );
  });
  t.end();
});
