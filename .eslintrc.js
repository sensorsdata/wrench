module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 8
  },
  ignorePatterns: ['doc/*', 'dist/*'],
  rules: {
    indent: ['error', 2],
    quotes: ['error', 'single'],
    'max-len': ['error', { code: 100000 }],
    semi: ['error', 'always'],
    'comma-dangle': ['error', 'never']
  }
};