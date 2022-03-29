import test from 'tape';
import sinon from 'sinon';
import addEvent from '../src/addEvent';

test('test addEvent function', (t) => {
  global.window = {
    addEventListener: function () {},
    hashchange: function () {},
    onhashchange: undefined,
  };
  var target = window;
  var eventName = 'hashchange';
  var eventHandler = sinon.spy();

  // element && element.addEventListener
  var spy = sinon.spy(global.window, 'addEventListener');
  addEvent(target, eventName, eventHandler);
  t.ok(spy.calledOnce, 'spy.calledOnce');
  spy.restore();

  // !element.addEventListener
  sinon.stub(global.window, 'addEventListener').value(undefined);
  spy = sinon.spy();
  addEvent(target, eventName, spy);
  t.ok(
    'onhashchange' in target && target.onhashchange !== undefined,
    'call addEvent(target, eventName, eventHandler) when !element.addEventListener, then "onhashchange" in element && element.onhashchange !== undefined'
  );

  // test element[ontype]
  const eventInfo = {
    type: 'hashchange',
    target: '',
    srcElement: { id: 'btnTrack' },
  };
  target.onhashchange(eventInfo);
  t.ok(
    spy.calledOnce,
    'after call addEvent(target, hashchange, spy) when !element.addEventListener, call target.onhashchange, then spy get called exactly once'
  );
  sinon.restore();

  // typeof old_handlers === 'function'
  sinon
    .stub(global.window, 'onhashchange')
    .value(function () {})
    .withArgs(eventInfo)
    .returns(false);
  target.onhashchange(eventInfo);
  t.end();
});
