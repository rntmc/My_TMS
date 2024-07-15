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
    orderId,
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
    orderId,
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

export {getOrderById, getOrders, createOrder, getMyOrders, updateOrderStatus, cancelOrDeleteOrder}