This repository is the location of our main website at https://www.faforever.com

#Development

## Set up Local-Live Server

Their are 3 ways of setting up a local-Live server of the website

- Jetbrains Webstorm
- Visual Studio 2022
- Linux Virtual Machine (Requires Hardware support)





### Jetbrains Webstorm

![Imgur](https://i.imgur.com/cCEOMJO.png)

### Visual Studio 2022








Requires Node and NPM.
To install it, follow these steps : 

```
git clone https://github.com/FAForever/website.git
cd website
sudo npm install -g yarn
yarn install
node_modules/.bin/grunt prod
cp .env.example .env
```

Now you're ready to start the server. You can fire it using :
`yarn start`

In order to learn grunt and install cli, please follow this guide - http://gruntjs.com/getting-started

If you did changes run `grunt prod`+`PORT=3000 yarn start` again to apply them.

## Docker Install Guide
You will need to setup a default machine in a new terminal window. This can be accomplished by doing the following. The application is then running in production mode.

1. Build docker image
```sh
→ docker build -t faf-website .
```
2. Run docker image
```sh
→ docker run --name faf-website -p 3000:3000 -d faf-website
```
3. Open the app in your browser
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


## To Do
Remove the use of Node-SASS dependency due to depreciation and replace with Dart-SASS
