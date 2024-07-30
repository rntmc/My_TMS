import asyncHandler from '../middleware/asyncHandler.js';
import Entity from '../models/entityModel.js'
import validateAddress from '../utils/validateAddress.js'

// @Desc Register entity
// @ route POST /api/entity
// @access Public
const registerEntity = asyncHandler(async (req, res) => {
  const {
    entityNumber,
    name, 
    contactPerson, 
    phone,
    email,
    location: { address, city, state, postcode, country },
    openingHours,
  } = req.body;

  const entityExist = await Entity.findOne({ entityNumber })

  if (entityExist) {
    res.status(400);
    throw new Error('Entity already exists')
  }

  try {
    await validateAddress({ address, city, state, postcode, country });
  } catch (error) {
    res.status(400);
    throw new Error(`Address validation failed: ${error.message}`);
  }

  const entity = await Entity.create({
    entityNumber,
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

  if(entity) {
    res.status(201).json({
      _id: entity._id,
      entityNumber: entity.entityNumber,
      name: entity.name,
      location: entity.location,
      contactPerson: entity.contactPerson,
      phone: entity.phone,
      email: entity.email,
      openingHours: entity.openingHours,
    })
  } else {
    res.status(400);
    throw new Error('Invalid entity data')
  }
})

// @Desc Get entity
// @ route GET /api/entity
// @access Private
const getEntities = asyncHandler(async (req, res) => {
  const entity = await Entity.find({});
  res.status(200).json(entity)
});

// @Desc Delete entity
// @ route DELETE /api/entity
// @access Private
const deleteEntity = asyncHandler(async (req, res) => {
  const entity = await Entity.findById(req.params.id)

  if(entity) {
    await Entity.deleteOne({_id: entity._id})
    res.status(200).json({message: 'Entity deleted successfully'});
  } else {
    res.status(404);
    throw new Error('Entity not found')
  }
})

// @Desc Get entity by ID
// @ route GET /api/entities/:id
// @access Private/Admin
const getEntityById = asyncHandler(async (req, res) => {
  const entity = await Entity.findById(req.params.id)

  if(entity) {
    res.status(200).json(entity);
  } else {
    res.status(404);
    throw new Error('Entity not found')
  }
})

// @Desc update entity
// @ route PUT /api/entities/:id
// @access Private/Admin
const updateEntity = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    entityNumber, 
    location,
    contactPerson,
    phone,
    email,
    openingHours,
  } = req.body;

  try {
    const entity = await Entity.findById(id);

    if (entity) {
      // Validate address if location is provided in the request body
      if (location) {
        try {
          await validateAddress(location);
        } catch (error) {
          res.status(400).json({ message: `Address validation failed: ${error.message}` });
        }
      }
      entity.name = name || entity.name;
      entity.entityNumber = entityNumber || entity.entityNumber;
      entity.location.address = location?.address || entity.location.address;
      entity.location.city = location?.city || entity.location.city;
      entity.location.state = location?.state || entity.location.state;
      entity.location.country = location?.country || entity.location.country;
      entity.location.postcode = location?.postcode || entity.location.postcode;
      entity.contactPerson = contactPerson || entity.contactPerson;
      entity.phone = phone || entity.phone;
      entity.email = email || entity.email;
      entity.openingHours = openingHours || entity.openingHours;

      const updatedEntity = await entity.save();

      res.status(200).json(updatedEntity);
    } else {
      res.status(404);
      throw new Error('Entity not found');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export {
  registerEntity,
  getEntities,
  deleteEntity,
  getEntityById,
  updateEntity,
}