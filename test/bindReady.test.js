import test from 'tape';
import sinon from 'sinon';
import bindReady from '../src/bindReady';

test('test bindReady function', (t) => {
  global.window = {
    document: {
      readyState: undefined,
      documentElement: {
        doScroll: function () {}
      },
      addEventListener: function () {},
      removeEventListener: function () {},
      attachEvent: function () {},
      detachEvent: function () {}
    },
    frameElement: undefined,
    addEventListener: function () {},
    attachEvent: function () {}
  };

  var helper;
  var func = function (value) {
    console.log(value);
    helper = value;
  };

  sinon.stub(global.window.document, 'readyState').value('complete');
  bindReady(func, window);
  t.equal(
    helper,
    'lazy',
    'call bindReady(func, window) when doc.readyState == "complete", then the callback value will be "lazy"'
  );
  sinon.restore();

  // !window.document.addEventListener
  sinon.stub(global.window.document, 'addEventListener').value(undefined);
  var spy = sinon.spy(global.window.document, 'attachEvent');
  var spy2 = sinon.spy(global.window, 'attachEvent');
  bindReady(func, window);
  t.equal(
    spy.callCount,
    2,
    'call bindReady(func, window) when !window.document.addEventListener, then global.window.document.attachEvent get called twice'
  );
  t.equal(
    spy2.callCount,
    1,
    'call bindReady(func, window) when !window.document.addEventListener, then global.window.attachEvent get called once'
  );
  sinon.restore();
  delete global.window;
  t.end();
});
