import isArray from './isArray';

/** 获取指定域名的顶级域名， 例如在 a.example.com 中调用该方法，将返回 example.com
 * 
 * @param {String} ?hostname 指定域名，缺省值为当前域名
 * @param {String} ?testFlag 指定 cookie 测试方法，获取顶层域名的原理是通过不断尝试在当前域名的上一层域名进行 cookie 读写测试，
 * 来确定最终可以安全读写 cookie 的顶层域名，testFlag 为这个测试 cookie 的名字，如果不填写，将使用 domain_test 作为 testFlag
 * @returns {String} 指定域名的顶级域名
 * @function getCookieTopLevelDomain
 * @category Bom
 * 
 * @example
 * // 在 www.example.com 域名下
 * getCookieTopLevelDomai() //=> example.com
 */
export default function getCookieTopLevelDomain(hostname, testFlag) {
  hostname = hostname || location.hostname;
  testFlag = testFlag || 'domain_test';
  function validHostname(value) {
    if (value) {
      return value;
    } else {
      return false;
    }
  }
  var new_hostname = validHostname(hostname);
  if (!new_hostname) {
    return '';
  }
  var splitResult = new_hostname.split('.');
  if (isArray(splitResult) && splitResult.length >= 2 && !/^(\d+\.)+\d+$/.test(new_hostname)) {
    var domainStr = '.' + splitResult.splice(splitResult.length - 1, 1);
    while (splitResult.length > 0) {
      domainStr = '.' + splitResult.splice(splitResult.length - 1, 1) + domainStr;
      document.cookie = testFlag + '=true; path=/; domain=' + domainStr;

      if (document.cookie.indexOf(testFlag + '=true') !== -1) {
        var nowDate = new Date();
        nowDate.setTime(nowDate.getTime() - 1000);

        document.cookie = testFlag + '=true; expires=' + nowDate.toGMTString() + '; path=/; SameSite=Lax; domain=' + domainStr;

        return domainStr;
      }
    }
  }
  return '';
}