import test from 'tape';
import isDate from '../src/isDate';

test('test isDate function', (t) => {
  var date = new Date();

  var val = isDate(date);
  t.equal(val, true, 'when call isDate(new Date()), then it returns true');

  t.equal(isDate(1), false, 'when call isDate(1), then it returns false');

  t.end();
});