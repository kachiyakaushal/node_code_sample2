const Promotion = require("../models").Promotion;
const ShopMembershipTier = require("../models").ShopMembershipTier;
const Shop = require("../models").Shop;
const User = require("../models").User;

var notificationEvents = require("../events/notificationEvents").notificationEmitter;

const sequelize = require("../models").sequelize;
var Sequelize = require("sequelize");
const Op = Sequelize.Op;

const moment = require('moment');
var bcrypt = require('bcryptjs');

module.exports.list = function (req, callback) {

   var offset = req.offset;
   var limit = req.query.limit;

   var sortBy = req.query.sortBy ? req.query.sortBy : "promotionId";
   req.query.sortBy = sortBy;
   var sortOrder = req.query.sortOrder ? req.query.sortOrder : "DESC";
   req.query.sortOrder = sortOrder;

   var where = {};

   if (req.query.status) {
      where.status = req.query.status;
   }

   if (req.query.search) {
      where[Op.or] = [
         { title: { [Op.substring]: req.query.search } },
      ];
   }

   var defalutOptions = {
      offset: offset,
      limit: limit,
      where: where,
      order: [[sortBy, sortOrder]],
      include: [
         {
            model: Shop
         },
         {
            model: User
         }
      ],
      distinct: true,
   };

   if (sortBy == "shopName") {
      defalutOptions.order = [[ShopMembershipTier, Shop, sortBy, sortOrder]];
   }

   Promotion.findAndCountAll(defalutOptions).then(arrPromotion => {
      responseData = {
         code: 200,
         data: { count: arrPromotion.count, rows: arrPromotion.rows }
      };
      return callback(req, responseData)
   });
}

module.exports.adminList = function (req, callback) {

   var offset = req.offset;
   var limit = req.query.limit;

   var sortBy = req.query.sortBy ? req.query.sortBy : "sequence";
   req.query.sortBy = sortBy;
   var sortOrder = req.query.sortOrder ? req.query.sortOrder : "ASC";
   req.query.sortOrder = sortOrder;

   var where = { isShopPromo: 0 };

   if (req.query.status) {
      where.status = req.query.status;
   }

   if (req.query.search) {
      where[Op.or] = [
         { title: { [Op.substring]: req.query.search } },
      ];
   }

   var defalutOptions = {
      offset: offset,
      limit: limit,
      where: where,
      order: [[sortBy, sortOrder]],
      include: [
         {
            model: ShopMembershipTier,
            include: [
               {
                  model: Shop
               },
            ]
         },
         {
            model: User
         }
      ],
      distinct: true,
   };

   if (sortBy == "shopName") {
      defalutOptions.order = [[ShopMembershipTier, Shop, sortBy, sortOrder]];
   }

   Promotion.findAndCountAll(defalutOptions).then(arrPromotion => {
      responseData = {
         code: 200,
         data: { count: arrPromotion.count, rows: arrPromotion.rows }
      };
      return callback(req, responseData)
   });
}

module.exports.vendorList = function (req, callback) {

   var offset = req.offset;
   var limit = req.query.limit;

   var sortBy = req.query.sortBy ? req.query.sortBy : "shopId";
   req.query.sortBy = sortBy;
   var sortOrder = req.query.sortOrder ? req.query.sortOrder : "DESC";
   req.query.sortOrder = sortOrder;

   var where = {};

   if (req.query.status) {
      where.status = req.query.status;
   }

   if (req.query.search) {
      where[Op.or] = [
         { title: { [Op.substring]: req.query.search } },
      ];
   }

   var defalutOptions = {
      offset: offset,
      limit: limit,
      where: where,
      order: [[sortBy, sortOrder]],
      include: [
         {
            model: Promotion,
         }
      ],
      distinct: true,
      attributes: [
         "shopId", "shopName",
         [sequelize.literal('(SELECT COUNT(promotions.status) FROM promotions WHERE promotions.status IN (1,4) and promotions.deletedAt IS NULL and Shop.shopId = promotions.shopId)'), 'runningPromotions'],
         [sequelize.literal('(SELECT COUNT(promotions.status) FROM promotions WHERE promotions.status = 0 and promotions.deletedAt IS NULL and Shop.shopId = promotions.shopId)'), 'requestedPromotions'],
         [sequelize.literal('(SELECT COUNT(promotions.status) FROM promotions WHERE promotions.status = 2 and promotions.deletedAt IS NULL and Shop.shopId = promotions.shopId)'), 'rejectedPromotions'],
      ]
   };

   if (sortBy == "runningPromotions") {
      defalutOptions.order = [[sequelize.literal('runningPromotions'), sortOrder], ["shopId", "DESC"]];
   }
   else if (sortBy == "requestedPromotions") {
      defalutOptions.order = [[sequelize.literal('requestedPromotions'), sortOrder], ["shopId", "DESC"]];
   }
   else if (sortBy == "rejectedPromotions") {
      defalutOptions.order = [[sequelize.literal('rejectedPromotions'), sortOrder], ["shopId", "DESC"]];
   }

   Shop.findAndCountAll(defalutOptions).then(arrPromotion => {
      responseData = {
         code: 200,
         data: { count: arrPromotion.count, rows: arrPromotion.rows }
      };
      return callback(req, responseData)
   });
}

