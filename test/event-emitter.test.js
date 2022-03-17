import sinon from 'sinon';
import test from 'tape';
import EventEmitter from '../src/Event-Emitter';

test('test EventEmitter class', t => {
  test('test EventEmitter.prototype.on', t => {
    const e = new EventEmitter();
    const fakeCallback = sinon.fake();
    t.ok(e.on('TestEvent', fakeCallback) instanceof EventEmitter, 'when e.on("TestEvent",fn), then it returns EventEmitter instance');
    t.ok(e.on('TestEvent', { listener: fakeCallback }) instanceof EventEmitter, 'when e.on("TestEvent",{listener:fn}), then it returns EventEmitter instance');
    t.ok(e.on('TestEvent') === false, 'when e.on("TestEvent"), then it returns false');
    t.ok(e.on(null, fakeCallback) === false, 'when e.on(null,fn), then it returns false');
    t.throws(() => e.on('TestEvent', 123), /listener must be a function/, 'when call on("TestEvent",123), it throws error');

    e.emit('TestEvent', 1234);
    t.equal(fakeCallback.callCount, 2, 'when e.emit("TestEvent",1234), then fakeCallback called twice');
    t.equal(fakeCallback.firstCall.args[0], 1234, 'when e.emit("TestEvent",1234), then fakeCallback first call will be called with 1234');
    t.equal(fakeCallback.secondCall.args[0], 1234, 'when e.emit("TestEvent",1234), then fakeCallback second call will be called with 1234');

    fakeCallback.resetHistory();
    e.emit('TestEvent', '1234');
    t.equal(fakeCallback.callCount, 2, 'when e.emit("TestEvent","1234"), then fakeCallback called twice');
    t.equal(fakeCallback.firstCall.args[0], '1234', 'when e.emit("TestEvent","1234"), then fakeCallback first call will be called with "1234"');
    t.equal(fakeCallback.secondCall.args[0], '1234', 'when e.emit("TestEvent","1234"), then fakeCallback second call will be called with "1234"');

    fakeCallback.resetHistory();
    e.emit('TestEvent', { a: 1, b: { c: 1 } });
    t.equal(fakeCallback.callCount, 2, 'when e.emit("TestEvent",{ a: 1, b: { c: 1 } }), then fakeCallback called twice');
    t.deepEqual(fakeCallback.firstCall.args[0], { a: 1, b: { c: 1 } }, 'when e.emit("TestEvent",{ a: 1, b: { c: 1 } }), then fakeCallback first call will be called with { a: 1, b: { c: 1 } }');
    t.deepEqual(fakeCallback.secondCall.args[0], { a: 1, b: { c: 1 } }, 'when e.emit("TestEvent",{ a: 1, b: { c: 1 } }), then fakeCallback second call will be called with { a: 1, b: { c: 1 } }');

    t.end();
  });

  test('test EventEmitter.prototype.prepend', t => {
    const e = new EventEmitter();
    const sequence = [];
    const fakeCallback = sinon.fake(() => sequence.push('a'));
    t.ok(e.prepend('TestEvent', fakeCallback) instanceof EventEmitter, 'when e.prepend("TestEvent",fn), then it returns EventEmitter instance');
    t.ok(e.prepend('TestEvent', { listener: fakeCallback }) instanceof EventEmitter, 'when e.prepend("TestEvent",{listener:fn}), then it returns EventEmitter instance');
    t.ok(e.prepend('TestEvent') === false, 'when e.prepend("TestEvent"), then it returns false');
    t.ok(e.prepend(null, fakeCallback) === false, 'when e.prepend(null,fn), then it returns false');
    t.throws(() => e.prepend('TestEvent', 123), /listener must be a function/, 'when call e.prepend("TestEvent",123), it throws error');

    e.emit('TestEvent', 1234);
    t.equal(fakeCallback.callCount, 2, 'when e.emit("TestEvent",1234), then fakeCallback called twice');
    t.equal(fakeCallback.firstCall.args[0], 1234, 'when e.emit("TestEvent",1234), then fakeCallback first call will be called with 1234');
    t.equal(fakeCallback.secondCall.args[0], 1234, 'when e.emit("TestEvent",1234), then fakeCallback second call will be called with 1234');

    const fakeCallbackPrepend = sinon.fake(() => sequence.push('b'));
    e.prepend('TestEvent', fakeCallbackPrepend);
    e.emit('TestEvent', 1234);
    t.deepEqual(sequence, ['a', 'a', 'b', 'a', 'a'], 'when e.emit("TestEvent",1234), then the second fakeCallbackPrepend will be called first');
    t.end();
  });

  test('test EventEmitter.prototype.prependOnce', t => {
    const e = new EventEmitter();
    const fakeCallback = sinon.fake();
    t.ok(e.prependOnce('TestEvent', fakeCallback) instanceof EventEmitter, 'when e.prependOnce("TestEvent",fn), then it returns EventEmitter instance');
    e.emit('TestEvent', 1234);
    t.equal(fakeCallback.callCount, 1, 'when e.emit("TestEvent",1234), then fakeCallback called once');
    e.emit('TestEvent', 1234);
    t.equal(fakeCallback.callCount, 1, 'when e.emit("TestEvent",1234) again, then fakeCallback still called once');
    t.end();
  });

  test('test EventEmitter.prototype.once', t => {
    const e = new EventEmitter();
    const fakeCallback = sinon.fake();
    t.ok(e.once('TestEvent', fakeCallback) instanceof EventEmitter, 'when e.on("TestEvent",fn), then it returns EventEmitter instance');
    e.emit('TestEvent', 1234);
    t.equal(fakeCallback.callCount, 1, 'when e.emit("TestEvent",1234), then fakeCallback called once');
    e.emit('TestEvent', 1234);
    t.equal(fakeCallback.callCount, 1, 'when e.emit("TestEvent",1234) again, then fakeCallback still called once');
    t.end();
  });

  test('test EventEmitter.prototype.off', t => {
    const e = new EventEmitter();
    const fakeCallback = sinon.fake();
    t.ok(e.on('TestEvent', fakeCallback) instanceof EventEmitter, 'when e.on("TestEvent",fn), then it returns EventEmitter instance');
    e.emit('TestEvent', 1234);
    t.equal(fakeCallback.callCount, 1, 'when e.emit("TestEvent",1234), then fakeCallback called once');
    e.emit('TestEvent', 1234);
    t.equal(fakeCallback.callCount, 2, 'when e.emit("TestEvent",1234) again, then fakeCallback called twice');
    e.off('TestEvent', fakeCallback);
    e.emit('TestEvent', 1234);
    t.equal(fakeCallback.callCount, 2, 'when  e.off("TestEvent", fakeCallback) and e.emit("TestEvent",1234) one more time, then fakeCallback still be called twice');

    fakeCallback.resetHistory();
    e.on('TestEvent', fakeCallback);
    e.emit('TestEvent', 1234);
    t.equal(fakeCallback.callCount, 1, 'when e.emit("TestEvent",1234), then fakeCallback called once');
    e.off('TestEvent', 0);
    e.emit('TestEvent', 1234);
    t.equal(fakeCallback.callCount, 1, 'when e.off("TestEvent", 0) and e.emit("TestEvent",1234), then fakeCallback still be called once');

    const ret = e.off();
    t.false(ret, 'when call e.off(), then it returns false');
    t.end();
  });

  test('test EventEmitter.prototype.emit', t => {
    const e = new EventEmitter();
    const fakeCallback = sinon.fake();
    e.on('TestEvent', fakeCallback);
    e.emit('TestEvent', 1234);
    t.equal(fakeCallback.callCount, 1, 'when e.emit("TestEvent",1234), then fakeCallback called once');
    const ret = e.emit('TestEvent1', 1234);
    t.false(ret, 'when emit a Event that dont have any listener, then it returns false');
    t.end();
  });

  test('test EventEmitter.prototype.removeAllListeners', t => {
    const e = new EventEmitter();
    e.removeAllListeners();
    t.deepEqual(e._events, {}, 'when call e.removeAllListeners(), then e._events will be {}');
    e.on('TestEvent', () => { });
    e.removeAllListeners('TestEvent');
    t.deepEqual(e._events, { TestEvent: [] }, 'when call e.removeAllListeners("TestEvent"), then e._events will be {TestEvent:[]}');
    t.end();
  });

  test('test EventEmitter.prototype.listeners', t => {
    const e = new EventEmitter();
    let listenerLst = e.listeners();
    t.deepEqual(listenerLst, {}, 'when call e.listeners(), then it returns {}');
    e.on('TestEvent', () => { });
    listenerLst = e.listeners('TestEvent');
    t.true(listenerLst instanceof Array, 'when call e.listeners() after e.on("TestEvent", () => { }), then return type should be Array');
    t.equal(typeof listenerLst[0].listener, 'function', 'when call e.listeners() after e.on("TestEvent", () => { }), then return value should have listener and its type is function');
    t.end();
  });

  t.end();
});