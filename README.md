# xor4

this is the developer docs
for game design doc look in [`/notes`](/notes/README.md). 

## client

- served at `localhost:1234`
- vue app, no router, 1 page

## server

- served at `localhost:3000`
- `GET /login` send creds here to get a session
- `GET /logout` destroy session
- `UPGRADE /` websockets server, protected

## redis

```
docker run -it --rm redis redis-cli -h redis
```

## see also

- [`/notes/README.md`](notes/.md)