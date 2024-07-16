const loads = [
  {
    loadNumber: 1,
    pickupDate: '2024-05-01',
    deliveryDate: '2024-05-10',
    origin: {
      entityNumber: 557198,
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
    orders: [
      {
        orderNumber: [10000],
        packages: [
          {
            packageQty: 2,
            length: 100,
            width: 100,
            height: 10,
            volume: 1,
            weight: 2500
          }
        ],
      }
    ],
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
    pickupDate: '2024-05-02',
    deliveryDate: '2024-05-11',
    origin: {
      entityNumber: 557198,
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
    orders: [
      {
        orderNumber: [10001],  
        packages: [
          {
            packageQty: 2,
            length: 100,
            width: 100,
            height: 150,
            volume: 1.5,
            weight: 3000
          },
        ],
      }
    ],
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
];

export default loads;
