var querystring = require("querystring"),
	fs = require("fs");

function start(response) {
	console.log("Request handler 'start' was called.");
	var body = '<html>'+
	'<head>'+
	'<meta http-equiv="Content-Type" '+
	'content="text/html; charset=UTF-8" />'+
	'</head>'+
	'<body>'+
	'<form action="/upload" enctype="multipart/form-data" '+
	'method="post">'+
	'<input type="file" name="upload" multiple="multiple">'+
	'<input type="submit" value="Upload file" />'+
	'</form>'+
	'</body>'+
	'</html>';
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(body);
	response.end();
}

function upload(response, postData) {
	console.log("Request handler 'upload' was called.");
	response.writeHead(200, { "Content-Type": "text/plain" });
	response.write("You've sent the text: " +
	querystring.parse(postData).text);
	response.end();
}

function show(response) {
	console.log("Request handler 'show' was called.");
	fs.readFile("diff.png", "binary", function (error, file) {
		if(error) {
			response.writeHead(500, {"Content-Type": "text/plain"});
			response.write(error + "\n");
			response.end();
		} else {
			response.writeHead(200, {"Content-Type": "image/png"});
			response.write(file, "binary");
			response.end();
		}
	});
}
exports.start = start;
exports.upload = upload;
exports.show = show;


/*function start(response) {
	console.log("Request handler 'start' was called.");
	exec("dir F:\\cat\\Projects\\ClickATaxi.WebBooking\\ClickATaxi.OnlineBooking.IntegrationTests\\bin\\Debug", function (error, stdout, stderr) {
		response.writeHead(200, {"Content-Type": "text/plain"});
		response.write(stdout);
		response.end();
	});
}*/
