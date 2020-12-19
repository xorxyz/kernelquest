module.exports = function (req, res) {
  const { id } = req.body

  return res.json({
    id,
    jsonrpc: '2.0',
    error: {
      code: -32601,
      message: 'Method not found'
    }
  })
}
