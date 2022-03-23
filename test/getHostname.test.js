import test from 'tape';
import Sinon from 'sinon';
import getHostname from '../src/getHostname';

test('test getHostname function', (t) => {
  const testCases = ['test', 666, false, {}, null, undefined];

  var val;
  testCases.forEach((testCase) => {
    val = getHostname(testCase);
    t.equal(
      val,
      'hostname解析异常',
      `when call getHostname(${JSON.stringify(
        testCase
      )}), then it returns 'hostname解析异常'`
    );
  });

  // defaultValue && typeof defaultValue == 'string'
  val = getHostname('test', 'defaultValue test');
  t.equal(
    val,
    'defaultValue test',
    'when call getHostname("test", "defaultValue test"), then it returns "defaultValue test"'
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
