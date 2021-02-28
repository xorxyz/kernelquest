console.log('Loading fs builder...')

var { execSync } = require('child_process')
var mkdirp = require('mkdirp')

const { DIR } = require('./constants')

module.exports = recreateDist

function recreateDist () {
  execSync(`rm -rf ${DIR.dist}`)
  mkdirp.sync(DIR.dist)
}
