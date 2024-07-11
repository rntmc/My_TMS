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

// @Desc delete carriers
// @ route DELETE /api/carriers
// @access Private
const deleteCarrier = asyncHandler(async (req, res) => {
  const carrier = await Carrier.findById(req.params.id)

  if(carrier) {
    await carrier.deleteOne({_id: carrier._id})
    res.status(200).json({message: 'carrier deleted successfully'});
  } else {
    res.status(404);
    throw new Error('carrier not found')
  }
})

// @Desc Get carrier by ID
// @ route GET /api/carriers/:id
// @access Private/Admin
const getCarrierById = asyncHandler(async (req, res) => {
  const carrier = await Carrier.findById(req.params.id)

  if(carrier) {
    res.status(200).json(carrier);
  } else {
    res.status(404);
    throw new Error('Carrier not found')
  }
})

// @Desc update carrier
// @ route PUT /api/carriers/:id
// @access Private/Admin
const updateCarrier = asyncHandler(async (req, res) => {
  const carrier = await Carrier.findById(req.params.id);

  if (carrier) {
    carrier.name = req.body.name || carrier.name;
    carrier.contactPerson = req.body.contactPerson || carrier.contactPerson;
    carrier.contactEmail = req.body.contactEmail || carrier.contactEmail;
    carrier.contactPhone = req.body.contactPhone || carrier.contactPhone;
    carrier.address.address = req.body.address?.address || carrier.address.address;
    carrier.address.city = req.body.address?.city || carrier.address.city;
    carrier.address.state = req.body.address?.state || carrier.address.state;
    carrier.address.country = req.body.address?.country || carrier.address.country;
    carrier.address.postcode = req.body.address?.postcode || carrier.address.postcode;
    carrier.servicesOffered = req.body.servicesOffered || carrier.servicesOffered;
    carrier.insuranceCoverage = req.body.insuranceCoverage || carrier.insuranceCoverage;
    carrier.fleetInfo.numberOfVehicles = req.body.fleetInfo?.numberOfVehicles || carrier.fleetInfo.numberOfVehicles;
    carrier.fleetInfo.vehicleTypes = req.body.fleetInfo?.vehicleTypes || carrier.fleetInfo.vehicleTypes;

    const updatedCarrier = await carrier.save();

    res.status(200).json({
      _id: updatedCarrier._id,
      name: updatedCarrier.name,
      contactPerson: updatedCarrier.contactPerson,
      contactEmail: updatedCarrier.contactEmail,
      contactPhone: updatedCarrier.contactPhone,
      address: {
        address: updatedCarrier.address.address,
        city: updatedCarrier.address.city,
        state: updatedCarrier.address.state,
        country: updatedCarrier.address.country,
        postcode: updatedCarrier.address.postcode,
      },
      servicesOffered: updatedCarrier.servicesOffered,
      insuranceCoverage: updatedCarrier.insuranceCoverage,
      fleetInfo: {
        numberOfVehicles: updatedCarrier.fleetInfo.numberOfVehicles,
        vehicleTypes: updatedCarrier.fleetInfo.vehicleTypes,
      },
    });
  } else {
    res.status(404);
    throw new Error('Carrier not found');
  }
});

export {
  registerCarrier,
  getCarriers,
  deleteCarrier,
  getCarrierById,
  updateCarrier,
}