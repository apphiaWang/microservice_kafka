// const eventType =require('./eventType.js');
const dotenv = require('dotenv');
dotenv.config();
const KAFKA_SERVER = process.env.KAFKA_SERVER;
const Kafka = require('node-rdkafka');

const avro = require('avsc');
const {createCustomerEventType, orderCreateFailType,
  orderCreateSuccessType
} = require('./eventType');
const eventType = avro.Type.forSchema({
  type: 'record',
  fields: [
    {
      name:"id",
      type: "int"
    },
    {
      name: 'category',
      type: { type: 'enum', symbols: ['DOG', 'CAT'] }
    },
    {
      name: 'noise',
      type: 'string',
    }
  ]
});

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

// function queueCreateCustomerMessage(id, name, credit) {
//   const event = { id, name, credit };
//   const success = stream.write(createCustomerEventType.toBuffer(event));     
//   if (success) {
//     console.log(`message queued (${JSON.stringify(event)})`);
//   } else {
//     console.log('Too many messages in the queue already..');
//   }
// }

function queueOrderFailMessage(id) {
  const success = orderFailStream.write(orderCreateFailType.toBuffer({id}));     
  console.log(`message queued (${JSON.stringify({id})})`);
  
  if (!success) {
    console.log(`Failed to write orderFailMessage orderId=${id}`);
  }
}

function queueOrderSuccessMessage(id) {
  const success = orderSuccessStream.write(orderCreateSuccessType.toBuffer({id}));
  console.log(`message queued (${JSON.stringify({id})})`);
  if (!success) {
    console.log(`Failed to write orderSuccessMessage orderId=${id}`);
  }
}


module.exports ={queueOrderFailMessage, queueOrderSuccessMessage}