import isObject from './isObject';
import isString from './isString';
import isFunction from './isFunction';
import isNumber from './isNumber';
import each from './each';
import logger from './logger';
/**
 * @callback jsonpSuccessCallback  jsonp 请求成功回调
 * @param {Object} data jsonp 请求成功回调数据
 */

/**
 * @callback jsonpErrorCallback jsonp 请求失败回调
 * @param {Object} error jsonp 请求失败回调数据
 */

/**
 * @typedef {Object} JsonpRequestArg jsonp 请求参数
 * @property {String} url 请求地址
 * @property {String} callbackName jsonp 数据回调函数，需要与服务端一致
 * @property {Object} data 服务端需要的其他参数，会拼接在 url 后
 * @property {jsonpSuccessCallback} success 请求成功回调函数
 * @property {jsonpErrorCallback} error 请求异常回调函数
 * @property {Number} timeout 超时时间
 */

/** 发起 jsonp 请求
 *  
 * @param {JsonpRequestArg} obj  jsonp 请求参数体
 * @category Bom
 * @function jsonp
 * @example
 * _.jsonp({
 *   url:'https://example.com',
 *   callbackName:'myDataCallback',
 *   data:{name:'Alice'}, //服务端需要的其他参数，拼接在url后
 *   success:function(data){console.log(data)},
 *   error:function(err){console.error(err)},
 *   timeout:3000
 * });
 */
export default function jsonp(obj) {
  if (!(isObject(obj) && isString(obj.callbackName))) {
    logger.log('JSONP 请求缺少 callbackName');
    return false;
  }
  obj.success = isFunction(obj.success) ? obj.success : function () { };
  obj.error = isFunction(obj.error) ? obj.error : function () { };
  obj.data = obj.data || '';
  var script = document.createElement('script');
  var head = document.getElementsByTagName('head')[0];
  var timer = null;
  var isError = false; //防止失败逻辑重复触发
  script.defer = 'defer';
  head.appendChild(script);
  if (isNumber(obj.timeout)) {
    timer = setTimeout(function () {
      if (isError) {
        return false;
      }
      obj.error('timeout');
      window[obj.callbackName] = function () {
        logger.log('call jsonp error');
      };
      timer = null;
      head.removeChild(script);
      isError = true;
    }, obj.timeout);
  }
  window[obj.callbackName] = function () {
    clearTimeout(timer);
    timer = null;
    obj.success.apply(null, arguments);
    window[obj.callbackName] = function () {
      logger.log('call jsonp error');
    };
    head.removeChild(script);
  };
  if (obj.url.indexOf('?') > -1) {
    obj.url += '&callbackName=' + obj.callbackName;
  } else {
    obj.url += '?callbackName=' + obj.callbackName;
  }
  if (isObject(obj.data)) {
    var arr = [];
    each(obj.data, function (value, key) {
      arr.push(key + '=' + value);
    });
    obj.data = arr.join('&');
    obj.url += '&' + obj.data;
  }
  script.onerror = function (err) {
    if (isError) {
      return false;
    }
    window[obj.callbackName] = function () {
      logger.log('call jsonp error');
    };
    clearTimeout(timer);
    timer = null;
    head.removeChild(script);
    obj.error(err);
    isError = true;
  };
  script.src = obj.url;
}
