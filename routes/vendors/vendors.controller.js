var helpers = require('handlebars-helpers')();
const paginate = require('express-paginate');
// var handlebars = require('handlebars');
var hbs = require('express-hbs');

var vendorsFunctions = require('../../controllers/vendors-functions.js');
var usersFunctions = require('../../controllers/users-functions.js');

module.exports.list = function (req, res, next) {
	var p1 = new Promise((resolve, reject) => {
		vendorsFunctions.list(req, function (req, responseData) {
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
		var headtitle = "Vendor";

		var fullUrl = req.protocol + '://' + req.get('host') + encodeURIComponent(req.originalUrl);

		res.render('vendors/index', {
			title: 'Vendors - ' + apptitle,
			addBtn: new hbs.handlebars.SafeString('<a href="/vendors/add" class=""><span class="m-menu__link-text"><span class="btn btn-warning whitefont m--font-boldest">Add New Vendor</span></span></a>'),
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
		vendorsFunctions.edit(req, function (req, responseData) {
			resolve(responseData);	
		})
	});

	var p2 = new Promise((resolve, reject) => {
		vendorsFunctions.QRUrl(req, function (req, responseData) {
			resolve(responseData);	
		})
	})

	var error = req.flash('error');
	var success = req.flash('success');

	return Promise.all([p1, p2]).then(values => {		
		var rvalue = values[0];
		var qrstrData = values[1];

		var layout = getLayout(req);
		var dropdownPages = getDropdownPages();
      var apptitle = process.env.AppTitle;
		var headtitle = "Vendor";
		
		res.render('vendors/edit', {
			title: 'Edit Vendors - ' + apptitle,
			layout: layout,
         // helpers,
         apptitle,
			headtitle,
			dropdownPages,
			data: rvalue.data,
			qrurlr: qrstrData.data,
			hasMessages: (error.length || success.length) > 0 ? true : false,
			error: error,
			success: success,
			query: req.query,
		});
	});
};

module.exports.editdata = function (req, res, next) {	
	vendorsFunctions.editdata(req, function (req, responseData) {		
		var shopId = req.body.shopId;
		if(responseData.code >= 200 && responseData.code <= 300){
			req.flash('success', responseData.msg);
			// res.redirect(responseData.redirect);
		}
		else{
			req.flash('error', responseData.msg);
			// res.redirect('/vendors/edit/' + shopId + '?redirect=' + responseData.redirect);
		}
		res.redirect('/vendors/edit/' + shopId);
	});
};

module.exports.editStatus = function (req, res, next) {
	var p1 = new Promise((resolve, reject) => {
		vendorsFunctions.editStatus(req, function (req, responseData) {
			resolve(responseData);
		});
	});

	Promise.all([p1]).then(values => {
		return ReS(res, values[0].data);
	})
};

module.exports.updateStatus = function (req, res, next) {
	var p1 = new Promise((resolve, reject) => {
		vendorsFunctions.updateStatus(req, function (req, responseData) {
			resolve(responseData);
		});
	});

	Promise.all([p1]).then(values => {
		return ReS(res, values[0].data);
	})
};

module.exports.tierEdit = function (req, res, next) {
	var p1 = new Promise((resolve, reject) => {
		vendorsFunctions.tierEdit(req, function (req, responseData) {
			resolve(responseData);	
		})
	})

	var error = req.flash('error');
	var success = req.flash('success');

	return Promise.all([p1]).then(values => {		
		var rvalue = values[0];

		var layout = getLayout(req);
		var dropdownPages = getDropdownPages();
		var tierTypes = getTierTypes();
      var apptitle = process.env.AppTitle;
		var headtitle = "Vendor Tier";
		
		res.render('vendors/tieredit', {
			title: 'Edit Tiers - ' + apptitle,
			layout: layout,
         // helpers,
         apptitle,
			headtitle,
			dropdownPages,
			tierTypes,
			data: rvalue.data,
			hasMessages: (error.length || success.length) > 0 ? true : false,
			error: error,
			success: success,
			query: req.query,
		});
	});
};

module.exports.tierEditdata = function (req, res, next) {	
	vendorsFunctions.tierEditdata(req, function (req, responseData) {		
		var tierId = req.body.tierId;
		if(responseData.code >= 200 && responseData.code <= 300){
			req.flash('success', responseData.msg);
			// res.redirect(responseData.redirect);
		}
		else{
			req.flash('error', responseData.msg);
			// res.redirect('/vendors/tier/edit/' + tierId + '?redirect=' + responseData.redirect);
		}
		res.redirect('/vendors/tier/edit/' + tierId);
	});
};

module.exports.tierAdd = function (req, res, next) {
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
		var headtitle = "Vendor Tier";
		var shopId = parseInt(req.params.shopId);
		
		res.render('vendors/tieradd', {
			title: 'Add Tiers - ' + apptitle,
			layout: layout,
         // helpers,
         apptitle,
			headtitle,
			dropdownPages,
			tierTypes,
			shopId,
			// data: rvalue.data,
			hasMessages: (error.length || success.length) > 0 ? true : false,
			error: error,
			success: success,
			query: req.query,
		});
	});
};

module.exports.tierAddnew = function (req, res, next) {	
	vendorsFunctions.tierAddnew(req, function (req, responseData) {		
		var shopId = req.body.shopId;
		if(responseData.code >= 200 && responseData.code <= 300){
			req.flash('success', responseData.msg);
			// res.redirect(responseData.redirect);
		}
		else{
			req.flash('error', responseData.msg);
			// res.redirect('/vendors/edit/' + shopId + '?redirect=' + responseData.redirect);
		}
		res.redirect('/vendors/edit/' + shopId);
	});
};

module.exports.accountroleAdd = function (req, res, next) {
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
		var headtitle = "Vendor Account Role";
		var shopId = parseInt(req.params.shopId);
		
		res.render('vendors/accountroleadd', {
			title: 'Add Account Role - ' + apptitle,
			layout: layout,
         // helpers,
         apptitle,
			headtitle,
			dropdownPages,
			tierTypes,
			shopId,
			// data: rvalue.data,
			hasMessages: (error.length || success.length) > 0 ? true : false,
			error: error,
			success: success,
			query: req.query,
		});
	});
};

