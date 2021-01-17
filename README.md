# xor4

this is the developer docs.
for game design doc look in [`/notes`](/notes/README.md). 

## engine

[`docs`](/pkg/engine/README.md). 

- entity-component-systems pattern
- extensible

## client

[`docs`](/pkg/client/README.md). 

- served at `localhost:1234`
- vue app, no router, 1 page
- runs a local copy of the engine

## api

[`docs`](/pkg/api/README.md). 

- served at `localhost:3000`
- `UPGRADE /` websockets server, protected
- `GET /login` send creds here to get a session
- `GET /logout` destroy session

## worker

[`docs`](/pkg/worker/README.md). 

- wip
- processes the jobs
- runs a copy of the engine

## redis

- sessions
- game state
- job queues

```
docker run -it --rm redis redis-cli -h redis
```

## localstack

- IAM
- STS
- Route53
- S3
- CloudWatch
- Secrets Manager
- Lambda
- DynamoDB
- API Gateway
- KMS
- SQS
- SES
- StepFunctions

## see also

- [`/notes/README.md`](notes/README.md)
