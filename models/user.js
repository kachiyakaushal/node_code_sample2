"use strict";
const jwt = require("jsonwebtoken");
const path = require('path');

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define(
    "User",
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        // needs to be unique
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      countryCode: DataTypes.STRING,
      phone: DataTypes.STRING,
      address: DataTypes.STRING,
      city: DataTypes.STRING,
      state: DataTypes.STRING,
      zipCode: DataTypes.STRING,
      loginTimes: DataTypes.INTEGER,
      profilePictureLink: {
        type: DataTypes.STRING,
        get() {
          var profilePictureLink = this.getDataValue('profilePictureLink');
          if (!profilePictureLink) {
            return process.env.FILEPATH + '/placeholder.png';
          }

          return profilePictureLink;
        }
      },
      password: DataTypes.STRING,
      gender: DataTypes.STRING,
      dateOfBirth: DataTypes.DATE,
      status: DataTypes.INTEGER.UNSIGNED, // 1: active, 0: inactive, 2: Pending Registration
      role: DataTypes.INTEGER.UNSIGNED, // 0: Administrator, 1: Business Owner, 2: Consumer, 3: Shop Assistant, 4: Sub Admin
      deletedAt: { type: DataTypes.DATE, defaultValue: null },
      totalPoints: {
        type: DataTypes.VIRTUAL
      }
    },
    {
      freezeTableName: true,
      tableName: "users",
      paranoid: true,
      getterMethods: {

      },
      hooks: {
        beforeUpdate: (instance) => {
          var newprofilePictureLink = instance.dataValues.profilePictureLink;
          var oldprofilePictureLink = instance._previousDataValues.profilePictureLink;
          if (oldprofilePictureLink && (newprofilePictureLink != oldprofilePictureLink)) {
            var filename = path.basename(oldprofilePictureLink);
            const dest = CONFIG.storePath + "/user/" + filename;
            deleteFileSync(dest);
          }
        },
        // beforeSave: (instance) => {
        //   // console.log(instance.profilePictureLink);
        //   console.log(instance._previousDataValues);
        // }
      }
    },
  );

  User.associate = function (models) {
    this.userId = this.hasMany(models.Shop, {
      foreignKey: "userId",
      onDelete: 'cascade',
      hooks: true,
    });
    this.userId = this.hasMany(models.ConsumerShop, {
      foreignKey: "userId",
      onDelete: 'cascade',
      hooks: true,
    });
    this.userId = this.hasMany(models.ConsumerShopPoints, {
      foreignKey: "userId",
      onDelete: 'cascade',
      hooks: true,
    });
    this.userId = this.hasMany(models.Booking, {
      foreignKey: "consumerId",
      onDelete: 'cascade',
      hooks: true,
    });
    this.userId = this.hasMany(models.ConsumerTransaction, {
      foreignKey: "consumerId",
    });
    this.userId = this.hasMany(models.Promotion, {
      foreignKey: "adminId",
    });
    this.userId = this.hasMany(models.UserDeviceToken, {
      foreignKey: "userId",
    });
  };

  User.prototype.toWeb = function (pw) {
    let json = this.toJSON();
    delete json["password"];
    return json;
  };

  User.prototype.getJWT = function () {
    let expiration_time = parseInt(CONFIG.jwt_expiration);
    return (
      "Bearer " +
      jwt.sign({ userId: this.userId }, CONFIG.jwt_encryption_admin, {
        expiresIn: expiration_time
      })
    );
  };

  return User;
};
