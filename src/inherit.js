/** 简单的原型链继承
 * @category Util
 * @function inherit
 * @param {Function} subclass 子类构造函数
 * @param {Function} superclass 父类构造函数
 * @returns {Function} 继承父类后的字类
 * 
 * @example
 * function A (){
 *  this.say = function (arg){
 *    console.log('say: ' + arg);
 *  }
 * }
 * 
 * function B(){
 *  this.sing = function (arg){
 *    console.log('sing: ' +  arg);
 *  }
 * }
 * 
 * inherit(A,B);
 * 
 * var a =new A();
 * a.say('hello'); // say: hello
 * a.sing('hello'); // sing: hello
 */
export default function inherit(subclass, superclass) {
  subclass.prototype = new superclass();
  subclass.prototype.constructor = subclass;
  subclass.superclass = superclass.prototype;
  return subclass;
}