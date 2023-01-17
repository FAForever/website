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
  }
};
