# xor4

## client

- served at `localhost:1234`
- vue app, no router, 1 page

## server

GET `/login` send creds here to get a session
GET `/logout` destroy session
`/` websockets server, protected

## developing

### redis

```
docker run -it --rm redis redis-cli -h redis
```

## see also

- [`/notes/README.md`](notes/.md)