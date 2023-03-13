const avro = require('avsc');

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

const orderCreateEventType = avro.Type.forSchema({
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
});

const orderCreateFailType = avro.Type.forSchema({
  type: 'record',
  fields: [
    {
      name:"id",
      type: "int"
    }
  ]
});

const orderCreateSuccessType = avro.Type.forSchema({
  type: 'record',
  fields: [
    {
      name:"id",
      type: "int"
    }
  ]
});

module.exports ={createCustomerEventType, orderCreateEventType,
          orderCreateFailType, orderCreateSuccessType}
