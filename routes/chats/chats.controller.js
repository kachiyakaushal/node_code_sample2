var helpers = require('handlebars-helpers')();
const paginate = require('express-paginate');

var chatsFunctions = require('../../controllers/chats-functions.js');

module.exports.list = function (req, res, next) {
	var p1 = new Promise((resolve, reject) => {
		resolve();
	})

	var error = req.flash('error');
	var success = req.flash('success');

	return Promise.all([p1]).then(values => {		
		var responseData = values[0];
		// console.log(responseData);
		
		// var globaldata = Array();
		// if(responseData.code >= 200 && responseData.code <= 300){
		// 	globaldata.totalcount = responseData.data.count;
		// 	globaldata.totalrows = responseData.data.rows;
		// }
		// else{
		// 	globaldata.totalcount = 0;
		// 	globaldata.totalrows = null;
		// }

		// const pageCount = Math.ceil(globaldata.totalcount / req.query.limit);

		var layout = getLayout(req);
		// var dropdownPages = getDropdownPages();
      var apptitle = process.env.AppTitle;
		var headtitle = "Chat Support";

		var fullUrl = req.protocol + '://' + req.get('host') + encodeURIComponent(req.originalUrl);

		res.render('chats/index', {
			title: 'Chat Support - ' + apptitle,
			layout: layout,
         // helpers,
         apptitle,
			headtitle,
			// dropdownPages,
			// totalcount: globaldata.totalcount,
			// totalrows: globaldata.totalrows,
			hasMessages: (error.length || success.length) > 0 ? true : false,
			error: error,
			success: success,
			query: req.query,
			// pageCount,
			// has_more: res.locals.paginate.hasNextPages(pageCount),
			// pages: paginate.getArrayPages(req)(7, pageCount, req.query.page),
			// paginationTexts: paginationTexts(req.query.page, globaldata.totalcount, req.query.limit),
			// firstPageUrl: firstPageUrlFunc(req, pageCount),
			// lastPageUrl: lastPageUrlFunc(req, pageCount),
			fullUrl: fullUrl,
			servercharurl: process.env.CHATURL,
		});
	});
};

module.exports.chatRooms = function (req, res, next) {
	var p1 = new Promise((resolve, reject) => {
		chatsFunctions.chatRooms(req, function (req, responseData) {
			resolve(responseData);
		});
	});

	Promise.all([p1]).then(values => {
		var responseData = values[0];
		if(responseData.code >= 200 && responseData.code <= 300){
			var vData = responseData.data.rows;			
			var chatRoomsHtml = '';
			vData.forEach(function(element){

				var conterHtml = "";
				if(element.messagesUnread != 0){
					conterHtml = '<div class="numberdiv"><span>'+element.messagesUnread+'</span></div>';
				}

				var onlinemarkHtml = "";
				if(element.isOnline == 1){
					onlinemarkHtml = '<span class="onlinemark"></span>';
				}
				
				chatRoomsHtml += '<div class="chatmainrow"><a href="javascript:;" onclick="switchRoom(this)" data-username="'+element.consumerUsername+'" data-room="'+element.room+'" data-isonline="'+element.isOnline+'" data-lastseen="'+element.lastSeen+'">'+conterHtml+'<div class="row align-items-center"><div class="col-auto chatpimg pr-0"><img src="'+element.consumerProfilePictureLink+'" alt="">'+onlinemarkHtml+'</div><div class="col"><div class="nametxt">'+element.consumerName+'</div><div class="lmsgtxt">'+stringLimit(element.lastMessage)+'</div></div></div><div class="datediv">'+chatDateFormat(element.lastMessageDate)+'</div></a></div>';
			})
		}
		else{

		}

		return ReS(res, chatRoomsHtml);	
	})
};

module.exports.search = function (req, res, next) {
	var p1 = new Promise((resolve, reject) => {
		chatsFunctions.search(req, function (req, responseData) {
			resolve(responseData);
		});
	});

	Promise.all([p1]).then(values => {
		var responseData = values[0];
		if(responseData.code >= 200 && responseData.code <= 300){
			var vData = responseData.data.rows;
			var chatRoomsHtml = '';
			vData.forEach(function(element){
				chatRoomsHtml += '<div class="chatmainrow"><a href="javascript:;" onclick="switchRoom(this)" data-username="'+element.consumerUsername+'" data-room="'+element.room+'"><div class="row align-items-center"><div class="col-auto chatpimg pr-0"><img src="'+element.consumerProfilePictureLink+'" alt=""></div><div class="col"><div class="nametxt">'+element.consumerName+'</div><div class="lmsgtxt">'+stringLimit(element.lastMessage)+'</div></div></div><div class="datediv">'+chatDateFormat(element.lastMessageDate)+'</div></a></div>';

				// chatRoomsHtml += '<div class="chatmainrow"><a href="javascript:;" onclick="switchRoom(this)" data-username="'+element.consumerUsername+'"><div class="row align-items-center"><div class="col-auto chatpimg pr-0"><img src="'+element.consumerProfilePictureLink+'" alt=""></div><div class="col"><div class="nametxt">'+element.consumerName+'</div><div class="lmsgtxt">'+element.lastMessage+'</div></div></div><div class="datediv">'+element.lastMessageDate+'</div></a></div>';
			})
		}
		else{

		}

		return ReS(res, chatRoomsHtml);	
	})
};

module.exports.getMessages = function (req, res, next) {
	var p1 = new Promise((resolve, reject) => {
		chatsFunctions.getMessages(req, function (req, responseData) {
			resolve(responseData);
		});
	});

	Promise.all([p1]).then(values => {
		if(values[0].code >= 200 && values[0].code <= 300){
			return ReS(res, values[0]);
		}
		else{
			return ReE(res, values[0]);
		}		
	})
};