import  mongoose from 'mongoose'
import asyncHandler from '../middleware/asyncHandler.js';
import Load from '../models/loadModel.js'
import Order from '../models/orderModel.js';
import getNextLoadNumber from '../utils/getNextLoadNumber.js';

// @Desc Fetch all loads
// @ route GET /api/loads
// @access Public
const getLoads = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword;

  let query = {};
  if (keyword) {
    if (!isNaN(keyword)) {
      const orders = await Order.find({ orderNumber: Number(keyword) }).select('_id');
      const orderIds = orders.map(order => order._id);
      query = {
        $or: [
          { loadNumber: Number(keyword) },
          { 'orders': { $in: orderIds } }
        ]
      };
    } else {
      const orders = await Order.find({ orderNumber: { $regex: keyword, $options: 'i' } }).select('_id');
      const orderIds = orders.map(order => order._id);
      query = {
        $or: [
          { loadNumber: { $regex: keyword, $options: 'i' } },
          { 'orders': { $in: orderIds } }
        ]
      };
    }
  }

  const loads = await Load.find(query).populate('orders')
  res.json(loads)
})

// @Desc get carriers loads ***CHECK***
// @ route POST /api/myloads
// @access User/carrier
const getMyLoads = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword;

  // Fetch user's orders
  let userOrdersQuery = { user: req.user._id };

  if (keyword) {
    if (!isNaN(keyword)) {
      userOrdersQuery = {
        $and: [
          { user: req.user._id },
          { orderNumber: Number(keyword) }
        ]
      };
    } else {
      try {
        // Attempt to convert the keyword to an ObjectId
        const objectId = new mongoose.Types.ObjectId(keyword);
        userOrdersQuery = {
          $and: [
            { user: req.user._id },
            {
              $or: [
                { orderNumber: { $regex: keyword, $options: 'i' } },
                { _id: objectId }
              ]
            }
          ]
        };
      } catch (error) {
        // Keyword is a string but not a valid ObjectId
        userOrdersQuery = {
          $and: [
            { user: req.user._id },
            { orderNumber: { $regex: keyword, $options: 'i' } }
          ]
        };
      }
    }
  }

  const userOrders = await Order.find(userOrdersQuery).select('_id');
  const userOrderIds = userOrders.map(order => order._id);

  // Fetch loads containing the user's orders
  const loads = await Load.find({ 'orders': { $in: userOrderIds } }).populate({
    path: 'orders',
    populate: {
      path: 'packages',
      select: 'packageQty length width height volume weight'
    }
  });

  res.status(200).json(loads);
});

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
  if (!Array.isArray(orders)) {
    return res.status(400).json({ message: 'Orders must be an array.' });
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
 
   let orderObjs;
   try {
    orderObjs = await getOrderIdsByNumbers(orderNumbers);
   } catch (error) {
     return res.status(404).json({ message: error.message });
   }
 
   const loadNumber = await getNextLoadNumber();
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
    orders: orderObjs, // Inclui apenas os IDs das ordens selecionadas
    totalFreightCost,
    totalVolume,
    totalWeight,
    licensePlate,
    driver,
    insurance,
    storageAndTransportConditions,
    specialNotes,
    trackingInfo: [{
      action: 'created',
      user: req.user._id // Assuming the user is authenticated and you have middleware to handle this
    }],
    user: req.user._id,
   });
 
   // Salva a nova carga
   const createdLoad = await load.save();

   // Atualiza as ordens para adicionar o ID da carga
  await Order.updateMany(
    { _id: { $in: orderObjs } },
    { $addToSet: { loads: createdLoad._id } }
  );
 
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
    load.trackingInfo.push({
      action: 'status_updated',
      user: req.user._id // Assuming the user is authenticated and you have middleware to handle this
    });
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
    load.trackingInfo.push({
      action: 'cancelled',
      user: req.user._id // Assuming the user is authenticated and you have middleware to handle this
    });
    await load.save();

    // Atualizar ordens associadas para remover o ID da carga
    await Order.updateMany(
      { _id: { $in: load.orders } },
      { $pull: { loads: load._id } }
    );

    res.status(200).json({ message: 'Load cancelled successfully', load });
  } else if (load.status === "confirmed" || load.status === "open") {
    // Excluir a carga
    await Order.updateMany(
      { _id: { $in: load.orders } },
      { $pull: { loads: load._id } }
    );
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

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Load ID' });
  }

  try {
    const load = await Load.findById(id);

    if (!load) {
      return res.status(404).json({ message: 'Load not found' });
    }

    const {
      loadNumber,
      pickupDate,
      deliveryDate,
      origin,
      destination,
      carrierName,
      transportType,
      totalFreightCost,
      totalVolume,
      totalWeight,
      licensePlate,
      driver,
      insurance,
      storageAndTransportConditions,
      specialNotes,
      status,
      document,
      trackingInfo,
      orders // Números das ordens
    } = req.body;

    load.loadNumber = loadNumber || load.loadNumber;
    load.pickupDate = pickupDate || load.pickupDate;
    load.deliveryDate = deliveryDate || load.deliveryDate;
    load.origin = { ...load.origin, ...origin };
    load.destination = { ...load.destination, ...destination };
    load.carrierName = carrierName || load.carrierName;
    load.transportType = transportType || load.transportType;
    load.totalFreightCost = totalFreightCost || load.totalFreightCost;
    load.totalVolume = totalVolume || load.totalVolume;
    load.totalWeight = totalWeight || load.totalWeight;
    load.licensePlate = licensePlate || load.licensePlate;
    load.driver = driver || load.driver;
    load.insurance = insurance || load.insurance;
    load.storageAndTransportConditions = storageAndTransportConditions || load.storageAndTransportConditions;
    load.specialNotes = specialNotes || load.specialNotes;
    load.status = status || load.status;
    load.document = document || load.document;
    load.trackingInfo = trackingInfo || load.trackingInfo;

    if (orders && orders.length > 0) {
      const orderNumbers = orders.map(order => order);
      const validOrders = await Order.find({ orderNumber: { $in: orderNumbers } }).select('_id');
      // Atualiza a lista de ordens na carga
      if (validOrders.length > 0) {
        // Remove associações antigas
        await Order.updateMany(
          { _id: { $in: load.orders } },
          { $pull: { loads: load._id } }
        );

        // Atualiza a lista de ordens na carga
        load.orders = validOrders.map(order => order._id);
        await Order.updateMany(
          { _id: { $in: validOrders.map(order => order._id) } },
          { $addToSet: { loads: load._id } }
        );
      } else {
        load.orders = []; // Limpa as ordens se o array estiver vazio
      }
    } else {
      load.orders = []; // Limpa as ordens se o array estiver vazio
    }

    load.trackingInfo.push({
      action: 'updated',
      user: req.user._id
    });

    const updatedLoad = await load.save();

    const populatedLoad = await Load.findById(updatedLoad._id)
      .populate({
        path: 'orders',
        select: 'orderNumber packages freightCost',
        populate: {
          path: 'packages._id',
          select: 'packageQty length width height volume weight'
        }
      })
      .exec();

    res.status(200).json(populatedLoad);
  } catch (error) {
    console.error('Error updating load:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

export {getLoadsById, getLoads, createLoad, updateLoadStatus, cancelOrDeleteLoad, updateLoad, getMyLoads}