ReE = function(res, err, code) {
  // Error Web Response
  if (typeof err == "object" && typeof err.message != "undefined") {
    err = err.message;
  }
  if (typeof code !== "undefined") res.statusCode = code;

  return res.json({ success: false, message: err });
};

ReS = function(res, msg, data, code) {
  // Success Web Response
  let send_data = { success: true, message: msg };
  if (typeof data == "object") {
    send_data = Object.assign(data, send_data); //merge the objects
  }
  if (typeof code !== "undefined") res.statusCode = code;

  return res.json(send_data);
};

randomStr = function(m, remove_unessery = false) {
  var m = m || 9;
  s = "";
  let r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789";

  if (remove_unessery)
    r = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";

  for (var i = 0; i < m; i++) {
    s += r.charAt(Math.floor(Math.random() * r.length));
  }
  return s;
};

randomNum = function(m) {
  var m = m || 4;
  s = "";
  let r = "123456789";

  for (var i = 0; i < m; i++) {
    s += r.charAt(Math.floor(Math.random() * r.length));
  }
  return s;
};

generateRandomKey = function (length) {
  let start = 2;
  let stop = parseInt(length) + start;
  return Math.random().toString(36).substring(start, stop);
}

checkisArray = function(a) {
  return (!!a) && (a.constructor === Array);
};

checkisObject = function(a) {
  return (!!a) && (a.constructor === Object);
};
;

cleanArray = function (obj) {
  let newObj = {};
  Object.keys(obj).forEach((prop) => {
    if (obj[prop]) { newObj[prop] = obj[prop]; }
  });
  return newObj;
}

checkDirectorySync = function (directory) {
  const fs = require('fs');
  return new Promise((resolve, reject) => {
     fs.stat(directory, function (err) {
        if (err) {
           //Check if error defined and the error code is "not exists"
           if (err.code === 'ENOENT') {
              fs.mkdir(directory, (error) => {
                 if (error) {
                    if (err.code === 'ENOENT')
                       reject(new Error('Upload Directory Not Found!'));
                    else
                       reject(error);
                 } else {
                    resolve(directory);
                 }
              });
           } else {
            //just in case there was a different error:            
            reject(err);
           }
        } else {
          resolve(directory);
        }
     });
  });
}

deleteFileSync = function(filepath){
  const fs = require('fs');
	if (fs.existsSync(filepath)) {
		fs.unlinkSync(filepath);
		return true;
	}
	else{
		return false;	
	}
}

updateOrCreate = async function (model, where, newItem) {
  // First try to find the record
  const foundItem = await model.findOne({where: where});
  if (!foundItem) {
    // Item not found, create a new one
    const item = await model.create(newItem)
    return  {item, created: true};
  }
  // Found an item, update it
  const item = await model.update(newItem, {where: where});
  return {item, created: false};
}

makeposturl = function (url) {
	var ajaxurl = process.env.server_url;
	var postajaxurl = ajaxurl + url;

	return postajaxurl;
}

getLayout = function(req) {  
  if (req.session.user.role == 0) {
    return 'layout-administrator';
  }
  else if (req.session.user.role == 1) {
    return 'layout-vendor';
  }
  else if (req.session.user.role == 2) {
    return 'layout-consumer';
  }
  else if (req.session.user.role == 3) {
    return 'layout-admin';
  }
};

getDropdownPages = function() {  
  var s = [ 10, 25, 50, 100, 200, 500, 1000, 2000, 5000 ];
  return s;
};

updateQueryStringParameter = function (uri, key, value) {
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = uri.indexOf('?') !== -1 ? "&" : "?";
  if (uri.match(re)) {
    return uri.replace(re, '$1' + key + "=" + value + '$2');
  }
  else {
    return uri + separator + key + "=" + value;
  }
}

firstPageUrlFunc = function (req, pageCount) {
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  var firstPageUrl = "";
  if(req.query.page != 1){
    var firstPageUrl = updateQueryStringParameter(fullUrl, "page", "1");
  }

  return firstPageUrl;
}

lastPageUrlFunc = function (req, pageCount) {
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  var lastPageUrl = "";
  if(req.query.page != pageCount){
    var lastPageUrl = updateQueryStringParameter(fullUrl, "page", pageCount);
  }

  return lastPageUrl;
}

getTierTypes = function () {
  var s = [ "Privilege", "Unlimited Redeem" ];
  return s;
}

rmDir = function (dirPath) {
  const fs = require('fs');
	try { var files = fs.readdirSync(dirPath); }
	catch (e) { return; }
	if (files.length > 0){
		for (var i = 0; i < files.length; i++) {
			var filePath = dirPath + '/' + files[i];
			if (fs.statSync(filePath).isFile()){
				fs.unlinkSync(filePath);
			}
			else{
				rmDir(filePath);
			}
		}
	}
};

leftPad = function (number, targetLength) {
	var output = number + '';
	while (output.length < targetLength) {
		output = '0' + output;
	}
	return output;
}

paginationTexts = function(currentpage, itemCount, limit){

	var start = 1;
	if(currentpage > 1){
	  start = (currentpage * limit) - limit + 1;
	}
	if(itemCount == 0){
	  start = 0;
	}
 
	var end = limit;
	if(currentpage > 1){
	  end = currentpage * limit;
	}
 
	if(end>=itemCount){
	  end = itemCount;
	}
 
	return "Showing "+start+" to "+end+" of "+itemCount+" entries";
};

stringLimit = function(string, limit = 40){
  var trimmedString = string.length > limit ? string.substring(0, limit - 3) + "..." : string;
  return trimmedString;
}

chatDateFormat = function(msgdate){
  if(!msgdate){ return ""; }

  const moment = require('moment');
  
  var todaysDate = moment();
  var oldDate = moment(msgdate);
  var diffDays = oldDate.diff(todaysDate, 'days');
  
  var retdate = moment(msgdate).format("DD MMM YYYY, hh:mm A")

  if(diffDays == 0){
    retdate = moment(msgdate).format("hh:mm A")
  }

  return retdate;
}