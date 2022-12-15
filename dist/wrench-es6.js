/** 检测传入参数是否是函数
 * @category Util
 * @param {*} arg 传入参数
 * @returns 是否是函数
 * @function isFunction
 * @example 
 * isFunction (function(){}) //=> true
 */
function isFunction(arg) {
  if (!arg) {
    return false;
  }
  var type = Object.prototype.toString.call(arg);
  return type == '[object Function]' || type == '[object AsyncFunction]';
}

/** 获取当前时间相对于 1970-01-01 00:00:00 经过的毫秒数
 * @category Util
 * @function now
 * @returns {Number} 返回当前时间相对于 1970-01-01 00:00:00 经过的毫秒数
 * @example 
 * now() // 1646122486530
 */
function now() {
  if (Date.now && isFunction(Date.now)) {
    return Date.now();
  }
  return new Date().getTime();
}

var logFn;

/** wrench 库的日志打印模块，可以通过 setup 设置自定义日志打印方式
 * @category Util
 * @exports logger
 */
var logger = {
  /** 自定义工具库的日志函数，默认使用控制台输出
   * 
   * @param {Function} logger 日志函数
   * @example
   * function myLog(arg){
   *    console.log(arg);
   *    alert(arg);
   * }
   * logger.setup(myLog); // 使用 myLog 作为日志输出 
   */
  setup: function (logger) {
    logFn = logger;
  },
  /**
   * 使用自定义的日志函数输出日志
   * 
   * @example
   * logger.log('hello world','1234');
   */
  log: function () {
    (logFn || (console && console.log) || function () { }).apply(null, arguments);
  }
};

/** 一个封装了 localStorage 的对象
 * @category Bom
 * @exports localStorage
 */
