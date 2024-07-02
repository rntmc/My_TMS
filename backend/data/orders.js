const orders = 
[
  {
    orderId: 300,
    pickupDate: '2024-05-01',
    deliveryDate: '2024-05-10',
    origin: {
      address: 'street 1',
      city: 'Los Angeles',
      state: 'CA',
      postcode: '55555',
      country: 'USA'
    },
    destination: {
      address: 'street 6',
      city: 'New York',
      state: 'NY',
      postcode: '11111',
      country: 'USA'
    },
    volume: 10,
    weight: 2500,
    freightCost: 500,
    productId: 'P12345',
    productQuantity: 50,
    dangerousGoods: false,
  },
  {
    orderId: 301,
    pickupDate: '2024-05-02',
    deliveryDate: '2024-05-11',
    origin: {
      address: 'street 2',
      city: 'San Francisco',
      state: 'CA',
      postcode: '55556',
      country: 'USA'
    },
    destination: {
      address: 'street 7',
      city: 'Chicago',
      state: 'IL',
      postcode: '11112',
      country: 'USA'
    },
    volume: 15,
    weight: 3000,
    freightCost: 950,
    productId: 'P12346',
    productQuantity: 100,
    dangerousGoods: false,
  },
]

export default orders;