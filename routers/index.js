const express = require('express');
const indexRouter = express.Router();

/**
 * 传送单页应用的初始页
 */

indexRouter.get('/', function (req, res) {
      res.send(path.join(__dirname,'public', 'index.html'));
});


module.exports = indexRouter;
