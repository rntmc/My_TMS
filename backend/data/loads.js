const loads = [
  {
    _id:1,
    method: 'air',
    carrier: 'freight forwarder example',
    freightCost: 500,
    orders: [300,301, 302],
    totalVolume: '10m3',
    totalWeight: '2500kg',
    origin: 'Street 1, CA',
    pickupDate: '01/05/2024',  
    destination: 'final destination, NY',
    deliveryDate: '10/05/2024',
    status: 'Delivered'
  },
  {
    _id:2,
    method: 'FTL',
    carrier: 'freight forwarder example2',
    freightCost: 750,
    orders: [400,441, 442],
    totalVolume: '12m3',
    totalWeight: '12000kg',
    origin: 'Street 4, CA',
    pickupDate: '01/05/2024',  
    destination: 'other destination, NY',
    deliveryDate: '06/05/2024',
    status: 'Pending'
  }
]

export default loads