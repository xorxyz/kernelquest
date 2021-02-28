console.log('Loading rss feed builder...')

var fs = require('fs')
var { Feed } = require('feed')

const feedOpts = {
  title: 'XOR',
  description: 'Computer Security Game.',
  id: 'https://xor.xyz/',
  link: 'https://xor.xyz/',
  language: 'en',
  image: 'https://xor.xyz/images/logo.png',
  favicon: 'https://xor.xyz/favicon.ico',
  copyright: '© 2018-2019, Diagonal Systems Inc. All Rights Reserved.',
  generator: 'XOR',
  feedLinks: {
    atom: 'https://xor.xyz/atom',
    rss: 'https://xor.xyz/rss'
  },
  author: {
    name: 'Jonathan Dupré',
    email: 'jonathan@diagonal.sh',
    link: 'https://diagonal.sh/company/team#jonathan'
  }
}

module.exports = createFeed()

function createFeed () {
  const feed = new Feed(feedOpts)

  return {
    addItem () {
      feed.addItem(...arguments)
    },
    build () {
      fs.writeFileSync('dist/rss', feed.rss2())
      fs.writeFileSync('dist/atom', feed.atom1())
    }
  }
}
