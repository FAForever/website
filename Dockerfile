# Use an ubuntu-image for building assets for use in a runtime image...
FROM node as builder

RUN mkdir code

# First add _only_ package.json to utilize docker cache when deps don't change
ADD package.json /code
WORKDIR /code
RUN npm install -g yarn

RUN yarn

ADD . /code

RUN ./node_modules/.bin/grunt prod

# Slimmer runtime image without python/make/gcc etc.
FROM node:alpine as runtime

# Only install runtime dependencies for the runtime image
RUN yarn --prod
COPY --from=builder /code /code

WORKDIR /code
CMD PORT=3000 npm start

EXPOSE 3000
