console.log('Loading budo...')

var path = require('path')
var budo = require('budo')
var slashes = require('connect-slashes')

console.log('Loading builder...')

var build = require('./build')
const PORT = 8000

runBuild()

var b = budo('./src/index.js', {
  live: true,
  port: PORT,
  dir: path.join(__dirname, '../dist'),
  watchGlob: ['!dist/**', '**/*.{md,pug,styl,yml,png}'],
  staticOptions: {
    extensions: [ 'html' ]
  }
}).on('connect', e => {
  console.log('Listening on', PORT)
}).on('watch', e => {
  console.log('A file changed.')
  runBuild()

  b.reload()
  console.log('Reloaded.')
})

function runBuild () {
  try {
    build()
  } catch (err) {
    console.log('Build failed:', err)
  }
}
