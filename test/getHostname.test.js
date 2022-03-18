import test from 'tape';
import Sinon from 'sinon';
import getHostname from '../src/getHostname';

const testCases = [
  // { input: 'https://www.example.com', expect: 'www.example.com' },
  { input: 'test', expect: 'hostname解析异常' },
  { input: 666, expect: 'hostname解析异常' },
  { input: false, expect: 'hostname解析异常' },
  { input: {}, expect: 'hostname解析异常' },
  { input: null, expect: 'hostname解析异常' },
  { input: undefined, expect: 'hostname解析异常' },
];

test('test getHostname function', (t) => {
  var val;
  testCases.forEach((testCase) => {
    val = getHostname(testCase.input);
    t.equal(
      val,
      testCase.expect,
      `when call getHostname(${JSON.stringify(
        testCase.input
      )}), then it returns ${testCase.expect}`
    );
  });

  // 输入 defaultValue
  val = getHostname(testCases[0].input, 'defaultValue test');
  t.equal(
    val,
    'defaultValue test',
    `when call getHostname(${JSON.stringify(
      testCases[0].input
    )}, 'defaultValue test'), then it returns "defaultValue test"`
  );

  // 输入 url 正常，且 _URL 可以正常运行
  global.window = {
    URL: function (url) {
      return {
        href: url,
        hostname: '',
        searchParams: '',
      };
    },
  };
  var url = 'https://www.example.com';
  Sinon.stub(global.window, 'URL').withArgs(url).returns({
    href: url,
    hostname: 'www.example.com',
    searchParams: '',
  });
  val = getHostname(url);
  t.equal(val, 'www.example.com', 'success');
  Sinon.restore();
  t.end();
});
