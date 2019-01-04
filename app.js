var mysql = require('mysql');
var express = require('express');
var cors = require('cors');
var app = express();

app.use(cors({
	'allowedHeaders': ['sessionId', 'Content-Type'],
	'exposedHeaders': ['sessionId'],
	'origin': '*',
	'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
	'preflightContinue': false
}));

app.use(function(req, res, next){
	res.locals.connection = mysql.createConnection({
		host     : 'esignapidb.chpg1oxhskid.us-west-2.rds.amazonaws.com',
		user     : 'root',
		password : 'admin123',
		database : 'esignapidb'
	});
	res.locals.connection.connect();
	next();
});

app.get('/',function(req,res){

	res.locals.connection.query("SELECT * FROM users",function (error, results, fields){
		if(results.length > 0){
            res.jsonp({
				status: 200,
				userStatus: "Accept",
				users: results
			});
        }
	})

});

app.get('/api/:cer/:key/:pass', function(req, res) {
	
	var hash= "||"+req.params.cer+"||"+req.params.key+"||"+req.params.pass+"||"+Date.now()+"||";
	
	res.locals.connection.query("SELECT * FROM users WHERE certificado='" + req.params.cer +
	 "' AND keysat='" + req.params.key + "' AND pass='" + req.params.pass + 
	 "'", function (error, results, fields) {
       
        if(results.length > 0){
            res.jsonp({status: 200, error: null, userStatus: "Accept",firma:hash});
        }else{
            res.jsonp({status: 200, error: null, userStatus: "Reject"});
		}
		if (error) throw error;
		
	});
});

app.delete('/api/:cer',function(req, res){
	res.locals.connection.query("DELETE FROM users WHERE certificado='"+req.params.cer+"'", 
	function(error, results, fields){
		if(error){
            res.jsonp({status:400,resul:error});
        }
		else{
			res.jsonp({status: 200,user:'Accept'});
		}
	})
});

app.post('/api/:cer/:key/:pass',function(req,res){

	res.locals.connection.query("INSERT INTO users VALUES (0,'"+req.params.cer+"','"+req.params.key+
	"','"+req.params.pass+"');",function(error,results,fields){
		if(error){
            res.jsonp({status:400,resul:error});
        }
		else{
			res.jsonp({status: 200,user:'Accept'});
		}
	});
});

app.put('/api/:cer/:CertificadoCambiado',function(req,res){
	
	res.locals.connection.query("UPDATE users SET certificado='"+req.params.CertificadoCambiado+"' WHERE certificado='"+req.params.cer+"';",function(error,results,fields){
		if(error){
            res.jsonp({status:400,resultado:error});
        }
		else{
			res.jsonp({status: 200,Query:'Accept',resultado:results});
		}
	});
});

app.listen(3000, () =>{
    console.log("Escuchando por el puerto 3000");
});