import test from 'tape';
import Sinon from 'sinon';
import getScreenOrientation from '../src/getScreenOrientation';

test('test getScreenOrientation function', (t) => {
  const testCases = [
    { obj: { msOrientation: 'landscape' }, expect: 'landscape' },
    { obj: { mozOrientation: 'portrait' }, expect: 'portrait' },
    { obj: { orientation: { type: 'landscape' } }, expect: 'landscape' },
  ];

  global.screen = {};
  var val;
  // screenOrientationAPI
  testCases.forEach((testCase) => {
    Sinon.stub(global, 'screen').value(testCase.obj);
    val = getScreenOrientation();
    t.equal(val, testCase.expect, 'getScreenOrientation performs as expected');
    Sinon.restore();
  });

  // 模拟 window.matchMedia
  global.window = {
    matchMedia: function () {},
    msMatchMedia: function () {},
  };
  // matchMediaFunc('(orientation: landscape)').matches
  var stub = Sinon.stub(global.window, 'matchMedia');
  stub.withArgs('(orientation: landscape)').returns({ matches: true });
  val = getScreenOrientation();
  t.equal(val, 'landscape', 'getScreenOrientation performs as expected');
  stub.restore();

  // matchMediaFunc('(orientation: portrait)').matches
  stub = Sinon.stub(global.window, 'matchMedia');
  stub
    .withArgs('(orientation: landscape)')
    .returns({ matches: false })
    .withArgs('(orientation: portrait)')
    .returns({ matches: true });
  val = getScreenOrientation();
  t.equal(val, 'portrait', 'getScreenOrientation performs as expected');

  stub.restore();

  // window.msMatchMedia
  Sinon.stub(global.window, 'matchMedia').value(undefined);
  // matchMediaFunc('(orientation: landscape)').matches
  stub = Sinon.stub(global.window, 'msMatchMedia');
  stub.withArgs('(orientation: landscape)').returns({ matches: true });
  val = getScreenOrientation();
  t.equal(val, 'landscape', 'getScreenOrientation performs as expected');

  // Sinon.restore();
  stub.restore();

  // matchMediaFunc('(orientation: portrait)').matches
  stub = Sinon.stub(global.window, 'msMatchMedia');
  stub
    .withArgs('(orientation: landscape)')
    .returns({ matches: false })
    .withArgs('(orientation: portrait)')
    .returns({ matches: true });
  val = getScreenOrientation();
  t.equal(val, 'portrait', 'getScreenOrientation performs as expected');

  stub.restore();

  // !matchMediaFunc('(orientation: portrait)').matches & !matchMediaFunc('(orientation: landscape)').matches
  stub = Sinon.stub(global.window, 'msMatchMedia');
  stub.withArgs('(orientation: landscape)').returns({ matches: false });
  stub.withArgs('(orientation: portrait)').returns({ matches: false });
  val = getScreenOrientation();
  t.equal(val, '未取到值', 'getScreenOrientation performs as expected');

  Sinon.restore();

  // !mediaQueriesSupported()
  Sinon.stub(global.window, 'matchMedia').value(undefined);
  Sinon.stub(global.window, 'msMatchMedia').value(undefined);
  val = getScreenOrientation();
  t.equal(val, '未取到值', 'getScreenOrientation performs as expected');

  Sinon.restore();
  t.end();
});
