const PushNotification = require("../models").PushNotification;
const User = require("../models").User;
const UserDeviceToken = require("../models").UserDeviceToken;
const Shop = require("../models").Shop;
const ConsumerShopPoints = require("../models").ConsumerShopPoints;
const ConsumerShop = require("../models").ConsumerShop;

const sequelize = require("../models").sequelize;
var Sequelize = require("sequelize");
const Op = Sequelize.Op;

const moment = require('moment');
var bcrypt = require('bcryptjs');
var _ = require('underscore');

module.exports.list = function (req, callback) {

   var offset = req.offset;
   var limit = req.query.limit;

   var sortBy = req.query.sortBy ? req.query.sortBy : "id";
   req.query.sortBy = sortBy;
   var sortOrder = req.query.sortOrder ? req.query.sortOrder : "DESC";
   req.query.sortOrder = sortOrder;

   var where = {};

   if (req.query.status) {
      where.status = req.query.status;
   }
   if (req.query.sentstatus) {
      where.sentStatus = req.query.sentstatus;
   }

   if (req.query.search) {
      where[Op.or] = [
         { title: { [Op.substring]: req.query.search } },
      ];
   }

   var defalutOptions = {
      // subQuery: false,
      offset: offset,
      limit: limit,
      where: where,
      order: [[sortBy, sortOrder]],
      include: [
         { model: User },
         { model: Shop },
      ],
      distinct: true,
   };

   PushNotification.findAndCountAll(defalutOptions).then(arrPushNotification => {
      responseData = {
         code: 200,
         data: { count: arrPushNotification.count, rows: arrPushNotification.rows }
      };
      return callback(req, responseData)
   });
}

module.exports.edit = function (req, callback) {
   const pushnotificationsId = parseInt(req.params.pushnotificationsId);
   PushNotification.findOne({
      where: {
         id: pushnotificationsId
      },
      plain: true,
      distinct: true,
      include: [
         { model: Shop },
         { model: User }
      ],
   }).then(async pushnotification => {
      if (pushnotification == null) {
         responseData = {
            code: 400,
            data: null
         };
      }
      else {
         var pushnotificationclone = pushnotification;

         responseData = {
            code: 200,
            data: pushnotificationclone
         };
      }
      return callback(req, responseData)
   })
      .catch(err => {
         console.log(err);
         responseData = {
            code: 400,
            msg: "Error! PushNotification.findOne"
         };
         return callback(req, responseData)
      });
};

module.exports.editdata = function (req, callback) {
   const id = parseInt(req.body.id);
   const postdata = req.body;

   postdata.datewithtime = postdata.date + " " + postdata.time;
   delete postdata.date;
   delete postdata.time;

   var where = { id: id };

   PushNotification.findOne({
      where: where
   }).then(pushnotification => {
      if (!pushnotification) {
         responseData = {
            code: 400,
            msg: "Error! Push notification not found",
         };
         return callback(req, responseData)
      }

      pushnotification
         .update(postdata)
         .then(result => {
            responseData = {
               code: 200,
               msg: "Push notification updated successfully",
            };
            return callback(req, responseData)
         })
         .catch(err => {
            console.log(err);
            responseData = {
               code: 400,
               msg: "Error! PushNotification.findOne",
            };
            return callback(req, responseData)
         });
   });
};

module.exports.addnew = function (req, callback) {
   var postdata = req.body;

   var shopIdArray = postdata.shopIdArray;
   delete postdata.shopIdArray;
   var userIdArray = postdata.userIdArray;
   delete postdata.userIdArray;

   postdata.datewithtime = postdata.date + " " + postdata.time;
   delete postdata.date;
   delete postdata.time;

   var arrayOfData = [];

   if (postdata.type == 1) {
      var shopIdArrayNew = shopIdArray.split(",");
      for (index = 0; index < shopIdArrayNew.length; index++) {
         var tmpobj = Object.assign({}, postdata);
         tmpobj.shopId = shopIdArrayNew[index];
         arrayOfData.push(tmpobj);
      }
   }
   else if (postdata.type == 2) {
      var userIdArrayNew = userIdArray.split(",");
      for (index = 0; index < userIdArrayNew.length; index++) {
         var tmpobj = Object.assign({}, postdata);
         tmpobj.userId = userIdArrayNew[index];
         arrayOfData.push(tmpobj);
      }
   }

   PushNotification.bulkCreate(arrayOfData)
      .then(pushnotification => {
         responseData = {
            code: 200,
            msg: "Push notifications created successfully!"
         };
         return callback(req, responseData)
      })
      .catch(err => {
         responseData = {
            code: 401,
            msg: "Error! PushNotification.bulkCreate"
         };
         return callback(req, responseData)
      });
};

