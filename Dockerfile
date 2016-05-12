FROM node

RUN apt-get update && apt-get -y install mongodb

RUN mkdir code

RUN mkdir /log/

RUN mkdir -p /data/db/

ADD . /code/

WORKDIR /code

RUN npm install
RUN npm install -g grunt-cli
RUN grunt sass:dev

CMD mongod --fork --logpath /log/mongodb.log && node keystone

EXPOSE 3000
