const fs = require('fs')
const fileContext = function (dir, useSubdirectories = true, reg = /\.jsx?$/, mode) {
  let results = []
  const list = fs.readdirSync(dir)
  list.forEach(function (file) {
    file = dir + '/' + file
    var stat = fs.statSync(file)
    if (stat && stat.isDirectory() && useSubdirectories) {
      results = results.concat(fileContext(file, useSubdirectories, reg, mode = dir))
    } else {
      if (reg.test(file)) {
        results.push({
          name: mode ? file.replace(`${mode}/`, '') : file.replace(`${dir}/`, ''),
          file
        })
      }
    }
  })
  return results
}

module.exports = fileContext
