const User = require("../models").User;

const sequelize = require("../models").sequelize;
var Sequelize = require("sequelize");
const Op = Sequelize.Op;

const moment = require('moment');
var bcrypt = require('bcryptjs');

module.exports.edit = function (req, callback){    
	const userId = parseInt(req.session.user.userId);
   User.findOne({
      where: {
         userId: userId
      },
      plain: true,
      distinct: true,
   }).then(user => {
      if (user == null) {
         responseData = {
            code: 400,
            data: null
         };
      }
      else {
         var userclone = user;

         responseData = {
            code: 200,
            data: userclone
         };
      }
      return callback(req, responseData)
   })
   .catch(err => {
      console.log(err);
      responseData = {
         code: 400,
         msg: "Error! Not able to get user profile"
      };
      return callback(req, responseData)
   });
};

module.exports.editdata = function (req, callback) {   
   const userId = parseInt(req.body.userId);
   const postdata = req.body;

   const redirect = postdata.redirect;
   delete postdata.redirect;

   var where = {
      [Op.or]: [{username: postdata.username}, {email: postdata.email}],      
      userId: {
         [Op.ne]: userId
      }
   };

   User.findOne({
      where: where
   }).then(user => {
      if(user == null){
         User
         .update(postdata, { where: { userId: userId } })
         .then(result => {
            responseData = {
               code: 200,
               msg: "User profile updated successfully",
               redirect: redirect
            };
            return callback(req, responseData)
         })
         .catch(err => {
            console.log(err);
            responseData = {
               code: 400,
               msg: "Error! Not able to update user profile",
               redirect: redirect
            };
            return callback(req, responseData)
         });
      }
      else{
         responseData = {
            code: 400,
            msg: "Error! User already exists with same username or email",
            redirect: redirect
         };
         return callback(req, responseData)
      }
   });      
};

module.exports.changePassword = function (req, callback) {   
   const userId = parseInt(req.body.userId);
   const postdata = req.body;

   const redirect = postdata.redirect;
   delete postdata.redirect;

   var where = { userId: userId };

   User.findOne({
      where: where
   }).then(async user => {
      if(user != null){
         var password = postdata.password;

         const match = await bcrypt.compare(password, user.password);
         if(match){
            let passwordBc = bcrypt.hashSync(postdata.newPassword, 10);
            postdata.password = passwordBc;
            
            user
            .update({ password: passwordBc })
            .then(result => {
               responseData = {
                  code: 200,
                  msg: "User password updated successfully",
                  redirect: redirect
               };
               return callback(req, responseData)
            })
            .catch(err => {
               console.log(err);
               responseData = {
                  code: 400,
                  msg: "Error! Not able to update user password",
                  redirect: redirect
               };
               return callback(req, responseData)
            });
         }
         else{
            responseData = {
               code: 400,
               msg: "Error! Old password is incorrrect",
               redirect: redirect
            };
            return callback(req, responseData)
         }
      }
      else{
         responseData = {
            code: 400,
            msg: "Error! Not able to get user profile",
            redirect: redirect
         };
         return callback(req, responseData)
      }
   });      
};