var http = require('http');
var mysql = require('mysql');
var url = require('url');
var fs = require('fs');



var WebSocketServer = require('websocket').server;

var count = 0;
var clients = {};


var server = http.createServer(function(request, response) {
	var q = url.parse(request.url, true);
	var filename = "." + q.pathname;

	if( q.pathname=="/"){
	filename="./index.html";
	}
	
	fs.readFile(filename, "utf-8", function(err, data) {
		if (err) {
			response.writeHead(404, {'Content-Type': 'text/html'});
			console.log("404 Not Found");
			return response.end("404 Not Found");
		} 
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.write(data);
		return response.end();
		});
});



server.listen(1234, function() {
	console.log((new Date()) + ' Server is listening on port 1234');
});



wsServer = new WebSocketServer({
	httpServer: server
});


wsServer.on('request', function(r){
	console.log((new Date()) + ' New connection request received' + r.remoteAddress);
	var connection = r.accept(null, r.origin);
	var id=count++;
	clients[id] = connection
	console.log((new Date()) + ' Connection accepted');

	

	
	connection.on("message", function(str) {
		
		var obj = JSON.parse(str.utf8Data);
		


		if (obj.to == "passwordcheck"){
			console.log("user here for login check");
			var con = mysql.createConnection({
				  host: "localhost",
				  user: "root",
				  password: "12345",
				  database: "deneme4"
			});
			con.connect(function(err) {
			if (err) {
				console.log("Check MySQL Connection!!!");
				throw err;
				
			}
			var sql="SELECT * FROM customers where mail='"+ obj.textmail+ "'" + " and " + "password='" + obj.textpass  + "'";
			console.log(sql);
			var data;
				con.query(sql, function (err, result, fields) {
					if (err) throw err;
					console.log(result);
					if (result != ""){
					data= '{ "response":"valid"}';
					}
					else
						data= '{ "response":"invalid"}';
						
					clients[id].sendUTF(data);
				});
				
					
			});
			
		}
		
		if (obj.to == "find"){
		
			var con = mysql.createConnection({
				  host: "localhost",
				  user: "root",
				  password: "12345",
				  database: "deneme4"
			});
			con.connect(function(err) {
			if (err) {
				console.log("Check MySQL Connection!!!");
				throw err;
				
			}
			var sql="SELECT * FROM customers where userid='"+ obj.textid + "'";
			console.log(sql);
			var data;
				con.query(sql, function (err, result, fields) {
					if (err) throw err;
					console.log(result);
					if (result != ""){
					data= JSON.stringify(result);
					}
					else {
						data="invalid";
					}
					clients[id].sendUTF(data);
					//Aranan id varsa asagidakini dondur yoksa uyari ver
					
				});
				
					
			});
			
		}
		
			if (obj.to == "view"){
		
			var con = mysql.createConnection({
				  host: "localhost",
				  user: "root",
				  password: "12345",
				  database: "deneme4"
			});
			con.connect(function(err) {
			if (err) {
				console.log("Check MySQL Connection!!!");
				throw err;
				
			}
			var sql="SELECT * FROM customers ";
			console.log(sql);
			var data;
				con.query(sql, function (err, result, fields) {
					if (err) throw err;
					console.log(result);
					if (result != ""){
					data= JSON.stringify(result);
					}
					clients[id].sendUTF(data);
				});
				
					
			});
			
		}
			if (obj.to == "delete"){
			
				var con = mysql.createConnection({
					  host: "localhost",
					  user: "root",
					  password: "12345",
					  database: "deneme4"
				});
				con.connect(function(err) {
				if (err) {
					console.log("Check MySQL Connection!!!");
					throw err;
					
				}
				var sql="DELETE FROM customers where userid='"+ obj.textid + "'";
				console.log(sql);
				var data;
					con.query(sql, function (err, result, fields) {
						if (err) throw err;
						console.log("Number of records deleted: " + result.affectedRows);
						if (result != ""){
							data= '{ "response":"valid"}';
						}
						else
							data= '{ "response":"invalid"}';
						
						clients[id].sendUTF(data);
					});
				});
			}
			
			if (obj.to == "passwordcheck2"){
			console.log("user here for login check");
			var con = mysql.createConnection({
				  host: "localhost",
				  user: "root",
				  password: "12345",
				  database: "deneme3"
			});
			con.connect(function(err) {
			if (err) {
				console.log("Check MySQL Connection!!!");
				throw err;
				
			}
			var sql="SELECT * FROM management where id='"+ obj.textid+ "'" + " and " + "password='" + obj.textpass  + "'";
			console.log(sql);
			var data;
				con.query(sql, function (err, result, fields) {
					if (err) throw err;
					console.log(result);
					if (result != ""){
					data= '{ "response":"valid"}';
					}
					else
						data= '{ "response":"invalid"}';
						
					clients[id].sendUTF(data);
				});
				
					
			});
			
		}
		
		
		 if (obj.to == "register"){
		
			console.log("user here for register");
		
			var con = mysql.createConnection({
				host: "localhost",
				user: "root",
				password: "12345",
				database: "deneme4"
			});
			
			con.connect(function(err) {
			if (err) throw err;
			var sql="INSERT INTO customers (USERID,NAME,BIRTHDAY,WEIGHT,HEIGHT,MAIL,GENDER,CITY,ADDRESS,TELEPHONE,PASSWORD,MEMBERTYPE,AMOUNTSTATUS,STARTDATE,PERSONALTRAINER,FACILITY) VALUES('"+ obj.textid + "'" + "," + "'"+ obj.textname + "'" + "," + "'"+ obj.textbday + "'" + "," + "'"+ obj.textweight + "'" + "," + "'"+ obj.textheight + "'" + "," + "'"+ obj.textmail + "'" + "," + "'"+ obj.textgender + "'" + "," + "'"+ obj.textcity + "'" + "," + "'"+ obj.textaddress + "'" + "," + "'"+ obj.texttel + "'" + "," + "'"+ obj.textpass + "'" + "," + "'"+  obj.textmembertype + "'" + "," + "'"+ obj.textamount + "'" + "," + "'"+ obj.textstart + "'" + "," + "'"+ obj.texttrainer + "'" + "," + "'"+ obj.textfacility + "'" + ")";
			console.log(sql);
			
				con.query(sql, function (err, result, fields) {
					var data;
					if (err) { 
						console.log("INVALID");
						data=  '{ "response":"invalid"}'; 
					}
					else {
						data=  '{ "response":"valid"}';
					}
					console.log(result);
					clients[id].sendUTF(data);
				});
			});
		}
		
		
		if (obj.to == "update"){
		
			var con = mysql.createConnection({
				host: "localhost",
				user: "root",
				password: "12345",
				database: "deneme4"
			});
		
			con.connect(function(err) {
			if (err) throw err;
			var sql="UPDATE customers SET name='"+ obj.textname + "', birthday='"+ obj.textbday + "', weight='"+ obj.textweight + "', height='"+ obj.textheight + "', mail='"+ obj.textmail + "', gender='"+ obj.textgender + "', city='"+ obj.textcity + "', address= '"+ obj.textaddress + "', telephone= '"+ obj.texttel + "', password='"+ obj.textpass + "', membertype='"+  obj.textmembertype + "', amountstatus='"+ obj.textamount + "', startdate='"+ obj.textstart + "', personaltrainer='"+ obj.texttrainer + "', facility='"+ obj.textfacility + "'  where userid='"+ obj.textid + "'";
			console.log(sql);
			
				con.query(sql, function (err, result, fields) {
					var data;
					if (err) { 
						console.log("INVALID");
						
					}
					else {
						console.log("UPDATE SUCCESSFULL!");
					}
					console.log(result);
				});

			});
		}
		
		
		
		

});

	connection.on('close', function(reasonCode, description) {
    delete clients[id];
    console.log((new Date()) + connection.remoteAddress + ' is disconnected.');
	});
});
