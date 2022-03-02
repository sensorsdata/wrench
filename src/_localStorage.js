/** 一个封装了 localStorage 的对象
 * @category Bom
 * @exports _localStorage
 */
var _localStorage = {
  /** 获取 localStorage 值
   * 
   * @param {String} key 传入存储值的键 key
   * @returns {String} 返回值
   * @example
   * _localStorage.set('key1','value1');
   * _localStorage.get('key1'); //=> value1
   */
  get: function (key) {
    return window.localStorage.getItem(key);
  },
  /** 获取 localStorage 值并且通过 JSON.parse 解析为 JS 对象
   * 如果无法成功解析，则返回字符串值
   * @param {String} key 传入存储值的键 key
   * @returns {Object} 返回值
   * @example
   * _localStorage.set('key2',JSON.stringify({a:1}));
   * _localStorage.parse('key2'); //=> {a:1}
   */
  parse: function (key) {
    var storedValue;
    try {
      storedValue = JSON.parse(_localStorage.get(key)) || null;
    } catch (err) {
      console.log(err);
    }
    return storedValue;
  },
  /** 设置 localStorage 键值
   * 
   * @param {String} key 传入存储值的键 key
   * @param {String} value 传入存储值的值 value
   * @example
   *  _localStorage.set('key1','value1');
   *  _localStorage.get('key1'); //=> value1
   */
  set: function (key, value) {
    window.localStorage.setItem(key, value);
  },
  /** 删除 localStorage 键值
   * 
   * @param {*} key 传入存储值的键 key
   * @example
   * _localStorage.remove('key2');
   * _localStorage.get('key2') //=> null
   */
  remove: function (key) {
    window.localStorage.removeItem(key);
  },
  /** 检测当前浏览器是否支持 localStorage 存储
   * 
   * @returns {Boolean} 返回当前浏览器是否支持 localStorage 存储
   * @example
   * // 在支持 localStorage 的浏览器中
   * _localStorage.isSupport() //=> true
   */
  isSupport: function () {
    var supported = true;
    try {
      var supportName = '__sensorsdatasupport__';
      var val = 'testIsSupportStorage';
      _localStorage.set(supportName, val);
      if (_localStorage.get(supportName) !== val) {
        supported = false;
      }
      _localStorage.remove(supportName);
    } catch (err) {
      supported = false;
    }
    return supported;
  }
};

export default _localStorage;