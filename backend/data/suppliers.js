const suppliers = [
  {
    supplierNumber: 557198,
    name: 'Supplier one',
    location: {
      address: 'street 1',
      city: 'Los Angeles',
      state: 'CA',
      postcode: '55555',
      country: 'USA'
    },
    contactPerson: 'John Silva',
    phone:'111222333',
    email: 'john@plant.com',
    openingHours: [
      { day: 'Monday', open: '07:00', close: '20:00' },
      { day: 'Tuesday', open: '07:00', close: '20:00' },
      { day: 'Wednesday', open: '07:00', close: '20:00' },
      { day: 'Thursday', open: '07:00', close: '20:00' },
      { day: 'Friday', open: '07:00', close: '20:00' },
    ]
  },
]

export default suppliers;