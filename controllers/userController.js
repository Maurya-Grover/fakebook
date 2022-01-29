const User = require('../models/User.js');

exports.mustBeLoggedIn = function (req, res, next) {
	if (req.session.user) {
		// user object in session only exists if a user is logged in
		next();
	} else {
		req.flash('errors', 'You must be logged in');
		req.session.save(function () {
			res.redirect('/');
		});
	}
};
exports.login = function (req, res) {
	let user = new User(req.body);
	user
		.login()
		.then(function (result) {
			// the following session object of the request will be unique for every visitor for every browser to the website
			// this cookie is persistent till the server is alive
			// can contain any data pertaining to the user
			req.session.user = { username: user.data.username, avatar: user.avatar };
			req.session.save(function () {
				res.redirect('/');
			});
		})
		.catch(function (err) {
			// flash is going to make changes to our session data meaning making a call to the db
			// hence we don't know when it will get completed. Therefore I save manually and
			// provide a callback to execute when db call is completed
			// callback provided because sessions doesn't use promises so I can't use .then().catch() syntax

			req.flash('errors', err);
			req.session.save(function () {
				res.redirect('/');
			});
		});
};

exports.logout = function (req, res) {
	req.session.destroy(function () {
		res.redirect('/');
	});
};

exports.register = (req, res) => {
	let user = new User(req.body);
	user
		.register()
		.then(() => {
			req.session.user = { username: user.data.username, avatar: user.avatar };
			// again we don't know when this session update will complete so we will save manually
			req.session.save(function () {
				res.redirect('/');
			});
		})
		.catch((regErrors) => {
			// flash will make changes to session data. hence we shouldn't redirect until that call is completed
			// ideally registration validation response should be done browser side. will implement that later.
			// but I should perform validation on server side anyways as the user can turn of browser side javascript
			// so this is not all in vain

			regErrors.forEach(function (error) {
				req.flash('regErrors', error);
			});
			// hence we save manually
			req.session.save(function () {
				res.redirect('/');
			});
		});
};

exports.home = (req, res) => {
	if (req.session.user) {
		res.render('home-dashboard', {
			username: req.session.user.username,
			avatar: req.session.user.avatar,
		});
	} else {
		// passing flash errors using flash function will also delete the errors from the session
		// or else I could've simply accessed using req.session.flash.errors
		res.render('home-guest', {
			errors: req.flash('errors'),
			regErrors: req.flash('regErrors'),
		});
	}
};
