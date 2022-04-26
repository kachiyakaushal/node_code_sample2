"use strict";
const path = require('path');

module.exports = (sequelize, DataTypes) => {
  var Promotion = sequelize.define(
    "Promotion",
    {
      promotionId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: { type: DataTypes.STRING, defaultValue: null },
      sequence: { type: DataTypes.INTEGER },      
      // startDate: { type: DataTypes.DATE, defaultValue: null },
      // endDate: { type: DataTypes.DATE, defaultValue: null },
      promotionImageUrl: { 
        type: DataTypes.STRING,
        get(){
          var promotionImageUrl = this.getDataValue('promotionImageUrl');
          if(!promotionImageUrl){
            return process.env.FILEPATH + '/placeholder.png';
          }
          
          return promotionImageUrl;
        }
      },
      description: { type: DataTypes.STRING, defaultValue: null },
      isShopPromo: { type: DataTypes.INTEGER, defaultValue: null }, // 0: AdminPromo, 1: VendorPromo
      shopId: { type: DataTypes.INTEGER, defaultValue: null },
      tierId: { type: DataTypes.INTEGER, defaultValue: null },
      adminId: { type: DataTypes.INTEGER, defaultValue: null },
      declineMessage: { type: DataTypes.STRING, defaultValue: null },
      status: { type: DataTypes.INTEGER, defaultValue: 0 }, // 0: Pending, 1: Publish, 2: Rejected, 3: Expired, 4: Previous, 5: Draft
      vendorStatus: { type: DataTypes.INTEGER, defaultValue: 0 }, // 0: Pending, 1: Publish, 2: Rejected , 3: Expired, 4: Previous
      deletedAt: { type: DataTypes.DATE, defaultValue: null }
    },
    {
      freezeTableName: true,
      tableName: "promotions",
      paranoid: true,
      getterMethods: {

      },
      hooks: {
        beforeUpdate: (instance) => {
          var newpromotionImageUrl = instance.dataValues.promotionImageUrl;
          var oldpromotionImageUrl = instance._previousDataValues.promotionImageUrl;
          if(oldpromotionImageUrl && (newpromotionImageUrl != oldpromotionImageUrl)){
            var filename = path.basename(oldpromotionImageUrl);
	          const dest = CONFIG.storePath + "/promotion/" + filename;
            deleteFileSync(dest);
          }
        },
        // beforeSave: (instance) => {
        //   // console.log(instance.promotionImageUrl);
        //   console.log(instance._previousDataValues);
        // }
      }
    },
  );

  Promotion.associate = function (models) {
    this.tierId = this.belongsTo(models.ShopMembershipTier, {
      foreignKey: "tierId"
    });
    this.adminId = this.belongsTo(models.User, {
      foreignKey: "adminId"
    });
    this.shopId = this.belongsTo(models.Shop, {
      foreignKey: "shopId"
    });
  };

  Promotion.prototype.toWeb = function (pw) {
    let json = this.toJSON();
    return json;
  };

  return Promotion;
};
