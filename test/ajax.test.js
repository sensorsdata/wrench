import test from 'tape';
import sinon from 'sinon';
import ajax from '../src/ajax';

test('test ajax function', (t) => {
  var mockPara = function () {
    return {
      url: '/example',
      timeout: 15000,
      credentials: true,
      cors: true,
      type: 'POST',
      contentType: 'application/json',
      success: function (data) {
        console.log(data);
        return data;
      },
      error: function (error) {
        console.log(error);
        return 'error';
      },
      header: { ExtraHeader: 'TestValue' },
      data: { name: 'Alice', age: 18 }
    };
  };
  var requestObj;
  global.window = { XMLHttpRequest: undefined };
  global.XMLHttpRequest = undefined;
  global.XDomainRequest = sinon.useFakeXMLHttpRequest();
  global.XDomainRequest.onCreate = function (xhr) {
    xhr.withCredentials = false;
    requestObj = xhr;
  };

  t.test('test ajax(para) with different property in para', (t) => {
    // throw some exception
    var para = new mockPara();
    var stub = sinon
      .stub(Object.prototype, 'toString')
      .throws('some exceptions');
    ajax(para);
    t.deepEqual(
      requestObj.requestHeaders,
      {},
      'call ajax(para) when some exception happens to isObject() functiion then g.requestHeaders is {}'
    );
    stub.restore();

    // !para.timeout
    para = new mockPara();
    para.timeout = undefined;
    ajax(para);
    t.equal(
      para.timeout,
      20000,
      'call ajax(para) when !para.timeout, then para.timeout turns to 20000'
    );

    // !xhr(para.cors)
    // 当 window.XMLHttpRequest == 'undefined' && typeof XDomainRequest == 'undefined', xhr(para.cors) == null
    stub = sinon.stub(global, 'XDomainRequest');
    stub.value(undefined);
    para = new mockPara();
    var val = ajax(para);
    t.equal(
      val,
      false,
      'call ajax(para) when !xhr(para.cors), then it returns false'
    );
    stub.restore();

    // test ajax(para) with different property in para
    // 当 !para.type
    para = new mockPara();
    stub = sinon.stub(para, 'type').value(undefined);
    ajax(para);
    t.equal(
      para.type,
      'POST',
      'call ajax(para) when !para.type && para.data, then para.type turns to "POST"'
    );
    stub.restore();

    // 当 para.contentType !== application/json
    para = new mockPara();
    stub = sinon.stub(para, 'contentType').value(undefined);
    ajax(para);
    t.equal(
      requestObj.requestHeaders['Content-type'],
      'application/x-www-form-urlencoded;charset=utf-8',
      'call ajax(para) when para.contentType !== application/json, then g.requestHeaders["Content-type"] == "application/x-www-form-urlencoded;charset=utf-8"'
    );
    stub.restore();

    // !para.cors
    // xhr(false) 不走 new XDomainRequest()
    para = new mockPara();
    stub = sinon.stub(para, 'cors').value(false);
    var stub2 = sinon.stub(global.window, 'XMLHttpRequest');
    stub2.value(function () {});
    sinon.stub(global, 'XMLHttpRequest').value(sinon.useFakeXMLHttpRequest());
    ajax(para);
    t.equal(
      requestObj.requestHeaders['X-Requested-With'],
      'XMLHttpRequest',
      'call ajax(para) when para.cors == false, then g.requestHeaders["X-Requested-With"] == "XMLHttpRequest"'
    );
    stub.restore();
    stub2.restore();
    global.XMLHttpRequest.restore();
    t.end();
  });

  t.test('test g.onload & g.onerror & g.onreadystatechange', (t) => {
    global.XDomainRequest.onCreate = function (xhr) {
      xhr.withCredentials = false;
      xhr.responseText = undefined;
      requestObj = xhr;
    };
    var para;
    ['onload', 'onerror'].forEach((outer) => {
      para = new mockPara();
      ajax(para);
      requestObj[outer]();
      ['onload', 'onerror', 'onreadystatechange'].forEach((inner) => {
        t.equal(
          requestObj[inner],
          null,
          `call g.${outer}, then requestObj.${inner} turns to null`
        );
      });
    });

    // getJson 抛出异常时 onload
    sinon.stub(JSON, 'parse').throws('some exceptions');
    para = new mockPara();
    ajax(para);
    requestObj.readyState = 4;
    requestObj.status = 200;
    requestObj.responseText = 'test';
    requestObj.onload();
    ['onload', 'onreadystatechange'].forEach((item) => {
      t.equal(
        requestObj[item],
        null,
        `call g.onload when some exceptions happens to JSON.parse then requestObj.${item} turns to null`
      );
    });
    sinon.restore();

    // test g.onreadystatechange
    para = new mockPara();
    ajax(para);
    requestObj.readyState = 4;
    requestObj.status = 200;
    requestObj.responseText = 'test';
    requestObj.onreadystatechange();
    ['onload', 'onreadystatechange'].forEach((item) => {
      t.equal(
        requestObj[item],
        null,
        `call g.onreadystatechange when g.readyState == 4 && g.status == 200, then requestObj.${item} turns to null`
      );
    });
    delete global.window;
    delete global.XMLHttpRequest;
    delete global.XDomainRequest;
    t.end();
  });
  t.end();
});
