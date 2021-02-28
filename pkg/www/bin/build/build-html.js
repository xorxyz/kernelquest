console.log('Loading html builder...')

var fs = require('fs')
var path = require('path')
var mkdirp = require('mkdirp')
var pug = require('pug')
var matter = require('gray-matter')
var marked = require('marked')

var feed = require('./feed')

const { DIR, MONTHS } = require('./constants.js')
const TEMPLATES_DIR = path.join(__dirname, '../../templates/layouts')
const pugOpts = {
  basedir: path.join(__dirname, '../..'),
  filters: {},
  globals: [ 
    formatDate
  ]
}

var renderer = new marked.Renderer()

renderer.image = createCustomRenderImageFn(renderer.image)
renderer.hr = createCustomRenderHRFn(renderer.hr)

module.exports = buildHTML

function buildHTML (data) {
  var pageFiles = DIR['content']
  var filepaths = listFilesRecursive(pageFiles)

  filepaths
    .forEach((filepath) => {
      if (path.dirname(filepath)[0] === '_') return

      var html = generatePage(filepath, data)
      var dest = getDestination(filepath)

      mkdirp.sync(path.dirname(dest))
      fs.writeFileSync(dest, html)
    })
}

function generatePage (filepath, data) {
  var markdownText = fs.readFileSync(filepath, 'utf8')
  var frontmatter = matter(markdownText)
  var content = marked(frontmatter.content, { renderer })
  var template = frontmatter.data.template || getTemplate(filepath)
  var templateSrc = path.join(TEMPLATES_DIR, template + '.pug')

  var templateText = fs.readFileSync(templateSrc, 'utf8')
  var opts = Object.assign({}, pugOpts, { filename: filepath })
  var locals = Object.assign({}, data, {
    formatDate,
    templateName: template,
    dir: fs.readdirSync(path.dirname(filepath)),
    meta: frontmatter.data,
    content
  })

  var html = pug.compile(templateText, opts)(locals)

  return html
}

function getContentDir (filepath) {
  var dirs = filepath.split('/')
  var index = dirs.findIndex(d => d === 'content') + 1

  return dirs[index]
}

function getTemplate (filepath) {
  var dirname = getContentDir(filepath)

  var templateSrc = path.join(TEMPLATES_DIR, dirname + '.pug')

  return fs.existsSync(templateSrc, 'utf8')
    ? dirname
    : 'default'
}

function appendToFeed ({ filepath, item }) {
  if (path.basename(path.dirname(filepath)) === 'news') {
    feed.addItem(Object.assign({}, item, {
      content,
      updated: new Date(item.updated || item.date),
      date: new Date(item.date),
      description: item.blurb,
      link: 'https://xor.xyz/news/' + item.slug
    }))
  }
}

function getDestination (src) {
  var subdir = path
    .relative(DIR.root, path.dirname(src))
    .split(path.sep)
    .slice(1)
    .join(path.sep)

  if (subdir.indexOf('pages') > -1) {
    subdir = path.relative('pages', subdir)
  }

  var dir = path.join(DIR.dist, subdir)
  var ext = path.extname(src)
  var filename = path.basename(src, ext) + '.html'
  var dest = path.join(dir, filename)

  return dest
}

function listFilesRecursive (dir) {
  var filenames = fs.readdirSync(dir)

  var files = filenames.map(filename => {
    var filepath = path.join(dir, filename)

    return fs.statSync(filepath).isDirectory()
      ? listFilesRecursive(filepath)
      : filepath
  })

  return flatten(files)
}

function flatten (array) {
  return [].concat(...array)
}

function formatDate (value) {
  var d = new Date(value)

  return `${MONTHS[d.getMonth()]} ${d.getDate()} ${d.getFullYear()}`
}

function createCustomRenderImageFn (fn) {
  return function renderImage (href, title, text) {
    href = process.env.ASSET_URL + '/images/' + href

    return fn.call(renderer, href, title, text)
  }
}

function createCustomRenderHRFn (fn) {
  return function renderHR () {
    return fn.call(renderer, ...arguments)
  }
}
