var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var app = express();

passport.serializeUser(function(user, done){
	done(null, user._id);
});

passport.deserializeUser(function(userId, done){
	User.findById(userId, done);
});


// mongodb connection
mongoose.connect('mongodb://localhost:27017/bookshelf');
var db = mongoose.connection;

// mongo error
db.on('error', console.error.bind(console, 'Connection Error:'));

// use sessions for tracking logins
app.use(session({
	secret: 'bookshelf loves you',
	resave: true,
	saveUninitialized: false,
	store: new MongoStore({
		mongooseConnection: db
	})
}));


// Session config for Passport and MongoDB
var sessionOptions = {
	secret: "Valar Dohaeris Valar Morghulis",
	resave: true,
	saveUninitialized: true,
	store: new MongoStore({
		mongooseConnection: db
	})
};

app.use(session(sessionOptions));

// Initialize Passport
app.use(passport.initialize());

// Restore Session
app.use(passport.session());


// make user ID available in templates
app.use(function(req, res, next){
	res.locals.currentUser = req.session.userId;
	next();
});

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
