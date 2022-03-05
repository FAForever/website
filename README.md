This Repository is for the Official FAForever Website on https://www.faforever.com

# Setting up local version

## Prerequisites
Latest version of Node.js [LTS](https://nodejs.org/en/download/)

[Webstorm](https://www.jetbrains.com/webstorm/) Or [Visual Studio](https://visualstudio.microsoft.com/downloads/) 

Webstorm Dose require a Licence to use!

Visual Studio Community editon work for this.


## Setup of Live-Preview With JetBrains Webstorm





## Setup of Live-Preview With Visual Studio




## Setup of live website on Linux

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

## Adding stylesheets and javascripts
Since we are using grunt to handle all tasks, files must be registered in the correct grunt configurations. 
You can register a new stylesheet by going to grunt/sass.js. You will need to add the sass file underneath each category. 
The purpose behind each one is for dev and prod. In prod, it will minify the CSS, whereas DEV does not.

The same goes for Javascript. Any javascript needed will need to be registered under grunt/concat.js. This script 
puts all Javascript in one file, and will minify it in PROD. 

