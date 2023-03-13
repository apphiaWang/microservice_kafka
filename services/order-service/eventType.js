const avro = require('avsc');

const eventTypes = {
  orderFail: avro.Type.forSchema({
    type: 'record',
    fields: [
      {
        name:"id",
        type: "int"
      }
    ]
  }),
  orderSuccess: avro.Type.forSchema({
    type: 'record',
    fields: [
      {
        name:"id",
        type: "int"
      }
    ]
  }),
  orderCreate: avro.Type.forSchema({
    type: 'record',
    fields: [
      {
        name:"id",
        type: "int"
      },
      {
        name: 'customerId',
        type: "int"
      },
      {
        name: 'amount',
        type: 'int',
      }
    ]
  }),
}
const createCustomerEventType = avro.Type.forSchema({
  type: 'record',
  fields: [
    {
      name:"id",
      type: "int"
    },
    {
      name: 'name',
      type: "string"
    },
    {
      name: 'credit',
      type: 'int',
    }
  ]
});

module.exports ={eventTypes}
