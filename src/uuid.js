import getRandom from './getRandom';

/** 浏览器环境的生成唯一 ID 的算法
 * @function UUID
 * @category Util
 * @returns {String} 唯一 ID
 * @example
 * UUID() //=> '17f44206897991-078fdaeab826c4c-37677a09-3686400-17f44206898caa'
 */

var UUID = (function () {
  var T = function () {
    var d = 1 * new Date(),
      i = 0;
    while (d == 1 * new Date()) {
      i++;
    }
    return d.toString(16) + i.toString(16);
  };
  var R = function () {
    return getRandom().toString(16).replace('.', '');
  };
  var UA = function () {
    var ua = navigator.userAgent,
      i,
      ch,
      buffer = [],
      ret = 0;

    function xor(result, byte_array) {
      var j,
        tmp = 0;
      for (j = 0; j < byte_array.length; j++) {
        tmp |= buffer[j] << (j * 8);
      }
      return result ^ tmp;
    }

    for (i = 0; i < ua.length; i++) {
      ch = ua.charCodeAt(i);
      buffer.unshift(ch & 0xff);
      if (buffer.length >= 4) {
        ret = xor(ret, buffer);
        buffer = [];
      }
    }

    if (buffer.length > 0) {
      ret = xor(ret, buffer);
    }

    return ret.toString(16);
  };

  return function () {
    // 有些浏览器取个屏幕宽度都异常...
    var se = String(screen.height * screen.width);
    if (se && /\d{5,}/.test(se)) {
      se = se.toString(16);
    } else {
      se = String(getRandom() * 31242)
        .replace('.', '')
        .slice(0, 8);
    }
    var val = T() + '-' + R() + '-' + UA() + '-' + se + '-' + T();
    if (val) {
      return val;
    } else {
      return (String(getRandom()) + String(getRandom()) + String(getRandom())).slice(2, 15);
    }
  };
})();

export default UUID;