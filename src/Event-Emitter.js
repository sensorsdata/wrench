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

export default EventEmitter;
