var express = require('express');
var router = express.Router();

var controller = require('./my-account.controller');

router.get('/', controller.edit);
router.post('/', controller.editdata);
router.post('/changepassword', controller.changePassword);

module.exports = router;