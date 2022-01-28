const User = require('../models/User.js');

exports.login = function (req, res) {
	let user = new User(req.body);
	user
		.login()
		.then(function (result) {
			// the following session object of the request will be unique for every visitor for every browser to the website
			req.session.user = {
				// can contain any data pertaining to the user
				username: user.data.username,
			};
			res.send(result);
		})
		.catch(function (err) {
			res.send(err);
		});
};

exports.register = (req, res) => {
	let user = new User(req.body);
	user.register();
	if (user.errors.length > 0) res.send(user.errors);
	else {
		res.send('ho gaya tera selection');
	}
};

exports.home = (req, res) => {
	if (req.session.user) {
		res.send('Welcome, Login Successful!');
	} else {
		res.render('home-guest');
	}
};
