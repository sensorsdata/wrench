import test from 'tape';
import sinon from 'sinon';
import isJSONString from '../src/isJSONString';

test('test isJSONString function', (t) => {
  var str = '{"a":123}';

  var val = isJSONString(str);
  t.equal(val, true, `when call isJSONString('${str}'), then it returns true`);

  sinon.stub(JSON, 'parse').throws('some exception');
  val = isJSONString(str);
  t.equal(
    val,
    false,
    `when call isJSONString('${str}') exception happens, then it returns false`
  );

  sinon.restore();
  t.end();
});
