import test from 'tape';
import sinon from 'sinon';
import getRandom from '../src/getRandom';

test('test getRandom function', (t) => {
  global.Uint32Array = function () {};
  global.crypto = { getRandomValues: function () {} };
  global.msCrypto = { getRandomValues: function () {} };

  // !(Uint32Array === 'function')
  sinon.stub(global, 'Uint32Array').value(undefined);
  var r = getRandom();
  var val = r < 1 && r > 0;
  t.ok(val, 'getRandom() performs as expected');

  sinon.restore();

  // typeof crypto !== 'undefined'
  sinon.stub(global, 'Uint32Array').withArgs(1).returns([0]);
  var stub = sinon.stub(global.crypto, 'getRandomValues');
  stub.withArgs([0]).returns([Math.floor(Math.random() * 1000000000)]);
  r = getRandom();
  val = r < 1 && r > 0;
  t.ok(
    val,
    'getRandom performs as expected when typeof crypto !== "undefined"'
  );

  stub.restore();

  // typeof msCrypto !== 'undefined'
  sinon.stub(global, 'crypto').value(undefined);
  sinon
    .stub(global.msCrypto, 'getRandomValues')
    .withArgs([0])
    .returns([Math.floor(Math.random() * 1000000000)]);
  r = getRandom();
  val = r < 1 && r > 0;
  t.ok(
    val,
    'getRandom performs as expected when typeof msCrypto !== "undefined"'
  );

  sinon.restore();

  // !(isObject(cry) && cry.getRandomValues)
  sinon.stub(global, 'crypto').value(undefined);
  sinon.stub(global, 'msCrypto').value(undefined);
  r = getRandom();
  val = r < 1 && r > 0;
  t.ok(val, 'getRandom performs as expected');

  sinon.restore();
  delete global.Uint16Array;
  delete global.msCrypto;
  delete global.crypto;
  t.end();
});
