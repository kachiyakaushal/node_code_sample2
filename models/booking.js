"use strict";

module.exports = (sequelize, DataTypes) => {
  var Booking = sequelize.define(
    "Booking",
    {
      bookingId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      bookingDate: DataTypes.DATE,
      consumerId: DataTypes.INTEGER,
      serviceId: DataTypes.INTEGER,
      createdBy: DataTypes.INTEGER,
      startingTime: DataTypes.STRING,
      description: DataTypes.STRING,
      status: DataTypes.INTEGER,// 0: Pending, 1: Confirmed, 2: Cancelled
      deletedAt: { type: DataTypes.DATE, defaultValue: null }
    },
    {
      freezeTableName: true,
      tableName: "bookings",
      paranoid: true,
      getterMethods: {
      
      }
    },
  );
  
  Booking.associate = function(models) {
    this.serviceId = this.belongsTo(models.Service, {
      foreignKey: "serviceId"
    });
    this.userId = this.belongsTo(models.User, {
      foreignKey: "consumerId"
    });
  };

  Booking.prototype.toWeb = function (pw) {
    let json = this.toJSON();
    return json;
  };

  return Booking;
};
