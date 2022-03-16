import test from 'tape';
import extend from '../src/extend';

const obj = {
  name: 'Alice',
  age: 18,
  address: {
    addr1: 'BeiJing',
  },
};
const source = {
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
var source2 = new Child();

test('test extend function', (t) => {
  var val = extend(obj, source);
  t.deepEqual(val, target, 'when call extend(obj, source), then it returns target');
  
  val = extend(obj, source2);
  t.deepEqual(val, target, 'call extend(obj, source) when source has inherited properties, then it returns target');
  t.end();
});