module.exports.edit = function (req, callback) {
   const promotionId = parseInt(req.params.promotionId);
   Promotion.findOne({
      where: {
         promotionId: promotionId
      },
      plain: true,
      distinct: true,
      include: [
         {
            model: ShopMembershipTier,
            include: [
               {
                  model: Shop
               },
            ]
         },
         {
            model: User
         }
      ],
   }).then(async promotion => {
      if (promotion == null) {
         responseData = {
            code: 400,
            data: null
         };
      }
      else {
         var promotionclone = promotion;
         promotionclone.ShopMembershipTierNew = null;
         if (promotionclone.shopId) {
            var shopMembershipTierNewV = await ShopMembershipTier.findAll({ where: { shopId: promotionclone.shopId } });
            promotionclone.ShopMembershipTierNew = shopMembershipTierNewV;
         }

         responseData = {
            code: 200,
            data: promotionclone
         };
      }
      return callback(req, responseData)
   })
      .catch(err => {
         console.log(err);
         responseData = {
            code: 400,
            msg: "Error! Not able to get Promotion."
         };
         return callback(req, responseData)
      });
};

module.exports.editdata = function (req, callback) {
   const promotionId = parseInt(req.body.promotionId);
   const postdata = req.body;

   const redirect = postdata.redirect;
   delete postdata.redirect;

   var where = { promotionId: promotionId };

   Promotion.findOne({
      where: where
   }).then(promotion => {
      if (!promotion) {
         responseData = {
            code: 400,
            msg: "Error! Promotion not found",
            redirect: redirect
         };
         return callback(req, responseData)
      }

      promotion
         .update(postdata)
         .then(result => {
            responseData = {
               code: 200,
               msg: "Promotion updated successfully",
               redirect: redirect
            };
            return callback(req, responseData)
         })
         .catch(err => {
            console.log(err);
            responseData = {
               code: 400,
               msg: "Error! Not able to update promotion",
               redirect: redirect
            };
            return callback(req, responseData)
         });
   });
};

