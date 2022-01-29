const postsCollection = require('../db').db().collection('posts');
let Post = function (data) {
	this.data = data;
	this.errors = [];
};

Post.prototype.cleanUp = function () {
	if (typeof this.data.title != 'string') this.data.title = '';
	if (typeof this.data.body != 'string') this.data.body = '';

	// filter out any additional data user might try to send
	this.data = {
		title: this.data.title.trim(),
		body: this.data.body.trim(),
		createdDate: new Date(),
	};
};

Post.prototype.validate = function () {
	if (this.data.title == '') this.errors.push('You must enter a title');
	if (this.data.body == '') this.errors.push('You must enter some content');
};

Post.prototype.create = function () {
	// make sure data we store in database isn't malicious

	return new Promise((resolve, reject) => {
		this.cleanUp();
		this.validate();
		if (!this.errors.length) {
			let query = {
				username: req.se,
			};
			postsCollection.insertOne(query);
		} else {
			reject(this.errors);
		}
	});
};

module.exports = Post;
