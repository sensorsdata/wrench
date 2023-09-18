import xhr from './xhr';
import isObject from './isObject';
import extend from './extend';
import each from './each';
import logger from './logger';

/** Ajax 请求成功回调
 * @callback ajaxSuccessCallback
 * @param {Object} data 请求成功后数据结果
 */

/** Ajax 请求失败回调
 * @callback ajaxErrorCallback
 * @param {Object} error 请求失败的异常结果
 * @param {Number} status 错误代码，如 404
 */

/**
 * @typedef {Object} AjaxRequestArg Ajax 请求参数
 * @property {String} url 请求目标地址
 * @property {Number} timeout 请求超时时间，若超时请求将终止
 * @property {Boolean} credentials 标识是否携带 cookie
 * @property {Boolean} cors 标识是否支持跨域
 * @property {String} type 标识请求类型，如 'GET','POST'
 * @property {ajaxSuccessCallback} success 请求成功回调
 * @property {ajaxErrorCallback} error 请求失败的回调
 * @property {object} header 请求头，Key/Value 键值对对象
 * @property {Object} data 请求体，Key/Value 键值对对象
 */

/** 发起一个 Ajax 请求
 * @category Bom
 * @function ajax
 * @param {AjaxRequestArg} para 请求参数
 * 
 * @example
 * ajax({
 *   url:'/example',
 *   timeout:15000,
 *   credentials:true,
 *   cors:true,
 *   type:'POST',
 *   success:function (data) { console.log(data)},
 *   error:function (data) { console.log(error)},
 *   header:{ExtraHeader:'TestValue'},
 *   data:{ name:'Alice', age:18 },
 * })
 */
export default function ajax(para) {
  para.timeout = para.timeout || 20000;

  para.credentials = typeof para.credentials === 'undefined' ? true : para.credentials;
  function getJSON(data) {
    if (!data) {
      return '';
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      return {};
    }
  }

  var g = xhr(para.cors);

  if (!g) {
    return false;
  }

  if (!para.type) {
    para.type = para.data ? 'POST' : 'GET';
  }
  para = extend(
    {
      success: function () { },
      error: function () { }
    },
    para
  );

  var oldsuccess = para.success;
  var olderror = para.error;
  var errorTimer;

  function abort() {
    try {
      if (g && typeof g === 'object' && g.abort) {
        g.abort();
      }
    } catch (error) {
      logger.log(error);
    }

    //如果 g.abort 未生效，手动执行 error
    if (errorTimer) {
      clearTimeout(errorTimer);
      errorTimer = null;
      para.error && para.error();
      g.onreadystatechange = null;
      g.onload = null;
      g.onerror = null;
    }
  }

  para.success = function (data) {
    oldsuccess(data);
    if (errorTimer) {
      clearTimeout(errorTimer);
      errorTimer = null;
    }
  };
  para.error = function (err) {
    olderror(err);
    if (errorTimer) {
      clearTimeout(errorTimer);
      errorTimer = null;
    }
  };
  errorTimer = setTimeout(function () {
    abort();
  }, para.timeout);

  // eslint-disable-next-line no-undef
  if (typeof XDomainRequest !== 'undefined' && g instanceof XDomainRequest) {
    //XDomainRequest success callback
    g.onload = function () {
      para.success && para.success(getJSON(g.responseText));
      g.onreadystatechange = null;
      g.onload = null;
      g.onerror = null;
    };
    //XDomainRequest error callback
    g.onerror = function () {
      para.error && para.error(getJSON(g.responseText), g.status);
      g.onreadystatechange = null;
      g.onerror = null;
      g.onload = null;
    };
  }
  g.onreadystatechange = function () {
    try {
      if (g.readyState == 4) {
        if ((g.status >= 200 && g.status < 300) || g.status == 304) {
          para.success(getJSON(g.responseText), g.status);
        } else {
          para.error(getJSON(g.responseText), g.status);
        }
        g.onreadystatechange = null;
        g.onload = null;
      }
    } catch (e) {
      g.onreadystatechange = null;
      g.onload = null;
    }
  };

  g.open(para.type, para.url, true);

  try {
    if (para.credentials) {
      g.withCredentials = true;
    }
    if (isObject(para.header)) {
      each(para.header, function (v, i) {
        g.setRequestHeader && g.setRequestHeader(i, v);
      });
    }

    if (para.data) {
      if (!para.cors) {
        //XDomainRequest no custom headers may be added to the request
        g.setRequestHeader && g.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      }
      if (para.contentType === 'application/json') {
        g.setRequestHeader && g.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
      } else {
        g.setRequestHeader && g.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      }
    }
  } catch (e) {
    logger.log(e);
  }

  g.send(para.data || null);
}
