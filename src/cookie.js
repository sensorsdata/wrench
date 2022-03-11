import isString from './isString';
import getCookieTopLevelDomain from './getCookieTopLevelDomain';
import now from './now';
/** 获取和设置 cookie 的模块
 * @category Bom
 * @exports cookie
 */
export default {
  /** 根据传入的 cookie 名获取 cookie 值
   * 
   * @param {*} name 要获取的 cookie 名
   * @returns 传入 cookie 名的值
   * @example 
   * cookie.set('key1','value1')
   * cookie.get('key1');//=> value1
   */
  get: function (name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) == 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
    return null;
  },
  /** 根据传入信息设置 cookie
   * 
   * @param {String} name 要设置的 cookie 名
   * @param {String} value 要设置的 cookie 值
   * @param {Number} days 以天为单位的过期时间
   * @param {Boolean} cross_subdomain 是否支持跨子域恭共享，即将 cookie 写入最顶层域名
   * 例如在 a.example.com 中的 cookie 的 domain 将写为 example.com,这样
   * b.example.com 也能读取 a.example 的 cookie，达成 cookie 共享
   * @param {String} cookie_samesite 是否允许跨站请求携带 cookie，可选值有 Lax，Strict，None
   * @param {Boolean} is_secure 是否允许 http 请求携带 cookie，设置为 true 后 cookie 只能通过 https 发送
   * 
   * @example 
   * cookie.set('key2','value2',10,true,true,true)
   * cookie.get('key2');//=> value2
   */
  set: function (name, value, days, cross_subdomain, cookie_samesite, is_secure) {
    var cdomain = '',
      expires = '',
      secure = '',
      samesite = '';
    days = days == null ? 73000 : days;

    if (cross_subdomain) {
      var domain = getCookieTopLevelDomain();
      if (domain === 'url解析失败') {
        domain = '';
      }
      cdomain = domain ? '; domain=' + domain : '';
    }

    // 0 session
    // -1 马上过期
    //
    if (days !== 0) {
      var date = new Date();
      // 默认是天，可以是秒
      if (String(days).slice(-1) === 's') {
        date.setTime(date.getTime() + Number(String(days).slice(0, -1)) * 1000);
      } else {
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      }

      expires = '; expires=' + date.toGMTString();
    }
    if (isString(cookie_samesite) && cookie_samesite !== '') {
      samesite = '; SameSite=' + cookie_samesite;
    }
    if (is_secure) {
      secure = '; secure';
    }

    function getValid(data) {
      if (data) {
        return data.replaceAll(/\r\n/g, '');
      } else {
        return false;
      }
    }
    var valid_name = '';
    var valid_value = '';
    var valid_domain = '';
    if (name) {
      valid_name = getValid(name);
    }
    if (value) {
      valid_value = getValid(value);
    }
    if (cdomain) {
      valid_domain = getValid(cdomain);
    }
    if (valid_name && valid_value) {
      document.cookie = valid_name + '=' + encodeURIComponent(valid_value) + expires + '; path=/' + valid_domain + samesite + secure;
    }
  },
  /** 删除指定 cookie 名的 cookie 值
   * 
   * @param {*} name 要删除的 cookie 名
   * @returns 传入 cookie 名的值
   * @example 
   * cookie.remove('key1','value1')
   * cookie.get('key1');//=> null
   */
  remove: function (name, cross_subdomain) {
    this.set(name, '1', -1, cross_subdomain);
  },
  /** 通过传入的测试 key 和 value 来判断当前环境是否支持 cookie 存储
   * 
   * @param {String} testKey  测试键值
   * @param {String} testValue 测试值
   * @returns {Boolean} 当前环境是否支持 cookie 存储
   * @example
   * cookie.isSupport('a','1') // => true / false
   */
  isSupport: function (testKey, testValue) {
    testKey = testKey || 'cookie' + now();
    testValue = testValue || '1';
    var self = this;
    function accessNormal() {
      self.set(testKey, testValue);
      var val = self.get(testKey);
      if (val !== testValue) return false;
      self.remove(testKey);
      return true;
    }
    return navigator.cookieEnabled && accessNormal();
  }
};