'use strict';
var compose = require('composable-middleware');

module.exports.isAuthenticated = function () {
	return compose()
		// Attach user to request
		.use(function (req, res, next) {
			if (req.session.sessionexipretime != undefined && CONFIG.jwt_expiration > req.session.sessionexipretime) {
				return res.redirect('/auth/logout');
			}
			else if (req.session.user != undefined) {
				return next();
			} else {
				return res.redirect('/auth');
			}
		})
}

module.exports.isAdminstrator = function () {
	return compose()
		.use(function meetsRequirements(req, res, next) {
			if (req.session.user === undefined) {
				return res.redirect('/auth/logout');
			}
			else if (req.session.user.role == 0) {
				next();
			} else {
				return res.redirect('/auth');
			}
		})
}

module.exports.isVendor = function () {
	return compose()
		.use(function meetsRequirements(req, res, next) {
			if (req.session.user === undefined) {
				return res.redirect('/auth/logout');
			}
			else if (req.session.user.role == 1) {
				next();
			} else {
				return res.redirect('/auth');
			}
		})
}

module.exports.isConsumer = function () {
	return compose()
		.use(function meetsRequirements(req, res, next) {
			if (req.session.user === undefined) {
				return res.redirect('/auth/logout');
			}
			else if (req.session.user.role == 2) {
				next();
			} else {
				return res.redirect('/auth');
			}
		})
}

module.exports.isAdmin = function () {
	return compose()
		.use(function meetsRequirements(req, res, next) {
			if (req.session.user === undefined) {
				return res.redirect('/auth/logout');
			}
			else if (req.session.user.role == 3) {
				next();
			} else {
				return res.redirect('/auth');
			}
		})
}