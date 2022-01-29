const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController');
const postController = require('./controllers/postController');

// User Routes
router.get('/', userController.home);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

// Post routes
router.get(
	'/create-post',
	userController.mustBeLoggedIn, // this will help protect other routes so that only logged in users can access
	postController.viewCreateScreen
);
router.post(
	'/create-post',
	userController.mustBeLoggedIn,
	postController.create
);
module.exports = router;
