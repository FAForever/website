FROM node:22-bookworm as builder
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init
ENV NODE_ENV development

COPY . /code
WORKDIR /code

RUN yarn install --production=false --frozen-lockfile
RUN yarn build
RUN yarn install --production=true --ignore-optional --frozen-lockfile

FROM node:22-bookworm-slim as runtime
ENV NODE_ENV production

COPY --from=builder /usr/bin/dumb-init /usr/bin/dumb-init
COPY --from=builder --chown=node:node /code /code

WORKDIR /code
USER node

CMD ["dumb-init", "node", "src/backend/index.js"]

