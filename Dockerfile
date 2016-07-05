FROM node

RUN apt-get update

RUN mkdir code

# First add _only_ package.json to utilize docker cache when deps don't change
ADD package.json /code
WORKDIR /code
RUN npm install

ADD . /code/

RUN npm install -g grunt-cli
RUN grunt serve

CMD node express

EXPOSE 3000
