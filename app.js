var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var app = express();

// Configure GitHub Strategy
passport.use(new GitHubStrategy({
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/return"
}, function(accessToken, refreshToken, profile, done) {
		if(profile.emails[0]){
	    User.findOneAndUpdate({
				email: profile.emails[0].value
			}, {
				name: profile.displayName || profile.username,
				email: profile.emails[0].value,
				photo: profile.photos[0].value
			}, {
				upsert: true
			},
			done);
		}else{
			var noEmailError = new Error("Your email privacy settings prevent you from signing in to BookShelf!!!");
			done(noEmailError,null);
		}
}));

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
var auth = require('./routes/auth');
app.use('/', routes);
app.use('/auth', auth);

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
