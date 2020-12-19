const commands = {
  move: require('./move.js'),
  notFound: require('./not_found.js')
}

module.exports = function (app) {
  app.post('/jsonrpc', (req, res) => {
    const { method } = req.body
  
    if (!typeof method === 'string') {
      return res.status(401).end()
    }
  
    switch (method) {
      case 'move': {
        return commands.move(req, res)
      }
      default: {
        return commands.notFound(req, res)
      }
    }
  })
}
