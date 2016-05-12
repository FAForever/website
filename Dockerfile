FROM node

RUN apt-get update && apt-get -y install mongodb

RUN mkdir code

RUN mkdir /log/

RUN mkdir -p /data/db/

# First add _only_ package.json to utilize docker cache when deps don't change
ADD package.json /code
WORKDIR /code
RUN npm install

ADD . /code/

RUN npm install -g grunt-cli
RUN grunt prod

CMD mongod --fork --logpath /log/mongodb.log && node keystone

EXPOSE 3000
