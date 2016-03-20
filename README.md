# website
New FAForever main website to replace http://faforever.com

Requires Node, Mongodb, AND Grunt

1. npm install
2. gem install compass
3. mongod
4. grunt sass:dev 
5. grunt serve

In order to install grunt for the command line, please follow this guide - http://gruntjs.com/getting-started

## important!
You'll need to create the following files manually:

#### challonge_config.js in /routes/
```javascript
module.exports = {
  getAuth: function () {
    return "https://username:api_key@api.challonge.com/v1";
  }
};
```

Default admin:
* user: admin@faforever.com
* password: admin

## Adding stylesheets and javascripts
Since we are using grunt to handle all tasks, files must be registered in the correct grunt configurations. 
You can register a new stylesheet by going to grunt/sass.js. You will need to add the sass file underneath each category. 
The purpose behind each one is for dev and prod. In prod, it will minify the CSS, whereas DEV does not.

The same goes for Javascript. Any javascript needed will need to be registered under grunt/concat.js. This script 
puts all Javascript in one file, and will minify it in PROD. 