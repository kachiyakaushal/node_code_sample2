"use strict";
const jwt = require("jsonwebtoken");

module.exports = (sequelize, DataTypes) => {
  var ChatRoom = sequelize.define(
    "ChatRoom",
    {
      chatRoomId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      room: DataTypes.STRING,
      deletedAt: { type: DataTypes.DATE, defaultValue: null }
    },
    {
      freezeTableName: true,
      tableName: "chat_rooms",
      paranoid: true,
      getterMethods: {
      
      }
    },
  );
  
  ChatRoom.associate = function(models) {
    this.room = this.hasMany(models.ChatRoomUser, {
      foreignKey: "room",
      onDelete: 'cascade',
      hooks: true,
    });
    this.room = this.hasMany(models.Chat, {
      foreignKey: "room",
      targetKey: "room"
    });
  };

  ChatRoom.prototype.toWeb = function (pw) {
    let json = this.toJSON();
    return json;
  };

  return ChatRoom;
};
