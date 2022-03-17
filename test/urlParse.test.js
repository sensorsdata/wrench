import urlParse from '../src/urlParse';
import sinon from 'sinon';
import test from 'tape';

test('test urlParse function', t => {
  const testParseCases = [
    {
      url: 'https://alice:a12345@www.example.com:8080/category?a=1&b=2&c=3#hello',
      fields: {
        Username: 'alice',
        Password: 'a12345',
        Port: '8080',
        Origin: 'https://www.example.com',
        Protocol: 'https',
        Host: 'www.example.com',
        Path: '/category',
        QueryString: 'a=1&b=2&c=3',
        Fragment: 'hello'
      }
    },
    {
      url: 'https://www.example.com/category#haha?a=1&b=2&c=3#hello',
      fields: {
        Port: '',
        Origin: 'https://www.example.com',
        Protocol: 'https',
        Host: 'www.example.com',
        Path: '/category',
        QueryString: '',
        Fragment: 'haha?a=1&b=2&c=3#hello'
      }
    },
    {
      url: 'https://example.com?a=1&b=2&c=3#hello',
      fields: {
        Port: '',
        Origin: 'https://example.com',
        Protocol: 'https',
        Host: 'example.com',
        Path: '',
        QueryString: 'a=1&b=2&c=3',
        Fragment: 'hello'
      }
    },
    {
      url: 'https://example.com#hello',
      fields: {
        Port: '',
        Origin: 'https://example.com',
        Protocol: 'https',
        Host: 'example.com',
        Path: '',
        QueryString: '',
        Fragment: 'hello'
      }
    },
    {
      url: 'https://example.com',
      fields: {
        Port: '',
        Origin: 'https://example.com',
        Protocol: 'https',
        Host: 'example.com',
        Path: '',
        QueryString: '',
        Fragment: ''
      }
    },
  ];

  testParseCases.forEach(testCase => {
    let urlobj = urlParse(testCase.url);
    for (let i in testCase.fields) {
      t.equal(urlobj._values[i], testCase.fields[i], `when call urlParse(${testCase.url}), then ${i} is as expected.`);
    }
  });

  // test 
  const testAddQueryStrCases = [
    {
      url: 'https://www.example.com:8080/category?a=1&b=2&c=3#hello',
      cases: [
        {
          query: { like: 'apple' },
          expect: 'https://www.example.com:8080/category?a=1&b=2&c=3&like=apple#hello'
        },
        {
          query: { age: 123 },
          expect: 'https://www.example.com:8080/category?a=1&b=2&c=3&age=123#hello'
        },
        {
          query: { like: 'apple', age: 123 },
          expect: 'https://www.example.com:8080/category?a=1&b=2&c=3&like=apple&age=123#hello'
        }
      ]
    },
    {
      url: 'https://www.example.com/category#haha?a=1&b=2&c=3#hello',
      cases: [
        {
          query: { like: 'apple' },
          expect: 'https://www.example.com/category?like=apple#haha?a=1&b=2&c=3#hello'
        },
        {
          query: { age: 123 },
          expect: 'https://www.example.com/category?age=123#haha?a=1&b=2&c=3#hello'
        },
        {
          query: { like: 'apple', age: 123 },
          expect: 'https://www.example.com/category?like=apple&age=123#haha?a=1&b=2&c=3#hello'
        }
      ]
    },
    {
      url: 'https://example.com?a=1&b=2&',
      cases: [
        {
          query: { a: 'apple', b: 'orange' },
          expect: 'https://example.com?a=apple&b=orange&'
        },
        {
          query: { d: 4, e: 5, f: 6, g: 7, h: 8, i: 9 },
          expect: 'https://example.com?a=1&b=2&d=4&e=5&f=6&g=7&h=8&i=9'
        },
      ]
    }
  ];

  testAddQueryStrCases.forEach(testCase => {
    testCase.cases.forEach(addQueryCase => {
      const urlObj = urlParse(testCase.url);
      urlObj.addQueryString(addQueryCase.query);

      t.equal(urlObj.getUrl(), addQueryCase.expect, `when add query ${JSON.stringify(addQueryCase.query)}, then call getUrl return as expected`);
    });
  });

  const urlObj = urlParse();
  urlObj.setUrl('https://example.com');
  t.equal(urlObj._values['URL'], 'https://example.com', 'when call setUrl("https://example.com"), then it will re-parse the url using "https://example.com"');
  let ret = urlObj.addQueryString(123);
  t.false(ret, 'when call addQueryString(123), then it will return false');

  let spyParse = sinon.spy(urlObj, '_parse');
  try {
    urlObj.setUrl('');
    // eslint-disable-next-line no-empty
  } catch (e) { }
  t.ok(spyParse.threw(), 'when call setUrl(""), then it will throw error');
  t.end();
});