const express = require('express');
const indexRouter = express.Router();

/**
 * 传送单页应用的初始页
 */

indexRouter.get('/', function (req, res) {
   res.send('首页')
});


module.exports = indexRouter;
