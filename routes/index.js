var express = require('express');
var router = express.Router();

// GET /
// the Home Page
router.get('/', function(req, res, next){
	return res.render('index', {title: 'Home'});
});

// GET /about
// the About Us Page
router.get('/about', function(req, res, next){
	return res.render('about', {title: 'About'});
});

// GET /contact
// the Contact Us Page
router.get('/contact', function(req, res, next){
	return res.render('contact', {title: 'Contact Us'});
});

//  GET /register
router.get('/register', function(req, res, next){
	return res.render('register',{title: 'Sign Up'});
});

// POST /register
router.post('/register', function(req, res, next){
	return res.send('User Created.');
});

module.exports = router;