const { terser } = require('rollup-plugin-terser')
const babel = require('rollup-plugin-babel')
const replace = require('rollup-plugin-replace')
const path = require('path')
const fileContext = require('./fileContext')
const resolve = p => path.resolve(__dirname, '../', p)

// const banner = (name) => `
//   /*!
//   * vc-tween-one.js v${version}
//   * (c) 2018 zhouxinyong
//   * vc-tween-one.js Released under the MIT License.
//   */
//   `
const plugins = (hasUglify) => {
  if (hasUglify) {
    return [
      babel(
        {
          exclude: 'node_modules/**'
        }
      ),
      terser({
        output: {
          comments: function (node, comment) {
            const text = comment.value
            const type = comment.type
            if (type === 'comment2') {
              return /\vc-tween-one\.js Released under the MIT License/i.test(text)
            }
          }
        }
      })
    ]
  }
  return [
    babel(
      {
        exclude: 'node_modules/**'
      }
    )
  ]
}
const files = fileContext('./src')
const entries = []
files.map((file) => {
  entries.push({
    entry: resolve(file.file),
    dest: resolve(`lib/${file.name}`),
    format: 'cjs',
    plugins: plugins(false),
    env: 'production',
    sourcemap: false
  })
  entries.push({
    entry: resolve(file.file),
    dest: resolve(`es/${file.name}`),
    format: 'esm',
    plugins: plugins(false),
    env: 'production',
    sourcemap: false
  })
})

function generateConfig (opts) {
  const config = {
    input: opts.entry,
    output: {
      file: opts.dest,
      format: opts.format,
      // name: opts.name,
      // banner: opts.banner,
      sourcemap: opts.sourcemap
    },
    plugins: opts.plugins,
    external: id => /^babel/.test(id) || /vue/.test(id) || /style-utils/.test(id) || /^vc-*?/.test(id) || /raf/.test(id) || /tween-functions/.test(id)
  }
  if (opts.env) {
    config.plugins.push(replace({
      'process.env.NODE_ENV': JSON.stringify(opts.env)
    }))
  }
  return {
    config,
    fileName: opts.fileName
  }
}

module.exports = () => entries.map((entry) => generateConfig(entry))
