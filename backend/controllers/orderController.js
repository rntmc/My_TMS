import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js'

// @Desc Fetch all orders
// @ route GET /api/orders
// @access Public
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('packages');
  res.json(orders)
})

// @Desc Fetch a load
// @ route GET /api/loads/:id
// @access Public
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('packages');

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
    products,
    packages,
    freightCost,
    dangerousGoods,
  } = req.body;

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
  const order = await Order.findById(req.params.id)

  if (order) {
    console.log('Found order:', order);
    // Atualiza os campos da ordem com os dados do corpo da requisição
    order.orderNumber = req.body.orderNumber || order.orderNumber;
    order.status = req.body.status || order.status;
    order.pickupDate = req.body.pickupDate || order.pickupDate;
    order.deliveryDate = req.body.deliveryDate || order.deliveryDate;
    order.origin = { ...order.origin, ...req.body.origin };
    order.destination = { ...order.destination, ...req.body.destination };
    order.products = req.body.products || order.products;
    order.packages = req.body.packages || order.packages;
    order.freightCost = req.body.freightCost || order.freightCost;
    order.dangerousGoods = req.body.dangerousGoods !== undefined ? req.body.dangerousGoods : order.dangerousGoods;

    // Salva a ordem atualizada no banco de dados
    const updatedOrder = await order.save();

    // Responde com a ordem atualizada
    res.status(200).json(updatedOrder);
  } else {
    // Se a ordem não foi encontrada, retorna um erro 404
    res.status(404).json({ message: 'Order not found' });
  }
});

export {getOrderById, getOrders, createOrder, getMyOrders, updateOrderStatus, cancelOrDeleteOrder, updateOrder}