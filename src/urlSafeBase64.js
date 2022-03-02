var ENC = {
  '+': '-',
  '/': '_',
  '=': '.'
};
var DEC = {
  '-': '+',
  _: '/',
  '.': '='
};

/** 安全的 base64 编码, 将 base64 中的 '+', '/', '=' 分别替换为 '-', '_', '.' <br>
 * 以此避免 base64 编码值被代码扫描工具识别为有害代码
 * @exports urlSafeBase64
 * @category Encoding
 */
var urlSafeBase64 = {
  /**
     * 对 base64 编码字符串进行再编码， 将字符串中的 '+', '/', '=' 分别替换为 '-', '_', '.'
     * @param {String} base64  base64 编码后的字符串
     * @return {String} 执行替换后的 base64 字符串
     */
  encode: function (base64) {
    return base64.replace(/[+/=]/g, function (m) {
      return ENC[m];
    });
  },

  /**
     * 对安全再编码后的 base64 字符串进行解码， 将字符串中的  '-', '_', '.' 分别替换为 '+', '/', '='
     * @param {String} safe 再编码后的 base64 字符串
     * @return {String} 执行解码还原后的 base64 字符串
     */
  decode: function (safe) {
    return safe.replace(/[-_.]/g, function (m) {
      return DEC[m];
    });
  },

  /**
     * 去除 base64 编码后的字符串中的 '=' 和 '.'
     * @param {String} string base64  编码后的字符串
     * @return {String} 去除 base64 编码字符串中的 '=' 和 '.' 后的字符串
     */
  trim: function (string) {
    return string.replace(/[.=]{1,2}$/, '');
  },

  /**
     * 检测传入字符串是否是 base64 编码的字符串
     * @param {String} string 传入字符串
     * @return {Boolean} 是否是 base64 编码的字符串
     */
  isBase64: function (string) {
    return /^[A-Za-z0-9+/]*[=]{0,2}$/.test(string);
  },

  /**
     * 检测传入字符串是否是安全的 base64 编码的字符串
     * @param {String} string 传入字符串
     * @return {Boolean}  是否是安全 base64 编码的字符串
     */
  isUrlSafeBase64: function (string) {
    return /^[A-Za-z0-9_-]*[.]{0,2}$/.test(string);
  }
};

export default urlSafeBase64;