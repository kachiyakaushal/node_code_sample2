var express = require('express');
var router = express.Router();

var controller = require('./vendors.controller');

router.get('/', controller.list);
router.get('/edit/:shopId', controller.edit);
router.post('/editdata', controller.editdata);
router.post('/editvendorlogo', controller.editVendorLogo);
router.get('/editStatus/:shopId/status/:status', controller.editStatus);
router.get('/add', controller.add);
router.post('/addnew', controller.addnew);
router.post('/docupload/:shopId/addnew', controller.docUploadNew);
router.get('/docupload/:shopId/delete/:docId', controller.docDelete);

router.get('/tier/:tierId/status/:status', controller.updateStatus);
router.get('/tier/edit/:tierId', controller.tierEdit);
router.post('/tier/editdata', controller.tierEditdata);
router.get('/tier/add/:shopId', controller.tierAdd);
router.post('/tier/addnew', controller.tierAddnew);

router.get('/accountrole/add/:shopId', controller.accountroleAdd);
router.post('/accountrole/addnew', controller.accountroleAddnew);
router.get('/:shopId/accountrole/edit/:userId', controller.accountroleEdit);
router.post('/:shopId/accountrole/editdata', controller.accountroleEditdata);

router.get('/checkUniqueField', controller.checkUniqueField);

module.exports = router;