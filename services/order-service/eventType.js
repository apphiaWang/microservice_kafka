const avro = require('avsc');

const eventTypes = {
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
  orderCancel: avro.Type.forSchema({
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
  orderCancelSuccess: avro.Type.forSchema({
    type: 'record',
    fields: [
      {
        name:"id",
        type: "int"
      }
    ]
  }),
}

module.exports ={eventTypes}
