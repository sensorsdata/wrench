import test from 'tape';
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

  // global._URL = _URL;
  // var url = 'https://www.example.com';
  // Sinon.stub(global, '_URL').callsFake(function (param) {
  //   // console.log('here');
  //   return { hostname: param == url ? 'www.example.com' : '' };
  // });
  // val = getHostname(url);
  // t.equal(val, 'www.example.com', 'success');

  t.end();
});
