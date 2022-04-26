const User = require("../models").User;

const sequelize = require("../models").sequelize;
var Sequelize = require("sequelize");
const Op = Sequelize.Op;

const moment = require('moment');
var bcrypt = require('bcryptjs');
var _ = require('underscore');

module.exports.totalUser = async function (req, callback) {
   var where = { role: 2 };
   var defalutOptions = {
      where: where,
   };
   var arrUser = await User.count(defalutOptions);

   var yestDate = moment().subtract(1, 'days').endOf('day').format();

   var whereOne = {
      role: 2,
      createdAt: {
         [Op.gt]: yestDate
      },
   };
   var defalutOptionsOne = {
      where: whereOne,
   };
   var arrUserOne = await User.count(defalutOptionsOne);

   var totalIncreaseToday = (100 * arrUserOne / arrUser).toFixed(1);

   responseData = {
      count: arrUser,
      totalIncreaseToday: totalIncreaseToday
   };
   return callback(req, responseData)
};

module.exports.totalVendor = async function (req, callback) {
   var where = { role: 1 };
   var defalutOptions = {
      where: where,
   };
   var arrUser = await User.count(defalutOptions);
   var yestDate = moment().subtract(1, 'days').endOf('day').format();

   var whereOne = {
      role: 1,
      createdAt: {
         [Op.gt]: yestDate,
      },
   };
   var defalutOptionsOne = {
      where: whereOne,
   };
   var arrUserOne = await User.count(defalutOptionsOne);

   var totalIncreaseToday = (100 * arrUserOne / arrUser).toFixed(1);

   responseData = {
      count: arrUser,
      totalIncreaseToday: totalIncreaseToday
   };
   return callback(req, responseData)
};

module.exports.activeUser = async function (req, callback) {
   var where = { role: { [Op.in]: [1, 2] }, status: 1 };
   var defalutOptions = {
      where: where,
   };
   var arrUser = await User.count(defalutOptions);

   var yestDate = moment().subtract(1, 'days').endOf('day').format();

   var whereOne = {
      role: { [Op.in]: [1, 2] },
      status: 1,
      createdAt: {
         [Op.gt]: yestDate,
      },
   };
   var defalutOptionsOne = {
      where: whereOne,
   };
   var arrUserOne = await User.count(defalutOptionsOne);

   var totalIncreaseToday = (100 * arrUserOne / arrUser).toFixed(1);

   responseData = {
      count: arrUser,
      totalIncreaseToday: totalIncreaseToday
   };
   return callback(req, responseData)
};

