var express = require('express');
var router = express.Router();

var controller = require('./users.controller');

router.get('/', controller.list);
router.get('/edit/:userId', controller.edit);
router.post('/editdata', controller.editdata);
router.post('/edituserlogo', controller.editUserLogo);

router.post('/passwordreset', controller.passwordReset);
router.post('/multiplestatuses', controller.multipleStatuses);

router.post('/deleteuser', controller.deleteUser);

// router.get('/usertransactions', controller.usertransactions);

module.exports = router;