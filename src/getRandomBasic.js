/** 获取指定数字范围内的随随机数
 * @param {Number} max 随机数最大值
 * @category Math
 * @function getRandomBasic
 * @return 指定数字范围内的随机数
 * 
 * @example
 * getRandomBasic(100) //=> 85
 */
var getRandomBasic = (function () {
  var today = new Date();
  var seed = today.getTime();
  function rnd() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280.0;
  }
  return function rand(number) {
    return Math.ceil(rnd(seed) * number);
  };
})();

export default getRandomBasic;