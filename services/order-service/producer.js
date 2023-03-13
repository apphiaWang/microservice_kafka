// const eventType =require('./eventType.js');
const dotenv = require('dotenv');
dotenv.config();
const KAFKA_SERVER = process.env.KAFKA_SERVER;
const Kafka = require('node-rdkafka');

const {eventTypes} = require('./eventType');

const orderCreateStream = Kafka.Producer.createWriteStream({
  'metadata.broker.list': KAFKA_SERVER
}, {}, {
  topic: 'orderCreate'
});

orderCreateStream.on('error', (err) => {
  console.error('Error in our kafka stream');
  console.error(err);
});

function queueCreateOrderMessage(id, customerId, amount) {
  const event = { id, customerId, amount };
  const success = orderCreateStream.write(
    eventTypes.orderCreate.toBuffer(event));     
  if (success) {
    console.log(`message queued (${JSON.stringify(event)})`);
  } else {
    console.log('Too many messages in the queue already..');
  }
}

module.exports ={queueCreateOrderMessage}