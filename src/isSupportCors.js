
/** 检测是否支持跨域的 ajax 数据发送
 * @category Bom
 * @function isSupportCors
 * @returns {Boolean}
 * @example 
 * // 在支持跨域请求的浏览器中 
 * isSupportCors()//=> true
 */
export default function isSupportCors() {
  if (typeof window.XMLHttpRequest === 'undefined') {
    return false;
  }
  //Detect browser support for CORS
  if ('withCredentials' in new XMLHttpRequest()) {
    /* supports cross-domain requests */
    return true;
  } else if (typeof XDomainRequest !== 'undefined') {
    //Use IE-specific "CORS" code with XDR
    return true;
  } else {
    //Time to retreat with a fallback or polyfill
    return false;
  }
}
