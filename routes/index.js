
/*
 * GET home page.
 */

var fs = require("fs");

exports.index = function(req, res){
	//console.log(fs);
	var path = "/Users/karolinaguobiene/Documents/gedas/aaa/";
	fs.readdir(path, function(arg1, files){
		for (var a=0; a<files.length; a++) {
			var file = files[a];
			if (file.substr(0, 3) == "F:\\") {
				var newFile = file.substr(48);
				console.log(file + " " + newFile);
				fs.rename(path + file, path + newFile);
			}
		}
	});
	//console.log();
	//fs.rename(path + "F\:\\cat\\Projects\\selenium-screenshot-browser\\aaa\\BookOnlineTest__Booking_with_signup_diff.png", path + "BookOnlineTest__Booking_with_signup_diff.png");
  res.render('index', { title: 'Express' });
};