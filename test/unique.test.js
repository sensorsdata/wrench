import test from 'tape';
import unique from '../src/unique';

test('test unique function', (t) => {
  const testCases = [
    { input: [1, 1, 2, 3, 3, 4, 5], expect: [1, 2, 3, 4, 5] },
    { input: [1, 2, 3, 4, 5], expect: [1, 2, 3, 4, 5] },
    { input: [], expect: [] }
  ];

  testCases.forEach((testCase) => {
    const val = unique(testCase.input);
    t.deepEqual(
      val,
      testCase.expect,
      `when call unique("[${testCase.input}]"), then it returns "[${testCase.expect}]"`
    );
  });
  t.end();
});
