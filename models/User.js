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
	if (this.data.password.length > 100)
		this.errors.push('Password cannot exceed 100 characters');
};

User.prototype.login = function () {
	this.cleanUp();
	usersCollection.findOne(
		{ username: this.data.username },
		(err, attemptedUser) => {
			if (attemptedUser && attemptedUser.password == this.data.password) {
				console.log('User Authenticated');
			} else {
				console.log('Authentication Failed');
			}
		}
	);
};

User.prototype.register = function () {
	// Cleaning Up uneccessary spaces and extra data that user might try to send
	this.cleanUp();

	// Validating User Input
	this.validate();

	if (!this.errors.length) {
		usersCollection.insertOne(this.data);
	}
};

module.exports = User;
