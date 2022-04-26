"use strict";
const jwt = require("jsonwebtoken");

module.exports = (sequelize, DataTypes) => {
  var UserDeviceToken = sequelize.define(
    "UserDeviceToken",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: DataTypes.STRING,
      deviceType: DataTypes.STRING,
      deviceToken: DataTypes.STRING,
      deletedAt: { type: DataTypes.DATE, defaultValue: null }
    },
    {
      freezeTableName: true,
      tableName: "user_device_tokens",
      paranoid: true,
      getterMethods: {

      }
    },
  );

  UserDeviceToken.associate = function (models) {
    this.userId = this.belongsTo(models.User, {
      foreignKey: "userId"
    });
  };

  UserDeviceToken.prototype.toWeb = function (pw) {
    let json = this.toJSON();
    return json;
  };

  return UserDeviceToken;
};
