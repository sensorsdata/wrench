import test from 'tape';
import sinon from 'sinon';
import base64Encode from '../src/base64Encode';

// base64Encode('RUNOOB') //=> 'UlVOT09C'
test('test base64Encode function', (t) => {
  global.btoa = function () {};

  sinon.stub(global, 'btoa').withArgs('RUNOOB').returns('UlVOT09C');

  var val = base64Encode('RUNOOB');
  t.equal(
    val,
    'UlVOT09C',
    'when call base64Encode("RUNOOB"), then it returns "UlVOT09C"'
  );

  sinon.restore();
  // encodeURIComponent('hello世界') -> 'hello%E4%B8%96%E7%95%8C'
  // encodeURIComponent('hello世界').replace(reg, function) -> 'helloä¸\x96ç\x95\x8C'
  sinon
    .stub(global, 'btoa')
    .withArgs('helloä¸\x96ç\x95\x8C')
    .throws('some exceptions');

  val = base64Encode('hello世界');
  t.equal(
    val,
    'hello世界',
    'when call base64Encode("hello世界") and some exceptions happened to btoa function, then it returns original input "hello世界"'
  );

  sinon.restore();
  delete global.btoa;
  t.end();
});
