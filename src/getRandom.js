import isObject from './isObject';
import getRandomBasic from './getRandomBasic';

/** 安全的 js 随机数生成方式,返回与原生 Math.random 类似的 0-1 的随机数值
 * @function getRandom
 * @category Math
 * @returns {Number} 一个介于 0 -1 的数字
 *
 * @example
 * getRandom() //=> 0.8368784293552812
 */
export default function getRandom() {
  if (typeof Uint32Array === 'function') {
    var cry = '';
    if (typeof crypto !== 'undefined') {
      cry = crypto;
    } else if (typeof msCrypto !== 'undefined') {
      // eslint-disable-next-line no-undef
      cry = msCrypto;
    }
    if (isObject(cry) && cry.getRandomValues) {
      var typedArray = new Uint32Array(1);
      var randomNumber = cry.getRandomValues(typedArray)[0];
      var integerLimit = Math.pow(2, 32);
      return randomNumber / integerLimit;
    }
  }
  return getRandomBasic(10000000000000000000) / 10000000000000000000;
}
