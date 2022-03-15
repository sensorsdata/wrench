import test from 'tape';
import getURL from '../src/getURL';

test('test getURL function', (t) => {
  var url = ' https://www.test.com';

  global.location = {
    href: 'https://www.example.com'
  };

  var val = getURL(url);
  t.equal(val, 'https://www.test.com', 'when call getURL(" https://www.test.com"), then it returns "https://www.test.com"');

  val = getURL();
  t.equal(val, 'https://www.example.com', 'when call getURL(), then it returns "https://www.example.com"');

  delete global.location;
  t.end();
});
