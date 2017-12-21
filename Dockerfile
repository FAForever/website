FROM node:alpine

RUN mkdir code

RUN apk add --update \
    python \
    build-base \ 
    yarn  
    
# First add _only_ package.json to utilize docker cache when deps don't change
ADD package.json /code
WORKDIR /code
RUN yarn

ADD . /code/

RUN npm install -g grunt-cli
RUN grunt prod

# Run the command on container startup
RUN node scripts/extractor.js
RUN node scripts/getLatestClientRelease.js

CMD PORT=3000 npm start

EXPOSE 3000
