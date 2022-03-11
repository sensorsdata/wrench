import logger from './logger';

/** 兼容低版本 IE 的 XMLHttpRequest 的实例化方法
 * @category Bom
 * @param {Boolean} cors 请求是否需要支持跨域
 * @returns {ActiveXObject|XMLHttpRequest} XMLHttpRequest 的实例
 * @function xhr
 */
export default function xhr(cors) {
  if (cors) {
    if (typeof window.XMLHttpRequest !== 'undefined' && 'withCredentials' in new XMLHttpRequest()) {
      return new XMLHttpRequest();
    } else if (typeof XDomainRequest !== 'undefined') {
      // eslint-disable-next-line no-undef
      return new XDomainRequest();
    } else {
      return null;
    }
  } else {
    if (typeof window.XMLHttpRequest !== 'undefined') {
      return new XMLHttpRequest();
    }
    if (window.ActiveXObject) {
      try {
        // eslint-disable-next-line no-undef
        return new ActiveXObject('Msxml2.XMLHTTP');
      } catch (d) {
        try {
          // eslint-disable-next-line no-undef
          return new ActiveXObject('Microsoft.XMLHTTP');
        } catch (d) {
          logger.log(d);
        }
      }
    }
  }
}