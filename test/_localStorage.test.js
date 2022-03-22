import test from 'tape';
import sinon from 'sinon';
import _localStorage from '../src/localStorage';

test('test _localStorage function', (t) => {
  // 模拟 window.localStorage
  global.window = {
    localStorage: {
      getItem: function () {},
      setItem: function () {},
      removeItem: function () {},
    },
  };

  // _localStorage.get
  var k = 'key1';
  var v = 'value1';
  sinon.stub(global.window.localStorage, 'getItem').withArgs(k).returns(v);
  var val = _localStorage.get(k);
  t.equal(val, v, '_localStorage.get performs as expected');
  sinon.restore();

  // _localStorage.parse
  var k2 = 'key2';
  var v2 = JSON.stringify({ a: 1 });

  // 未抛出异常
  // JSON.parse(_localStorage.get(key))
  sinon.stub(window.localStorage, 'getItem').withArgs(k2).returns(v2);
  val = _localStorage.parse(k2);
  t.deepEqual(val, { a: 1 }, '_localStorage.parse performs as expected');
  // !JSON.parse(_localStorage.get(key))
  sinon.stub(JSON, 'parse').withArgs(v2).returns(undefined);
  val = _localStorage.parse(k2);
  t.deepEqual(
    val,
    null,
    '_localStorage.parse performs as expected when JSON.parse(_localStorage.get(key) does not exist'
  );
  sinon.restore();

  // 抛出异常
  sinon.stub(JSON, 'parse').throws();
  val = _localStorage.parse(k2);
  t.equal(
    val,
    undefined,
    '_localStorage.parse performs as expected when some exceptions happened'
  );
  sinon.restore();

  // _localStorage.set
  sinon.stub(global.window.localStorage, 'setItem').callsFake(sinon.fake());
  sinon.stub(global.window.localStorage, 'getItem').withArgs(k).returns(v);
  _localStorage.set(k, v);
  val = _localStorage.get(k);
  t.equal(val, v, '_localStorage.set performs as expected');
  sinon.restore();

  // _localStorage.remove

  // _localStorage.isSupport
  var k3 = '__local_store_support__';
  var v3 = 'testIsSupportStorage';
  // 未抛出异常
  // _localStorage.get(supportName) == val
  sinon.stub(global.window.localStorage, 'setItem').callsFake(sinon.fake());
  sinon.stub(global.window.localStorage, 'removeItem').callsFake(sinon.fake());
  sinon.stub(global.window.localStorage, 'getItem').withArgs(k3).returns(v3);
  val = _localStorage.isSupport();
  t.equal(val, true, '_localStorage.isSupport performs as expected');
  sinon.restore();

  // _localStorage.get(supportName) !== val
  sinon.stub(global.window.localStorage, 'setItem').callsFake(sinon.fake());
  sinon.stub(global.window.localStorage, 'removeItem').callsFake(sinon.fake());
  sinon.stub(window.localStorage, 'getItem').withArgs(k3).returns(undefined);
  val = _localStorage.isSupport();
  t.equal(val, false, '_localStorage.isSupport performs as expected');
  sinon.restore();

  // 抛出异常
  sinon.stub(global.window.localStorage, 'setItem').throws('some exception');
  val = _localStorage.isSupport();
  t.equal(
    val,
    false,
    '_localStorage.isSupport performs as expected when exception happens'
  );
  sinon.restore();

  t.end();
});
