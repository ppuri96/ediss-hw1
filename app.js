var express = require('express');
var mysql = require('mysql');
var session = require('express-session')

var app = express(); 

var con = mysql.createConnection({
	host: 'localhost', 
	user: 'root', 
	password: '',
	database: 'edisshw1'
});

var server = app.listen(8081, function () {}); 

// con.connect(function(err) {
// 	if (err) throw err; 
// 	con.query("CREATE TABLE")
// });

// // POST /login
// app.post('/login', function(req, res) {

// });

// POST /add 
app.post('/add', function(req, res) {
	if (isNaN(req.query.num1) || isNaN(req.query.num2)) {
		res.json({message:"The numbers you entered are not valid"}); 
	} else {
		var result = +req.query.num1 + +req.query.num2;
		res.json({message: "The action was successful", result: result}); 	
	}
});

// POST /divide 
app.post('/divide', function(req, res) {
	if (isNaN(req.query.num1) || isNaN(req.query.num2)) {
		res.json({message:"The numbers you entered are not valid"}); 
	} else {
		var result = +req.query.num1 / +req.query.num2;
		res.json({message: "The action was successful", result: result}); 	
	}
})

// POST /multiply
app.post('/multiply', function(req, res) {
	if (isNaN(req.query.num1) || isNaN(req.query.num2)) {
		res.json({message:"The numbers you entered are not valid"}); 
	} else {
		var result = +req.query.num1 * +req.query.num2;
		res.json({message: "The action was successful", result: result}); 	
	}
}) 