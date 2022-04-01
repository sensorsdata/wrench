import test from 'tape';
import formatDate from '../src/formatDate';

test('test formatDate function', (t) => {
  const testCases = [
    { input: new Date('2020-2-2 8:0:12'), expect: '2020-02-02 08:00:12.00' }
  ];

  testCases.forEach((testCase) => {
    const val = formatDate(testCase.input);
    t.equal(
      val,
      testCase.expect,
      `when call formatDate(${testCase.input.toString()}), then it returns ${
        testCase.expect
      }`
    );
  });
  t.end();
});
