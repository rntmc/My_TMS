import  mongoose from 'mongoose'
import asyncHandler from '../middleware/asyncHandler.js';
import Load from '../models/loadModel.js'
import Order from '../models/orderModel.js';

const getOrderIdsByNumbers = async (orderNumbers) => {
  const orders = await Order.find({})
  return orders.map(order => order._id);
};

// @Desc Fetch all loads
// @ route GET /api/loads
// @access Public
const getLoads = asyncHandler(async (req, res) => {
  const loads = await Load.find({}).populate('orders')
  res.json(loads)
})

// @Desc Fetch a load
// @ route GET /api/loads/:id
// @access Public
const getLoadsById = asyncHandler(async (req, res) => {
  const load = await Load.findById(req.params.id).populate('orders');

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

  // Valida se orders é uma lista
  if (!Array.isArray(orders) || orders.length === 0) {
    return res.status(400).json({ message: 'Orders must be an array with at least one order.' });
  }

   // Extrai os números das ordens e obtém os IDs das ordens correspondentes
   const orderNumbers = orders.map(order => order.orderNumber);

   // Função auxiliar para obter IDs das ordens
   const getOrderIdsByNumbers = async (numbers) => {
     const orders = await Order.find({ orderNumber: { $in: numbers } });
     if (orders.length === 0) {
       throw new Error('No orders found for the given order numbers.');
     }
     return orders.map(order => order._id);
   };
 
   let orderIds;
   try {
     orderIds = await getOrderIdsByNumbers(orderNumbers);
   } catch (error) {
     return res.status(404).json({ message: error.message });
   }
 
   // Cria a nova carga com as ordens associadas
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
     orders: orderIds, // Inclui apenas os IDs das ordens selecionadas
     totalFreightCost,
     totalVolume,
     totalWeight,
     licensePlate,
     driver,
     insurance,
     storageAndTransportConditions,
     specialNotes,
     user: req.user._id,
   });
 
   // Salva a nova carga
   const createdLoad = await load.save();
 
   // Popula as ordens na carga criada
   const populatedLoad = await Load.findById(createdLoad._id)
     .populate({
       path: 'orders',
       select: 'orderNumber packages freightCost' // Seleciona os campos que deseja retornar
     })
     .exec();
 
   // Retorna a carga criada com ordens populadas
   res.status(201).json(populatedLoad);
 });

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

// @Desc update load
// @ route PUT /api/loads/:id
// @access Private/Admin
const updateLoad = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const load = await Load.findById(id);

    if (!load) {
      return res.status(404).json({ message: 'Load not found' });
    }

    // Update load fields
    load.loadNumber = req.body.loadNumber || load.loadNumber;
    load.pickupDate = req.body.pickupDate || load.pickupDate;
    load.deliveryDate = req.body.deliveryDate || load.deliveryDate;
    load.origin = { ...load.origin, ...req.body.origin };
    load.destination = { ...load.destination, ...req.body.destination };
    load.carrierName = req.body.carrierName || load.carrierName;
    load.transportType = req.body.transportType || load.transportType;
    load.totalFreightCost = req.body.totalFreightCost || load.totalFreightCost;
    load.totalVolume = req.body.totalVolume || load.totalVolume;
    load.totalWeight = req.body.totalWeight || load.totalWeight;
    load.licensePlate = req.body.licensePlate || load.licensePlate;
    load.driver = req.body.driver || load.driver;
    load.insurance = req.body.insurance || load.insurance;
    load.storageAndTransportConditions = req.body.storageAndTransportConditions || load.storageAndTransportConditions;
    load.specialNotes = req.body.specialNotes || load.specialNotes;
    load.status = req.body.status || load.status;

    // Update orders
    if (req.body.orders) {
      load.orders = req.body.orders.map(order => ({
        _id: order._id || mongoose.Types.ObjectId(),
        orderNumber: order.orderNumber,
        packages: order.packages.map(pkg => ({
          _id: pkg._id || mongoose.Types.ObjectId(),
          packageQty: pkg.packageQty,
          length: pkg.length,
          width: pkg.width,
          height: pkg.height,
          volume: pkg.volume,
          weight: pkg.weight,
        })),
        freightCost: order.freightCost,
      }));
    }

    // Save updated load to database
    const updatedLoad = await load.save();

    res.status(200).json(updatedLoad);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


export {getLoadsById, getLoads, createLoad, updateLoadStatus, cancelOrDeleteLoad, updateLoad}