const Post = require('../models/Post');
exports.viewCreateScreen = function (req, res) {
	res.render('create-post');
};

exports.create = function (req, res) {
	let post = new Post(req.body);
	post
		.create()
		.then(() => {
			res.send('new post created');
		})
		.catch((err) => {
			res.send(err);
		});
};
