import test from 'tape';
import sinon from 'sinon';
import isJSONString from '../src/isJSONString';

var str = '{"a":123}';
test('test isJSONString function', (t) => {
  var val = isJSONString(str);
  t.equal(val, true, `when call isJSONString('${str}'), then it returns true`);

  sinon.stub(JSON, 'parse').throws('some exception');
  val = isJSONString(str);
  t.equal(val, false, `when call isJSONString('${str}') exception happens, then it returns false`);
  
  sinon.restore();
  t.end();
});
