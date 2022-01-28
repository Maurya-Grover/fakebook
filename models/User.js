const bcrypt = require('bcryptjs');
const usersCollection = require('../db').collection('users');
const validator = require('validator');

let User = function (data) {
	this.data = data;
	this.errors = [];
	/*
    this.homePlanet = 'earth'; 
    obvious way to create a method for the object but is not very efficient
    this.jump = function() {}
    */
};

// Using this syntax js will not need to create a new copy of the method for each object instance
// All objects of this type will have access to this method
// User.prototype.jump = function () {};

User.prototype.cleanUp = function () {
	if (typeof this.data.username != 'string') this.data.username = '';
	if (typeof this.data.email != 'string') this.data.email = '';
	if (typeof this.data.password != 'string') this.data.password = '';

	this.data = {
		username: this.data.username.trim().toLowerCase(),
		email: this.data.email.trim().toLowerCase(),
		password: this.data.password,
	};
};

User.prototype.validate = function () {
	if (this.data.username == '')
		this.errors.push('You must provide a username.');
	if (this.data.username != '' && !validator.isAlphanumeric(this.data.username))
		this.errors.push('Username can only contain letters and numbers.');
	if (this.data.username.length > 0 && this.data.password.length < 3)
		this.errors.push('Username must be atleast 3 characters');
	if (this.data.username.length > 30)
		this.errors.push('Username cannot exceed 30 characters');

	if (!validator.isEmail(this.data.email))
		this.errors.push('You must provide a valid email adress');

	if (this.data.password == '') this.errors.push('You must provide a password');
	if (this.data.password.length > 0 && this.data.password.length < 8)
		this.errors.push('Password must be atleast 8 characters');
	if (this.data.password.length > 50)
		this.errors.push('Password cannot exceed 50 characters');
};

User.prototype.login = function () {
	return new Promise((resolve, reject) => {
		// using arrow function to prevent this keyword from taking any other context
		this.cleanUp();
		let query = { username: this.data.username };
		usersCollection
			.findOne(query)
			.then((attemptedUser) => {
				// using arrow function here to make sure this keyword doesn't take any other context
				if (
					attemptedUser &&
					bcrypt.compareSync(this.data.password, attemptedUser.password)
				)
					resolve('User Authenticated');
				else reject('Authentication Failed');
			})
			.catch(() => {
				reject('Please try again later. Issues with server are being resolved');
			});
	});
};

User.prototype.register = function () {
	// Cleaning Up uneccessary spaces and extra data that user might try to send
	this.cleanUp();

	// Validating User Input
	this.validate();

	if (!this.errors.length) {
		// hash user password
		let salt = bcrypt.genSaltSync(10);
		this.data.password = bcrypt.hashSync(this.data.password, salt);
		usersCollection.insertOne(this.data);
	}
};

module.exports = User;
