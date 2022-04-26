"use strict";
const jwt = require("jsonwebtoken");

module.exports = (sequelize, DataTypes) => {
  var ChatRoomUser = sequelize.define(
    "ChatRoomUser",
    {
      chatRoomUserId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      vendorName: { type: DataTypes.STRING, defaultValue: null }, //userName of business owner for this shop
      username: DataTypes.STRING,//userName of this user
      shopId: { type: DataTypes.INTEGER, defaultValue: null },
      room: DataTypes.STRING,
      lastMessage: { type: DataTypes.STRING, defaultValue: null },
      lastMessageDate: { type: DataTypes.DATE, defaultValue: null },
      messagesUnread: { type: DataTypes.INTEGER, defaultValue: 0 },
      isOnline: { type: DataTypes.INTEGER, defaultValue: 0 },
      lastSeen: { type: DataTypes.DATE, defaultValue: null },
      deletedAt: { type: DataTypes.DATE, defaultValue: null }
    },
    {
      freezeTableName: true,
      tableName: "chat_room_users",
      paranoid: true,
      getterMethods: {

      }
    },
  );

  ChatRoomUser.associate = function (models) {
    this.username = this.belongsTo(models.User, {
      foreignKey: "username",
      targetKey: "username"
    });
    this.shopId = this.belongsTo(models.Shop, {
      foreignKey: "shopId"
    });
    this.room = this.hasMany(models.Chat, {
      foreignKey: "room",
      otherKey: "room",
    });
  };

  ChatRoomUser.prototype.toWeb = function (pw) {
    let json = this.toJSON();
    return json;
  };

  return ChatRoomUser;
};
