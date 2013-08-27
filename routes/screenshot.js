var fs = require("fs");
var path = require("path");
var url = require('url');

var regexWithScreenshotName = /^(\w+)\_\_(\w+)\_\_(\w+)_(new|old|diff|bak)\.png$/;
var regexWoScreenshotName = /^(\w+)\_\_(\w+)_(new|old|diff|bak)\.png$/;

/*
 * GET users listing.
 */

exports.list = function(req, res){
	var queryData = url.parse(req.url, true).query;
	
	var p = queryData.path;
	
	if (!p)
		p = "/";
	
	var dir = "./public/screenshots" + p;
	fs.readdir(dir, function(arg1, files, arg2, arg3){
		var list = {
				path: p,
				suites: {},
				dirs: []
		};
		for (var a=0; a<files.length; a++) {
			var file = files[a];
			var fullPath = path.join(dir, file);
			if (fs.statSync(fullPath).isFile()) {
				processFile(list, file, p);
			}
			else {
				processDir(list, file);
			}
		}
		res.send(list);
	});
};

function processFile(list, file, path) {
	var result = file.match(regexWithScreenshotName);
	var suiteName = null, testName, screenshotName = 'teardown', type;
	if (result){
		suiteName = result[1];
		testName = result[2];
		screenshotName = result[3];
		type = result[4];
	}
	else {
		result = file.match(regexWoScreenshotName);
		if (result){
			suiteName = result[1];
			testName = result[2];
			type = result[3];
		}
	}
	
	if (path && path.length > 0 && path[path.length-1] != '/')
		path += '/';
	
	file = '/screenshots' + path + file;
	console.log(file);
	if (suiteName){
		addScreenshot(list, suiteName, testName, screenshotName, type, file);
	}	
}

function addScreenshot(list, suiteName, testName, screenshotName, type, file){
	console.log('Suite: ' + suiteName + "; Test: " + testName + "; Screenshot: " + screenshotName + "; Type: " + type);				

	if (typeof(list.suites[suiteName]) == 'undefined'){
		list.suites[suiteName] = {
				tests: {}
		};
	}
	var suite = list.suites[suiteName];
	
	if (typeof(suite.tests[testName]) == 'undefined'){
		suite.tests[testName] = {
				screenshots: {}
		};
	}
	var test = suite.tests[testName];
	
	if (typeof(test.screenshots[screenshotName]) == 'undefined'){
		test.screenshots[screenshotName] = {};
	}
	var screenshot = test.screenshots[screenshotName];
	
	screenshot[type] = {
			file: file
	};
}

function processDir(list, dir){
	list.dirs.push({name: dir, path: dir});
}