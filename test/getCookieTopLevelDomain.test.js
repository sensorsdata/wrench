import test from 'tape';
import getCookieTopLevelDomain from '../src/getCookieTopLevelDomain';

test('test getCookieTopLevelDomain function', t => {
  const testCases = [
    ['https://wwww.example.com', '.example.com'],
    ['https://music.example.com', '.example.com'],
    ['https://video.example.org', '.example.org'],
    ['https://w.w.example.org', '.example.org'],
    ['https://a.example.cn', '.example.cn'],
    ['https://a.b.example.org', '.example.org'],
    ['https://a.b.c.d.com', '.d.com']
  ];

  function prepareTestContext() {
    global.document = {
      get cookie() {
        return this.cookieValueStr;
      },
      set cookie(val) {
        console.log(val);
        const r = /domain=(.*)/;
        const domain = r.exec(val)[1];

        if (domain.split('.').filter(s => s).length < 2
          || (this.domain && this.domain.indexOf(domain) == -1)) {
          this.cookieValueStr = '';
          return;
        }

        this.domain = domain;
        this.cookieValueStr = val;
      }
    };
  }

  testCases.forEach(tCase => {
    prepareTestContext();
    t.equal(getCookieTopLevelDomain(tCase[0]), tCase[1], `when call getCookieTopLevelDomain("${tCase[0]},then it returns "${tCase[1]}")`);
  });

  global.location = {};
  prepareTestContext();
  t.equal(getCookieTopLevelDomain(), '', 'when location.hostname is null or undefined, and call getCookieTopLevelDomain(), then it returns "" ');

  t.end();
});