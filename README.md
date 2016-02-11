# website
New FAForever main website to replace http://faforever.com

Requires Node and Mongodb

1. npm install
2. mongod
3. node keystone

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
