const User = require("../models").User;
const UserDeviceToken = require("../models").UserDeviceToken;
const ShopMembershipTier = require("../models").ShopMembershipTier;
const ConsumerShop = require("../models").ConsumerShop;
const ConsumerShopPoints = require("../models").ConsumerShopPoints;
const Shop = require("../models").Shop;
const VendorShop = require("../models").VendorShop;
const ShopDocument = require("../models").ShopDocument;
const ConsumerTransaction = require("../models").ConsumerTransaction;
const Service = require("../models").Service;

const sequelize = require("../models").sequelize;
var Sequelize = require("sequelize");
const Op = Sequelize.Op;

const moment = require('moment');
var bcrypt = require('bcryptjs');
var _ = require('underscore');
var QRCode = require('qrcode');

module.exports.list = function (req, callback) {

   var offset = req.offset;
   var limit = req.query.limit;

   var sortBy = req.query.sortBy ? req.query.sortBy : "createdAt";
   req.query.sortBy = sortBy;
   var sortOrder = req.query.sortOrder ? req.query.sortOrder : "DESC";
   req.query.sortOrder = sortOrder;

   var where = {};

   if (req.query.status) {
      where.status = req.query.status;
   }

   if (req.query.search) {
      where[Op.or] = [
         { shopName: { [Op.substring]: req.query.search } },
         { shopPhoneNo: { [Op.substring]: req.query.search } },
         { agentPhoneNo: { [Op.substring]: req.query.search } },
         { agentName: { [Op.substring]: req.query.search } },
         { agentEmail: { [Op.substring]: req.query.search } },
      ];
   }

   var defalutOptions = {
      offset: offset,
      limit: limit,
      where: where,
      order: [[sortBy, sortOrder]],
      include: [
         {
            model: User,
         },
      ],
      distinct: true,
      attributes: [
         "shopId", "shopName", "shopImageLink", "createdAt", "expiryDate",
         [sequelize.literal('(SELECT SUM(consumer_shop_points.points) FROM consumer_shop_points WHERE consumer_shop_points.shopId = Shop.shopId)'), 'shopTotalPoints'],
         [sequelize.literal('(SELECT COUNT(consumer_shops.userId) FROM consumer_shops WHERE consumer_shops.shopId = Shop.shopId)'), 'shopTotalUsers'],
         [sequelize.literal('(SELECT COUNT(cs.userId) FROM consumer_shops as cs LEFT OUTER JOIN users AS us ON us.userId = cs.userId WHERE us.status = 1 and cs.shopId = Shop.shopId)'), 'shopTotalActiveUsers'],
      ]
   };

   if (sortBy == "shopTotalPoints") {
      defalutOptions.order = [[sequelize.literal('shopTotalPoints'), sortOrder]];
   }
   else if (sortBy == "shopTotalUsers") {
      defalutOptions.order = [[sequelize.literal('shopTotalUsers'), sortOrder]];
   }

   Shop.findAndCountAll(defalutOptions).then(arrUser => {
      responseData = {
         code: 200,
         data: { count: arrUser.count, rows: arrUser.rows }
      };
      return callback(req, responseData)
   });
};

