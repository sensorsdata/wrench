import test from 'tape';
import sinon from 'sinon';
import addEvent from '../src/addEvent';

test('test addEvent function', (t) => {
  global.window = {
    addEventListener: function () {},
    hashchange: function () {},
    onhashchange: undefined,
    click: function () {},
    onclick: undefined,
  };
  var target = window;
  var eventName = 'hashchange';
  var eventHandler = sinon.spy();
  const eventInfo = {
    type: 'hashchange',
    target: '',
    srcElement: { id: 'btnTrack' },
  };

  // element && element.addEventListener
  var spy = sinon.spy(global.window, 'addEventListener');
  addEvent(target, eventName, eventHandler);
  t.ok(spy.calledOnce, 'spy.calledOnce');
  spy.restore();

  // !element.addEventListener
  // 走 makeHandler
  sinon.stub(global.window, 'addEventListener').value(undefined);
  spy = sinon.spy();
  addEvent(target, eventName, spy);
  t.ok(
    'onhashchange' in target && target.onhashchange !== undefined,
    'call addEvent(target, eventName, eventHandler) when !element.addEventListener, then "onhashchange" in element && element.onhashchange !== undefined'
  );
  // test element[ontype]
  target.onhashchange(eventInfo);
  t.ok(
    spy.calledOnce,
    'after call addEvent(target, hashchange, spy) when !element.addEventListener, call target.onhashchange(event), then spy get called exactly once'
  );
  // !event
  val = target.onhashchange();
  t.equal(
    val,
    undefined,
    'after call addEvent(target, hashchange, spy) when !element.addEventListener, call target.onhashchange() without event, then it returns undefined'
  );
  spy.resetHistory();
  // sinon.restore();

  // 当 typeof old_handlers === 'function'
  sinon.stub(global.window, 'onclick').value(function () {
    return false;
  });
  var stub = sinon.stub();
  addEvent(target, 'click', stub, undefined);
  eventInfo.type = 'click';
  stub.returns(false);
  var val = target.onclick(eventInfo);
  t.equal(
    val,
    false,
    'after call addEvent(target, onclick, spy) when typeof old_handlers === "function", call target.onclick, then it returns to false'
  );
  sinon.restore();
  delete global.window;
  t.end();
});
