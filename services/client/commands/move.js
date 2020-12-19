const { people } = require('../state')

const directions = ['north', 'east', 'south', 'west']

module.exports = function handleMove (req, res) {
  const { id, params } = req.body
  const invalidParams = (
    !params || 
    !Array.isArray(params) || 
    !params.length || 
    !directions.includes(params[0])
  )
  
  if (invalidParams) {
    return res.json({
      id,
      jsonrpc: '2.0',
      error: {
        code: -32600,
        message: 'Invalid Request'
      }
    })
  }

  const [direction] = params

  if (direction === 'north') {
    people.john.y -= 1
  }
  if (direction === 'south') {
    people.john.y += 1
  }
  if (direction === 'west') {
    people.john.x -= 1
  }
  if (direction === 'east') {
    people.john.x += 1
  }

  return res.json({
    id,
    jsonrpc: '2.0',
    result: true
  })
}