module.exports.edit = function (req, callback) {
   const shopId = parseInt(req.params.shopId);
   Shop.findOne({
      where: {
         shopId: shopId
      },
      plain: true,
      distinct: true,
      include: [
         {
            model: User
         },
         {
            model: VendorShop,
            include: [
               {
                  model: User
               }
            ]
         },
         {
            model: ShopDocument
         },
         {
            model: Service
         },
      ],
   }).then(async user => {
      if (user == null) {
         responseData = {
            code: 400,
            data: null
         };
      }
      else {
         var userclone = user;

         var tier = await Shop.findOne({
            where: {
               shopId: shopId
            },
            plain: true,
            distinct: true,
            attributes: ['shopId', 'shopName', 'userId'],
            include: [
               {
                  model: ShopMembershipTier,
               }],
         }).catch(err => console.log(err));

         var consumerT = await Shop.findOne({
            where: {
               shopId: shopId
            },
            plain: true,
            distinct: true,
            attributes: ['shopId', 'shopName', 'userId'],
            include: [
               {
                  model: ShopMembershipTier,
               },
               {
                  model: ConsumerTransaction,
                  require: false,
                  include: [
                     {
                        model: User,
                     }
                  ]
               }],
         }).catch(err => console.log(err));

         if (consumerT) {
            if (consumerT.ConsumerTransactions) {
               consumerT.ConsumerTransactions.map(async item => {
                  var sID = JSON.parse(item.services);
                  var arr = [];
                  for (let i = 0; i < sID.length; i++) {
                     for (let j = 0; j < userclone.Services.length; j++) {
                        if (sID[i] == userclone.Services[j].serviceId) {
                           var obj = {
                              serviceName: userclone.Services[j].serviceName
                           }
                           arr.push(obj);
                        }
                     }
                     item['serviceArray'] = arr;
                  }
               });
            }
            userclone["ConsumerTransactions"] = consumerT.ConsumerTransactions;
            userclone["ShopMembershipTiers"] = consumerT.ShopMembershipTiers;
         } else {
            userclone["ConsumerTransactions"] = [];
            userclone["ShopMembershipTiers"] = [];
         }

         if (tier) {
            userclone["ShopMembershipTiers"] = consumerT.ShopMembershipTiers;
         } else {
            userclone["ShopMembershipTiers"] = [];
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
            msg: "Error! Not able to get Shop."
         };
         return callback(req, responseData)
      });
};

module.exports.QRUrl = function (req, callback) {
   const shopId = parseInt(req.params.shopId);
   Shop.findOne({
      where: {
         shopId: shopId
      },
      attributes: ["qrString"],
   }).then(user => {
      if (user == null) {
         responseData = {
            code: 400,
            data: null
         };
         return callback(req, responseData)
      }
      else {
         QRCode.toDataURL(user.qrString, function (err, url) {
            responseData = {
               code: 200,
               data: url
            };
            return callback(req, responseData)
         });
      }

   })
      .catch(err => {
         console.log(err);
         responseData = {
            code: 400,
            msg: "Error! Shop.findOne",
            data: null
         };
         return callback(req, responseData)
      });
};

module.exports.editdata = function (req, callback) {
   const shopId = parseInt(req.body.shopId);
   const postdata = req.body;

   const redirect = postdata.redirect;
   delete postdata.redirect;

   var where = { shopId: shopId };

   Shop.findOne({
      where: where
   }).then(shopdata => {
      if (!shopdata) {
         responseData = {
            code: 400,
            msg: "Error! Shop not found",
            redirect: redirect
         };
         return callback(req, responseData)
      }

      var userWhere = { userId: shopdata.userId };
      var userPostData = {};
      if (postdata.username) {
         userPostData.username = postdata.username;
         delete postdata.username;
      }
      if (postdata.newPassword) {
         let passwordBc = bcrypt.hashSync(postdata.newPassword, 10);
         userPostData.password = passwordBc;
         delete postdata.newPassword;
         delete postdata.confirmPassword;
      }
      if (postdata.firstName) {
         userPostData.firstName = postdata.firstName;
         delete postdata.firstName;
      }
      if (postdata.email) {
         userPostData.email = postdata.email;
         delete postdata.email;
      }
      if (postdata.phone) {
         userPostData.phone = postdata.phone;
         delete postdata.phone;
      }

      return shopdata
         .update(postdata)
         .then(result => {

            return User.update(userPostData, { where: userWhere })
               .then(user => {
                  responseData = {
                     code: 200,
                     msg: "Shop updated successfully",
                     redirect: redirect
                  };
                  return callback(req, responseData)
               }).catch(err => {
                  console.log(err);
                  responseData = {
                     code: 400,
                     msg: "Error! Not able to update shop user details",
                     redirect: redirect
                  };
                  return callback(req, responseData)
               })

         })
         .catch(err => {
            console.log(err);
            responseData = {
               code: 400,
               msg: "Error! Not able to update shop",
               redirect: redirect
            };
            return callback(req, responseData)
         });
   });
};

module.exports.editStatus = async function (req, callback) {
   var shopId = parseInt(req.params.shopId);
   var status = parseInt(req.params.status);

   var where = { shopId: shopId };

   Shop.findOne({
      where: where
   }).then(shopdata => {
      if (!shopdata) {
         responseData = {
            code: 401,
            data: "Error! Shop not found"
         };
         return callback(req, responseData)
      }

      return sequelize.transaction().then(t => {
         return shopdata.update({ status: status, transaction: t })
            .then(() => {
               return VendorShop.findAll({
                  raw: true,
                  where: { shopId: shopId },
                  attributes: [
                     "userId"
                  ],
               })
                  .then(arrUser => {
                     var userIds = _.pluck(arrUser, 'userId');
                     return User.update({ status: status }, { where: { userId: { [Op.in]: userIds } }, transaction: t })
                        .then(result => {
                           responseData = {
                              code: 200,
                              data: "Shop status changed successfully!"
                           };
                        })
                  })
            })
            .then(function () {
               if (responseData.code == 200) {
                  return t.commit();
               }
               else {
                  return t.rollback();
               }
            })
            .then(function () {
               return callback(req, responseData)
            })
            .catch(function (err) {
               console.log(err);
               responseData = {
                  code: 401,
                  data: err
               };
               return callback(req, responseData)
            });
      })
   });
};

module.exports.updateStatus = async function (req, callback) {
   var tierId = parseInt(req.params.tierId);
   var status = parseInt(req.params.status);

   ShopMembershipTier.update({ status: status }, {
      where: { tierId: tierId }
   })
      .then(result => {
         if (result == 1) {
            responseData = {
               code: 200,
               data: "Tier status changed successfully!"
            };
            return callback(req, responseData)
         }
         else {
            responseData = {
               code: 401,
               data: "Opps! Not able to update tier status."
            };
         }
         return callback(req, responseData);
      })
      .catch(err => {
         responseData = {
            code: 401,
            data: "Error! Not able to update tier status."
         };
         return callback(req, responseData)
      });
};

module.exports.tierEdit = function (req, callback) {
   const tierId = parseInt(req.params.tierId);
   ShopMembershipTier.findOne({
      where: {
         tierId: tierId
      },
      plain: true,
   }).then(result => {
      if (result == null) {
         responseData = {
            code: 400,
            data: null
         };
      }
      else {
         var resultclone = result;

         responseData = {
            code: 200,
            data: resultclone
         };
      }
      return callback(req, responseData)
   })
      .catch(err => {
         console.log(err);
         responseData = {
            code: 400,
            msg: "Error! Not able to get tier."
         };
         return callback(req, responseData)
      });
};

module.exports.tierEditdata = function (req, callback) {
   const tierId = parseInt(req.body.tierId);
   const postdata = req.body;

   const redirect = postdata.redirect;
   delete postdata.redirect;

   var where = { tierId: tierId };

   ShopMembershipTier.findOne({
      where: where
   }).then(result => {
      if (!result) {
         responseData = {
            code: 400,
            msg: "Error! Tier not found",
            redirect: redirect
         };
         return callback(req, responseData)
      }

      result
         .update(postdata)
         .then(result => {
            responseData = {
               code: 200,
               msg: "Tier updated successfully",
               redirect: redirect
            };
            return callback(req, responseData)
         })
         .catch(err => {
            console.log(err);
            responseData = {
               code: 400,
               msg: "Error! Not able to update tier",
               redirect: redirect
            };
            return callback(req, responseData)
         });
   });
};

module.exports.tierAddnew = async function (req, callback) {

   const shopId = parseInt(req.body.shopId);

   var postdata = req.body;
   const redirect = postdata.redirect;
   delete postdata.redirect;

   var where = { shopId: shopId };

   Shop.findOne({ where: where })
      .then(shop => {
         if (shop) {
            ShopMembershipTier.create(postdata)
               .then(tier => {
                  responseData = {
                     code: 200,
                     msg: "Tier added successfully",
                     redirect: redirect
                  };
                  return callback(req, responseData)
               }).catch(err => {
                  console.log(err);
                  responseData = {
                     code: 400,
                     msg: "Error! ShopMembershipTier.create have some error",
                     redirect: redirect
                  };
                  return callback(req, responseData)
               })
         } else {
            responseData = {
               code: 400,
               msg: "Error! Not able to find shop",
               redirect: redirect
            };
            return callback(req, responseData)
         }
      }).catch(err => {
         console.log(err);
         responseData = {
            code: 400,
            msg: "Error! Shop.findOne have some error",
            redirect: redirect
         };
         return callback(req, responseData)
      })
}

module.exports.editVendorLogo = function (req, callback) {

   var multer = require('multer');

   const dest = CONFIG.storePath + "/vendor";
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
   }).array("shopImage");

   upload(req, null, function (err) {

      if (err) {
         console.log(err);
         responseData = {
            code: 400,
            msg: "Error multer! Not able to upload image.",
         };
         return callback(req, responseData)
      }

      var filenameObj = req.files[0];

      const shopId = parseInt(req.body.shopId);

      var postdata = {};
      postdata.shopId = shopId;
      postdata.shopImageLink = CONFIG.filePath + "vendor/" + filenameObj.filename;

      var where = { shopId: shopId };

      Shop.findOne({
         where: where
      }).then(shopdata => {
         if (!shopdata) {
            responseData = {
               code: 400,
               msg: "Error! Shop not found",
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
                  msg: "Error! Shop.findOne",
               };
               return callback(req, responseData)
            });
      });
   });

};

