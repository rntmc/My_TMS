import asyncHandler from '../middleware/asyncHandler.js';
import Supplier from '../models/supplierModel.js'

// @Desc Register carrier
// @ route POST /api/carriers
// @access Public
const registerSupplier = asyncHandler(async (req, res) => {
  const {
    supplierNumber,
    name, 
    contactPerson, 
    phone,
    email,
    location: { address, city, state, postcode, country },
    openingHours,
  } = req.body;

  const supplierExist = await Supplier.findOne({ supplierNumber })

  if (supplierExist) {
    res.status(400);
    throw new Error('Supplier already exists')
  }

  const supplier = await Supplier.create({
    supplierNumber,
    name, 
    contactPerson, 
    phone,
    email,
    location: 
      {
        address,     // Ensure nested address fields are correctly passed as an object
        city,
        state,
        postcode,
        country
      },
    openingHours,
  });

  if(supplier) {
    res.status(201).json({
      _id: supplier._id,
      supplierNumber: supplier.supplierNumber,
      name: supplier.name,
      location: supplier.location,
      contactPerson: supplier.contactPerson,
      phone: supplier.phone,
      email: supplier.email,
      openingHours: supplier.openingHours,
    })
  } else {
    res.status(400);
    throw new Error('Invalid supplier data')
  }
})

// @Desc Get carriers
// @ route GET /api/carriers
// @access Private
const getSuppliers = asyncHandler(async (req, res) => {
  const supplier = await Supplier.find({});
  res.status(200).json(supplier)
});

export {
  registerSupplier,
  getSuppliers,
}