var _localStorage = {
  /** 获取 localStorage 值
   * 
   * @param {String} key 传入存储值的键 key
   * @returns {String} 返回值
   * @example
   * localStorage.set('key1','value1');
   * localStorage.get('key1'); //=> value1
   */
  get: function (key) {
    return window.localStorage.getItem(key);
  },
  /** 获取 localStorage 值并且通过 JSON.parse 解析为 JS 对象
   * 如果无法成功解析，则返回字符串值
   * @param {String} key 传入存储值的键 key
   * @returns {Object} 返回值
   * @example
   * localStorage.set('key2',JSON.stringify({a:1}));
   * localStorage.parse('key2'); //=> {a:1}
   */
  parse: function (key) {
    var storedValue;
    try {
      storedValue = JSON.parse(_localStorage.get(key)) || null;
    } catch (err) {
      logger.log(err);
    }
    return storedValue;
  },
  /** 设置 localStorage 键值
   * 
   * @param {String} key 传入存储值的键 key
   * @param {String} value 传入存储值的值 value
   * @example
   *  localStorage.set('key1','value1');
   *  localStorage.get('key1'); //=> value1
   */
  set: function (key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch(err) {
      logger.log(err);
    }
  },
  /** 删除 localStorage 键值
   * 
   * @param {*} key 传入存储值的键 key
   * @example
   * localStorage.remove('key2');
   * localStorage.get('key2') //=> null
   */
  remove: function (key) {
    window.localStorage.removeItem(key);
  },
  /** 检测当前浏览器是否支持 localStorage 存储
   * 
   * @returns {Boolean} 返回当前浏览器是否支持 localStorage 存储
   * @example
   * // 在支持 localStorage 的浏览器中
   * localStorage.isSupport() //=> true
   */
  isSupport: function () {
    var supported = true;
    try {
      var supportName = '__local_store_support__';
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

/** 检测传入参数是否是对象类型
 * @category Util
 * @param {*} arg 传入参数
 * @returns {Boolean} 是否是对象类型
 * @function isObject
 * @example 
 * isObject({}) //=> true
 * isObject(1) //=> false
 */
function isObject(arg) {
  if (arg == null) {
    return false;
  } else {
    return Object.prototype.toString.call(arg) == '[object Object]';
  }
}

/** 获取指定数字范围内的随随机数
 * @param {Number} max 随机数最大值
 * @category Math
 * @function getRandomBasic
 * @return 指定数字范围内的随机数
 * 
 * @example
 * getRandomBasic(100) //=> 85
 */
var getRandomBasic = (function () {
  var today = new Date();
  var seed = today.getTime();
  function rnd() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280.0;
  }
  return function rand(number) {
    return Math.ceil(rnd() * number);
  };
})();

/** 安全的 js 随机数生成方式,返回与原生 Math.random 类似的 0-1 的随机数值
 * @function getRandom
 * @category Math
 * @returns {Number} 一个介于 0 -1 的数字
 *
 * @example
 * getRandom() //=> 0.8368784293552812
 */
function getRandom() {
  if (typeof Uint32Array === 'function') {
    var cry = '';
    if (typeof crypto !== 'undefined') {
      cry = crypto;
    } else if (typeof msCrypto !== 'undefined') {
      // eslint-disable-next-line no-undef
      cry = msCrypto;
    }
    if (isObject(cry) && cry.getRandomValues) {
      var typedArray = new Uint32Array(1);
      var randomNumber = cry.getRandomValues(typedArray)[0];
      var integerLimit = Math.pow(2, 32);
      return randomNumber / integerLimit;
    }
  }
  return getRandomBasic(10000000000000000000) / 10000000000000000000;
}

/** 对传入字符串进行安全的 JSON 反序列化操作，如果反序列化失败则返回 null
 * @category Encoding
 * @param {String} str 传入字符串
 * @returns {Object} 反序列化后的对象
 * @function safeJSONParse
 * 
 * @example
 * safeJSONParse('{\"a\":124}') //=> {a: 124}
 */
function safeJSONParse(str) {
  var val = null;
  try {
    val = JSON.parse(str);
    // eslint-disable-next-line no-empty
  } catch (e) { }
  return val;
}

/** ConcurrentStorage 构造函数
 * @category Util
 * @param {String} lockGetPrefix get 方法，锁前缀
 * @param {String} lockSetPrefix set 方法，锁前缀
 * @returns {Undefined} 没有返回值
 * @function ConcurrentStorage
 * @example 
 * new ConcurrentStorage('123', '123') //=> undefined
 */
function ConcurrentStorage(lockGetPrefix, lockSetPrefix) {
  this.lockGetPrefix = lockGetPrefix || 'lock-get-prefix';
  this.lockSetPrefix = lockSetPrefix || 'lock-set-prefix';
}

/** 是用 lock 的方式从 localStorage 中读取，解决多 Tab 竞争，某一对 key-value 只会被一个 Tab 读取，并在读取后删除
 * @category Util
 * @param {String} key 读取的键
 * @param {Number} lockTimeout 加锁时长
 * @param {Number} checkTime 加锁后校验随机数时长
 * @param {Function} callback 读取 key 回调，如果 key-value 不归属于当前 Tab 则 callback(null)
 * @returns {Undefined} 没有返回值
 * @function LocalStorage.prototype.get
 * @example 
 * let lock = new ConcurrentStorage('123'); lock.get('123', 10000, 1000, function() {}) //=> undefined
 */
ConcurrentStorage.prototype.get = function (key, lockTimeout, checkTime, callback) {
  if (!key) throw new Error('key is must');
  lockTimeout = lockTimeout || 10000;
  checkTime = checkTime || 1000;
  callback = callback || function () {};
  var lockKey = this.lockGetPrefix + key;
  var lock = _localStorage.get(lockKey);
  var randomNum = String(getRandom());
  if (lock) {
    lock = safeJSONParse(lock) || { randomNum: 0, expireTime: 0 };
    if (lock.expireTime > now()) {
      return callback(null);
    }
  }
  _localStorage.set(lockKey, JSON.stringify({ randomNum: randomNum, expireTime: now() + lockTimeout }));
  setTimeout(function () {
    lock = safeJSONParse(_localStorage.get(lockKey)) || { randomNum: 0, expireTime: 0 };
    if (lock && lock.randomNum === randomNum) {
      callback(_localStorage.get(key));
      _localStorage.remove(key);
      _localStorage.remove(lockKey);
    } else {
      callback(null);
    }
  }, checkTime);
};

/** 是用 lock 的方式往 localStorage 中存值，解决多 Tab 竞争，对某个 key 设置 value，最终只有一个 Tab 的 value 会生效
 * @category Util
 * @param {String} key 设置的 key
 * @param {String} val 设置的 value
 * @param {Number} lockTimeout 加锁时长
 * @param {Number} checkTime 加锁后随机数校验时长，决定 key 的归属
 * @param {Function} callback 设置 key 的回调，如果 key 不归属当前 tab，则 callback({ status: 'fail', reason: 'This key is locked' })
 * @returns {Undefined} 没有返回值
 * @function LocalStorage.prototype.set
 * @example
 * let lock = new ConcurrentStorage('123'); lock.set('123', '123', 10000, 1000, function() {}) //=> undefined
 */
ConcurrentStorage.prototype.set = function (key, val, lockTimeout, checkTime, callback) {
  if (!key || !val) throw new Error('key and val is must');
  lockTimeout = lockTimeout || 10000;
  checkTime = checkTime || 1000;
  callback = callback || function () {};
  var lockKey = this.lockSetPrefix + key;
  var lock = _localStorage.get(lockKey);
  var randomNum = String(getRandom());
  if (lock) {
    lock = safeJSONParse(lock) || { randomNum: 0, expireTime: 0 };
    if (lock.expireTime > now()) {
      return callback({ status: 'fail', reason: 'This key is locked' });
    }
  }
  _localStorage.set(lockKey, JSON.stringify({ randomNum: randomNum, expireTime: now() + lockTimeout }));
  setTimeout(function () {
    lock = safeJSONParse(_localStorage.get(lockKey)) || { randomNum: 0, expireTime: 0 };
    if (lock.randomNum === randomNum) {
      _localStorage.set(key, val) && callback({ status: 'success' });
    } else {
      callback({ status: 'fail', reason: 'This key is locked' });
    }
  }, checkTime);
};

function isValidListener(listener) {
  if (typeof listener === 'function') {
    return true;
  } else if (listener && typeof listener === 'object') {
    return isValidListener(listener.listener);
  } else {
    return false;
  }
}

/**
 * @class EventEmitter
 * @category Event
 * @example
 * var e = new EventEmitter()
 * e.on('HelloEvent',function(data){
 *  console.log('Hello Event happens',data);
 * })
 * 
 * e.emit('HelloEvent',123);
 * // Hello Event happens , 123
 */
function EventEmitter() {
  this._events = {};
}

/**
 * 添加事件
 * @param  {String} eventName 事件名称
 * @param  {Function} listener 监听器函数
 * @return {Object} 可链式调用
 */
EventEmitter.prototype.on = function (eventName, listener) {
  if (!eventName || !listener) {
    return false;
  }

  if (!isValidListener(listener)) {
    throw new Error('listener must be a function');
  }

  this._events[eventName] = this._events[eventName] || [];
  var listenerIsWrapped = typeof listener === 'object';

  this._events[eventName].push(
    listenerIsWrapped
      ? listener
      : {
        listener: listener,
        once: false
      }
  );

  return this;
};

/**
 * 添加事件到事件回调函数列表头
 * @param  {String} eventName 事件名称
 * @param  {Function} listener 监听器函数
 * @return {Object} 可链式调用
 */
EventEmitter.prototype.prepend = function (eventName, listener) {
  if (!eventName || !listener) {
    return false;
  }

  if (!isValidListener(listener)) {
    throw new Error('listener must be a function');
  }

  this._events[eventName] = this._events[eventName] || [];
  var listenerIsWrapped = typeof listener === 'object';

  this._events[eventName].unshift(
    listenerIsWrapped
      ? listener
      : {
        listener: listener,
        once: false
      }
  );

  return this;
};

/**
 * 添加事件到事件回调函数列表头，回调只执行一次
 * @param  {String} eventName 事件名称
 * @param  {Function} listener 监听器函数
 * @return {Object} 可链式调用
 */
EventEmitter.prototype.prependOnce = function (eventName, listener) {
  return this.prepend(eventName, {
    listener: listener,
    once: true
  });
};

/**
 * 添加事件，该事件只能被执行一次
 * @param  {String} eventName 事件名称
 * @param  {Function} listener 监听器函数
 * @return {Object} 可链式调用
 */
EventEmitter.prototype.once = function (eventName, listener) {
  return this.on(eventName, {
    listener: listener,
    once: true
  });
};

/**
 * 删除事件
 * @param  {String} eventName 事件名称
 * @param  {Function} listener 监听器函数
 * @return {Object} 可链式调用
 */
EventEmitter.prototype.off = function (eventName, listener) {
  var listeners = this._events[eventName];
  if (!listeners) {
    return false;
  }
  if (typeof listener === 'number') {
    listeners.splice(listener, 1);
  } else if (typeof listener === 'function') {
    for (var i = 0, len = listeners.length; i < len; i++) {
      if (listeners[i] && listeners[i].listener === listener) {
        listeners.splice(i, 1);
      }
    }
  }
  return this;
};

/**
 * 触发事件
 * @param  {String} eventName 事件名称
 * @param  {Array} args 传入监听器函数的参数，使用数组形式传入
 * @return {Object} 可链式调用
 */
EventEmitter.prototype.emit = function (eventName, args) {
  var listeners = this._events[eventName];
  if (!listeners) {
    return false;
  }

  for (var i = 0; i < listeners.length; i++) {
    var listener = listeners[i];
    if (listener) {
      listener.listener.call(this, args || {});
      if (listener.once) {
        this.off(eventName, i);
      }
    }
  }

  return this;
};

/**
 * 删除某一个类型的所有事件或者所有事件
 * @param  {String[]} eventName 事件名称
 */
EventEmitter.prototype.removeAllListeners = function (eventName) {
  if (eventName && this._events[eventName]) {
    this._events[eventName] = [];
  } else {
    this._events = {};
  }
};

/**
 * 返回某一个类型的所有事件或者所有事件
 * @param  {String[]} eventName 事件名称
 */
EventEmitter.prototype.listeners = function (eventName) {
  if (eventName && typeof eventName === 'string') {
    return this._events[eventName];
  } else {
    return this._events;
  }
};

/**  具备异常处理的 URIComponent 解码方法
 * @category Bom
 * @param {String} uri 传入的 uri 字符串
 * @returns {String}  解码后的 uri，如果出现异常则返回原始传入值
 * @function decodeURIComponent
 * @example
 * decodeURIComponent('%2Fhello%E4%B8%96%E7%95%8C') //=> 'hello世界'
 */
function _decodeURIComponent(uri) {
  var result = uri;
  try {
    result = decodeURIComponent(uri);
  } catch (e) {
    result = uri;
  }
  return result;
}

/**
 * 解析传入查询参数到一个含有查询参数列表的 key/value 对象
 * @param {string} queryString - 以问号开头的查询参数字符串
 * @return {Object} 一个含有参数列表的 key/value 对象
 *
 * @example
 * var url = _.getURLSearchParams('?project=testproject&query1=test&silly=willy&field[0]=zero&field[2]=two#test=hash&chucky=cheese');
 *
 * url.project; // => testproject
 * @category Bom
 * @function getURLSearchParams
 */
function getURLSearchParams(queryString) {
  queryString = queryString || '';
  var args = {}; // Start with an empty object
  var query = queryString.substring(1); // Get query string, minus '?'
  var pairs = query.split('&'); // Split at ampersands
  for (var i = 0; i < pairs.length; i++) {
    // For each fragment
    var pos = pairs[i].indexOf('='); // Look for "name=value"
    if (pos === -1) continue; // If not found, skip it
    var name = pairs[i].substring(0, pos); // Extract the name
    var value = pairs[i].substring(pos + 1); // Extract the value
    name = _decodeURIComponent(name); // Decode the name
    value = _decodeURIComponent(value); // Decode the value
    args[name] = value; // Store as a property
  }
  return args; // Return the parsed arguments
}

/** 检测传入参数是否是字符串
 * 
 * @param {*} arg 传入参数
 * @returns {Boolean} 是否是字符串
 * @category Util
 * @function isString
 * @example
 * isString('1234') //=> true
 */
function isString(arg) {
  return Object.prototype.toString.call(arg) == '[object String]';
}

/** 去除字符串开头和结尾的空白字符串
 * 
 * @param {String} str 输入字符串
 * @returns {String} 去除头尾空格后的结果
 * @function trim
 * @category String
 * @example 
 * const str = ' hello world ';
 * const val = trim (str); // val equals "hello world"
 */
function trim(str) {
  return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
}

/**
 * @typedef {Object} URLParser URL 解析器对象，用于添加查询参数，和重新获取添加查询参数后的 URL 字符串
 * @property {Function} setUrl <strong>setUrl(url:String)->void</strong><br>重新设置需要解析的 url
 * @property {Function} addQueryString <strong>addQueryString(obj:Object)->string</strong><br>添加查询参数、传入参数是一个 Key/Value 键值对对象
 * @property {Function} getUrl <strong>getUrl()->string</strong><br>重新获取 URL 字符串
 */

/** 传入 URL 返回一个 URL 解析对象，用于添加查询参数，和重新获取添加查询参数后的 URL 字符串
 * @category Bom
 * @param {String} url 传入需要添加查询参数的的 URL 字符串
 * @returns {URLParser} 一个 URL 解析对象，用于添加查询参数，和重新获取添加查询参数后的 URL 字符串
 * @function urlParse
 * @example
 * let url = 'https://example.com'
 * let u = urlParse(url);
 * u.addQueryString({name:'Alice'});
 * u.getUrl(); // 'https://example.com?name=Alice'
 */
function urlParse(url) {
  var URLParser = function (url) {
    this._fields = {
      Username: 4,
      Password: 5,
      Port: 7,
      Protocol: 2,
      Host: 6,
      Path: 8,
      URL: 0,
      QueryString: 9,
      Fragment: 10
    };
    this._values = {};
    //eslint-disable-next-line
    this._regex = /^((\w+):\/\/)?((\w+):?(\w+)?@)?([^\/\?:]+):?(\d+)?(\/?[^\?#]+)?\??([^#]+)?#?(\w*)/;

    if (typeof url != 'undefined') {
      this._parse(url);
    }
  };

  URLParser.prototype.setUrl = function (url) {
    this._parse(url);
  };

  URLParser.prototype._initValues = function () {
    for (var a in this._fields) {
      this._values[a] = '';
    }
  };

  URLParser.prototype.addQueryString = function (queryObj) {
    if (typeof queryObj !== 'object') {
      return false;
    }
    var query = this._values.QueryString || '';
    for (var i in queryObj) {
      if (new RegExp(i + '[^&]+').test(query)) {
        query = query.replace(new RegExp(i + '[^&]+'), i + '=' + queryObj[i]);
      } else {
        if (query.slice(-1) === '&') {
          query = query + i + '=' + queryObj[i];
        } else {
          if (query === '') {
            query = i + '=' + queryObj[i];
          } else {
            query = query + '&' + i + '=' + queryObj[i];
          }
        }
      }
    }
    this._values.QueryString = query;
  };

  URLParser.prototype.getUrl = function () {
    var url = '';
    url += this._values.Origin;
    url += this._values.Port ? ':' + this._values.Port : '';
    url += this._values.Path;
    url += this._values.QueryString ? '?' + this._values.QueryString : '';
    url += this._values.Fragment ? '#' + this._values.Fragment : '';
    return url;
  };

  URLParser.prototype._parse = function (url) {
    this._initValues();

    var b = this._regex.exec(url);
    if (!b) {
      logger.log('URLParser::_parse -> Invalid URL');
    }

    var urlTmp = url.split('#');
    var urlPart = urlTmp[0];
    var hashPart = urlTmp.slice(1).join('#');
    b = this._regex.exec(urlPart);
    for (var c in this._fields) {
      if (typeof b[this._fields[c]] != 'undefined') {
        this._values[c] = b[this._fields[c]];
      }
    }
    this._values['Hostname'] = this._values['Host'].replace(/:\d+$/, '');
    this._values['Origin'] = this._values['Protocol'] + '://' + this._values['Hostname'];
    this._values['Fragment'] = hashPart;
  };

  return new URLParser(url);
}

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
 * var url = URL('http://www.domain.com:8080/path/index.html?project=testproject&query1=test&silly=willy&field[0]=zero&field[2]=two#test=hash&chucky=cheese');
 *
 * url.hostname; // => www.domain.com
 * url.searchParams.get('project'); // => testproject
 * @category Bom
 * @function URL
 */
function _URL(url) {
  var result = {};
  //var basicProps = ['hash', 'host', 'hostname', 'href', 'origin', 'password', 'pathname', 'port', 'protocol', 'search', 'username'];
  // Some browsers allow objects to be created via URL constructor, but instances do not have the expected url properties.
  // See https://www.caniuse.com/#feat=url
  var isURLAPIWorking = function () {
    var url;
    try {
      url = new URL('https://www.sensorsdata.cn/');
      return url.href === 'https://www.sensorsdata.cn/';
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
      logger.log('Invalid URL');
      return;
    }
    var instance = urlParse(url);
    result.hash = instance._values.Fragment;
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

/** 浏览器环境的生成唯一 ID 的算法
 * @function UUID
 * @category Util
 * @returns {String} 唯一 ID
 * @example
 * UUID() //=> '17f44206897991-078fdaeab826c4c-37677a09-3686400-17f44206898caa'
 */

var UUID = (function () {
  var T = function () {
    var d = 1 * new Date(),
      i = 0;
    while (d == 1 * new Date()) {
      i++;
    }
    return d.toString(16) + i.toString(16);
  };
  var R = function () {
    return getRandom().toString(16).replace('.', '');
  };
  var UA = function () {
    var ua = navigator.userAgent,
      i,
      ch,
      buffer = [],
      ret = 0;

    function xor(result, byte_array) {
      var j,
        tmp = 0;
      for (j = 0; j < byte_array.length; j++) {
        tmp |= buffer[j] << (j * 8);
      }
      return result ^ tmp;
    }

    for (i = 0; i < ua.length; i++) {
      ch = ua.charCodeAt(i);
      buffer.unshift(ch & 0xff);
      if (buffer.length >= 4) {
        ret = xor(ret, buffer);
        buffer = [];
      }
    }

    if (buffer.length > 0) {
      ret = xor(ret, buffer);
    }

    return ret.toString(16);
  };

  return function () {
    // 有些浏览器取个屏幕宽度都异常...
    var se = String(screen.height * screen.width);
    if (se && /\d{5,}/.test(se)) {
      se = se.toString(16);
    } else {
      se = String(getRandom() * 31242)
        .replace('.', '')
        .slice(0, 8);
    }
    var val = T() + '-' + R() + '-' + UA() + '-' + se + '-' + T();
    if (val) {
      return val;
    } else {
      return (String(getRandom()) + String(getRandom()) + String(getRandom())).slice(2, 15);
    }
  };
})();

/** 检测传入参数是否一个 Dom 元素
 * 
 * @param {*} arg 传入参数
 * @returns {Boolean} 是否是 Dom 元素
 * @function isElement
 * @category Util
 * @example
 * var d = document.body;
 * isElement(d); //=> true
 */
function isElement(arg) {
  return !!(arg && arg.nodeType === 1);
}

/** 检测传入参数是否等于 undefined
 * @category Util
 * @param {*} arg 传入参数
 * @returns {Boolean} 是否是 undefined 值
 * @function isUndefined
 * @example
 * isUndefined(undefined) //=> true
 * isUndefined(null) //=> false
 */
function isUndefined(arg) {
  return arg === void 0;
}

/** 检测传入参数是否是数组类型
 * @category Util
 * @param {*} arg 传入参数
 * @function isArray
 * @returns {Boolean} 是否是数组类型
 * 
 * @example 
 * isArray([])//=> true
 */
function isArray(arg) {
  if (Array.isArray && isFunction(isArray)) {
    return Array.isArray(arg);
  }
  return Object.prototype.toString.call(arg) === '[object Array]';
}

/**
 * @typedef {Object} DomElementInfo 包含了 Dom 信息获取和设置方法的对象
 * @property {Function} addClass <strong>addClass (className:String)->void</strong><br>为 Dom 元素添加样式类名
 * @property {Function} removeClass <strong>removeClass(className:String)->void</strong><br>为 Dom 元素删除样式类名
 * @property {Function} hasClass <strong>hasClass(className:String)->Boolean </strong><br>检测 Dom 元素是否具有指定样式类名
 * @property {Function} attr <strong>attr(key:String,?value:String)->String|null </strong><br>获取和设置 Dom 元素属性。当只传 key 不传 value 时，方法获取元素中名为 key 的属性值。当传了 key 和 value 时，方法为 dom 元素设置名为 key 值为 value 的属性。
 * @property {Function} offset <strong>offset()->{left:Number,top:Number} </strong><br>获取 Dom 元素相对浏览器窗口左上角的偏移位置
 * @property {Function} getSize <strong>getSize()->{width:NUmber, height:Number} </strong><br>获取 Dom 元素的宽高
 * @property {Function} getStyle <strong>getStyle(property:String)->String </strong><br>获取 Dom 元素的指定样式的值，如: getStyle('width')
 */

/**
 * @category Dom
 * @param {Element} dom 传入的 dom 元素
 * @returns {DomElementInfo} 元素信息对象，用于获取元素信息
 * @function ry
 * @example
 * var a =  document.getElementById('banner');
 * var b =ry(a);
 * b.addClass('banner-style');
 * // => <h1 id='banner' class='banner-style'> hello world </h1>
 */
function ry(dom) {
  return new DomElementInfo(dom);
}

var DomElementInfo = function (dom) {
  this.ele = dom;
};

var siblings = function (n, elem) {
  var matched = [];

  for (; n; n = n.nextSibling) {
    if (n.nodeType === 1 && n !== elem) {
      matched.push(n);
    }
  }

  return matched;
};

DomElementInfo.prototype = {
  addClass: function (para) {
    var classes = ' ' + this.ele.className + ' ';
    if (classes.indexOf(' ' + para + ' ') === -1) {
      this.ele.className = this.ele.className + (this.ele.className === '' ? '' : ' ') + para;
    }
    return this;
  },
  removeClass: function (para) {
    var classes = ' ' + this.ele.className + ' ';
    if (classes.indexOf(' ' + para + ' ') !== -1) {
      this.ele.className = classes.replace(' ' + para + ' ', ' ').slice(1, -1);
    }
    return this;
  },
  hasClass: function (para) {
    var classes = ' ' + this.ele.className + ' ';
    if (classes.indexOf(' ' + para + ' ') !== -1) {
      return true;
    } else {
      return false;
    }
  },
  attr: function (key, value) {
    if (typeof key === 'string' && isUndefined(value)) {
      return this.ele.getAttribute(key);
    }
    if (typeof key === 'string') {
      value = String(value);
      this.ele.setAttribute(key, value);
    }
    return this;
  },
  offset: function () {
    var rect = this.ele.getBoundingClientRect();
    if (rect.width || rect.height) {
      var doc = this.ele.ownerDocument;
      var docElem = doc.documentElement;

      return {
        top: rect.top + window.pageYOffset - docElem.clientTop,
        left: rect.left + window.pageXOffset - docElem.clientLeft
      };
    } else {
      return {
        top: 0,
        left: 0
      };
    }
  },
  getSize: function () {
    if (!window.getComputedStyle) {
      return { width: this.ele.offsetWidth, height: this.ele.offsetHeight };
    }
    try {
      var bounds = this.ele.getBoundingClientRect();
      return { width: bounds.width, height: bounds.height };
    } catch (e) {
      return { width: 0, height: 0 };
    }
  },
  getStyle: function (value) {
    if (this.ele.currentStyle) {
      return this.ele.currentStyle[value];
    } else {
      return this.ele.ownerDocument.defaultView.getComputedStyle(this.ele, null).getPropertyValue(value);
    }
  },
  wrap: function (elementTagName) {
    var ele = document.createElement(elementTagName);
    this.ele.parentNode.insertBefore(ele, this.ele);
    ele.appendChild(this.ele);
    return ry(ele);
  },
  getCssStyle: function (prop) {
    var result = this.ele.style.getPropertyValue(prop);
    if (result) {
      return result;
    }
    var rules = null;
    if (typeof window.getMatchedCSSRules === 'function') {
      rules = window.getMatchedCSSRules(this.ele);
    }
    if (!rules || !isArray(rules)) {
      return null;
    }
    for (var i = rules.length - 1; i >= 0; i--) {
      var r = rules[i];
      result = r.style.getPropertyValue(prop);
      if (result) {
        return result;
      }
    }
  },
  sibling: function (cur, dir) {
    //eslint-disable-next-line
    while ((cur = cur[dir]) && cur.nodeType !== 1) {}
    return cur;
  },
  next: function () {
    return this.sibling(this.ele, 'nextSibling');
  },
  prev: function () {
    return this.sibling(this.ele, 'previousSibling');
  },
  siblings: function () {
    return siblings((this.ele.parentNode || {}).firstChild, this.ele);
  },
  children: function () {
    return siblings(this.ele.firstChild);
  },
  parent: function () {
    var parent = this.ele.parentNode;
    parent = parent && parent.nodeType !== 11 ? parent : null;
    return ry(parent);
  },
  // 兼容原生不支持 previousElementSibling 的旧版浏览器
  previousElementSibling: function () {
    var el = this.ele;
    if ('previousElementSibling' in document.documentElement) {
      return ry(el.previousElementSibling);
    } else {
      while ((el = el.previousSibling)) {
        if (el.nodeType === 1) {
          return ry(el);
        }
      }
      return ry(null);
    }
  },
  // 得到和当前元素相同类型的同级元素
  getSameTypeSiblings: function () {
    var element = this.ele;
    var parentNode = element.parentNode;
    var tagName = element.tagName.toLowerCase();
    var arr = [];
    for (var i = 0; i < parentNode.children.length; i++) {
      var child = parentNode.children[i];
      if (child.nodeType === 1 && child.tagName.toLowerCase() === tagName) {
        arr.push(parentNode.children[i]);
      }
    }
    return arr;
  },
  //获取元素 path
  getParents: function () {
    try {
      var element = this.ele;
      if (!isElement(element)) {
        return [];
      }
      var pathArr = [element];
      if (element === null || element.parentElement === null) {
        return [];
      }
      while (element.parentElement !== null) {
        element = element.parentElement;
        pathArr.push(element);
      }
      return pathArr;
    } catch (err) {
      return [];
    }
  }
};

/** 兼容低版本 IE 的事件注册方法
 * @category Event
 * @param {HTMLElement|Window} target 事件源，window 或 DOM 元素
 * @param {String} eventName 事件名，如 load、click、mousedown
 * @param {Function} eventHandler 事件处理函数
 * @param {Boolean} ?useCapture 是否使用事件捕获、默认值为 true
 * @example
 * addEvent(window, 'hashchange', function(){
 *  console.log('hash changed.');
 * };
 * @function addEvent
 */
function addEvent(target, eventName, eventHandler, useCapture) {
  function fixEvent(event) {
    if (event) {
      event.preventDefault = fixEvent.preventDefault;
      event.stopPropagation = fixEvent.stopPropagation;
      event._getPath = fixEvent._getPath;
    }
    return event;
  }
  fixEvent._getPath = function () {
    var ev = this;
    return this.path || (this.composedPath && this.composedPath()) || ry(ev.target).getParents();
  };

  fixEvent.preventDefault = function () {
    this.returnValue = false;
  };
  fixEvent.stopPropagation = function () {
    this.cancelBubble = true;
  };

  var register_event = function (element, type, handler) {
    if (useCapture === undefined && type === 'click') {
      useCapture = true;
    }
    if (element && element.addEventListener) {
      element.addEventListener(
        type,
        function (e) {
          e._getPath = fixEvent._getPath;
          handler.call(this, e);
        },
        useCapture
      );
    } else {
      var ontype = 'on' + type;
      var old_handler = element[ontype];
      element[ontype] = makeHandler(element, handler, old_handler, type);
    }
  };
  function makeHandler(element, new_handler, old_handlers, type) {
    var handler = function (event) {
      event = event || fixEvent(window.event);
      if (!event) {
        return undefined;
      }
      event.target = event.srcElement;

      var ret = true;
      var old_result, new_result;
      if (typeof old_handlers === 'function') {
        old_result = old_handlers(event);
      }
      new_result = new_handler.call(element, event);
      // ie浏览器在 beforeunload时不能用返回值 如有返回 会自动弹出一个系统弹窗
      if (type !== 'beforeunload') {
        if (false === old_result || false === new_result) {
          ret = false;
        }
        return ret;
      }
    };
    return handler;
  }

  register_event.apply(null, arguments);
}

/** 监听页面哈希变化或页面历史变化
 * @category Event
 * @param {*} callback 页面哈希变化或页面历史变化时触发的回调函数
 * @function addHashEvent
 * @example
 * addHashEvent(function(){
 *   console.log('page changed');
 * })
 */
function addHashEvent(callback) {
  var hashEvent = 'pushState' in window.history ? 'popstate' : 'hashchange';
  addEvent(window, hashEvent, callback);
}

/** 兼容低版本 IE 的 XMLHttpRequest 的实例化方法
 * @category Bom
 * @param {Boolean} cors 请求是否需要支持跨域
 * @returns {ActiveXObject|XMLHttpRequest} XMLHttpRequest 的实例
 * @function xhr
 */
function xhr(cors) {
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

var nativeForEach = Array.prototype.forEach;
var hasOwnProperty$2 = Object.prototype.hasOwnProperty;

/** 迭代器回调
 * @callback iteratorCallback
 * @param {*} value 当前迭代值
 * @param {Number} index 当前迭代值的下标
 * @param {Object} sourceArray 迭代源数组或对象
 */

/** 对传入数组或对象的每个属性应用迭代器方法进行执行，
 * @param {Object|Array} obj 传入对象
 * @param {iteratorCallback} iterator 迭代器方法
 * @param {Object} context 迭代器方法的执行上下文
 * @category Array
 * @function each
 *
 * @example
 * each([1,2,3],function(v,i,arr){console.log(v,i,arr)})
 * //1,0,[1, 2, 3]
 * //2,1,[1, 2, 3]
 * //3,2,[1, 2, 3]
 *
 */
function each(obj, iterator, context) {
  if (obj == null) {
    return false;
  }
  if (nativeForEach && obj.forEach === nativeForEach) {
    obj.forEach(iterator, context);
  } else if (isArray(obj)) {
    for (var i = 0, l = obj.length; i < l; i++) {
      i in obj && iterator.call(context, obj[i], i, obj);
    }
  } else {
    for (var key in obj) {
      if (hasOwnProperty$2.call(obj, key)) {
        iterator.call(context, obj[key], key, obj);
      }
    }
  }
}

var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
/** 使用源对象对目标对象进行扩展,
 * 只扩展第一层,<br>
 * 如果遇到目标对象已经存在的属性，则直接覆盖目标对象原来的属性值
 * @param {Object} obj 目标扩展对象
 * @param {Object} ext 源对象
 * @returns 扩展后的目标对象
 * @function extend
 * @category Util
 * 
 * @example 
 * var a = {
 *   name:'Alice',
 *   age:18,
 *   address:{
 *     addr1: 'BeiJing' 
 *   }
 *  }
 *  
 *  var b = {
 *   name: 'Bob',
 *   favor: 'Apple',
 *   address:{
 *     addr1: 'TianJing'
 *   }
 *  }
 *  
 *  extend(a,b);
 *  a //=> 
 *  // {
 *  //    name: "Bob",
 *  //    age: 18,
 *  //    favor: "Apple",
 *  //    address:{
 *  //      addr1: 'TianJing'
 *  //    }
 *  //  }
 * 
 */
function extend(obj) {
  each(Array.prototype.slice.call(arguments, 1), function (source) {
    for (var prop in source) {
      if (hasOwnProperty$1.call(source, prop) && source[prop] !== void 0) {
        obj[prop] = source[prop];
      }
    }
  });
  return obj;
}

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
function ajax(para) {
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
          para.success(getJSON(g.responseText));
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

/** 对传入数组的每个值执行映射方法，并返映射后值一个新的数组
 * 
 * @param {Array} obj 传入对象
 * @param {iteratorCallback} iterator 迭代器映射方法
 * @returns 源数组每个元素执行映射方法后的的结果组成的新数组
 * @category Array
 * @function map
 * @example
 * var v =map([1,2,3],function(v,i,arr){
 *   console.log(v,i,arr);
 *   return v+10;
 * })
 * // 1 0 [1, 2, 3]
 * // 2 1 [1, 2, 3]
 * // 3 2 [1, 2, 3]
 * v // [11,12,13]
 */
function map(obj, iterator) {
  var results = [];
  // Not using strict equality so that this acts as a
  // shortcut to checking for `null` and `undefined`.
  if (obj == null) {
    return results;
  }
  if (Array.prototype.map && obj.map === Array.prototype.map) {
    return obj.map(iterator);
  }
  each(obj, function (value, index, list) {
    results.push(iterator(value, index, list));
  });
  return results;
}

/** base64 解码，该方法会自动处理 Unicode 字符，
 * 对等的应使用 base64Encode 方法进行编码
 * @param {String} str 传入待解码字符串
 * @category Encoding
 * @function base64Decode
 * @returns 解码后的字符串
 * 
 * @example
 * base64Decode('aGVsbG/kuJbnlYw=')//=> 'hello世界'
 */
function base64Decode(str) {
  var arr = [];
  try {
    arr = map(atob(str).split(''), function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    });
  } catch (e) {
    arr = [];
  }

  try {
    return decodeURIComponent(arr.join(''));
  } catch (e) {
    return arr.join('');
  }
}

/** base64 编码码，该方法会自动处理 Unicode 字符，
 * 对等的应使用 base64Decode 方法进行解码
 * @param {*} str 传入待编码字符串
 * @function base64Encode
 * @category Encoding
 * @returns base64 编码后的字符串
 * 
 * @example
 * base64Encode('hello世界') //=> 'aGVsbG/kuJbnlYw='
 */
function base64Encode(str) {
  var result = '';
  try {
    result = btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
        return String.fromCharCode('0x' + p1);
      })
    );
  } catch (e) {
    result = str;
  }
  return result;
}

/**
 * @callback bindReadyCallback
 * @param {Event|String} e  DOMContentLoaded 或 readystatechange 时间回调参数<br>
 * 当页面已经加载完成时，e 的值为 'lazy' 字符串
 */


/** 监听页面加载完成，页面加载完成时执行回调。
 * 通过 <br>
 * 1. 监听 readystatechange 事件，在事件回调中检测当 readyState 值为 complete 时执行回调<br>
 * 2. 监听 DOMContentLoaded 事件，在事件回调中检测当 readyState 值为 complete 时执行回调<br>
 * 3. 监听 load 事件，在事件回调中检测当 readyState 值为 complete 时执行回调<br>
 * 三个监听任何一个达成回调值行逻辑后取消所有监听 <br>
 * 页面加载完成时调用该方法，会立刻回调，并收到 lazy 回调值
 * @param {bindReadyCallback} fn 页面加载完成回调
 * @param {Window} win 指定 Window
 * @function bindReady
 * @category Event
 * @example
 * bindReady(function()
 * {
 *    console.log('page load complete')
 * });
 */
function bindReady(fn, win) {
  win = win || window;
  var done = false,
    top = true,
    doc = win.document,
    root = doc.documentElement,
    modern = doc.addEventListener,
    add = modern ? 'addEventListener' : 'attachEvent',
    rem = modern ? 'removeEventListener' : 'detachEvent',
    pre = modern ? '' : 'on',
    init = function (e) {
      if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
      (e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
      if (!done && (done = true)) fn.call(win, e.type || e);
    },
    poll = function () {
      try {
        root.doScroll('left');
      } catch (e) {
        setTimeout(poll, 50);
        return;
      }
      init('poll');
    };

  if (doc.readyState == 'complete') fn.call(win, 'lazy');
  else {
    if (!modern && root.doScroll) {
      try {
        top = !win.frameElement;
      } catch (e) {
        logger.log(e);
      }
      if (top) poll();
    }
    doc[add](pre + 'DOMContentLoaded', init, false);
    doc[add](pre + 'readystatechange', init, false);
    win[add](pre + 'load', init, false);
  }
}

/** 获取和设置 cookie 的模块
 * @category Bom
 * @exports cookie
 */
var cookie = {
  /** 根据传入的 cookie 名获取 cookie 值
   * 
   * @param {*} name 要获取的 cookie 名
   * @returns 传入 cookie 名的值
   * @example 
   * cookie.set('key1','value1')
   * cookie.get('key1');//=> value1
   */
  get: function (name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) == 0) {
        return _decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
    return null;
  },
  /** 根据传入信息设置 cookie
   * 
   * @param {String} name 要设置的 cookie 名
   * @param {String} value 要设置的 cookie 值
   * @param {Number} days 以天为单位的过期时间
   * @param {Boolean} cross_subdomain 是否支持跨子域恭共享，即将 cookie 写入最顶层域名
   * 例如在 a.example.com 中的 cookie 的 domain 将写为 example.com,这样
   * b.example.com 也能读取 a.example 的 cookie，达成 cookie 共享
   * @param {String} cookie_samesite 是否允许跨站请求携带 cookie，可选值有 Lax，Strict，None
   * @param {Boolean} is_secure 是否允许 http 请求携带 cookie，设置为 true 后 cookie 只能通过 https 发送
   * @param {String} domain 设置 cookie 存储的 domain 值
   * 
   * @example 
   * cookie.set('key2','value2',10,true,true,true)
   * cookie.get('key2');//=> value2
   */
  set: function (name, value, days, cross_subdomain, cookie_samesite, is_secure, domain) {
    var cdomain = domain,
      expires = '',
      secure = '',
      samesite = '';
    days = days == null ? 73000 : days;

    // 0 session
    // -1 马上过期
    if (days !== 0) {
      var date = new Date();
      // 默认是天，可以是秒
      if (String(days).slice(-1) === 's') {
        date.setTime(date.getTime() + Number(String(days).slice(0, -1)) * 1000);
      } else {
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      }

      expires = '; expires=' + date.toGMTString();
    }
    if (isString(cookie_samesite) && cookie_samesite !== '') {
      samesite = '; SameSite=' + cookie_samesite;
    }
    if (is_secure) {
      secure = '; secure';
    }

    function getValid(data) {
      if (data) {
        return data.replace(/\r\n/g, '');
      } else {
        return false;
      }
    }
    var valid_name = '';
    var valid_value = '';
    var valid_domain = '';
    if (name) {
      valid_name = getValid(name);
    }
    if (value) {
      valid_value = getValid(value);
    }
    if (cdomain) {
      valid_domain = getValid(cdomain);
    }
    if (valid_name && valid_value) {
      document.cookie = valid_name + '=' + encodeURIComponent(valid_value) + expires + '; path=/' + valid_domain + samesite + secure;
    }
  },
  /** 删除指定 cookie 名的 cookie 值
   * 
   * @param {*} name 要删除的 cookie 名
   * @returns 传入 cookie 名的值
   * @example 
   * cookie.remove('key1','value1')
   * cookie.get('key1');//=> null
   */
  remove: function (name, cross_subdomain) {
    this.set(name, '1', -1, cross_subdomain);
  },
  /** 通过传入的测试 key 和 value 来判断当前环境是否支持 cookie 存储
   * 
   * @param {String} testKey  测试键值
   * @param {String} testValue 测试值
   * @returns {Boolean} 当前环境是否支持 cookie 存储
   * @example
   * cookie.isSupport('a','1') // => true / false
   */
  isSupport: function (testKey, testValue) {
    testKey = testKey || 'cookie_support_test';
    testValue = testValue || '1';
    var self = this;
    function accessNormal() {
      self.set(testKey, testValue);
      var val = self.get(testKey);
      if (val !== testValue) return false;
      self.remove(testKey);
      return true;
    }
    return navigator.cookieEnabled && accessNormal();
  }
};

/** 使用源对象对目标对象进行扩展，
 * 如果目标已经有该属性则不覆盖,如果没有的属性加进来
 * @param {Object} obj 目标扩展对象
 * @param {Object} ext 源对象
 * @returns 扩展后的目标对象
 * @function coverExtend
 * @category Util
 * 
 * @example
 * var a = {
 *  name:'Alice',
 *  age:18
 * }
 * 
 * var b = {
 *  name: 'Bob',
 *  favor: 'Apple'
 * }
 * 
 * coverExtend(a,b);
 * a //=> { name: "Alice",age: 18,favor: "Apple"}
 * b //=> { name:'Bob',favor:'Apple'}
 */
function coverExtend(obj) {
  each(Array.prototype.slice.call(arguments, 1), function (source) {
    for (var prop in source) {
      if (source[prop] !== void 0 && obj[prop] === void 0) {
        obj[prop] = source[prop];
      }
    }
  });
  return obj;
}

/** 具备异常处理的 URI 解码方法
 * @category Bom
 * @param {String} uri 传入的 uri 字符串
 * @returns {String} 解码后的 uri，如果出现异常则返回原始传入值
 * @function decodeURI
 * @example
 * decodeURI('/hello%E4%B8%96%E7%95%8C') //=> '/hello世界'
 */
function _decodeURI(uri) {
  var result = uri;
  try {
    result = decodeURI(uri);
  } catch (e) {
    result = uri;
  }
  return result;
}

/** 对输入字符串进行乱序混淆，对混淆后的结果再次执行该方法则返回原来输入的值，
 * 只支持大小写字母和数字，其他符号将不作处理
 * @param {String} str 输入字符串
 * @returns 混淆后的值
 * @category Encoding
 * @function dfmapping
 * 
 * @example
 * dfmapping('hello world') //=> 'zrkkm MmekV'
 * dfmapping('zrkkm MmekV') //=> 'hello world'
 * 
 */
function dfmapping(str) {
  var dfk = 't6KJCZa5pDdQ9khoEM3Tj70fbP2eLSyc4BrsYugARqFIw1mzlGNVXOHiWvxUn8';
  var len = dfk.length - 1;
  var relation = {};
  var i = 0;
  for (i = 0; i < dfk.length; i++) {
    relation[dfk.charAt(i)] = dfk.charAt(len - i);
  }
  var newStr = '';
  for (i = 0; i < str.length; i++) {
    if (str.charAt(i) in relation) {
      newStr += relation[str.charAt(i)];
    } else {
      newStr += str.charAt(i);
    }
  }
  return newStr;
}

/** 检测传入参数是否是日期对象
 * @category Util
 * @param {*} arg 传入参数
 * @returns {Boolean} 是否是日期类型
 * @function isDate
 * @example
 * isDate(new Date()) //=> true
 */
function isDate(arg) {
  return Object.prototype.toString.call(arg) == '[object Date]';
}

/** 根据传入的 date 对象返回行如 YYYY-MM-DD HH:MM:SS.sss 的字符串，
 * 如：'2020-02-02 20:20:02.20'
 * @param {Date} date 传入的 date 对象
 * @returns 型如 YYYY-MM-DD:HH:MM:SS.ssssss 的字符串
 * @category Util
 * @function formatDate
 * @example 
 * formatDate(new Date('2020-2-2 8:0:12')) //=> '2020-02-02 08:00:12.00'
 */
function formatDate(date) {
  function pad(n) {
    return n < 10 ? '0' + n : n;
  }
  return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + ' ' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds()) + '.' + pad(date.getMilliseconds());
}

/** 将传入对象中的所有 Date 类型的值转换为格式为 YYYY-MM-DD HH:MM:SS.sss
 * 的字符串
 * @param {Object} obj 传入的对象
 * @returns {String} 传入对象，所有原有 Date 类型的值均已转换为 格式为 YYYY-MM-DD HH:MM:SS.sss 的字符串
 * @category Util
 * @function encodeDates
 * @example
 * var v =  encodeDates(
 * {
 *   a:new Date('2020-02-02 8:0:12')
 * }) 
 * v //=> {a: '2020-02-02 08:00:12.00'}
 */
function encodeDates(obj) {
  each(obj, function (v, k) {
    if (isDate(v)) {
      obj[k] = formatDate(v);
    } else if (isObject(v)) {
      obj[k] = encodeDates(v); // recurse
    }
  });
  return obj;
}

/** 使用源对象对目标对象进行扩展,
 * 允许扩展到第二级
 * @param {Object} obj 目标扩展对象
 * @param {Object} ext 源对象
 * @returns 扩展后的目标对象
 * @function extend2Lev
 * @category Util
 * 
 * @example
 * var a = {
 *  name:'Alice',
 *  age:18,
 *  address:{
 *    addr1: 'BeiJing',
 *    addr2: 'HeiBei'
 *  }
 * }
 * 
 * var b = {
 *  name: 'Bob',
 *  favor: 'Apple',
 *  address:{
 *    addr1: 'TianJing'
 *  }
 * }
 * 
 * extend2Lev(a,b);
 * 
 * a //=>
 * //{ 
 * // name: 'Bob',
 * // age: 18,
 * // favor: 'Apple',
 * // address:{
 * //   addr1: 'TianJing'
 * //   addr2: 'HeiBei'
 * // }
 * //}
 */

function extend2Lev(obj) {
  each(Array.prototype.slice.call(arguments, 1), function (source) {
    for (var prop in source) {
      if (source[prop] !== void 0) {
        if (isObject(source[prop]) && isObject(obj[prop])) {
          extend(obj[prop], source[prop]);
        } else {
          obj[prop] = source[prop];
        }
      }
    }
  });
  return obj;
}

/**
 * @callback filterCallback filter 过滤函数
 * @param {Object} value 数组中的一项数据
 * @param {Number} index 该项数据的下标
 * @param {Array} sourceArray 源数组
 * @returns {Boolean} 是否通过校验，返回 true 则该数据项会被进入 filter 函数返回的新数组中，否则不会
 */

/** 使用指定过滤函数在指定源数组每一项上执行，返回一个新的数组包含指定过滤函数返回真值的数组项
 *
 * @param {Array} arr 指定源数组
 * @param {filterCallback} fn 指定过滤函数
 * @param {Object}  context 指定过滤函数执行上下文
 * @returns {Array} 新的数组，包含指定过滤函数值行返回真值的源数组项
 * @category Array
 * @function filter
 *
 * @example
 * filter([1,2,3,4,5,6],
 * function(v,i,arr)
 * {
 *   console.log(v,i,arr);
 *    return v>=4
 * });
 * //=>
 * // 1 0 [1, 2, 3, 4, 5, 6]
 * // 2 1 [1, 2, 3, 4, 5, 6]
 * // 3 2 [1, 2, 3, 4, 5, 6]
 * // 4 3 [1, 2, 3, 4, 5, 6]
 * // 5 4 [1, 2, 3, 4, 5, 6]
 * // 6 5 [1, 2, 3, 4, 5, 6]
 * // [4,5,6] // return value
 */
function filter(arr, fn, context) {
  var hasOwn = Object.prototype.hasOwnProperty;
  if (arr.filter) {
    return arr.filter(fn);
  }
  var ret = [];
  for (var i = 0; i < arr.length; i++) {
    if (!hasOwn.call(arr, i)) {
      continue;
    }
    var val = arr[i];
    if (fn.call(context, val, i, arr)) {
      ret.push(val);
    }
  }
  return ret;
}

/** 指定两个空格作为缩进，对传入对象进行 JSON 字符串转换
 * 
 * @param {Object} obj 传入对象
 * @returns 转换后的 JSON 字符串
 * @function formatJsonString
 * @category Encoding
 * @example 
 * formatJsonString({a:1}) // => '{\n  "a": 1\n}'
 */
function formatJsonString(obj) {
  try {
    return JSON.stringify(obj, null, '  ');
  } catch (e) {
    return JSON.stringify(obj);
  }
}

/**
 * 
 * @param {String} hostname 
 * 传入 hostname，返回一个经过安全校验的 hostname
 * @returns {String}
 */
function getSafeHostname(hostname){
  //eslint-disable-next-line
  if(typeof hostname === 'string' &&  hostname.match(/^[a-zA-Z0-9\u4e00-\u9fa5\-\.]+$/)){
    return hostname;
  }else {
    return '';
  }
}

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
function getCookieTopLevelDomain(hostname, testFlag) {
  hostname = hostname || location.hostname;
  testFlag = testFlag || 'domain_test';
 
  var new_hostname = getSafeHostname(hostname);

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

/** 通过选择器获取 dom 元素
 * 
 * @param {String} selector 选择器
 * @returns {Element} 与选择器匹配的 dom 元素
 * @category Dom
 * @function getDomBySelector
 */
function getDomBySelector(selector) {
  if (!isString(selector)) {
    return null;
  }
  var arr = selector.split('>');
  var el = null;

  function getDom(selector, parent) {
    selector = trim(selector);
    var node;
    if (selector === 'body') {
      return document.getElementsByTagName('body')[0];
    }
    if (selector.indexOf('#') === 0) {
      //如果是id选择器 #login
      selector = selector.slice(1);
      node = document.getElementById(selector);
    } else if (selector.indexOf(':nth-of-type') > -1) {
      //div:nth-of-type(1)
      var arr = selector.split(':nth-of-type');
      if (!(arr[0] && arr[1])) {
        //格式不正确，返回空
        return null;
      }
      var tagname = arr[0];
      var indexArr = arr[1].match(/\(([0-9]+)\)/);
      if (!(indexArr && indexArr[1])) {
        //没有匹配到正确的标签序号，返回空
        return null;
      }
      var num = Number(indexArr[1]); //标签序号
      if (!(isElement(parent) && parent.children && parent.children.length > 0)) {
        return null;
      }
      var child = parent.children;

      for (var i = 0; i < child.length; i++) {
        if (isElement(child[i])) {
          var name = child[i].tagName.toLowerCase();
          if (name === tagname) {
            num--;
            if (num === 0) {
              node = child[i];
              break;
            }
          }
        }
      }
      if (num > 0) {
        //子元素列表中未找到
        return null;
      }
    }
    if (!node) {
      return null;
    }
    return node;
  }

  function get(parent) {
    var tagSelector = arr.shift();
    var element;
    if (!tagSelector) {
      return parent;
    }
    try {
      element = getDom(tagSelector, parent);
    } catch (error) {
      logger.log(error);
    }
    if (!(element && isElement(element))) {
      return null;
    } else {
      return get(element);
    }
  }
  el = get();
  if (!(el && isElement(el))) {
    return null;
  } else {
    return el;
  }
}

/** 获取元素的文本内容
 * 
 * @param {Element} element dom 元素
 * @param {String} tagName 元素的标签名
 * @returns {String} 元素文本内容
 * @function getElementContent
 * @category Dom
 * 
 * @example
 * var button = document.getElementById('btn1'); // <button id='btn1'>test</button>
 * getElementContent(button,'button'); //=> test
 */
function getElementContent(element, tagName) {
  var textContent = '';
  var element_content = '';
  if (element.textContent) {
    textContent = trim(element.textContent);
  } else if (element.innerText) {
    textContent = trim(element.innerText);
  }
  if (textContent) {
    textContent = textContent
      .replace(/[\r\n]/g, ' ')
      .replace(/[ ]+/g, ' ')
      .substring(0, 255);
  }
  element_content = textContent || '';

  if (tagName === 'input' || tagName === 'INPUT') {
    element_content = element.value || '';
  }
  return element_content;
}

/** 获取指定 url 的域名
 * 
 * @param {String} url 传入指定的 url 
 * @param {String} defaultValue 域名默认值，如果解析失败则返回该默认值
 * @returns 解析到的 url 的域名
 * @category Bom
 * @function getHostname
 * @example getHostname('https://www.example.com') //=> 'www.example.com'
 */
function getHostname(url, defaultValue) {
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

/** 通过调用 Navigator.appVersion 获取 ios 系统版本号
 * @function getIOSVersion
 * @category Bom
 * @returns {String} IOS 设备的系统版本号,如果获取失败则返回空字符串
 */
function getIOSVersion() {
  try {
    var version = navigator.appVersion.match(/OS (\d+)[._](\d+)[._]?(\d+)?/);
    return version && version[1] ? Number.parseInt(version[1], 10) : '';
  } catch (e) {
    return '';
  }
}

/**
 * 解析传入 url 中查询参数到一个含有查询参数列表的 key/value 对象
 * @param {string} url - 传入 url 字符串
 * @return {Object} 一个含有参数列表的 key/value 对象
 *
 * @example
 * var url = _.getQueryParamsFromUrl('https://a.b.com?project=testproject&query1=test&silly=willy&field[0]=zero&field[2]=two#test=hash&chucky=cheese');
 *
 * url.project; // => testproject
 * @category Bom
 * @function getQueryParamsFromUrl
 */

function getQueryParamsFromUrl(url) {
  var result = {};
  var arr = url.split('?');
  var queryString = arr[1] || '';
  if (queryString) {
    result = getURLSearchParams('?' + queryString);
  }
  return result;
}

/** 获取 url 中指定查询参数的值
 *
 * @param {String} url 传入 url
 * @param {String} key 指定需要获取的查询参数的 key
 * @returns {String} url 查询参数中指定 key 的值
 * @function getQueryParam
 * @category Bom
 * @example
 * var val = getQueryParam('https://a.b.com?a=1&b=2','b');
 * console.log(val); // => 2
 */
function getQueryParam(url, key) {
  //eslint-disable-next-line
  var urlParts = _URL(url);
  var result = urlParts.searchParams.get(key) || '';

  if (!result) {
    var hash = urlParts.hash;
    if (hash) {
      var results = getQueryParamsFromUrl(hash);
      result = results[key] || '';
    }
  }

  return result;
}

/** 检测是否支持媒体查询
 * @function mediaQueriesSupported
 * @category Bom
 * @returns {Boolean}  是否支持媒体查询
 * @example
 * // 支持媒体查询的浏览器中
 * mediaQueriesSupported()// => true
 */
function mediaQueriesSupported() {
  return typeof window.matchMedia != 'undefined' || typeof window.msMatchMedia != 'undefined';
}

/** 返回当前屏幕方向，可能值 ['未取到值', 'landscape', 'portrait']
  * 经过以下测试：<br>
  * IE 6 => '未取到值'<br>
  * Opera 15 on macOS<br>
  * Firefox 68 on macOS<br>
  * Safari 12.1 on macOS<br>
  * Chrome 75 on macOS<br>
  * Safari on iPhone X<br>
  * Chrome on Google Pixel 2<br>
  * @category Bom
  * @function getScreenOrientation
  * @returns 屏幕方向，可能值 ['未取到值', 'landscape', 'portrait']
  * @example getScreenOrientation() //=> 'landscape'
 */
function getScreenOrientation() {
  // Screen Orientation API
  var screenOrientationAPI = screen.msOrientation || screen.mozOrientation || (screen.orientation || {}).type;
  var screenOrientation = '未取到值';
  if (screenOrientationAPI) {
    screenOrientation = screenOrientationAPI.indexOf('landscape') > -1 ? 'landscape' : 'portrait';
  } else if (mediaQueriesSupported()) {
    // matchMedia
    var matchMediaFunc = window.matchMedia || window.msMatchMedia;
    if (matchMediaFunc('(orientation: landscape)').matches) {
      screenOrientation = 'landscape';
    } else if (matchMediaFunc('(orientation: portrait)').matches) {
      screenOrientation = 'portrait';
    }
  }
  return screenOrientation;
}

/**
 * @typedef BrowserInfo 浏览器信息
 * @property {Number} ?opera 欧朋版本号
 * @property {Number} ?ie IE 版本号
 * @property {Number} ?edge Edge 版本号
 * @property {Number} ?firefox Firefox 版本号
 * @property {Number} ?chrome Chrome 版本号
 * @property {Number} ?safari Safari 版本号
 */

/** 通过浏览器 UserAgent 获取当前浏览器型号和版本
 * @category Bom
 * @returns {BrowserInfo} 浏览器型号和版本
 * @function getUA
 * @example
 * var browserInfo = getUA();
 * console.log(browserInfo); // => {chrome: 98}
 */
function getUA() {
  var Sys = {};
  var ua = navigator.userAgent.toLowerCase();
  var s;
  if ((s = ua.match(/ qq\/([\d.]+)/))) {
    Sys.qqBuildinBrowser = Number(s[1].split('.')[0]);
  } else if ((s = ua.match(/mqqbrowser\/([\d.]+)/))) {
    Sys.qqBrowser = Number(s[1].split('.')[0]);
  } else if ((s = ua.match(/opera.([\d.]+)/))) {
    Sys.opera = Number(s[1].split('.')[0]);
  } else if ((s = ua.match(/msie ([\d.]+)/))) {
    Sys.ie = Number(s[1].split('.')[0]);
  } else if ((s = ua.match(/edge.([\d.]+)/))) {
    Sys.edge = Number(s[1].split('.')[0]);
  } else if ((s = ua.match(/firefox\/([\d.]+)/))) {
    Sys.firefox = Number(s[1].split('.')[0]);
  } else if ((s = ua.match(/chrome\/([\d.]+)/))) {
    Sys.chrome = Number(s[1].split('.')[0]);
  } else if ((s = ua.match(/version\/([\d.]+).*safari/))) {
    Sys.safari = Number(s[1].match(/^\d*.\d*/));
  } else if ((s = ua.match(/trident\/([\d.]+)/))) {
    Sys.ie = 11;
  }
  return Sys;
}

/** 对传入的 url 字符串进行头尾空格去除，并进行 decodeURI 解码<br>
 * 若未传入 url 则对当前页面的地址进行 decodeURI 解码并返回
 * @param {String} ?url 传入 url 字符串
 * @returns 返回解码后的 url 或 decodeURI 解码后的当前页面地址
 * @category Bom
 * @function getURL
 * 
 * @example
 * // 在 https://www.example.com
 * getURL() //=> https://www.example.com
 */
function getURL(url) {
  if (isString(url)) {
    url = trim(url);
    return _decodeURI(url);
  } else {
    return _decodeURI(location.href);
  }
}

/** 对传入的 url_path 字符串进行头尾空格去除，并进行 decodeURI 解码<br>
 * 若未传入 url_path 则对当前页面 URL 的路径部分进行 decodeURI 解码并返回
 * @param {String} ?url_path 传入 url_path 字符串
 * @returns 返回解码后的 url_path 或 decodeURI 解码后的当前页面 URL 的路径部分
 * @category Bom
 * @function getURLPath
 *
 * @example
 * // 在 "http://localhost:8080/世界.html"
 * getURLPath() //=> "/世界.html"
 */
function getURLPath(url_path) {
  if (isString(url_path)) {
    url_path = trim(url_path);
    return _decodeURI(url_path);
  } else {
    return _decodeURI(location.pathname);
  }
}

/** 检测是否具有指定属性名的属性
 * @category Dom
 * @param {Element} ele 传入 dom 元素
 * @param {String} attrName 属性名
 * @returns {Boolean} 是否具有指定属性名的属性
 * @function hasAttribute
 * 
 * @example
 * var d = document.getElementById('sp1'); //<div id='sp1' test='123'></div>
 * hasAttribute(d,'test') //=> true
 */
function hasAttribute(ele, attrName) {
  if (ele.hasAttribute) {
    return ele.hasAttribute(attrName);
  } else if (ele.attributes) {
    return !!(ele.attributes[attrName] && ele.attributes[attrName].specified);
  }
}

/** 检测传入 Dom 元素是否具有指定属性名数组中有至少一个属性
 * @category Dom
 * @param {Element} ele 传入 Dom 元素
 * @param {Array} attrNames 传入属性名字符串数组
 * @returns Dom 元素是否具有指定属性名数组中有至少一个属性
 * @function hasAttributes
 * 
 * @example
 * var d = document.getElementById('sp1'); //<div id='sp1' test='123' test2='345'></div>
 * hasAttribute(d,['test']) //=> true
 */
function hasAttributes(ele, attrNames) {
  if (typeof attrNames === 'string') {
    return hasAttribute(ele, attrNames);
  } else if (isArray(attrNames)) {
    var result = false;
    for (var i = 0; i < attrNames.length; i++) {
      var testResult = hasAttribute(ele, attrNames[i]);
      if (testResult) {
        result = true;
        break;
      }
    }
    return result;
  }
}

/** 对传入字符串做哈希计算,取值范围为 ±1E10
 * @category Encoding
 * @param {*} str 传入字符串 
 * @returns 传入字符串的 hash 值
 * @function hashCode 
 * 
 * @example
 * hasdCode('hello world') //=> 1794106052
 */
function hashCode(str) {
  if (typeof str !== 'string') {
    return 0;
  }
  var hash = 0;
  var char = null;
  if (str.length == 0) {
    return hash;
  }
  for (var i = 0; i < str.length; i++) {
    char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash;
}

/** 对传入字符串进行 hash 计算，哈希值范围为 JS 可表示的安全值范围 ±9E15
 * @category Encoding
 * @param {String} str 传入字符串
 * @returns {Number} 传入字符串的哈希值
 * @function hashCode53
 * 
 * @example
 * hashCode53('hello world') //=> -5975507814869267
 */
function hashCode53(str) {
  var max53 = 9007199254740992;
  var min53 = -9007199254740992;
  var factor = 31;
  var hash = 0;
  if (str.length > 0) {
    var val = str.split('');
    for (var i = 0; i < val.length; i++) {
      var aVal = val[i].charCodeAt();
      var nextHash = factor * hash + aVal;
      if (nextHash > max53) {
        hash = min53 + hash;
        while (((nextHash = factor * hash + aVal), nextHash < min53)) {
          hash = hash / 2 + aVal;
        }
      }
      if (nextHash < min53) {
        hash = max53 + hash;
        while (((nextHash = factor * hash + aVal), nextHash > max53)) {
          hash = hash / 2 + aVal;
        }
      }
      hash = factor * hash + aVal;
    }
  }
  return hash;
}

/** 在指定数组中查找目标对象的位置，若没有找到则返回 -1
 * 
 * @param {Array} arr 传入数组
 * @param {Object} target 查找目标
 * @returns 查找目标的下标
 * @function indexOf
 * @category Array
 * 
 * @example
 * indexOf([1,2,3,4],2) //=> 1
 */
function indexOf(arr, target) {
  var indexof = arr.indexOf;
  if (indexof) {
    return indexof.call(arr, target);
  } else {
    for (var i = 0; i < arr.length; i++) {
      if (target === arr[i]) {
        return i;
      }
    }
    return -1;
  }
}

/** 简单的原型链继承
 * @category Util
 * @function inherit
 * @param {Function} subclass 子类构造函数
 * @param {Function} superclass 父类构造函数
 * @returns {Function} 继承父类后的字类
 * 
 * @example
 * function A (){
 *  this.say = function (arg){
 *    console.log('say: ' + arg);
 *  }
 * }
 * 
 * function B(){
 *  this.sing = function (arg){
 *    console.log('sing: ' +  arg);
 *  }
 * }
 * 
 * inherit(A,B);
 * 
 * var a =new A();
 * a.say('hello'); // say: hello
 * a.sing('hello'); // sing: hello
 */
function inherit(subclass, superclass) {
  subclass.prototype = new superclass();
  subclass.prototype.constructor = subclass;
  subclass.superclass = superclass.prototype;
  return subclass;
}

var hasOwnProperty = Object.prototype.hasOwnProperty;

/**检测是否是函数内部 arguments 对象
 * @category Util
 * @param {*} arg 传入参数 
 * @returns {Boolean} 是否是函数内部 arguments 对象
 * @function isArguments
 * 
 * @example 
 * (
 * function(){
 * var v = isArguments(arguments); 
 * console.log(v) //=> true
 * }()
 * )
 */
function isArguments(arg) {
  return !!(arg && hasOwnProperty.call(arg, 'callee'));
}

/**检测是否是布尔值
 * @category Util
 * @param {*} arg 传入参数
 * @returns {Boolean} 是否是布尔类型
 * @function isBoolean
 * 
 * @example
 * isBoolean(true) //=> true
 */
function isBoolean(arg) {
  return Object.prototype.toString.call(arg) == '[object Boolean]';
}

/** 检测传入参数是否是空对象
 * @category Util
 * @param {*} arg 传入参数
 * @returns {Boolean} 是否是空对象
 * @function isEmptyObject
 * @example
 * isEmptyObject({}) //=> true
 */
function isEmptyObject(arg) {
  if (isObject(arg)) {
    for (var key in arg) {
      if (Object.prototype.hasOwnProperty.call(arg, key)) {
        return false;
      }
    }
    return true;
  }
  return false;
}

/** 检测传入字符串是否是 http 或 https 地址
 * @category Util
 * @param {String} str 传入字符串
 * @returns {Boolean} 是否是 http 或 https 地址
 * @function isHttpUrl
 * 
 * @example
 * isHttpUrl('https://www.example.com') //=> true
 */
function isHttpUrl(str) {
  if (typeof str !== 'string') return false;
  var _regex = /^https?:\/\/.+/;
  if (_regex.test(str) === false) {
    logger.log('Invalid URL');
    return false;
  }
  return true;
}

/** 检测是否是 iOS 系统
 * @category Bom
 * @function isIOS
 * @returns {Boolean} 是否是 iOS 系统
 * 
 * @example
 * // 在 iOS 设备中
 * isIOS() //=> true
 */
function isIOS() {
  return !!navigator.userAgent.match(/iPhone|iPad|iPod/i);
}

/** 检测传入参数是否是合法 JSON 字符串
 * @category Util
 * @param {String} arg 传入字符串
 * @returns {Boolean} 是否是合法 JSON 字符串类型
 * @function isJSONString
 * @example
 * isJSONString("{\"a\":123}") //=> true
 */
function isJSONString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

/** 检测传入参数是否是数字
 * @category Util
 * @param {*} arg 传入参数
 * @returns {Boolean} 是否是数字类型
 * @function isNumber
 * 
 * @example
 * isNumber(1234) //=> true
 */
function isNumber(arg) {
  /* eslint-disable-next-line */
  return Object.prototype.toString.call(arg) == '[object Number]' && /[\d\.]+/.test(String(arg));
}

/** 检测是否支持 Beacon 数据发送
 * @category Bom
 * @function isSupportBeaconSend
 * @returns {Boolean} 是否支持 Beacon 数据发送
 * @example 
 * // 再支持 beacon 的浏览器中
 * isSupportBeaconSend()//=> true
 */
function isSupportBeaconSend() {
  var supported = false;
  if (typeof navigator !== 'object' || typeof navigator.sendBeacon !== 'function') {
    return supported;
  }

  var Sys = getUA();
  var ua = navigator.userAgent.toLowerCase();
  //sendBeacon 浏览器兼容性检测
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
    //iOS 上的 Safari11.1–12 无法向未访问的来源发送信号，已在iOS13中修复。
    var reg = /os [\d._]*/gi;
    var verinfo = ua.match(reg);
    var version = (verinfo + '').replace(/[^0-9|_.]/gi, '').replace(/_/gi, '.');
    var ver = version.split('.');
    if (typeof Sys.safari === 'undefined') {
      Sys.safari = ver[0];
    }
    if (ver[0] && (Sys.qqBuildinBrowser || Sys.qqBrowser)) {
      supported = false;
    } else if (ver[0] && ver[0] < 13) {
      if (Sys.chrome > 41 || Sys.firefox > 30 || Sys.opera > 25 || Sys.safari > 12) {
        supported = true;
      }
    } else if (Sys.chrome > 41 || Sys.firefox > 30 || Sys.opera > 25 || Sys.safari > 11.3) {
      supported = true;
    }
  } else {
    if (Sys.chrome > 38 || Sys.edge > 13 || Sys.firefox > 30 || Sys.opera > 25 || Sys.safari > 11.0) {
      supported = true;
    }
  }
  return supported;
}

/** 检测是否支持跨域的 ajax 数据发送
 * @category Bom
 * @function isSupportCors
 * @returns {Boolean}
 * @example 
 * // 在支持跨域请求的浏览器中 
 * isSupportCors()//=> true
 */
function isSupportCors() {
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
function jsonp(obj) {
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

/**
 * @typedef listenPageStateArg 监听页面状态变化参数
 * @property {callback} visible 页面从不见到可见回调
 * @property {callback} hidden 页面从可见到不可见对调
 */

/** 监听页面状态变化，包括页面隐藏、显示、切换、获取焦点、丢失焦点<br>
 * 暴露 visible 和 hidden 回调，详细参见 listenPageStateArg <br>
 * <strong>触发 visible 回调的时机:</strong> 获取焦点、或 visibilitychange 事件发生且当前页面可见 <br>
 * <strong>触发 hidden 回调的时机:</strong>丢失焦点、或 visibilitychange 事件发生且当前页面不可见 <br>
 * @param {listenPageStateArg} obj 监听页面传参数、详细参见 listenPageStateArg
 * @category Event
 * @function listenPageState
 * 
 * @example
 * listenPageState({
 *  visible:function(){
 *   console.log('Page shows');
 *  },
 *  hidden:function(){
 *   console.log('Page hides');
 *  }
 * })
 */
function listenPageState(obj) {
  var visibilystore = {
    visibleHandler: isFunction(obj.visible) ? obj.visible : function () { },
    hiddenHandler: isFunction(obj.hidden) ? obj.hidden : function () { },
    visibilityChange: null,
    hidden: null,
    isSupport: function () {
      return typeof document[this.hidden] !== 'undefined';
    },
    init: function () {
      if (typeof document.hidden !== 'undefined') {
        this.hidden = 'hidden';
        this.visibilityChange = 'visibilitychange';
      } else if (typeof document.mozHidden !== 'undefined') {
        this.hidden = 'mozHidden';
        this.visibilityChange = 'mozvisibilitychange';
      } else if (typeof document.msHidden !== 'undefined') {
        this.hidden = 'msHidden';
        this.visibilityChange = 'msvisibilitychange';
      } else if (typeof document.webkitHidden !== 'undefined') {
        this.hidden = 'webkitHidden';
        this.visibilityChange = 'webkitvisibilitychange';
      }
      this.listen();
    },
    listen: function () {
      if (!this.isSupport()) {
        addEvent(window, 'focus', this.visibleHandler);
        addEvent(window, 'blur', this.hiddenHandler);
      } else {
        var _this = this;
        addEvent(
          document,
          this.visibilityChange,
          function () {
            if (!document[_this.hidden]) {
              _this.visibleHandler();
            } else {
              _this.hiddenHandler();
            }
          },
          1
        );
      }
    }
  };
  visibilystore.init();
}

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
function loadScript(para) {
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

/** 删除传入字符串开头的 'javascript'
 * 
 * @param {String} str 传入字符串
 * @returns 删除字符串头部 'javascript' 后的字符串
 * 
 * @example
 * removeScriptProtocol('javascript:alert(123)');//=>':alert(123)'
 */
function removeScriptProtocol(str) {
  if (typeof str !== 'string') return '';
  var _regex = /^\s*javascript/i;
  while (_regex.test(str)) {
    str = str.replace(_regex, '');
  }
  return str;
}

/** 对传入字符串进行 rot13 加密
 * @category Encoding
 * @param {String} str 传入字符串
 * @returns {String} 进行 rot13 加密后的字符串
 * @function rot13obfs
 * @example
 * rot13obfs('hello') //=> 'uryy|'
 */
function rot13obfs(str, key) {
  str = String(str);
  key = typeof key === 'number' ? key : 13;
  var n = 126;

  var chars = str.split('');

  for (var i = 0, len = chars.length; i < len; i++) {
    var c = chars[i].charCodeAt(0);

    if (c < n) {
      chars[i] = String.fromCharCode((chars[i].charCodeAt(0) + key) % n);
    }
  }

  return chars.join('');
}

/**
 * 对传入字符串进行 rot13 解密
 * @function rot13defs
 * @category Encoding
 * @param {String} str 传入待加密的字符串
 * @return {String} rot13 解密后的字符串
 * 
 * @example
 * rot13defs('uryy|') //=> hello
 */
function rot13defs(str) {
  var key = 13,
    n = 126;
  str = String(str);

  return rot13obfs(str, n - key);
}

/** 将传入对象中的所有 Date 类型的值转换为格式为 YYYY-MM-DD HH:MM:SS.sss
 * 的字符串
 * 
 * @param {Object} obj 传入对象
 * @returns {String} 传入对象，所有原有 Date 类型的值均已转换为 格式为 YYYY-MM-DD HH:MM:SS.sss 的字符串
 * @category Util
 * @function searchObjDate
 * @example
 * var v =  encodeDates(
 * {
 *   a:new Date('2020-02-02 8:0:12')
 * }) 
 * v //=> {a: '2020-02-02 08:00:12.00'}
 */
function searchObjDate(o) {
  if (isObject(o) || isArray(o)) {
    each(o, function (a, b) {
      if (isObject(a) || isArray(a)) {
        searchObjDate(o[b]);
      } else {
        if (isDate(a)) {
          o[b] = formatDate(a);
        }
      }
    });
  }
}

/** 一个封装了 sessionStorage 的对象 <br>
 * 目前只提供检测是否支持 sessionStorage 的方法
 * @category Bom
 * @exports sessionStorage
 */
var _sessionStorage = {
  /** 检测当前浏览器是否支持 sessionStorage 存储
     * @returns {Boolean} 返回当前浏览器是否支持 sessionStorage 存储
     * @example 
     * // 在支持 sessionStorage 的浏览器中
     * sessionStorage.isSupport() //=> true
     */
  isSupport: function () {
    var supported = true;
    var supportName = '__session_storage_support__';
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

/** 创建 style 标签，填入传入 css 样式字符串
 * @function setCssStyle
 * @category Dom
 * @param {String} css 传入样式字符串
 * @example 
 * setCssStyle(
 *  `body
 *   { 
 *     background :red
 *   }
 * `)
 * // html head 中将插入 
 * // <style>
 * //   body 
 * //   { 
 * //     background:red
 * //   }
 * // </style>
 */
function setCssStyle(css) {
  var style = document.createElement('style');
  style.type = 'text/css';
  try {
    style.appendChild(document.createTextNode(css));
  } catch (e) {
    style.styleSheet.cssText = css;
  }
  var head = document.getElementsByTagName('head')[0];
  var firstScript = document.getElementsByTagName('script')[0];
  if (head) {
    if (head.children.length) {
      head.insertBefore(style, head.children[0]);
    } else {
      head.appendChild(style);
    }
  } else {
    firstScript.parentNode.insertBefore(style, firstScript);
  }
}

/** 将传入字符串转换为 unicode 编码
 * @category Encoding
 * @param {String} str 传入字符串
 * @returns {String} 传入字符串的 unicode 编码
 * @function strToUnicode
 * @example 
 * strToUnicode('hello 世界') // => '\\68\\65\\6c\\6c\\6f\\20\\4e16\\754c'
 */
function strToUnicode(str) {
  if (typeof str !== 'string') {
    logger.log('转换unicode错误', str);
    return str;
  }
  var nstr = '';
  for (var i = 0; i < str.length; i++) {
    nstr += '\\' + str.charCodeAt(i).toString(16);
  }
  return nstr;
}

/** 传入一个函数返回该函数的防抖函数
 * @category Util
 * @param {Function} func 需要进行防抖的函数值行体
 * @param {Number} wait 防抖阈值，毫秒单位
 * @returns 传入函数的防抖函数
 * @function throttle
 * 
 * @example
 * 
 * function log(){
 *   console.log('hello');
 * }
 * 
 * var throttleLog = throttle(log,1000);
 * setInterval(throttleLog,100);
 * // 每个间隔一秒打印一次 hello
 * hello
 * hello // 1s later
 * hello // 1s later
 * ...
 */
function throttle(func, wait, options) {
  var context, args, result;
  var timeout = null;
  var previous = 0;
  if (!options) options = {};
  var later = function () {
    previous = options.leading === false ? 0 : now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function () {
    var nowtime = now();
    if (!previous && options.leading === false) previous = nowtime;
    var remaining = wait - (nowtime - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = nowtime;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
}

/** 将传入对象中所有属性的值通过一个数组返回
 * @category Array
 * @param {*} obj 传入对象
 * @returns {Array} 一个包含了传入对象所有属性值的数组
 * @function values
 * 
 * @example
 * var a={
 *  a:1,
 *  b:2,
 *  c:'hello'
 * }
 * var b = values (a)
 * b //=> [1,2,'hello']
 */
function values(obj) {
  var results = [];
  if (obj == null) {
    return results;
  }
  each(obj, function (value) {
    results[results.length] = value;
  });
  return results;
}

/** 将传入的对象或类数组转换为数组
 * @category Array
 * @param {Array|Object} iterable 传入的对象或类数组
 * @returns {Array} 包含对象或类数组的成员的数组
 * @function toArray
 * @example
 * toArray({a:1,b:2})// =>[1, 2]
 * toArray([1,2]) // =>[1, 2]
 */
function toArray(iterable) {
  if (!iterable) {
    return [];
  }
  if (iterable.toArray) {
    return iterable.toArray();
  }
  if (isArray(iterable) || isArguments(iterable)) {
    return Array.prototype.slice.call(iterable);
  }
  return values(iterable);
}

/** 对传入数组进行去重，返回新的数组
 * @category Array
 * @param {Array} arr 传入数组参数
 * @returns {Array} 去重后的数组
 * @function unique
 * 
 * @example
 * var a = [1,1,2,3,3,4,5]
 * var b = unique(a);
 * b //=> [1,2,3,4,5,]
 */
function unique(arr) {
  var temp,
    n = [],
    o = {};
  for (var i = 0; i < arr.length; i++) {
    temp = arr[i];
    if (!(temp in o)) {
      o[temp] = true;
      n.push(temp);
    }
  }
  return n;
}

var ENC = {
  '+': '-',
  '/': '_',
  '=': '.'
};
var DEC = {
  '-': '+',
  _: '/',
  '.': '='
};

/** 安全的 base64 编码, 将 base64 中的 '+', '/', '=' 分别替换为 '-', '_', '.' <br>
 * 以此避免 base64 编码值被代码扫描工具识别为有害代码
 * @exports urlSafeBase64
 * @category Encoding
 */
var urlSafeBase64 = {
  /**
     * 对 base64 编码字符串进行再编码， 将字符串中的 '+', '/', '=' 分别替换为 '-', '_', '.'
     * @param {String} base64  base64 编码后的字符串
     * @return {String} 执行替换后的 base64 字符串
     */
  encode: function (base64) {
    return base64.replace(/[+/=]/g, function (m) {
      return ENC[m];
    });
  },

  /**
     * 对安全再编码后的 base64 字符串进行解码， 将字符串中的  '-', '_', '.' 分别替换为 '+', '/', '='
     * @param {String} safe 再编码后的 base64 字符串
     * @return {String} 执行解码还原后的 base64 字符串
     */
  decode: function (safe) {
    return safe.replace(/[-_.]/g, function (m) {
      return DEC[m];
    });
  },

  /**
     * 去除 base64 编码后的字符串中的 '=' 和 '.'
     * @param {String} string base64  编码后的字符串
     * @return {String} 去除 base64 编码字符串中的 '=' 和 '.' 后的字符串
     */
  trim: function (string) {
    return string.replace(/[.=]{1,2}$/, '');
  },

  /**
     * 检测传入字符串是否是 base64 编码的字符串
     * @param {String} string 传入字符串
     * @return {Boolean} 是否是 base64 编码的字符串
     */
  isBase64: function (string) {
    return /^[A-Za-z0-9+/]*[=]{0,2}$/.test(string);
  },

  /**
     * 检测传入字符串是否是安全的 base64 编码的字符串
     * @param {String} string 传入字符串
     * @return {Boolean}  是否是安全 base64 编码的字符串
     */
  isUrlSafeBase64: function (string) {
    return /^[A-Za-z0-9_-]*[.]{0,2}$/.test(string);
  }
};

export { ConcurrentStorage, EventEmitter, _URL as URL, UUID, addEvent, addHashEvent, ajax, base64Decode, base64Encode, bindReady, cookie, coverExtend, _decodeURI as decodeURI, _decodeURIComponent as decodeURIComponent, dfmapping, each, encodeDates, extend, extend2Lev, filter, formatDate, formatJsonString, getCookieTopLevelDomain, getDomBySelector, getElementContent, getHostname, getIOSVersion, getQueryParam, getQueryParamsFromUrl, getRandom, getRandomBasic, getScreenOrientation, getUA, getURL, getURLPath, getURLSearchParams, hasAttribute, hasAttributes, hashCode, hashCode53, indexOf, inherit, isArguments, isArray, isBoolean, isDate, isElement, isEmptyObject, isFunction, isHttpUrl, isIOS, isJSONString, isNumber, isObject, isString, isSupportBeaconSend, isSupportCors, isUndefined, jsonp, listenPageState, loadScript, _localStorage as localStorage, logger, map, mediaQueriesSupported, now, removeScriptProtocol, rot13defs, rot13obfs, ry, safeJSONParse, searchObjDate, _sessionStorage as sessionStorage, setCssStyle, strToUnicode, throttle, toArray, trim, unique, urlParse, urlSafeBase64, values, xhr };
