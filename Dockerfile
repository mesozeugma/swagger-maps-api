FROM node:10-alpine

ENV NODE_ENV="production"

WORKDIR /app

COPY package*.json /app/

RUN npm ci

RUN apk add --no-cache tini

COPY --chown=node:node . /app/

RUN mkdir /data \
    && chown node:node /data

ENV API_DB_DATABASE="/data/data.sqlite"

EXPOSE 10010

USER node

VOLUME [ "/data" ]

ENTRYPOINT ["/sbin/tini","--","node","app.js"]
