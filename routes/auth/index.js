var express = require('express');

var controller = require('./auth.controller');
var router = express.Router();

var helpers = require('handlebars-helpers')();

router.get('/logout', function (req, res, next) {
	req.flash('error', "Logged out successfully.");
	req.session.user = null;
	
	return res.redirect('/auth');
});

router.get('/', function (req, res, next) {
    var error = req.flash('error');
    var success = req.flash('success');
    var actionurl = '/auth';
    
    var layoutauth = 'layout-auth';
    var apptitle = process.env.AppTitle;

    res.render('auth/index', {
        title: 'Login - ' + apptitle,
        layout: layoutauth,
        actionurl,
        hasMessages: (error.length || success.length) > 0 ? true : false,
        error: error,
        success: success,
        // helpers,
        apptitle
    });
});
router.post("/", controller.login);

module.exports = router;