


exports.showSignup = function(req,res,next) {
  res.render('account/register', {formData: {}, errors: {}});
};
