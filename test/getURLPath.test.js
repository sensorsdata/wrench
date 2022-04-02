import test from 'tape';
import _decodeURI from '../src/decodeURI';
import getURLPath from '../src/getURLPath';

test('test getURLPath function', (t) => {
  global.location = { pathname: '/世界.html' };
  var testCases = [
    {
      input: '/世界.html',
      expect: '/世界.html'
    },
    {
      input: '/test.html',
      expect: '/test.html'
    },
    {
      input: '/%D1%88%D0%B5%D0%BB%D0%BB%D1%8B',
      expect: '/шеллы'
    },
    {
      input: '/%D1%88%D0%B5%D0%BB%D0%BB%D1%8B世界',
      expect: '/шеллы世界'
    },
    {
      input: '/ru/docs/JavaScript_%D1%88%D0%B5%D0%BB%D0%BB%D1%8B',
      expect: '/ru/docs/JavaScript_шеллы'
    },
    {
      input: '',
      expect: ''
    },
    {
      input: null,
      expect: _decodeURI(location.pathname)
    },
    {
      input: undefined,
      expect: _decodeURI(location.pathname)
    }
  ];

  var val;
  testCases.forEach((testCase) => {
    val = getURLPath(testCase.input);
    t.equal(
      val,
      testCase.expect,
      `call getURLPath(${JSON.stringify(
        testCase.input
      )}), then it returns ${JSON.stringify(testCase.expect)}`
    );
  });

  // 未传入 url_path 时
  val = getURLPath();
  t.equal(
    val,
    _decodeURI(location.pathname),
    'call getURLPath() then it returns location.pathname'
  );

  delete global.location;
  t.end();
});
