"use strict";

module.exports = (sequelize, DataTypes) => {
   var PushNotification = sequelize.define(
      "PushNotification",
      {
         id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
         },
         title: { type: DataTypes.STRING },
         description: { type: DataTypes.STRING, defaultValue: null },
         datewithtime: { type: DataTypes.DATE },
         // time: { type: DataTypes.STRING },
         type: { type: DataTypes.INTEGER }, // 1: User, 2: Vendor
         userId: { type: DataTypes.INTEGER, defaultValue: null },
         shopId: { type: DataTypes.INTEGER, defaultValue: null },
         status: { type: DataTypes.INTEGER, allowNull: false }, // 1: Publish, 2: Draft
         sentStatus: { type: DataTypes.INTEGER, defaultValue: 0 }, // 0: Pending, 1: Sent
         deletedAt: { type: DataTypes.DATE, defaultValue: null }
      },
      {
         freezeTableName: true,
         tableName: "push_notifications",
         paranoid: true,
         getterMethods: {
         },
         hooks: {
         }
      },
   );

   PushNotification.associate = function (models) {
      this.userId = this.belongsTo(models.User, {
         foreignKey: "userId"
      });
      this.shopId = this.belongsTo(models.Shop, {
         foreignKey: "shopId"
      });
   };

   PushNotification.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
   };

   return PushNotification;
};
