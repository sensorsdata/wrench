import test from 'tape';
import isArguments from '../src/isArguments';

test('test isArguments function', (t) => {
  function fn() {
    var v = isArguments(arguments);
    t.equal(v, true, 'isArguments performs as expected');
  }
  fn();
  t.end();
});
