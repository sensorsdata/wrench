import logger from './logger';
/**
 * @typedef {Object} URLParser URL 解析器对象，用于添加查询参数，和重新获取添加查询参数后的 URL 字符串
 * @property {Function} setUrl <strong>setUrl(url:String)->void</strong><br>重新设置需要解析的 url
 * @property {Function} addQueryString <strong>addQueryString(obj:Object)->string</strong><br>添加查询参数、传入参数是一个 Key/Value 键值对对象
 * @property {Function} getUrl <strong>getUrl()->string</strong><br>重新获取 URL 字符串
 */

/** 传入 URL 返回一个 URL 解析对象，用于添加查询参数，和重新获取添加查询参数后的 URL 字符串
 * @category Bom
 * @param {String} url 传入需要添加查询参数的的 URL 字符串
 * @returns {URLParser} 一个 URL 解析对象，用于添加查询参数，和重新获取添加查询参数后的 URL 字符串
 * @function urlParse
 * @example
 * let url = 'https://example.com'
 * let u = urlParse(url);
 * u.addQueryString({name:'Alice'});
 * u.getUrl(); // 'https://example.com?name=Alice'
 */
export default function urlParse(url) {
  var URLParser = function (url) {
    this._fields = {
      Username: 4,
      Password: 5,
      Port: 7,
      Protocol: 2,
      Host: 6,
      Path: 8,
      URL: 0,
      QueryString: 9,
      Fragment: 10
    };
    this._values = {};
    //eslint-disable-next-line
    this._regex = /^((\w+):\/\/)?((\w+):?(\w+)?@)?([^\/\?:]+):?(\d+)?(\/?[^\?#]+)?\??([^#]+)?#?(\w*)/;

    if (typeof url != 'undefined') {
      this._parse(url);
    }
  };

  URLParser.prototype.setUrl = function (url) {
    this._parse(url);
  };

  URLParser.prototype._initValues = function () {
    for (var a in this._fields) {
      this._values[a] = '';
    }
  };

  URLParser.prototype.addQueryString = function (queryObj) {
    if (typeof queryObj !== 'object') {
      return false;
    }
    var query = this._values.QueryString || '';
    for (var i in queryObj) {
      if (new RegExp(i + '[^&]+').test(query)) {
        query = query.replace(new RegExp(i + '[^&]+'), i + '=' + queryObj[i]);
      } else {
        if (query.slice(-1) === '&') {
          query = query + i + '=' + queryObj[i];
        } else {
          if (query === '') {
            query = i + '=' + queryObj[i];
          } else {
            query = query + '&' + i + '=' + queryObj[i];
          }
        }
      }
    }
    this._values.QueryString = query;
  };

  URLParser.prototype.getUrl = function () {
    var url = '';
    url += this._values.Origin;
    url += this._values.Port ? ':' + this._values.Port : '';
    url += this._values.Path;
    url += this._values.QueryString ? '?' + this._values.QueryString : '';
    url += this._values.Fragment ? '#' + this._values.Fragment : '';
    return url;
  };

  URLParser.prototype._parse = function (url) {
    this._initValues();

    var b = this._regex.exec(url);
    if (!b) {
      logger.log('URLParser::_parse -> Invalid URL');
    }

    var urlTmp = url.split('#');
    var urlPart = urlTmp[0];
    var hashPart = urlTmp.slice(1).join('#');
    b = this._regex.exec(urlPart);
    for (var c in this._fields) {
      if (typeof b[this._fields[c]] != 'undefined') {
        this._values[c] = b[this._fields[c]];
      }
    }
    this._values['Hostname'] = this._values['Host'].replace(/:\d+$/, '');
    this._values['Origin'] = this._values['Protocol'] + '://' + this._values['Hostname'];
    this._values['Fragment'] = hashPart;
  };

  return new URLParser(url);
}
