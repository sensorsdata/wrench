import Sinon from 'sinon';
import test from 'tape';
import xhr from '../src/xhr';

test('test xhr function', (t) => {
  global.window = {
    XMLHttpRequest: Sinon.useFakeXMLHttpRequest(),
    ActiveXObject: function () {}
  };
  global.XMLHttpRequest = Sinon.useFakeXMLHttpRequest();
  global.XMLHttpRequest.onCreate = function (xhr) {
    xhr.withCredentials = false;
  };
  global.ActiveXObject = Sinon.useFakeXMLHttpRequest();

  // cors == true
  // typeof window.XMLHttpRequest !== 'undefined' && 'withCredentials' in new XMLHttpRequest()
  var val = xhr(true);
  t.ok(
    val.__proto__ == XMLHttpRequest.prototype,
    'call xhr(true) returns as expected when typeof window.XMLHttpRequest !== "undefined" && "withCredentials" in new XMLHttpRequest()'
  );
  t.ok(
    'withCredentials' in val,
    '"withCredentials" in new XMLHttpRequest object'
  );

  // typeof window.XMLHttpRequest == 'undefined'
  // typeof XDomainRequest !== 'undefined'
  var stub = Sinon.stub(global.window, 'XMLHttpRequest').value(undefined);
  global.XDomainRequest = Sinon.useFakeXMLHttpRequest();
  val = xhr(true);
  t.ok(
    val.__proto__ == global.XDomainRequest.prototype,
    'xhr(true) performs as expected when typeof window.XDomainRequest !== "undefined"'
  );

  // else
  delete global.XDomainRequest;
  val = xhr(true);
  t.equal(
    val,
    null,
    'xhr(true) performs as expected when typeof window.XDomainRequest == "undefined" && typeof window.XMLHttpRequest == "undefined"'
  );
  stub.restore();

  // cors == false
  global.XMLHttpRequest.restore();
  // typeof window.XMLHttpRequest !== 'undefined'
  val = xhr(false);
  t.ok(
    val.__proto__ == XMLHttpRequest.prototype,
    'xhr(false) performs as expected when typeof window.XDomainRequest == "undefined" && typeof window.XDomainRequest == "undefined"'
  );
  // window.ActiveXObject
  stub = Sinon.stub(global.window, 'XMLHttpRequest').value(undefined);
  var stub2 = Sinon.stub(global, 'ActiveXObject');
  stub2.withArgs('Msxml2.XMLHTTP').returns({});
  val = xhr(false);
  t.deepEqual(
    val,
    {},
    'xhr(false) performs as expected when ActiveXObject function well'
  );
  stub2.restore();

  // new ActiveXObject('Msxml2.XMLHTTP') 抛出异常
  stub2.withArgs('Msxml2.XMLHTTP').throws('some exceptions');
  val = xhr(false);
  t.equal(
    val,
    undefined,
    'xhr(false) performs as expected when exception happens to new ActiveXObject("Msxml2.XMLHTTP")'
  );
  stub2.restore();

  // !window.ActiveXObject
  Sinon.stub(global.window, 'ActiveXObject').value(undefined);
  val = xhr(false);
  t.equal(
    val,
    undefined,
    'xhr(false) performs as expected when browser neither support ActiveXObject nor XMLHttpRequest'
  );

  Sinon.restore();
  delete global.window;
  delete global.XMLHttpRequest;
  delete global.ActiveXObject;
  t.end();
});
