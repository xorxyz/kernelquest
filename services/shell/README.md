# xor4 shell

run locally:

```
docker run --rm -d \
  -e DOCKER_LAMBDA_STAY_OPEN=1 \
  -p 9001:9001 \
  -v $(pwd):/var/task:ro,delegated \
  lambci/lambda:nodejs12.x \
  index
```

watch:

```
nodemon -w ./ -e '' -s SIGINT -x docker -- run --rm -d \
  -e DOCKER_LAMBDA_STAY_OPEN=1 \
  -p 9001:9001 \
  -v src:/var/task:ro,delegated \
  lambci/lambda:nodejs12.x \
  handler
```
