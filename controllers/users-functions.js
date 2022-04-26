const User = require("../models").User;
const ConsumerShop = require("../models").ConsumerShop;
const ConsumerShopPoints = require("../models").ConsumerShopPoints;
const Shop = require("../models").Shop;
const VendorShop = require("../models").VendorShop;
const ConsumerTransaction = require("../models").ConsumerTransaction;
const Service = require("../models").Service;

const sequelize = require("../models").sequelize;
var Sequelize = require("sequelize");
const Op = Sequelize.Op;

const moment = require('moment');
var bcrypt = require('bcryptjs');

module.exports.list = function (req, callback) {

   var offset = req.offset;
   var limit = req.query.limit;

   var sortBy = req.query.sortBy ? req.query.sortBy : "userId";
   req.query.sortBy = sortBy;
   var sortOrder = req.query.sortOrder ? req.query.sortOrder : "DESC";
   req.query.sortOrder = sortOrder;

   var where = {role: 2};

   if (req.query.search) {
      where[Op.or] = [
         { email: { [Op.substring]: req.query.search } },
         { firstName: { [Op.substring]: req.query.search } },
         { lastName: { [Op.substring]: req.query.search } },
         { username: { [Op.substring]: req.query.search } },
         { phone: { [Op.substring]: req.query.search } },
      ];
   }

   var defalutOptions = {
      offset: offset,
      limit: limit,
      where: where,
      order: [[sortBy, sortOrder]],
      include: [
         {model: ConsumerShop, order: sequelize.random(), include: [{model: Shop}]},
         {model: ConsumerShopPoints},
      ],
      distinct: true,
      attributes: [
         "userId", "firstName", "lastName", "email", "countryCode", "phone", "gender", "status", "username", "role", 
         [sequelize.literal('(SELECT SUM(consumer_shop_points.points) FROM consumer_shop_points WHERE consumer_shop_points.userId = User.userId)'), 'totalPoints']
      ]
   };

   if(sortBy == "shopName"){
      defalutOptions.order = [[ConsumerShop, Shop, sortBy, sortOrder]];
   }
   else if(sortBy == "points"){
      defalutOptions.order = [[sequelize.literal('totalPoints'), sortOrder]];
   }

   User.findAndCountAll(defalutOptions).then(arrUser => {
      responseData = {
         code: 200,
         data: { count: arrUser.count, rows: arrUser.rows }
      };
      return callback(req, responseData)
   });
}

