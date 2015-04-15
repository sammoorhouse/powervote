var express = require('express');
var stormpath = require('express-stormpath');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var envName = process.env.ENV_NAME || 'dev';

var issues = require('./routes/issues');
var config = require('./config.' + envName + '.js');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(stormpath.init(app, {
	apiKeyId: process.env.STORMPATH_APIKEY_ID || config.stormPath.apiKeyId,
	apiKeySecret: process.env.STORMPATH_APIKEY_SECRET || config.stormPath.apiKeySecret,
	application: process.env.STORMPATH_APP_URL || config.stormPath.appUrl,
	secretKey: 'ca4afc77-d67c-4698-b7e7-3003a0b59f78',
	enableFacebook: true,
	social: {
		facebook: {
			appId: process.env.FB_APP_ID || config.facebook.appId,
			appSecret: process.env.FB_APP_SECRET || config.facebook.appSecret,
		}
	}
}));

io.on('connection', function(socket){
	socket.on('vote', function(msg){
		console.log('voted ' + msg.score);
	});
});

//app.use('/', routes);

/* GET home page. */
app.get('/', stormpath.loginRequired, function(req, res, next) {
	issues.getAll(function(items){
		res.render('issues', { title: 'Issues', data: items })
	});
});
app.get('/blast', stormpath.loginRequired, issues.blast);
app.get('/issue/:id', stormpath.loginRequired, function(req,res,next){
	var id = req.params.id;
	 issues.getById(id, function(payload){
		 res.render('issue', {data: payload});
	 });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:80');
});

module.exports = app;
