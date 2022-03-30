import test from 'tape';
import sinon from 'sinon';
import addHashEvent from '../src/addHashEvent';

test('test addHashEvent function', (t) => {
  global.window = {
    history: {
      pushState: function () {},
    },
    // onhashchange: undefined,
    addEventListener: function () {},
  };
  var cb = function () {
    console.log('callback');
  };

  // !target.addEventListener
  sinon.stub(global.window, 'addEventListener').value(undefined);
  // "pushState" in window.history
  addHashEvent(cb);
  t.ok(
    'onpopstate' in global.window && global.window.onpopstate !== undefined,
    'call addHashEvent(callback) when "pushState" in window.history, then "onpopstate" in window && window.onpopstate !== undefined'
  );
  // !("pushState" in window.history)
  sinon.stub(global.window, 'history').value({});
  addHashEvent(cb);
  t.ok(
    'onhashchange' in global.window && global.window.onhashchange !== undefined,
    'call addHashEvent(callback) when "pushState" not in window.history, then "onhashchange" in window && window.onhashchange !== undefined'
  );

  sinon.restore();
  delete global.window;
  t.end();
});