module.exports.addnew = function (req, callback) {

   var postdata = req.body;

   let passwordBc = bcrypt.hashSync(postdata.newPassword, 10);
   // postdata.password = passwordBc;

   delete postdata.newPassword;
   delete postdata.confirmPassword;

   var where = {};
   where[Op.or] = [
      { username: postdata.username },
      { email: postdata.email },
      { phone: postdata.phone },
   ];

   const redirect = postdata.redirect;
   delete postdata.redirect;

   return sequelize.transaction().then(t => {
      var userdata = {
         firstName: postdata.firstName,
         lastName: postdata.lastName,
         email: postdata.email,
         phone: postdata.phone,
         username: postdata.username,
         password: passwordBc,
         status: 1,
         role: 1,
      };
      delete postdata.firstName;
      delete postdata.lastName;
      delete postdata.email;
      delete postdata.phone;
      delete postdata.username;

      return User.findOrCreate({ where: where, defaults: userdata, transaction: t })
         .then(async ([user, created]) => {
            if (created == false) {
               responseData = {
                  code: 400,
                  msg: "Error! User already exists with same username or email or phone",
               };
            }
            else {
               const userresult = user.get({ plain: true })
               const userId = userresult.userId;
               const username = userresult.username;
               var qrString = await bcrypt.hashSync(userId + username + CONFIG.jwt_encryption_admin, 15);
               var expiryDate = postdata.expiryDate + " " + moment().format("HH:mm:ss");

               var shopdata = Object.assign({}, postdata);
               shopdata.userId = userId;
               shopdata.qrString = qrString;
               shopdata.expiryDate = expiryDate;

               return Shop.create(shopdata, { transaction: t })
                  .then(shop => {
                     const shopresult = shop.get({ plain: true })
                     const shopId = shopresult.shopId;

                     var vendorshopdata = {
                        userId: userId,
                        shopId: shopId
                     }
                     return VendorShop.create(vendorshopdata, { transaction: t })
                        .then(vendorshop => {
                           responseData = {
                              code: 200,
                              msg: "Vendor added successfully",
                           };
                        })
                  })
            }
         })
         .then(function () {
            if (responseData.code == 200) {
               return t.commit();
            }
            else {
               return t.rollback();
            }
         })
         .then(function () {
            return callback(req, responseData)
         })
         .catch(function (err) {
            console.log(err);
            // t.rollback();
            responseData = {
               code: 400,
               msg: 'Error! User already exists with same username or email or phone',
            };
            return callback(req, responseData)
         });
   })
};

