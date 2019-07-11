const fs = require('fs');
const config = require('../config/config');
const marked = require('marked');
const cheerio = require('cheerio');

function markdownParse(articleData) {
    articleData = marked(articleData.toString());
    if(articleData.indexOf("toc-true") !== -1 ) {
        var h2Index= articleData.indexOf('</h2>');
        articleData = articleData.substring(h2Index+6);
    } else {
        var pIndex = articleData.indexOf('</p>');
        articleData = articleData.substring(pIndex+5);
    }
    const $ = cheerio.load(articleData);
    $('p').each(function (i, e) {
        var content = $(this).html();
        content = content.replace(/\n/g, '<br>');
        $(this).html(content);
    });
    return $.html();
}

var path = '../test/post/';
var dir = fs.readdirSync(path);

var articleInfoJson = {};
dir.forEach(function (data, i) {
    // console.log(data)
    var content = fs.readFileSync(path + data).toString();
    // console.log(content.toString())
    var infoList = content.split('---')[1]
        .replace(/\r\n/g, '\n')
        .split('\n');
    var title = infoList[1].split(' ')[1];
    var date = infoList[2].split(' ')[1];
    var categories = infoList[3].split(' ')[1];
    articleInfoJson[title] = {};
    articleInfoJson[title]['fileName'] = data;
    articleInfoJson[title]['date'] = date;
    articleInfoJson[title]['categories'] =categories;
    var summary = markdownParse(content);
    summary = summary.replace(/<\/?html>|<\/?head>|<\/?body>/g, '');
    var summaryEnd = summary.indexOf('</pre>');
    articleInfoJson[title]['summary'] = summary.substring(0, summaryEnd+6);
});
console.log(articleInfoJson);
fs.writeFileSync('../articleData.json', JSON.stringify(articleInfoJson));
// console.log(JSON.stringify(articleInfoJson));
// var content = fs.readFileSync(path + 'git版本控制.md').toString();
// var temp0 = content.split('---')[1];
// var temp1 = temp0.replace(/\r\n/g,'\n');
// var templist = temp1.split('\n');
// var templist2 = templist[1].split(' ');
// console.log(templist2);
exports.getFileList = getFileList;
exports.markdownParse = markdownParse;