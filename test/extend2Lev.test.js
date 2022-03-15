import test from 'tape';
import extend2Lev from '../src/extend2Lev';

var a = {
  name: 'Alice',
  age: 18,
  address: {
    addr1: 'BeiJing',
    addr2: 'HeiBei',
  },
};

var b = {
  name: 'Bob',
  favor: 'Apple',
  address: {
    addr1: 'TianJing',
  },
};

var c = {
  name: 'Bob',
  favor: 'Apple',
  test: undefined,
  address: {
    addr1: 'TianJing',
  },
};

var target = {
  name: 'Bob',
  age: 18,
  favor: 'Apple',
  address: {
    addr1: 'TianJing',
    addr2: 'HeiBei',
  },
};

test('test extend2Lev function', (t) => {
  var val = extend2Lev(a, b);
  t.deepEqual(val, target, 'when call extend2Lev(obj, source), then it returns target');
  
  val = extend2Lev(a, c);
  t.deepEqual(val, target, 'when call extend2Lev(obj, source) and source has an attribute whose value is undefined, then it returns target');
  t.end();
});
