import test from 'tape';
import cookie from '../src/cookie';

test('test cookie function', (t) => {
  // 模拟 cookie
  global.document = {};
  var tmp = '';
  var val;

  Object.defineProperty(global.document, 'cookie', {
    configurable: true,
    get() {
      return tmp;
    },
    set(newVal) {
      tmp = newVal;
    },
  });

  // cookie.set()
  String.prototype.replaceAll = function (s1, s2) {
    return this.replace(new RegExp(s1, 'gm'), s2);
  };
  [10, '10s'].forEach((item) => {
    cookie.set('key1', 'value1', item, true, true, true, 'www.test.com');
    // console.log(document.cookie);
    val = cookie.get('key1');
    t.equal(val, 'value1', 'cookie.set performs as expected');
  });

  // 当 !value 时的 cookie.set()
  document.cookie = '';
  cookie.set('key1', undefined, 10, true, true, true, 'www.test.com');
  val = cookie.get('key1');
  t.equal(val, null, 'cookie.set performs as expected when value is undefined');

  // isString(cookie_samesite) && cookie_samesite !== ''
  document.cookie = '';
  cookie.set('key1', 'value1', 10, true, 'Lax', true, 'www.test.com');
  val = cookie.get('key1');
  t.equal(val, 'value1', 'cookie.set performs as expected when cookie_samesite = "Lax"');

  // cookie.get()
  const getCases = [
    // document.cookie = ''
    {
      name: 'key1',
      str: '',
      expect: null,
    },
    // document.cookie.split(';')[i] 中有 ' '
    {
      name: 'expires',
      str: 'key2=value2; expires=Sat, 02 Apr 2022 10:46:06 GMT; path=/; secure',
      expect: 'Sat, 02 Apr 2022 10:46:06 GMT',
    },
  ];
  getCases.forEach((getCase) => {
    document.cookie = getCase.str;
    val = cookie.get(getCase.name);
    t.equal(val, getCase.expect, 'cookie.get function performs as expected');
  });

  // cookie.isSupport()
  global.navigator = { cookieEnabled: true };
  val = cookie.isSupport('test', 'testValue');
  t.equal(val, true, 'cookie.isSupport performs as expected');

  delete global.document;
  delete global.navigator;
  t.end();
});
