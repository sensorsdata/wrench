import test from 'tape';
import sinon from 'sinon';
import mediaQueriesSupported from '../src/mediaQueriesSupported';

test('test mediaQueriesSupported function', (t) => {
  global.window = {
    matchMedia: function () {
      return true;
    },
  };

  sinon.stub(global.window, 'matchMedia').value(undefined);
  var val = mediaQueriesSupported();
  t.equal(val, false, 'call mediaQueriesSupported() when the browser does not support media query, then it returns false');
  sinon.restore();

  sinon.stub(global.window, 'matchMedia');
  val = mediaQueriesSupported();
  t.equal(val, true, 'call mediaQueriesSupported() when the browser does not support media query, then it returns false');
  sinon.restore();

  t.end();
});
