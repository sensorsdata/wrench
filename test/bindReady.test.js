import test from 'tape';
import sinon from 'sinon';
import bindReady from '../src/bindReady';

test('test bindReady function', (t) => {
  global.window = {
    document: {
      readyState: undefined,
      documentElement: function () {},
      addEventListener: function () {},
      removeEventListener: function () {},
      attachEvent: function () {},
      detachEvent: function () {},
      doScroll: function () {},
    },
    frameElement: undefined,
    addEventListener: function () {},
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

  // sinon.stub(global.window.document, 'doScroll').value(undefined);
  // sinon.stub(global.window.document, 'addEventListener').value(sinon.fake());
  // sinon.stub(global.window, 'addEventListener').value(sinon.fake());
  // bindReady(func, window);
  // sinon.restore();
  t.end();
});
