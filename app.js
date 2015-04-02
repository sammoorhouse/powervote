var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var issues = require('./routes/issues');

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

io.on('connection', function(socket){
	socket.on('vote', function(msg){
		console.log('voted ' + msg);
	});
});

//app.use('/', routes);

/* GET home page. */
app.get('/', function(req, res, next) {
	issues.getAll(function(items){
		res.render('issues', { title: 'Issues', data: items })
	});
});
app.get('/blast', issues.blast);
app.get('/issue/:id', function(req,res,next){
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

http.listen(3000, function(){
  console.log('listening on *:3000');
});

module.exports = app;
