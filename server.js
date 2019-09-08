var express = require('express');
var app = express();
var mysql = require('mysql');
var cors = require('cors');
var bodyParser = require('body-parser');

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var pool        = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : '',
    database        : 'map-marker'
});

app.get('/getlocations', function (req, res) {
    pool.getConnection(function (err, connection) {
        connection.query("SELECT placeid as placeId, place as label, lattitude as latitude, longitude  FROM places", function (err, rows) {
            connection.release();
            if (err) throw err;

            console.log(rows);
            res.json(rows);
        });
    });
})

app.post('/addlocation', function (req, res) {
    console.log(req.body)
  let placeid = req.body.placeid
  let place = req.body.place
  let lat = req.body.lattitude
  let long = req.body.longitude

  var sql = `INSERT INTO places (placeid, place, lattitude, longitude ) VALUES ('${placeid}','${place}','${lat}','${long}')`
    console.log(sql)
  pool.getConnection(function (err, connection) {
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      });
  });
})

app.delete('/deletelocation', function (req, res) {
    let placeid = req.body.placeid
    var sql = `DELETE FROM places WHERE placeid = '${placeid}'`;
    pool.getConnection(function (err, connection) {
      connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record deleted");
        });
    });
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})