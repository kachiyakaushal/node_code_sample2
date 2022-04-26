var express = require('express');
var router = express.Router();

var controller = require('./promotions.controller');

router.get('/', function(req, res, next){
   res.redirect('/promotions/allpromo');
});

router.get('/allpromo', controller.list);
router.get('/adminpromo', controller.adminList);
router.get('/vendorpromo', controller.vendorList);

router.get('/edit/:promotionId', controller.edit);
router.post('/editdata', controller.editdata);
router.post('/editpimg', controller.editPImg);

router.get('/add', controller.add);
router.post('/addnew', controller.addnew);
router.post('/addpimg', controller.addPImg);

router.get('/promotion/:promotionId/status/:status', controller.updateStatus);
router.post('/updateorder', controller.updateOrder);

router.get('/vendorpromo/view/:shopId', controller.vendorPromo);
router.post('/vendorpromo/decline', controller.vendorPromoDecline);
router.get('/vendorpromo/add/:shopId', controller.vendorPromoAdd);

module.exports = router;