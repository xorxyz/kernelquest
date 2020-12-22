import * as uuid from 'uuid';
import * as session from 'express-session';

export default session({
  secret: uuid.v4(),
  resave: false,
  saveUninitialized: false,
  cookie: {
    path: '/',
    httpOnly: false,
    secure: false,
    maxAge: null,
  },
});
