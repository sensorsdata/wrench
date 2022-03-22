import sinon from 'sinon';
import test from 'tape';
import now from '../src/now';

test('test now function', (t) => {
  var val = now();
  t.equal(val, new Date().getTime(), 'now() perfoms as expected');

  sinon.stub(Date, 'now').value(undefined);
  t.ok(now(), 'now() can be executed normally');
  
  sinon.restore();
  t.end();
});
