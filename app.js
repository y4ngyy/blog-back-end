const express = require('express');
const router = express.Router();

var api = require('./routers/api');

var app = express();

app.use(express.static('public'));

app.use('/api', api);

app.listen(5000, function() {
	console.log('Server listening on port 5000');
});
