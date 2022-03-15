import test from 'tape';
import extend from '../src/extend';

const a = {
  name: 'Alice',
  age: 18,
  address: {
    addr1: 'BeiJing',
  },
};
const b = {
  name: 'Bob',
  favor: 'Apple',
  address: {
    addr1: 'TianJing',
  },
};
const target = {
  name: 'Bob',
  age: 18,
  favor: 'Apple',
  address: {
    addr1: 'TianJing',
  },
};

// 对象继承
function Parent() {
  this.value = 'From Parent';
}
Parent.prototype.getParentValue = function () {
  return this.value;
};
function Child() {}
Child.prototype = new Parent();
var c = new Child();

test('test extend function', (t) => {
  var val = extend(a, b);
  t.deepEqual(val, target, 'when call extend(obj, source), then it returns target');
  
  val = extend(a, c);
  t.deepEqual(val, target, 'when call extend(obj, source) and source has inherited properties, then it returns target');
  t.end();
});
