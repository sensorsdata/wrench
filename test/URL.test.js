import * as urlParseModule from '../src/urlParse';
import * as getURLSearchParamsModule from '../src/getURLSearchParams';
import logger from '../src/logger';

import _URL from '../src/URL';
import sinon from 'sinon';
import test from 'tape';

test('test URL function', t => {
  global.window = {
    URL: function () { }
  };
  const testUrl = 'http://www.domain.com:8080/path/index.html?project=testproject&query1=test&silly=willy&field[0]=zero&field[2]=two#test=hash&chucky=cheese';
  const expectedURLResult = {
    host: 'www.domain.com:8080',
    port: '8080',
    search: '?project=testproject&query1=test&silly=willy&field[0]=zero&field[2]=two',
    hostname: 'www.domain.com',
    protocol: 'http:',
    origin: 'http://www.domain.com:8080'
  };

  const expectedSearchResult = {
    'project': 'testproject',
    'query1': 'test',
    'silly': 'willy',
    'field[0]': 'zero',
    'field[2]': 'two'
  };

  let spyUrlParse = sinon.spy(urlParseModule, 'default');
  let spyGetURLSearchParams = sinon.spy(getURLSearchParamsModule, 'default');

  function restore() {
    spyUrlParse.resetHistory();
    spyGetURLSearchParams.resetHistory();
    sinon.restore();
  }

  // global URL not exist
  sinon.stub(window, 'URL').value(undefined);
  sinon.stub(global, 'URL').value(undefined);
  _URL(testUrl);
  t.ok(spyUrlParse.calledOnce, 'when global URL function not existed, then urlParse function called.');
  restore();

  // global URL error
  spyUrlParse = sinon.spy(urlParseModule, 'default');
  sinon.stub(global, 'URL').value(function () { throw new Error('mock error'); });
  _URL(testUrl);
  t.ok(spyUrlParse.calledOnce, 'when global URL function error, then urlParse function called.');
  restore();

  // global URL ok
  sinon.stub(window, 'URL').value(function () { });
  let ret = _URL(testUrl);
  for (let it in expectedURLResult) {
    t.equal(ret[it], expectedURLResult[it], `when global URL ok, then URL parse result [${it}] is as expected`);
  }
  t.ok(spyGetURLSearchParams.notCalled, 'when searchParams parsed, then getURLSearchParams will not be called');
  restore();

  spyGetURLSearchParams = sinon.spy(getURLSearchParamsModule, 'default');
  // test URL function doesn't return searchParam
  sinon.stub(global, 'URL').returns({
    search: expectedURLResult.search
  });
  ret = _URL(testUrl);
  t.ok(spyGetURLSearchParams.calledOnce, 'when searchParams parsed failed, then getURLSearchParams will be called once');
  t.ok(ret.searchParams, 'when searchParams parsed failed, then result["searchParams"] will not be null');
  t.true(typeof ret.searchParams.get === 'function', 'when searchParams parsed failed, then result["searchParams"]["get"] will be function');
  for (let it in expectedSearchResult) {
    t.equal(ret.searchParams.get(it), expectedSearchResult[it], `when searchParams parsed failed, then call result["searchParams"]["get"]("${it}") return as expected`);
  }
  restore();

  // global URL not ok
  sinon.stub(window, 'URL').value(undefined);
  sinon.stub(global, 'URL').value(undefined);
  let spyString = sinon.spy(global, 'String');
  let spyLogger = sinon.spy(logger, 'log');
  // url not string
  _URL(124);
  t.ok(spyString.calledOnce, 'when call URL(124), then String called');
  t.ok(spyLogger.calledWith('Invalid URL'), 'when call URL(124), then it will log "Invalid URL"');

  ret = _URL(testUrl);
  for (let it in expectedURLResult) {
    t.equal(expectedURLResult[it], ret[it], `when global URL NOT ok, then URL parse result [${it}] is as expected`);
  }
  t.true(typeof ret.searchParams.get === 'function', 'when global URL NOT ok, then result["searchParams"]["get"] will be function');
  for (let it in expectedSearchResult) {
    t.equal(ret.searchParams.get(it), expectedSearchResult[it], `when global URL NOT ok , then call result["searchParams"]["get"]("${it}") return as expected`);
  }
  t.end();
});