module.exports.updateStatus = async function (req, callback) {
   var promotionId = parseInt(req.params.promotionId);
   var status = parseInt(req.params.status);

   var wherec = { promotionId: promotionId };

   var sendNotification = async function (promotion, shop) {
      var data = {
         fromUserId: req.session.user.userId,
         toUserId: shop.userId,
         shopId: shop.shopId,
         time: new Date(),
         isRead: 0,
         title: "Your promotion approved!",
         body: "Hi! promotion named " + promotion.title + " is approved by admin",
         profileImageLink: shop.shopImageLink ? shop.shopImageLink : null,
         eventImageLink: CONFIG.eventImagePath + "Promotion_Approved.jpg"
      }
      notificationEvents.emit('sendNotification', data);
   };

   // search for attributes
   Promotion.findOne({ where: wherec })
      .then(async promotion => {
         if (status == 1 && promotion.shopId) {
            var shopId = promotion.shopId;
            var activetotalcount = await Promotion.count({ where: { shopId: shopId, status: 1 } });

            var shopData = await Shop.findOne({ where: { shopId: shopId }, attributes: ['mxnRunningPromo', 'shopId', 'userId'] });

            var promoCreditLeft = shopData.mxnRunningPromo - activetotalcount;

            if (promoCreditLeft > 0) {
               promotion
                  .update({ status: status, vendorStatus: status })
                  .then(async result => {
                     var sendNoti = await sendNotification(promotion, shopData)

                     responseData = {
                        code: 200,
                        data: "Promotion status changed successfully!"
                     };
                     return callback(req, responseData)
                  })
                  .catch(err => {
                     console.log(err);
                     responseData = {
                        code: 401,
                        data: "Opps! promotion.update"
                     };
                     return callback(req, responseData)
                  });
            }
            else {
               responseData = {
                  code: 401,
                  data: "Opps! Promotion credit not available."
               };
               return callback(req, responseData)
            }
         }
         else {
            promotion
               .update({ status: status, vendorStatus: status })
               .then(result => {
                  responseData = {
                     code: 200,
                     data: "Promotion status changed successfully!"
                  };
                  return callback(req, responseData)
               })
               .catch(err => {
                  console.log(err);
                  responseData = {
                     code: 401,
                     data: "Opps! promotion.update"
                  };
                  return callback(req, responseData)
               });
         }
      })
      .catch(err => {
         console.log(err);
         responseData = {
            code: 401,
            data: "Error! Promotion.findOne"
         };
         return callback(req, responseData)
      });
};

module.exports.updateOrder = async function (req, callback) {
   var promotionIds = req.body.promotionids;
   var promotionSequence = req.body.promotionsequence;

   var arrayOfData = [];
   for (index = 0; index < promotionIds.length; index++) {
      var tmpobj = {
         promotionId: promotionIds[index],
         sequence: promotionSequence[index]
      };
      arrayOfData.push(tmpobj);
   }
   var promises = [];

   Object.entries(arrayOfData).forEach(async ([keyi, valuei]) => {
      var innerbulkdata = { promotionId: valuei.promotionId, sequence: valuei.sequence };
      var whereEq = { promotionId: valuei.promotionId }

      var newPromise = updateOrCreate(Promotion, whereEq, innerbulkdata);
      promises.push(newPromise);

      return newPromise;
   });

   return Promise.all(promises).then(function (promotion) {
      responseData = {
         code: 200,
         data: "Promotion status changed successfully!"
      };
      return callback(req, responseData);
   }).catch(function (err) {
      responseData = {
         code: 401,
         data: "Error! Not able to update promotion status."
      };
      return callback(req, responseData);
   });
};

module.exports.editPImg = function (req, callback) {

   var multer = require('multer');

   const dest = CONFIG.storePath + "/promotion";
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
   }).array("promotionImage");

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

      const promotionId = parseInt(req.body.promotionId);

      var postdata = {};
      postdata.promotionId = promotionId;
      postdata.promotionImageUrl = CONFIG.filePath + "promotion/" + filenameObj.filename;

      var where = { promotionId: promotionId };

      Promotion.findOne({
         where: where
      }).then(promotiondata => {
         if (!promotiondata) {
            responseData = {
               code: 400,
               msg: "Error! Promotion not found",
            };
            return callback(req, responseData)
         }

         promotiondata
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
                  msg: "Error! Promotion.findOne",
               };
               return callback(req, responseData)
            });
      });
   });

};

module.exports.addnew = async function (req, callback) {

   var postdata = req.body;
   postdata.adminId = req.session.user.userId;

   const redirect = postdata.redirect;
   delete postdata.redirect;

   if (postdata.replacePromo !== undefined) {
      await Promotion.update(
         { status: 4, vendorStatus: 4 },
         { where: { promotionId: postdata.replacePromo } }
      );
   }

   var maxSequence = await Promotion.max('sequence');
   postdata.sequence = maxSequence + 1;

   Promotion.create(postdata)
      .then(promotion => {
         responseData = {
            code: 200,
            msg: "Promotion added successfully",
            redirect: redirect
         };
         return callback(req, responseData)
      }).catch(err => {
         console.log(err);
         responseData = {
            code: 400,
            msg: "Error! Promotion.create have some error",
            redirect: redirect
         };
         return callback(req, responseData)
      })
};

