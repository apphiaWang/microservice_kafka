const dotenv = require('dotenv');
dotenv.config();
const KAFKA_SERVER = process.env.KAFKA_SERVER;
const Kafka = require('node-rdkafka');
const {con} = require('./db');

const {eventTypes} =require('./eventType.js');
// const {queueOrderFailMessage, queueOrderSuccessMessage} = require("./producer");

function initConsumer() {
  const orderCreateConsumer = new Kafka.KafkaConsumer({
    'group.id': 'kafka',
    'metadata.broker.list': KAFKA_SERVER,
  }, {});
  orderCreateConsumer.connect();
  orderCreateConsumer.on('ready', () => {
    console.log('consumer ready..')
    orderCreateConsumer.subscribe(['orderFail', 'orderSuccess']);
    orderCreateConsumer.consume();
  }).on('data', function(data) {
    console.log(data.value);
    const {id} = eventTypes[data.topic].fromBuffer(data.value);
    if (data.topic == 'orderSuccess') {
      con.query(
        `UPDATE orders SET status='APPROVED' WHERE id=${id}`, 
        (err) => {
            if (err) {
                console.log(err);
                throw err;
            }
      });
    } else {
      con.query(
        `UPDATE orders SET status='REJECTED' WHERE id=${id}`, 
        (err) => {
            if (err) {
                console.log(err);
                throw err;
            }
      });
    }
  });
}

module.exports = {initConsumer};