import test from 'tape';
import coverExtend from '../src/coverExtend';

const obj = {
  name: 'Alice',
  age: 18,
};
const source = {
  name: 'Bob',
  favor: 'Apple',
};
const target = {
  name: 'Alice',
  age: 18,
  favor: 'Apple',
};

test('test coverExtend function', (t) => {
  var val = coverExtend(obj, source);
  t.deepEqual(val, target, 'when call coverExtend(obj, source), then it returns target');
  t.end();
});
