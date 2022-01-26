const express = require('express');
const router = require('./router');
// require function performs 2 tasks
// 1) it Exceutes said file
// 2) it returns whatever the file exports

const app = express();

app.use(express.static('public'));
// first argument the configuration
// second argument is the name of our folder
app.set('views', 'views');
app.set('view engine', 'ejs');

app.use('/', router);

app.listen(process.env.PORT || 6969);
