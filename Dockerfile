FROM node

RUN apt-get update && apt-get -y install mongodb vim ruby

RUN mkdir code

ADD . /code/

WORKDIR /code

RUN npm install
RUN npm install -g grunt
RUN npm install grunt-contrib-sass

CMD service mongod start &&  grunt serve

EXPOSE 80
