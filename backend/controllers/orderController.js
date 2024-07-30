import  mongoose from 'mongoose'
import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js'
import Entity from '../models/entityModel.js';
import getNextOrderNumber from '../utils/getNextOrderNumber.js';

// @Desc Fetch all orders
// @ route GET /api/orders
// @access Public
const getOrders = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword ;

  let query = {};

      // If the user is not an admin, restrict the query to their orders
  if (req.user.role !== 'Admin') {
    query.user = req.user._id;
  }
    
  if (keyword) {
    if (!isNaN(keyword)) {
      query = { orderNumber: Number(keyword) };
    } else {
      query = { orderNumber: { $regex: keyword, $options: 'i' } };
    }
  }

  const orders = await Order.find(query)
    .populate('packages')
    .populate('loads');
  res.json(orders);
});

// @Desc Fetch a load
// @ route GET /api/loads/:id
// @access Public
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('packages')
    .populate('loads');

  if(order) {
    res.json(order)
  } else {
    res.status(404)
    throw new Error('Resource not found')
  }
})

// @Desc Create new order
// @ route POST /api/orders
// @access User/admin
const createOrder = asyncHandler(async (req, res) => {

  const {  
    status,
    pickupDate,
    deliveryDate,
    origin,
    destination,
    products,
    packages,
    freightCost,
    dangerousGoods,
    document,
    loads,
  } = req.body;

  const orderNumber = await getNextOrderNumber();

  // Validate origin and destination
  const originEntity = await Entity.findOne({ entityNumber: origin.entityNumber });
  const destinationEntity = await Entity.findOne({ entityNumber: destination.entityNumber });

  if (!originEntity || !destinationEntity) {
    res.status(400);
    throw new Error('Both origin and destination entities must be valid and already registered in the database.');
  }
  
  const order = new Order({
    orderNumber,
    status,
    pickupDate,
    deliveryDate,
    origin: {
      ...origin
    },
    destination: {
      ...destination
    },
    products,
    packages,
    freightCost,
    dangerousGoods,
    document,
    user: req.user._id,
    loads,
    trackingInfo: [{
      action: 'created',
      user: req.user._id 
    }]
  })

  if (document && document.length > 8) {
    res.status(400);
    throw new Error('You can only upload up to 8 files per order');
  }

  const createdOrder = await order.save();

  res.status(201).json(createdOrder)
})

// @Desc get carriers orders ***CHECK***
// @ route POST /api/myorders
// @access User/carrier
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id}) //orders linked to the user
    .populate('loads');

  res.status(200).json(orders)
})

// @Desc get carriers orders ***CHECK***
// @ route PATCH /api/orders/:id
// @access User/carrier
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = await Order.findById(id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (status === "confirmed" || status === "open") {
    order.status = status;
    order.trackingInfo.push({
      action: 'status_updated',
      user: req.user._id 
    });
    await order.save();
    res.status(200).json({ message: 'Order status updated', order });
  } else {
    res.status(400).json({ message: 'Invalid status' });
  }
});

// @Desc Delete/Cancel order
// @ route DELETE /api/orders/:id
// @access Private
const cancelOrDeleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.status === "delivered" || order.status === "collected") {
    order.status = "cancelled";
    order.trackingInfo.push({
      action: 'cancelled',
      user: req.user._id 
    });
    await order.save();
    res.status(200).json({ message: 'Order cancelled successfully', order });
  } else if (order.status === "confirmed" || order.status === "open") {
    await Order.deleteOne({ _id: order._id });
    res.status(200).json({ message: 'Order deleted successfully' });
  } else {
    res.status(400);
    throw new Error('Invalid order status for cancellation or deletion');
  }
});

// @Desc update order
// @ route PUT /api/orders/:id
// @access Private/Admin
const updateOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.id;

  // Verifica se o ID é válido
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({ message: 'Invalid Order ID' });
  }

  const order = await Order.findById(orderId);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  // Atualiza os campos da ordem com os dados do corpo da requisição
  if (req.body.orderNumber) order.orderNumber = req.body.orderNumber;
  if (req.body.status) order.status = req.body.status;
  if (req.body.pickupDate) order.pickupDate = req.body.pickupDate;
  if (req.body.deliveryDate) order.deliveryDate = req.body.deliveryDate;
  if (req.body.origin) order.origin = { ...order.origin, ...req.body.origin };
  if (req.body.destination) order.destination = { ...order.destination, ...req.body.destination };
  if (req.body.products) {
    order.products = req.body.products.map(product => ({
      productId: product.productId || '',
      productQuantity: typeof product.productQuantity !== 'undefined' ? product.productQuantity : 0,
    }));
  }
  if (req.body.packages) {
    order.packages = req.body.packages.map(pkg => ({
      packageQty: typeof pkg.packageQty !== 'undefined' ? pkg.packageQty : 0,
      length: typeof pkg.length !== 'undefined' ? pkg.length : 0,
      width: typeof pkg.width !== 'undefined' ? pkg.width : 0,
      height: typeof pkg.height !== 'undefined' ? pkg.height : 0,
      volume: typeof pkg.volume !== 'undefined' ? pkg.volume : 0,
      weight: typeof pkg.weight !== 'undefined' ? pkg.weight : 0,
    }));
  }
  if (req.body.freightCost) order.freightCost = req.body.freightCost;
  if (req.body.dangerousGoods !== undefined) order.dangerousGoods = req.body.dangerousGoods;
  if (req.body.document) order.document = req.body.document;
  if (req.body.loads) order.loads = req.body.loads;

  if (order.document && order.document.length > 8) {
    res.status(400);
    throw new Error('You can only upload up to 8 files per order');
  }

  order.trackingInfo.push({
    action: 'updated',
    user: req.user._id
  });
  
  // Salva a ordem atualizada no banco de dados
  const updatedOrder = await order.save();

  // Responde com a ordem atualizada
  res.status(200).json(updatedOrder);
});


export {getOrderById, getOrders, createOrder, getMyOrders, updateOrderStatus, cancelOrDeleteOrder, updateOrder}