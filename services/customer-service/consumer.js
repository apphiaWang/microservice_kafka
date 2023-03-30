const dotenv = require('dotenv');
dotenv.config();
const KAFKA_SERVER = process.env.KAFKA_SERVER;
const Kafka = require('node-rdkafka');
const {con} = require('./db');

const {eventTypes} =require('./eventType.js');
const {queueOrderFailMessage, 
      queueOrderSuccessMessage,
      queueOrderCancelSuccessMessage} = require("./producer");

function initConsumer() {
  const orderCreateConsumer = new Kafka.KafkaConsumer({
    'group.id': 'kafka',
    'metadata.broker.list': KAFKA_SERVER,
  }, {});
  orderCreateConsumer.connect();
  orderCreateConsumer.on('ready', () => {
    console.log('consumer ready..')
    orderCreateConsumer.subscribe(['orderCreate', 'orderCancel']);
    orderCreateConsumer.consume();
  }).on('data', function(data) {
    
    const {id, customerId, amount} = eventTypes[data.topic].fromBuffer(data.value);
    console.log(`recieved ${data.topic} on order ${id}`);
    
    const sql = `SELECT credit FROM customers WHERE id =${customerId};`;
    con.query(sql, function (err, result) {
      if (!result[0]) { // customer does not exist
        if (data.topic == "orderCreate") queueOrderFailMessage(id);
        return;
      }
      const credit = result[0].credit;
      if (data.topic == "orderCreate") {
        if (err || credit < amount) {
          queueOrderFailMessage(id);
        } else {
            const newCredit = credit - amount;
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
      } else if (data.topic == "orderCancel") {
          const newCredit = credit + amount;
          con.query(
              `UPDATE customers SET credit=${newCredit} WHERE id=${customerId}`, 
              (err) => {
              if (err) {
                  console.log(err);
                  throw err;
              }
              queueOrderCancelSuccessMessage(id);
          });
      }
    });

  });
}

module.exports = {initConsumer};