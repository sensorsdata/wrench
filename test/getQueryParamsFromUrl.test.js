import test from 'tape';
import getQueryParamsFromUrl from '../src/getQueryParamsFromUrl';

test('test getQueryParamsFromUrl function', (t) => {
  const testCases = [
    {
      url: 'https://a.b.com?project=testproject&query1=test&silly=willy&field[0]=zero&field[2]=two#test=hash&chucky=cheese',
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
      url: 'https://a.b.com',
      expect: {},
    },
  ];
  
  var val;
  testCases.forEach((testCase) => {
    val = getQueryParamsFromUrl(testCase.url);
    t.deepEqual(
      val,
      testCase.expect,
      `when call getQueryParamsFromUrl(${JSON.stringify(
        testCase.url
      )}), then it returns as expected`
    );
  });
  t.end();
});
