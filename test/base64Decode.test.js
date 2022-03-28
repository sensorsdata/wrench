import test from 'tape';
import sinon from 'sinon';
import base64Decode from '../src/base64Decode';

// base64Decode('aGVsbG/kuJbnlYw=')//=> 'hello世界'
test('test base64Decode function', (t) => {
  global.atob = function () { };

  var stub = sinon.stub(global, 'atob');
  stub.withArgs('UlVOT09C').returns('RUNOOB');
  // atob functional，decodeURIComponent functional
  var val = base64Decode('UlVOT09C');
  t.equal(val, 'RUNOOB', 'when call base64Decode("UlVOT09C"), then it returns "RUNOOB"');
  stub.restore();

  // atob disfunctional，decodeURIComponent functional
  stub.throws('some expection');
  val = base64Decode('UlVOT09C');
  t.equal(val, '', 'call base64Decode("UlVOT09C") when exception happens, then it returns ""');
  stub.restore();

  // atob functional，decodeURIComponent disfunctional
  stub.withArgs('UlVOT09C').returns('RUNOOB');
  sinon.stub(global, 'decodeURIComponent').throws('some expection');
  val = base64Decode('UlVOT09C');
  t.equal(val, '', 'call base64Decode("UlVOT09C") when exception happens to decodeURIComponent function, then it returns ""');

  sinon.restore();
  delete global.atob;
  t.end();
});
