import _URL from './URL';
import logger from './logger';

/** 获取指定 url 的域名
 * 
 * @param {String} url 传入指定的 url 
 * @param {String} defaultValue 域名默认值，如果解析失败则返回该默认值
 * @returns 解析到的 url 的域名
 * @category Bom
 * @function getHostname
 * @example getHostname('https://www.example.com') //=> 'www.example.com'
 */
export default function getHostname(url, defaultValue) {
  if (!defaultValue || typeof defaultValue !== 'string') {
    defaultValue = 'hostname解析异常';
  }
  var hostname = null;
  try {
    hostname = _URL(url).hostname;
  } catch (e) {
    logger.log('getHostname传入的url参数不合法！');
  }
  return hostname || defaultValue;
}