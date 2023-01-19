const {body, validationResult} = require('express-validator');
let flash = {};

function validateResults(errors) {
  if (!errors.isEmpty()) {
    let errorArray = [];
    //We are putting a space in our forEach so that the errors comma don't stick to the next error.
    errors.errors.forEach(error => errorArray.push(` ${error.msg}`));
    flash.class = 'alert-danger';
    flash.messages = errorArray;
    flash.type = 'Error!';

  }
}

const checkNewPassword = [
  body('old_password', 'Old Password is required').notEmpty(),
  body('password', 'New password must be six or more characters').isLength({min: 6}),
  body('password', '').custom((value, {req}) => {
    if (value !== req.body.password_confirm) {
      // throw error if passwords do not match
      throw new Error(`New passwords don't match`);
    } else {
      return value;
    }
  }),
  (req, res, next) => {
    if (!validationResult(req).isEmpty()) {
      validateResults(validationResult(req));
      res.locals.page = req.path.slice(9);
      res.render('account/settings', {flash: flash});
    } else next();
  },
];
exports.checkNewPassword = checkNewPassword;
