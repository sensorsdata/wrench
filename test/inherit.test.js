import test from 'tape';
import inherit from '../src/inherit';

test('test inherit function', (t) => {
  function A() {
    this.say = function (arg) {
      console.log('say: ' + arg);
    };
  }
  function B() {
    this.sing = function (arg) {
      console.log('sing: ' + arg);
    };
  }
  // 简单的原型链继承
  inherit(A, B);

  var a = new A();
  a.say('hello');
  a.sing('hello');

  t.deepEqual(
    a.__proto__.constructor.superclass,
    B.prototype,
    'when call inherit(A, B), then it performs as expected, and a.__proto__.superclass == A.prototype'
  );

  t.end();
});
