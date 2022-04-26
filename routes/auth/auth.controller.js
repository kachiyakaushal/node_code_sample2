var bcrypt = require('bcryptjs');

const User = require('../../models').User;

var Sequelize = require("sequelize");
const Op = Sequelize.Op;

/**
 * SignIn
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
module.exports.login = function (req, res, next) {
  req.checkBody({
    'email': {
      notEmpty: true,
      isEmail: true,
      errorMessage: 'email is required'
    },
    'password': {
      notEmpty: true,
      errorMessage: 'Password is required',
    }
  });

  var errors = req.validationErrors();

  if (errors) {
    console.log(errors['message']);
     
    req.flash('error', errors['message']);
    return res.redirect('/auth');
  }

  User.findOne({
    where: {
      email: req.body.email,
      role: {[Op.in]: [0, 4]}
    }
  }).then(user => { 
    if (!user) {
      req.flash('error', 'Admin user not found');
      return res.redirect('/auth');
    }

    if (user.status != 1) {
      //return sendError(res, null, 'User is disabled. Kindly contact administrator.');
      req.flash('error', 'Admin user is disabled. Kindly contact administrator.');
      return res.redirect('/auth');
    }

    bcrypt
      .compare(req.body.password, user.password)
      .then(function (result) {        
        if (result == false) {
          req.flash('error', 'Wrong password');
          return res.redirect('/auth');
        }
        
        req.session.sessionexipretime = CONFIG.jwt_expiration;
        req.session.user = user;
        return res.redirect('/dashboard');
      })
      .catch(err => {
        console.log(err);
        req.flash('error', err);
        return res.redirect('/auth');
      });
  });
}
