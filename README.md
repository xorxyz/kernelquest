# xor4

this fs is made to be overlaid with another unix-like fs. 

this is the developer docs.
for game design doc look in [`/notes`](/notes/README.md).

packages:

1. [`engine`](/pkg/engine/README.md). 
1. [`client`](/pkg/client/README.md). 
1. [`api`](/pkg/api/README.md). 
1. [`worker`](/pkg/worker/README.md). 

## redis

make sure it's running:

```
docker run -it --rm redis redis-cli -h redis
```

it stores: 

1. sessions
2. game state
3. job queues


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
