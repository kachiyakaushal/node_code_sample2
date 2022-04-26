var events = require('events');
var chatEmitter = new events.EventEmitter();

require('dotenv').config();
var _ = require('underscore');

const User = require("../models").User;
const ChatRoom = require("../models").ChatRoom;
const Chat = require("../models").Chat;
const ChatRoomUser = require("../models").ChatRoomUser;

var Sequelize = require("sequelize");
const Op = Sequelize.Op;

// Bind the connection event with the function
chatEmitter.on('createChatRoom', async function (data, users, callback) {
    var newChatRoom = data.chatRoomData;
    var newChatRoomUser = data.chatRoomUserData;

    var createChatRoom = async function () {
        ChatRoom.create(newChatRoom)
            .then(chatRoom => {
                return chatRoom
            }).then(chatRoomData => {
                return ChatRoomUser.bulkCreate(newChatRoomUser)
                    .then(chatRooms => {
                        return callback({
                            code: 200,
                            chatRooms: chatRooms
                        })
                    }).catch(err => {
                        console.log(err);

                        return callback({
                            code: 500,
                            chatRooms: []
                        })
                    })
            }).catch(err => {
                console.log(err);

                return callback({
                    code: 500,
                    chatRooms: []
                })
            })
    }

    var rooms = await ChatRoomUser.findAll({
        where: {
            username: {
                [Op.in]: users
            }
        }
    })

    var dupArr = [];
    var groupedByCount = await _.countBy(rooms, function (item) {
        return item.room;
    });

    for (var room in groupedByCount) {
        if (groupedByCount[room] > 1) {
            _.where(rooms, {
                room: room
            }).map(function (item) {
                dupArr.push(item.dataValues);
            });
        }
    };

    if (dupArr && dupArr.length == users.length) {
        return callback({
            code: 200,
            chatRooms: dupArr
        })
    } else {
        createChatRoom()
    }

});

chatEmitter.on('addChatMessage', async function (data, callback) {
    var newChat = data;

    Chat.create(newChat).then(chat => {
        var whereC = {
            room: data.room
        };
        var postData = {
            lastMessage: data.message,
            lastMessageDate: new Date(),
        }
        return ChatRoomUser.findAll({ where: whereC })
        .then(async chatRoomUsers => {
            if (chatRoomUsers && chatRoomUsers.length > 0) {
                await _.each(chatRoomUsers, function (chatRoomUser) {
                    chatRoomUser.update(postData).catch(err => {
                        console.log(err)
                    });
                });

                return callback({
                    code: 200
                })
            }
            else{
                return callback({
                    code: 200
                })
            }
        })
        .catch(err => {
            console.log(err)
        })
    }).catch(err => {
        return callback({
            code: 500
        })
    })

});

chatEmitter.on('getMessages', async function (data, callback) {

    Chat.findAndCountAll({
        where: {
            room: data.room
        },
        limit: 20,
        offset: data.offset,
        order: [['createdAt', 'DESC']]
    }).then(chats => {
        chats.rows.map(function (chat) {
            chat.dataValues.createdAt = new Date(chat.dataValues.createdAt).getTime()
        })
        return callback({
            code: 200,
            err: null,
            chats: chats
        })
    }).catch(err => {
        return callback({
            code: 500,
            err: err,
            chats: []
        })
    })

});

module.exports.chatEmitter = chatEmitter