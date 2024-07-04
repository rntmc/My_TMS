const orders = 
[
  {
    orderId: 300,
    pickupDate: '2024-05-01',
    deliveryDate: '2024-05-10',
    origin: {
      supplierNumber:557198,
      supplierName: 'Supplier One',
      supplierLocation:{
        address: 'street 1',
        city: 'Los Angeles',
        state: 'CA',
        postcode: '55555',
        country: 'USA'
      }
    },
    destination: {
      plantNumber:100,
      plantName: 'Plant One',
      plantLocation: {
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
        length: 10,
        width: 1,
        height: 1,
        volume: 10,
        weight: 2500,
      }
    ],
    freightCost: 500,
    productId: 'P12345',
    productQuantity: 50,
    dangerousGoods: false,
    carrier: 'Great Forwarder',
    status: 'confirmed'
  },
  {
    orderId: 301,
    pickupDate: '2024-05-02',
    deliveryDate: '2024-05-11',
    origin: {
      supplierNumber:557198,
      supplierName: 'Supplier Two',
      supplierLocation: {
        address: 'street 2',
        city: 'San Francisco',
        state: 'CA',
        postcode: '55556',
        country: 'USA'
      }
    },
    destination: {
      plantNumber: 557198,
      plantName: 'Plant One',
      plantLocation: {
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
        length: 10,
        width: 1,
        height: 1.5,
        volume: 15,
        weight: 3000,
      }
    ],
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