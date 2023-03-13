// const eventType =require('./eventType.js');
const dotenv = require('dotenv');
dotenv.config();
const KAFKA_SERVER = process.env.KAFKA_SERVER;
const Kafka = require('node-rdkafka');

const {createCustomerEventType, orderCreateFailType,
  orderCreateSuccessType
} = require('./eventType');

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

orderFailStream.on('error', (err) => {
  console.error('Error in our kafka stream');
  console.error(err);
});

orderSuccessStream.on('error', (err) => {
  console.error('Error in our kafka stream');
  console.error(err);
});

function queueOrderFailMessage(id) {
  const success = orderFailStream.write(orderCreateFailType.toBuffer({id}));     
  if (!success) {
    console.log(`Failed to write orderFailMessage orderId=${id}`);
  }
}

function queueOrderSuccessMessage(id) {
  const success = orderSuccessStream.write(orderCreateSuccessType.toBuffer({id}));
  if (!success) {
    console.log(`Failed to write orderSuccessMessage orderId=${id}`);
  }
}

module.exports ={queueOrderFailMessage, queueOrderSuccessMessage}