module.exports.addPImg = function (req, callback) {

   var multer = require('multer');

   const dest = CONFIG.storePath + "/promotion";
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
   }).array("promotionImage");

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
      var promotionImageUrl = CONFIG.filePath + "promotion/" + filenameObj.filename;

      responseData = {
         code: 200,
         msg: "Image uploaded successfully",
         promotionImageUrl: promotionImageUrl,
      };
      return callback(req, responseData)
   });

};

module.exports.vendorRunningPromo = function (req, callback) {

   var offset = req.offset;
   var limit = req.query.limit;

   var sortBy = req.query.sortBy ? req.query.sortBy : "sequence";
   req.query.sortBy = sortBy;
   var sortOrder = req.query.sortOrder ? req.query.sortOrder : "ASC";
   req.query.sortOrder = sortOrder;

   var where = { shopId: req.params.shopId, status: { [Op.in]: [1, 4] } };

   var defalutOptions = {
      offset: offset,
      limit: limit,
      where: where,
      order: [[sortBy, sortOrder]],
      include: [
         {
            model: Shop
         }
      ],
      distinct: true,
   };

   Promotion.findAndCountAll(defalutOptions).then(arrPromotion => {
      responseData = {
         code: 200,
         data: { count: arrPromotion.count, rows: arrPromotion.rows }
      };
      return callback(req, responseData)
   });
};

module.exports.vendorRequestedPromo = function (req, callback) {

   var sortBy = req.query.sortBy ? req.query.sortBy : "sequence";
   req.query.sortBy = sortBy;
   var sortOrder = req.query.sortOrder ? req.query.sortOrder : "ASC";
   req.query.sortOrder = sortOrder;

   var where = { shopId: req.params.shopId, status: 0 };

   var defalutOptions = {
      where: where,
      order: [[sortBy, sortOrder]],
      include: [
         {
            model: Shop
         }
      ],
      distinct: true,
   };

   Promotion.findAndCountAll(defalutOptions).then(arrPromotion => {
      responseData = {
         code: 200,
         data: { count: arrPromotion.count, rows: arrPromotion.rows }
      };
      return callback(req, responseData)
   });
};

module.exports.vendorRejectedPromo = function (req, callback) {
   var sortBy = req.query.sortBy ? req.query.sortBy : "sequence";
   req.query.sortBy = sortBy;
   var sortOrder = req.query.sortOrder ? req.query.sortOrder : "ASC";
   req.query.sortOrder = sortOrder;

   var where = { shopId: req.params.shopId, status: 2 };

   var defalutOptions = {
      where: where,
      order: [[sortBy, sortOrder]],
      include: [
         {
            model: Shop
         }
      ],
      distinct: true,
   };

   Promotion.findAndCountAll(defalutOptions).then(arrPromotion => {
      responseData = {
         code: 200,
         data: { count: arrPromotion.count, rows: arrPromotion.rows }
      };
      return callback(req, responseData)
   });
};

module.exports.vendorActivePromo = function (req, callback) {
   var where = { shopId: req.params.shopId, status: 1 };

   var defalutOptions = {
      where: where,
   };

   Promotion.count(defalutOptions)
      .then(arrPromotionCounts => {
         responseData = {
            code: 200,
            data: arrPromotionCounts
         };
         return callback(req, responseData)
      })
      .catch(err => {
         console.log(err);
         responseData = {
            code: 400,
            msg: "Error! Promotion.count"
         };
         return callback(req, responseData)
      });
};

module.exports.replacePromo = async function (req, callback) {
   const shopId = req.params.shopId;
   var activetotalcount = await Promotion.count({ where: { shopId: shopId, status: 1 } });
   var shopData = await Shop.findOne({ where: { shopId: shopId }, attributes: ['mxnRunningPromo'] });

   var promoCreditLeft = shopData.mxnRunningPromo - activetotalcount;

   var activePromotions = null;
   var responseData = {
      code: 200,
      data: activePromotions
   };

   if (promoCreditLeft <= 0) {
      activePromotions = await Promotion.findAll({ where: { shopId: shopId, status: 1 } });
      responseData.data = activePromotions
   };

   return callback(req, responseData)
};