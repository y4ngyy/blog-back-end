const express = require('express');
const apiRouter = express.Router();

/**
 * 1. markdown解析
 * 2. 为前端提供markdown解析后的数据
 */

apiRouter.get('/', function (req, res) {
    res.send('<h>api /</h>');
});


module.exports = apiRouter;
