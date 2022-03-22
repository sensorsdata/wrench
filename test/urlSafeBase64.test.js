import test from 'tape';
import urlSafeBase64 from '../src/urlSafeBase64';

test('test urlSafeBase64 function', (t) => {
  var val = urlSafeBase64.encode('RUNOOB+/=');
  t.equal(
    val,
    'RUNOOB-_.',
    'when call urlSafeBase64.encode("RUNOOB+/="), then it returns "RUNOOB-_."'
  );

  val = urlSafeBase64.decode('RUNOOB-_.');
  t.equal(
    val,
    'RUNOOB+/=',
    'when call urlSafeBase64.decode("RUNOOB-_."), then it returns "RUNOOB+/="'
  );

  val = urlSafeBase64.trim('aGVsbG/kuJbnlYw=');
  t.equal(
    val,
    'aGVsbG/kuJbnlYw',
    'when call urlSafeBase64.trim("aGVsbG/kuJbnlYw="), then it returns "aGVsbG/kuJbnlYw"'
  );
  val = urlSafeBase64.trim('aGVsbG/kuJbnlYw.');
  t.equal(
    val,
    'aGVsbG/kuJbnlYw',
    'when call urlSafeBase64.trim("aGVsbG/kuJbnlYw."), then it returns "aGVsbG/kuJbnlYw"'
  );

  val = urlSafeBase64.isBase64('aGVsbG/kuJbnlYw=');
  t.equal(
    val,
    true,
    'when call urlSafeBase64.isBase64("aGVsbG/kuJbnlYw="), then it returns true'
  );

  val = urlSafeBase64.isUrlSafeBase64('RUNOOB-_.');
  t.equal(
    val,
    true,
    'when call urlSafeBase64.isUrlSafeBase64("RUNOOB-_."), then it returns true'
  );

  t.end();
});
