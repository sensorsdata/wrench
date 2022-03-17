import * as addEventModule from '../src/addEvent';
import sinon from 'sinon';
import test from 'tape';
import listenPageState from '../src/listenPageState';

test('test listenPageState function ', t => {

  const mockCallbacks = [];
  const mockEmitter = {
    emit: function (t, e) {
      mockCallbacks.filter(m => m.t === t && m.e === e).forEach(m => m.c());
    },
    on: function (t, e, c) {
      mockCallbacks.push({ t, e, c });
    },
    clear: function () {
      mockCallbacks.length = 0;
    }
  };

  let testListener;
  let mockAddEvent;

  function prepareTestContext() {
    global.document = {};
    global.window = {};

    mockAddEvent = sinon.fake(function (target, eventName, callback) {
      mockEmitter.on(target, eventName, callback);
    });
    sinon.stub(addEventModule, 'default').value(mockAddEvent);
    testListener = {
      visible: sinon.fake.returns(),
      hidden: sinon.fake.returns(),
    };
  }

  // test document.hidden
  const testCases = [
    ['hidden', 'visibilitychange'],
    ['mozHidden', 'mozvisibilitychange'],
    ['msHidden', 'msvisibilitychange'],
    ['webkitHidden', 'webkitvisibilitychange']
  ];

  testCases.forEach(tCase => {
    prepareTestContext();
    sinon.stub(global, 'document').value({ [tCase[0]]: true });
    listenPageState(testListener);
    t.equal(mockAddEvent.getCall(0).args[1], tCase[1], `when call listenPageState and document.${tCase[0]} exist, then addEvent will be called as addEvent(document,"${tCase[1]}", ... )`);
    mockEmitter.emit(document, tCase[1]);
    t.ok(testListener.hidden.calledOnce, `when ${tCase[1]} triggered and document.${tCase[0]} is true, then page [hidden] callback triggers.`);
    document[tCase[0]] = false;
    mockEmitter.emit(document, tCase[1]);
    t.ok(testListener.visible.calledOnce, `when ${tCase[1]} triggered and document.${tCase[0]} is false, then page [visible] callback triggers.`);
    sinon.restore();
  });

  // use window focus and blur
  prepareTestContext();
  listenPageState(testListener);
  t.equal(mockAddEvent.getCall(0).args[1], 'focus', 'when call listenPageState and document[(moz|ms|webKid)\'hidden\'] NOT exist, then addEvent will be called as addEvent(window,"focus",...)');
  t.equal(mockAddEvent.getCall(1).args[1], 'blur', 'when call listenPageState and document[(moz|ms|webKid)\'hidden\'] NOT exist, then addEvent will be called as addEvent(window,"blur",...)');

  mockEmitter.emit(window, 'focus');
  t.ok(testListener.visible.calledOnce, 'when focus triggered, then page [visible] callback triggers.');
  mockEmitter.emit(window, 'blur');
  t.ok(testListener.visible.calledOnce, 'when blur triggered, then page [hidden] callback triggers.');
  sinon.restore();

  t.end();
});
