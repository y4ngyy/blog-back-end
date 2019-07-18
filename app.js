const express = require('express');
const bodyParser = require('body-parser');
var api = require('./routers/api');
var index = require('./routers/index');

var app = express();
// 添加json解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static('public'));

app.use('/api', api);
app.use('/', index);

app.listen(5000, function() {
	console.log('Server listening on port 5000');
});
