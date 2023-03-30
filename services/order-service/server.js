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
const {queueCreateOrderMessage, queueCancelOrderMessage} = require('./producer');

const {initConsumer} = require('./consumer');

initConsumer();

// curl -d "customerId=1&amount=10" -X POST http://localhost:3002/api/addOrder
app.post('/api/addOrder', (req, res, next) => {
    const customerId = parseInt(req.body.customerId);
    const amount = parseInt(req.body.amount);
    const sql = `INSERT INTO orders (customerId, amount, status) 
                VALUES ('${customerId}', ${amount}, 'PENDING');`;
    con.query(sql, function (err, result) {
        if (err) {
            res.status(400).send(JSON.stringify({errorMessage: err.sqlMessage}));
        } else {
            queueCreateOrderMessage(result.insertId, customerId, amount);
            res.end(JSON.stringify({orderId: result.insertId}));
        }
    });
});

// curl  -X GET http://localhost:3002/api/order/33
app.get('/api/order/:id', (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * FROM orders WHERE id = ${id};`;
    con.query(sql, function (err, result) {
        if (err) {
            res.status(400).send(JSON.stringify({errorMessage: err.sqlMessage}));
        } else {
            res.end(JSON.stringify(result[0]));
        }
    });
});

// curl -X POST http://localhost:3002/api/cancelOrder/1
app.post('/api/cancelOrder/:id', (req, res, next) => {
    const sql = `SELECT * FROM orders WHERE id = ${req.params.id};`;
    con.query(sql, function (err, result) {
        if (err) {
            res.status(400).send(JSON.stringify({errorMessage: err.sqlMessage}));
        } else if (!result[0]) {
            res.status(404).send(JSON.stringify({errorMessage: "no order found"}));
        } else {
            const {id, customerId, amount} = result[0];
            con.query(
                `UPDATE orders SET status='PENDING_CANCEL' where id=${id};`, 
                (err) => {
                if (err) {
                    res.status(400).send(JSON.stringify({errorMessage: err.sqlMessage}));
                } else {
                    queueCancelOrderMessage(id, customerId, amount);
                    res.end(JSON.stringify({orderId: id}));
                }
            });
            
        }
    });
});

const server = app.listen(CONFIG.PORT, () => {
   console.log(`Customer Service started at ${CONFIG.HOST}:${CONFIG.PORT}`)
});