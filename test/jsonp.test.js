import sinon from 'sinon';
import test from 'tape';
import jsonp from '../src/jsonp';
import logger from '../src/logger';

test('test jsonp function', t => {
  logger.setup(() => { });
  global.document = {
    createElement: function () { },
    getElementsByTagName: function () { }
  };

  global.window = {};

  function MockScript(callbackName) {
    this.windowCallbackName = callbackName;
    this.raiseCallback = function (data) {
      this.windowCallbackName && window[this.windowCallbackName](data);
    };
    this.raiseOnError = function (err) {
      this.onerror && this.onerror.call(null, err);
    };
  }

  const mockHead = {
    appendChild: function () { },
    removeChild: function () { }
  };

  // normal cases
  const testCases = [
    {
      url: 'https://example.com',
      callbackName: 'myDataCallback',
      data: { name: 'Alice' },
      success: sinon.fake(),
      error: sinon.fake(),
      timeout: 3000,
      // for test
      mockReturnValue: 123,
      mockError: 456,
      expectUrl: 'https://example.com?callbackName=myDataCallback&name=Alice'
    },
    {
      url: 'https://music.com?a=1',
      callbackName: 'aoa',
      data: { name: 'bob' },
      success: sinon.fake(),
      error: sinon.fake(),
      timeout: 3000,
      // for test
      mockReturnValue: { a: 1, b: { c: 2 } },
      mockError: new Error('123'),
      expectUrl: 'https://music.com?a=1&callbackName=aoa&name=bob'
    },
    {
      url: 'https://music.com?a=1',
      callbackName: 'aoa',
      success: sinon.fake(),
      error: sinon.fake(),
      timeout: 3000,
      // for test
      mockReturnValue: { a: 1, b: { c: 2 } },
      mockError: new Error('123'),
      expectUrl: 'https://music.com?a=1&callbackName=aoa'
    }
  ];

  testCases.forEach(tCase => {
    sinon.restore();
    var mockScript = new MockScript(tCase.callbackName);
    sinon.stub(document, 'createElement').returns(mockScript);
    sinon.stub(document, 'getElementsByTagName').withArgs('head').returns([mockHead]);
    jsonp(tCase);
    t.deepEqual(mockScript.src, tCase.expectUrl, 'when call jsonp({...}), the src of the script element created should be as expected.');
    mockScript.raiseCallback(tCase.mockReturnValue);
    mockScript.raiseCallback(tCase.mockReturnValue);
    t.ok(tCase.success.calledOnce, 'when jsonp({...}) called successfully, the [success] callback will be called once');
    t.ok(tCase.success.calledWith(tCase.mockReturnValue), 'when jsonp({...}) called successfully, the [success] callback will be called with expected value');
    mockScript.raiseOnError(tCase.mockError);
    mockScript.raiseOnError(tCase.mockError);
    mockScript.raiseCallback(tCase.mockReturnValue);
    t.ok(tCase.error.calledWith(tCase.mockError), 'when jsonp({...}) called failed, the [error] callback will be called with expected value');
  });

  const ret = jsonp({});
  t.false(ret, 'when call jsonp({}), it will return false');

  // test no callback provided
  let tCase = {
    url: 'https://music.com?a=1',
    callbackName: 'aoa',
    data: { name: 'bob' },
    timeout: 3000,
    // for test
    mockReturnValue: { a: 1, b: { c: 2 } },
    mockError: new Error('123'),
    expectUrl: 'https://music.com?a=1&callbackName=aoa&name=bob'
  };

  sinon.restore();
  let mockScript = new MockScript(tCase.callbackName);
  sinon.stub(document, 'createElement').returns(mockScript);
  sinon.stub(document, 'getElementsByTagName').withArgs('head').returns([mockHead]);
  jsonp(tCase);
  mockScript.raiseCallback(tCase.mockReturnValue);
  mockScript.raiseOnError(tCase.mockError);
  t.ok(typeof tCase.success === 'function', 'when argument passed to jsonp has no [success] callback, then jsonp will add one, no error.');
  t.ok(typeof tCase.error === 'function', 'when argument passed to jsonp has no [error] callback, then jsonp will add one, no error.');

  // test timeout
  tCase = {
    url: 'https://music.com?a=1',
    callbackName: 'aoa',
    success: sinon.fake(),
    error: sinon.fake(),
    timeout: 50,
    // for test
    mockReturnValue: { a: 1, b: { c: 2 } },
    mockError: new Error('123'),
    expectUrl: 'https://music.com?a=1&callbackName=aoa'
  };
  sinon.restore();
  mockScript = new MockScript(tCase.callbackName);
  sinon.stub(document, 'createElement').returns(mockScript);
  sinon.stub(document, 'getElementsByTagName').withArgs('head').returns([mockHead]);
  jsonp(tCase);
  setTimeout(() => {
    t.ok(tCase.error.calledWith('timeout'), 'when jsonp({...}) called timeout, the [error] callback will be called with "timeout"');
    // cover rest lines
    mockScript.raiseCallback(tCase.mockReturnValue);
  }, 50);

  setTimeout(() => {
    t.end();
  }, 100);
});