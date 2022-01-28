const User = require('../models/User.js');

exports.login = function (req, res) {
	let user = new User(req.body);
	user.login();
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
	res.render('home-guest');
};
