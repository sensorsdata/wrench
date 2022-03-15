import test from 'tape';
import formatDate from '../src/formatDate';

test('test formatDate function', (t) => {
  t.equal(
    formatDate(new Date('2020-2-2 8:0:12')),
    '2020-02-02 08:00:12.00',
    'when call formatDate(new Date("2020-2-2 8:0:12")), then it returns "2020-02-02 08:00:12.00"'
  );
  t.end();
});