module.exports.chartDataCounts = async function (req, callback) {
   // totalUser Counts Starts
   var uqueryt1 = 'SELECT DATE_FORMAT(date, "%b") AS mname, date, COUNT(users.userId) as total FROM ( SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 1 MONTH AS date, MONTHNAME(CURRENT_DATE + INTERVAL 1 DAY) as mname UNION ALL SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 2 MONTH, MONTHNAME(CURRENT_DATE + INTERVAL 1 DAY - INTERVAL 1 MONTH) UNION ALL SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 3 MONTH, MONTHNAME(CURRENT_DATE + INTERVAL 1 DAY - INTERVAL 2 MONTH) UNION ALL SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 4 MONTH, MONTHNAME(CURRENT_DATE + INTERVAL 1 DAY - INTERVAL 3 MONTH) UNION ALL SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 5 MONTH, MONTHNAME(CURRENT_DATE + INTERVAL 1 DAY - INTERVAL 4 MONTH) UNION ALL SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 6 MONTH, MONTHNAME(CURRENT_DATE + INTERVAL 1 DAY - INTERVAL 5 MONTH) UNION ALL SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 7 MONTH, MONTHNAME(CURRENT_DATE + INTERVAL 1 DAY - INTERVAL 6 MONTH) UNION ALL SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 8 MONTH, MONTHNAME(CURRENT_DATE + INTERVAL 1 DAY - INTERVAL 7 MONTH) UNION ALL SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 9 MONTH, MONTHNAME(CURRENT_DATE + INTERVAL 1 DAY - INTERVAL 8 MONTH) UNION ALL SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 10 MONTH, MONTHNAME(CURRENT_DATE + INTERVAL 1 DAY - INTERVAL 9 MONTH) UNION ALL SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 11 MONTH, MONTHNAME(CURRENT_DATE + INTERVAL 1 DAY - INTERVAL 10 MONTH) UNION ALL SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 12 MONTH, MONTHNAME(CURRENT_DATE + INTERVAL 1 DAY - INTERVAL 11 MONTH) ) AS dates LEFT JOIN users ON createdAt >= date AND createdAt < date + INTERVAL 1 MONTH AND role = 2 GROUP BY date';

   const totalUsersByMonths = await sequelize.query(uqueryt1, { type: Sequelize.SELECT });
   var totalUsersByMonthsStringfy = JSON.stringify(totalUsersByMonths[0], null, 2)
   var totalUsersByMonthsParse = JSON.parse(totalUsersByMonthsStringfy);

   var pluckedArrayTotalU = _.pluck(totalUsersByMonthsParse, 'total');
   var pluckedArrayMonth = _.pluck(totalUsersByMonthsParse, 'mname');

   // totalVendor Counts Starts
   var uqueryt2 = 'SELECT DATE_FORMAT(date, "%b") AS mname, date, COUNT(users.userId) as total FROM ( SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 1 MONTH AS date, MONTHNAME(CURRENT_DATE + INTERVAL 1 DAY) as mname UNION ALL SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 2 MONTH, MONTHNAME(CURRENT_DATE + INTERVAL 1 DAY - INTERVAL 1 MONTH) UNION ALL SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 3 MONTH, MONTHNAME(CURRENT_DATE + INTERVAL 1 DAY - INTERVAL 2 MONTH) UNION ALL SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 4 MONTH, MONTHNAME(CURRENT_DATE + INTERVAL 1 DAY - INTERVAL 3 MONTH) UNION ALL SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 5 MONTH, MONTHNAME(CURRENT_DATE + INTERVAL 1 DAY - INTERVAL 4 MONTH) UNION ALL SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 6 MONTH, MONTHNAME(CURRENT_DATE + INTERVAL 1 DAY - INTERVAL 5 MONTH) UNION ALL SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 7 MONTH, MONTHNAME(CURRENT_DATE + INTERVAL 1 DAY - INTERVAL 6 MONTH) UNION ALL SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 8 MONTH, MONTHNAME(CURRENT_DATE + INTERVAL 1 DAY - INTERVAL 7 MONTH) UNION ALL SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 9 MONTH, MONTHNAME(CURRENT_DATE + INTERVAL 1 DAY - INTERVAL 8 MONTH) UNION ALL SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 10 MONTH, MONTHNAME(CURRENT_DATE + INTERVAL 1 DAY - INTERVAL 9 MONTH) UNION ALL SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 11 MONTH, MONTHNAME(CURRENT_DATE + INTERVAL 1 DAY - INTERVAL 10 MONTH) UNION ALL SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 12 MONTH, MONTHNAME(CURRENT_DATE + INTERVAL 1 DAY - INTERVAL 11 MONTH) ) AS dates LEFT JOIN users ON createdAt >= date AND createdAt < date + INTERVAL 1 MONTH AND role = 1 GROUP BY date';

   const totalVendorsByMonths = await sequelize.query(uqueryt2, { type: Sequelize.SELECT });
   var totalVendorsByMonthsStringfy = JSON.stringify(totalVendorsByMonths[0], null, 2)
   var totalVendorsByMonthsParse = JSON.parse(totalVendorsByMonthsStringfy);

   var pluckedArrayTotalV = _.pluck(totalVendorsByMonthsParse, 'total');
   
   // activeUser Counts Starts
   var uqueryt3 = 'SELECT DATE_FORMAT(date, "%b") AS mname, date, COUNT(users.userId) as total FROM ( SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 1 MONTH AS date, MONTHNAME(CURRENT_DATE + INTERVAL 1 DAY) as mname UNION ALL SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 2 MONTH, MONTHNAME(CURRENT_DATE + INTERVAL 1 DAY - INTERVAL 1 MONTH) UNION ALL SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 3 MONTH, MONTHNAME(CURRENT_DATE + INTERVAL 1 DAY - INTERVAL 2 MONTH) UNION ALL SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 4 MONTH, MONTHNAME(CURRENT_DATE + INTERVAL 1 DAY - INTERVAL 3 MONTH) UNION ALL SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 5 MONTH, MONTHNAME(CURRENT_DATE + INTERVAL 1 DAY - INTERVAL 4 MONTH) UNION ALL SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 6 MONTH, MONTHNAME(CURRENT_DATE + INTERVAL 1 DAY - INTERVAL 5 MONTH) UNION ALL SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 7 MONTH, MONTHNAME(CURRENT_DATE + INTERVAL 1 DAY - INTERVAL 6 MONTH) UNION ALL SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 8 MONTH, MONTHNAME(CURRENT_DATE + INTERVAL 1 DAY - INTERVAL 7 MONTH) UNION ALL SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 9 MONTH, MONTHNAME(CURRENT_DATE + INTERVAL 1 DAY - INTERVAL 8 MONTH) UNION ALL SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 10 MONTH, MONTHNAME(CURRENT_DATE + INTERVAL 1 DAY - INTERVAL 9 MONTH) UNION ALL SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 11 MONTH, MONTHNAME(CURRENT_DATE + INTERVAL 1 DAY - INTERVAL 10 MONTH) UNION ALL SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 12 MONTH, MONTHNAME(CURRENT_DATE + INTERVAL 1 DAY - INTERVAL 11 MONTH) ) AS dates LEFT JOIN users ON createdAt >= date AND createdAt < date + INTERVAL 1 MONTH AND role IN (1, 2) AND status = 1 GROUP BY date';

   const totalActiveUsrByMonths = await sequelize.query(uqueryt3, { type: Sequelize.SELECT });
   var totalActiveUsrByMonthsStringfy = JSON.stringify(totalActiveUsrByMonths[0], null, 2)
   var totalActiveUsrByMonthsParse = JSON.parse(totalActiveUsrByMonthsStringfy);

   var pluckedArrayTotalAU = _.pluck(totalActiveUsrByMonthsParse, 'total');

   responseData = {
      months: pluckedArrayMonth.join(','),
      totalUser: pluckedArrayTotalU.join(','),
      totalVendor: pluckedArrayTotalV.join(','),
      activeUser: pluckedArrayTotalAU.join(','),
   };   
   return callback(req, responseData)
}