const express = require('express');
const fs = require('fs');
const marked = require('marked');
const cheerio = require('cheerio');
const config = require('../config/config');
const api = express.Router();
const utils = require('../utils/utils');
/**
 * 1. markdown解析
 * 2. 为前端提供markdown解析后的数据
 * 3. 更新文章json
 */

var articleCache = null;
api.get('/:postTitle', function (req, res) {
    console.log(req.params.postTitle);
    postTitle = req.params.postTitle;
    if(articleCache == null) {
        articleCache = JSON.parse(fs.readFileSync('articleData.json').toString());
        // console.log(postCache)
    }
    if (articleCache[postTitle] != null) {
        var articleReadStream = fs.createReadStream(config.postDir + [postTitle]["fileName"]);
        var articleContent = '';
        articleReadStream.on('data', function (chunk) {
            articleContent += chunk;
        });
        articleReadStream.on('end', function () {
            res.send(marked(articleContent.toString()));
        })
    } else {
        res.status(404);
        res.send("文章不存在");
    }
});

api.get('/get-article-info', function (req, res) {
    if (articleCache == null) {
        var articleDataStream = fs.createReadStream('articleData.json');
        var articleData ='';
        articleDataStream.on('data', function (chunk) {
            articleData += chunk;
        });
        articleDataStream.on('end', function () {
            articleCache = JSON.parse(articleData.toString());
            res.send(articleData.toString());
        })
    }
    else {
        res.send(JSON.stringify(articleCache));
    }

});
// for test

// api.get('/test', function (req, res) {
//     var stream = fs.createReadStream(config.postDir + 'docker学习.md');
//     var articleData = '';
//     stream.on('data', function (chunk) {
//         articleData += chunk;
//     });
//     stream.on('end', function () {
//         res.send(utils.markdownParse(articleData));
//     })
// });



module.exports = api;
