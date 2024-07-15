import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js'

// @Desc Fetch all orders
// @ route GET /api/orders
// @access Public
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
  res.json(orders)
})

// @Desc Fetch a load
// @ route GET /api/loads/:id
// @access Public
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

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
    orderNumber,
    status,
    pickupDate,
    deliveryDate,
    origin,
    destination,
    volume,
    weight,
    freightCost,
    productId,
    productQuantity,
    packageQty,
    length, 
    width, 
    height,
    dangerousGoods,
  } = req.body;

  const order = new Order({
    orderNumber,
    packageQty,
    length,
    width,
    height,
    volume,
    weight,
    pickupDate,
    deliveryDate,
    origin: {
      ...origin
    },
    destination: {
      ...destination
    },
    freightCost,
    productId,
    productQuantity,
    dangerousGoods,
    status,
    user: req.user._id,
  })

  const createdOrder = await order.save();

  res.status(201).json(createdOrder)
})

// @Desc get carriers orders ***CHECK***
// @ route POST /api/myorders
// @access User/carrier
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id});
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
  const order = await Order.findById(req.params.id);

  if (order) {

    order.orderNumber = req.body.orderNumber || order.orderNumber;
    order.status = req.body.status || order.status;
    order.pickupDate = req.body.pickupDate || order.pickupDate;
    order.deliveryDate = req.body.deliveryDate || order.deliveryDate;
    order.origin.entityNumber = req.body.origin.entityNumber || order.origin.entityNumber;
    order.origin.entityName = req.body.origin.entityName || order.origin.entityName;
    order.origin.entityLocation.address = req.body.origin?.entityLocation?.address || order.origin.entityLocation.address;
    order.origin.entityLocation.city = req.body.origin?.entityLocation?.city || order.origin.entityLocation.city;
    order.origin.entityLocation.state = req.body.origin?.entityLocation?.state || order.origin.entityLocation.state;
    order.origin.entityLocation.postcode = req.body.origin?.entityLocation?.postcode || order.origin.entityLocation.postcode;
    order.origin.entityLocation.country = req.body.origin?.entityLocation?.country || order.origin.entityLocation.country;
    order.destination.entityNumber = req.body.destination.entityNumber || order.destination.entityNumber;
    order.destination.entityName = req.body.destination.entityName || order.destination.entityName;
    order.destination.entityLocation.address = req.body.destination?.entityLocation?.address || order.destination.entityLocation.address;
    order.destination.entityLocation.city = req.body.destination?.entityLocation?.city || order.destination.entityLocation.city;
    order.destination.entityLocation.state = req.body.destination?.entityLocation?.state || order.destination.entityLocation.state;
    order.destination.entityLocation.postcode = req.body.destination?.entityLocation?.postcode || order.destination.entityLocation.postcode;
    order.destination.entityLocation.country = req.body.destination?.entityLocation?.country || order.destination.entityLocation.country;
    order.productId = req.body.productId || order.productId;
    order.productQuantity = req.body.productQuantity || order.productQuantity;
    order.packageQty = req.body.packageQty || order.packageQty;
    order.length = req.body.length || order.length;
    order.width = req.body.width || order.width;
    order.height = req.body.height || order.height;
    order.weight = req.body.weight || order.weight;
    order.volume = req.body.volume || order.volume;
    order.freightCost = req.body.freightCost || order.freightCost;
    order.dangerousGoods = req.body.dangerousGoods !== undefined ? req.body.dangerousGoods : order.dangerousGoods;

    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

export {getOrderById, getOrders, createOrder, getMyOrders, updateOrderStatus, cancelOrDeleteOrder, updateOrder}