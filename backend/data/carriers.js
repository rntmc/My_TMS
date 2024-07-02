const carriers = [
  {
    name: 'Great Forwarder',
    contactPerson: 'John Doe',
    contactInfo: { email: 'contact@example.com', phone: '123-456-7890' },
    address: {
      address: '123 Main St',
      city: 'Some City',
      state: 'CA',
      postcode: '12345',
      country: 'USA'
    },
    servicesOffered: ['Air Freight', 'Sea Freight'],
    insuranceCoverage: 'Full Coverage',
  fleetInfo: { numberOfVehicles: 50, vehicleTypes: ['Truck', 'Van'] }
  },
  {
    name: 'Secondary Forwarder',
    contactPerson: 'John Smith',
    contactInfo: { email: 'john@example.com', phone: '123-456-7890' },
    address: {
      address: '111 Other St',
      city: 'Salt Lake City',
      state: 'UT',
      postcode: '99999',
      country: 'USA'
    },
    servicesOffered: ['LTL', 'Milk Run'],
    insuranceCoverage: 'Full Coverage',
  fleetInfo: { numberOfVehicles: 12, vehicleTypes: ['Truck'] }
  }
]

export default carriers;