var express = require('express');
var routes = require('routes');
var http = require('http');
const multer=require("multer");
const fs=require("fs");
var url = require('url');
var path = require('path');
var body = require('body-parser');
var aa=body.urlencoded({extended:false});
var app = express();
var mysql = require('mysql');
app.use(body.json());

app.set('port',process.env.PORT || 4300);
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

var con = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'',
	database:'users'
});

const storage=multer.diskStorage({
destination:(req,file,callback)=>{
callback(null,"./public/uploads");
},
filename:(req,file,cb)=>{
cb(null,(file.filename=file.originalname));
}
});

var path = require('path');
const upload=multer({storage:storage});

app.use(express.static(path.join(__dirname,'public')));//to show image
app.use(express.static("./public/uploads"));

app.get("/",function(req,res){
res.render("login");
});


app.post("/register",function(req,res){
res.render("register");
});
var x,y;
app.post("/check",aa,function(req,res){
	var username = req.body.username;
	var password = req.body.password;
	x=username;
	y=password;
	if (username && password) {
		con.query('SELECT * FROM userinfo WHERE username = ? AND password = ?', [username, password], function(err, results, fields) {
			//console.log(results);
			if(results.length)
			{
				res.render("welcome",{data1:results});

				//console.log(results[0].username);
			}
			else {

			res.send('Incorrect Username and/or Password!');
				//res.redirect("/register");
			}
			res.end();
});
}
else {
	res.send('Please enter Username and Password!');
		res.end();
}
});

app.get("/edit",aa,function(req,res){
	con.query('SELECT * FROM userinfo WHERE username = ? AND password = ?', [x, y], function(err, results, fields) {
		//console.log(results);
		res.render("edit",{data1:results});
});
});

app.post("/save",aa,upload.single("file"),(req,res,next)=>{
  var u = req.body.uname;
	var p = req.body.pass;
	var g = req.body.gender;
	var e = req.body.email;
	var m = req.body.mobile;
	var a = req.body.address;
	var c = req.body.city;
	var f = req.file.filename;
	var sql='update userinfo set password="'+p+'",gender="'+g+'",emailid="'+e+'",mobileno="'+m+'",address="'+a+'",city="'+c+'",imagename="'+f+'"  WHERE username = ?';
	con.query(sql, [x], function(err, results, fields) {
  //console.log(sql);
	res.send("changes saved");
});
});

app.post("/new",aa,upload.single("file"),(req,res,next)=>{
	var u = req.body.uname;
	var p = req.body.pass;
	var g = req.body.gender;
	var e = req.body.email;
	var m = req.body.mobile;
	var a = req.body.address;
	var c = req.body.city;
	var f = req.file.filename;
	var sql='insert into userinfo values("'+u+'","'+p+'","'+g+'","'+e+'","'+m+'","'+a+'","'+c+'","'+f+'")';
	console.log(sql);
	con.query(sql,function(err,results,fields){
		console.log(results);
		res.send("new user created");
	});
});


http.createServer(app).listen(app.get('port'),function(){
	console.log('Express Server listening on Port '+app.get('port'));
});
