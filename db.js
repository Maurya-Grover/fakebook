const dotenv = require('dotenv');
dotenv.config();
const mongodb = require('mongodb');

const client = new mongodb.MongoClient(process.env.CONNECTIONSTRING, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
/*
this also works but is updated to use promises
client.connect((err, result) => {
	if (typeof err !== 'undefined') {
		console.log(err);
		return;
	}
	console.log(`Databse Status: ${result.topology.s.state}`);
	module.exports = client.db();
	const app = require('./app');
	app.listen(process.env.PORT);
});*/

client
	.connect()
	.then((result) => {
		console.log(`Databse Status: ${result.topology.s.state}`);
		module.exports = client;
		const app = require('./app');
		app.listen(process.env.PORT);
	})
	.catch((err) => {
		console.log(err);
	});
