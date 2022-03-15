import test from 'tape';
import coverExtend from '../src/coverExtend';

const a = {
  name: 'Alice',
  age: 18,
};
const b = {
  name: 'Bob',
  favor: 'Apple',
};
const target = {
  name: 'Alice',
  age: 18,
  favor: 'Apple',
};

test('test coverExtend function', (t) => {
  var val = coverExtend(a, b);
  t.deepEqual(
    val,
    target,
    'when call coverExtend(obj, source), then it returns target'
  );
  t.end();
});
