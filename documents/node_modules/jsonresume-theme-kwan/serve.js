#!/usr/bin/node
//
// This script will run a local development server. This is useful when
// developing the theme.
//
// Usage:
// `serve.js` to use the default JSONResume example
// `serve.js <filename>` to open a particular resume file 

var http = require("http");
var theme = require("./index.js");
var fs = require('fs');
var args = require('optimist').argv;

var port = 8888;
http.createServer(function(req, res) {
    res.writeHead(200, {
        "Content-Type": "text/html"
    });
    res.end(render());
}).listen(port);

console.log("Preview: http://localhost:8888/");
console.log("Serving..");

function render() {
    try {
        var resume = args._.length? JSON.parse(fs.readFileSync(args._[0], 'utf8')) : require("resume-schema").resumeJson;
        return theme.render(resume);
    } catch (e) {
        console.log(e.message);
        return "";
    }
}
