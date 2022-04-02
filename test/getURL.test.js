import test from 'tape';
import getURL from '../src/getURL';

test('test getURL function', (t) => {
  var url = ' https://www.test.com';
  var target = 'https://www.test.com';

  global.location = {
    href: 'https://www.example.com'
  };

  var val = getURL(url);
  t.equal(val, target, `when call getURL("${url}"), then it returns "${target}"`);

  val = getURL();
  t.equal(
    val,
    'https://www.example.com',
    'when call getURL(), then it returns "https://www.example.com"'
  );

  delete global.location;
  t.end();
});
