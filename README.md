# website
New FAForever main website to replace http://faforever.com

Requires Node AND Grunt

1. Update .env and set to development or production
2. npm install
3. gem install compass
4. grunt sass:dev
5. grunt serve (production) grunt serve:dev (development)

In order to install grunt for the command line, please follow this guide - http://gruntjs.com/getting-started

Default admin:
* user: admin@faforever.com
* password: admin

## Adding stylesheets and javascripts
Since we are using grunt to handle all tasks, files must be registered in the correct grunt configurations. 
You can register a new stylesheet by going to grunt/sass.js. You will need to add the sass file underneath each category. 
The purpose behind each one is for dev and prod. In prod, it will minify the CSS, whereas DEV does not.

The same goes for Javascript. Any javascript needed will need to be registered under grunt/concat.js. This script 
puts all Javascript in one file, and will minify it in PROD. 