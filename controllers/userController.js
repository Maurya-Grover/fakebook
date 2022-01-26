exports.login = () => {};
exports.register = (req, res) => {
	res.send('Thanks for registering');
};
exports.home = (req, res) => {
	res.render('home-guest');
};
