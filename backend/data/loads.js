const loads = [
  {
    loadNumber: 1,
    pickupDate: '01/05/2024',
    deliveryDate: '10/05/2024',
    origin: {
      entityNumber:557198,
      entityName: 'Supplier One',
      entityLocation: {
        address: 'street 2',
        city: 'San Francisco',
        state: 'CA',
        postcode: '55556',
        country: 'USA'
      }
    },
    destination: {
      entityNumber: 100,
      entityName: 'Plant One',
      entityLocation: {
        address: 'street 6',
        city: 'New York',
        state: 'NY',
        postcode: '11111',
        country: 'USA'
      }
    },
    carrierNumber: 55454,
    carrierName: 'Great Forwarder',
    transportType: 'AIR',
    orders: [300, 301],
    totalFreightCost: 500,
    totalVolume: 10,
    totalWeight: 2500,
    licensePlate: 'sa131a',
    driver: 'Joao da Silva',
    insurance: 'JLT',
    storageAndTransportConditions: 'regular',
    specialNotes: 'Expected to be delivered on time',
    document: 'image.jpg',
    status: 'Collected'
  },
  {
    loadNumber: 2,
    pickupDate: '05/05/2024',
    deliveryDate: '10/05/2024',
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
    carrierNumber: 55454,
    carrierName: 'Great Forwarder',
    transportType: 'LTL',
    orders: [10000],
    totalFreightCost: 950,
    totalVolume: 15,
    totalWeight: 12300,
    licensePlate: 'SSS442',
    driver: 'Joao da Silva',
    insurance: 'IAC',
    storageAndTransportConditions: 'regular',
    specialNotes: 'Delivered as expected',
    document: 'image.jpg',
    status: 'Delivered'
  },
]

export default loads