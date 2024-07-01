const Order = require('./orderModel');

let currentOrderId = 1000; // Starting orderId

async function generateOrderId() {
  return currentOrderId++;
}

async function createOrder(orderData) {
  const orderId = await generateOrderId();
  const newOrder = new Order({
    ...orderData,
    orderId: orderId // Assign generated orderId here
  });

  try {
    const savedOrder = await newOrder.save();
    console.log('Order saved successfully. Order ID:', savedOrder.orderId);
    return savedOrder;
  } catch (error) {
    console.error('Error saving order:', error);
    throw error;
  }
}

const orderData = {
  pickupDate: new Date(),
  deliveryDate: new Date(),
  origin: 'Warehouse A',
  destination: 'Customer B',
  volume: 10,
  weight: 100,
  productId: 'P123',
  productQuantity: 5,
  dangerousGoods: false
};

createOrder(orderData);