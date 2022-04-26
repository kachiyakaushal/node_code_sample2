require("./config/config");
require("./helpers");

var createError = require('http-errors');
var express = require('express');
var path = require('path');
const fs = require('fs');
var cookieParser = require('cookie-parser');
var logger = require("morgan");
var validator = require("express-validator");
var passport = require("passport");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var cors = require("cors");
var useragent = require('express-useragent');
var flash = require('connect-flash');

const paginate = require('express-paginate');
var moment = require('moment');
var hbs = require('express-hbs');

var helpers = require('handlebars-helpers')({
	handlebars: hbs.handlebars
});

var app = express();

var io = require('./io');

var indexRouter = require('./routes/index');
var chatRouter = require('./routes/chats/index')(io);

app.engine('hbs', hbs.express4({
	layoutsDir: path.join(__dirname, "views/layouts"),
	partialsDir: __dirname + '/views/partials',
	extname: '.hbs',
	helpers: helpers
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');


app.use(helmet());
app.use(helmet.frameguard());
app.use(helmet.noCache());
app.use(cors());
app.use(useragent.express());
app.use(bodyParser.json({ defaultCharset: "utf-8", limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(validator());
app.use(passport.initialize());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(paginate.middleware(10, 100000));
app.use(flash());
app.use('/npmscripts', express.static(__dirname + '/node_modules/'));

var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

var options = {
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME
};

var sessionStore = new MySQLStore(options);

app.use(session({
	store: sessionStore,
	secret: process.env.APP_PASSWORD,
	resave: false,
	saveUninitialized: true,
}));

app.use(function (req, res, next) {
	res.locals.user = req.session.user;
	res.locals.url = req.url;
	res.locals.surl = path.basename(req.url);
	res.locals.currentpage = req.query.page || null;
	next();
});

app.use('/', indexRouter);
app.use('/chats', chatRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = err;

	// render the error page
	res.status(err.status || 500);
	res.render('error', {
		title: process.env.AppTitle + ' - Error',
		layout: ''
	});
});

hbs.registerHelper('ifCond', function (v1, operator, v2, options) {

	switch (operator) {
		case "==":
			return (v1 == v2) ? options.fn(this) : options.inverse(this);

		case "!=":
			return (v1 != v2) ? options.fn(this) : options.inverse(this);

		case "===":
			return (v1 === v2) ? options.fn(this) : options.inverse(this);

		case "!==":
			return (v1 !== v2) ? options.fn(this) : options.inverse(this);

		case "&&":
			return (v1 && v2) ? options.fn(this) : options.inverse(this);

		case "||":
			return (v1 || v2) ? options.fn(this) : options.inverse(this);

		case "<":
			return (v1 < v2) ? options.fn(this) : options.inverse(this);

		case "<=":
			return (v1 <= v2) ? options.fn(this) : options.inverse(this);

		case ">":
			return (v1 > v2) ? options.fn(this) : options.inverse(this);

		case ">=":
			return (v1 >= v2) ? options.fn(this) : options.inverse(this);

		default:
			return eval("" + v1 + operator + v2) ? options.fn(this) : options.inverse(this);
	}
});

hbs.registerHelper({
	// eq: function (v1, v2) {
	// 	return v1 === v2;
	// },
	ne: function (v1, v2) {
		return v1 !== v2;
	},
	lt: function (v1, v2) {
		return v1 < v2;
	},
	gt: function (v1, v2) {
		return v1 > v2;
	},
	lte: function (v1, v2) {
		return v1 <= v2;
	},
	gte: function (v1, v2) {
		return v1 >= v2;
	}
});

hbs.registerHelper('idformat', function (id) {
	return "#" + leftPad(id, 6);
});

hbs.registerHelper('formatTime', function (time, format) {
	return moment(time, "HH:mm:ss").format(format);
	//return moment("123", "hmm").format("h:mm:ss A");
});

hbs.registerHelper('dataFromObject', function (obj, key) {
	var returnval = null;
	obj.forEach(element => {
		if (element.meta_key == key) {
			returnval = element.meta_value;
		}
	});
	return returnval;
});

hbs.registerHelper('if_even', function (conditional, options) {
	if ((conditional % 2) == 0) {
		return options.fn(this);
	} else {
		return options.inverse(this);
	}
});

hbs.registerHelper("setVar", function (varName, varValue, options) {
	options.data.root[varName] = varValue;
});

hbs.registerHelper('substrss', function (str) {
	if (!str) {
		return;
	}
	var substr = str.substring(str.length - 4, str.length);
	var startstrl = (str.length) - 4;
	var startstr = "";
	for (let index = 1; index <= startstrl; index++) {
		startstr += "*";
	}
	return startstr + substr;
});

hbs.registerHelper('arrowUp', function (sorBy, query) {
	var activecls = "";
	if (query.sortBy !== undefined && query.sortBy == sorBy && query.sortOrder == "ASC") {
		activecls = "active";
	}

	var rstr = "<i class='fa fa-long-arrow-alt-up ctriggerclick " + activecls + "' data-sortby='" + sorBy + "' data-sortorder='ASC'></i>";
	rstr = new hbs.handlebars.SafeString(rstr);
	return rstr;
});
hbs.registerHelper('arrowDown', function (sorBy, query) {
	var activecls = "";
	if (query.sortBy !== undefined && query.sortBy == sorBy && query.sortOrder == "DESC") {
		activecls = "active";
	}

	var rstr = "<i class='fa fa-long-arrow-alt-down ctriggerclick " + activecls + "' data-sortby='" + sorBy + "' data-sortorder='DESC'></i>";
	rstr = new hbs.handlebars.SafeString(rstr);
	return rstr;
});

hbs.registerHelper('arrowUpLocal', function (n, sortBy, tableId) {
	var rstr = "<i class='faup" + n + " fa fa-long-arrow-alt-up curporange' onclick=\"w3.sortHTML('#" + tableId + "', '.rowitem', 'td:nth-child(" + n + ")', '" + sortBy + "', " + n + ")\"></i>";
	rstr = new hbs.handlebars.SafeString(rstr);
	return rstr;
});
hbs.registerHelper('arrowDownLocal', function (n, sortBy, tableId) {
	var rstr = "<i class='fadown" + n + " fa fa-long-arrow-alt-down curporange' onclick=\"w3.sortHTML('#" + tableId + "', '.rowitem', 'td:nth-child(" + n + ")', '" + sortBy + "', " + n + ")\"></i>";

	rstr = new hbs.handlebars.SafeString(rstr);
	return rstr;
});

hbs.registerHelper('sortIcons', function (query) {
	var activecls = "";
	var sortOrder = "";
	if (query.sortOrder !== undefined && query.sortOrder == "DESC") {
		activecls = "fa-sort-amount-down";
		sortOrder = "ASC";
	}
	else if (query.sortOrder !== undefined && query.sortOrder == "ASC") {
		activecls = "fa-sort-amount-up";
		sortOrder = "DESC";
	}

	var rstr = "<i class='fa ctriggerclicktwo " + activecls + "' data-sortby='" + query.sortBy + "' data-sortorder='" + sortOrder + "'></i>";
	rstr = new hbs.handlebars.SafeString(rstr);
	return rstr;
});

hbs.registerHelper('gettotalPoints', function (obj) {
	var totalpointsearned = 0;
	if (!obj) {
		return totalpointsearned;
	}

	obj.forEach(function (value, index) {
		totalpointsearned = totalpointsearned + value.points;
	});

	return totalpointsearned;
});

hbs.registerHelper('userstatuses', function (status) {
	if (status == 0) {
		return "Inactive";
	}
	else if (status == 1) {
		return "Active";
	}
	else if (status == 2) {
		return "Pending Registration";
	}

	return;
});

hbs.registerHelper('shopstatuses', function (status) {
	if (status == 1) {
		return "Active";
	}

	return "Inactive";
});

hbs.registerHelper('accountroles', function (role) {
	// 0: Administrator, 1: Business Owner, 2: Consumer, 3: Shop Assistant, 4: Sub Admin
	if (role == 0) {
		return "Administrator";
	}
	else if (role == 1) {
		return "Vendor";
	}
	else if (role == 2) {
		return "Consumer";
	}
	else if (role == 3) {
		return "Shop Assistant";
	}

	return;
});

hbs.registerHelper('promotionstats', function (stats) {
	// 0: Pending, 1: Ongoing, 2: Rejected, 3: Expired, 4: Previous, 5: Draft
	if (stats == 0) {
		return "Pending";
	}
	else if (stats == 1) {
		return "Ongoing";
	}
	else if (stats == 2) {
		return "Rejected";
	}
	else if (stats == 3) {
		return "Expired";
	}
	else if (stats == 4) {
		return "Previous";
	}
	else if (stats == 5) {
		return "Draft";
	}

	return;
});

hbs.registerHelper('pushnotistats', function (stats) {
	// 1: Published, 2: Draft
	if (stats == 1) {
		return "Published";
	}
	else if (stats == 2) {
		return "Draft";
	}

	return;
});

hbs.registerHelper('pushnotisentstats', function (stats) {
	// 0: Pending, 1: Sent
	if (stats == 0) {
		return "Pending";
	}
	else if (stats == 1) {
		return "Sent";
	}

	return;
});

hbs.registerHelper('commaSeprate', function (arrayObj) {
	var returnvar = '';

	for (var i = 0; i < arrayObj.length; ++i) {
		if (arrayObj[i].Shop != null) {
			returnvar += arrayObj[i].Shop.shopName + ", ";
			if (i >= 1) {
				returnvar += "...,";
				break;
			}
		}
	}
	var returnvarn = returnvar.replace(/,\s*$/, "");

	return returnvarn;
});

hbs.registerHelper('commaSeprateService', function (arrayObj) {
	var returnvar = '';

	for (var i = 0; i < arrayObj.length; ++i) {
		returnvar += arrayObj[i].serviceName + ", ";
	}

	var returnvarn = returnvar.replace(/,\s*$/, "");

	return returnvarn;
});

module.exports = app;