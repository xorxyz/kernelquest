console.log('Loading css builder...')

var fs = require('fs')
var path = require('path')
var stylus = require('stylus')

const { DIR } = require('./constants.js')

module.exports = buildCSS

function buildCSS () {
  var styleStr = fs.readFileSync(path.join(DIR.style, 'style.styl'), 'utf8')

  stylus.render(styleStr, { filename: 'style.css' }, (err, css) => {
    if (err) throw err

    fs.writeFileSync(path.join(DIR.dist, 'style.css'), css)
  })
}
