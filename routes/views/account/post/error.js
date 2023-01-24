const {validationResult} = require("express-validator");
module.exports = {
  parseApiErrors: function (body, flash) {
    let errorMessages = [];
    try {
      body.data.errors.forEach(error => errorMessages.push(error.detail));
    } catch (e) {
      errorMessages.push('An unknown error occurred. Please try again later or ask the support.');
      console.log("Error on parsing server response: " + body);
    }
    if (errorMessages.length === 0) {
      errorMessages.push('An unknown error occurred. Please try again later or ask the support.');
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
 }
};

