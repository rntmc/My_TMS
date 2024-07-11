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

// @Desc Get supplier by ID
// @ route GET /api/suppliers/:id
// @access Private/Admin
const getSupplierById = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id)

  if(supplier) {
    res.status(200).json(supplier);
  } else {
    res.status(404);
    throw new Error('Supplier not found')
  }
})

// @Desc update supplier
// @ route PUT /api/suppliers/:id
// @access Private/Admin
const updateSupplier = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    supplierNumber,
    location,
    contactPerson,
    phone,
    email,
    openingHours,
  } = req.body;

  try {
    const supplier = await Supplier.findById(id);

    if (supplier) {
      supplier.name = name || supplier.name;
      supplier.supplierNumber = supplierNumber || supplier.supplierNumber;
      supplier.location.address = location?.address || supplier.location.address;
      supplier.location.city = location?.city || supplier.location.city;
      supplier.location.state = location?.state || supplier.location.state;
      supplier.location.country = location?.country || supplier.location.country;
      supplier.location.postcode = location?.postcode || supplier.location.postcode;
      supplier.contactPerson = contactPerson || supplier.contactPerson;
      supplier.phone = phone || supplier.phone;
      supplier.email = email || supplier.email;
      supplier.openingHours = openingHours || supplier.openingHours;

      const updatedSupplier = await supplier.save();

      res.status(200).json(updatedSupplier);
    } else {
      res.status(404);
      throw new Error('Supplier not found');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export {
  registerSupplier,
  getSuppliers,
  deleteSupplier,
  getSupplierById,
  updateSupplier,
}