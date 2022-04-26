"use strict";
const path = require('path');

module.exports = (sequelize, DataTypes) => {
  var Shop = sequelize.define(
    "Shop",
    {
      shopId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: DataTypes.INTEGER,
      shopName: DataTypes.STRING,
      shopPhoneNo: DataTypes.STRING,
      shopCountryCode: DataTypes.STRING,
      shopAddress: DataTypes.STRING,
      shopImageLink: { 
        type: DataTypes.STRING,
        get(){
          var shopImageLink = this.getDataValue('shopImageLink');
          if(!shopImageLink){
            return process.env.FILEPATH + '/placeholder.png';
          }
          
          return shopImageLink;
        }
      },
      qrString: {
        // needs to be unique
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      businessSsm: DataTypes.STRING,
      businessName: DataTypes.STRING,
      companyName: DataTypes.STRING,
      // contractEndDate: DataTypes.DATE,
      contactPersonNumber: DataTypes.STRING,
      companyEmail: DataTypes.STRING,
      companyPhone: DataTypes.STRING,
      agentEmail: DataTypes.STRING,
      agentName: DataTypes.STRING,
      agentPhoneNo: DataTypes.STRING,
      agentCountryCode: DataTypes.STRING,
      latitude: { type: DataTypes.DOUBLE, defaultValue: null },
      longtitude: { type: DataTypes.DOUBLE, defaultValue: null },
      deletedAt: { type: DataTypes.DATE, defaultValue: null },
      expiryDate: { type: DataTypes.DATE, defaultValue: null },
      status: {type: DataTypes.INTEGER, defaultValue: 1},
      mxnRunningPromo: {type: DataTypes.INTEGER, defaultValue: 3},
      categoryText: { type: DataTypes.STRING, defaultValue: null },
      shopTotalPoints: {
        type: DataTypes.VIRTUAL
      },
      shopTotalUsers: {
        type: DataTypes.VIRTUAL
      },
      shopTotalActiveUsers: {
        type: DataTypes.VIRTUAL
      },
      userMaxPoint:  {
        type: DataTypes.VIRTUAL
      },
      runningPromotions: {
        type: DataTypes.VIRTUAL
      },
      requestedPromotions: {
        type: DataTypes.VIRTUAL
      },
      rejectedPromotions: {
        type: DataTypes.VIRTUAL
      },
    },
    {
      freezeTableName: true,
      tableName: "shops",
      paranoid: true,
      getterMethods: {

      },
      hooks: {
        beforeUpdate: (instance) => {
          var newshopImageLink = instance.dataValues.shopImageLink;
          var oldshopImageLink = instance._previousDataValues.shopImageLink;
          if(oldshopImageLink && (newshopImageLink != oldshopImageLink)){
            var filename = path.basename(oldshopImageLink);
	          const dest = CONFIG.storePath + "/vendor/" + filename;
            deleteFileSync(dest);
          }
        },
        // beforeSave: (instance) => {
        //   // console.log(instance.shopImageLink);
        //   console.log(instance._previousDataValues);
        // }
      }
    },
  );
  
  Shop.associate = function(models) {
    this.userId = this.belongsTo(models.User, {
      foreignKey: "userId"
    });
    this.shopId = this.hasMany(models.ShopHour, {
      foreignKey: "shopId",
      onDelete: 'cascade',
      hooks: true,
    });
    this.shopId = this.hasMany(models.Service, {
      foreignKey: "shopId",
      onDelete: 'cascade',
      hooks: true,
    });
    this.shopId = this.hasMany(models.ShopMembershipTier, {
      foreignKey: "shopId",
      onDelete: 'cascade',
      hooks: true,
    });
    this.shopId = this.hasMany(models.ConsumerShopPoints, {
      foreignKey: "shopId",
    });
    this.shopId = this.hasMany(models.VendorShop, {
      foreignKey: "shopId",
    });
    this.shopId = this.hasMany(models.ShopDocument, {
      foreignKey: "shopId",
    });
    this.shopId = this.hasMany(models.ConsumerTransaction, {
      foreignKey: "shopId",
    });
    this.shopId = this.hasMany(models.Promotion, {
      foreignKey: "shopId",
    });
  };

  Shop.prototype.toWeb = function (pw) {
    let json = this.toJSON();
    return json;
  };

  return Shop;
};
