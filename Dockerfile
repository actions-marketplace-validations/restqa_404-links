# The instructions for the first stage
FROM node:14-alpine as builder
LABEL maintainer="RestQa <team@restqa.io>"
LABEL app="404_links"
LABEL name="404 lings"
LABEL description="It is a part of quality assurance to check that your markdown files doesn\'t contains broken links"
LABEL repository="https://github.com/restqa/404-links"
LABEL url="https://restqa.io/404-links"

COPY package*.json ./

RUN npm install --production
RUN npm ci --only=production

# The instructions for second stage
FROM node:14-alpine

ENV NODE_ENV=production

COPY . /restqa
COPY --from=builder node_modules /restqa/node_modules

WORKDIR /restqa

ENTRYPOINT ["/usr/local/bin/node", "/restqa/404-links.js"]

