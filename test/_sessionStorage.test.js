import test from 'tape';
import sinon from 'sinon';
import _sessionStorage from '../src/sessionStorage';

test('test _sessionStorage function', (t) => {
  global.sessionStorage = {
    map: {},
    setItem: function (supportName, val) {
      this.map[supportName] = val;
    },
    removeItem: function (supportName, val) {
      if (this.map[supportName] == val) {
        delete this.map[supportName];
      }
    },
  };

  // 不支持 sessionStorage 时
  sinon.stub(global.sessionStorage, 'setItem').value(undefined);
  var supported = _sessionStorage.isSupport();
  t.equal(supported, false, 'call _sessionStorage.isSupport() when does not support SessionStorage, then it returns false');
  sinon.restore();

  // 支持 sessionStorage 时
  supported = _sessionStorage.isSupport();
  t.equal(supported, true, 'call _sessionStorage.isSupport() when support SessionStorage, then it returns true');

  // 支持 sessionStorage, 但 setItem / removeItem 抛出异常时
  ['setItem', 'removeItem'].forEach(item => {
    sinon.stub(global.sessionStorage, item).throws('some exceptions');
    supported = _sessionStorage.isSupport();
    sinon.restore();
    t.equal(supported, false, `call _sessionStorage.isSupport() when support SessionStorage but some exceptions happened to "${item}", then it returns false`);
  });

  delete global.sessionStorage;
  t.end();
});
