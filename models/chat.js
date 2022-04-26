"use strict";
const jwt = require("jsonwebtoken");

module.exports = (sequelize, DataTypes) => {
  var Chat = sequelize.define(
    "Chat",
    {
      chatId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      room: DataTypes.STRING,
      message: DataTypes.INTEGER,
      username: DataTypes.INTEGER,//username of vendor chatting
      type: { type: DataTypes.STRING, defaultValue: 'text' },
      isRead: { type: DataTypes.INTEGER, defaultValue: 0 },
      deletedAt: { type: DataTypes.DATE, defaultValue: null },
    },
    {
      freezeTableName: true,
      tableName: "chats",
      paranoid: true,
      getterMethods: {
      
      }
    },
  );
  
  Chat.associate = function(models) {
    this.room = this.belongsTo(models.ChatRoom, {
      foreignKey: "room",
      targetKey: "room"
    });
    this.username = this.belongsTo(models.User, {
      foreignKey: "username"
    });
  };

  Chat.prototype.toWeb = function (pw) {
    let json = this.toJSON();
    return json;
  };

  return Chat;
};
