import mongoose from "mongoose";
import addressSchema from './addressModel.js';

const orderSchema = new mongoose.Schema({
  orderId: {
    type: Number,
    unique: true,
    required: true,
  },
  pickupDate: {
    type: Date,
    required: true
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  origin: addressSchema,
  destination: addressSchema,
  volume: {
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  freightCost: {
    type: Number,
    required: true
  },
  productId: {
    type: String,
    required: true
  },
  productQuantity: {
    type: Number,
    required: true
  },
  dangerousGoods: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Optional, if you want to track which user created or manages the order
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

const Order = mongoose.model("Order", orderSchema)

export default Order;