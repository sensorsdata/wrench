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

  sinon.stub(global.sessionStorage, 'setItem').value(undefined);

  // 不支持 sessionStorage 时
  var supported = _sessionStorage.isSupport();
  t.equal(
    supported,
    false,
    'When the browser does not support SessionStorage, call _sessionStorage.isSupport() and it returns false'
  );

  sinon.restore();

  // 支持 sessionStorage 时
  supported = _sessionStorage.isSupport();
  t.equal(
    supported,
    true,
    'When the browser support SessionStorage, call _sessionStorage.isSupport() and it returns true'
  );

  // 支持 sessionStorage, 但 setItem 抛出异常时
  sinon.stub(global.sessionStorage, 'setItem').throws('some exceptions');
  supported = _sessionStorage.isSupport();
  t.equal(
    supported,
    false,
    'When the browser support SessionStorage but some exceptions happened to setItem, call _sessionStorage.isSupport() and it returns false'
  );

  sinon.restore();

  // 支持 sessionStorage, 但 removeItem 抛出异常时
  sinon.stub(global.sessionStorage, 'removeItem').throws('some exceptions');
  supported = _sessionStorage.isSupport();
  t.equal(
    supported,
    false,
    'When the browser support SessionStorage but some exceptions happened to removeItem, call _sessionStorage.isSupport() and it returns false'
  );

  sinon.restore();
  delete global.sessionStorage;
  t.end();
});
