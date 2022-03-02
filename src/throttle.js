import now from './now';

/** 传入一个函数返回该函数的防抖函数
 * @category Util
 * @param {Function} func 需要进行防抖的函数值行体
 * @param {Number} wait 防抖阈值，毫秒单位
 * @returns 传入函数的防抖函数
 * @function throttle
 * 
 * @example
 * 
 * function log(){
 *   console.log('hello');
 * }
 * 
 * var throttleLog = throttle(log,1000);
 * setInterval(throttleLog,100);
 * // 每个间隔一秒打印一次 hello
 * hello
 * hello // 1s later
 * hello // 1s later
 * ...
 */
export default function throttle(func, wait, options) {
  var context, args, result;
  var timeout = null;
  var previous = 0;
  if (!options) options = {};
  var later = function () {
    previous = options.leading === false ? 0 : now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function () {
    var nowtime = now();
    if (!previous && options.leading === false) previous = nowtime;
    var remaining = wait - (nowtime - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = nowtime;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
}