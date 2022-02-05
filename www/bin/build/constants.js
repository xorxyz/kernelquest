console.log('Loading constants...')

var path = require('path')

module.exports = {
  DIR: generateDirectoryMap([
    'dist', 
    'templates/pages', 
    'style', 
    'public',
    'content'
  ]),
  MONTHS: [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]
}

function generateDirectoryMap (directories) {
  var rootDir = path.join(__dirname, '../..')
  var dir = { root: rootDir }

  directories.forEach(name => {
    dir[name] = path.join(rootDir, name)
  })

  return dir
}
