var express = require('express');
var router = express.Router();
var helpers = require('handlebars-helpers')();

const paginate = require('express-paginate');

var auth = require('../middleware/auth');

var dashboardFunctions = require('../controllers/dashboard-functions.js');
var vendorsFunctions = require('../controllers/vendors-functions.js');

/* GET home page. */
router.get('/', function (req, res, next) {
	return res.redirect('/dashboard');
});

/* GET home page. */
router.get('/dashboard', auth.isAuthenticated(), function (req, res, next) {
	var p1 = new Promise((resolve, reject) => {
		dashboardFunctions.totalUser(req, function (req, responseData) {
			resolve(responseData);
		});
	});
	var p2 = new Promise((resolve, reject) => {
		dashboardFunctions.totalVendor(req, function (req, responseData) {
			resolve(responseData);
		});
	});
	var p3 = new Promise((resolve, reject) => {
		dashboardFunctions.activeUser(req, function (req, responseData) {
			resolve(responseData);
		});
	});
	var p4 = new Promise((resolve, reject) => {
		vendorsFunctions.list(req, function (req, responseData) {
			resolve(responseData);
		})
	});
	var p5 = new Promise((resolve, reject) => {
		dashboardFunctions.chartDataCounts(req, function (req, responseData) {
			resolve(responseData);	
		})
  	});
	

	var error = req.flash('error');
	var success = req.flash('success');

	return Promise.all([p1, p2, p3, p4, p5]).then(values => {
		var layout = getLayout(req);
		var dropdownPages = getDropdownPages();
		var apptitle = process.env.AppTitle;
		var headtitle = "Dashboard";

		var responseData = values[3];
		var globaldata = Array();
		if (responseData.code >= 200 && responseData.code <= 300) {
			globaldata.totalcount = responseData.data.count;
			globaldata.totalrows = responseData.data.rows;
		}
		else {
			globaldata.totalcount = 0;
			globaldata.totalrows = null;
		}

		const pageCount = Math.ceil(globaldata.totalcount / req.query.limit);
		var fullUrl = req.protocol + '://' + req.get('host') + encodeURIComponent(req.originalUrl);

		res.render('index', {
			title: 'Dashboard - ' + apptitle,
			layout: layout,
			// helpers,
			apptitle,
			headtitle,
			dropdownPages,
			totalUser: values[0],
			totalVendor: values[1],
			activeUser: values[2],
			chartData: values[4],
			totalcount: globaldata.totalcount,
			totalrows: globaldata.totalrows,
			hasMessages: (error.length || success.length) > 0 ? true : false,
			error: error,
			success: success,
			query: req.query,
			pageCount,
			has_more: res.locals.paginate.hasNextPages(pageCount),
			pages: paginate.getArrayPages(req)(7, pageCount, req.query.page),
			paginationTexts: paginationTexts(req.query.page, globaldata.totalcount, req.query.limit),
			firstPageUrl: firstPageUrlFunc(req, pageCount),
			lastPageUrl: lastPageUrlFunc(req, pageCount),
			fullUrl: fullUrl
		});
	});
});

var authRouter = require("./auth");
var usersRouter = require("./users");
var vendorsRouter = require("./vendors");
var myaccountRouter = require("./my-account");
var promotionsRouter = require("./promotions");
var pushnotificationsRouter = require("./pushnotifications");
var notificationsRouter = require("./notifications");

router.use("/auth", authRouter);
router.use("/users", auth.isAuthenticated(), usersRouter);
router.use("/vendors", auth.isAuthenticated(), vendorsRouter);
router.use("/my-account", auth.isAuthenticated(), myaccountRouter);
router.use("/promotions", auth.isAuthenticated(), promotionsRouter);
router.use("/pushnotifications", auth.isAuthenticated(), pushnotificationsRouter);
router.use("/notifications", auth.isAuthenticated(), notificationsRouter);

module.exports = router;