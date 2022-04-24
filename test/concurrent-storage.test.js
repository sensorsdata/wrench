import test from 'tape';
import ConcurrentStorage from '../src/Concurrent-Storage';

// ConcurrentStorage 因功能特殊性，场景为多 Tab 竞争，但测试框架不能模拟该场景
// 因此该单侧仅运行了目标函数

var createContext = function () {
  global.window = {
    localStorage: {
      getItem: function () {},
      setItem: function () {},
      removeItem: function () {}
    }
  };
};
test('test ConcurrentStorage constructor', (t) => {
  let a = new ConcurrentStorage();
  let f = a instanceof ConcurrentStorage;
  t.equal(f, true, 'ConcurrentStorage constructor as expected');
  t.end();
});

test('test ConcurrentStorage function get', (t) => {
  createContext();
  console.log(global.window);
  let storage = new ConcurrentStorage();
  storage.get('key', 1000, 100, function (data) {
    t.equal(null, data, 'ConcurrentStorage get as expected');
    t.end();
  });
});

test('test ConcurrentStorage function set', (t) => {
  createContext();
  console.log(global.window);
  let storage = new ConcurrentStorage();
  storage.set('key', 'val', 1000, 100, function (data) {
    t.equal(JSON.stringify({ status: 'fail', reason: 'This key is locked' }), JSON.stringify(data), 'ConcurrentStorage set as expected');
    t.end();
  });
});