var express = require('express');
var app = express();
var router = express.Router();
var db = require('../models/db');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

// route
app.post('/login', passport.authenticate('local', { successRedirect: '/',
                                                    failureRedirect: '/login',
						    failureFlash: true }));

// Authenticate
app.post('/login',
    passport.authenticate('local'),
    function(req, res) {
	res.redirect('/employee/' + req.employee.e_username);
});


// Callback
app.get('/login', function(req, res, next) {
  passport.authenticate('local', function(err, employee, info) {
    if (err) { return next(err); }
    if (!employee) { return res.redirect('/login'); }
    req.logIn(employee, function(err) {
      if (err) { return next(err); }
      return res.redirect('/employee/' + employee.e_username);
    });
  })(req, res, next);
});




passport.use(new LocalStrategy({
	e_username: 'e_username',
	e_password: 'e_password'
    },
    function(e_username, e_password, done) {
    	Employee.findOne({ e_username: e_username }, function (err, employee) {
      	    if (err) { return done(err); }
            if (!employee) {
            	return done(null, false, { message: 'Incorrect username.' });
            }
            if (!employee.validPassword(e_password)) {
            	return done(null, false, { message: 'Incorrect password.' });
      	    }
      	    return done(null, employee);
       	});
    }
));


router.post('/login', function(req, res) {
    console.log(req.body);
    db.GetLogin(req.query.e_username,
        function (err, result) {
            if (err) throw err;
            console.log(result);
   res.render('login.ejs', req.body );
}
);
});





