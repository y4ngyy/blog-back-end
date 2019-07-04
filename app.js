const express = require('express');
const router = express.Router();

var api = require('./routers/api');
var index = require('./routers/index');

var app = express();

app.use(express.static('public'));

app.use('/api', api);
app.use('/', index);

app.listen(5000, function() {
	console.log('Server listening on port 5000');
});