module.exports.accountroleAddnew = function (req, res, next) {	
	var shopId = req.body.shopId;
	usersFunctions.addnew(req, function (req, responseData) {
		if(responseData.code >= 200 && responseData.code <= 300){
			req.flash('success', responseData.msg);
			// res.redirect(responseData.redirect);
		}
		else{
			req.flash('error', responseData.msg);
			// res.redirect('/vendors/edit/' + shopId + '?redirect=' + responseData.redirect);
		}
		res.redirect('/vendors/edit/' + shopId);
	});
};

module.exports.accountroleEdit = function (req, res, next) {
	var shopId = req.params.shopId;
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
		var tierTypes = getTierTypes();
      var apptitle = process.env.AppTitle;
		var headtitle = "Vendor Account Role";
		
		res.render('vendors/accountroleedit', {
			title: 'Edit Account Role - ' + apptitle,
			layout: layout,
         // helpers,
         apptitle,
			headtitle,
			dropdownPages,
			tierTypes,
			data: rvalue.data,
			shopId: shopId,
			hasMessages: (error.length || success.length) > 0 ? true : false,
			error: error,
			success: success,
			query: req.query,
		});
	});
};

module.exports.accountroleEditdata = function (req, res, next) {
	var shopId = req.params.shopId;
	var userId = req.body.userId;	
	usersFunctions.editdata(req, function (req, responseData) {		
		if(responseData.code >= 200 && responseData.code <= 300){
			req.flash('success', responseData.msg);
			// res.redirect(responseData.redirect);
		}
		else{
			req.flash('error', responseData.msg);
			// res.redirect('/vendors/tier/edit/' + tierId + '?redirect=' + responseData.redirect);
		}
		res.redirect('/vendors/'+shopId+'/accountrole/edit/' + userId);
	});
};

module.exports.checkUniqueField = function (req, res, next) {
	var p1 = new Promise((resolve, reject) => {
		if(req.query.username){
			req.params.fieldName = "username";
   		req.params.fieldValue = req.query.username;
		}
		if(req.query.email){
			req.params.fieldName = "email";
   		req.params.fieldValue = req.query.email;
		}
		if(req.query.phone){
			req.params.fieldName = "phone";
   		req.params.fieldValue = req.query.phone;
		}
		
		usersFunctions.checkUniqueField(req, function (req, responseData) {
			resolve(responseData);
		});
	});

	Promise.all([p1]).then(values => {
		return ReS(res, values[0].code);
	})
};
	
module.exports.editVendorLogo = function (req, res, next) {

	var p1 = new Promise((resolve, reject) => {
		vendorsFunctions.editVendorLogo(req, function (req, responseData) {
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
		var headtitle = "Vendor";
		var shopId = parseInt(req.params.shopId);
		
		res.render('vendors/add', {
			title: 'Add Vendor - ' + apptitle,
			layout: layout,
         // helpers,
         apptitle,
			headtitle,
			dropdownPages,
			tierTypes,
			shopId,
			// data: rvalue.data,
			hasMessages: (error.length || success.length) > 0 ? true : false,
			error: error,
			success: success,
			query: req.query,
		});
	});
};

module.exports.addnew = function (req, res, next) {	
	vendorsFunctions.addnew(req, function (req, responseData) {		
		if(responseData.code >= 200 && responseData.code <= 300){
			req.flash('success', responseData.msg);
			// res.redirect(responseData.redirect);
		}
		else{
			req.flash('error', responseData.msg);
			// res.redirect('/vendors/edit/' + shopId + '?redirect=' + responseData.redirect);
		}
		res.redirect('/vendors');
	});
};

module.exports.docUploadNew = function (req, res, next) {

	var p1 = new Promise((resolve, reject) => {
		vendorsFunctions.docUploadNew(req, function (req, responseData) {
			resolve(responseData);
		});
	});

	Promise.all([p1]).then(values => {
		return ReS(res, values[0]);
	});

};

module.exports.docDelete = function (req, res, next) {	
	vendorsFunctions.docDelete(req, function (req, responseData) {		
		var shopId = req.params.shopId;
		if(responseData.code >= 200 && responseData.code <= 300){
			req.flash('success', responseData.msg);
			// res.redirect(responseData.redirect);
		}
		else{
			req.flash('error', responseData.msg);
			// res.redirect('/vendors/edit/' + shopId + '?redirect=' + responseData.redirect);
		}
		res.redirect('/vendors/edit/' + shopId);
	});
};