module.exports.docUploadNew = function (req, callback) {

   var multer = require('multer');

   const dest = CONFIG.storePath + "/vendor";
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
   }).array("file");

   upload(req, null, function (err) {

      if (err) {
         console.log(err);
         responseData = {
            code: 400,
            msg: "Error multer! Not able to upload document.",
         };
         return callback(req, responseData)
      }

      var filenameObj = req.files[0];

      const shopId = parseInt(req.params.shopId);

      var postdata = {
         shopId: shopId,
         name: filenameObj.originalname,
         docUrl: CONFIG.filePath + "vendor/" + filenameObj.filename,
         status: 1,
      };

      ShopDocument.create(postdata)
         .then(shopdocdata => {
            responseData = {
               code: 200,
               msg: "Document uploaded successfully",
               shopdocdata: shopdocdata
            };
            return callback(req, responseData)
         })
         .catch(err => {
            console.log(err);
            responseData = {
               code: 400,
               msg: "Error! ShopDocument.create",
            };
            return callback(req, responseData)
         });
   });

};

module.exports.docDelete = async function (req, callback) {

   const shopId = req.params.shopId;
   const docId = req.params.docId;

   var where = { shopId: shopId, docId: docId };

   ShopDocument.destroy({ where: where })
      .then(() => {
         responseData = {
            code: 200,
            msg: "Document deleted successfully",
         };
         return callback(req, responseData)
      }).catch(err => {
         console.log(err);
         responseData = {
            code: 400,
            msg: "Error! ShopDocument.destroy",
         };
         return callback(req, responseData)
      })
};

module.exports.getCategories = async function (req, callback) {
   var sortBy = req.query.sortBy ? req.query.sortBy : "categoryText";
   var sortOrder = req.query.sortOrder ? req.query.sortOrder : "ASC";

   var where = {};

   var defalutOptions = {
      where: where,
      order: [[sortBy, sortOrder]],
      distinct: true,
      attributes: [
         "categoryText"
      ],
      // group: [
      //    "categoryText"
      // ],
      include: [{
         model: User,
         required: true,
         attributes: ['userId'],
         include: [{
            model: UserDeviceToken,
            attributes: ['id', 'userId', 'deviceType', 'deviceToken'],
            raw: true,
            required: true
         }]
      }]
   };

   Shop.findAll(defalutOptions).then(arrUser => {
      return callback(req, arrUser)
   });
};

module.exports.getShopById = function (req, callback) {
   const shopId = parseInt(req.params.shopId);
   Shop.findOne({
      where: {
         shopId: shopId
      },
      plain: true,
      distinct: true,
   }).then(shop => {
      if (shop == null) {
         responseData = {
            code: 400,
            data: null
         };
      }
      else {
         var shopclone = shop;

         responseData = {
            code: 200,
            data: shopclone
         };
      }
      return callback(req, responseData)
   })
      .catch(err => {
         console.log(err);
         responseData = {
            code: 400,
            msg: "Error! Not able to get Shop."
         };
         return callback(req, responseData)
      });
};