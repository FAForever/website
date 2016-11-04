FROM node

# Update and install cron
RUN apt-get update && apt-get install -y cron

RUN mkdir code

# First add _only_ package.json to utilize docker cache when deps don't change
ADD package.json /code
WORKDIR /code
RUN yarn install

ADD . /code/

# Add crontab file in the cron directory
ADD crontab /etc/cron.d/fetch-users

# Give execution rights on the cron job
RUN chmod 0644 /etc/cron.d/fetch-users

# Create the log file to be able to run tail
RUN touch /var/log/cron.log

RUN npm install -g grunt-cli
RUN grunt prod

# Run the command on container startup
CMD cron && tail -f /var/log/cron.log

CMD PORT=3000 npm start

EXPOSE 3000
