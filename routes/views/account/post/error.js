const {validationResult} = require('express-validator');

module.exports = {
  parseApiErrors: function (body, flash) {
    let errorMessages = [];

    try {
      let response = JSON.parse(body);
      response.errors.forEach(error => errorMessages.push({msg: error.detail}))
    } catch (e) {
      errorMessages.push({msg: 'An unknown error occurred. Please try again later or ask the support.'});
      console.log("Error on parsing server response: " + body);
    }

    if (errorMessages.length === 0) {
      errorMessages.push({msg: 'An unknown error occurred. Please try again later or ask the support.'});
    }

    flash.class = 'alert-danger';
    flash.messages = errorMessages;
    flash.type = 'Error!';
  },
    errorChecking: (req, res, path) => {
        let flash = {}
        let errorArray = [];
        //We are putting a space in our forEach so that the errors comma don't stick to the next error.
        validationResult(req).errors.forEach(error => errorArray.push(` ${error.msg}`));
        flash.class = 'alert-danger';
        flash.messages = errorArray;
        flash.type = 'Error!';
        res.render(path, {flash: flash});
    },
    userUpdate: (req, res, path) => {
        axios.get(`${process.env.API_URL}/me`, {
            headers: {
                'Authorization': `Bearer ${req.user.token}`,
            }
        }).then(response => {
            let user = response.data;
            user.token = req.user.token;
            user.data.id = user.data.attributes.userId;
            req.logIn(user, function (err) {
                if (err) console.error(err);
                res.redirect(path);
            });
        }).catch(e => {
            console.log('error updating user')
        });
    }
}
