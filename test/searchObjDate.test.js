import test from 'tape';
import searchObjDate from '../src/searchObjDate';

test('test searchObjDate function', (t) => {
  const testCases = [
    {
      input: { a: new Date('2020-02-02 8:0:12') },
      expect: { a: '2020-02-02 08:00:12.00' },
    },
    {
      input: 'test',
      expect: 'test',
    },
    {
      input: {
        a: new Date('2020-02-02 8:0:12'),
        b: {
          b_child: new Date('2020-02-03 8:0:12'),
        },
        c: 'test',
      },
      expect: {
        a: '2020-02-02 08:00:12.00',
        b: {
          b_child: '2020-02-03 08:00:12.00',
        },
        c: 'test',
      },
    },
  ];

  // var val;
  // searchObjDate(testCases[0].input);
  // // console.log(val);
  // t.deepEqual(testCases[0].input, testCases[0].expect);

  testCases.forEach((testCase) => {
    searchObjDate(testCase.input);
    t.deepEqual(
      testCase.input,
      testCase.expect,
      `call searchObjDate(${JSON.stringify(
        testCase.input
      )}), and then the input object turns to ${JSON.stringify(
        testCase.expect
      )}`
    );
  });
  t.end();
});
