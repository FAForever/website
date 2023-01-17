const {Router} = require('express');
const router = Router();
const {body} = require('express-validator');

const checkNewPassword = [
  body('old_password', 'Old Password is required').notEmpty(),
  body('password', 'New password must be six or more characters').isLength({min: 6}),
  body('password', '').custom((value,{req}) => {
    if (value !== req.body.password_confirm) {
      // throw error if passwords do not match
      throw new Error(`New passwords don't match`);
    } else {
      return value;
    }
  }),
  (req, res, next) => {
    next();
  },
];
const accountRoutePath = './views/account';
let previousURL = '/';

function loggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.username = req.user.data.attributes.userName;
    next();
  } else {
    previousURL = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    res.redirect('/login');
  }
}

router.post(`/account/changePassword`,  checkNewPassword, loggedIn, require(`${accountRoutePath}/post/changePassword`));


module.exports = router;
