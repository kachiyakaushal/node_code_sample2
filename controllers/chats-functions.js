const ChatRoom = require("../models").ChatRoom;
const Chat = require("../models").Chat;
const ChatRoomUser = require("../models").ChatRoomUser;
const User = require("../models").User;
const Shop = require("../models").Shop;

var chatEvents = require("../events/chatEvents").chatEmitter;

const sequelize = require("../models").sequelize;
var Sequelize = require("sequelize");
const Op = Sequelize.Op;

const moment = require('moment');
var bcrypt = require('bcryptjs');
var _ = require('underscore');
var async = require("async");

module.exports.chatRooms = async function (req, callback) {
   var query = req.query;

   const username = req.session.user.username;

   var wheres = {
      username: username
   };

   ChatRoomUser.findAll({
      where: wheres,
      raw: true,
      attributes: ['room'],
      order: [['lastMessageDate', 'DESC']]
   }).then(async chatRoomsAdmin => {

      if (chatRoomsAdmin && chatRoomsAdmin.length > 0) {

         var totalChatRoomsFirst = [];
         await _.each(chatRoomsAdmin, function (roomdata) {
            totalChatRoomsFirst.push(roomdata.room);
         });

         ChatRoomUser.findAll({
            where: {
               username: { [Op.ne]: username },
               room: { [Op.in]: totalChatRoomsFirst }
            },
            distinct: true,
            include: [
               {
                  model: User,
                  attributes: ['userId', 'firstName', 'lastName', 'profilePictureLink']
               }
            ],
            order: [['lastMessageDate', 'DESC']]
         })
            .then(async chatRoomsData => {

               var totalChatRooms = [];
               var consumer = req.session.user;

               await _.each(chatRoomsData, function (roomdata) {

                  var consumerName = "";
                  if (roomdata.User.firstName) {
                     consumerName += roomdata.User.firstName + " ";
                  }
                  if (roomdata.User.lastName) {
                     consumerName += roomdata.User.lastName;
                  }
                  if (!consumerName) {
                     consumerName += roomdata.username
                  }

                  var thisRoom = Object.assign({}, roomdata.dataValues);

                  var lastMsgDate = "";
                  if (thisRoom.lastMessageDate) {
                     lastMsgDate = thisRoom.lastMessageDate
                  }

                  thisRoom['shopName'] = ""
                  thisRoom['shopImageLink'] = ""
                  thisRoom['lastMessage'] = thisRoom.lastMessage || "";
                  thisRoom['lastMessageDate'] = lastMsgDate
                  thisRoom['consumerId'] = thisRoom.User.userId
                  thisRoom['consumerUsername'] = roomdata.username
                  thisRoom['consumerName'] = consumerName
                  thisRoom['consumerProfilePictureLink'] = thisRoom.User.profilePictureLink
                  thisRoom['messagesUnread'] = thisRoom.messagesUnread
                  thisRoom['isOnline'] = thisRoom.isOnline
                  thisRoom['lastSeen'] = thisRoom.lastSeen || ""

                  delete thisRoom.User;


                  totalChatRooms.push(thisRoom)

               });

               responseData = {
                  code: 200,
                  data: { count: totalChatRooms.count || 0, rows: totalChatRooms }
               };
               return callback(req, responseData)
            }).catch(err => {
               console.log(err);

               responseData = {
                  code: 400,
                  msg: err
               };
               return callback(req, responseData)
            });
      } else {
         responseData = {
            code: 400,
            msg: "No chat rooms yet!"
         };
         return callback(req, responseData)
      }
   }).catch(err => {
      responseData = {
         code: 400,
         msg: err
      };
      return callback(req, responseData)
   });
};

module.exports.search = async function (req, callback) {
   var query = req.query;

   const stexts = req.params.stexts;
   const username = req.session.user.username;

   var wheres = {
      [Op.and]: [
         { username: { [Op.ne]: username } },
         { username: { [Op.substring]: stexts } }
      ]
   };

   User.findAndCountAll({
      where: wheres,
      order: [['username', 'ASC']],
   }).then(async chatRooms => {
      if (chatRooms && chatRooms.count > 0) {
         var totalChatRooms = [];
         var consumer = req.session.user;

         async.forEachOf(chatRooms.rows, async (room, key, callback) => {
            
            var roomFromUsername = await ChatRoomUser.findAll({
               where: { username: room.username },
               attributes: ["room"],
            });
            
            var alreadyRoom = "";
            var lastMessage = "";
            var lastMessageDate = "";

            if(roomFromUsername.length > 0){
               
               var roomArray = _.pluck(roomFromUsername, 'room');

               var roomFromUsernameTwo = await ChatRoomUser.findOne({
                  where: {
                     username: username,
                     room: { [Op.in]: roomArray }
                  },
                  attributes: ["room", "lastMessage", "lastMessageDate"],
               });

               if(roomFromUsernameTwo != null){
                  alreadyRoom = roomFromUsernameTwo.room
                  lastMessage = roomFromUsernameTwo.lastMessage || ""
                  lastMessageDate = roomFromUsernameTwo.lastMessageDate || "";
               }
               
            }

            var consumerName = "";
            if (room.firstName) {
               consumerName += room.firstName + " ";
            }
            if (room.lastName) {
               consumerName += room.lastName;
            }
            if (!room.firstName && !room.lastName) {
               consumerName += room.username
            }

            var thisRoom = Object.assign({}, room);
            thisRoom['room'] = alreadyRoom
            thisRoom['shopName'] = ""
            thisRoom['shopImageLink'] = ""
            thisRoom['lastMessage'] = lastMessage
            thisRoom['lastMessageDate'] = lastMessageDate
            thisRoom['consumerId'] = room.userId
            thisRoom['consumerUsername'] = room.username
            thisRoom['consumerName'] = consumerName
            thisRoom['consumerProfilePictureLink'] = room.profilePictureLink

            totalChatRooms.push(thisRoom)
         }, err => {
            if (err){
               responseData = {
                  code: 400,
                  msg: "Error!"
               };
               return callback(req, responseData)
            }
            
            responseData = {
               code: 200,
               data: { count: totalChatRooms.count || 0, rows: totalChatRooms }
            };
            return callback(req, responseData)
         });         
         
      }
      else {
         responseData = {
            code: 400,
            msg: "No users/vendors found!"
         };
         return callback(req, responseData)
      }
   }).catch(err => {
      responseData = {
         code: 400,
         msg: err
      };
      return callback(req, responseData)
   });
};

module.exports.getMessages = async function (req, callback) {
   var data = req.body;
   
   var getData = {
      room: data.room,
      username: data.username,
      offset: parseInt(data.offset)
   }

   chatEvents.emit('getMessages', getData, function (result) {      
      if (result.code == 200) {
         responseData = {
            code: 200,
            data: result.chats,
         };
         return callback(req, responseData)
      } else {
         responseData = {
            code: 400,
            data: null
         };
         return callback(req, responseData)
      }
   });
};