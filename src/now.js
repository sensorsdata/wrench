/** 获取当前时间相对于 1970-01-01 00:00:00 经过的毫秒数
 * @category Util
 * @function now
 * @returns {Number} 返回当前时间相对于 1970-01-01 00:00:00 经过的毫秒数
 * @example 
 * now() // 1646122486530
 */
var now =
  Date.now ||
  function () {
    return new Date().getTime();
  };

export default now;