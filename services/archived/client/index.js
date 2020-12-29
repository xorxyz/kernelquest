const http = require('http')
const express = require('express');
const pug = require('pug');
const uuid = require('uuid');

const sessionParser = require('./session')
const { rows, people } = require('./state')
const commands = require('./commands')
const ws = require('./ws')

const PORT = 3000
const app = express()
const server = http.createServer(app)

app.set('view engine', 'pug')

app.use(express.static('public'))
app.use(sessionParser)
app.use(express.urlencoded({ extended: true }))
app.use(express.json({ 
  limit: '2kb', 
  strict: true, 
  inflate: true, 
  type: 'application/json'
}))

commands(app)

app.use(function (req, res, next) {
  if (!req.session.userId) {
    req.session.userId = uuid.v4();
  }
  next()
})

app.get('/', (req, res) => {
  const r = [...rows.map(cells => [...cells.map(o => ({ ...o }))])]

  r.forEach((cells, y) => {
    cells.forEach((cell, x) => {
      const person = Object.values(people).find(p => p.x === x && p.y === y)
      if (person) {
        cell.p = person
      }
    })
  })

  res.render('index', {
    rows: r,
    uri: req.query.uri,
    messages: req.session.messages || [],
  })
})

app.get('/logout', (req, res) => {
  req.session.destroy()
  res.end('ok')
})

app.use('*', (req, res) => res.status(404).render('404'))

ws(server, app)

server.listen(PORT, () => console.log('listening on ', PORT))
