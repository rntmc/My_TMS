import asyncHandler from '../middleware/asyncHandler.js';
import Supplier from '../models/supplierModel.js'

// @Desc Register supplier
// @ route POST /api/supplier
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

// @Desc Get supplier
// @ route GET /api/supplier
// @access Private
const getSuppliers = asyncHandler(async (req, res) => {
  const supplier = await Supplier.find({});
  res.status(200).json(supplier)
});

// @Desc Delete supplier
// @ route DELETE /api/supplier
// @access Private
const deleteSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id)

  if(supplier) {
    await Supplier.deleteOne({_id: supplier._id})
    res.status(200).json({message: 'Supplier deleted successfully'});
  } else {
    res.status(404);
    throw new Error('Supplier not found')
  }
})

export {
  registerSupplier,
  getSuppliers,
  deleteSupplier,
}