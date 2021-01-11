import * as session from 'express-session';
import * as redis from 'redis';
import * as Store from 'connect-redis';
import { SESSION_SECRET } from './constants';

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

const RedisStore = Store(session);
const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379,
  db: 10,
});

const sessionParser = session({
  store: new RedisStore({ client: redisClient }),
  secret: SESSION_SECRET,
  saveUninitialized: true,
  resave: true,
  cookie: {
    path: '/',
    httpOnly: false,
    secure: false,
  },
});

export default sessionParser;
