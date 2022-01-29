const bcrypt = require('bcryptjs');
const usersCollection = require('../db').db().collection('users');
const validator = require('validator');
const md5 = require('md5');

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
	return new Promise(async (resolve, reject) => {
		let usernameIsValid = true;
		let emailIsValid = true;
		if (this.data.username == '') {
			this.errors.push('You must provide a username.');
			usernameIsValid = false;
		}
		if (
			this.data.username != '' &&
			!validator.isAlphanumeric(this.data.username)
		) {
			this.errors.push('Username can only contain letters and numbers.');
			usernameIsValid = false;
		}
		if (this.data.username.length > 0 && this.data.password.length < 3) {
			this.errors.push('Username must be atleast 3 characters');
			usernameIsValid = false;
		}
		if (this.data.username.length > 30) {
			this.errors.push('Username cannot exceed 30 characters');
			usernameIsValid = false;
		}
		if (!validator.isEmail(this.data.email)) {
			this.errors.push('You must provide a valid email adress');
			emailIsValid = false;
		}

		if (this.data.password == '')
			this.errors.push('You must provide a password');
		if (this.data.password.length > 0 && this.data.password.length < 8)
			this.errors.push('Password must be atleast 8 characters');
		if (this.data.password.length > 50)
			this.errors.push('Password cannot exceed 50 characters');

		// Only if username is valid check if it is already taken
		// No point in making a database call if email is not valid
		if (usernameIsValid) {
			let query = { username: this.data.username };
			let usernameExists = await usersCollection.findOne(query);
			if (usernameExists) {
				this.errors.push('Username is already taken');
			}
		}
		// Only if email is valid check if it is already taken
		if (emailIsValid) {
			let query = { email: this.data.email };
			let emailExists = await usersCollection.findOne(query);
			if (emailExists) {
				this.errors.push('Email is already in use');
			}
		}
		resolve();
	});
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
				) {
					this.data = attemptedUser;
					this.getAvatar();
					resolve('User Authenticated');
				} else {
					reject('Invalid Username/Password. Please Try Again!');
				}
			})
			.catch(() => {
				reject('Please try again later. Issues with server are being resolved');
			});
	});
};

User.prototype.register = function () {
	return new Promise(async (resolve, reject) => {
		// Cleaning Up uneccessary spaces and extra data that user might try to send
		this.cleanUp();

		// Validating User Input
		await this.validate();

		if (!this.errors.length) {
			// hash user password
			let salt = bcrypt.genSaltSync(10);
			this.data.password = bcrypt.hashSync(this.data.password, salt);
			await usersCollection.insertOne(this.data);
			// calling after database call because we don't want to store image in db
			this.getAvatar();
			resolve();
		} else {
			reject(this.errors);
		}
	});
};

User.prototype.getAvatar = function () {
	let userEmailHash = md5(this.data.email);
	this.avatar = `https://gravatar.com/avatar/${userEmailHash}?s=128`;
};

module.exports = User;
