const rollup = require('rollup')
const rm = require('rimraf')
const path = require('path')
const ora = require('ora')
const chalk = require('chalk')
const EntryConfig = require('./config')()

const resolve = p => path.resolve(__dirname, '../', p)
const spinner = ora('building lib for production...\n')
spinner.start()

async function build (target) {
  const { config } = target
  const { output } = config
  const bundle = await rollup.rollup(config)
  await bundle.generate(output)
  await bundle.write(output)
}

function buildLib (entries) {
  let index = 0
  const entryLen = entries.length
  const next = async () => {
    await build(entries[index])
    index++
    if (index < entryLen) {
      next()
    } else {
      spinner.stop()
      console.log(chalk.cyan('\nbuild complete.\n'))
    }
  }
  try {
    next()
  } catch (error) {
    spinner.stop()
  }
}
rm.sync(resolve('es'))
rm.sync(resolve('lib'))
buildLib(EntryConfig)
