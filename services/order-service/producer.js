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
const orderCancelStream = Kafka.Producer.createWriteStream({
  'metadata.broker.list': KAFKA_SERVER
}, {}, {
  topic: 'orderCancel'
});

// orderCreateStream.on('error', (err) => {
//   console.error('Error in our kafka stream');
//   console.error(err);
// });

function queueCreateOrderMessage(id, customerId, amount) {
  const event = { id, customerId, amount };
  const success = orderCreateStream.write(
    eventTypes.orderCreate.toBuffer(event));     
  if (success) {
    console.log(`message queued CreateOrderMessage (${JSON.stringify(event)})`);
  } else {
    console.log('Failed to write CreateOrderMessage orderId=${id}');
  }
}
function queueCancelOrderMessage(id, customerId, amount) {
  const event = { id, customerId, amount };
  const success = orderCancelStream.write(
    eventTypes.orderCancel.toBuffer(event));     
  if (success) {
    console.log(`message queued CancelOrderMessage (${JSON.stringify(event)})`);
  } else {
    console.log('Failed to write CancelOrderMessage orderId=${id}');
  }
}

module.exports ={queueCreateOrderMessage, queueCancelOrderMessage}