# architecture

# requirements

alpha:

- 300 concurrent players (15 environments @ 20 users each)
- 3,000 registered users

production:

- 3,000 concurrent players (150 environments @ 20 users each)
- 30,000 MAU

# v4.0 spec

0. git repo
1. client is a vue single-page app built with `parcel` and served on [netlify](netlify.com)
2. cloudwatch event bus 
3. redis cluster
  - runs on elasticache
  - DBs 1 and 2 for api and DBs 2 and 3 for worker (2 for ipc queues)
4. application load balancer
5. TLS certificate
6. secret
  - SecretsManager
  - JSON unbundled at runtime by app
7. 1x `api` container and 1x `worker` container
  - run on ecs (on an ec2 instance)
  - api
    - websockets
    - receives commands from clients and creates jobs on the queue
    - listens on event bus and sends events relevant to each client
  - worker
    - handles jobs in the queue for zones specified in environment variables
    - emits zone events on event bus
