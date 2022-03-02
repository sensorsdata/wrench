import getURLSearchParams from './getURLSearchParams';
import isString from './isString';
import trim from './tirm';
import urlParse from './urlParse';

/**
 * @typedef SearchParams
 * @property {Function} get <strong>get(key:String)->String<strong> <br> 获取指定 key 的查询参数值
 */

/**
 * @typedef URLObject  URL 普通对象
 * @property {String} hash url 中的 hash 值 （#后的值）
*  @property {String} host url 中的主机地址
*  @property {String} href url 完整链接
*  @property {String} password url 中包含的主机账户密码
*  @property {String} pathname url 中的路径名
*  @property {String} port  ulr 中的端口号
*  @property {String} search url 中的查询参数 （?后的值）
*  @property {String} username url 中包含的主机用户名
*  @property {String} hostname  url 中的主机名
*  @property {String} protocol  url 的 协议，如 http: ，https
*  @property {String} origin  url 的地址，只包含域名和端口
*  @property {SearchParams} searchParams url 查询参数对象，可以通过其 get 方法获取指定的查询参数的值
 */

/**
 * 兼容解析URL<br>
 * 如果浏览器原生支持 URL 类则返回原生 URL 对象 <br>
 * 否则返回兼容实现的 URL 解析对象 ( 参见 URLObject)
 * @param {String} url url 格式的字符串
 * @returns {URL|URLObject} 一个原生 URL 对象或者普通JS对象( 参见 URLObject)
 *
 * @example
 * var url = _.URL('http://www.domain.com:8080/path/index.html?project=testproject&query1=test&silly=willy&field[0]=zero&field[2]=two#test=hash&chucky=cheese');
 *
 * url.hostname; // => www.domain.com
 * url.searchParams.get('project'); // => testproject
 * @category Bom
 * @function _URL
 */
export default function _URL(url) {
  var result = {};
  //var basicProps = ['hash', 'host', 'hostname', 'href', 'origin', 'password', 'pathname', 'port', 'protocol', 'search', 'username'];
  // Some browsers allow objects to be created via URL constructor, but instances do not have the expected url properties.
  // See https://www.caniuse.com/#feat=url
  var isURLAPIWorking = function () {
    var url;
    try {
      url = new URL('http://modernizr.com/');
      return url.href === 'http://modernizr.com/';
    } catch (e) {
      return false;
    }
  };
  if (typeof window.URL === 'function' && isURLAPIWorking()) {
    result = new URL(url);
    if (!result.searchParams) {
      result.searchParams = (function () {
        var params = getURLSearchParams(result.search);
        return {
          get: function (searchParam) {
            return params[searchParam];
          }
        };
      })();
    }
  } else {
    if (!isString(url)) {
      url = String(url);
    }
    url = trim(url);
    var _regex = /^https?:\/\/.+/;
    if (_regex.test(url) === false) {
      console.log('Invalid URL');
      return;
    }
    var instance = urlParse(url);
    result.hash = '';
    result.host = instance._values.Host ? instance._values.Host + (instance._values.Port ? ':' + instance._values.Port : '') : '';
    result.href = instance._values.URL;
    result.password = instance._values.Password;
    result.pathname = instance._values.Path;
    result.port = instance._values.Port;
    result.search = instance._values.QueryString ? '?' + instance._values.QueryString : '';
    result.username = instance._values.Username;
    result.hostname = instance._values.Hostname;
    result.protocol = instance._values.Protocol ? instance._values.Protocol + ':' : '';
    result.origin = instance._values.Origin ? instance._values.Origin + (instance._values.Port ? ':' + instance._values.Port : '') : '';
    result.searchParams = (function () {
      var params = getURLSearchParams('?' + instance._values.QueryString);
      return {
        get: function (searchParam) {
          return params[searchParam];
        }
      };
    })();
  }
  return result;
}
