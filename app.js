const express = require('express');
const router = require('./router');
// require function performs 2 tasks
// 1) it Exceutes said file
// 2) it returns whatever the file exports

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));

// first argument the configuration
// second argument is the name of our folder
app.set('views', 'views');
app.set('view engine', 'ejs');

app.use('/', router);

module.exports = app;
