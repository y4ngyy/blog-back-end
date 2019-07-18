const express = require('express');
const fs = require('fs');
const config = require('../config/config');
const api = express.Router();
const utils = require('../utils/utils');
const multer = require('multer');

// multer设置
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, config.postDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

var upload = multer({storage: storage, fileFilter: function (req, file, cb) {
    var fileName = file.originalname;
    var fileExt = fileName.split('.')[1];
    if (fileExt !== 'md') {
        cb(null, false);
    } else {
        cb(null, true);
    }
}});
/**
 * 1. markdown解析
 * 2. 为前端提供markdown解析后的数据
 * 3. 更新文章json
 */

var articleCache = null;
api.get('/article/:postTitle', function (req, res) {
    console.log(req.params.postTitle);
    postTitle = req.params.postTitle;
    if(articleCache == null) {
        articleCache = JSON.parse(fs.readFileSync('articleData.json').toString());
    }
    if (articleCache[postTitle] != null) {
        var articleReadStream = fs.createReadStream(config.postDir + articleCache[postTitle]["fileName"]);
        var articleContent = '';
        articleReadStream.on('data', function (chunk) {
            articleContent += chunk;
        });
        articleReadStream.on('end', function () {
            var json = {};
            json.title = postTitle;
            json.date = articleCache[postTitle].date;
            json.content = utils.markdownParse(articleContent.toString());
            res.send(JSON.stringify(json));
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

api.post('/admin-check', function (req, res) {
    console.log(req.body);
    var userName = req.body.username;
    var password = req.body.password;
    if (userName === config.author && password === config.password) {
        res.json({status:true});
    } else {
        res.json({status:false});
    }
});

api.post('/upload',upload.single('file'), function (req, res) {
    console.log(req.file);
    if (req.file.originalname !== undefined) {
        var fileName = req.file.originalname;
        articleCache = utils.addArticle(fileName);
        res.send('上传成功');
    } else {
        res.send('请上传指定格式文件');
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
