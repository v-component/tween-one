module.exports = {
  presets: [
    [
      '@babel/env', { 'modules': false }
    ]
  ],
  plugins: [
    '@babel/plugin-syntax-jsx',
    'transform-vue-jsx',
    '@babel/plugin-external-helpers'
  ]
}
