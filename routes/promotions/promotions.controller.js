var helpers = require('handlebars-helpers')();
const paginate = require('express-paginate');

var promotionsFunctions = require('../../controllers/promotions-functions.js');
var vendorsFunctions = require('../../controllers/vendors-functions.js');

module.exports.list = function (req, res, next) {
	var p1 = new Promise((resolve, reject) => {
		promotionsFunctions.list(req, function (req, responseData) {
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
		var headtitle = "All Promotion";

		var fullUrl = req.protocol + '://' + req.get('host') + encodeURIComponent(req.originalUrl);
		var fullUrlAp = req.protocol + '://' + req.get('host') + "/promotions/adminpromo";		

		res.render('promotions/index', {
			title: 'All Promotions - ' + apptitle,
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
			fullUrl: fullUrl,
			fullUrlAp: fullUrlAp,
		});
	});
};

module.exports.adminList = function (req, res, next) {
	var p1 = new Promise((resolve, reject) => {
		promotionsFunctions.adminList(req, function (req, responseData) {
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
		var headtitle = "Admin Promotion";

		var fullUrl = req.protocol + '://' + req.get('host') + encodeURIComponent(req.originalUrl);

		res.render('promotions/index-admin', {
			title: 'Admin Promotions - ' + apptitle,
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

module.exports.vendorList = function (req, res, next) {
	var p1 = new Promise((resolve, reject) => {
		promotionsFunctions.vendorList(req, function (req, responseData) {
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
		var headtitle = "Vendor Promotion";

		var fullUrl = req.protocol + '://' + req.get('host') + encodeURIComponent(req.originalUrl);

		res.render('promotions/index-vendor', {
			title: 'Vendor Promotions - ' + apptitle,
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
		promotionsFunctions.edit(req, function (req, responseData) {
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
		var headtitle = "Promotion";
		
		res.render('promotions/edit', {
			title: 'Edit Promotions - ' + apptitle,
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
	promotionsFunctions.editdata(req, function (req, responseData) {		
		var promotionId = req.body.promotionId;
		if(responseData.code >= 200 && responseData.code <= 300){
			req.flash('success', responseData.msg);
			res.redirect(responseData.redirect);
		}
		else{
			req.flash('error', responseData.msg);
			res.redirect('/promotions/edit/' + promotionId + '?redirect=' + responseData.redirect);
		}
		// res.redirect('/promotions/edit/' + promotionId);
	});
};

module.exports.updateStatus = function (req, res, next) {
	var p1 = new Promise((resolve, reject) => {
		promotionsFunctions.updateStatus(req, function (req, responseData) {
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

module.exports.updateOrder = function (req, res, next) {
	var p1 = new Promise((resolve, reject) => {
		promotionsFunctions.updateOrder(req, function (req, responseData) {
			resolve(responseData);
		});
	});

	Promise.all([p1]).then(values => {
		return ReS(res, values[0].data);
	})
};

module.exports.editPImg = function (req, res, next) {

	var p1 = new Promise((resolve, reject) => {
		promotionsFunctions.editPImg(req, function (req, responseData) {
			resolve(responseData);
		});
	});

	Promise.all([p1]).then(values => {
		return ReS(res, values[0]);
	})
	
};

module.exports.add = function (req, res, next) {
	var p1 = new Promise((resolve, reject) => {
		// vendorsFunctions.tierEdit(req, function (req, responseData) {
		// 	resolve(responseData);	
		// })
		resolve();
	})

	var error = req.flash('error');
	var success = req.flash('success');

	return Promise.all([p1]).then(values => {		
		// var rvalue = values[0];

		var layout = getLayout(req);
		var dropdownPages = getDropdownPages();
		var tierTypes = getTierTypes();
      var apptitle = process.env.AppTitle;
		var headtitle = "Admin Promotion";
		
		res.render('promotions/add', {
			title: 'Add Admin Promotion - ' + apptitle,
			layout: layout,
         // helpers,
         apptitle,
			headtitle,
			dropdownPages,
			tierTypes,
			// data: rvalue.data,
			hasMessages: (error.length || success.length) > 0 ? true : false,
			error: error,
			success: success,
			query: req.query,
		});
	});
};

module.exports.addnew = function (req, res, next) {	
	promotionsFunctions.addnew(req, function (req, responseData) {		
		if(responseData.code >= 200 && responseData.code <= 300){
			req.flash('success', responseData.msg);
			// res.redirect(responseData.redirect);
		}
		else{
			req.flash('error', responseData.msg);
			// res.redirect('/vendors/edit/' + shopId + '?redirect=' + responseData.redirect);
		}
		// res.redirect('/promotions/adminpromo');
		res.redirect(responseData.redirect);
	});
};

module.exports.addPImg = function (req, res, next) {

	var p1 = new Promise((resolve, reject) => {
		promotionsFunctions.addPImg(req, function (req, responseData) {
			resolve(responseData);
		});
	});

	Promise.all([p1]).then(values => {
		return ReS(res, values[0]);
	})
	
};

module.exports.vendorPromo = function (req, res, next) {
	var p1 = new Promise((resolve, reject) => {
		vendorsFunctions.getShopById(req, function (req, responseData) {
			resolve(responseData);	
		})
	});

	var p2 = new Promise((resolve, reject) => {
		promotionsFunctions.vendorRunningPromo(req, function (req, responseData) {
			resolve(responseData);	
		});
	});

	var p3 = new Promise((resolve, reject) => {
		promotionsFunctions.vendorRequestedPromo(req, function (req, responseData) {
			resolve(responseData);	
		});
	});

	var p4 = new Promise((resolve, reject) => {
		promotionsFunctions.vendorActivePromo(req, function (req, responseData) {
			resolve(responseData);	
		});
	});

	var p5 = new Promise((resolve, reject) => {
		promotionsFunctions.vendorRejectedPromo(req, function (req, responseData) {
			resolve(responseData);	
		});
	});
	

	var error = req.flash('error');
	var success = req.flash('success');

	return Promise.all([p1, p2, p3, p4, p5]).then(values => {		
		const shopId = req.params.shopId;

		var vendorrvalue = values[0];

		var runningData = values[1];
		var globalrunning = Array();
		if(runningData.code >= 200 && runningData.code <= 300){
			globalrunning.totalcount = runningData.data.count;
			globalrunning.totalrows = runningData.data.rows;
		}
		else{
			globalrunning.totalcount = 0;
			globalrunning.totalrows = null;
		}

		const pageCount = Math.ceil(globalrunning.totalcount / req.query.limit);

		var requestedData = values[2];
		var globalrequested = Array();
		if(requestedData.code >= 200 && requestedData.code <= 300){
			globalrequested.totalcount = requestedData.data.count;
			globalrequested.totalrows = requestedData.data.rows;
		}
		else{
			globalrequested.totalcount = 0;
			globalrequested.totalrows = null;
		}

		var activeData = values[3];
		if(activeData.code >= 200 && activeData.code <= 300){
			activetotalcount = activeData.data;
		}
		else{
			activetotalcount = 0;
		}

		var promoCreditLeft = vendorrvalue.data.mxnRunningPromo - activetotalcount;

		var rejectedData = values[4];
		var globalrejected = Array();
		if(rejectedData.code >= 200 && rejectedData.code <= 300){
			globalrejected.totalcount = rejectedData.data.count;
			globalrejected.totalrows = rejectedData.data.rows;
		}
		else{
			globalrejected.totalcount = 0;
			globalrejected.totalrows = null;
		}

		var layout = getLayout(req);
		var dropdownPages = getDropdownPages();
      var apptitle = process.env.AppTitle;
		var headtitle = "Vendor Promotion";

		var fullUrl = req.protocol + '://' + req.get('host') + encodeURIComponent(req.originalUrl);
		
		res.render('promotions/view-vendor', {
			title: 'View Vendor Promotion - ' + apptitle,
			layout: layout,
         // helpers,
         apptitle,
			headtitle,
			dropdownPages,
			shopId: shopId,
			data: vendorrvalue.data,
			runningcount: globalrunning.totalcount,
			runningrows: globalrunning.totalrows,
			requestedcount: globalrequested.totalcount,
			requestedrows: globalrequested.totalrows,
			rejectedcount: globalrejected.totalcount,
			rejectedrows: globalrejected.totalrows,
			promoCreditLeft,
			hasMessages: (error.length || success.length) > 0 ? true : false,
			error: error,
			success: success,
			query: req.query,
			pageCount,
			has_more: res.locals.paginate.hasNextPages(pageCount),
			pages: paginate.getArrayPages(req)(7, pageCount, req.query.page),
			paginationTexts: paginationTexts(req.query.page, globalrunning.totalcount, req.query.limit),
			firstPageUrl: firstPageUrlFunc(req, pageCount),
			lastPageUrl: lastPageUrlFunc(req, pageCount),
			fullUrl: fullUrl
		});
	});
};

module.exports.vendorPromoDecline = function (req, res, next) {	
	promotionsFunctions.editdata(req, function (req, responseData) {		
		// var promotionId = req.body.promotionId;		
		if(responseData.code >= 200 && responseData.code <= 300){
			req.flash('success', responseData.msg);
			// res.redirect(responseData.redirect);
		}
		else{
			req.flash('error', responseData.msg);
			// res.redirect('/promotions/edit/' + promotionId + '?redirect=' + responseData.redirect);
		}		
		res.redirect(decodeURIComponent(responseData.redirect));
		// res.redirect('/promotions/vendorpromo/view/' + promotionId);
	});
};

module.exports.vendorPromoAdd = function (req, res, next) {
	var p1 = new Promise((resolve, reject) => {
		vendorsFunctions.edit(req, function (req, responseData) {
			resolve(responseData);	
		})
		// resolve();
	});

	var p2 = new Promise((resolve, reject) => {
		promotionsFunctions.replacePromo(req, function (req, responseData) {
			resolve(responseData);	
		})
	});

	var error = req.flash('error');
	var success = req.flash('success');

	return Promise.all([p1, p2]).then(values => {		
		var rvalue = values[0];
		var rvaluereplace = values[1];

		var layout = getLayout(req);
		var dropdownPages = getDropdownPages();
		var tierTypes = getTierTypes();
      var apptitle = process.env.AppTitle;
		var headtitle = "Vendor Promotion";
		console.log(rvalue.data);
		
		res.render('promotions/add-vendor', {
			title: 'Add Vendor Promotion - ' + apptitle,
			layout: layout,
         // helpers,
         apptitle,
			headtitle,
			dropdownPages,
			tierTypes,
			data: rvalue.data,
			replacePromo: rvaluereplace.data,
			hasMessages: (error.length || success.length) > 0 ? true : false,
			error: error,
			success: success,
			query: req.query,
		});
	});
};