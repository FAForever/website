# website
New Forged Alliance Forever main website to replace http://faforever.com

Requires Node, Grunt, AND Yarn

1. Copy .env.example to .env and set to development or production
2. yarn install
3. grunt sass:dev
4. grunt serve:dev (development)

In order to install grunt for the command line, please follow this guide - http://gruntjs.com/getting-started

## Docker Install Guide
You will need to setup a default machine in a new terminal window. This can be accomplished by doing the following.

2. Build docker image
```sh
→ docker build -t faf-website .
```
3. Run docker image
```sh
→ docker run --name faf-website -p 3000:3000 -d faf-website
```
4. Open the app in your browser
```sh
→ open http://$(docker-machine ip default):3000/
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