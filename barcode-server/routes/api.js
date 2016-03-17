var db_utils = require('./db_utils');
var exec = require('child_process').exec, child;

exports.scanBarcode = function(req, res) {
	console.log("Api-ScanBarcode");
	var barcode_path = req.body.barcode_path
	barcode_path = barcode_path.replace('blob:', '')
	barcode_path = barcode_path.replace('%3A', ':').replace('%3A', ':')
	console.log(barcode_path)
	exec_py(barcode_path, 
		function (error, stdout, stderr) {
			console.log(stdout)
			if(error) {
				res.sendStatus(500);
			} else {
				if (stdout=='-1\n') {
					res.sendStatus(500);
				} else {
					res.status(200).json(stdout);
				}
			}
	});
}

var exec_py = function(barcode_path, callback){
	exec('python3 ./opencv-barcode/main.py -p ' + barcode_path, callback);
}

exports.checkStatus = function(req, res) {
	res.sendStatus(200);
}

exports.notFound = function(req, res) {
	console.log("Route not found: " + req.originalUrl);
	res.sendStatus(404);
}