module.exports.vendorSelection = function (req, callback) {
   var sortBy = req.query.sortBy ? req.query.sortBy : "shopName";
   var sortOrder = req.query.sortOrder ? req.query.sortOrder : "ASC";

   var where = {};

   if (req.query.shopName) {
      where.shopName = { [Op.substring]: req.query.shopName };
   }
   if (req.query.categoryText) {
      where.categoryText = req.query.categoryText;
   }

   var defalutOptions = {
      where: where,
      order: [[sortBy, sortOrder]],
      distinct: true,
      attributes: [
         "shopId", "shopName", "categoryText"
      ],
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

module.exports.userSelection = function (req, callback) {
   var sortBy = req.query.sortBy ? req.query.sortBy : "shopName";
   var sortOrder = req.query.sortOrder ? req.query.sortOrder : "ASC";

   var where = {};

   if (req.query.shopName) {
      where.shopName = { [Op.substring]: req.query.shopName };
   }
   if (req.query.categoryText) {
      where.categoryText = req.query.categoryText;
   }

   var defalutOptions = {
      subQuery: false,
      where: where,
      order: [[sortBy, sortOrder]],
      include: [{
         model: User,
         required: true,

         include: [{
            model: UserDeviceToken,
            attributes: ['id', 'userId', 'deviceType', 'deviceToken'],
            raw: true,
            required: true
         }]
      }],
      distinct: true,
      attributes: [
         "shopId", "shopName", "categoryText",
         [sequelize.literal('(SELECT COUNT(consumer_shops.userId) FROM consumer_shops WHERE consumer_shops.shopId = Shop.shopId)'), 'shopTotalUsers'],
         [sequelize.literal('(SELECT COUNT(cs.userId) FROM consumer_shops as cs LEFT OUTER JOIN users AS us ON us.userId = cs.userId WHERE us.status = 1 and cs.shopId = Shop.shopId)'), 'shopTotalActiveUsers'],
         [sequelize.literal('(SELECT MAX(consumer_shop_points.points) FROM consumer_shop_points WHERE consumer_shop_points.shopId = Shop.shopId)'), 'userMaxPoint']
      ],
   };

   Shop.findAll(defalutOptions).then(arrUser => {
      return callback(req, arrUser)
   });
};

module.exports.userSelectionFilter = function (req, callback) {
   var sortBy = req.query.sortBy ? req.query.sortBy : "firstName";
   var sortByTwo = "lastName";
   var sortOrder = req.query.sortOrder ? req.query.sortOrder : "ASC";

   var where = {};

   if (req.query.vpogender) {
      where.gender = { [Op.in]: req.query.vpogender };
   }
   if (req.query.vpoaccountact) {
      where.status = { [Op.in]: req.query.vpoaccountact };
   }

   if (req.query.vposearchuser) {
      where[Op.or] = [
         { email: { [Op.substring]: req.query.vposearchuser } },
         { firstName: { [Op.substring]: req.query.vposearchuser } },
         { lastName: { [Op.substring]: req.query.vposearchuser } },
         { username: { [Op.substring]: req.query.vposearchuser } },
         { phone: { [Op.substring]: req.query.vposearchuser } },
      ];
   }

   var wherecsp = { shopId: { [Op.in]: req.query.vopshopsids } }

   if (!req.query.vpotpstart) {
      var wheretp = {}
   }
   else if (req.query.vpotpstart == 0) {
      var wheretp = {
         [Op.or]: [
            { '$totalPoints$': { [Op.lte]: req.query.vpotpend } },
            { '$totalPoints$': { [Op.is]: null } }
         ]
      }
   }
   else {
      var wheretp = { '$totalPoints$': { [Op.between]: [req.query.vpotpstart, req.query.vpotpend] } }
   }

   var defalutOptions = {
      subQuery: false,
      where: where,
      order: [[sortBy, sortOrder], [sortByTwo, sortOrder]],
      include: [
         {
            model: ConsumerShopPoints
         },
         {
            model: ConsumerShop,
            where: wherecsp
         },
      ],
      distinct: true,
      attributes: [
         "userId", "firstName", "lastName", "email", "countryCode", "phone", "gender", "status",
         [sequelize.literal('(SELECT MAX(consumer_shop_points.points) FROM consumer_shop_points WHERE consumer_shop_points.userId = User.userId AND `consumer_shop_points`.`shopId` IN (' + req.query.vopshopsids + ') )'), 'totalPoints']
      ],
      having: wheretp
   };

   User.findAll(defalutOptions).then(arrUser => {
      return callback(req, arrUser)
   });
};

module.exports.multipleStatuses = async function (req, callback) {
   var selectednotifications = req.body.selectednotifications;
   var selectedtitles = req.body.selectedtitles;
   var selecteddates = req.body.selecteddates;
   var selectedtimes = req.body.selectedtimes;
   var selectedtypes = req.body.selectedtypes;
   var status = req.body.status;

   var arrayOfData = [];
   for (index = 0; index < selectednotifications.length; index++) {
      var tmpobj = {
         id: selectednotifications[index],
         title: selectedtitles[index],
         date: selecteddates[index],
         time: selectedtimes[index],
         type: selectedtypes[index],
         status: status
      };
      arrayOfData.push(tmpobj);
   }

   PushNotification.bulkCreate(arrayOfData, { updateOnDuplicate: ['id', 'title', 'date', 'time', 'type', 'status'], fields: ['id', 'title', 'date', 'time', 'type', 'status'] })
      .then(pushnotification => {
         responseData = {
            code: 200,
            data: "Push notifications status changed successfully!"
         };
         return callback(req, responseData)
      })
      .catch(err => {
         console.log(err);
         responseData = {
            code: 401,
            data: "Error! Not able to update push notifications status."
         };
         return callback(req, responseData)
      });
};