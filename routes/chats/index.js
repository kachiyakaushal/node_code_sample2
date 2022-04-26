module.exports = function(io){
   var express = require('express');
   var router = express.Router();

   var auth = require('../../middleware/auth');

   var controller = require('./chats.controller');

   router.get('/', auth.isAuthenticated(), controller.list);
   router.get('/chatrooms', auth.isAuthenticated(), controller.chatRooms);
   router.get('/search/:stexts', auth.isAuthenticated(), controller.search);
   router.post('/getmessages', auth.isAuthenticated(), controller.getMessages);

   return router;
}
// module.exports = router;