# base
FROM node:12-alpine as base

USER node
WORKDIR /tmp

# install
FROM base as install

COPY --chown=node:node ./package*.json ./
RUN npm install 
COPY --chown=node:node . .

EXPOSE 8080

# test
FROM install as test

CMD ["npm", "test"]

# development
FROM install as development

CMD ["npm", "run", "serve"]

# build
FROM test as build
RUN npm run build
