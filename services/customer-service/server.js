// read config
const dotenv = require('dotenv');
dotenv.config();
const CONFIG = {
    HOST: process.env.HOST,
    PORT: process.env.PORT,
}
// initialize express server
var express = require('express');
const bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const {con} = require('./db');

// event producer
// const {queueCreateCustomerMessage} = require('./producer');
const {initConsumer} = require('./consumer');

initConsumer();

// curl -d "credit=200&name=yanfei" -X POST http://localhost:3001/api/createCustomer
app.post('/api/createCustomer', (req, res, next) => {
    const name = req.body.name;
    const credit = parseInt(req.body.credit);
    const sql = `INSERT INTO customers (name, credit) VALUES ('${name}', ${credit})`;
    con.query(sql, function (err, result) {
        if (err) {
            res.status(400).send(JSON.stringify({errorMessage: err.sqlMessage}));
        } else {
            // queueCreateCustomerMessage(result.insertId, name, credit);
            res.end(JSON.stringify({customerId: result.insertId}));
        }
    });
});

// curl  -X GET http://localhost:3001/api/customer/1
app.get('/api/customer/:id', (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * FROM customers WHERE id = ${id};`;
    con.query(sql, function (err, result) {
        if (err) {
            res.status(400).send(JSON.stringify({errorMessage: err.sqlMessage}));
        } else {
            res.end(JSON.stringify(result[0]));
        }
    });
});

const server = app.listen(CONFIG.PORT, () => {
   console.log(`Customer Service started at ${CONFIG.HOST}:${CONFIG.PORT}`)
});