module.exports.edit = function (req, callback){
   const userId = parseInt(req.params.userId);
   
   var sortBy = req.query.sortBy ? req.query.sortBy : "consumerId";
   req.query.sortBy = sortBy;
   var sortOrder = req.query.sortOrder ? req.query.sortOrder : "DESC";
   req.query.sortOrder = sortOrder;

   var wherec = {};
   if (req.query.search) {
      wherec[Op.or] = [
         { shopName: { [Op.substring]: req.query.search } },
      ];
   }

   var defalutOptions = {
      where: {
         userId: userId
      },
      plain: true,
      distinct: true,
      include: [
         {
            model: ConsumerShop,
            include: [
               {
                  model: Shop,
                  where: wherec,
                  include: [
                     {
                        required: false,
                        model: ConsumerShopPoints,
                        where: {
                           userId: userId
                        }
                     }
                  ]
               }
            ]
         },
         {model: ConsumerShopPoints},
         {
            model: ConsumerTransaction,
            include: [
               {
                  model: Shop,
                  include: [
                     {
                        model: Service
                     }
                  ]
               }
            ]
         }
      ],
      order: [[ConsumerTransaction, sortBy, sortOrder]],
   }

   if(sortBy == "shopName"){
      defalutOptions.order = [[ConsumerTransaction, Shop, sortBy, sortOrder]];
   }

   User.findOne(defalutOptions)
   .then(user => {
      if (user == null) {
         responseData = {
            code: 400,
            data: null
         };
      }
      else {
         var userclone = user;
         
         userclone.totalpointsearned = 0;

         if(userclone.ConsumerShopPoints){
            var cSP = userclone.ConsumerShopPoints;

            cSP.forEach(function(value, index) {
               userclone.totalpointsearned = userclone.totalpointsearned + value.points;
            });
         }

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
         msg: "Error! Not able to get User."
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
      [Op.or]: [{username: postdata.username}, {email: postdata.email}, {phone: postdata.phone}],      
      userId: {
         [Op.ne]: userId
      }
   };

   User.findOne({
      where: where
   }).then(user => {

      if(user == null){
         var password = postdata.password;
         delete postdata.password;

         if(password && postdata.newPassword){
            let passwordBc = bcrypt.hashSync(postdata.newPassword, 10);
            postdata.password = passwordBc;
         }
         
         delete postdata.newPassword;
         delete postdata.confirmPassword;

         User
         .update(postdata, { where: { userId: userId } })
         .then(result => {
            responseData = {
               code: 200,
               msg: "User updated successfully",
               redirect: redirect
            };
            return callback(req, responseData)
         })
         .catch(err => {
            console.log(err);
            responseData = {
               code: 400,
               msg: "Error! Not able to update user",
               redirect: redirect
            };
            return callback(req, responseData)
         });
      }
      else{
         responseData = {
            code: 400,
            msg: "Error! User already exists with same username or email or phone",
            redirect: redirect
         };
         return callback(req, responseData)
      }
   });      
};

module.exports.addnew = function (req, callback) {

   var postdata = req.body;
   var shopId = null;
   if(postdata.shopId !== undefined){      
      shopId = parseInt(postdata.shopId);
      delete postdata.shopId;      
   }

   let passwordBc = bcrypt.hashSync(postdata.newPassword, 10);
   postdata.password = passwordBc;
   
   delete postdata.newPassword;
   delete postdata.confirmPassword;

   var where = {};
   where[Op.or] = [
      { username: postdata.username },
      { email: postdata.email },
      { phone: postdata.phone },
   ];

   return User
   .findOrCreate({where: where, defaults: postdata})
   .then(([user, created]) => {      
      if(created == true){
         var userclone = user.get({ plain: true });

         if(shopId){
            var postdatavs = {
               userId: userclone.userId,
               shopId: shopId
            }
            
            return VendorShop.create(postdatavs)
            .then(() => {
               responseData = {
                  code: 200,
                  msg: "User added successfully",
               };
               return callback(req, responseData) 
            })
            .catch(err => {
               console.log(err);
               responseData = {
                  code: 400,
                  msg: "Error! VendorShop.create"
               };
               return callback(req, responseData)
            });

         }
         else{
            responseData = {
               code: 200,
               msg: "User added successfully",
            };
            return callback(req, responseData)  
         }
      }
      else{
         responseData = {
            code: 400,
            msg: "Error! User already exists with same username or email or phone",
         };
         return callback(req, responseData)   
      }
   })
   .catch(err => {
      console.log(err);
      responseData = {
         code: 400,
         msg: "Error! User.findOrCreate"
      };
      return callback(req, responseData)
   });
};

module.exports.checkUniqueField = function (req, callback) {
   var fieldName = req.params.fieldName;
   var fieldValue = req.params.fieldValue;

   var data = {};
   data[fieldName] = fieldValue;

   User.findOne({ where: data })
   .then(user => {
      if (user) {
         responseData = {
            code: 400,
            msg: fieldName + " already taken",
         };
         return callback(req, responseData)
      } else {
         responseData = {
            code: 200,
            msg: "Record not found for this " + fieldName,
         };
         return callback(req, responseData)
      }
   })
   .catch((err) => {
      responseData = {
         code: 400,
         msg: "Error! User.findOne",
      };
      return callback(req, responseData)
   });
}

module.exports.editUserLogo = function (req, callback) {

	var multer = require('multer');

	const dest = CONFIG.storePath + "/user";
	const maxSize = 5 * 1024 * 1024;

	var storage = multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, dest);
		},
		filename: (req, file, cb) => {
			cb(
				null,
				generateRandomKey(5) +
				generateRandomKey(5) +
				generateRandomKey(5) +
				"." +
				file.originalname.split(".").pop()
			);
		}
	});

	var upload = multer({
		storage: storage,
		limits: {
			fileSize: maxSize,
			files: 1
		},

		fileFilter: function (req, file, cb) {
			if (
				file.mimetype !== "image/gif" &&
				file.mimetype !== "image/png" &&
				file.mimetype !== "image/jpeg" &&
				file.mimetype !== "image/jpg"
			) {
				return cb(new Error("Only image file are allowed"));
			}
			cb(null, true);
		}
	}).array("profilePicture");

   upload(req, null, function(err) {
		
		if(err) {
         console.log(err);
			responseData = {
            code: 400,
            msg: "Error multer! Not able to upload image.",
         };
         return callback(req, responseData)
		}
		
		var filenameObj = req.files[0];
		
      const userId = parseInt(req.body.userId);
      
      var postdata = {};
      postdata.userId = userId;
      postdata.profilePictureLink = CONFIG.filePath + "user/" + filenameObj.filename;

      var where = {userId: userId};
      
      User.findOne({
         where: where
      }).then(shopdata => {
         if (!shopdata) {
            responseData = {
               code: 400,
               msg: "Error! User not found",
            };
            return callback(req, responseData)
         }     

         shopdata
         .update(postdata)
         .then(result => {
            responseData = {
               code: 200,
               msg: "Image updated successfully",
            };
            return callback(req, responseData)
         })
         .catch(err => {
            console.log(err);
            responseData = {
               code: 400,
               msg: "Error! User.findOne",
            };
            return callback(req, responseData)
         });
      });
  	});
	
};

