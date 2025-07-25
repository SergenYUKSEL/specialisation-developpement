/**
 * Babel configuration for Jest testing
 * Transforms ES modules to CommonJS for test environment
 */
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        },
        modules: 'commonjs'
      }
    ]
  ]
}; 