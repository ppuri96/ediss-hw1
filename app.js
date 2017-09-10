var express = require('express');
var mysql = require('mysql');
var session = require('express-session')

var app = express(); 

var con = mysql.createConnection({
	host: 'ediss-hw1-db.cg4gso8l3psc.us-east-2.rds.amazonaws.com',
	port: '3306',
	user: 'root', 
	password: '',
	database: 'edisshw1'
});

var server = app.listen(8081, function () {}); 

// con.connect(function(err) {
// 	if (err) throw err; 
// 	con.query("INSERT INTO users values('Henry', 'Smith', 'hsmith', 'smith')", function(err, result, fields) {
// 		if (err) throw err;
// 		console.log(result);
// 	})
// 	con.query("INSERT INTO users values('Tim', 'Bucktoo', 'tbucktoo', 'bucktoo')", function(err, result, fields) {
// 		if (err) throw err;		
// 		console.log(result);
// 	})
// })

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    rolling: true, 
    saveUninitialized: true, 
    cookie: {
    	expires: 900 * 1000
    }
}));

app.use(function(req, res, next) {
	if (req.session && req.session.user) {
		con.query('SELECT * FROM users WHERE username = ?', [req.query.username], 
			function(err, result, fields) {
				if (result.length > 0) {
					req.user = result[0];
					delete req.user.password;
					req.session.user = result[0];
					res.locals.user = result[0]; 
				} next();
			})
	} else {
		next();
	}
});

function requireLogin(req, res, next) {
	if (!req.session.user) {
		res.json({ message: "You are not currently logged in"});
	} else {
		next();
	}
};

app.post('/login', function(req, res) {
	var username = req.query.username; 
	var password = req.query.password;
	con.query('SELECT * FROM users WHERE username = ?', [username], 
		function(err, result, fields) {
			if (err) {
				res.json({ message: "There seems to be an issue with the username/password combination that you entered"});
			} else {
				console.log(result);
				if (result.length === 0) {
					res.json({ message: "There seems to be an issue with the username/password combination that you entered"});
				}
				if (result.length > 0) {
					if (result[0].password === password) {
						req.session.user = result[0];
						res.json({ message: "Welcome, " + result[0].firstname});
					}
				}
			}
		})
});

// POST /logout
app.post('/logout', function(req, res) {
	req.session.destroy();
	res.json({ message: "You have been successfully logged out"})
});

// POST /add 
app.post('/add', requireLogin, function(req, res) {
	if (isNaN(req.query.num1) || isNaN(req.query.num2)) {
		res.json({message:"The numbers you entered are not valid"}); 
	} else {
		var result = +req.query.num1 + +req.query.num2;
		res.json({message: "The action was successful", result: result}); 	
	}
});

// POST /divide 
app.post('/divide', requireLogin, function(req, res) {
	if (isNaN(req.query.num1) || isNaN(req.query.num2)) {
		res.json({message:"The numbers you entered are not valid"}); 
	} else {
		var result = +req.query.num1 / +req.query.num2;
		res.json({message: "The action was successful", result: result}); 	
	}
});
// POST /multiply
app.post('/multiply', requireLogin, function(req, res) {
	if (isNaN(req.query.num1) || isNaN(req.query.num2)) {
		res.json({message:"The numbers you entered are not valid"}); 
	} else {
		var result = +req.query.num1 * +req.query.num2;
		res.json({message: "The action was successful", result: result}); 	
	}
});