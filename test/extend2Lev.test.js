import test from 'tape';
import extend2Lev from '../src/extend2Lev';

test('test extend2Lev function', (t) => {
  var obj = {
    name: 'Alice',
    age: 18,
    address: {
      addr1: 'BeiJing',
      addr2: 'HeiBei',
    },
  };

  var source1 = {
    name: 'Bob',
    favor: 'Apple',
    address: {
      addr1: 'TianJing',
    },
  };

  var source2 = {
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

  // start test
  var val = extend2Lev(obj, source1);
  t.deepEqual(
    val,
    target,
    'when call extend2Lev(obj, source), then it returns target'
  );

  val = extend2Lev(obj, source2);
  t.deepEqual(
    val,
    target,
    'when call extend2Lev(obj, source) and source has an attribute whose value is undefined, then it returns target'
  );
  t.end();
});
