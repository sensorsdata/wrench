export default [{
  input: 'src/index.js',
  output: {
    file: 'dist/wrench-umd.js',
    format: 'umd',
    name: 'wrench'
  }
}, {
  input: 'src/index.js',
  output: {
    file: 'dist/wrench-es6.js',
    format: 'es'
  }
}
];