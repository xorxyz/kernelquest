console.log('Loading data builder...')

var fs = require('fs')
var path = require('path')
var yaml = require('yaml')
var changeCase = require('change-case')

module.exports = loadData

function loadData () {
  var dataDir = path.join(__dirname, '../../data')

  var filenames = fs.readdirSync(dataDir)
  var data = {}

  filenames.forEach(filename => {
    var name = getPageKey(filename)
    var file = fs.readFileSync(path.join(dataDir, filename), 'utf8')

    data[name] = yaml.parse(file)
  })

  return data
}

function getPageKey (filename) {
  var ext = path.extname(filename)
  var basename = path.basename(filename, ext)

  return changeCase.camel(basename)
}