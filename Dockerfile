FROM node

RUN apt-get update

RUN mkdir code

# First add _only_ package.json to utilize docker cache when deps don't change
ADD package.json /code
WORKDIR /code
RUN yarn install

ADD . /code/

RUN npm install -g grunt-cli
RUN grunt prod

CMD PORT=3000 npm start

EXPOSE 3000
