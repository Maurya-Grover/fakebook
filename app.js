// require function performs 2 tasks
// 1) it Exceutes said file
// 2) it returns whatever the file exports
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const app = express();

let sessionOptions = session({
	secret: 'random text',
	store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
	resave: false,
	saveUninitialized: false,
	cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true },
});
app.use(sessionOptions);
app.use(flash());
app.use(function (req, res, next) {
	res.locals.user = req.session.user;
	next();
});
const router = require('./router');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));

// first argument the configuration
// second argument is the name of our folder
app.set('views', 'views');
app.set('view engine', 'ejs');

app.use('/', router);

module.exports = app;
