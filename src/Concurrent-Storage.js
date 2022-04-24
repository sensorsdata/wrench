import now from './now';
import _localStorage from './localStorage';
import getRandom from './getRandom';
import safeJSONParse from './safeJSONParse';

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

export default ConcurrentStorage;