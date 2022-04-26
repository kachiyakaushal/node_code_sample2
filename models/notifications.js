"use strict";
const jwt = require("jsonwebtoken");
const path = require('path');

module.exports = (sequelize, DataTypes) => {
  var Notification = sequelize.define(
    "Notification",
    {
      notificationId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      fromUserId: { type: DataTypes.INTEGER },
      toUserId: { type: DataTypes.INTEGER },
      shopId: { type: DataTypes.INTEGER },
      time: { type: DataTypes.DATE },
      isRead: { type: DataTypes.INTEGER, defaultValue: null }, // 0: AdminPromo, 1: VendorPromo
      status: { type: DataTypes.INTEGER, defaultValue: null }, // 0: Failed, 1: Successful
      title: { type: DataTypes.STRING, defaultValue: null },
      body: { type: DataTypes.STRING, defaultValue: null },
      profileImageLink: DataTypes.STRING,
      eventImageLink: DataTypes.STRING,
      deletedAt: { type: DataTypes.DATE, defaultValue: null }
    },
    {
      freezeTableName: true,
      tableName: "notifications",
      paranoid: true,
      getterMethods: {

      },
      hooks: {
        // beforeSave: (instance) => {
        // // console.log(instance.promotionImageUrl);
        // console.log(instance._previousDataValues);
        // }
      }
    },
  );

  Notification.associate = function (models) {
    Notification.belongsTo(models.User, {foreignKey: {name: 'fromUserId'}, as: 'fromUser'});
    Notification.belongsTo(models.User, {foreignKey: {name: 'toUserId'}, as: 'toUser'});
    // this.userId = this.belongsTo(models.User, {
    //   foreignKey: "toUserId"
    // });
    this.shopId = this.belongsTo(models.Shop, {
      foreignKey: "shopId"
    });
  };
  Notification.prototype.toWeb = function (pw) {
    let json = this.toJSON();
    return json;
  };

  return Notification;
};