const session = require('express-session');

module.exports = session({ 
  secret: 'aaaa',
  resave: false,
  saveUninitialized: false,
  cookie: {
    path: '/', 
    httpOnly: false, 
    secure: false,
    maxAge: null
  },
})