# website
New FAForever main website to replace http://faforever.com

Requires Node AND Grunt

1. Copy .env.example to .env and set to development or production
2. npm install
3. grunt sass:dev
4. grunt serve:dev (development)

In order to install grunt for the command line, please follow this guide - http://gruntjs.com/getting-started

## Docker Install Guide
You will need to setup a default machine in a new terminal window. This can be accomplished by doing the following.

1. Create a new virtual machine to run the docker file in. **This only needs to be done ONCE**
```sh
→ docker-compose run web
```
2. Build docker image
```sh
→ docker-compose run web
```
3. Run docker image
```sh
→ docker-compose up
```
4. Open the app in your browser
```sh
→ open http://$(docker-machine ip default):4000/
```

### You can find your IP by doing
```sh
→ docker-machine ip
```

## Adding stylesheets and javascripts
Since we are using grunt to handle all tasks, files must be registered in the correct grunt configurations. 
You can register a new stylesheet by going to grunt/sass.js. You will need to add the sass file underneath each category. 
The purpose behind each one is for dev and prod. In prod, it will minify the CSS, whereas DEV does not.

The same goes for Javascript. Any javascript needed will need to be registered under grunt/concat.js. This script 
puts all Javascript in one file, and will minify it in PROD. 