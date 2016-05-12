FROM node

RUN apt-get update && apt-get -y install mongodb

RUN mkdir code

RUN mkdir /log/

RUN mkdir -p /data/db/

ADD . /code/

WORKDIR /code

RUN npm install

CMD mongod --fork --logpath /log/mongodb.log && node keystone

EXPOSE 3000
