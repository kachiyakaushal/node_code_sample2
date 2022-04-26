var helpers = require('handlebars-helpers')();

var myaccountFunctions = require('../../controllers/my-account-functions.js');

module.exports.edit = function (req, res, next) {
	var p1 = new Promise((resolve, reject) => {
		myaccountFunctions.edit(req, function (req, responseData) {
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
		var headtitle = "Profile";
		
		res.render('my-account/edit', {
			title: 'Edit Profile - ' + apptitle,
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
	myaccountFunctions.editdata(req, function (req, responseData) {
		if(responseData.code >= 200 && responseData.code <= 300){
			req.flash('success', responseData.msg);
		}
		else{
			req.flash('error', responseData.msg);
		}
		res.redirect('/my-account');
	});
};

module.exports.changePassword = function (req, res, next) {	
	myaccountFunctions.changePassword(req, function (req, responseData) {
		if(responseData.code >= 200 && responseData.code <= 300){
			req.flash('success', responseData.msg);
		}
		else{
			req.flash('error', responseData.msg);
		}
		res.redirect('/my-account');
	});
};