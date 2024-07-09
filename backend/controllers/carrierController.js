import asyncHandler from '../middleware/asyncHandler.js';
import Carrier from '../models/carrierModel.js'

// @Desc Register carrier
// @ route POST /api/carriers
// @access Public
const registerCarrier = asyncHandler(async (req, res) => {
  const {
    carrierNumber,
    name, 
    contactPerson, 
    contactInfo: { email, phone }, 
    address: { address, city, state, postcode, country },
    servicesOffered, 
    insuranceCoverage, 
    fleetInfo: { numberOfVehicles, vehicleTypes }
  } = req.body;

  const carrierExist = await Carrier.findOne({ name })

  if (carrierExist) {
    res.status(400);
    throw new Error('Carrier already exists')
  }

  const carrier = await Carrier.create({
    carrierNumber,
    name, 
    contactPerson, 
    contactInfo: {
      email,
      phone,
    }, 
    address: {
      address,     // Ensure nested address fields are correctly passed as an object
      city,
      state,
      postcode,
      country
    },
    servicesOffered, 
    insuranceCoverage, 
    fleetInfo: {
      numberOfVehicles,
      vehicleTypes,
    }
  });

  if(carrier) {

    res.status(201).json({
      _id: carrier._id,
      carrierNumber: carrier.carrierNumber,
      name: carrier.name,
      contactPerson: carrier.contactPerson,
      contactInfo: carrier.contactInfo,
      address: carrier.address,
      servicesOffered: carrier.servicesOffered,
      insuranceCoverage: carrier.insuranceCoverage,
      fleetInfo: carrier.fleetInfo,
    })
  } else {
    res.status(400);
    throw new Error('Invalid carrier data')
  }
})

// @Desc Get carriers
// @ route GET /api/carriers
// @access Private
const getCarriers = asyncHandler(async (req, res) => {
  const carriers = await Carrier.find({});
  res.status(200).json(carriers)
});

export {
  registerCarrier,
  getCarriers,
}