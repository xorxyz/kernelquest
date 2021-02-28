console.log('Loading asset builder...')

var fse = require('fs-extra')
var path = require('path')

const { DIR } = require('./constants.js')

module.exports = copyAssets

function copyAssets () {
  fse.copySync(DIR.public, DIR.dist)
}
