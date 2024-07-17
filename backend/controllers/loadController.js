import asyncHandler from '../middleware/asyncHandler.js';
import Load from '../models/loadModel.js'

// @Desc Fetch all loads
// @ route GET /api/loads
// @access Public
const getLoads = asyncHandler(async (req, res) => {
  const loads = await Load.find({})
  res.json(loads)
})

// @Desc Fetch a load
// @ route GET /api/loads/:id
// @access Public
const getLoadsById = asyncHandler(async (req, res) => {
  const load = await Load.findById(req.params.id).populate('orders.orderId');

  if(load) {
    res.json(load)
  } else {
    res.status(404)
    throw new Error('Resource not found')
  }
})

// @Desc Create new load
// @ route POST /api/loads
// @access User/admin
const createLoad = asyncHandler(async (req, res) => {

  const {  
    loadNumber,
    status,
    carrierName,
    pickupDate,
    deliveryDate,
    origin,
    destination,
    transportType,
    orders,
    totalFreightCost,
    totalVolume,
    totalWeight,
    licensePlate,
    driver,
    insurance,
    storageAndTransportConditions,
    specialNotes,
    user
  } = req.body;

  console.log('req:', req);

  const load = new Load({
    loadNumber,
    status,
    carrierName,
    pickupDate,
    deliveryDate,
    origin: {
      ...origin
    },
    destination: {
      ...destination
    },
    transportType,
    orders: orders.map(order => ({
      orderNumber: order.orderNumber,
      packages: order.packages
    })),
    totalFreightCost,
    totalVolume,
    totalWeight,
    licensePlate,
    driver,
    insurance,
    storageAndTransportConditions,
    specialNotes,
    user: req.user._id,
  })

  const createdLoad = await load.save();

  res.status(201).json(createdLoad)
})

// @Desc get carriers loads ***CHECK***
// @ route PATCH /api/loads/:id
// @access User/carrier
const updateLoadStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const load = await Load.findById(id);

    if (!load) {
      return res.status(404).json({ message: 'Load not found' });
    }

    load.status = status;
    await load.save();

    res.status(200).json({ message: 'Load status updated', load });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// @Desc Delete/Cancel load
// @ route DELETE /api/loads/:id
// @access Private
const cancelOrDeleteLoad = asyncHandler(async (req, res) => {
  const load = await Load.findById(req.params.id);

  if (!load) {
    res.status(404);
    throw new Error('Load not found');
  }

  if (load.status === "delivered" || load.status === "collected") {
    load.status = "cancelled";
    await load.save();
    res.status(200).json({ message: 'Load cancelled successfully', load });
  } else if (load.status === "confirmed" || load.status === "open") {
    await Load.deleteOne({ _id: load._id });
    res.status(200).json({ message: 'Load deleted successfully' });
  } else {
    res.status(400);
    throw new Error('Invalid load status for cancellation or deletion');
  }
});


export {getLoadsById, getLoads, createLoad, updateLoadStatus, cancelOrDeleteLoad}