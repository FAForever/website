FROM node:20.9-bookworm as builder
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init
ENV NODE_ENV development

COPY . /code
WORKDIR /code

RUN yarn install --production=false --frozen-lockfile
RUN ./node_modules/.bin/grunt prod
RUN yarn install --production=true --ignore-optional --frozen-lockfile

FROM node:20.9.0-bookworm-slim as runtime
ENV NODE_ENV production

COPY --from=builder /usr/bin/dumb-init /usr/bin/dumb-init
COPY --from=builder --chown=node:node /code /code

WORKDIR /code
USER node

CMD ["dumb-init", "node", "express.js"]

