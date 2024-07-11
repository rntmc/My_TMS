const orders = 
[
  {
    orderId:10000,
    pickupDate: '2024-05-01',
    deliveryDate: '2024-05-10',
    origin: {
      entityNumber:557198,
      entityName: 'Supplier One',
      entityLocation:{
        address: 'street 1',
        city: 'Los Angeles',
        state: 'CA',
        postcode: '55555',
        country: 'USA'
      }
    },
    destination: {
      entityNumber:100,
      entityName: 'Plant One',
      entityLocation: {
        address: 'street 6',
        city: 'New York',
        state: 'NY',
        postcode: '11111',
        country: 'USA'
      }
    },
    productId: 'P12345',
    productQuantity: 50,
    packageQty: 2,
    length: 10,
    width: 1,
    height: 1,
    volume: 10,
    weight: 2500,
    freightCost: 500,
    dangerousGoods: false,
    carrier: 'Great Forwarder',
    status: 'confirmed',
  },
  {
    orderId:10001,
    pickupDate: '2024-05-02',
    deliveryDate: '2024-05-11',
    origin: {
      entityNumber:557198,
      entityName: 'entity Two',
      entityLocation: {
        address: 'street 2',
        city: 'San Francisco',
        state: 'CA',
        postcode: '55556',
        country: 'USA'
      }
    },
    destination: {
      entityNumber: 557198,
      entityName: 'entity One',
      entityLocation: {
        address: 'street 6',
        city: 'New York',
        state: 'NY',
        postcode: '11111',
        country: 'USA'
      }
    },
    packageQty: 2,
    length: 10,
    width: 1,
    height: 1.5,
    volume: 15,
    weight: 3000,
    freightCost: 950,
    productId: 'P12346',
    productQuantity: 100,
    dangerousGoods: true,
    carrier: 'Great Forwarder',
    status: 'delivered'
  },
]

export default orders;