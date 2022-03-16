import test from 'tape';
import rot13defs from '../src/rot13defs';

test('test rot13defs function', (t) => {
  var val = rot13defs('uryy|');
  t.equal(
    val,
    'hello',
    'when call rot13defs("uryy|"), then it returns "hello"'
  );
  t.end();
});
