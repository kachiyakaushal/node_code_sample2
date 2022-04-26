var helpers = require('handlebars-helpers')();
const paginate = require('express-paginate');

var usersFunctions = require('../../controllers/users-functions.js');

module.exports.list = function (req, res, next) {
	var p1 = new Promise((resolve, reject) => {
		usersFunctions.list(req, function (req, responseData) {
			resolve(responseData);	
		})
	})

	var error = req.flash('error');
	var success = req.flash('success');

	return Promise.all([p1]).then(values => {		
		var responseData = values[0];
		var globaldata = Array();
		if(responseData.code >= 200 && responseData.code <= 300){
			globaldata.totalcount = responseData.data.count;
			globaldata.totalrows = responseData.data.rows;
		}
		else{
			globaldata.totalcount = 0;
			globaldata.totalrows = null;
		}		

		const pageCount = Math.ceil(globaldata.totalcount / req.query.limit);

		var layout = getLayout(req);
		var dropdownPages = getDropdownPages();
      var apptitle = process.env.AppTitle;
		var headtitle = "User";

		var fullUrl = req.protocol + '://' + req.get('host') + encodeURIComponent(req.originalUrl);

		res.render('users/index', {
			title: 'Users - ' + apptitle,
			layout: layout,
			// helpers,
         apptitle,
			headtitle,
			dropdownPages,
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
};

module.exports.edit = function (req, res, next) {
	var p1 = new Promise((resolve, reject) => {
		usersFunctions.edit(req, function (req, responseData) {
			resolve(responseData);	
		})
	})

	var error = req.flash('error');
	var success = req.flash('success');

	return Promise.all([p1]).then(values => {		
		var rvalue = values[0];

		var layout = getLayout(req);
		var dropdownPages = getDropdownPages();
      var apptitle = process.env.AppTitle;
		var headtitle = "User";
		
		res.render('users/edit', {
			title: 'Edit Users - ' + apptitle,
			layout: layout,
         // helpers,
         apptitle,
			headtitle,
			dropdownPages,
			data: rvalue.data,
			hasMessages: (error.length || success.length) > 0 ? true : false,
			error: error,
			success: success,
			query: req.query,
		});
	});
};

module.exports.editdata = function (req, res, next) {	
	usersFunctions.editdata(req, function (req, responseData) {		
		var userId = req.body.userId;
		if(responseData.code >= 200 && responseData.code <= 300){
			req.flash('success', responseData.msg);
			// res.redirect(responseData.redirect);
		}
		else{
			req.flash('error', responseData.msg);
			// res.redirect('/users/edit/' + userId + '?redirect=' + responseData.redirect);
		}
		res.redirect('/users/edit/' + userId);
	});
};

module.exports.editUserLogo = function (req, res, next) {

	var p1 = new Promise((resolve, reject) => {
		usersFunctions.editUserLogo(req, function (req, responseData) {
			resolve(responseData);
		});
	});

	Promise.all([p1]).then(values => {
		return ReS(res, values[0]);
	})
	
};

module.exports.usertransactions = function (req, res, next) {
	var p1 = new Promise((resolve, reject) => {
		usersFunctions.list(req, function (req, responseData) {
			resolve(responseData);	
		})
	})

	var error = req.flash('error');
	var success = req.flash('success');

	return Promise.all([p1]).then(values => {		
		var responseData = values[0];
		var globaldata = Array();
		if(responseData.code >= 200 && responseData.code <= 300){
			globaldata.totalcount = responseData.data.count;
			globaldata.totalrows = responseData.data.rows;
		}
		else{
			globaldata.totalcount = 0;
			globaldata.totalrows = null;
		}		

		const pageCount = Math.ceil(globaldata.totalcount / req.query.limit);

		var layout = getLayout(req);
		var dropdownPages = getDropdownPages();
      var apptitle = process.env.AppTitle;
		var headtitle = "Transaction History";

		var fullUrl = req.protocol + '://' + req.get('host') + encodeURIComponent(req.originalUrl);

		res.render('users/transactions', {
			title: 'Transaction History - ' + apptitle,
			layout: layout,
         // helpers,
         apptitle,
			headtitle,
			dropdownPages,
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
};

module.exports.passwordReset = function (req, res, next) {	
	usersFunctions.passwordReset(req, function (req, responseData) {		
		var userId = req.body.userId;
		if(responseData.code >= 200 && responseData.code <= 300){
			req.flash('success', responseData.msg);
			// res.redirect(responseData.redirect);
		}
		else{
			req.flash('error', responseData.msg);
			// res.redirect('/users/edit/' + userId + '?redirect=' + responseData.redirect);
		}
		res.redirect('/users/edit/' + userId);
	});
};

module.exports.multipleStatuses = function (req, res, next) {
	var p1 = new Promise((resolve, reject) => {
		usersFunctions.multipleStatuses(req, function (req, responseData) {
			resolve(responseData);
		});
	});

	Promise.all([p1]).then(values => {
		if(values[0].code >= 200 && values[0].code <= 300){
			return ReS(res, values[0].data);
		}
		else{
			return ReE(res, values[0].data);
		}		
	})
};

module.exports.deleteUser = function (req, res, next) {	
	usersFunctions.deleteUser(req, function (req, responseData) {		
		if(responseData.code >= 200 && responseData.code <= 300){
			req.flash('success', responseData.msg);
		}
		else{
			req.flash('error', responseData.msg);
		}
		res.redirect('/users');
	});
};