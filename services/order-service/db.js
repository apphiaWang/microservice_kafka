// read config
const dotenv = require('dotenv');
dotenv.config();
const MYSQL_CON = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
}
// create mysql connection
const mysql = require('mysql');
const con = mysql.createConnection(MYSQL_CON);
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

module.exports ={con}