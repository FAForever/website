# Use an ubuntu-image for building assets for use in a runtime image...
FROM node:lts as builder

RUN mkdir code

# Add files to /code folder
ADD . /code

WORKDIR /code

RUN yarn install

RUN ./node_modules/.bin/grunt prod

RUN cp .env.example .env

# Slimmer runtime image without python/make/gcc etc.
FROM node:lts-alpine as runtime

COPY --from=builder /code /code

WORKDIR /code

# Only install runtime dependencies for the runtime image
RUN yarn --prod

CMD PORT=3000 npm start

EXPOSE 3000
