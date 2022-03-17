import test from 'tape';
import now from '../src/now';

test('test now function', (t) => {
  var val = now();
  t.equal(val, new Date().getTime(), 'success');
  t.end();
});
