import test from 'tape';
import rot13obfs from '../src/rot13obfs';

test('test rot13obfs function', (t) => {
  const testCases = [
    { input: 'hello', expect: 'uryy|' },
    { input: '￥hello', expect: '￥uryy|' }
  ];
  var val;
  testCases.forEach((testCase) => {
    val = rot13obfs(testCase.input);
    t.equal(
      val,
      testCase.expect,
      `when call rot13obfs("${testCase.input}"), then it returns "${testCase.expect}"`
    );
  });

  val = rot13obfs('hello', 10);
  t.equal(
    val,
    'rovvy',
    'when call rot13obfs("hello", 10), then it returns "rovvy"'
  );

  t.end();
});
