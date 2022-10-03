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
  }
}
