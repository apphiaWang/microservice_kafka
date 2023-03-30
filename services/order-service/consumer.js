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
    orderCreateConsumer.subscribe(['orderFail', 'orderSuccess', 'orderCancelSuccess']);
    orderCreateConsumer.consume();
  }).on('data', function(data) {
    const {id} = eventTypes[data.topic].fromBuffer(data.value);
    console.log(`Received ${data.topic} on order ${id}`);
    const status = (data.topic == 'orderSuccess' ? 'APPROVED' :
            data.topic == 'orderFail' ? 'REJECTED' : 'CANCELED');
    con.query(
      `UPDATE orders SET status='${status}' WHERE id=${id}`, 
      (err) => {
          if (err) {
              console.log(err);
              throw err;
          }
    });
  });
}
module.exports = {initConsumer};