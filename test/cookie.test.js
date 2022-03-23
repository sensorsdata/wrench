import test from 'tape';
// import sinon from 'sinon';
import cookie from '../src/cookie';

test('test cookie function', (t) => {
  // 模拟 cookie
  global.document = {};
  var tmp = '';
  Object.defineProperty(global.document, 'cookie', {
    configurable: true,
    get() {
      return tmp;
    },
    set(newVal) {
      tmp = newVal;
      // var arr = newVal.split(';');
      // if (arr[1]) {
      //   var expires = arr[1].split('=')[1];
      //   if (expires < new Date().toGMTString()) {
      //     tmp = null;
      //   } else {
      //     tmp = newVal;
      //   }
      // }
    },
  });

  // cookie.set();
  String.prototype.replaceAll = function (s1, s2) {
    return this.replace(new RegExp(s1, 'gm'), s2);
  };
  // cookie.set('key1', 'value1', 10, true, true, true);
  // console.log(document.cookie, 222);
  // var val = cookie.get('key1');
  // t.equal(val, 'value1', 'cookie.set and cookie.get function as expected');

  // cookie.remove()
  cookie.remove('key1', true);
  // console.log(document.cookie, 333);
  // console.log(document.cookie, 444);
  // // 时间差判断
  // val = cookie.get('key1');
  // t.equal(val, null, 'cookie.remove function as expected');

  // cookie.isSupport()
  t.end();
});
