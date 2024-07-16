const orders = 
[
  {
    orderNumber:10000,
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
    packages: [
      {
        packageQty: 2,
        length: 100,
        width: 100,
        height: 100,
        volume: 1,
        weight: 2500
      },
      {
        packageQty: 1,
        length: 100,
        width: 100,
        height: 100,
        volume: 1,
        weight: 1500
      }
    ],
    products: [
      {
        productId: 'P12345',
        productQuantity: 50
      }
    ],
    freightCost: 500,
    dangerousGoods: false,
    carrier: 'Great Forwarder',
    document: 'image.jpg',
    status: 'confirmed',
  },
  {
    orderNumber:10001,
    pickupDate: '2024-05-02',
    deliveryDate: '2024-05-11',
    origin: {
      entityNumber:557198,
      entityName: 'Entity Two',
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
      entityName: 'Entity One',
      entityLocation: {
        address: 'street 6',
        city: 'New York',
        state: 'NY',
        postcode: '11111',
        country: 'USA'
      }
    },
    packages: [
      {
        packageQty: 2,
        length: 100,
        width: 100,
        height: 150,
        volume: 1.5,
        weight: 3000
      }
    ],
    products: [
      {
        productId: 'P12346',
        productQuantity: 100
      }
    ],
    freightCost: 950,
    dangerousGoods: true,
    carrier: 'Great Forwarder',
    document: 'image.jpg',
    status: 'delivered'
  },
]

export default orders;
