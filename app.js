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


app.get('/api/:cer/:key/:pass', function(req, res, next) {
	res.locals.connection.query("SELECT * FROM users WHERE certificado='" + req.params.cer + "' AND keysat='" + req.params.key + "' AND pass='" + req.params.pass + "'", function (error, results, fields) {
       
        if(results.length > 0){
            res.jsonp({status: 200, error: null, userStatus: "Accept"});
        }else{
            res.jsonp({status: 200, error: null, userStatus: "Reject"});
		}
		if (error) throw error;
		
	});
});

app.listen(3000, () =>{
    console.log("Escuchando por el puerto 3000");
})
  