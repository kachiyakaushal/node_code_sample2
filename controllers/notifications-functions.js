const User = require("../models").User;
const Notification = require("../models").Notification;

const sequelize = require("../models").sequelize;
var Sequelize = require("sequelize");
const Op = Sequelize.Op;

const moment = require('moment');
var bcrypt = require('bcryptjs');

module.exports.list = function (req, callback) {

   var offset = req.offset;
   var limit = req.query.limit;

   var sortBy = req.query.sortBy ? req.query.sortBy : "notificationId";
   req.query.sortBy = sortBy;
   var sortOrder = req.query.sortOrder ? req.query.sortOrder : "DESC";
   req.query.sortOrder = sortOrder;

   var where = {};

   if (req.query.search) {
      where[Op.or] = [
         { title: { [Op.substring]: req.query.search } },
         { body: { [Op.substring]: req.query.search } },
      ];
   }

   var defalutOptions = {
      offset: offset,
      limit: limit,
      where: where,
      order: [[sortBy, sortOrder]],
      include: [
         { model: User, as: 'fromUser' },
         { model: User, as: 'toUser' },
      ],
      distinct: true,
   };

   Notification.findAndCountAll(defalutOptions).then(arrNotification => {
      responseData = {
         code: 200,
         data: { count: arrNotification.count, rows: arrNotification.rows }
      };
      return callback(req, responseData)
   });
}

module.exports.multipleStatuses = async function (req, callback) {   
   var selectedids = req.body.selectedids;
   var status = req.body.status;
   
   if(status == 1){
      sequelize.query("UPDATE notifications SET isRead = 1 WHERE notificationId IN (" + selectedids + ")")
      .spread(function(results, metadata) {
         responseData = {
            code: 200,
            data: "Notifications marked as read successfully!"
         };
         return callback(req, responseData)
      })
      .catch(err => {
         console.log(err);
         responseData = {
            code: 401,
            data: "Error! Not able to mark as read notifications."
         };
         return callback(req, responseData)
      });
   }
   else if(status == 0){      
      Notification.destroy({ where: { notificationId: { [Op.in]: selectedids } } })
      .then(notification => {
         responseData = {
            code: 200,
            data: "Notifications deleted successfully!"
         };
         return callback(req, responseData)
      })
      .catch(err => {
         console.log(err);
         responseData = {
            code: 401,
            data: "Error! Not able to delete notifications."
         };
         return callback(req, responseData)
      });
   }
};