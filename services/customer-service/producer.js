// const eventType =require('./eventType.js');
const dotenv = require('dotenv');
dotenv.config();
const KAFKA_SERVER = process.env.KAFKA_SERVER;
const Kafka = require('node-rdkafka');

const {eventTypes} = require('./eventType');

const orderFailStream = Kafka.Producer.createWriteStream({
  'metadata.broker.list': KAFKA_SERVER
}, {}, {
  topic: 'orderFail'
});
const orderSuccessStream = Kafka.Producer.createWriteStream({
  'metadata.broker.list': KAFKA_SERVER
}, {}, {
  topic: 'orderSuccess'
});
const orderCancelSuccessStream = Kafka.Producer.createWriteStream({
  'metadata.broker.list': KAFKA_SERVER
}, {}, {
  topic: 'orderCancelSuccess'
});


// orderFailStream.on('error', (err) => {
//   console.error('Error in our kafka stream');
//   console.error(err);
// });

// orderSuccessStream.on('error', (err) => {
//   console.error('Error in our kafka stream');
//   console.error(err);
// });

function queueOrderFailMessage(id) {
  const success = orderFailStream.write(eventTypes.orderFail.toBuffer({id}));     
  if (success) {
    console.log(`message queued orderFailMessage orderId=${id}`);
  } else {
    console.log(`Failed to write orderFailMessage orderId=${id}`);
  }
}

function queueOrderSuccessMessage(id) {
  const success = orderSuccessStream.write(eventTypes.orderSuccess.toBuffer({id}));
  if (success) {
    console.log(`message queued orderSuccessMessage orderId=${id}`);
  } else {
    console.log(`Failed to write orderSuccessMessage orderId=${id}`);
  }
}
function queueOrderCancelSuccessMessage(id) {
  const success = orderCancelSuccessStream.write(eventTypes.orderCancelSuccess.toBuffer({id}));
  if (success) {
    console.log(`message queued OrderCancelSuccessMessage orderId=${id}`);
  } else {
    console.log(`Failed to write OrderCancelSuccessMessage orderId=${id}`);
  }
}

module.exports ={queueOrderFailMessage, queueOrderSuccessMessage, queueOrderCancelSuccessMessage};