const loads = [
  {
    loadId: 1,
    pickupDate: '01/05/2024',
    deliveryDate: '10/05/2024',
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
    carrier: 'Great Forwarder',
    transportType: 'AIR',
    orders: [300],
    totalFreightCost: 500,
    totalVolume: 10,
    totalWeight: 2500,
    licensePlate: 'sa131a',
    driver: 'Joao da Silva',
    insurance: 'JLT',
    storageAndTransportConditions: 'regular',
    specialNotes: 'Expected to be delivered on time',
    status: 'Collected'
  },
  {
    loadId: 2,
    pickupDate: '05/05/2024',
    deliveryDate: '10/05/2024',
    origin: {
      address: 'street 33',
      city: 'San Diego',
      state: 'CA',
      postcode: '44444',
      country: 'USA'
    },
    destination: {
      address: 'Richmond Avenue',
      city: 'New York',
      state: 'NY',
      postcode: '22222',
      country: 'USA'
    },
    carrier: 'Secondary Forwarder',
    transportType: 'LTL',
    orders: [301],
    totalFreightCost: 950,
    totalVolume: 15,
    totalWeight: 12300,
    licensePlate: 'SSS442',
    driver: 'Joao da Silva',
    insurance: 'IAC',
    storageAndTransportConditions: 'regular',
    specialNotes: 'Delivered as expected',
    status: 'Delivered'
  },
]

export default loads