var fs = require("fs");
var path = require("path");
var url = require('url');

var regexWithScreenshotName = /^([^\s]+)\_\_([^\s]+)\_\_([^\s]+)_(new|old|diff|bak)\.png$/;
var regexWoScreenshotName = /^([^\s]+)\_\_([^\s]+)_(new|old|diff|bak)\.png$/;

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

		files.sort(function(a, b) {
			var aTime = getCtime(dir, a);
			var bTime = getCtime(dir, b);
	        return aTime < bTime ? -1 : 1;
	    }).forEach(function(file, key) {
			var fullPath = path.join(dir, file);
			var fileInfo = fs.statSync(fullPath);
			if (fileInfo.isFile()) {
				processFile(list, file, fileInfo.ctime, p);
			}
			else {
				processDir(list, file);
			}
	        // stuff
	    });
		res.send(list);
	});
};

function getCtime(dir, file) {
	var fullPath = path.join(dir, file);
	return fs.statSync(fullPath).ctime;
}

function processFile(list, file, ctime, path) {
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
		addScreenshot(list, suiteName, testName, screenshotName, type, file, ctime);
	}	
}

function addScreenshot(list, suiteName, testName, screenshotName, type, file, ctime){
	console.log('Suite: ' + suiteName + "; Test: " + testName + "; Screenshot: " + screenshotName + "; Type: " + type + "; ctime: " + ctime);				

	if (typeof(list.suites[suiteName]) == 'undefined'){
		list.suites[suiteName] = {
				tests: {}
		};
	}
	var suite = list.suites[suiteName];
	
	if (typeof(suite.tests[testName]) == 'undefined'){
		suite.tests[testName] = {
				screenshots: []
		};
	}
	var test = suite.tests[testName];
	
	var screenshot = null;
	for (var a=0; a<test.screenshots.length; a++) {
		if (screenshotName == test.screenshots[a].name)
		{
			screenshot = test.screenshots[a];
			break;
		}
	}
	
	if (screenshot == null) {
		screenshot = {name: screenshotName};
		test.screenshots.push(screenshot);
	}
	
	screenshot[type] = {
			file: file,
			ctime: ctime
	};
}

function processDir(list, dir){
	list.dirs.push({name: dir, path: dir});
}