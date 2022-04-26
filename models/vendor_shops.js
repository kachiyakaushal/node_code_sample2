"use strict";

module.exports = (sequelize, DataTypes) => {
   var VendorShop = sequelize.define(
      "VendorShop",
      {
         id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
         },
         userId: DataTypes.INTEGER,
         shopId: DataTypes.INTEGER,
         deletedAt: { type: DataTypes.DATE, defaultValue: null }
      },
      {
         freezeTableName: true,
         tableName: "vendor_shops",
         paranoid: true,
         getterMethods: {

         }
      },
   );

   VendorShop.associate = function (models) {
      this.userId = this.belongsTo(models.User, {
         foreignKey: "userId"
      });
   };

   VendorShop.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
   };

   return VendorShop;
};