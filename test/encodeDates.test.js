import test from 'tape';
import encodeDates from '../src/encodeDates';

test('test encodeDates function', (t) => {
  const testCases = [
    {
      input: { a: new Date('2020-02-02 8:0:12') },
      expect: { a: '2020-02-02 08:00:12.00' },
    },
    {
      input: {
        a: new Date('2020-02-02 8:0:12'),
        b: 'test',
        c: { c_child: new Date('2020-02-03 8:0:12') },
      },
      expect: {
        a: '2020-02-02 08:00:12.00',
        b: 'test',
        c: { c_child: '2020-02-03 08:00:12.00' },
      },
    },
  ];

  testCases.forEach((testCase) => {
    const val = encodeDates(testCase.input);
    t.deepEqual(
      val,
      testCase.expect,
      `when call encodeDates(${JSON.stringify(
        testCase.input
      )}), then it returns ${JSON.stringify(testCase.expect)}`
    );
  });

  t.end();
});
