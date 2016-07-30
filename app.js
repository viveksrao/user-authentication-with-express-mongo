var express = require('express');
var bodyParser = require('body-parser');
var app = express();

//	Parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Serve static files from /public
app.use(express.static(__dirname + '/public'));

// View engine setup
app.set('view engine','pug');
app.set('views', __dirname + '/views');

// Include Routes
var routes = require('./routes/index');
app.use('/', routes);

// Catch 404 and forward to error handler
app.use(function(req, res, next){
	var err = new Error('File Not Found');
	err.status = 400;
	next(err);
});

// Error Handler
// Define as the last app.use callback
app.use(function(err, req, res, next){
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

// Listen on Port 3000
app.listen(3000, function(){
	console.log('Express App listening on Port 3000');
});