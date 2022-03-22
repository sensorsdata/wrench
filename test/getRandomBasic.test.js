import test from 'tape';
import getRandomBasic from '../src/getRandomBasic';

test('test getRandomBasic function', (t) => {
  var r = getRandomBasic(100);
  var val = r < 100 && r > 0;
  t.ok(val, 'function getRandomBasic() performs as expected');
  t.end();
});
