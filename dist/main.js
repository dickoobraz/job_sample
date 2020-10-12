var express = require('express')
var app = express();
var mysql = require('mysql');
var bodyparser = require('body-parser');


var mysqlConnection = mysql.createConnection({
host: process.env.MYSQL_URL,
user: process.env.MYSQL_USERNAME,
password: process.env.MYSQL_PASSWORD,
database: process.env.MYSQL_DATABASE,
multipleStatements: true
});
mysqlConnection.connect((err)=> {
if(!err)
console.log('Connection Established Successfully');
else
console.log('Connection Failed!'+ JSON.stringify(err,undefined,2));
});
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));

app.get('/' , (req, res) => {
mysqlConnection.query('SELECT * FROM Students', (err, rows, fields) => {
if (!err)
res.send(rows);
else
console.log(err);
})
} );

