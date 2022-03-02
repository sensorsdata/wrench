/** 一个封装了 sessionStorage 的对象 <br>
 * 目前只提供检测是否支持 sessionStorage 的方法
 * @category Bom
 * @exports _sessionStorage
 */
var _sessionStorage = {
  /** 检测当前浏览器是否支持 sessionStorage 存储
     * @returns {Boolean} 返回当前浏览器是否支持 sessionStorage 存储
     * @example 
     * // 在支持 sessionStorage 的浏览器中
     * _sessionStorage.isSupport() //=> true
     */
  isSupport: function () {
    var supported = true;
    var supportName = '__sensorsdatasupport__';
    var val = 'testIsSupportStorage';
    try {
      if (sessionStorage && sessionStorage.setItem) {
        sessionStorage.setItem(supportName, val);
        sessionStorage.removeItem(supportName, val);
        supported = true;
      } else {
        supported = false;
      }
    } catch (e) {
      supported = false;
    }
    return supported;
  }
};

export default _sessionStorage;