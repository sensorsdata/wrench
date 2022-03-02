import extend from './extend';

/**
 * @typedef {Object} loadScriptArg 加载脚本参数
 * @property {String} url 脚本的网络地址
 * @property {String} type 脚本类型，可选值有 js、css
 * @property {callback} success 脚本加载成功回调
 * @property {callback} error 脚本加载失败回调
 */

/** 加载 javascript 脚本或 css 脚本
 * @category Dom
 * @function loadScript
 * @param {loadScriptArg} para 加载脚本的参数，指定加载脚本类型及回调
 * 
 * @example
 * loadScript({
 *   url:'/test.js',
 *   type:'js',
 *   success:function(){console.log('js script load succeed')}
 * })
 */
export default function loadScript(para) {
  para = extend(
    {
      success: function () { },
      error: function () { },
      appendCall: function (g) {
        document.getElementsByTagName('head')[0].appendChild(g);
      }
    },
    para
  );

  var g = null;
  if (para.type === 'css') {
    g = document.createElement('link');
    g.rel = 'stylesheet';
    g.href = para.url;
  }
  if (para.type === 'js') {
    g = document.createElement('script');
    g.async = 'async';
    g.setAttribute('charset', 'UTF-8');
    g.src = para.url;
    g.type = 'text/javascript';
  }
  g.onload = g.onreadystatechange = function () {
    if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
      para.success();
      g.onload = g.onreadystatechange = null;
    }
  };
  g.onerror = function () {
    para.error();
    g.onerror = null;
  };
  // if iframe
  para.appendCall(g);
}