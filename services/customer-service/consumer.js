const dotenv = require('dotenv');
dotenv.config();
const KAFKA_SERVER = process.env.KAFKA_SERVER;
const Kafka = require('node-rdkafka');
const {con} = require('./db');

const {orderCreateEventType} =require('./eventType.js');
const {queueOrderFailMessage, queueOrderSuccessMessage} = require("./producer");

function initConsumer() {
  const orderCreateConsumer = new Kafka.KafkaConsumer({
    'group.id': 'kafka',
    'metadata.broker.list': KAFKA_SERVER,
  }, {});
  orderCreateConsumer.connect();
  orderCreateConsumer.on('ready', () => {
    console.log('consumer ready..')
    orderCreateConsumer.subscribe(['orderCreate']);
    orderCreateConsumer.consume();
  }).on('data', function(data) {
    console.log(orderCreateEventType.fromBuffer(data.value))
    const {id, customerId, amount} = orderCreateEventType.fromBuffer(data.value);
    const sql = `SELECT credit FROM customers WHERE id =${customerId};`;
    con.query(sql, function (err, result) {
      const credit = result[0].credit; 
      if (err || credit < amount) {
        queueOrderFailMessage(id);
      } else {
          const newCredit = credit - amount;
          console.log(credit, newCredit, amount);
          con.query(
              `UPDATE customers SET credit=${newCredit} WHERE id=${customerId}`, 
              (err) => {
                  if (err) {
                      console.log(err);
                      throw err;
                  }
                  queueOrderSuccessMessage(id);
          });
      }
    });
  });
}

module.exports = {initConsumer};