module.exports.passwordReset = function (req, callback) {
   const userId = parseInt(req.body.userId);
   const postdata = req.body;

   const redirect = postdata.redirect;
   delete postdata.redirect;

   var where = { userId: userId };

   User.findOne({
      where: where
   }).then(user => {
      if (!user) {
         responseData = {
            code: 400,
            msg: "Error! User not found",
            redirect: redirect
         };
         return callback(req, responseData)
      }

      if(postdata.newPassword){
         let passwordBc = bcrypt.hashSync(postdata.newPassword, 10);
         postdata.password = passwordBc;
      }
      
      delete postdata.newPassword;
      delete postdata.confirmPassword;

      User
      .update(postdata, { where: { userId: userId } })
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
      
   });      
};

module.exports.multipleStatuses = async function (req, callback) {   
   var selectedusers = req.body.selectedusers;
   var selectedusernames = req.body.selectedusernames;
   var selectedroles = req.body.selectedroles;
   var status = req.body.status;
   
   var arrayOfData = [];
   for (index = 0; index < selectedusers.length; index++) { 
      var tmpobj = {
         userId: selectedusers[index],
         username: selectedusernames[index],
         role: selectedroles[index],
         status: status
      };
      arrayOfData.push(tmpobj);
   }
   
   User.bulkCreate(arrayOfData, {updateOnDuplicate: ['userId', 'username', 'role', 'status'], fields: ['userId', 'username', 'role', 'status']})
   .then(user => {
      responseData = {
         code: 200,
         data: "Users status changed successfully!"
      };
      return callback(req, responseData)
   })
   .catch(err => {
      console.log(err);
      responseData = {
         code: 401,
         data: "Error! Not able to update users status."
      };
      return callback(req, responseData)
   });
};

module.exports.deleteUser = function (req, callback) {
   const userId = parseInt(req.body.userId);

   var where = {
      userId: userId
   };

   User.findOne({
      where: where
   }).then(user => {
      if (!user) {
         responseData = {
            code: 400,
            msg: "Error! User not found",
         };
         return callback(req, responseData)
      } else {     
         var userData = {
            deletedAt: moment().format("YYYY-MM-DD HH:mm:ss")
          };
         User
         .update(userData, { where: where })
         .then(result => {
            responseData = {
               code: 200,
               msg: "User deleted successfully",
            };
            return callback(req, responseData)
         })
         .catch(err => {
            console.log(err);
            responseData = {
               code: 400,
               msg: "Error! Not able to delete user",
            };
            return callback(req, responseData)
         });
      }
   });      
};