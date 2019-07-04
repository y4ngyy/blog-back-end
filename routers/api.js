const express = require('express')
const fs = require('fs');
const markedModule = require('marked');

const config = require('../configure/configure');
const apiRouter = express.Router();

/**
 * 1. markdown解析
 * 2. 为前端提供markdown解析后的数据
 * 3. 更新文章json
 */

var postCache = null;
apiRouter.get('/:postTitle', function (req, res) {
    console.log(req.params.postTitle);
    postTitle = req.params.postTitle;
    if (postCache == null) {
        postCache = JSON.parse(fs.readFileSync('postInfo.json').toString());
        // console.log(postCache)
    }
    if (postCache[postTitle] != null) {
        var postReadStream = fs.createReadStream(config.postDir + postCache[postTitle]["fileName"]);
        var postData = '';
        postReadStream.on('data', function (chunk) {
            postData += chunk;
        });
        postReadStream.on('end', function () {
            // console.log(postData);
            res.send(markedModule(postData.toString()));
        })
    } else {
        res.status(404);
        res.send("文章不存在");
    }
});


module.exports = apiRouter;
