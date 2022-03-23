import test from 'tape';
import getURLSearchParams from '../src/getURLSearchParams';

test('test getURLSearchParams function', (t) => {
  const testCases = [
    {
      input:
        '?project=testproject&query1=test&silly=willy&field[0]=zero&field[2]=two#test=hash&chucky=cheese',
      expect: {
        project: 'testproject',
        query1: 'test',
        silly: 'willy',
        'field[0]': 'zero',
        'field[2]': 'two#test=hash',
        chucky: 'cheese',
      },
    },
    {
      input: '',
      expect: {},
    },
  ];

  var val;
  testCases.forEach((testCase) => {
    val = getURLSearchParams(testCase.input);
    t.deepEqual(
      val,
      testCase.expect,
      `when call getURLSearchParams(${JSON.stringify(
        testCase.input
      )}), then it returns as expected`
    );
  });
  t.end();
});
